export default function sortBySearchTerm<T>(
  array: T[],
  searchTerm: string,
  field: keyof T,
): T[] {
  return [...array].sort((a, b) => {
    const aContains = a[field]
      ?.toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const bContains = b[field]
      ?.toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (aContains && !bContains) return -1;
    if (!aContains && bContains) return 1;
    return 0;
  });
}
