import { cache } from "react";

import { prisma } from "@/lib/prisma";

export type PublicTopicMaterial = {
  id: string;
  title: string;
  description: string | null;
  type: "VIDEO" | "PDF" | "SLIDE" | "DOCUMENT";
  accessLevel: "PREVIEW" | "ENROLLED";
  fileUrl: string | null;
  coverUrl: string | null;
  createdAt: string;
};

export type PublicTopicExercise = {
  id: string;
  title: string;
  scope: "CATEGORY" | "TOPIC";
  accessLevel: "PREVIEW" | "ENROLLED";
  questionCount: number;
  materialTitle: string | null;
};

export type PublicTopicDetail = {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  summary: string | null;
  previewMode: "PREVIEW" | "ENROLLED";
  materials: PublicTopicMaterial[];
  exerciseSummary: {
    totalTopicExercises: number;
    totalCategoryExercises: number;
    categoryCount: number;
    topicCount: number;
    materialCount: number;
  };
};

export type PublicTopicExerciseCollection = {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  summary: string | null;
  previewMode: "PREVIEW" | "ENROLLED";
  exerciseCount: number;
  exercises: PublicTopicExercise[];
};

export type PublicExerciseCategorySummary = {
  slug: string;
  category: string;
  difficulty: string;
  topicCount: number;
  exerciseCount: number;
};

export type PublicExerciseCategoryTopic = {
  id: string;
  slug: string;
  title: string;
  exerciseCount: number;
  exercises: PublicTopicExercise[];
};

export type PublicExerciseCategoryDetail = {
  slug: string;
  category: string;
  difficulty: string;
  topicCount: number;
  exerciseCount: number;
  generalExercises: PublicTopicExercise[];
  topics: PublicExerciseCategoryTopic[];
};

export type PublicMaterialDetail = {
  id: string;
  title: string;
  description: string | null;
  type: "VIDEO" | "PDF" | "SLIDE" | "DOCUMENT";
  accessLevel: "PREVIEW" | "ENROLLED";
  fileUrl: string | null;
  coverUrl: string | null;
  topic: {
    id: string;
    slug: string;
    title: string;
    category: string;
    difficulty: string;
  };
};

export type PublicExerciseQuestion = {
  id: string;
  orderNumber: number;
  points: number;
  questionType: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "ESSAY";
  prompt: string;
  optionA: string | null;
  optionB: string | null;
  optionC: string | null;
  optionD: string | null;
  optionE: string | null;
  correctAnswer: "A" | "B" | "C" | "D" | "E" | null;
  correctAnswers: string | null;
  explanation: string | null;
  sampleAnswer: string | null;
};

export type PublicExerciseDetail = {
  id: string;
  title: string;
  scope: "CATEGORY" | "TOPIC";
  accessLevel: "PREVIEW" | "ENROLLED";
  questionCount: number;
  adminNotes: string | null;
  topic: {
    id: string;
    slug: string;
    title: string;
    category: string;
    difficulty: string;
  };
  material: {
    id: string;
    title: string;
    coverUrl: string | null;
  } | null;
  questions: PublicExerciseQuestion[];
};

function mapMaterialRecord(material: {
  id: string;
  title: string;
  description: string | null;
  type: "VIDEO" | "PDF" | "SLIDE" | "DOCUMENT";
  accessLevel: "PREVIEW" | "ENROLLED";
  fileUrl: string | null;
  coverUrl: string | null;
  createdAt: Date;
}): PublicTopicMaterial {
  return {
    ...material,
    createdAt: material.createdAt.toISOString(),
  };
}

function normalizeExerciseCategorySegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDifficultyRank(value: string) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "sd") return 0;
  if (normalized === "smp") return 1;
  return 2;
}

export function buildExerciseCategorySlug(category: string, difficulty: string) {
  return `${normalizeExerciseCategorySegment(category)}-${normalizeExerciseCategorySegment(difficulty)}`;
}

function sortExerciseCategorySummaries(
  left: PublicExerciseCategorySummary,
  right: PublicExerciseCategorySummary,
) {
  return (
    getDifficultyRank(left.difficulty) - getDifficultyRank(right.difficulty) ||
    left.category.localeCompare(right.category, "id-ID") ||
    left.slug.localeCompare(right.slug, "id-ID")
  );
}

function mapTopicExerciseRecord(topic: {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: string;
  exercises: Array<{
    id: string;
    title: string;
    scope: "CATEGORY" | "TOPIC";
    accessLevel: "PREVIEW" | "ENROLLED";
    questionCount: number | null;
    material: {
      title: string;
    } | null;
  }>;
}) {
  return {
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    category: topic.category,
    difficulty: topic.difficulty,
    exercises: topic.exercises.map((exercise) => ({
      id: exercise.id,
      title: exercise.title,
      scope: exercise.scope,
      accessLevel: exercise.accessLevel,
      questionCount: exercise.questionCount ?? 0,
      materialTitle: exercise.material?.title ?? null,
    })),
  };
}

