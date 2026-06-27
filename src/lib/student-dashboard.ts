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

export type DashboardFeature = {
  title: string;
  description: string;
  accessLevel: "PREVIEW" | "ENROLLED";
  kind: "material" | "exercise";
  materialType?: "VIDEO" | "PDF" | "SLIDE" | "DOCUMENT";
  questionCount?: number | null;
  href: string;
};

export type DashboardRecentActivity = {
  id: string;
  title: string;
  meta: string;
  happenedAt: string;
  accent: "blue" | "green" | "amber";
  href: string;
};

export type StudentDashboardData = {
  stats: {
    materialCount: number;
    exerciseCount: number;
    categoryCount: number;
    topicCount: number;
    averageScore: number | null;
    attemptCount: number;
  };
  favoriteTopics: DashboardFavoriteTopic[];
  topics: DashboardTopic[];
  features: DashboardFeature[];
  recentActivities: DashboardRecentActivity[];
};

const fallbackData: StudentDashboardData = {
  stats: {
    materialCount: 0,
    exerciseCount: 0,
    categoryCount: 0,
    topicCount: 0,
    averageScore: null,
    attemptCount: 0,
  },
  favoriteTopics: [],
  topics: [],
  features: [],
  recentActivities: [],
};

type TopicRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  previewMode: "PREVIEW" | "ENROLLED";
  materialCount: bigint | number;
  exerciseCount: bigint | number;
  updatedAt: Date;
};

type MaterialFeatureRow = {
  id: string;
  title: string;
  description: string | null;
  accessLevel: "PREVIEW" | "ENROLLED";
  type: "VIDEO" | "PDF" | "SLIDE" | "DOCUMENT";
  createdAt: Date;
};

type ExerciseFeatureRow = {
  id: string;
  title: string;
  accessLevel: "PREVIEW" | "ENROLLED";
  questionCount: bigint | number | null;
  createdAt: Date;
};

