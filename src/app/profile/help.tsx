function valueToDisplayName_1(name: string, value: number): string {
  return name.includes("%") ? value.toFixed(2) + "%" : value.toFixed(0);
}

export { valueToDisplayName_1 as valueToDisplayName_1 };
