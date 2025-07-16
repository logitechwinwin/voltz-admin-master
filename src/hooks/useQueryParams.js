import { useSearchParams } from "next/navigation";

export default function useQueryParams(initialState) {
  const params = useSearchParams();
  // const queryParamsObject = Object.entries(params.entries()).forEach((key, value) => {
  //   return { key: value.startsWith("{") && value.endsWith("}") ? JSON.parse(value) : value };
  // });
  const queryParamsObject = Array.from(params.entries()).reduce((acc, [key, value]) => {
    const parsedValue = value.startsWith("{") && value.endsWith("}") ? JSON.parse(value) : value;

    acc[key] = parsedValue;
    return acc;
  }, {});
  const updatedQueryParamsObject = {
    ...initialState,
    ...queryParamsObject,
  };
  function setQueryParams(key, value) {
    if (window !== undefined) {
      const params = new URLSearchParams(window.location.search);
      if (value === 'null') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const newQuery = params.toString();
      const newUrl = `${window.location.pathname}?${newQuery}`;
      window.history.replaceState({}, "", newUrl);
    }
  }
  function clearFilters(){
      const newUrl = `${window.location.pathname}`;
      window.history.replaceState({}, "", newUrl);
  }
  return {
    queryParams: updatedQueryParamsObject,
    setQueryParams,
    clearQueryParams:clearFilters,
  };
}
