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
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { useWorkshopStore } from "@/app/store/useWorkshopStore";

type Props = {
  onAddClick: () => void;
  onEditClick: (id: number) => void;
};

export default function WorkshopTable({ onAddClick, onEditClick }: Props) {
  const { workshops } = useWorkshopStore();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"id" | "name">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const itemsPerPage = 10;

  const handleSort = (field: "id" | "name") => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sorted = [...workshops]
    .filter((w) => w.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const valA = sortBy === "id" ? a.id : a.name.toLowerCase();
      const valB = sortBy === "id" ? b.id : b.name.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sorted.slice(startIndex, endIndex);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const renderSortIcon = (field: "id" | "name") => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ArrowUp className="inline w-3 h-3 ml-1" />
    ) : (
      <ArrowDown className="inline w-3 h-3 ml-1" />
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#00509E]">Workshop</h2>
        <Button
          onClick={onAddClick}
          className="bg-[#00509E] hover:bg-[#003B73] transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Workshop
        </Button>
      </div>

      {/* Table Box */}
      <div className="rounded-lg border bg-white overflow-hidden">
        {/* Filter/Search Row */}
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-gray-50">
          <Funnel className="w-4 h-4 text-gray-600" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm bg-white"
          />
        </div>

        {/* Table */}
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead
                className="px-6 py-3 text-left cursor-pointer select-none"
                onClick={() => handleSort("id")}
              >
                #{renderSortIcon("id")}
              </TableHead>
              <TableHead
                className="px-6 py-3 text-left cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                Workshop Name
                {renderSortIcon("name")}
              </TableHead>
              <TableHead className="px-6 py-3 text-left">Date</TableHead>
              <TableHead className="px-6 py-3 text-left">Type</TableHead>
              <TableHead className="px-6 py-3 text-left">Venue</TableHead>
              <TableHead className="px-6 py-3 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((workshop, index) => (
                <TableRow key={workshop.id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-3 align-middle">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="px-6 py-3 align-middle">
                    {workshop.name}
                  </TableCell>
                  <TableCell className="px-6 py-3 align-middle">
                    {workshop.date}
                  </TableCell>
                  <TableCell className="px-6 py-3 align-middle">
                    {workshop.type}
                  </TableCell>
                  <TableCell className="px-6 py-3 align-middle">
                    {workshop.venue}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right align-middle">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-blue-600 cursor-pointer"
                      onClick={() => onEditClick(workshop.id)}
                    >
                      {/* <Pencil className="w-4 h-4 mr-1" /> */}
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No Workshop to show
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, sorted.length)} of{" "}
            {sorted.length}
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
