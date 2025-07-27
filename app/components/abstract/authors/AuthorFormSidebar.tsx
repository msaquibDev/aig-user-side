"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

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
  const { addAuthor, updateAuthor } = useAuthorStore();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{ authors: Author[] }>({
    defaultValues: {
      authors: [
        {
          id: 0,
          authorName: "",
          authorType: "",
          department: "",
          institution: "",
          email: "",
          phone: "",
          abstractAssigned: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "authors",
  });

  useEffect(() => {
    if (defaultData) {
      reset({ authors: [defaultData] });
    } else {
      reset();
    }
  }, [defaultData, reset]);

  const onSubmit = (data: { authors: Author[] }) => {
    data.authors.forEach((author) => {
      if (defaultData) {
        updateAuthor(author.id, author);
      } else {
        addAuthor(author);
      }
    });
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
            {defaultData ? "Edit Author" : "Add Author(s)"}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-6 flex-1 overflow-y-auto"
          id="author-form"
        >
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="border p-4 rounded-md relative space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-[#00509E]">Author {idx + 1}</p>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="text-red-600 text-lg font-bold leading-none"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`authors.${idx}.authorName`}>Author Name</Label>
                <Input
                  id={`authors.${idx}.authorName`}
                  {...register(`authors.${idx}.authorName`, {
                    required: "Author Name is required",
                  })}
                />
                {errors.authors?.[idx]?.authorName && (
                  <p className="text-sm text-red-500">
                    {errors.authors[idx].authorName?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Author Type</Label>
                <Select
                  onValueChange={(val) =>
                    setValue(`authors.${idx}.authorType`, val)
                  }
                  value={watch(`authors.${idx}.authorType`)}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Select Author Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Presenting Author">
                      Presenting Author
                    </SelectItem>
                    <SelectItem value="Co Author">Co Author</SelectItem>
                  </SelectContent>
                </Select>
                {errors.authors?.[idx]?.authorType && (
                  <p className="text-sm text-red-500">
                    {errors.authors[idx].authorType?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  {...register(`authors.${idx}.department`, { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label>Institution</Label>
                <Input
                  {...register(`authors.${idx}.institution`, {
                    required: true,
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  {...register(`authors.${idx}.email`, { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  type="tel"
                  {...register(`authors.${idx}.phone`, { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label>Abstract Assigned</Label>
                <Input
                  {...register(`authors.${idx}.abstractAssigned`, {
                    required: true,
                  })}
                />
              </div>
            </div>
          ))}

          {!defaultData && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#00509E] text-[#00509E] hover:bg-[#003B73] hover:text-white gap-2"
              onClick={() =>
                append({
                  id: Date.now(), // Generate temporary ID
                  authorName: "",
                  authorType: "",
                  department: "",
                  institution: "",
                  email: "",
                  phone: "",
                  abstractAssigned: "",
                })
              }
            >
              <PlusCircle className="h-4 w-4" />
              Add More Author
            </Button>
          )}

          <Button
            type="submit"
            className="w-full bg-[#00509E] hover:bg-[#003B73]"
          >
            {defaultData ? "Update Author" : "Save All Authors"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
