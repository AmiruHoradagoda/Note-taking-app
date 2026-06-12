export const folderCategories = [
  { value: "LECTURE", label: "Lecture" },
  { value: "TUTORIAL", label: "Tutorial" },
  { value: "ASSIGNMENT", label: "Assignment" },
  { value: "EXAM_NOTES", label: "Exam Notes" },
  { value: "SUMMARY", label: "Summary" },
];

export const categories = folderCategories.map((category) => category.label);

export const toFolderCategoryValue = (label) =>
  folderCategories.find((category) => category.label === label)?.value || "LECTURE";

export const toFolderCategoryLabel = (value) =>
  folderCategories.find((category) => category.value === value)?.label || "Lecture";
