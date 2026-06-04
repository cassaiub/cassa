/* Khan M. B. Asad — teaching record, extracted from his Google Classroom
 * Takeout (Spring 2020 – Summer 2026). One entry per UNIQUE course; `offerings`
 * is each section run (term, year, section, student count, room). `coListed` =
 * other codes the course is cross-listed / co-offered as (with an optional
 * `since` term when the co-offering began). NO grades. */
export type TOffering = { term: string; year: number; section: string; students: number; room: string };
export type CoListed = { code: string; since?: string };
export type TCourse = { code: string; name: string; coListed: CoListed[]; offerings: TOffering[] };
export const TEACHING_SNAPSHOT = "30 May 2026";
export const COURSES: TCourse[] = [
  {
    code: "PHY100", name: "Physics for the Next Generation", coListed: [{ code: "AST100", since: "Spring 2024" }],
    offerings: [
      { term: "Summer", year: 2022, section: "1", students: 11, room: "C2004" },
      { term: "Autumn", year: 2022, section: "1", students: 1, room: "BC7026" },
      { term: "Spring", year: 2023, section: "1", students: 35, room: "BC8012" },
      { term: "Summer", year: 2023, section: "1", students: 41, room: "BC8015" },
      { term: "Autumn", year: 2023, section: "1", students: 39, room: "BC2022" },
      { term: "Autumn", year: 2023, section: "2", students: 41, room: "BC2022" },
      { term: "Spring", year: 2024, section: "1", students: 38, room: "BC5012" },
      { term: "Spring", year: 2024, section: "2", students: 33, room: "BC6009" },
      { term: "Summer", year: 2024, section: "1", students: 41, room: "BC7026" },
      { term: "Summer", year: 2024, section: "2", students: 40, room: "C3004" },
      { term: "Autumn", year: 2024, section: "1", students: 49, room: "BC6009" },
      { term: "Autumn", year: 2024, section: "2", students: 41, room: "C2005" },
      { term: "Spring", year: 2025, section: "1", students: 34, room: "BC8012" },
      { term: "Spring", year: 2025, section: "2", students: 34, room: "BC6008" },
      { term: "Summer", year: 2025, section: "1", students: 36, room: "MK4004" },
      { term: "Summer", year: 2025, section: "2", students: 35, room: "BC5014" },
      { term: "Autumn", year: 2025, section: "1", students: 44, room: "MK4004" },
      { term: "Autumn", year: 2025, section: "2", students: 43, room: "BC6007" },
      { term: "Autumn", year: 2025, section: "4", students: 0, room: "BC4012" },
      { term: "Spring", year: 2026, section: "1", students: 34, room: "C5004" },
      { term: "Spring", year: 2026, section: "3", students: 38, room: "C4005" },
      { term: "Spring", year: 2026, section: "5", students: 40, room: "MK5004" },
      { term: "Summer", year: 2026, section: "1", students: 40, room: "BC5002" },
      { term: "Summer", year: 2026, section: "2", students: 40, room: "C3005" },
      { term: "Summer", year: 2026, section: "5", students: 39, room: "BC6013" },
    ],
  },
  {
    code: "PHY101L", name: "University Physics-I Lab", coListed: [],
    offerings: [
      { term: "Summer", year: 2022, section: "6", students: 23, room: "PLab" },
      { term: "Summer", year: 2022, section: "7", students: 22, room: "PLab" },
      { term: "Summer", year: 2022, section: "8", students: 23, room: "PLab" },
      { term: "Autumn", year: 2022, section: "6", students: 18, room: "PLab" },
      { term: "Autumn", year: 2022, section: "7", students: 19, room: "PLab" },
      { term: "Spring", year: 2023, section: "14", students: 27, room: "PLab" },
      { term: "Spring", year: 2023, section: "4", students: 26, room: "PLab" },
      { term: "Spring", year: 2023, section: "6", students: 28, room: "PLab" },
      { term: "Summer", year: 2023, section: "5", students: 19, room: "PLab" },
      { term: "Summer", year: 2023, section: "6", students: 21, room: "PLab" },
      { term: "Summer", year: 2023, section: "7", students: 19, room: "PLab" },
      { term: "Autumn", year: 2023, section: "2", students: 23, room: "PLab" },
      { term: "Autumn", year: 2023, section: "3", students: 22, room: "PLab" },
      { term: "Autumn", year: 2023, section: "4", students: 22, room: "PLab" },
      { term: "Spring", year: 2024, section: "2", students: 19, room: "PLab" },
      { term: "Spring", year: 2024, section: "3", students: 18, room: "PLab2" },
      { term: "Spring", year: 2024, section: "4", students: 17, room: "PLab" },
    ],
  },
  {
    code: "PHY101", name: "University Physics-I", coListed: [{ code: "PHY111" }],
    offerings: [
      { term: "Spring", year: 2020, section: "3", students: 27, room: "BC7026" },
      { term: "Autumn", year: 2020, section: "3", students: 35, room: "BC6008" },
      { term: "Spring", year: 2021, section: "4", students: 33, room: "BC5014" },
      { term: "Summer", year: 2021, section: "4", students: 31, room: "BC5014" },
      { term: "Summer", year: 2021, section: "1", students: 30, room: "BC6012" }, // offered as PHY111
      { term: "Autumn", year: 2021, section: "3", students: 50, room: "BC6009" },
      { term: "Autumn", year: 2021, section: "6", students: 54, room: "BC6008" },
      { term: "Spring", year: 2022, section: "2", students: 40, room: "BC6013" },
      { term: "Spring", year: 2022, section: "4", students: 45, room: "BC9017" },
      { term: "Summer", year: 2022, section: "4", students: 41, room: "BC7015" },
    ],
  },
  {
    code: "PHY102", name: "University Physics-II", coListed: [],
    offerings: [
      { term: "Summer", year: 2020, section: "5", students: 30, room: "BC6012" },
      { term: "Summer", year: 2020, section: "7", students: 8, room: "BC6009" },
      { term: "Autumn", year: 2020, section: "5", students: 39, room: "BC7026" },
      { term: "Autumn", year: 2022, section: "6", students: 39, room: "C4004" },
      { term: "Spring", year: 2023, section: "6", students: 49, room: "BC5013" },
    ],
  },
  {
    code: "AST301", name: "Introduction to Astrophysics", coListed: [{ code: "PHY432" }],
    offerings: [
      { term: "Spring", year: 2024, section: "1", students: 16, room: "C3003" },
      { term: "Autumn", year: 2025, section: "1", students: 19, room: "MK5010" },
    ],
  },
  {
    code: "AST201", name: "Introduction to Astronomy", coListed: [{ code: "MAT459" }],
    offerings: [
      { term: "Summer", year: 2023, section: "1", students: 8, room: "BC2022" },
      { term: "Autumn", year: 2023, section: "1", students: 7, room: "C2007" },
      { term: "Spring", year: 2025, section: "1", students: 8, room: "C4006" },
    ],
  },
  {
    code: "PHY424", name: "Atmospheric and Space Physics", coListed: [],
    offerings: [
      { term: "Autumn", year: 2024, section: "1", students: 18, room: "C6006" },
    ],
  },
  {
    code: "AST401", name: "Planets and Planetary Systems", coListed: [],
    offerings: [
      { term: "Summer", year: 2025, section: "1", students: 16, room: "C3007" },
    ],
  },
  {
    code: "PHY305", name: "Digital Electronics", coListed: [],
    offerings: [
      { term: "Spring", year: 2021, section: "1", students: 4, room: "C6002" },
      { term: "Autumn", year: 2022, section: "1", students: 11, room: "BC10017" },
    ],
  },
  {
    code: "PHY432", name: "Introduction to Astrophysics", coListed: [{ code: "AST301" }],
    offerings: [
      { term: "Spring", year: 2022, section: "1", students: 15, room: "C6007" },
    ],
  },
  {
    code: "PHY305L", name: "Digital Electronics Lab-VI", coListed: [],
    offerings: [
      { term: "Autumn", year: 2021, section: "1", students: 4, room: "PLab2" },
      { term: "Autumn", year: 2022, section: "1", students: 8, room: "PLab2" },
    ],
  },
  {
    code: "AST410", name: "Radio Astronomy", coListed: [],
    offerings: [
      { term: "Summer", year: 2024, section: "1", students: 10, room: "C4003" },
    ],
  },
  {
    code: "MAT459", name: "Astronomy", coListed: [],
    offerings: [
      { term: "Spring", year: 2020, section: "1", students: 1, room: "C5006" },
    ],
  },
];
