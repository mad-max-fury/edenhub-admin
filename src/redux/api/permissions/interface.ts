export interface IPermission {
  _id: string;
  name: string;
  endpoint: string;
  method: string;
  resource: string;
  action: string;
  isActive: boolean;
}
