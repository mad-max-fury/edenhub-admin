import {
  Checkbox,
  TextField,
  Typography,
  Button,
  NetworkError,
  Spinner,
  notify,
} from "@/components";
import AccordionWrapper from "@/components/accordions/AccordionWrapper";
import type { IApiError } from "@/redux/api/genericInterface";
import { type IGroup, useGetGroupsUnpaginatedQuery } from "@/redux/api/groups";
import type { IPermission } from "@/redux/api/permissions";
import {
  useCreateRoleMutation,
  useUpdateRoleByIdMutation,
  type ICreateRole,
  type IRole,
} from "@/redux/api/roles";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { schema } from "./schema";

type Props = {
  initialData?: IRole;
  onClose: () => void;
};

interface CreateRoleSchemaProps {
  name: string;
}

function EditOrCreateRole({ initialData, onClose }: Props) {
  const [isActive, setIsActive] = useState(0);

  const { data, isLoading, isFetching, isError, refetch, error } =
    useGetGroupsUnpaginatedQuery();

  const [selectedGroups, setSelectedGroups] = useState<IGroup[]>([]);

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleByIdMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoleSchemaProps>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name ?? "",
    },
  });

  useEffect(() => {
    if (data?.data) {
      const initialSelection = data.data.map((group) => {
        const savedGroup = initialData?.groups?.find(
          (g) => g.id._id === group._id,
        );
        const savedPermissions = initialData?.permissions.filter((el) =>
          savedGroup?.permissionsId.includes(el._id),
        );
        return {
          ...group,
          permissions: savedGroup ? (savedPermissions as IPermission[]) : [],
        };
      });
      setSelectedGroups(initialSelection);
    }
  }, [data, initialData]);

  const handleGroupCheck = (id: string, isChecked: boolean) => {
    const originalGroup = data?.data.find((g) => g._id === id);
    if (!originalGroup) return;

    setSelectedGroups((prev) =>
      prev.map((group) =>
        group._id === id
          ? {
              ...group,
              permissions: isChecked ? [...originalGroup.permissions] : [],
            }
          : group,
      ),
    );
  };

  const handlePermissionCheck = (
    groupId: string,
    permission: IPermission,
    isChecked: boolean,
  ) => {
    setSelectedGroups((prev) =>
      prev.map((group) => {
        if (group._id !== groupId) return group;

        return {
          ...group,
          permissions: isChecked
            ? [...group.permissions, permission]
            : group.permissions.filter((p) => p?._id !== permission._id),
        };
      }),
    );
  };

  const isMenuFullyChecked = (id: string) => {
    const group = selectedGroups.find((g) => g._id === id);
    const originalGroup = data?.data.find((g) => g._id === id);
    return (
      !!group &&
      !!originalGroup &&
      originalGroup.permissions.length > 0 &&
      group.permissions.length === originalGroup.permissions.length
    );
  };

  const isMenuPartiallyChecked = (id: string) => {
    const group = selectedGroups.find((g) => g._id === id);
    const originalGroup = data?.data.find((g) => g._id === id);
    return (
      !!group &&
      !!originalGroup &&
      group.permissions.length > 0 &&
      group.permissions.length < originalGroup.permissions.length
    );
  };

  const onSubmit: SubmitHandler<CreateRoleSchemaProps> = (values) => {
    const groupPayload = selectedGroups
      .filter((g) => g.permissions.length > 0)
      .map((el) => ({
        id: el._id,
        permissionsId: el.permissions.map((p) => p?._id as string),
      }));

    const flatPermissions = groupPayload.flatMap((g) => g.permissionsId);

    const formattedValues: ICreateRole = {
      name: values.name,
      groups: groupPayload,
      permissions: flatPermissions,
      isActive: true,
    };

    if (!initialData) {
      createRole(formattedValues)
        .unwrap()
        .then(() => {
          notify.success({
            message: `Added Successfully`,
            subtitle: `You have successfully created ${values.name}`,
          });
          onClose();
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });
    } else {
      updateRole({
        id: initialData._id,
        ...formattedValues,
      })
        .unwrap()
        .then(() => {
          notify.success({
            message: `Updated Successfully`,
            subtitle: `You have successfully updated ${values.name}`,
          });
          onClose();
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Action failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
  };

  if (isError) {
    return (
      <div className="py-6 w-full">
        <NetworkError isFetching={isFetching} error={error} refetch={refetch} />
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full animate-in fade-in duration-500"
    >
      <div className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex flex-col gap-2 p-6">
          <TextField
            name="name"
            inputType="input"
            id="name"
            placeholder="Role Name: e.g. Administrator"
            type={"text"}
            register={register}
            error={!!errors.name}
            errorText={errors.name && errors.name.message}
          />
        </div>

        <hr className="border-N30" />

        <div className="flex flex-col gap-4 px-6">
          <div className="flex flex-col gap-1 rounded-lg overflow-hidden">
            {data?.data?.map((group, index) => (
              <AccordionWrapper
                key={group._id}
                isOpen={isActive === index}
                toggleAccordion={() => setIsActive(index)}
                title={
                  <div className="flex items-center gap-3">
                    <Checkbox
                      label={
                        <Typography variant="p-s" fontWeight="bold">
                          {group.name}
                        </Typography>
                      }
                      checked={isMenuFullyChecked(group._id)}
                      indeterminate={isMenuPartiallyChecked(group._id)}
                      onSelect={(e) =>
                        handleGroupCheck(group._id, e.target.checked)
                      }
                      disabled={group.permissions.length === 0}
                    />
                  </div>
                }
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 p-4 bg-N10 border-t border-N30">
                  {group.permissions.map((permission) => (
                    <div
                      key={permission?._id}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        label={
                          <Typography variant="c-s" color="N700">
                            {permission?.name}
                          </Typography>
                        }
                        checked={
                          !!selectedGroups
                            .find((g) => g._id === group._id)
                            ?.permissions.find(
                              (p) => p?._id === permission?._id,
                            )
                        }
                        onSelect={(e) =>
                          handlePermissionCheck(
                            group._id,
                            permission as IPermission,
                            e.target.checked,
                          )
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
        <Button size="sm" type="submit" loading={isCreating || isUpdating}>
          {initialData ? "Save Changes" : "Create New Role"}
        </Button>
      </div>
    </form>
  );
}

export default EditOrCreateRole;
