"use client";

import { Suspense, useState } from "react";
import { useAuthorStore } from "@/app/store/useAuthorStore";
import MyAuthorsTable from "@/components/abstract/authors/MyAuthorsTable";
import AuthorFormSidebar from "@/components/abstract/authors/AuthorFormSidebar";
import Loading from "@/components/common/Loading";

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
      <Suspense fallback={<Loading />}>
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
      </Suspense>
    </>
  );
}
