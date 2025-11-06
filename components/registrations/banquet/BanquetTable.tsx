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
  AlertCircle,
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
  hasRegistration?: boolean;
  eventId?: string | null;
};

export default function BanquetTable({
  onAddClick,
  onEditClick,
  hasRegistration = false,
  eventId,
}: Props) {
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#00509E]">
            Banquet Registrations
          </h2>
          {eventId && hasRegistration && (
            <p className="text-gray-600 text-sm mt-1">
              Managing banquet registrations for your event
            </p>
          )}
        </div>

        {hasRegistration ? (
          <Button
            onClick={onAddClick}
            className="bg-[#00509E] hover:bg-[#003B73] transition-colors cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Book Banquet
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-yellow-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            Complete registration to book banquet
          </div>
        )}
      </div>

      {/* Search */}
      {hasRegistration && (
        <div className="mb-6">
          <div className="relative max-w-sm">
            <Funnel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search banquet entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white border-gray-300"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
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
                <TableRow key={person.id} className="hover:bg-gray-50/50">
                  <TableCell className="px-6 py-3 font-medium text-gray-900">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="px-6 py-3 font-medium">
                    {person.name}
                  </TableCell>
                  <TableCell className="px-6 py-3 capitalize">
                    {person.relation}
                  </TableCell>
                  <TableCell className="px-6 py-3">
                    {person.age} years
                  </TableCell>
                  <TableCell className="px-6 py-3">{person.gender}</TableCell>
                  <TableCell className="px-6 py-3 capitalize">
                    {person.mealPreference}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer"
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
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <PlusCircle className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-gray-600">
                      {hasRegistration
                        ? "No banquet entries added yet"
                        : "Complete registration to book banquet"}
                    </p>
                    {hasRegistration && (
                      <p className="text-sm text-gray-500 mt-1">
                        Click "Book Banquet" to get started
                      </p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {sorted.length > 0 && hasRegistration && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, sorted.length)} of{" "}
              {sorted.length} entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="border-gray-300 hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600 mx-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="border-gray-300 hover:bg-gray-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
