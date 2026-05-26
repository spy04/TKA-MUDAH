import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type DashboardFavoriteTopic = {
  title: string;
  slug: string;
  category: string;
  accessLevel: "PREVIEW" | "ENROLLED";
  progressWidth: string;
  materialCount: number;
  exerciseCount: number;
};

export type DashboardTopic = {
  title: string;
  slug: string;
  category: string;
  accessLevel: "PREVIEW" | "ENROLLED";
  materialCount: number;
  exerciseCount: number;
};

type DashboardFeature = {
  title: string;
  description: string;
  accessLevel: "PREVIEW" | "ENROLLED";
  kind: "material" | "exercise";
  materialType?: "VIDEO" | "PDF" | "SLIDE" | "DOCUMENT";
  questionCount?: number | null;
  href: string;
};

export type StudentDashboardData = {
  stats: {
    materialCount: number;
    exerciseCount: number;
    categoryCount: number;
    topicCount: number;
  };
  favoriteTopics: DashboardFavoriteTopic[];
  topics: DashboardTopic[];
  features: DashboardFeature[];
};

const fallbackData: StudentDashboardData = {
  stats: {
    materialCount: 0,
    exerciseCount: 0,
    categoryCount: 0,
    topicCount: 0,
  },
  favoriteTopics: [],
  topics: [],
  features: [],
};

type TopicRow = {
  slug: string;
  title: string;
  category: string;
  previewMode: "PREVIEW" | "ENROLLED";
  materialCount: bigint | number;
  exerciseCount: bigint | number;
};

type CategoryRow = {
  category: string;
  accessLevel: "PREVIEW" | "ENROLLED";
  materialCount: bigint | number;
  exerciseCount: bigint | number;
};

type MaterialFeatureRow = {
  title: string;
  description: string | null;
  accessLevel: "PREVIEW" | "ENROLLED";
  type: "VIDEO" | "PDF" | "SLIDE" | "DOCUMENT";
  fileUrl: string | null;
  createdAt: Date;
};

type ExerciseFeatureRow = {
  title: string;
  accessLevel: "PREVIEW" | "ENROLLED";
  questionCount: bigint | number | null;
  createdAt: Date;
};

type TopicApiRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  previewMode: "PREVIEW" | "ENROLLED";
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
};

type MaterialApiRow = {
  id: string;
  title: string;
  description: string | null;
  status: "DRAFT" | "PUBLISHED";
  accessLevel: "PREVIEW" | "ENROLLED";
  type: "VIDEO" | "PDF" | "SLIDE" | "DOCUMENT";
  fileUrl: string | null;
  topicId: string;
  createdAt: string;
};

type ExerciseApiRow = {
  id: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  accessLevel: "PREVIEW" | "ENROLLED";
  questionCount: number | null;
  topicId: string;
  createdAt: string;
};

type CountRow = {
  count: bigint | number;
};

function toNumber(value: bigint | number | null | undefined) {
  if (typeof value === "bigint") {
    return Number(value);
  }

  return value ?? 0;
}

function toProgressWidth(value: number, maxValue: number) {
  if (maxValue <= 0) {
    return "42%";
  }

  const width = Math.round((value / maxValue) * 100);
  return `${Math.min(Math.max(width, 28), 92)}%`;
}

function summarizeMaterialType(type: DashboardFeature["materialType"]) {
  switch (type) {
    case "VIDEO":
      return "Video pembelajaran siap dipelajari.";
    case "PDF":
      return "Materi PDF siap dibuka dan dibaca.";
    case "SLIDE":
      return "Materi slide siap dipelajari dengan ringkas.";
    case "DOCUMENT":
      return "Dokumen materi siap dibaca lebih lanjut.";
    default:
      return "Materi siap dipelajari.";
  }
}

function summarizeExercise(questionCount?: number | null) {
  if (!questionCount || questionCount <= 0) {
    return "Latihan sudah tersedia dan siap dikerjakan.";
  }

  return `${questionCount} soal siap dikerjakan untuk evaluasi belajar.`;
}

