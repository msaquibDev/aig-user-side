"use client";

import { useState, useEffect } from "react";
import {
  Pencil,
  Funnel,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBanquetStore } from "@/app/store/useBanquetStore";

type Props = {
  onAddClick: () => void;
  onEditClick: (id: number) => void;
};

export default function BanquetTable({ onAddClick, onEditClick }: Props) {
  const { persons } = useBanquetStore();

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

  const sorted = [...persons]
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const valA = sortBy === "id" ? a.id : a.name.toLowerCase();
      const valB = sortBy === "id" ? b.id : b.name.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sorted.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#00509E]">Banquet</h2>
        <Button
          onClick={onAddClick}
          className="bg-[#00509E] hover:bg-[#003B73]"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Book Banquet
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
                #
                {sortBy === "id" &&
                  (sortOrder === "asc" ? (
                    <ArrowUp className="inline w-3 h-3 ml-1" />
                  ) : (
                    <ArrowDown className="inline w-3 h-3 ml-1" />
                  ))}
              </TableHead>
              <TableHead
                className="px-6 py-3 text-left cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                Name
                {sortBy === "name" &&
                  (sortOrder === "asc" ? (
                    <ArrowUp className="inline w-3 h-3 ml-1" />
                  ) : (
                    <ArrowDown className="inline w-3 h-3 ml-1" />
                  ))}
              </TableHead>
              <TableHead className="px-6 py-3 text-left">Relation</TableHead>
              <TableHead className="px-6 py-3 text-left">Age</TableHead>
              <TableHead className="px-6 py-3 text-left">Gender</TableHead>
              <TableHead className="px-6 py-3 text-left">
                Meal Preference
              </TableHead>
              <TableHead className="px-6 py-3 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((person, index) => (
                <TableRow key={person.id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-3">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="px-6 py-3">{person.name}</TableCell>
                  <TableCell className="px-6 py-3">{person.relation}</TableCell>
                  <TableCell className="px-6 py-3">{person.age}</TableCell>
                  <TableCell className="px-6 py-3">{person.gender}</TableCell>
                  <TableCell className="px-6 py-3">
                    {person.mealPreference}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#00509E] hover:text-[#003B73] px-2"
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
                  No Banquet persons to show
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
          <span>
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, sorted.length)} of{" "}
            {sorted.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
