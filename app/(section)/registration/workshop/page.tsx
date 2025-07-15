"use client";

import { useState } from "react";
import WorkshopFormSidebar from "@/app/components/registrations/workshop/WorkshopFormSidebar";
import WorkshopTable from "@/app/components/registrations/workshop/WorkshopTable";

export default function WorkshopPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <WorkshopTable
        onAddClick={() => setOpen(true)}
        onEditClick={() => setOpen(true)} // You can handle edit separately later
      />

      <WorkshopFormSidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}
