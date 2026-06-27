"use client";

import React, { forwardRef } from "react";

import Select, {
  components,
  type OptionProps,
  type SingleValueProps,
} from "react-select";
import CreatableSelect from "react-select/creatable";

const menuPortalTarget =
  typeof document !== "undefined"
    ? (document.getElementById("select-portal") ?? document.body)
    : undefined;

import { Avatar } from "../avatar";
import { Typography } from "../typography";
import { ValidationText } from "../validationText";

export interface OptionType {
  label: string;
  value: string | number;
  icon?: string;
  subLabel?: string;
}

interface SMSelectDropDownProps {
  options?: OptionType[];
  varient?: "simple" | "custom";
  onChange?: (value: OptionType) => void;
  selectWidth?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
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
  name?: string;
  creatable?: boolean;
  isClearable?: boolean;
  size?: "sm" | "md";
}

const selectStyles = ({
  isError,
  bgColor = false,
  size = "md",
}: {
  isError: boolean;
  bgColor?: boolean;
  size?: "sm" | "md";
}) => {
  const minHeight = size === "sm" ? "32px" : "40px";
  const fontSize = size === "sm" ? "13px" : "14px";
  return {
    input: (styles: any) => ({
      ...styles,
      "&:not(.aui-no-focusvisible) :focus-visible": {
        boxShadow: "none",
        border: "none",
      },
    }),

    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999,
      pointerEvents: "auto",
    }),
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
      minHeight,
      fontSize,
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
      whiteSpace: "wrap",
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
      fontSize,
      fontWeight: 400,
      lineHeight: "20px",
      color: "var(--color-N80)",
    }),
    valueContainer: (styles: any) => ({
      ...styles,
      borderLeft: "none",
      fontSize,
      minHeight,
      padding: size === "sm" ? "0 6px" : "2px 8px",
    }),
    indicatorSeparator: (styles: any) => ({
      ...styles,
      display: "none",
      fontSize,
    }),
    dropdownIndicator: (styles: any) => ({
      ...styles,
      color: "var(--color-N500)",
      fontSize,
      padding: size === "sm" ? "4px" : "8px",
    }),
    autosizeInput: (styles: any) => ({
      ...styles,
      "&:not(.aui-no-focusvisible) :focus-visible": {
        boxShadow: "none",
      },
    }),
  };
};

export const SMSelectDropDown = forwardRef<any, SMSelectDropDownProps>(
  (
    {
      options = [
        { label: "Un-appraised", value: "Un-appraised" },
        { label: "In-progress", value: "In-progress" },
        { label: "completed", value: "completed" },
      ],
      varient = "simple",
      bgColor = false,
      onChange = () => {},
      defaultValue,
      placeholder,
      disabled,
      loading,
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
      name,
      creatable = false,
      isClearable = false,
      size = "md",
    },
    ref,
  ) => {
    const SelectComp: any = creatable ? CreatableSelect : Select;

    const handleChange = async (value: OptionType) => {
      const awaitedValue = await value;
      onChange(awaitedValue);
    };

    const customOption = (props: OptionProps<OptionType>) => (
      <components.Option {...props}>
        <div className="flex items-center gap-1">
          {props.data.icon && (
            <Avatar
              fullname={props?.data?.label}
              src={props?.data?.icon}
              size={"sm"}
            />
          )}
          <span className="whitespace-nowrap">{props.data.label}</span>
        </div>
      </components.Option>
    );

    const customSingleValue = (props: SingleValueProps<OptionType>) => (
      <div className="flex items-center gap-1">
        {props.data.icon && (
          <Avatar
            fullname={props?.data?.label}
            src={props?.data?.icon}
            size={"sm"}
          />
        )}
        <span className="whitespace-nowrap">{props?.data?.label}</span>
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
        <div className={`${flexStyle === "row" && "col-span-9"}`}>
          <SelectComp
            ref={ref}
            options={options}
            onChange={handleChange}
            placeholder={placeholder}
            isDisabled={disabled}
            isLoading={loading}
            value={value}
            defaultInputValue={defaultInputValue}
            defaultValue={defaultValue}
            isSearchable={searchable}
            isClearable={isClearable}
            id={id}
            name={name}
            isMulti={isMulti}
            menuPortalTarget={menuPortalTarget}
            menuPosition="fixed"
            styles={selectStyles({ isError, bgColor, size })}
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

SMSelectDropDown.displayName = "SMSelectDropDown";
