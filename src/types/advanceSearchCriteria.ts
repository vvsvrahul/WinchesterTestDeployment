import { AdvancedSearchField } from "./advancedSearchField";
import { BaseQueryParams } from "./baseQueryParams";

export class AdvanceSearchCriteria {
  criteria: Array<AdvancedSearchField>;
  queryParams: BaseQueryParams;
  source?: String;

  constructor() {
    this.criteria = [];
    this.queryParams = new BaseQueryParams();
    this.source = "";
  }
}
