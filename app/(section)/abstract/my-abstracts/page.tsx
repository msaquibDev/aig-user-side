"use client";

import AbstractFormSidebar from "@/app/components/abstract/myAbstract/AbstractFormSidebar";
import { AbstractTable } from "@/app/components/abstract/myAbstract/MyAbstractTable";
import { useAbstractStore } from "@/app/store/useAbstractStore";
import { useState } from "react";

export default function MyAbstractPage() {
  const { openSidebar, closeSidebar, isSidebarOpen, deleteAbstract } =
    useAbstractStore();
  const [editId, setEditId] = useState<number | null>(null);

  const handleAdd = () => {
    setEditId(null);
    openSidebar(); // open without id means "Add"
  };

  const handleEdit = (id: string) => {
    const numId = Number(id);
    setEditId(numId);
    openSidebar(numId);
  };

  const handleDelete = (id: string) => {
    const numId = Number(id);
    if (confirm("Are you sure you want to delete this abstract?")) {
      deleteAbstract(numId);
    }
  };

  return (
    <>
      <AbstractTable
        onAddAbstract={handleAdd}
        onEditAbstract={handleEdit}
        onDeleteAbstract={handleDelete}
      />

      <AbstractFormSidebar
        open={isSidebarOpen}
        onClose={() => {
          closeSidebar();
          setEditId(null);
        }}
        editId={editId}
      />
    </>
  );
}
