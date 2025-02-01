export default function getOneNestBack(url: string): string {
  const segments = url.split("/").filter(Boolean); // Split and remove empty segments
  segments.pop(); // Remove the last segment
  return `/${segments.join("/")}`; // Join the remaining segments back into a path
}
