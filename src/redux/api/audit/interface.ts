export type AuditSeverity = "low" | "medium" | "high";

export interface IAuditActor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: { name: string };
}

export interface IAuditLog {
  _id: string;
  actor?: IAuditActor | null;
  actorEmail?: string;
  method: string;
  endpoint: string;
  resource?: string;
  category: string;
  action: string;
  details?: string;
  ipAddress?: string;
  statusCode: number;
  severity: AuditSeverity;
  createdAt: string;
  updatedAt?: string;
}

export interface IAuditListQuery {
  pageNumber: number;
  pageSize: number;
  searchTerm?: string;
  category?: string;
  severity?: string;
}
