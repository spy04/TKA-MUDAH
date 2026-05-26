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
  exercises: PublicTopicExercise[];
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
  questionType: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "ESSAY";
  prompt: string;
  optionA: string | null;
  optionB: string | null;
  optionC: string | null;
  optionD: string | null;
  explanation: string | null;
  sampleAnswer: string | null;
};

export type PublicExerciseDetail = {
  id: string;
  title: string;
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

  return {
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    category: topic.category,
    difficulty: topic.difficulty,
    summary: topic.summary,
    previewMode: topic.previewMode,
    materials: topic.materials.map(mapMaterialRecord),
    exercises: topic.exercises.map((exercise) => ({
      id: exercise.id,
      title: exercise.title,
      accessLevel: exercise.accessLevel,
      questionCount: exercise.questionCount ?? 0,
      materialTitle: exercise.material?.title ?? null,
    })),
  };
});

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
          questionType: true,
          prompt: true,
          optionA: true,
          optionB: true,
          optionC: true,
          optionD: true,
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

async function getFirstExerciseIdInternal(
  allowedAccessLevels: Array<"PREVIEW" | "ENROLLED">,
): Promise<string | null> {
  const exercise = await prisma.exercise.findFirst({
    where: {
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
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
    },
  });

  return exercise?.id ?? null;
}

export const getFirstPublicExerciseId = cache(async () => {
  return getFirstExerciseIdInternal(["PREVIEW"]);
});

export const getFirstStudentExerciseId = cache(async () => {
  return getFirstExerciseIdInternal(["PREVIEW", "ENROLLED"]);
});
