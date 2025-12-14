export class BaseQueryParams {
  public filter: string;
  public sort: string;
  public pageIndex: number;
  public pageSize: number;
  public descending: boolean;
  public expand: boolean;

  constructor(
    filter?: string,
    sort?: string,
    pageIndex?: number,
    pageSize?: number,
    descending?: boolean,
    expand?: boolean
  ) {
    this.filter = filter ?? "";
    this.sort = sort ?? "";
    this.pageIndex = pageIndex ?? 0;
    this.pageSize = pageSize ?? 10;
    this.descending = descending ?? false;
    this.expand = expand ?? true;
  }

  public update(
    filter?: string,
    sort?: string,
    pageIndex?: number,
    pageSize?: number,
    descending?: boolean,
    expand?: boolean
  ): void {
    this.filter = filter ?? this.filter;
    this.sort = sort ?? this.sort;
    this.pageIndex = pageIndex ?? this.pageIndex;
    this.pageSize = pageSize ?? this.pageSize;
    this.descending = descending ?? this.descending;
    this.expand = expand ?? this.expand;
  }

  public updateByObject(obj: BaseQueryParams): void {
    this.filter = obj.filter ?? this.filter;
    this.sort = obj.sort ?? this.sort;
    this.pageIndex = obj.pageIndex ?? this.pageIndex;
    this.pageSize = obj.pageSize ?? this.pageSize;
    this.descending = obj.descending ?? this.descending;
    this.expand = obj.expand ?? this.expand;
  }

  public reset(): void {
    this.filter = "";
    this.sort = "";
    this.pageIndex = 0;
    this.pageSize = 100;
    this.descending = false;
    this.expand = true;
  }
}
