import useAsync from './useAsync'
import { getFilterOptions } from '../api/sessions'

function useFilterOptions() {
  return useAsync(getFilterOptions)
}

export default useFilterOptions