function buildDashboardDataFromCollections(args: {
  topics: TopicApiRow[];
  materials: MaterialApiRow[];
  exercises: ExerciseApiRow[];
}): StudentDashboardData {
  const { topics, materials, exercises } = args;

  if (topics.length === 0) {
    return fallbackData;
  }

  const publishedTopicIds = new Set(topics.map((topic) => topic.id));

  const publishedMaterials = materials.filter(
    (material) => material.status === "PUBLISHED" && publishedTopicIds.has(material.topicId),
  );
  const publishedExercises = exercises.filter(
    (exercise) => exercise.status === "PUBLISHED" && publishedTopicIds.has(exercise.topicId),
  );

  const topicSummary = topics.map((topic) => {
    const topicMaterials = publishedMaterials.filter((material) => material.topicId === topic.id);
    const topicExercises = publishedExercises.filter((exercise) => exercise.topicId === topic.id);

    return {
      title: topic.title,
      slug: topic.slug,
      category: topic.category,
      accessLevel: topic.previewMode,
      materialCount: topicMaterials.length,
      exerciseCount: topicExercises.length,
      updatedAt: new Date(topic.updatedAt).getTime(),
    };
  });

  const categoryCount = new Set(topics.map((topic) => topic.category)).size;
  const maxTopicLoad = Math.max(
    ...topicSummary.map((item) => item.materialCount + item.exerciseCount),
    1,
  );

  const favoriteTopics = [...topicSummary]
    .sort(
      (a, b) =>
        b.materialCount + b.exerciseCount - (a.materialCount + a.exerciseCount) ||
        b.updatedAt - a.updatedAt,
    )
    .slice(0, 2)
    .map((topic) => ({
    title: topic.title,
    slug: topic.slug,
    category: topic.category,
    accessLevel: topic.accessLevel,
    progressWidth: toProgressWidth(
      topic.materialCount + topic.exerciseCount,
      maxTopicLoad,
    ),
    materialCount: topic.materialCount,
    exerciseCount: topic.exerciseCount,
  }));

  const features: DashboardFeature[] = [
    ...publishedMaterials.map((material) => ({
      title: material.title,
      description: material.description?.trim() || summarizeMaterialType(material.type),
      accessLevel: material.accessLevel,
      kind: "material" as const,
      materialType: material.type,
      href: material.fileUrl || "#materi",
      createdAt: new Date(material.createdAt).getTime(),
    })),
    ...publishedExercises.map((exercise) => ({
      title: exercise.title,
      description: summarizeExercise(exercise.questionCount),
      accessLevel: exercise.accessLevel,
      kind: "exercise" as const,
      questionCount: exercise.questionCount,
      href: "#simulasi",
      createdAt: new Date(exercise.createdAt).getTime(),
    })),
  ]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6)
    .map(({ createdAt, ...feature }) => {
      void createdAt;
      return feature;
    });

  return {
      stats: {
        materialCount: publishedMaterials.length,
        exerciseCount: publishedExercises.length,
      categoryCount,
      topicCount: topics.length,
    },
    favoriteTopics,
    topics: topicSummary
      .sort(
        (a, b) =>
          b.updatedAt - a.updatedAt ||
          b.materialCount + b.exerciseCount - (a.materialCount + a.exerciseCount),
      )
      .map(({ updatedAt, ...topic }) => {
        void updatedAt;
        return topic;
      }),
    features,
  };
}

