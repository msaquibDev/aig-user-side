"use client";

import AbstractFormSidebar from "@/app/components/abstract/myAbstract/AbstractFormSidebar";
import MyAbstractTable from "@/app/components/abstract/myAbstract/MyAbstractTable";
import { useState } from "react";

export default function MyAbstractsPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleEditClick = (id: number) => {
    setEditId(id);
    setOpen(true);
  };

  const handleViewClick = (id: number) => {
    // Logic for viewing the abstract details (could be a modal or page redirection)
    console.log("Viewing abstract:", id);
  };

  return (
    <>
      <MyAbstractTable onEdit={handleEditClick} onView={handleViewClick} />

      {/* Abstract Form Sidebar (Add/Edit) */}
      <AbstractFormSidebar
        open={open}
        onClose={() => {
          setOpen(false);
          setEditId(null);
        }}
        editId={editId}
      />
    </>
  );
}
