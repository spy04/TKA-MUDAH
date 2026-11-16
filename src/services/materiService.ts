import { apiGet } from '../api/client'
import type {
  CatalogMaterial,
  MaterialCatalogResponse,
} from '../api/contracts'

export type Jenjang = 'SD' | 'SMP' | 'SMA'
export type Akses = 'gratis' | 'premium'
export type KategoriMateri = 'materi'

export type Materi = {
  id: string
  slug: string
  judul: string
  deskripsi: string
  mataPelajaran: string
  kategoriLabel: string
  jenjang: Jenjang
  kelasLabel: string
  kurikulum: string
  akses: Akses
  kategori: KategoriMateri
  imageUrl: string
  jumlahVideo: number
  labelVideo: string
  jumlahLatihan: number
  labelLatihan: string
  jumlahSiswa: string
  harga?: number
  tanggalDibuat: string
}

export type FilterOption = {
  label: string
  value: string
}

export type MaterialQuery = {
  q?: string
  jenjang?: string
  kelas?: string
  akses?: string
  mataPelajaran?: string
  urutan?: string
  page?: number
  pageSize?: number
}

export type KatalogData = {
  materi: Materi[]
  jenjang: FilterOption[]
  akses: FilterOption[]
  mataPelajaran: FilterOption[]
  urutan: FilterOption[]
  page: number
  pageSize: number
  total: number
}

const defaultOptions = {
  jenjang: [{ label: 'Semua Jenjang', value: 'semua' }],
  akses: [{ label: 'Semua', value: 'semua' }],
  mataPelajaran: [{ label: 'Semua', value: 'semua' }],
  urutan: [] as FilterOption[],
}

function mapMaterial(item: CatalogMaterial): Materi {
  const mapped: Materi = {
    id: item.id,
    slug: item.slug,
    judul: item.title,
    deskripsi: item.description ?? '',
    mataPelajaran: item.subject.name,
    kategoriLabel: item.category || item.subject.name,
    jenjang: item.educationLevel,
    kelasLabel: `${item.educationLevel} Kelas ${item.grade}`,
    kurikulum: item.curriculum ?? '',
    akses: item.accessTier === 'PREMIUM' ? 'premium' : 'gratis',
    kategori: 'materi',
    imageUrl: item.imageUrl ?? '',
    jumlahVideo: item.lessonCount,
    labelVideo: 'Pelajaran',
    jumlahLatihan: item.exerciseCount,
    labelLatihan: 'Latihan',
    jumlahSiswa: new Intl.NumberFormat('id-ID').format(item.learnerCount),
    tanggalDibuat: item.publishedAt ?? '',
  }
  if (item.priceAmount !== null) mapped.harga = item.priceAmount
  return mapped
}

export async function getMateri(
  query: MaterialQuery = {}
): Promise<KatalogData> {
  const params = new URLSearchParams()
  if (query.q?.trim()) params.set('q', query.q.trim())
  if (query.jenjang && query.jenjang !== 'semua') {
    params.set('educationLevel', query.jenjang)
  }
  if (query.kelas && query.kelas !== 'semua') {
    params.set('grade', query.kelas.replace(/^Kelas\s+/i, ''))
  }
  if (query.akses && query.akses !== 'semua') {
    params.set('accessTier', query.akses === 'gratis' ? 'FREE' : query.akses)
  }
  if (query.mataPelajaran && query.mataPelajaran !== 'semua') {
    params.set('subject', query.mataPelajaran)
  }
  if (query.urutan) params.set('sort', query.urutan)
  params.set('page', String(query.page ?? 1))
  params.set('pageSize', String(query.pageSize ?? 20))

  const response = await apiGet<MaterialCatalogResponse>(
    `/materials?${params.toString()}`
  )
  return {
    materi: response.items.map(mapMaterial),
    jenjang: [
      defaultOptions.jenjang[0],
      ...response.filters.educationLevels,
    ],
    akses: [
      defaultOptions.akses[0],
      ...response.filters.accessTiers.map((item) => ({
        ...item,
        label: item.value === 'FREE' ? 'Gratis' : item.label,
        value: item.value === 'FREE' ? 'gratis' : 'premium',
      })),
    ],
    mataPelajaran: [
      defaultOptions.mataPelajaran[0],
      ...response.filters.subjects.map((subject) => ({
        label: subject.name,
        value: subject.name,
      })),
    ],
    urutan: response.filters.sorts,
    page: response.pagination.page,
    pageSize: response.pagination.pageSize,
    total: response.pagination.total,
  }
}

