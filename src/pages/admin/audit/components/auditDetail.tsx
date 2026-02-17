import React from "react";
import type { AuditRow } from "./auditColumns";
import { Badge, Typography } from "@/components";
import { Activity, Clock, Globe } from "lucide-react";

type Props = { selectedAudit: AuditRow };

const AuditDetail = ({ selectedAudit }: Props) => {
  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-2 gap-4">
        <DetailItem
          icon={<Activity size={16} />}
          label="Action"
          value={selectedAudit.action}
        />
        <DetailItem
          icon={<Badge status={selectedAudit.severity} />}
          label="Severity"
          value={selectedAudit.severity.toUpperCase()}
        />
        <DetailItem
          icon={<Clock size={16} />}
          label="Timestamp"
          value={selectedAudit.timestamp}
        />
        <DetailItem
          icon={<Globe size={16} />}
          label="IP Address"
          value={selectedAudit.ipAddress}
        />
      </div>

      <div className="p-4 bg-N10 rounded-xl border border-N30">
        <Typography
          variant="c-s"
          color="N500"
          className="mb-2 uppercase font-bold"
        >
          Details
        </Typography>
        <Typography variant="p-m">{selectedAudit.details}</Typography>
      </div>

      <div className="space-y-2">
        <Typography variant="c-s" color="N500" className="uppercase font-bold">
          Performed By
        </Typography>
        <div className="flex items-center gap-3 p-3 border border-N30 rounded-xl">
          <div className="w-10 h-10 bg-B50 text-B400 rounded-full flex items-center justify-center font-bold">
            {selectedAudit.actor.name.charAt(0)}
          </div>
          <div>
            <Typography variant="p-m" fontWeight="bold">
              {selectedAudit.actor.name}
            </Typography>
            <Typography variant="p-s" color="N500">
              {selectedAudit.actor.role}
            </Typography>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Typography variant="c-s" color="N500" className="uppercase font-bold">
          Raw Log Data
        </Typography>
        <pre className="p-4 bg-BR500 text-N10 rounded-xl text-[12px] font-mono overflow-auto max-h-40">
          {JSON.stringify(selectedAudit, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default AuditDetail;

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-N400">{icon}</div>
    <div>
      <Typography variant="c-s" color="N500" className="uppercase">
        {label}
      </Typography>
      <Typography variant="p-s" fontWeight="medium">
        {value}
      </Typography>
    </div>
  </div>
);
