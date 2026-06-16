"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, notify } from "@/components";
import { useUpdateUserByIdMutation } from "@/redux/api/users";
import { getErrorMessage } from "@/utils/getErrorMessges";
import type { CustomerRow } from "./tableRow";

interface EditCustomerFormProps {
  customer: CustomerRow;
  onClose: () => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

export const EditCustomerForm: React.FC<EditCustomerFormProps> = ({
  customer,
  onClose,
}) => {
  const [updateUser, { isLoading }] = useUpdateUserByIdMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    values: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone === "—" ? "" : customer.phone,
      city: customer.city ?? "",
      country: customer.country ?? "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await updateUser({
        id: customer._id,
        user: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phone || undefined,
          city: data.city || undefined,
          country: data.country || undefined,
        },
      }).unwrap();
      notify.success({
        message: "Customer updated",
        subtitle: `${data.firstName} ${data.lastName}'s details were saved`,
      });
      onClose();
    } catch (err) {
      notify.error({ message: "Update failed", subtitle: getErrorMessage(err) });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="First Name"
            name="firstName"
            register={register}
            placeholder="Enter first name"
            flexStyle="col"
            error={!!errors.firstName}
          />
          <TextField
            label="Last Name"
            name="lastName"
            register={register}
            placeholder="Enter last name"
            flexStyle="col"
            error={!!errors.lastName}
          />
        </div>

        <TextField
          label="Email Address"
          name="email"
          type="email"
          register={register}
          placeholder="Enter email"
          flexStyle="col"
          error={!!errors.email}
        />

        <TextField
          label="Phone Number"
          name="phone"
          register={register}
          placeholder="Enter phone number"
          flexStyle="col"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="City"
            name="city"
            register={register}
            placeholder="City"
            flexStyle="col"
          />
          <TextField
            label="Country"
            name="country"
            register={register}
            placeholder="Country"
            flexStyle="col"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-N30">
        <Button variant="secondary" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
};
