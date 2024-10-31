import {
  getDateCertainDaysAgo,
  toISODateOnly
} from "@/lib/date_utils";

export function getStockPagePath(id: number, days: number = 30): string {
  return `/stock/${id}?start=${
    toISODateOnly(
      getDateCertainDaysAgo(days),
    )
  }`;
}
