"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Author, useAuthorStore } from "@/app/store/useAuthorStore";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultData?: Author | null;
};

export default function AuthorFormSidebar({
  open,
  onClose,
  defaultData,
}: Props) {
  const { addAuthor, updateAuthor, authors } = useAuthorStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Author>();

  useEffect(() => {
    if (defaultData) {
      Object.entries(defaultData).forEach(([key, value]) => {
        setValue(key as keyof Author, value);
      });
    } else {
      reset();
    }
  }, [defaultData, setValue, reset]);

  const onSubmit = (data: Author) => {
    if (defaultData) {
      updateAuthor(data.id, data);
    } else {
      addAuthor(data);
    }
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="text-[#00509E] text-lg font-semibold text-center">
            {defaultData ? "Edit Author" : "Add Author"}
          </SheetTitle>
        </SheetHeader>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 flex-1 overflow-y-auto"
        >
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              {...register("department", {
                required: "Department is required",
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              {...register("institution", {
                required: "Institution is required",
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone", { required: "Phone is required" })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abstractAssigned">Abstract Assigned</Label>
            <Input
              id="abstractAssigned"
              {...register("abstractAssigned", { required: "Required" })}
            />
          </div>
          {/* </div> */}

          {/* Spacer to avoid footer overlap */}
          <div className="h-24" />
        </form>

        {/* Fixed Footer */}
        {/* <div className="border-t border-gray-200 pt-4 bg-white sticky bottom-0 mt-auto"> */}
          <div className="border-t px-6 py-4">
            {/* <p className="text-sm text-muted-foreground">
              Total Authors:{" "}
              <span className="font-medium text-[#00509E]">
                {authors.length}
              </span>
            </p> */}
            <Button
              type="submit"
              form="author-form"
              className="w-full bg-[#00509E] hover:bg-[#003B73]"
            >
              {defaultData ? "Update Author" : "Save & Proceed"}
            </Button>
          </div>
        {/* </div> */}
      </SheetContent>
    </Sheet>
  );
}
