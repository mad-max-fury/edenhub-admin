import type { IGroup } from "../groups";
import type { IPermission } from "../permissions";

export interface IRole {
  _id: string;
  name: string;

  groups: Array<{
    id: IGroup;
    permissionsId: string[];
  }>;
  permissions: IPermission[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateRole {
  name: string;
  groups: Array<{
    id: string;
    permissionsId: string[];
  }>;
  permissions: string[];
  isActive: boolean;
}

export interface IUpdateRole extends Partial<ICreateRole> {
  id: string;
}
