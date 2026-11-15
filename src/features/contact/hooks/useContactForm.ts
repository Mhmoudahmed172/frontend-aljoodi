"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n";
import { useApiMutation } from "@/lib/api/hooks";
import { submit as submitContact } from "../services/contactService";

export function useContactForm() {
  const { t } = useT();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");

  const mutation = useApiMutation(submitContact, {
    successMessage: t("contact.sent"),
    onSuccess: () => {
      setName("");
      setMobile("");
      setMessage("");
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !mobile || !message) return toast.error(t("auth.fillAllFields"));

    try {
      await mutation.mutateAsync({ name, mobile, message });
    } catch {
      // Error toast is already shown by useApiMutation's onError.
    }
  };

  return { name, setName, mobile, setMobile, message, setMessage, loading: mutation.isPending, submit };
}
