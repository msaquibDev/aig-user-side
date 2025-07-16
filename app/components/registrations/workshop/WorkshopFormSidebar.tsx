"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useWorkshopStore } from "@/app/store/useWorkshopStore";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface Workshop {
  id: number;
  name: string;
  price: number;
}

interface WorkshopStore {
  groupedWorkshops: Record<string, Workshop[]>;
  selectedWorkshops: Record<string, number | null>;
  selectWorkshop: (group: string, workshopId: number | null) => void;
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function WorkshopFormSidebar({ open, onClose }: Props) {
  const { groupedWorkshops, selectedWorkshops, selectWorkshop } =
    useWorkshopStore() as WorkshopStore;

  const handleSelect = (group: string, workshopId: number | null) => {
    selectWorkshop(group, workshopId);
  };

  const totalPrice = Object.values(selectedWorkshops).reduce(
    (sum: number, id: number | null) => {
      if (id === null) return sum;
      const allWorkshops = Object.values(groupedWorkshops).flat();
      const selected = allWorkshops.find((w) => w.id === id);
      return sum + (selected?.price ?? 0);
    },
    0
  );

  const totalCount = Object.values(selectedWorkshops).filter(
    (id) => id !== null
  ).length;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
      >
        <SheetHeader className="flex justify-between items-center px-5 py-4 border-b">
          <SheetTitle>Add Workshop</SheetTitle>
        </SheetHeader>

        {/* Form section */}
        <form
          id="workshop-form"
          className="flex-1 overflow-y-auto p-5 space-y-6"
        >
          {Object.entries(groupedWorkshops).map(([group, workshops]) => (
            <div key={group} className="space-y-2">
              <h3 className="text-sm font-semibold text-[#00509E]">{group}</h3>
              <RadioGroup
                value={selectedWorkshops[group]?.toString() || "null"}
                onValueChange={(value) =>
                  handleSelect(group, value === "null" ? null : Number(value))
                }
                className="space-y-3"
              >
                {workshops.map((workshop) => (
                  <div
                    key={workshop.id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value={workshop.id.toString()}
                        id={`workshop-${group}-${workshop.id}`}
                      />
                      <Label
                        htmlFor={`workshop-${group}-${workshop.id}`}
                        className="text-sm font-medium"
                      >
                        {workshop.name}
                      </Label>
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      ₹ {workshop.price.toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="null"
                      id={`workshop-${group}-none`}
                    />
                    <Label
                      htmlFor={`workshop-${group}-none`}
                      className="text-sm font-medium"
                    >
                      Workshop Not Required
                    </Label>
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    ₹ 0.00
                  </div>
                </div>
              </RadioGroup>
            </div>
          ))}
        </form>

        {/* Footer section */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm">{totalCount}x Workshops</div>
            <div className="flex gap-4 items-center">
              <span className="text-sm font-semibold text-[#00509E]">
                ₹ {totalPrice.toLocaleString("en-IN")}.00
              </span>
              <Button
                type="submit"
                form="workshop-form"
                className="bg-[#00509E] hover:bg-[#003B73]"
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
