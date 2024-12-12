export interface PaginationParams<OrderBy = 'createdAt'> {
  pageIndex: number;
  pageSize: number;
  orderBy: OrderBy;
  orderDirection: 'desc' | 'asc';
}
