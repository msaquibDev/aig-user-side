"use client";

import { Suspense, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Funnel, ChevronLeft, ChevronRight, Upload } from "lucide-react";

type Presentation = {
  id: number;
  sessionTitle: string;
  presentationTitle: string;
  dateTime: string;
  hall: string;
  file?: File | null;
};

const initialData: Presentation[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  sessionTitle: "This is a Session Name",
  presentationTitle: "Lorem ipsum dolor sit amet",
  dateTime: "7 May 2025 03:00 PM (IST)",
  hall: "Lorem ipsum dolor sit amet",
  file: i % 2 === 0 ? new File(["dummy"], `presentation_${i + 1}.pptx`) : null,
}));

const ROWS_PER_PAGE = 15;

export default function PresentationsTable() {
  const [presentations, setPresentations] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleFileUpload = (id: number, file: File) => {
    if (!file.name.endsWith(".ppt") && !file.name.endsWith(".pptx")) {
      alert("Only .ppt or .pptx files are allowed.");
      return;
    }

    setPresentations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, file } : item))
    );
  };

  const handleRemoveFile = (id: number) => {
    setPresentations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, file: null } : item))
    );
  };

  const filtered = presentations.filter((p) =>
    p.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const currentItems = filtered.slice(startIndex, startIndex + ROWS_PER_PAGE);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#00509E]">Presentations</h2>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        {/* Filter + Search */}
        <div className="flex items-center gap-2 px-4 py-3 border-b bg-gray-50">
          <Funnel className="w-4 h-4 text-gray-600" />
          <Input
            placeholder="Search..."
            className="max-w-sm bg-white"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        <Table>
          <TableHeader className="bg-gray-50 border-b text-sm text-gray-600">
            <TableRow>
              <TableHead className="w-4 px-2">
                <input type="checkbox" />
              </TableHead>
              <TableHead className="px-4">#</TableHead>
              <TableHead className="px-4">Session Title</TableHead>
              <TableHead className="px-4">Presentation Title</TableHead>
              <TableHead className="px-4">Date &amp; Time</TableHead>
              <TableHead className="px-4">Hall</TableHead>
              <TableHead className="px-4 text-center">Upload</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className="text-sm hover:bg-gray-50 transition"
                >
                  <TableCell className="px-2">
                    <input type="checkbox" />
                  </TableCell>
                  <TableCell className="px-4 text-gray-800 font-medium">
                    {startIndex + idx + 1}
                  </TableCell>
                  <TableCell className="px-4">{item.sessionTitle}</TableCell>
                  <TableCell className="px-4">
                    {item.presentationTitle}
                  </TableCell>
                  <TableCell className="px-4">{item.dateTime}</TableCell>
                  <TableCell className="px-4">{item.hall}</TableCell>
                  <TableCell className="px-4 text-center">
                    <label className="cursor-pointer text-blue-600 flex items-center justify-center gap-1">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Upload</span>
                      <input
                        type="file"
                        accept=".ppt,.pptx"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleFileUpload(item.id, e.target.files[0])
                        }
                      />
                    </label>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-6 text-gray-500"
                >
                  No presentations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t text-sm text-gray-600">
          <span>
            {filtered.length === 0
              ? `0 of 0`
              : `${startIndex + 1}-${Math.min(
                  startIndex + ROWS_PER_PAGE,
                  filtered.length
                )} of ${filtered.length}`}
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
              {currentPage} / {totalPages}
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
    </Suspense>
  );
}
