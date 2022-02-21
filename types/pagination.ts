export interface IPagination {
  total: number
  current: number
  disabled: boolean
  pageSizeOptions: []
  defaultCurrent: number
  showSizeChanger: boolean
  pageSize: number
  defaultPageSize: number
}
