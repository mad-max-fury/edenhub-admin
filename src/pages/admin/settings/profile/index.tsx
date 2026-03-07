import { useState, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";

import { Typography, TextField, Button, Avatar, notify } from "@/components";
import { ProfileSchema, type IProfilePayload } from "./schema";
import { getErrorMessage } from "@/utils/getErrorMessges";

import type { RootState } from "@/redux/stores";
import { updateUser as updateUserAction } from "@/redux/api/auth/authSlice";
import { useUpdateUserByIdMutation } from "@/redux/api/users";
import {
  useDeleteResourceMutation,
  useUploadMutation,
} from "@/redux/api/resources";

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserByIdMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadMutation();
  const [deleteFile, { isLoading: isDeleting }] = useDeleteResourceMutation();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const isGlobalLoading = isUpdating || isUploading || isDeleting;

  const defaultValues = useMemo(
    () => ({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phoneNumber || "",
      country: user?.country || "",
      state: user?.state || "",
      city: user?.city || "",
    }),
    [user],
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProfilePayload>({
    resolver: yupResolver(ProfileSchema),
    mode: "onChange",
    values: defaultValues,
  });

  const onSubmit = async (data: IProfilePayload) => {
    try {
      const response = await updateUser({
        id: user?._id || "",
        user: data,
      }).unwrap();

      console.log(response);

      dispatch(updateUserAction(response.data.data));

      notify.success({
        message: "Profile updated successfully",
        subtitle: "Looking great",
      });
    } catch (error) {
      notify.error({
        message: "Update failed",
        subtitle: getErrorMessage(error),
      });
    }
  };

  const handleImageUpload = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPreviewImage(objectUrl);

    try {
      const res = await uploadFile({
        file,
        params: { type: "profiles" },
      }).unwrap();

      const newAvatarUrl = res.data.url;
      await updateUser({
        id: user?._id || "",
        user: { profilePicture: newAvatarUrl },
      }).unwrap();

      dispatch(updateUserAction({ profilePicture: newAvatarUrl }));
      notify.success({
        message: "Profile picture updated",
        subtitle: "your new look, looks good!",
      });
    } catch (error) {
      setPreviewImage(null);
      notify.error({
        message: "Upload failed",
        subtitle: getErrorMessage(error),
      });
    }
  };

  const handleImageDelete = async () => {
    if (!user?.profilePicture) return;

    try {
      await deleteFile({ key: user.profilePicture }).unwrap();

      await updateUser({
        id: user._id,
        user: { profilePicture: "" },
      }).unwrap();

      dispatch(updateUserAction({ profilePicture: "" }));
      setPreviewImage(null);
      notify.info({
        message: "Profile picture removed",
        subtitle: "you have successfully removed your profile picture",
      });
    } catch (error) {
      notify.error({
        message: "Delete failed",
        subtitle: getErrorMessage(error),
      });
    }
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      <header>
        <Typography variant="h-m" fontWeight="bold">
          Profile Settings
        </Typography>
        <Typography variant="p-s" color="N600">
          Update your personal information and profile picture.
        </Typography>
      </header>

      <section className="flex flex-wrap items-center gap-6 pb-8 border-b border-N30">
        <Avatar
          fullname={`${user?.firstName} ${user?.lastName}`}
          size="xxl"
          src={previewImage || user?.profilePicture || ""}
          onFileUpload={handleImageUpload}
          loading={isDeleting || isUploading}
          fileInputRef={fileInputRef}
          upload
        />
        <div className="flex flex-col gap-1 grow">
          <Typography variant="h-s" fontWeight="medium">
            Profile Picture
          </Typography>
          <Typography variant="p-s" color="N500">
            WEBP, PNG, or JPG. Optimized automatically.
          </Typography>
        </div>

        <div className="flex gap-3">
          <Button
            variant="brown-light"
            className="!bg-[#74594D] !text-white px-6 font-bold"
            onClick={() => fileInputRef.current?.click()}
            disabled={isGlobalLoading}
            loading={isUploading}
          >
            Upload New
          </Button>
          <Button
            variant="secondary"
            className="!bg-[#E5E7EB] !border-none px-6 text-N700 font-bold"
            onClick={handleImageDelete}
            disabled={isGlobalLoading || !user?.profilePicture}
            loading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <Typography variant="h-m" fontWeight="bold">
          Personal Information
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <TextField
            label="First Name"
            name="firstName"
            register={register}
            error={!!errors.firstName}
            errorText={errors.firstName?.message}
          />
          <TextField
            label="Last Name"
            name="lastName"
            register={register}
            error={!!errors.lastName}
            errorText={errors.lastName?.message}
          />
          <TextField
            label="Email Address"
            name="email"
            type="email"
            register={register}
            disabled
            error={!!errors.email}
            errorText={errors.email?.message}
          />
          <TextField
            label="Phone Number"
            name="phone"
            register={register}
            error={!!errors.phone}
            errorText={errors.phone?.message}
          />
          <TextField
            label="Country"
            name="country"
            register={register}
            error={!!errors.country}
            errorText={errors.country?.message}
          />
          <TextField
            label="State"
            name="state"
            register={register}
            error={!!errors.state}
            errorText={errors.state?.message}
          />
          <TextField
            label="City"
            name="city"
            register={register}
            error={!!errors.city}
            errorText={errors.city?.message}
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full md:w-auto px-10 !border-[#74594D] !text-[#74594D] hover:!bg-[#74594D] hover:!text-white font-bold"
            types="outline"
            loading={isUpdating}
            disabled={isGlobalLoading}
          >
            Save Profile Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
