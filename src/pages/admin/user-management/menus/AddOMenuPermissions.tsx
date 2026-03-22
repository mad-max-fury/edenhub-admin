import { Button, notify, SMSelectDropDown, Typography } from "@/components";

import { getErrorMessage } from "@/utils/getErrorMessges";
import { fieldSetterAndClearer } from "@/utils/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { addPermissionsSchema } from "./schema";
import { useAddPermissionsToGroupMutation } from "@/redux/api/groups";
import type {
  ISelectItemProps,
  ISelectItemPropsWithValueGeneric,
} from "@/redux/api/interface";
import type { IApiError } from "@/redux/api/genericInterface";

interface IAddProps {
  closeModal: () => void;
  allPermission: ISelectItemPropsWithValueGeneric[];
  groupId: string;
}

interface IAddPayload {
  permissions: ISelectItemProps[];
}

export const AddOMenuPermissions = ({
  closeModal,
  allPermission,
  groupId,
}: IAddProps) => {
  const [addPermissionsToGroup, { isLoading }] =
    useAddPermissionsToGroupMutation();
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
  } = useForm<IAddPayload>({
    resolver: yupResolver(addPermissionsSchema),
  });

  const onSubmit = (values: IAddPayload) => {
    addPermissionsToGroup({
      id: groupId,
      permissionsId: values.permissions.map((permission) =>
        permission.value.toString(),
      ),
    })
      .unwrap()
      .then(() => {
        notify.success({
          message: `Added Successfully`,
          subtitle: `You have successfully added ${values.permissions.map((claim) => claim.label).join(", ")} to this group`,
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
        <div className="mb-6">
          <div className="mb-4 grid grid-cols-1 justify-between gap-2 md:grid-cols-4">
            <Typography
              variant="h-s"
              fontWeight="medium"
              color={"N700"}
              className={`col-span-1 my-auto cursor-pointer mmd:my-[unset]`}
            >
              Permissions
            </Typography>
            <div className="col-span-3">
              <SMSelectDropDown
                options={allPermission}
                varient="simple"
                placeholder="Search Permissions"
                onChange={(selectedOption) => {
                  fieldSetterAndClearer({
                    value: selectedOption,
                    setterFunc: setValue,
                    setField: "permissions",
                    clearErrors,
                  });
                }}
                value={watch("permissions")}
                isMulti={true}
                searchable={true}
                isError={!!errors.permissions}
                errorText={errors.permissions?.message}
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
        <Button
          variant={"primary"}
          className="msm:w-full"
          type="submit"
          loading={isLoading}
        >
          {"Add Permissions"}
        </Button>
      </div>
    </form>
  );
};
