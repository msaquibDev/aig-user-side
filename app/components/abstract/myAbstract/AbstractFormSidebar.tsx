"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useAbstractStore, Abstract } from "@/app/store/useAbstractStore";

const formSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["Poster", "Presentation"]),
  category: z.string().min(1),
  authors: z.string().min(1),
  status: z.enum(["DRAFT", "SUBMITTED", "ACCEPTED", "REJECTED"]),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  editId?: number | null;
};

export default function AbstractFormSidebar({ open, onClose, editId }: Props) {
  const { abstracts, addAbstract, updateAbstract } = useAbstractStore();

  const { register, handleSubmit, reset, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "Poster",
      category: "",
      authors: "",
      status: "DRAFT",
    },
  });

  useEffect(() => {
    if (editId) {
      const data = abstracts.find((abs) => abs.id === editId);
      if (data) {
        reset({
          title: data.title,
          type: data.type,
          category: data.category,
          authors: data.authors,
          status: data.status,
        });
      }
    } else {
      reset();
    }
  }, [editId, reset, abstracts]);

  const onSubmit = (data: FormData) => {
    const now = new Date().toISOString();
    const base: Abstract = {
      id: editId ?? Date.now(),
      abstractId: editId
        ? abstracts.find((a) => a.id === editId)?.abstractId || ""
        : `IBD${Math.floor(100 + Math.random() * 900)}`,
      lastModified: now,
      ...data,
    };

    if (editId) {
      updateAbstract(editId, base);
    } else {
      addAbstract(base);
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
          <SheetTitle>{editId ? "Edit" : "Add"} Abstract</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 flex-1 overflow-y-auto"
        >
          <div className="space-y-2">
            <Label>Abstract Title</Label>
            <Input {...register("title")} />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              onValueChange={(val) => setValue("type", val as any)}
              value={watch("type")}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Poster">Poster</SelectItem>
                <SelectItem value="Presentation">Presentation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Input {...register("category")} />
          </div>

          <div className="space-y-2">
            <Label>Authors</Label>
            <Input
              {...register("authors")}
              placeholder="Separate authors with new lines"
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              onValueChange={(val) => setValue("status", val as any)}
              value={watch("status")}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">DRAFT</SelectItem>
                <SelectItem value="SUBMITTED">SUBMITTED</SelectItem>
                <SelectItem value="ACCEPTED">ACCEPTED</SelectItem>
                <SelectItem value="REJECTED">REJECTED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <div className="border-t px-6 py-4">
          <Button
            type="submit"
            form="abstract-form"
            className="w-full bg-[#00509E] hover:bg-[#003B73]"
          >
            {editId ? "Update Abstract" : "Save & Continue"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
