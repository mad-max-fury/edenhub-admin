import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography, TextField, Button, Avatar } from "@/components";
import { ProfileSchema, type IProfilePayload } from "./schema";

const ProfileSettings = () => {
  const [profileImage, setProfileImage] = useState<string | null>(
    "https://via.placeholder.com/150",
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IProfilePayload>({
    resolver: yupResolver(ProfileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "Prince",
      lastName: "Chijioke",
      email: "princeugbuta17@gmail.com",
      phone: "+2349038283447",
      country: "Nigeria",
      state: "Enugu State",
      city: "Enugu",
    },
  });

  const onSubmit = (data: IProfilePayload) => {
    // Combine form data with the profile image for the API request
    const payload = { ...data, profileImage };
    console.log("Submitting Profile Update:", payload);
  };

  // Logic for Avatar component's upload prop
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageDelete = () => {
    setProfileImage(null);
  };

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700">
      <div>
        <Typography variant="h-m" fontWeight="bold">
          Profile Settings
        </Typography>
        <Typography variant="p-s" color="N600">
          Your Personal Information.
        </Typography>
      </div>

      <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-N30">
        <Avatar
          fullname="Prince Chijioke"
          size="xxl"
          src={profileImage}
          onFileUpload={handleImageUpload}
          onFileDelete={handleImageDelete}
          upload={false}
        />
        <div className="flex flex-col gap-1 grow">
          <Typography variant="h-s" fontWeight="medium">
            Profile Picture
          </Typography>
          <Typography variant="p-s" color="N500">
            PNG, JPG under 2MB
          </Typography>
        </div>
        <div className="flex gap-3">
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
          <Button
            variant="brown-light"
            className="!bg-[#74594D] !text-white px-6 font-bold"
            onClick={() => document.getElementById("avatar-upload")?.click()}
          >
            Upload new picture
          </Button>
          <Button
            variant="secondary"
            className="!bg-[#E5E7EB] !border-none px-6 text-N700 font-bold"
            onClick={handleImageDelete}
          >
            Delete
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <Typography variant="h-m" fontWeight="bold">
          Personal Information
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <TextField
            label="First Name"
            name="firstName"
            register={register}
            placeholder="Prince"
            error={!!errors.firstName}
            errorText={errors.firstName?.message}
          />
          <TextField
            label="Last Name"
            name="lastName"
            register={register}
            placeholder="Chijioke"
            error={!!errors.lastName}
            errorText={errors.lastName?.message}
          />
          <TextField
            label="Email Address"
            name="email"
            type="email"
            register={register}
            placeholder="princeugbuta17@gmail.com"
            error={!!errors.email}
            errorText={errors.email?.message}
          />
          <TextField
            label="Phone Number"
            name="phone"
            register={register}
            placeholder="+2349038283447"
            error={!!errors.phone}
            errorText={errors.phone?.message}
          />
          <TextField
            label="Country"
            name="country"
            register={register}
            placeholder="Nigeria"
            error={!!errors.country}
            errorText={errors.country?.message}
          />
          <TextField
            label="State"
            name="state"
            register={register}
            placeholder="Enugu State"
            error={!!errors.state}
            errorText={errors.state?.message}
          />
          <TextField
            label="City"
            name="city"
            register={register}
            placeholder="Enugu"
            error={!!errors.city}
            errorText={errors.city?.message}
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full md:w-auto px-10 !border-[#74594D] !text-[#74594D] hover:!bg-[#74594D] hover:!text-white font-bold"
            types="outline"
            loading={isSubmitting}
          >
            Save profile settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
