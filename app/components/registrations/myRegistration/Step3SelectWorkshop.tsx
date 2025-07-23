"use client";

import { useState, useEffect } from "react";
import { useRegistrationStore } from "@/app/store/useRegistrationStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Example static workshop data (replace with dynamic if needed)
const preWorkshops = [
  {
    id: "pre1",
    title: "Lorem ipsum dolor sit amet consectetur.",
    amount: 8555,
  },
  {
    id: "pre2",
    title: "Lorem ipsum dolor sit amet consectetur.",
    amount: 8555,
  },
  {
    id: "pre3",
    title: "Lorem ipsum dolor sit amet consectetur.",
    amount: 8555,
  },
];

const postWorkshops = [
  {
    id: "post1",
    title: "Lorem ipsum dolor sit amet consectetur.",
    amount: 8555,
  },
  {
    id: "post2",
    title: "Lorem ipsum dolor sit amet consectetur.",
    amount: 8555,
  },
  {
    id: "post3",
    title: "Lorem ipsum dolor sit amet consectetur.",
    amount: 8555,
  },
];

export default function Step3SelectWorkshop({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const { selectedWorkshops, setSelectedWorkshops } = useRegistrationStore();

  const [selectedPre, setSelectedPre] = useState<string>("none");
  const [selectedPost, setSelectedPost] = useState<string>("none");

  useEffect(() => {
    if (selectedWorkshops.length > 0) {
      const pre =
        selectedWorkshops.find((id) => id.startsWith("pre")) || "none";
      const post =
        selectedWorkshops.find((id) => id.startsWith("post")) || "none";
      setSelectedPre(pre);
      setSelectedPost(post);
    }
  }, [selectedWorkshops]);

  const handleNext = () => {
    const selections = [];
    if (selectedPre !== "none") selections.push(selectedPre);
    if (selectedPost !== "none") selections.push(selectedPost);

    if (selections.length === 0) {
      toast.error(
        "Please select at least one workshop or mark them as not required."
      );
      return;
    }

    setSelectedWorkshops(selections);
    toast.success("Workshop selections saved!");
    onNext();
  };

  const { skipWorkshops } = useRegistrationStore();

  return (
    <div className="space-y-8">
      {/* Pre-Conference */}
      <div>
        <h3 className="font-semibold text-lg mb-2">
          Pre - Conference Workshop (31 May 2025)
        </h3>
        <RadioGroup
          value={selectedPre}
          onValueChange={setSelectedPre}
          className="space-y-3"
        >
          {preWorkshops.map((ws) => (
            <div
              key={ws.id}
              className="flex items-center justify-between border p-4 rounded-md"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={ws.id} id={ws.id} />
                <Label htmlFor={ws.id}>{ws.title}</Label>
              </div>
              <div className="text-right">
                <p>₹ {ws.amount.toLocaleString("en-IN")}</p>
                <p className="text-muted-foreground text-sm">₹ 0.00</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <RadioGroupItem value="none" id="none-pre" />
            <Label htmlFor="none-pre">Workshop Not Required</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Post-Conference */}
      <div>
        <h3 className="font-semibold text-lg mb-2">
          Post - Conference Workshop (3 June 2025)
        </h3>
        <RadioGroup
          value={selectedPost}
          onValueChange={setSelectedPost}
          className="space-y-3"
        >
          {postWorkshops.map((ws) => (
            <div
              key={ws.id}
              className="flex items-center justify-between border p-4 rounded-md"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={ws.id} id={ws.id} />
                <Label htmlFor={ws.id}>{ws.title}</Label>
              </div>
              <div className="text-right">
                <p>₹ {ws.amount.toLocaleString("en-IN")}</p>
                <p className="text-muted-foreground text-sm">₹ 0.00</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <RadioGroupItem value="none" id="none-post" />
            <Label htmlFor="none-post">Workshop Not Required</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-6 pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="bg-[#00509E] text-white hover:bg-[#003B73]"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          className="bg-[#00509E] text-white hover:bg-[#003B73]"
        >
          Next
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            skipWorkshops(); // <-- New store function
            toast.info("Workshop selection skipped");
            onNext();
          }}
          className="text-[#00509E] underline hover:text-[#003B73]"
        >
          Skip
        </Button>
      </div>
    </div>
  );
}