type AttemptRow = {
  id: string;
  score: number;
  maxScore: number;
  submittedAt: Date;
  exerciseId: string;
  exerciseTitle: string;
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

type AttemptApiRow = {
  id: string;
  score: number;
  maxScore: number;
  submittedAt: string;
  exerciseId: string;
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
    return "0%";
  }

  const width = Math.round((value / maxValue) * 100);
  return `${Math.min(Math.max(width, 8), 100)}%`;
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

function buildRecentActivitiesFromAttempts(args: {
  attempts: AttemptApiRow[];
  exercises: ExerciseApiRow[];
}): DashboardRecentActivity[] {
  const exerciseMap = new Map(args.exercises.map((exercise) => [exercise.id, exercise]));

  return args.attempts.slice(0, 5).map((attempt, index) => {
    const exercise = exerciseMap.get(attempt.exerciseId);
    const percentage =
      attempt.maxScore > 0 ? Math.round((attempt.score / attempt.maxScore) * 100) : 0;

    return {
      id: attempt.id,
      title: exercise ? `Menyelesaikan latihan ${exercise.title}` : "Menyelesaikan latihan",
      meta: `Skor ${attempt.score}/${attempt.maxScore} (${percentage}%)`,
      happenedAt: attempt.submittedAt,
      accent: index % 3 === 0 ? "blue" : index % 3 === 1 ? "green" : "amber",
      href: exercise ? `/siswa/latihan/${exercise.id}` : "/siswa/latihan",
    };
  });
}

function buildDashboardDataFromCollections(args: {
  topics: TopicApiRow[];
  materials: MaterialApiRow[];
  exercises: ExerciseApiRow[];
  attempts: AttemptApiRow[];
}): StudentDashboardData {
  const { topics, materials, exercises, attempts } = args;

  if (topics.length === 0) {
    return {
      ...fallbackData,
      recentActivities: buildRecentActivitiesFromAttempts({ attempts, exercises }),
    };
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
    .slice(0, 3)
    .map((topic) => ({
      title: topic.title,
      slug: topic.slug,
      category: topic.category,
      accessLevel: topic.accessLevel,
      progressWidth: toProgressWidth(topic.materialCount + topic.exerciseCount, maxTopicLoad),
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
      href: "/siswa/topik",
      createdAt: new Date(material.createdAt).getTime(),
    })),
    ...publishedExercises.map((exercise) => ({
      title: exercise.title,
      description: summarizeExercise(exercise.questionCount),
      accessLevel: exercise.accessLevel,
      kind: "exercise" as const,
      questionCount: exercise.questionCount,
      href: `/siswa/latihan/${exercise.id}`,
      createdAt: new Date(exercise.createdAt).getTime(),
    })),
  ]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6)
    .map(({ createdAt, ...feature }) => {
      void createdAt;
      return feature;
    });

  const validAttemptPercentages = attempts
    .filter((attempt) => attempt.maxScore > 0)
    .map((attempt) => (attempt.score / attempt.maxScore) * 100);
  const averageScore =
    validAttemptPercentages.length > 0
      ? Math.round(
          validAttemptPercentages.reduce((total, value) => total + value, 0) / validAttemptPercentages.length,
        )
      : null;

  return {
    stats: {
      materialCount: publishedMaterials.length,
      exerciseCount: publishedExercises.length,
      categoryCount,
      topicCount: topics.length,
      averageScore,
      attemptCount: attempts.length,
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
    recentActivities: buildRecentActivitiesFromAttempts({
      attempts,
      exercises: publishedExercises,
    }),
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

async function getStudentDashboardDataFromSupabase(userId: string): Promise<StudentDashboardData> {
  const [topics, materials, exercises, attempts] = await Promise.all([
    fetchSupabaseRows<TopicApiRow>(
      "Topic",
      "id,slug,title,category,previewMode,status,updatedAt",
      "status=eq.PUBLISHED&order=updatedAt.desc",
    ),
    fetchSupabaseRows<MaterialApiRow>(
      "Material",
      "id,title,description,status,accessLevel,type,topicId,createdAt",
      "status=eq.PUBLISHED&order=createdAt.desc",
    ),
    fetchSupabaseRows<ExerciseApiRow>(
      "Exercise",
      "id,title,status,accessLevel,questionCount,topicId,createdAt",
      "status=eq.PUBLISHED&order=createdAt.desc",
    ),
    fetchSupabaseRows<AttemptApiRow>(
      "ExerciseAttempt",
      "id,score,maxScore,submittedAt,exerciseId",
      `userId=eq.${userId}&order=submittedAt.desc`,
    ),
  ]);

  return buildDashboardDataFromCollections({
    topics,
    materials,
    exercises,
    attempts,
  });
}

export async function getStudentDashboardData(userId = ""): Promise<StudentDashboardData> {
  try {
    const [materialCountRows, exerciseCountRows, topicCountRows, topicRows, attemptRows, materialRows, exerciseRows] =
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
            t.id,
            t.slug,
            t.title,
            t.category,
            t."previewMode" AS "previewMode",
            t."updatedAt" AS "updatedAt",
            COUNT(DISTINCT m.id)::bigint AS "materialCount",
            COUNT(DISTINCT e.id)::bigint AS "exerciseCount"
          FROM "Topic" t
          LEFT JOIN "Material" m ON m."topicId" = t.id AND m.status = 'PUBLISHED'
          LEFT JOIN "Exercise" e ON e."topicId" = t.id AND e.status = 'PUBLISHED'
          WHERE t.status = 'PUBLISHED'
          GROUP BY t.id, t.slug, t.title, t.category, t."previewMode", t."updatedAt"
          ORDER BY t."updatedAt" DESC
        `),
        prisma.$queryRaw<AttemptRow[]>(Prisma.sql`
          SELECT
            ea.id,
            ea.score,
            ea."maxScore" AS "maxScore",
            ea."submittedAt" AS "submittedAt",
            ea."exerciseId" AS "exerciseId",
            e.title AS "exerciseTitle"
          FROM "ExerciseAttempt" ea
          INNER JOIN "Exercise" e ON e.id = ea."exerciseId"
          WHERE ea."userId" = ${userId}
          ORDER BY ea."submittedAt" DESC
          LIMIT 5
        `),
        prisma.$queryRaw<MaterialFeatureRow[]>(Prisma.sql`
          SELECT
            m.id,
            m.title,
            m.description,
            m."accessLevel" AS "accessLevel",
            m.type,
            m."createdAt" AS "createdAt"
          FROM "Material" m
          INNER JOIN "Topic" t ON t.id = m."topicId"
          WHERE t.status = 'PUBLISHED' AND m.status = 'PUBLISHED'
          ORDER BY m."createdAt" DESC
          LIMIT 6
        `),
        prisma.$queryRaw<ExerciseFeatureRow[]>(Prisma.sql`
          SELECT
            e.id,
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

    const topics = topicRows.map((topic) => ({
      title: topic.title,
      slug: topic.slug,
      category: topic.category,
      accessLevel: topic.previewMode,
      materialCount: toNumber(topic.materialCount),
      exerciseCount: toNumber(topic.exerciseCount),
      updatedAt: topic.updatedAt.getTime(),
    }));

    const maxTopicLoad = Math.max(
      ...topics.map((topic) => topic.materialCount + topic.exerciseCount),
      1,
    );

    const favoriteTopics = [...topics]
      .sort(
        (a, b) =>
          b.materialCount + b.exerciseCount - (a.materialCount + a.exerciseCount) ||
          b.updatedAt - a.updatedAt,
      )
      .slice(0, 3)
      .map((topic) => ({
        title: topic.title,
        slug: topic.slug,
        category: topic.category,
        accessLevel: topic.accessLevel,
        progressWidth: toProgressWidth(topic.materialCount + topic.exerciseCount, maxTopicLoad),
        materialCount: topic.materialCount,
        exerciseCount: topic.exerciseCount,
      }));

    const features: DashboardFeature[] = [
      ...materialRows.map((material) => ({
        title: material.title,
        description: material.description?.trim() || summarizeMaterialType(material.type),
        accessLevel: material.accessLevel,
        kind: "material" as const,
        materialType: material.type,
        href: "/siswa/topik",
        createdAt: material.createdAt,
      })),
      ...exerciseRows.map((exercise) => ({
        title: exercise.title,
        description: summarizeExercise(toNumber(exercise.questionCount)),
        accessLevel: exercise.accessLevel,
        kind: "exercise" as const,
        questionCount: toNumber(exercise.questionCount),
        href: `/siswa/latihan/${exercise.id}`,
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

    const validAttemptPercentages = attemptRows
      .filter((attempt) => attempt.maxScore > 0)
      .map((attempt) => (attempt.score / attempt.maxScore) * 100);
    const averageScore =
      validAttemptPercentages.length > 0
        ? Math.round(
            validAttemptPercentages.reduce((total, value) => total + value, 0) / validAttemptPercentages.length,
          )
        : null;

    const recentActivities: DashboardRecentActivity[] = attemptRows.map((attempt, index) => ({
      id: attempt.id,
      title: `Menyelesaikan latihan ${attempt.exerciseTitle}`,
      meta:
        attempt.maxScore > 0
          ? `Skor ${attempt.score}/${attempt.maxScore} (${Math.round((attempt.score / attempt.maxScore) * 100)}%)`
          : `Skor ${attempt.score}`,
      happenedAt: attempt.submittedAt.toISOString(),
      accent: index % 3 === 0 ? "blue" : index % 3 === 1 ? "green" : "amber",
      href: `/siswa/latihan/${attempt.exerciseId}`,
    }));

    return {
      stats: {
        materialCount,
        exerciseCount,
        categoryCount: new Set(topics.map((topic) => topic.category)).size,
        topicCount,
        averageScore,
        attemptCount: attemptRows.length,
      },
      favoriteTopics,
      topics: topics
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
      recentActivities,
    };
  } catch {
    if (hasSupabaseRestAccess()) {
      try {
        return await getStudentDashboardDataFromSupabase(userId);
      } catch {
        return fallbackData;
      }
    }

    return fallbackData;
  }
}
