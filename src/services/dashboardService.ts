import { apiGet } from '../api/client'
import type {
  AttemptHistoryItem,
  LearningOverview,
  PaginatedResponse,
} from '../api/contracts'

export type DashboardData = {
  overview: LearningOverview
  attempts: AttemptHistoryItem[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const [overview, history] = await Promise.all([
    apiGet<LearningOverview>('/me/overview'),
    apiGet<PaginatedResponse<AttemptHistoryItem>>(
      '/me/attempts?page=1&pageSize=20'
    ),
  ])
  return { overview, attempts: history.items }
}

