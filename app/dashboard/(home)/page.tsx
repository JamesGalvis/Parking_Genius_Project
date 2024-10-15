"use client"

import { BreadcrumbPaths } from "@/components/common/breadcrumb-paths"
import useModalStore from "@/stores/modal-store";

export default function DashboardPage() {
  const { isOpen, openModal, closeModal } = useModalStore();

  return (
    <div>
      <BreadcrumbPaths initialPage />
    </div>
  )
}
