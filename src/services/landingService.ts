
export interface LandingMaterial {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  educationLevel: string;
  grade: number;
  accessTier: string;
  category: string;
}

type ApiRecord = Record<string, unknown>;

const API_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080/api/v1";

function field(
  record: ApiRecord,
  camel: string,
  snake: string
): unknown {
  return record[camel] ?? record[snake];
}

export async function getLandingMaterials():
  Promise<LandingMaterial[]> {

  const response = await fetch(`${API_URL}/materials`);

  if (!response.ok) {
    throw new Error("Gagal mengambil katalog materi");
  }

  const json: unknown = await response.json();

  if (!json || typeof json !== "object") {
    throw new Error("Format response katalog tidak valid");
  }

  const root = json as ApiRecord;
  const payload = root.data ?? root;

  let items: unknown = payload;

  if (!Array.isArray(items) && payload &&
      typeof payload === "object") {
    const object = payload as ApiRecord;
    items = object.items ?? object.materials ??
            object.results ?? object.data;
  }

  if (!Array.isArray(items)) {
    throw new Error("Daftar materi tidak ditemukan");
  }

  return items.map((item) => {
    const m = item as ApiRecord;

    return {
      id: String(m.id ?? ""),
      slug: String(m.slug ?? ""),
      title: String(m.title ?? ""),
      description: String(m.description ?? ""),
      imageUrl: field(m, "imageUrl", "image_url")
        ? String(field(m, "imageUrl", "image_url"))
        : null,
      educationLevel: String(
        field(m, "educationLevel", "education_level") ?? ""
      ),
      grade: Number(m.grade ?? 0),
      accessTier: String(
        field(m, "accessTier", "access_tier") ?? "FREE"
      ),
      category: String(m.category ?? ""),
    };
  });
}
