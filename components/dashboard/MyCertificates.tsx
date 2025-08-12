// /components/dashboard/MyCertificates.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { getDummyCertificates } from "@/app/data/certificates";

export default function MyCertificates() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const certificates = getDummyCertificates();
  const itemsPerPage = 15;

  const filtered = certificates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Dummy download function
  const handleDownload = (certName: string) => {
    const dummyContent = `This is your certificate for: ${certName}`;
    const blob = new Blob([dummyContent], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${certName.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-[#00509E]">
        My Certificates
      </h1>

      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
        <Input
          type="text"
          placeholder="Search..."
          className="max-w-sm bg-white"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset to first page when searching
          }}
        />
      </div>

      <div className="rounded-lg border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Certificate Name</th>
              <th className="px-4 py-3">Event Name</th>
              <th className="px-4 py-3">Date of Issue</th>
              <th className="px-4 py-3">Download</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((cert, i) => (
              <tr key={cert.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-3">{startIndex + i + 1}</td>
                <td className="px-4 py-3">{cert.name}</td>
                <td className="px-4 py-3">{cert.event}</td>
                <td className="px-4 py-3">{cert.date}</td>
                <td className="px-4 py-3">
                  <Download
                    size={20}
                    onClick={() => handleDownload(cert.name)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between text-sm text-gray-600 px-4 py-2 border-t bg-gray-200">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, filtered.length)} of{" "}
            {filtered.length}
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
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
