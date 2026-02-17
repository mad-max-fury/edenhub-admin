import { Checkbox, TextField, Typography, Button } from "@/components";
import AccordionWrapper from "@/components/accordions/AccordionWrapper";
import React, { useState } from "react";

type Props = {
  initialData?: { name: string; permissions: string[] };
  onClose: () => void;
};

const CATEGORIES = [
  { id: "management", title: "Management" },
  { id: "course", title: "Course Management" },
  { id: "admission", title: "Admission" },
  { id: "fees", title: "Fees" },
  { id: "reports", title: "Reports" },
];

function EditOrCreateRole({ initialData, onClose }: Props) {
  const [roleName, setRoleName] = useState(initialData?.name || "");
  const [isActive, setIsActive] = useState(0);

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex-1 overflow-y-auto  flex flex-col">
        <div className="flex flex-col gap-2 p-6">
          <TextField
            label="Role Name"
            name={"roleName"}
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="e.g. Employee Code of Conduct"
            flexStyle="row"
          />
        </div>

        <hr />

        <div className="flex flex-col gap-4 px-6">
          <div className="flex flex-col gap-1  rounded-lg overflow-hidden">
            {CATEGORIES.map((cat, index) => (
              <AccordionWrapper
                key={cat.id}
                isOpen={isActive === index}
                toggleAccordion={() => setIsActive(index)}
                title={
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`cat-${cat.id}`}
                      label={
                        <Typography variant="p-s" fontWeight="bold">
                          {cat.title}
                        </Typography>
                      }
                    />
                  </div>
                }
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 p-4 bg-N10">
                  {Array.from({ length: 16 }).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Checkbox
                        id={`${cat.id}-perm-${idx}`}
                        label={
                          <Typography variant="c-s" color="N700">
                            Permission 1
                          </Typography>
                        }
                      />
                    </div>
                  ))}
                </div>
              </AccordionWrapper>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-N30 flex justify-end gap-3 bg-white">
        <Button variant="secondary" onClick={onClose} size="sm">
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={() => console.log("Saving Role...", roleName)}
        >
          {initialData ? "Update Role" : "Create New Role"}
        </Button>
      </div>
    </div>
  );
}

export default EditOrCreateRole;
