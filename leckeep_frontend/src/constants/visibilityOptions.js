export const visibilityOptions = [
  { value: "private", apiValue: "PRIVATE", label: "Private", description: "Only you can see this folder." },
  { value: "global", apiValue: "GLOBAL", label: "Global", description: "Everyone can see this folder." },
  { value: "group", apiValue: "GROUP", label: "Group", description: "Only selected group members can see this folder." },
];

export const toVisibilityApiValue = (value) =>
  visibilityOptions.find((option) => option.value === value)?.apiValue || "PRIVATE";

export const toVisibilityUiValue = (apiValue) =>
  visibilityOptions.find((option) => option.apiValue === apiValue)?.value || "private";
