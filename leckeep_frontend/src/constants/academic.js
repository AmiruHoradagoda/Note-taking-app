export const semesters = Array.from({ length: 8 }, (_, index) => `Semester ${index + 1}`);

export const categories = ["Lecture", "Tutorial", "Assignment", "Exam Notes", "Summary"];

export const visibilityOptions = [
  { value: "private", label: "Private", description: "Only you can see this folder." },
  { value: "global", label: "Global", description: "Everyone can see this folder." },
  { value: "group", label: "Group", description: "Only selected group members can see this folder." },
];
