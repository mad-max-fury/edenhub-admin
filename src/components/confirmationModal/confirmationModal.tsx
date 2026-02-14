import React from "react";

import { Button } from "../buttons";
import { Modal } from "../modal/modal";
import { Typography } from "../typography";

export type IType = "delete" | "confirm" | "warning";
interface IConfirmationProps {
  isOpen: boolean;
  closeModal: () => void;
  formTitle: string;
  message: React.ReactElement | string;
  buttonLabel: string;
  handleClick: () => void;
  type: IType;
  isLoading: boolean;
}
export const ConfirmationModal = ({
  isOpen = false,
  closeModal = () => {},
  formTitle,
  message,
  buttonLabel,
  handleClick = () => {},
  type,
  isLoading,
}: IConfirmationProps) => {
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={formTitle}
        mobileLayoutType="drawer"
      >
        <div className="flex h-full flex-col justify-between">
          {typeof message === "string" ? (
            <div className="p-6">
              <Typography variant="p-m" color="N700">
                {message}
              </Typography>
            </div>
          ) : (
            <div className="p-6">{message}</div>
          )}
          <div className="flex justify-end gap-2 border-t border-solid border-N40 bg-N0 px-6 py-4">
            <Button
              variant={"secondary"}
              type="button"
              className="msm:w-full"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              variant={
                type === "delete"
                  ? "danger"
                  : type === "warning"
                    ? "gold"
                    : "primary"
              }
              className="msm:w-full"
              onClick={handleClick}
              loading={isLoading}
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
