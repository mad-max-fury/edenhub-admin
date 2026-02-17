"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, SMSelectDropDown, Typography } from "@/components";

export const SendEmailForm: React.FC<{
  customer: any;
  onClose: () => void;
}> = ({ customer, onClose }) => {
  const { register, handleSubmit, control } = useForm({
    values: {
      heading: "",
      body: "",
      mailType: { label: "Welcome Email", value: "welcome" },
      greeting: `Hi ${customer.name.split(" ")[0]},`,
      footer: "Best regards, The Management Team",
    },
  });

  const mailOptions = [
    { label: "Welcome Email", value: "welcome" },
    { label: "Advertisement (Adz)", value: "adz" },
    { label: "Plain Message", value: "plain" },
    { label: "Order Status Update", value: "order_status" },
    { label: "Complaint Resolution", value: "complaint" },
    { label: "Reply to Inquiry", value: "reply" },
  ];

  const onSubmit = (data: any) => {
    console.log("Sending Email Payload:", data);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-6">
      <Controller
        name="mailType"
        control={control}
        render={({ field }) => (
          <SMSelectDropDown
            {...field}
            label="Email Type"
            placeholder="Select mail type"
            options={mailOptions}
            flexStyle="col"
          />
        )}
      />

      <TextField
        label="Heading"
        name="heading"
        register={register}
        placeholder="Enter email subject/heading"
        flexStyle="col"
      />

      <TextField
        label="Greeting"
        name="greeting"
        register={register}
        placeholder="e.g. Dear Customer,"
        flexStyle="col"
      />

      <TextField
        label="Email Body"
        name="body"
        inputType="textarea"
        register={register}
        placeholder="Type your message content here..."
        flexStyle="col"
      />

      <TextField
        label="Footer"
        name="footer"
        register={register}
        placeholder="Enter email sign-off"
        flexStyle="col"
      />

      <div className="flex justify-end gap-3 pt-6 border-t border-N30">
        <Button variant="secondary" onClick={onClose} type="button">
          Discard
        </Button>
        <Button type="submit">Send Message</Button>
      </div>
    </form>
  );
};
