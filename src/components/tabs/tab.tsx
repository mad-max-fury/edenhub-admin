"use client";

import React, { type CSSProperties, useEffect, useRef, useState } from "react";
import { AngleLeft, AngleRight, InfoIcon } from "@/assets/svgs";
import { Button, Typography } from "@/components";
import { cn } from "@/utils/helpers";

// Type Definitions
type Tab = {
  label: string;
  query: string;
  count?: number;
  content: React.ReactNode;
  isDisabled?: boolean;
};

type SideTabProps = {
  tabs: Tab[];
  onChange: (query: string) => void;
  activeTab: string;
  title?: string;
};

type MobileTabHeaderProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (query: string) => void;
};

type DropdownMenuItem = Partial<Tab> & {
  onClick: () => void;
};

type DropdownMenuProps = {
  items: DropdownMenuItem[];
  isActive: boolean;
  activeTab: string;
};

// Main SideTab Component
const Tab: React.FC<SideTabProps> = ({ tabs, onChange, activeTab, title }) => {
  const [sliderStyle, setSliderStyle] = useState<CSSProperties>({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.query === activeTab);
    const activeTabRef = tabsRef.current[activeIndex];

    if (activeTabRef) {
      const { offsetLeft, clientWidth } = activeTabRef;

      setSliderStyle({
        position: "absolute",
        left: offsetLeft,
        bottom: -11,
        width: clientWidth,
        height: 4,
        borderRadius: 2,
        backgroundColor: "BR400",
        transition: "all 0.3s ease",
      });
    }
  }, [activeTab, tabs]);

  return (
    <div className="flex  w-full flex-col">
      <div className="w-full md:hidden">
        <MobileTabHeader
          tabs={tabs}
          activeTab={activeTab}
          onChange={onChange}
        />
      </div>
      <div className=" flex flex-col w-full gap-6">
        <div className="relative flex w-full  flex-row lg:flex mmd:hidden">
          {title && (
            <div className="flex items-center ">
              <Typography variant="p-s" fontWeight="bold" color={"N900"}>
                {title}
              </Typography>
              <InfoIcon />
            </div>
          )}
          {tabs.map((tab, index) => (
            <button
              key={tab.query}
              ref={(el) => {
                tabsRef.current[index] = el;
              }}
              onClick={() => (tab.isDisabled ? null : onChange(tab.query))}
              type="button"
              className={cn(
                "cursor-pointer px-2 py-2 text-left hover:text-BR400 uppercase",
                activeTab === tab.query
                  ? "font-medium text-BR400"
                  : tab.isDisabled
                    ? "cursor-not-allowed text-N40 hover:text-N40"
                    : "text-gray-normal",
              )}
            >
              <Typography
                fontWeight={"regular"}
                variant={"p-s"}
                className="text-[inherit]"
              >
                {tab.label} {tab.count && `(${tab.count})`}
              </Typography>
            </button>
          ))}
          <div className="absolute left-0 w-full h-[1px] bg-BR400 top-10" />

          <div
            className="absolute bottom-0 h-2 rounded-t bg-BR400 transition-all duration-300"
            style={sliderStyle}
          />
        </div>

        <div className="flex-grow mlg:mt-4">
          {tabs.find((tab) => tab.query === activeTab)?.content}
        </div>
      </div>
    </div>
  );
};

const MobileTabHeader: React.FC<MobileTabHeaderProps> = ({
  tabs,
  activeTab,
  onChange,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const referenceElement = useRef<HTMLDivElement | null>(null);

  const activeIndex = tabs.findIndex((tab) => tab.query === activeTab);

  const handlePrevious = () => {
    let newIndex = activeIndex - 1;
    while (newIndex >= 0 && tabs[newIndex]?.isDisabled) {
      newIndex--;
    }
    if (newIndex >= 0) {
      onChange(tabs[newIndex].query);
    }
  };

  const handleNext = () => {
    let newIndex = activeIndex + 1;
    while (newIndex < tabs.length && tabs[newIndex]?.isDisabled) {
      newIndex++;
    }
    if (newIndex < tabs.length) {
      onChange(tabs[newIndex].query);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        referenceElement.current &&
        !referenceElement.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [referenceElement]);

  return (
    <div className="flex items-center justify-between">
      <button onClick={handlePrevious}>
        <AngleLeft />
      </button>
      <div
        className="relative flex w-full flex-grow items-center justify-center after:absolute after:bottom-0 after:h-[2px] after:w-full after:bg-BR50 after:content-['']"
        onClick={() => setShowDropdown(!showDropdown)}
        ref={referenceElement}
      >
        <Button
          variant={"plain"}
          className="flex items-center justify-center gap-2 text-center"
        >
          <Typography color="BR400">{tabs[activeIndex]?.label}</Typography>
        </Button>

        <DropdownMenu
          items={tabs.map((tab) => ({
            ...tab,
            onClick: () => {
              onChange(tab.query);
              setShowDropdown(false);
            },
          }))}
          activeTab={activeTab}
          isActive={showDropdown}
        />
      </div>
      <button onClick={handleNext}>
        <AngleRight />
      </button>
    </div>
  );
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  isActive = false,
  activeTab,
}) => {
  return (
    <div
      className={cn(
        "absolute left-0 right-0 top-[30px] z-[10] grid w-full transition-all duration-300 ease-in-out",
        isActive
          ? "overflow-[unset] grid-rows-[1fr] pt-2"
          : "grid-rows-[0fr] overflow-hidden p-0",
      )}
    >
      <div className={cn("w-full", isActive ? "p-1" : "overflow-hidden p-0")}>
        <div className="full z-[10] border bg-white py-[10px] shadow-lg">
          {items.map((item, i) => (
            <div
              key={i}
              className={cn(
                "text-white cursor-pointer px-4 py-[10px] hover:bg-N30",
                item?.isDisabled
                  ? "cursor-not-allowed text-N40 hover:bg-none"
                  : item.query === activeTab
                    ? "bg-BR50 hover:bg-BR100"
                    : " text-N700",
              )}
              onClick={(e) => {
                e.stopPropagation();
                item?.isDisabled ? null : item.onClick();
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Tab };