function summarizeTopicExercises(exercises: PublicTopicExercise[]) {
  const categoryCount = exercises.filter((exercise) => exercise.scope === "CATEGORY").length;
  const topicExercises = exercises.filter((exercise) => exercise.scope === "TOPIC");
  const topicCount = topicExercises.filter((exercise) => !exercise.materialTitle).length;
  const materialCount = topicExercises.filter((exercise) => Boolean(exercise.materialTitle)).length;

  return {
    totalTopicExercises: topicExercises.length,
    totalCategoryExercises: categoryCount,
    categoryCount,
    topicCount,
    materialCount,
  };
}

export const getPublicTopicDetail = cache(async (slug: string): Promise<PublicTopicDetail | null> => {
  const topic = await prisma.topic.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      difficulty: true,
      summary: true,
      previewMode: true,
      materials: {
        where: {
          status: "PUBLISHED",
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          accessLevel: true,
          fileUrl: true,
          coverUrl: true,
          createdAt: true,
        },
      },
      exercises: {
        where: {
          status: "PUBLISHED",
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          title: true,
          scope: true,
          accessLevel: true,
          questionCount: true,
          material: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  if (!topic) {
    return null;
  }

  const categoryExercises = await prisma.exercise.findMany({
    where: {
      status: "PUBLISHED",
      scope: "CATEGORY",
      topic: {
        status: "PUBLISHED",
        category: topic.category,
        difficulty: topic.difficulty,
      },
    },
    select: {
      id: true,
      title: true,
      scope: true,
      accessLevel: true,
      questionCount: true,
      material: {
        select: {
          title: true,
        },
      },
    },
  });

  const combinedExercises = [
    ...topic.exercises.map((exercise) => ({
      id: exercise.id,
      title: exercise.title,
      scope: exercise.scope,
      accessLevel: exercise.accessLevel,
      questionCount: exercise.questionCount ?? 0,
      materialTitle: exercise.material?.title ?? null,
    })),
    ...categoryExercises.map((exercise) => ({
      id: exercise.id,
      title: exercise.title,
      scope: exercise.scope,
      accessLevel: exercise.accessLevel,
      questionCount: exercise.questionCount ?? 0,
      materialTitle: exercise.material?.title ?? null,
    })),
  ];

  return {
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    category: topic.category,
    difficulty: topic.difficulty,
    summary: topic.summary,
    previewMode: topic.previewMode,
    materials: topic.materials.map(mapMaterialRecord),
    exerciseSummary: summarizeTopicExercises(combinedExercises),
  };
});

export const getPublicTopicExercises = cache(
  async (
    slug: string,
    allowedAccessLevels: Array<"PREVIEW" | "ENROLLED"> = ["PREVIEW"],
  ): Promise<PublicTopicExerciseCollection | null> => {
    const topic = await prisma.topic.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        difficulty: true,
        summary: true,
        previewMode: true,
        exercises: {
          where: {
            status: "PUBLISHED",
            scope: "TOPIC",
            accessLevel: {
              in: allowedAccessLevels,
            },
            OR: [
              {
                materialId: null,
              },
              {
                material: {
                  status: "PUBLISHED",
                },
              },
            ],
          },
          orderBy: [{ scope: "asc" }, { createdAt: "asc" }],
          select: {
            id: true,
            title: true,
            scope: true,
            accessLevel: true,
            questionCount: true,
            material: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!topic) {
      return null;
    }

    const exercises = topic.exercises.map((exercise) => ({
      id: exercise.id,
      title: exercise.title,
      scope: exercise.scope,
      accessLevel: exercise.accessLevel,
      questionCount: exercise.questionCount ?? 0,
      materialTitle: exercise.material?.title ?? null,
    }));

    return {
      id: topic.id,
      slug: topic.slug,
      title: topic.title,
      category: topic.category,
      difficulty: topic.difficulty,
      summary: topic.summary,
      previewMode: topic.previewMode,
      exerciseCount: exercises.length,
      exercises,
    };
  },
);

async function getPublishedTopicsWithExercises() {
  const topics = await prisma.topic.findMany({
    where: {
      status: "PUBLISHED",
      exercises: {
        some: {
          status: "PUBLISHED",
          scope: "CATEGORY",
        },
      },
    },
    orderBy: {
      title: "asc",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      difficulty: true,
      exercises: {
        where: {
          status: "PUBLISHED",
          scope: "CATEGORY",
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          title: true,
          scope: true,
          accessLevel: true,
          questionCount: true,
          material: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  return topics
    .map(mapTopicExerciseRecord)
    .filter((topic) => topic.exercises.length > 0);
}

export const getPublicExerciseCategories = cache(async (): Promise<PublicExerciseCategorySummary[]> => {
  const topics = await getPublishedTopicsWithExercises();
  const categoryMap = new Map<string, PublicExerciseCategorySummary>();

  for (const topic of topics) {
    const slug = buildExerciseCategorySlug(topic.category, topic.difficulty);
    const existing = categoryMap.get(slug);

    if (existing) {
      existing.exerciseCount += topic.exercises.length;
      continue;
    }

    categoryMap.set(slug, {
      slug,
      category: topic.category,
      difficulty: topic.difficulty,
      topicCount: 0,
      exerciseCount: topic.exercises.length,
    });
  }

  return [...categoryMap.values()].sort(sortExerciseCategorySummaries);
});

export const getPublicExerciseCategoryDetail = cache(
  async (slug: string): Promise<PublicExerciseCategoryDetail | null> => {
    const topics = await getPublishedTopicsWithExercises();
    const relevantTopics = topics.filter((topic) => buildExerciseCategorySlug(topic.category, topic.difficulty) === slug);

    if (relevantTopics.length === 0) {
      return null;
    }

    const sourceTopic = relevantTopics[0];
    const generalExercises = relevantTopics.flatMap((topic) =>
      topic.exercises.filter((exercise) => exercise.scope === "CATEGORY"),
    );

    return {
      slug,
      category: sourceTopic.category,
      difficulty: sourceTopic.difficulty,
      topicCount: 0,
      exerciseCount: relevantTopics.reduce((total, topic) => total + topic.exercises.length, 0),
      generalExercises,
      topics: [],
    };
  },
);

async function getMaterialDetailInternal(
  materialId: string,
  allowedAccessLevels: Array<"PREVIEW" | "ENROLLED">,
): Promise<PublicMaterialDetail | null> {
  const material = await prisma.material.findFirst({
    where: {
      id: materialId,
      accessLevel: {
        in: allowedAccessLevels,
      },
      status: "PUBLISHED",
      topic: {
        status: "PUBLISHED",
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      accessLevel: true,
      fileUrl: true,
      coverUrl: true,
      topic: {
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
          difficulty: true,
        },
      },
    },
  });

  if (!material) {
    return null;
  }

  return material;
}

export const getPublicMaterialDetail = cache(async (materialId: string): Promise<PublicMaterialDetail | null> => {
  return getMaterialDetailInternal(materialId, ["PREVIEW"]);
});

export const getStudentMaterialDetail = cache(async (materialId: string): Promise<PublicMaterialDetail | null> => {
  return getMaterialDetailInternal(materialId, ["PREVIEW", "ENROLLED"]);
});

async function getExerciseDetailInternal(
  exerciseId: string,
  allowedAccessLevels: Array<"PREVIEW" | "ENROLLED">,
): Promise<PublicExerciseDetail | null> {
  const exercise = await prisma.exercise.findFirst({
    where: {
      id: exerciseId,
      status: "PUBLISHED",
      accessLevel: {
        in: allowedAccessLevels,
      },
      topic: {
        status: "PUBLISHED",
      },
      OR: [
        {
          materialId: null,
        },
        {
          material: {
            status: "PUBLISHED",
          },
        },
      ],
    },
    select: {
      id: true,
      title: true,
      scope: true,
      accessLevel: true,
      questionCount: true,
      adminNotes: true,
      topic: {
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
          difficulty: true,
        },
      },
      material: {
        select: {
          id: true,
          title: true,
          coverUrl: true,
        },
      },
      questions: {
        orderBy: {
          orderNumber: "asc",
        },
        select: {
          id: true,
          orderNumber: true,
          points: true,
          questionType: true,
          prompt: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
          optionE: true,
          correctAnswer: true,
          correctAnswers: true,
          explanation: true,
          sampleAnswer: true,
        },
      },
    },
  });

  if (!exercise) {
    return null;
  }

  return {
    id: exercise.id,
    title: exercise.title,
    scope: exercise.scope,
    accessLevel: exercise.accessLevel,
    questionCount: exercise.questionCount ?? exercise.questions.length,
    adminNotes: exercise.adminNotes,
    topic: exercise.topic,
    material: exercise.material,
    questions: exercise.questions,
  };
}

export const getPublicExerciseDetail = cache(async (exerciseId: string): Promise<PublicExerciseDetail | null> => {
  return getExerciseDetailInternal(exerciseId, ["PREVIEW"]);
});

export const getStudentExerciseDetail = cache(async (exerciseId: string): Promise<PublicExerciseDetail | null> => {
  return getExerciseDetailInternal(exerciseId, ["PREVIEW", "ENROLLED"]);
});
