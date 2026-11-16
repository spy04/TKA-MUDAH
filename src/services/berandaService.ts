import { apiGet } from '../api/client'
import type {
  CatalogMaterial,
  LearningOverview,
  MaterialCatalogResponse,
} from '../api/contracts'

export type Level = 'SD' | 'SMP' | 'SMA'

export type LearningItem = {
  id: string
  slug: string
  level: Level
  grade: string
  subject: string
  title: string
  chapter: string
  progress: number
  lastActivity: string
}

export type FeaturedItem = {
  id: string
  slug: string
  level: Level
  grade: string
  badge: string
  category: string
  title: string
  access: 'free' | 'premium'
  price: number | null
  kind: 'material'
  imageUrl: string
  metrics: { label: string; value: string }[]
}

export type BerandaData = {
  student: {
    firstName: string
    level: Level
    grade: number
  }
  popularSearches: string[]
  learning: LearningItem[]
  featured: FeaturedItem[]
}

function displayActivity(value: string | null): string {
  if (!value) return 'Belum ada aktivitas'
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function mapFeatured(item: CatalogMaterial): FeaturedItem {
  return {
    id: item.id,
    slug: item.slug,
    level: item.educationLevel,
    grade: String(item.grade),
    badge: `${item.educationLevel} • Kelas ${item.grade}`,
    category: item.category || item.subject.name,
    title: item.title,
    access: item.accessTier === 'PREMIUM' ? 'premium' : 'free',
    price: item.priceAmount,
    kind: 'material',
    imageUrl: item.imageUrl ?? '',
    metrics: [
      { value: String(item.lessonCount), label: 'Pelajaran' },
      { value: String(item.exerciseCount), label: 'Latihan' },
    ],
  }
}

export async function getBerandaData(): Promise<BerandaData> {
  const [overview, catalog] = await Promise.all([
    apiGet<LearningOverview>('/me/overview'),
    apiGet<MaterialCatalogResponse>('/materials?page=1&pageSize=8&sort=relevan'),
  ])

  const firstName = overview.student.displayName.trim().split(/\s+/)[0] || 'Siswa'
  return {
    student: {
      firstName,
      level: overview.student.educationLevel,
      grade: overview.student.grade,
    },
    popularSearches: [],
    learning: overview.materials.map((item) => ({
      id: item.id,
      slug: item.slug,
      level: item.educationLevel,
      grade: String(item.grade),
      subject: item.subject,
      title: item.title,
      chapter: '',
      progress: item.progress,
      lastActivity: displayActivity(item.lastActivity),
    })),
    featured: catalog.items.map(mapFeatured),
  }
}

