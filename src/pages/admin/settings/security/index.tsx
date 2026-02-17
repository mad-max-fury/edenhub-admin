import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Typography,
  TextField,
  Button,
  Toggle,
  ConfirmationModal,
} from "@/components";
import { SecuritySchema, type ISecurityPayload } from "./schema";
import { ShieldCheck, BellRing, Trash2 } from "lucide-react";

const SecuritySettings = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [pendingPasswordData, setPendingPasswordData] =
    useState<ISecurityPayload | null>(null);

  const [modalState, setModalState] = useState<{
    type: "delete" | "2fa" | "loginAlerts" | "passwordUpdate" | null;
    isLoading: boolean;
  }>({ type: null, isLoading: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISecurityPayload>({
    resolver: yupResolver(SecuritySchema),
  });

  const closeModal = () => setModalState({ type: null, isLoading: false });

  const handlePasswordConfirm = (data: ISecurityPayload) => {
    setPendingPasswordData(data);
    setModalState({ type: "passwordUpdate", isLoading: false });
  };

  const submitPasswordUpdate = async () => {
    setModalState((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Password updated:", pendingPasswordData);
    reset();
    setPendingPasswordData(null);
    closeModal();
  };

  const toggle2FA = async () => {
    setModalState((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIs2FAEnabled(!is2FAEnabled);
    closeModal();
  };

  const toggleLoginAlerts = async () => {
    setModalState((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoginAlerts(!loginAlerts);
    closeModal();
  };

  const handleDeleteAccount = async () => {
    setModalState((prev) => ({ ...prev, isLoading: true }));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    closeModal();
  };

  return (
    <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-2 duration-500 relative">
      <section className="space-y-6">
        <div className="flex flex-col gap-1">
          <Typography variant="h-m" fontWeight="bold">
            Password & Authentication
          </Typography>
          <Typography variant="p-s" color="N500">
            Keep your account secure by using a strong password.
          </Typography>
        </div>

        <form
          onSubmit={handleSubmit(handlePasswordConfirm)}
          className="bg-N10/30 border border-N30 rounded-2xl p-6 md:p-8"
        >
          <div className="grid grid-cols-1 gap-4">
            <TextField
              label="Current Password"
              name="currentPassword"
              type="password"
              register={register}
              error={!!errors.currentPassword}
              errorText={errors.currentPassword?.message}
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              register={register}
              error={!!errors.newPassword}
              errorText={errors.newPassword?.message}
            />
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              register={register}
              error={!!errors.confirmPassword}
              errorText={errors.confirmPassword?.message}
            />
          </div>
          <div className="mt-8 flex justify-end border-t border-N30 pt-6">
            <Button type="submit" className="px-8 !bg-[#74594D] !text-white">
              Update Password
            </Button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <Typography
          variant="h-s"
          fontWeight="bold"
          className="px-1 text-N500 uppercase tracking-widest text-[11px]"
        >
          Security Preferences
        </Typography>

        <div className="border border-N30 rounded-2xl divide-y divide-N30 overflow-hidden bg-white">
          <div className="flex items-center justify-between p-5 hover:bg-N10/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-B50 text-B400 rounded-lg shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <Typography variant="p-m" fontWeight="medium">
                  Two-factor Authentication
                </Typography>
                <Typography variant="p-s" color="N500">
                  Add an extra layer of security to your account login.
                </Typography>
              </div>
            </div>
            <Toggle
              checked={is2FAEnabled}
              onChange={() => setModalState({ type: "2fa", isLoading: false })}
            />
          </div>

          <div className="flex items-center justify-between p-5 hover:bg-N10/30 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-P50 text-P400 rounded-lg shrink-0">
                <BellRing size={20} />
              </div>
              <div>
                <Typography variant="p-m" fontWeight="medium">
                  Login Alerts
                </Typography>
                <Typography variant="p-s" color="N500">
                  Get notified of new logins from unknown devices.
                </Typography>
              </div>
            </div>
            <Toggle
              checked={loginAlerts}
              onChange={() =>
                setModalState({ type: "loginAlerts", isLoading: false })
              }
            />
          </div>
        </div>
      </section>

      <section className="mt-4">
        <div className="bg-R50/10 border border-R100/30 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-R100/20 bg-R50/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 size={20} />
              <Typography variant="h-s" fontWeight="bold">
                Danger Zone
              </Typography>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography
                  variant="p-m"
                  fontWeight="bold"
                  className="text-R500"
                >
                  Delete Account
                </Typography>
                <Typography variant="p-s" color="N600">
                  Permanently remove all your data. This action cannot be
                  undone.
                </Typography>
              </div>
              <Button
                variant="danger"
                className=" w-full md:w-auto "
                onClick={() =>
                  setModalState({ type: "delete", isLoading: false })
                }
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      </section>

      <ConfirmationModal
        isOpen={modalState.type === "passwordUpdate"}
        closeModal={closeModal}
        formTitle="Confirm Password Change"
        message="Are you sure you want to update your password? You will need to use your new password for all future logins."
        buttonLabel="Update Password"
        handleClick={submitPasswordUpdate}
        type="confirm"
        isLoading={modalState.isLoading}
      />

      <ConfirmationModal
        isOpen={modalState.type === "loginAlerts"}
        closeModal={closeModal}
        formTitle={`${loginAlerts ? "Disable" : "Enable"} Login Alerts`}
        message={`Are you sure you want to ${loginAlerts ? "stop receiving" : "start receiving"} notifications for new device logins?`}
        buttonLabel={loginAlerts ? "Disable Alerts" : "Enable Alerts"}
        handleClick={toggleLoginAlerts}
        type={loginAlerts ? "warning" : "confirm"}
        isLoading={modalState.isLoading}
      />

      <ConfirmationModal
        isOpen={modalState.type === "delete"}
        closeModal={closeModal}
        formTitle="Confirm Account Deletion"
        message="Are you sure you want to delete your account? This action is permanent and all your data will be removed forever."
        buttonLabel="Delete Permanently"
        handleClick={handleDeleteAccount}
        type="delete"
        isLoading={modalState.isLoading}
      />

      <ConfirmationModal
        isOpen={modalState.type === "2fa"}
        closeModal={closeModal}
        formTitle={`${is2FAEnabled ? "Disable" : "Enable"} 2FA`}
        message={`Are you sure you want to ${is2FAEnabled ? "disable" : "enable"} two-factor authentication?`}
        buttonLabel={is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
        handleClick={toggle2FA}
        type={is2FAEnabled ? "warning" : "confirm"}
        isLoading={modalState.isLoading}
      />
    </div>
  );
};

export default SecuritySettings;
