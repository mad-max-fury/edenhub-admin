import { TextField, SMSelectDropDown, Button } from "@/components";
import { Controller, useForm } from "react-hook-form";
import { addUserSchema, type AddUserFormData } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";

interface AddUserFormProps {
  onClose: () => void;
  initialData?: Partial<AddUserFormData> | null;
}

const AddUserForm = ({ onClose, initialData }: AddUserFormProps) => {
  const isEditMode = !!initialData;

  const initValues = useMemo(() => {
    const emptyDefaults: AddUserFormData = {
      fullName: "",
      email: "",
      staffId: "",
      role: { label: "Employee", value: "Employee" },
    };
    if (initialData) return initialData as AddUserFormData;
    return emptyDefaults;
  }, [initialData]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormData>({
    resolver: yupResolver(addUserSchema),
    values: initValues,
  });

  const onSubmit = (data: AddUserFormData) => {
    if (isEditMode) {
      console.log("Updating User:", data);
    } else {
      console.log("Creating User:", data);
    }
    onClose();
  };

  const roleOptions = [
    { label: "Super Admin", value: "Super Admin" },
    { label: "Admin", value: "Admin" },
    { label: "Employee", value: "Employee" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6">
        <TextField
          label="FULL NAME"
          name={"fullName"}
          type="text"
          register={register}
          placeholder="e.g. Ndubuisi Obinna"
          flexStyle="col"
          error={!!errors.fullName}
          errorText={errors.fullName?.message}
        />

        <TextField
          label="EMAIL ADDRESS"
          name="email"
          type="email"
          register={register}
          placeholder="name@company.com"
          flexStyle="col"
          error={!!errors.email}
          errorText={errors.email?.message}
          disabled={isEditMode}
        />

        <TextField
          label="STAFF ID"
          name="staffId"
          type="text"
          register={register}
          placeholder="e.g. GC-001"
          flexStyle="col"
          error={!!errors.staffId}
          errorText={errors.staffId?.message}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <SMSelectDropDown
              label="ASSIGN ROLE"
              placeholder="Select user role"
              options={roleOptions}
              field={field}
              isError={!!errors.role}
              errorText={errors.role?.message}
            />
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-N30">
        <Button variant="secondary" onClick={onClose} size="sm" type="button">
          Cancel
        </Button>
        <Button size="sm" type="submit" loading={isSubmitting}>
          {isEditMode ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
};

export default AddUserForm;
