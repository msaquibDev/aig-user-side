"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useAbstractStore } from "@/app/store/useAbstractStore";
import type { AbstractType } from "@/app/store/useAbstractStore";

type AbstractFormValues = {
  type: AbstractType;
  title: string;
  body: string;
  authors: string;
  coAuthors: string;
  videoUrl?: string;
  category: string;
  file?: File | null;
  confirmAccuracy: boolean;
  agreeTerms: boolean;
  interventionStatus?: "yes" | "notRelevant";
};

export default function AbstractFormSidebar() {
  const {
    isSidebarOpen,
    addAbstract,
    updateAbstract,
    selectedAbstract,
    closeSidebar,
  } = useAbstractStore();

  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<AbstractFormValues>({
    defaultValues: {
      type: "Poster",
      title: "",
      body: "",
      authors: "",
      coAuthors: "",
      videoUrl: "",
      category: "",
      confirmAccuracy: false,
      agreeTerms: false,
      interventionStatus: "yes",
    },
  });

  const file = watch("file");
  const body = watch("body");

  useEffect(() => {
    if (selectedAbstract) {
      reset(selectedAbstract);
    } else {
      reset();
    }
    setStep(1);
  }, [selectedAbstract, reset]);

  const onSubmit = (data: AbstractFormValues) => {
    if (selectedAbstract) {
      updateAbstract(selectedAbstract.id, data);
    } else {
      addAbstract(data);
    }
    closeSidebar();
  };

  const goToNext = () => setStep(2);
  const goBack = () => setStep(1);

  const values = getValues();

  return (
    <Dialog open={isSidebarOpen} onOpenChange={closeSidebar}>
      <DialogContent className="mt-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-md animate-in fade-in-90 slide-in-from-top-10">
        <div className="border-b pb-4 mb-4">
          <DialogTitle className="text-xl font-semibold">
            Abstract Submission
          </DialogTitle>
          <a
            href="#"
            className="text-xs text-blue-600 hover:underline mt-1 inline-block"
          >
            Read Abstract Submission Process ↗
          </a>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 ? (
            <>
              {/* Abstract Type and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Abstract Type</Label>
                  <Select
                    onValueChange={(val) =>
                      setValue("type", val as AbstractType)
                    }
                    defaultValue="Poster"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Poster">Poster</SelectItem>
                      <SelectItem value="Oral Presentation">
                        Oral Presentation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Abstract Category</Label>
                  <Select
                    onValueChange={(val) => setValue("category", val)}
                    defaultValue=""
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paediatric">Paediatric</SelectItem>
                      <SelectItem value="Surgical">Surgical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Abstract Title */}
              <div>
                <Label>Abstract Title</Label>
                <Input
                  {...register("title", { required: true })}
                  placeholder="This is the title"
                />
              </div>

              {/* Abstract Body */}
              <div>
                <Label>Abstract Body (*3000 characters limit)</Label>
                <Textarea
                  {...register("body", { required: true, maxLength: 3000 })}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  {body?.length || 0} / 3000 characters
                </p>
              </div>

              {/* Upload File */}
              <div>
                <Label>Upload Abstract File (Doc & PDF only)</Label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setValue("file", e.target.files?.[0] || null)
                  }
                />
                {file && <p className="text-sm text-green-600">{file.name}</p>}
              </div>

              {/* Authors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Presenting Author</Label>
                  <Input
                    {...register("authors", { required: true })}
                    placeholder="Select"
                  />
                </div>
                <div>
                  <Label>Co-Author(s)</Label>
                  <Input {...register("coAuthors")} placeholder="Dr John Doe" />
                </div>
              </div>

              {/* Video URL */}
              <div>
                <Label>Enter Video URL (For video presentations)</Label>
                <Input
                  {...register("videoUrl")}
                  placeholder="https://drive.google.com/..."
                />
              </div>

              {/* Step 2 - Confirmation */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="confirmAccuracy"
                    {...register("confirmAccuracy", { required: true })}
                  />
                  <Label htmlFor="confirmAccuracy">
                    All authors have read and accepted the contents of the
                    manuscript and vouch for its authenticity
                  </Label>
                </div>

                <div>
                  <Label>
                    If an intervention has been carried out on human subjects:
                  </Label>
                  <RadioGroup
                    defaultValue="yes"
                    onValueChange={(val) =>
                      setValue(
                        "interventionStatus",
                        val as "yes" | "notRelevant"
                      )
                    }
                    className="flex flex-col space-y-2 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="notRelevant" id="notRelevant" />
                      <Label htmlFor="notRelevant">Not Relevant</Label>
                    </div>
                  </RadioGroup>
                </div>

                {(errors.confirmAccuracy || errors.agreeTerms) && (
                  <p className="text-sm text-red-500">
                    Please check the required boxes above before submission.
                  </p>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-between border-t pt-4 mt-6">
                <Button type="button" variant="outline" onClick={closeSidebar}>
                  Cancel
                </Button>
                <Button type="button" onClick={goToNext}>
                  Next
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4 text-sm">
                <p>
                  <strong>Abstract Type</strong> - {values.type}
                </p>
                <p>
                  <strong>Abstract Category</strong> - {values.category}
                </p>
                <p>
                  <strong>Abstract Title</strong> - {values.title}
                </p>

                <div>
                  <strong>Abstract Body</strong>
                  <p className="text-muted-foreground mt-1">{values.body}</p>
                </div>

                <p>
                  <strong>Abstract File</strong> -{" "}
                  {file ? (
                    <a href="#" className="text-blue-600 underline">
                      {file.name}
                    </a>
                  ) : (
                    "No file uploaded"
                  )}
                </p>

                <p>
                  <strong>Presenting Author</strong> – {values.authors}{" "}
                  (Presenting Author)
                </p>
                <p>
                  <strong>Co-Author(s)</strong> – {values.coAuthors}
                </p>

                <p>
                  <strong>Video URL</strong> –{" "}
                  {values.videoUrl ? (
                    <a
                      href={values.videoUrl}
                      target="_blank"
                      className="text-blue-600 underline"
                      rel="noopener noreferrer"
                    >
                      {values.videoUrl}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>

                <div className="flex items-center space-x-2 mt-4">
                  <input
                    type="checkbox"
                    checked={values.confirmAccuracy}
                    readOnly
                  />
                  <label className="text-sm">
                    All authors have read and accepted the contents of the
                    manuscript and vouch for its authenticity
                  </label>
                </div>

                <div className="mt-2">
                  <p className="mb-1">
                    If an intervention has been carried out on human subjects,
                    appropriate institutional ethical clearance has been
                    obtained
                  </p>
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={values.interventionStatus === "yes"}
                        readOnly
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={values.interventionStatus === "notRelevant"}
                        readOnly
                      />
                      Not Relevant
                    </label>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  <strong>Date & Time of Submission – </strong>
                  {new Date().toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                    timeZoneName: "short",
                  })}
                </p>
              </div>

              <div className="flex justify-between border-t pt-4 mt-6">
                <Button type="button" variant="outline" onClick={goBack}>
                  Back
                </Button>
                <div className="space-x-2">
                  <Button type="button" variant="secondary">
                    Save as Draft
                  </Button>
                  <Button type="submit">Submit</Button>
                </div>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
