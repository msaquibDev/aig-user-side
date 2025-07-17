"use client";

import AuthorFormSidebar from "@/app/components/abstract/authors/AuthorFormSidebar";
import MyAuthorsTable from "@/app/components/abstract/authors/MyAuthorsTable";
import { useState } from "react";
import { useAuthorStore } from "@/app/store/useAuthorStore";

export default function MyAuthorsPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const { getAuthorById } = useAuthorStore();
  const defaultData = editId ? getAuthorById(editId) : null;

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
      <MyAuthorsTable onEdit={handleEditClick} onView={handleViewClick} />

      {/* Abstract Form Sidebar (Add/Edit) */}
      <AuthorFormSidebar
        open={open}
        onClose={() => {
          setOpen(false);
          setEditId(null);
        }}
        defaultData={defaultData}
      />
    </>
  );
}
