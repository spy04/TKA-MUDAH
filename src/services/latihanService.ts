import { apiGet } from '../api/client'
import type { CatalogPackage, PaginatedResponse } from '../api/contracts'

export type Jenjang = 'SD' | 'SMP' | 'SMA'
export type AksesLatihan = 'Gratis' | 'Premium'
export type TingkatLatihan = 'Mudah' | 'Sedang' | 'Sulit'
export type PaketKind = 'PRACTICE' | 'SIMULATION'

export type PaketLatihan = {
  id: string
  slug: string
  kind: PaketKind
  judul: string
  deskripsi: string
  jenjang: Jenjang
  kelas: string
  mataPelajaran: string
  akses: AksesLatihan
  tingkat: TingkatLatihan
  jumlahSoal: number
  durasiMenit: number
  harga?: number
}

export type LatihanQuery = {
  q?: string
  jenjang: Jenjang
  kelas: string
  akses: 'Semua' | AksesLatihan
  mataPelajaran: string
  tingkat: 'Semua' | TingkatLatihan
  kind: PaketKind
  page: number
  pageSize: number
}

export type LatihanData = {
  paket: PaketLatihan[]
  mataPelajaran: string[]
  page: number
  pageSize: number
  total: number
}

const subjectOptionsByKind = new Map<string, Promise<string[]>>()

function mapDifficulty(value: string): TingkatLatihan {
  if (value === 'EASY') return 'Mudah'
  if (value === 'HARD') return 'Sulit'
  return 'Sedang'
}

function mapPackage(item: CatalogPackage): PaketLatihan {
  const mapped: PaketLatihan = {
    id: item.id,
    slug: item.slug,
    kind: item.kind,
    judul: item.title,
    deskripsi: item.description ?? '',
    jenjang: item.educationLevel,
    kelas: `Kelas ${item.grade}`,
    mataPelajaran: item.subject.name,
    akses: item.accessTier === 'PREMIUM' ? 'Premium' : 'Gratis',
    tingkat: mapDifficulty(item.difficulty),
    jumlahSoal: item.questionCount,
    durasiMenit: Math.ceil(item.durationSeconds / 60),
  }
  if (item.priceAmount !== null) mapped.harga = item.priceAmount
  return mapped
}

function packageQuery(params: URLSearchParams, kind: PaketKind) {
  params.set('kind', kind)
}

async function getSubjectOptions(kind: PaketKind): Promise<string[]> {
  const cached = subjectOptionsByKind.get(kind)
  if (cached) return cached

  const request = apiGet<PaginatedResponse<CatalogPackage>>(
    `/assessment-packages?kind=${kind}&page=1&pageSize=100`
  ).then((response) =>
    Array.from(new Set(response.items.map((item) => item.subject.name)))
  )
  subjectOptionsByKind.set(kind, request)
  try {
    return await request
  } catch (error) {
    subjectOptionsByKind.delete(kind)
    throw error
  }
}

export async function getLatihanData(
  query: LatihanQuery
): Promise<LatihanData> {
  const params = new URLSearchParams()
  packageQuery(params, query.kind)
  params.set('educationLevel', query.jenjang)
  params.set('grade', query.kelas.replace(/^Kelas\s+/i, ''))
  if (query.akses !== 'Semua') {
    params.set('accessTier', query.akses === 'Gratis' ? 'FREE' : 'PREMIUM')
  }
  if (query.mataPelajaran !== 'Semua') {
    params.set('subject', query.mataPelajaran)
  }
  if (query.tingkat !== 'Semua') {
    const difficulty =
      query.tingkat === 'Mudah'
        ? 'EASY'
        : query.tingkat === 'Sulit'
          ? 'HARD'
          : 'MEDIUM'
    params.set('difficulty', difficulty)
  }
  if (query.q?.trim()) params.set('q', query.q.trim())
  params.set('page', String(query.page))
  params.set('pageSize', String(query.pageSize))

  const [response, mataPelajaran] = await Promise.all([
    apiGet<PaginatedResponse<CatalogPackage>>(
      `/assessment-packages?${params.toString()}`
    ),
    getSubjectOptions(query.kind),
  ])
  return {
    paket: response.items.map(mapPackage),
    mataPelajaran,
    page: response.pagination.page,
    pageSize: response.pagination.pageSize,
    total: response.pagination.total,
  }
}

