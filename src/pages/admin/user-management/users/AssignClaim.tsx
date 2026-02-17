import React, { useEffect, useState } from "react";
import { Button, Checkbox, notify, PageLoader } from "@/components";

import { getErrorMessage } from "@/utils/getErrorMessges";

import AccordionWrapper from "@/components/accordions/AccordionWrapper";
import type { UserRow } from "./tableRow";

interface IAssignClaimProps {
  closeModal: () => void;
  toggleShowTable?: () => void;
  editData?: UserRow | null;
}

export const AssignClaim = ({ closeModal, editData }: IAssignClaimProps) => {
  const [isActive, setIsActive] = useState(0);
  // const [selectedMenus, setSelectedMenus] = useState<IMenuClaimsProps[]>([]);

  const onSubmit = () => {};

  const handleMenuCheck = (menuName: string, isChecked: boolean) => {
    // const originalMenu = data?.data.find((m) => m.menu === menuName);
    // if (!originalMenu || originalMenu.claims.length === 0) {
    //   return; // Don't update if there are no claims
    // }
    // setSelectedMenus((prev) =>
    //   prev.map((menu) =>
    //     menu.menu === menuName
    //       ? {
    //           ...menu,
    //           claims: isChecked ? originalMenu.claims : [],
    //         }
    //       : menu,
    //   ),
    // );
  };

  const handleClaimCheck = (
    menuName: string,
    claim: string,
    isChecked: boolean,
  ) => {
    // setSelectedMenus((prev) =>
    //   prev.map((menu) =>
    //     menu.menu === menuName
    //       ? {
    //           ...menu,
    //           claims: isChecked
    //             ? [...menu.claims, claim]
    //             : menu.claims.filter((c) => c !== claim),
    //         }
    //       : menu,
    //   ),
    // );
  };

  // const isMenuFullyChecked = (menuName: string) => {
  //   const menu = selectedMenus.find((m) => m.menu === menuName);
  //   const originalMenu = data?.data.find((m) => m.menu === menuName);
  //   return (
  //     menu &&
  //     originalMenu &&
  //     originalMenu.claims.length > 0 &&
  //     menu.claims.length === originalMenu.claims.length
  //   );
  // };

  // const isMenuPartiallyChecked = (menuName: string) => {
  //   const menu = selectedMenus.find((m) => m.menu === menuName);
  //   const originalMenu = data?.data.find((m) => m.menu === menuName);
  //   return (
  //     menu &&
  //     originalMenu &&
  //     menu.claims.length > 0 &&
  //     menu.claims.length < originalMenu.claims.length
  //   );
  // };

  return (
    <form className="flex h-full flex-col">
      <div className="max-h-[calc(90vh-60px)] flex-1 overflow-y-auto px-4">
        {/* {[].map((menu, index) => (
          <AccordionWrapper
            key={index}
            isOpen={isActive === index}
            toggleAccordion={() => setIsActive(index)}
            title={
              <Checkbox
                checked={isMenuFullyChecked(menu.menu)}
                indeterminate={isMenuPartiallyChecked(menu.menu)}
                label={menu.menu}
                onSelect={(e) => handleMenuCheck(menu.menu, e.target.checked)}
                disabled={menu.claims.length === 0}
              />
            }
          >
            <div className="flex w-full flex-wrap gap-6">
              {menu.claims.map((claim, claimIndex) => (
                <Checkbox
                  key={claimIndex}
                  checked={selectedMenus
                    .find((m) => m.menu === menu.menu)
                    ?.claims.includes(claim)}
                  label={claim}
                  onSelect={(e) =>
                    handleClaimCheck(menu.menu, claim, e.target.checked)
                  }
                />
              ))}
            </div>
          </AccordionWrapper>
        ))}*/}
      </div>

      <div className="flex shrink-0 justify-end gap-2 border-t border-solid border-N40 bg-N0 px-6 py-4">
        <Button
          variant={"secondary"}
          type="button"
          className="msm:w-full"
          onClick={closeModal}
        >
          Cancel
        </Button>
        <Button
          variant={"primary"}
          className="msm:w-full"
          // loading={isUpdating}
          type="button"
          onClick={onSubmit}
        >
          {editData ? "Save" : "Assign Claim"}
        </Button>
      </div>
    </form>
  );
};
