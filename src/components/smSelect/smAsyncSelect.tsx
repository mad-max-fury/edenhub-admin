"use client";

import React, { forwardRef } from "react";
import { cn } from "@/utils/helpers";
import {
  components,
  type OptionProps,
  type SingleValueProps,
} from "react-select";
import AsyncSelect from "react-select/async";

const menuPortalTarget =
  typeof document !== "undefined"
    ? (document.getElementById("select-portal") ?? document.body)
    : undefined;

import { Avatar } from "../avatar";
import { Typography } from "../typography";
import { ValidationText } from "../validationText";
import { type OptionType } from "./smSelect";

interface SmAsyncSelectProps {
  loadOptions: (inputValue: string) => void;
  varient?: "simple" | "custom";
  onChange?: (value: OptionType) => void;
  selectWidth?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultInputValue?: OptionType;
  defaultValue?: OptionType | OptionType[] | null;
  value?: OptionType | OptionType[] | null;
  bgColor?: boolean;
  searchable?: boolean;
  id?: string;
  width?: string;
  isError?: boolean;
  errorText?: string;
  field?: any;
  label?: React.ReactNode | string;
  flexStyle?: "col" | "row";
  isMulti?: boolean;
}

const selectStyles = ({
  isError,
  bgColor = false,
}: {
  isError: boolean;
  bgColor?: boolean;
}) => ({
  input: (styles: any) => ({
    ...styles,
    "&:not(.aui-no-focusvisible) :focus-visible": {
      boxShadow: "none",
      border: "none",
    },
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999, pointerEvents: "auto" }),
  menu: (provided: any) => ({
    ...provided,
    overflowY: "auto",
    scrollbarColor: "transparent",
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: "7px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent !important",
      borderRadius: "2.5px",
      height: "50px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent !important",
      borderBottomRightRadius: "16px",
    },
    "&::-webkit-scrollbar-thumb, &::-webkit-scrollbar-track": {
      background: "transparent",
    },
  }),
  control: (
    styles: any,
    { isDisabled, isFocused }: { isDisabled: boolean; isFocused: boolean },
  ) => ({
    ...styles,
    borderRadius: "4px",
    outline: "none",
    cursor: "pointer",
    // Apply focused border at the top level, not just inside &:hover
    border: isError
      ? "1px solid var(--color-R400)"
      : isFocused
        ? "1px solid var(--color-BR400)"
        : "1px solid var(--color-N40)",
    // Kill react-select's default blue box-shadow focus ring
    boxShadow: "none",
    minHeight: "40px",
    width: "100%",
    color: "var(--color-N80)",
    backgroundColor:
      isDisabled || bgColor ? "var(--color-N20)" : "var(--color-N0)",
    "&:hover": {
      border: isError
        ? "1px solid var(--color-R400)"
        : "1px solid var(--color-BR400)",
      boxShadow: "none",
    },
  }),
  option: (
    styles: any,
    {
      isDisabled,
      isFocused,
      isSelected,
    }: { isDisabled: boolean; isFocused: boolean; isSelected: boolean },
  ) => ({
    ...styles,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    cursor: "pointer",
    // Selected: brown text; disabled: muted; default: dark
    color: isDisabled
      ? "var(--color-N80)"
      : isSelected
        ? "var(--color-BR500)"
        : "var(--color-N800)",
    textWrap: "nowrap",
    // Selected: light brown bg; disabled: light grey; default: white
    backgroundColor: isDisabled
      ? "var(--color-N20)"
      : isSelected
        ? "var(--color-LB75)"
        : "var(--color-N0)",
    "&:hover": {
      // Hover: very light brown; keep selected bg consistent
      backgroundColor: isSelected ? "var(--color-LB75)" : "var(--color-LB50)",
      color: isDisabled ? "var(--color-N80)" : "var(--color-BR500)",
    },
  }),
  placeholder: (styles: any) => ({
    ...styles,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    color: "var(--color-N80)",
  }),
  valueContainer: (styles: any) => ({
    ...styles,
    borderLeft: "none",
    fontSize: "14px",
    minHeight: "40px",
  }),
  indicatorSeparator: (styles: any) => ({
    ...styles,
    display: "none",
    fontSize: "14px",
  }),
  dropdownIndicator: (styles: any) => ({
    ...styles,
    color: "var(--color-N500)",
    fontSize: "14px",
  }),
  autosizeInput: (styles: any) => ({
    ...styles,
    "&:not(.aui-no-focusvisible) :focus-visible": {
      boxShadow: "none",
    },
  }),
});

export const SmAsyncSelect = forwardRef<any, SmAsyncSelectProps>(
  (
    {
      loadOptions,
      varient = "simple",
      bgColor = false,
      onChange = () => {},
      defaultValue,
      placeholder,
      disabled,
      defaultInputValue,
      value,
      searchable,
      id,
      label,
      flexStyle,
      isError = false,
      errorText = "",
      field,
      isMulti = false,
    },
    ref,
  ) => {
    const handleChange = (value: OptionType) => {
      onChange(value);
    };

    const customOption = (props: OptionProps<OptionType>) => (
      <components.Option {...props}>
        <div className="flex items-center gap-2">
          <Avatar
            fullname={props?.data?.label}
            src={props?.data?.icon}
            size={"sm"}
          />
          <div>
            <Typography variant="p-s" fontWeight="regular" color={"N700"}>
              {props.data.label}
            </Typography>
            {props.data.subLabel && (
              <Typography variant="p-s" fontWeight="regular" color={"N200"}>
                {props.data.subLabel}
              </Typography>
            )}
          </div>
        </div>
      </components.Option>
    );

    const customSingleValue = (props: SingleValueProps<OptionType>) => (
      <div className="sig flex items-center gap-2">
        <Avatar
          fullname={props?.data?.label}
          src={props?.data?.icon}
          size={"sm"}
        />
        <div>
          <Typography variant="p-s" fontWeight="regular" color={"N700"}>
            {props.data.label}
          </Typography>
        </div>
      </div>
    );

    return (
      <div
        className={`${
          flexStyle === "row"
            ? "items-center md:grid md:grid-cols-12"
            : "w-full"
        }`}
      >
        {label && label.toString().length > 0 && (
          <Typography
            variant="h-s"
            fontWeight="medium"
            color={"N700"}
            className={`${
              flexStyle === "row" ? "col-span-3" : "mb-2"
            } cursor-pointer`}
          >
            <label>{label}</label>
          </Typography>
        )}
        <div
          tabIndex={0}
          className={cn(
            `${
              flexStyle === "row" && "col-span-9"
            } group [&:hover_div.sig]:!hidden [&_div.sig]:absolute [&_div.sig]:pl-3`,
          )}
        >
          <AsyncSelect
            ref={ref}
            loadOptions={loadOptions}
            onChange={handleChange}
            placeholder={placeholder}
            isDisabled={disabled}
            value={value}
            defaultInputValue={defaultInputValue}
            defaultOptions={true}
            defaultValue={defaultValue}
            isSearchable={searchable}
            id={id}
            isMulti={isMulti}
            menuPortalTarget={menuPortalTarget}
            menuPosition="fixed"
            styles={selectStyles({ isError, bgColor })}
            components={
              varient === "simple"
                ? {}
                : { Option: customOption, SingleValue: customSingleValue }
            }
            {...field}
          />
          {errorText.length > 0 && (
            <ValidationText status="error" message={errorText} />
          )}
        </div>
      </div>
    );
  },
);

SmAsyncSelect.displayName = "SmAsyncSelect";
