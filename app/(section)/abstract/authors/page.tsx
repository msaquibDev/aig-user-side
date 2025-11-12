// app/(section)/abstract/authors/page.tsx
"use client";

import { Suspense, useState } from "react";
import { useAuthorStore } from "@/app/store/useAuthorStore";
import MyAuthorsTable from "@/components/abstract/authors/MyAuthorsTable";
import AuthorFormSidebar from "@/components/abstract/authors/AuthorFormSidebar";
import Loading from "@/components/common/Loading";

function MyAuthorsContent() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const { getAuthorById } = useAuthorStore();
  const defaultData = editId ? getAuthorById(editId) : null;

  const handleEditClick = (id: number) => {
    setEditId(id);
    setOpen(true);
  };

  const handleViewClick = (id: number) => {
    console.log("Viewing abstract:", id);
  };

  return (
    <>
      <MyAuthorsTable onEdit={handleEditClick} onView={handleViewClick} />
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

export default function MyAuthorsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MyAuthorsContent />
    </Suspense>
  );
}
