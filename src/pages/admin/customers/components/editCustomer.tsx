"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Typography, SMSelectDropDown } from "@/components";

interface EditCustomerFormProps {
  customer: any;
  onClose: () => void;
}

export const EditCustomerForm: React.FC<EditCustomerFormProps> = ({
  customer,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    values: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      subscription: {
        label: customer.subscription,
        value: customer.subscription,
      },
    },
  });

  const onSubmit = (data: any) => {
    console.log("Updating Customer Data:", data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-5">
        <TextField
          label="Full Name"
          name="name"
          register={register}
          placeholder="Enter full name"
          flexStyle="col"
          error={!!errors.name}
        />

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

        <SMSelectDropDown
          label="Subscription"
          flexStyle="col"
          defaultValue={{
            label: customer.subscription,
            value: customer.subscription,
          }}
          options={[
            { label: "Subscribed", value: "Subscribed" },
            { label: "Not Subscribed", value: "Not Subscribed" },
          ]}
        />

        <TextField
          label="Residential Address"
          name="address"
          inputType="textarea"
          register={register}
          placeholder="Enter full address"
          flexStyle="col"
          // cols={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-N30">
        <Button variant="secondary" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
};
