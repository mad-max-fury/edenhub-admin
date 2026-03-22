import type { IPermission } from "../permissions";

export interface IGroup {
  _id: string;
  name: string;
  path: string;
  order: number;
  icon?: string;
  permissions: Partial<IPermission[]>;
}

export interface ICreateGroup {
  name: string;
  permissions?: Array<string>;
}

export interface IUpdateGroup extends ICreateGroup {
  id: string;
}