async function fetchSupabaseRows<T>(table: string, select: string, filters = ""): Promise<T[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!baseUrl || !serviceRoleKey) {
    return [];
  }

  const url = new URL(`/rest/v1/${table}`, baseUrl);
  url.searchParams.set("select", select);

  if (filters) {
    for (const pair of filters.split("&")) {
      const [key, value] = pair.split("=");
      if (key && value) {
        url.searchParams.set(key, value);
      }
    }
  }

  const response = await fetch(url.toString(), {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Supabase fetch failed for ${table}: ${response.status}`);
  }

  return (await response.json()) as T[];
}

function hasSupabaseRestAccess() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function getStudentDashboardDataFromSupabase(): Promise<StudentDashboardData> {
  const [topics, materials, exercises] = await Promise.all([
    fetchSupabaseRows<TopicApiRow>(
      "Topic",
      "id,slug,title,category,previewMode,status,updatedAt",
      "status=eq.PUBLISHED&order=updatedAt.desc",
    ),
    fetchSupabaseRows<MaterialApiRow>(
      "Material",
      "id,title,description,status,accessLevel,type,fileUrl,topicId,createdAt",
      "status=eq.PUBLISHED&order=createdAt.desc",
    ),
    fetchSupabaseRows<ExerciseApiRow>(
      "Exercise",
      "id,title,status,accessLevel,questionCount,topicId,createdAt",
      "status=eq.PUBLISHED&order=createdAt.desc",
    ),
  ]);

  return buildDashboardDataFromCollections({
    topics,
    materials,
    exercises,
  });
}

export async function getStudentDashboardData(): Promise<StudentDashboardData> {
  if (hasSupabaseRestAccess()) {
    try {
      return await getStudentDashboardDataFromSupabase();
    } catch {
      return fallbackData;
    }
  }

  try {
    const [materialCountRows, exerciseCountRows, topicCountRows, topicRows, categoryRows, materialRows, exerciseRows] =
      await Promise.all([
        prisma.$queryRaw<CountRow[]>(Prisma.sql`
          SELECT COUNT(*)::bigint AS "count"
          FROM "Material" m
          INNER JOIN "Topic" t ON t.id = m."topicId"
          WHERE t.status = 'PUBLISHED' AND m.status = 'PUBLISHED'
        `),
        prisma.$queryRaw<CountRow[]>(Prisma.sql`
          SELECT COUNT(*)::bigint AS "count"
          FROM "Exercise" e
          INNER JOIN "Topic" t ON t.id = e."topicId"
          WHERE t.status = 'PUBLISHED' AND e.status = 'PUBLISHED'
        `),
        prisma.$queryRaw<CountRow[]>(Prisma.sql`
          SELECT COUNT(*)::bigint AS "count"
          FROM "Topic"
          WHERE status = 'PUBLISHED'
        `),
        prisma.$queryRaw<TopicRow[]>(Prisma.sql`
          SELECT
            t.slug,
            t.title,
            t.category,
            t."previewMode" AS "previewMode",
            COUNT(DISTINCT m.id)::bigint AS "materialCount",
            COUNT(DISTINCT e.id)::bigint AS "exerciseCount"
          FROM "Topic" t
          LEFT JOIN "Material" m ON m."topicId" = t.id AND m.status = 'PUBLISHED'
          LEFT JOIN "Exercise" e ON e."topicId" = t.id AND e.status = 'PUBLISHED'
          WHERE t.status = 'PUBLISHED'
          GROUP BY t.id, t.slug, t.title, t.category, t."previewMode"
          ORDER BY t."updatedAt" DESC
        `),
        prisma.$queryRaw<CategoryRow[]>(Prisma.sql`
          SELECT
            t.category,
            CASE
              WHEN BOOL_OR(t."previewMode" = 'PREVIEW') THEN 'PREVIEW'
              ELSE 'ENROLLED'
            END AS "accessLevel",
            COUNT(DISTINCT m.id)::bigint AS "materialCount",
            COUNT(DISTINCT e.id)::bigint AS "exerciseCount"
          FROM "Topic" t
          LEFT JOIN "Material" m ON m."topicId" = t.id AND m.status = 'PUBLISHED'
          LEFT JOIN "Exercise" e ON e."topicId" = t.id AND e.status = 'PUBLISHED'
          WHERE t.status = 'PUBLISHED'
          GROUP BY t.category
          ORDER BY COUNT(DISTINCT m.id) + COUNT(DISTINCT e.id) DESC, t.category ASC
          LIMIT 6
        `),
        prisma.$queryRaw<MaterialFeatureRow[]>(Prisma.sql`
          SELECT
            m.title,
            m.description,
            m."accessLevel" AS "accessLevel",
            m.type,
            m."fileUrl" AS "fileUrl",
            m."createdAt" AS "createdAt"
          FROM "Material" m
          INNER JOIN "Topic" t ON t.id = m."topicId"
          WHERE t.status = 'PUBLISHED' AND m.status = 'PUBLISHED'
          ORDER BY m."createdAt" DESC
          LIMIT 6
        `),
        prisma.$queryRaw<ExerciseFeatureRow[]>(Prisma.sql`
          SELECT
            e.title,
            e."accessLevel" AS "accessLevel",
            e."questionCount" AS "questionCount",
            e."createdAt" AS "createdAt"
          FROM "Exercise" e
          INNER JOIN "Topic" t ON t.id = e."topicId"
          WHERE t.status = 'PUBLISHED' AND e.status = 'PUBLISHED'
          ORDER BY e."createdAt" DESC
          LIMIT 6
        `),
      ]);

    const topicCount = toNumber(topicCountRows[0]?.count);
    const materialCount = toNumber(materialCountRows[0]?.count);
    const exerciseCount = toNumber(exerciseCountRows[0]?.count);

    if (topicCount === 0) {
      return fallbackData;
    }

    const topics = topicRows.map((topic) => ({
      title: topic.title,
      slug: topic.slug,
      category: topic.category,
      accessLevel: topic.previewMode,
      materialCount: toNumber(topic.materialCount),
      exerciseCount: toNumber(topic.exerciseCount),
    }));

    const maxTopicLoad = Math.max(
      ...topics.map((topic) => topic.materialCount + topic.exerciseCount),
      1,
    );
    const favoriteTopics = [...topics]
      .sort(
        (a, b) =>
          b.materialCount + b.exerciseCount - (a.materialCount + a.exerciseCount) ||
          a.title.localeCompare(b.title),
      )
      .slice(0, 2)
      .map((topic) => ({
        ...topic,
        progressWidth: toProgressWidth(topic.materialCount + topic.exerciseCount, maxTopicLoad),
      }));

    const features: DashboardFeature[] = [
      ...materialRows.map((material) => ({
        title: material.title,
        description: material.description?.trim() || summarizeMaterialType(material.type),
        accessLevel: material.accessLevel,
        kind: "material" as const,
        materialType: material.type,
        href: material.fileUrl || "#materi",
        createdAt: material.createdAt,
      })),
      ...exerciseRows.map((exercise) => ({
        title: exercise.title,
        description: summarizeExercise(toNumber(exercise.questionCount)),
        accessLevel: exercise.accessLevel,
        kind: "exercise" as const,
        questionCount: toNumber(exercise.questionCount),
        href: "#simulasi",
        createdAt: exercise.createdAt,
      })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 6)
      .map((feature) => {
        const { createdAt, ...rest } = feature;
        void createdAt;
        return rest;
      });

    return {
      stats: {
        materialCount,
        exerciseCount,
        categoryCount: categoryRows.length,
        topicCount,
      },
      favoriteTopics,
      topics,
      features,
    };
  } catch {
    try {
      return await getStudentDashboardDataFromSupabase();
    } catch {
      return fallbackData;
    }
  }
}
