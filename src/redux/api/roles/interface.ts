export interface IPermission {
  _id: string;
  name: string;
  endpoint: string;
  method: string;
  resource: string;
  action: string;
  isActive: boolean;
}
export interface IGroup {
  _id: string;
  name: string;
  path: string;
  order: number;
  icon?: string;
  permissions: Partial<IPermission[]>;
}
export interface IRole {
  _id: string;
  name: string;
  permissions: Partial<IPermission[]>;
  groups: Partial<IGroup[]>;
}

export interface ICreateRole {
  name: string;
  groups: Array<string>;
  permissions: Array<string>;
  isActive: boolean;
}

export interface IUpdateRole extends ICreateRole {
  id: string;
}
