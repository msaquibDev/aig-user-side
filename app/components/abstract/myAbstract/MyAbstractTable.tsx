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
import { Funnel, Eye, Pencil, Trash2, PlusCircle } from "lucide-react";
import { useAbstractStore } from "@/app/store/useAbstractStore";
import AbstractFormSidebar from "./AbstractFormSidebar";

type Props = {
  onEdit: (id: number) => void;
  onView: (id: number) => void;
};

export default function MyAbstractTable({ onEdit, onView }: Props) {
  const { abstracts, deleteAbstract } = useAbstractStore();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const itemsPerPage = 10;
  const filtered = abstracts.filter((abs) =>
    abs.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const renderStatus = (status: string) => {
    const map: Record<string, string> = {
      DRAFT: "text-gray-500",
      SUBMITTED: "text-black",
      ACCEPTED: "text-green-600 font-semibold",
      REJECTED: "text-red-600 font-semibold",
    };
    return <span className={map[status] || ""}>{status}</span>;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#00509E]">My Abstracts</h2>
        <Button
          className="bg-[#00509E] hover:bg-[#003B73] cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Abstract
        </Button>
      </div>

      {/* Table Box */}
      <div className="rounded-lg border bg-white overflow-hidden">
        {/* Search/Filter */}
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
              <TableHead className="px-4 py-2">#</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Abstract Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length ? (
              currentItems.map((abs, index) => (
                <TableRow key={abs.id}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{abs.abstractId}</TableCell>
                  <TableCell>{abs.title}</TableCell>
                  <TableCell>{abs.type}</TableCell>
                  <TableCell>{abs.category}</TableCell>
                  <TableCell>
                    {abs.authors.split("\n").map((a, i) => (
                      <div key={i}>{a}</div>
                    ))}
                  </TableCell>
                  <TableCell>{renderStatus(abs.status)}</TableCell>
                  <TableCell>{formatDate(abs.lastModified)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => onView(abs.id)}
                        className="text-blue-600"
                      >
                        View
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          setEditId(abs.id);
                          setOpen(true);
                        }}
                        className="text-blue-600"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => deleteAbstract(abs.id)}
                        className="text-blue-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-4 text-gray-500"
                >
                  No abstracts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-600 bg-gray-50">
          <span>
            Showing {startIndex + 1}-
            {Math.min(startIndex + currentItems.length, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <AbstractFormSidebar
        open={open}
        onClose={() => {
          setOpen(false);
          setEditId(null);
        }}
        editId={editId}
      />
    </div>
  );
}
