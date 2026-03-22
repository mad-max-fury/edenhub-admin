import { TextField, SMSelectDropDown, Button, notify } from "@/components";
import { Controller, useForm } from "react-hook-form";
import { addUserSchema, type AddUserFormData } from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import {
  useOnboardUserMutation,
  useUpdateUserByIdMutation,
} from "@/redux/api/users";
import { getErrorMessage } from "@/utils/getErrorMessges";
import type { ISelectItemProps } from "@/redux/api/interface";

interface AddUserFormProps {
  onClose: () => void;
  initialData?: Partial<AddUserFormData & { id: string }> | null;
  roles: ISelectItemProps[];
}

const AddUserForm = ({ onClose, initialData, roles }: AddUserFormProps) => {
  const isEditMode = !!initialData;

  const initValues = useMemo(() => {
    const emptyDefaults: AddUserFormData = {
      firstName: "",
      email: "",
      lastName: "",
      role: roles[0],
    };
    if (initialData) return initialData as AddUserFormData;
    return emptyDefaults;
  }, [initialData]);

  const [onboardUser, { isLoading: isCreating }] = useOnboardUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserByIdMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddUserFormData>({
    resolver: yupResolver(addUserSchema),
    values: initValues,
  });

  const onSubmit = async (data: AddUserFormData) => {
    const { role, ...rest } = data;
    try {
      if (isEditMode) {
        await updateUser({
          id: initialData.id || "",
          user: { ...rest, role: role.value },
        }).unwrap();
        return notify.success({
          message: "User updated successfully",
          subtitle: "Great Job!",
        });
      } else {
        await onboardUser({ ...rest, role: role.value }).unwrap();
      }
      onClose();
    } catch (error) {
      notify.error({
        message: "Action failed",
        subtitle: getErrorMessage(error),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 gap-x-4 gap-y-6">
        <TextField
          label="First Name"
          name={"firstName"}
          type="text"
          register={register}
          placeholder="e.g. Ndubuisi"
          flexStyle="col"
          error={!!errors.lastName}
          errorText={errors.lastName?.message}
        />

        <TextField
          label="Last Name"
          name={"lastName"}
          type="text"
          register={register}
          placeholder="e.g. Obinna"
          flexStyle="col"
          error={!!errors.lastName}
          errorText={errors.lastName?.message}
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

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <SMSelectDropDown
              label="ASSIGN ROLE"
              placeholder="Select user role"
              options={roles}
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
        <Button
          size="sm"
          type="submit"
          disabled={isUpdating || isCreating}
          loading={isCreating || isUpdating}
        >
          {isEditMode ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
};

export default AddUserForm;
