export class AdvancedSearchField {
  name: string;
  display: string;
  fieldType: string;
  values: Array<string | number>;

  constructor(
    name: string,
    display: string,
    fieldType: string,
    values?: Array<string | number>
  ) {
    this.name = name;
    this.display = display;
    this.fieldType = fieldType;
    this.values = values ?? [""];
  }
}
