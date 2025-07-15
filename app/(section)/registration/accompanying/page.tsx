"use client";

import AccompanyingFormSidebar from "@/app/components/registrations/accompanying/AccompanyingFormSidebar";
import AccompanyingTable from "@/app/components/registrations/accompanying/AccompanyingTable";
import { useState } from "react";

export default function AccompanyingPage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  return (
    <>
      <AccompanyingTable
        onAddClick={() => {
          setEditId(null); // clear edit mode
          setOpen(true);
        }}
        onEditClick={(id) => {
          setEditId(id);
          setOpen(true);
        }}
      />

      <AccompanyingFormSidebar
        open={open}
        onClose={() => {
          setOpen(false);
          setEditId(null); // reset edit ID
        }}
        editId={editId}
      />
    </>
  );
}
