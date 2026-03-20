import {
  Button,
  notify,
  SMSelectDropDown,
  Typography,
  type OptionType,
} from "@/components";

import type { ISelectItemProps } from "@/redux/api/interface";

import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { assignRoleSchema } from "./schema";

import type { IUser } from "@/redux/api";
import { useUpdateUserByIdMutation } from "@/redux/api/users";
import type { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";

interface AssignRoleSchemaProps {
  role: ISelectItemProps;
}
interface IAssignRoleProps {
  closeModal: () => void;
  editData?: IUser | null;
  allRoles: ISelectItemProps[];
}

export const AssignRole = ({
  closeModal,
  editData,
  allRoles,
}: IAssignRoleProps) => {
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserByIdMutation();
  const employeeOptions: OptionType[] = [
    {
      label: `${editData?.firstName}   ${editData?.lastName}`,
      value: editData?.id as string,
    },
  ];

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm<AssignRoleSchemaProps>({
    resolver: yupResolver(assignRoleSchema),
    defaultValues: {
      role: {
        label: String(editData?.role.name),
        value: String(editData?.role._id),
      },
    },
  });

  const onSubmit = (values: AssignRoleSchemaProps) => {
    updateUser({
      id: editData?._id ?? "",
      user: { role: values.role.value },
    })
      .unwrap()
      .then(() => {
        notify.success({
          message: `Role Updated`,
          subtitle: `You have successfully updated ${editData?.role.name} role to ${values.role.label} `,
        });
        closeModal();
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Action failed",
          subtitle: getErrorMessage(err),
        });
      });
  };

  return (
    <form
      className="flex h-full flex-col justify-between"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="p-6">
        <div className="mb-4 grid grid-cols-1 justify-between gap-2 md:grid-cols-4">
          <Typography
            variant="h-s"
            fontWeight="medium"
            color={"N700"}
            className={`col-span-1 my-auto cursor-pointer mmd:my-[unset]`}
          >
            Staff
          </Typography>
          <div className="col-span-3">
            <SMSelectDropDown
              options={employeeOptions}
              defaultValue={employeeOptions[0]}
              disabled
              placeholder="Select an option"
              isMulti={false}
              searchable={true}
            />
          </div>
        </div>
        <div className="mb-4 grid grid-cols-1 justify-between gap-2 md:grid-cols-4">
          <Typography
            variant="h-s"
            fontWeight="medium"
            color={"N700"}
            className={`col-span-1 cursor-pointer mmd:my-[unset]`}
          >
            Role
          </Typography>
          <div className="col-span-3 grid grid-cols-1 gap-4">
            <div>
              <SMSelectDropDown
                options={allRoles}
                varient="simple"
                onChange={(selectedOption) => {
                  fieldSetterAndClearer({
                    value: selectedOption,
                    setterFunc: setValue,
                    setField: "role",
                    clearErrors,
                  });
                }}
                value={watch("role")}
                placeholder="Assign role"
                searchable={true}
                isError={!!errors.role}
                errorText={errors.role?.message}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 border-t border-solid border-N40 bg-N0 px-6 py-4">
        <Button
          variant={"secondary"}
          type="button"
          className="msm:w-full"
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button variant={"primary"} className="msm:w-full" loading={isUpdating}>
          {editData ? "Save" : "Assign Role"}
        </Button>
      </div>
    </form>
  );
};
