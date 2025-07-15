"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Funnel,
  Pencil,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { useAccompanyingStore } from "@/app/store/useAccompanyingStore";

type Props = {
  onAddClick: () => void;
  onEditClick: (personId: number) => void;
};

export default function AccompanyingTable({ onAddClick, onEditClick }: Props) {
  const { people } = useAccompanyingStore();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const filtered = people.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  useEffect(() => {
    setCurrentPage(1); // Reset on search
  }, [search]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#00509E]">
          Accompanying Persons
        </h2>
        <Button
          onClick={onAddClick}
          className="bg-[#00509E] hover:bg-[#003B73] transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Accompanying
        </Button>
      </div>

      {/* Table Box */}
      <div className="rounded-lg border bg-white overflow-hidden">
        {/* Filter/Search Row */}
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-gray-50">
          <Funnel className="w-4 h-4 text-gray-600" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm bg-white"
          />
        </div>

        {/* Table */}
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="px-6 py-3 text-left">#</TableHead>
              <TableHead className="px-6 py-3 text-left">Name</TableHead>
              <TableHead className="px-6 py-3 text-left">Relation</TableHead>
              <TableHead className="px-6 py-3 text-left">Age</TableHead>
              <TableHead className="px-6 py-3 text-left">Gender</TableHead>
              <TableHead className="px-6 py-3 text-left">Meal</TableHead>
              <TableHead className="px-6 py-3 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((person, index) => (
                <TableRow key={person.id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-3 align-middle">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="px-6 py-3 align-middle">
                    {person.name}
                  </TableCell>
                  <TableCell className="px-6 py-3 align-middle">
                    {person.relation}
                  </TableCell>
                  <TableCell className="px-6 py-3 align-middle">
                    {person.age}
                  </TableCell>
                  <TableCell className="px-6 py-3 align-middle">
                    {person.gender}
                  </TableCell>
                  <TableCell className="px-6 py-3 align-middle">
                    {person.mealPreference}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right align-middle">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#00509E] hover:text-[#003B73] px-2 cursor-pointer"
                      onClick={() => onEditClick(person.id)}
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  No accompanying person found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
