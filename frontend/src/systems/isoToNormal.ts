export default function isoToNormal(iso: string): {
  date: string;
  day: string;
  time: string;
} {
  const date = new Date(iso);

  const days: string[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const month: number = date.getMonth() + 1;
  const minutes: string = date.getMinutes().toString().padStart(2, "0");
  const hours: string = date.getHours().toString().padStart(2, "0");

  return {
    date: `${date.getDate()}/${month}/${date.getFullYear()}`,
    day: days[date.getDay()],
    time: `${hours}:${minutes}`,
  };
}
