 import type { StylesConfig } from "react-select";


export const selection: readonly selection[] = [
    {label: "goat", value: "1"},
    {label: "cowt", value: "1"},
    {label: "hen", value: "2"},
    {label: "bird", value: "3"},
];

export interface selection {
  label: string;
  value: string | number;
}


export const customStyle: StylesConfig<Selection, false> = {
    control: (base) => ({
        ...base,
        border: "none",
        boxShadow: "none",
        font: "14px",
        fontFamily: "'Clash', sans-serif",
        fontWeight: 600,
        fontSize: "14px",
        lineHeight: "20.49px",
        letterSpacing: "0px",

    }),
    indicatorSeparator : (base) => ({
        ...base,
        display: "none"
    })

}
