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
import { Funnel, PlusCircle } from "lucide-react";

import { useAuthorStore } from "@/app/store/useAuthorStore";
import AuthorFormSidebar from "./AuthorFormSidebar";

type Props = {
  onEdit: (id: number) => void;
  onView: (id: number) => void;
};

export default function MyAbstractTable({ onEdit, onView }: Props) {
  const { authors, deleteAuthor, getAuthorById } = useAuthorStore();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const itemsPerPage = 10;
  const filtered = authors.filter((author) =>
    author.name.toLowerCase().includes(search.toLowerCase())
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

  const defaultData = editId ? getAuthorById(editId) : null;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#00509E]">My Authors</h2>
        <Button
          className="bg-[#00509E] hover:bg-[#003B73] cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <PlusCircle className="w-4 h-4 mr-2" /> Add Author
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
              <TableHead>Author Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Email ID</TableHead>
              <TableHead>Phone No</TableHead>
              <TableHead>Abstract Assigned</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length ? (
              currentItems.map((author, index) => (
                <TableRow key={author.id}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{author.name}</TableCell>
                  <TableCell>{author.department}</TableCell>
                  <TableCell>{author.institution}</TableCell>
                  <TableCell>{author.email}</TableCell>
                  <TableCell>{author.phone}</TableCell>
                  <TableCell>{author.abstractAssigned}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          setEditId(author.id);
                          setOpen(true);
                        }}
                        className="text-blue-600 cursor-pointer"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => deleteAuthor(author.id)}
                        className="text-blue-600 cursor-pointer"
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
                  No authors found.
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

      <AuthorFormSidebar
        open={open}
        onClose={() => {
          setOpen(false);
          setEditId(null);
        }}
        defaultData={defaultData}
      />
    </div>
  );
}
