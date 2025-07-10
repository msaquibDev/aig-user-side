// /components/dashboard/MyCertificates.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { getDummyCertificates, Certificate } from "../../data/certificates";

export default function MyCertificates() {
  const [search, setSearch] = useState("");
  const certificates = getDummyCertificates();

  const filtered = certificates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

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
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border bg-white overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Certificate Name</th>
              <th className="px-4 py-3">Event Name</th>
              <th className="px-4 py-3">Date of Issue</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cert, i) => (
              <tr key={cert.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3">{cert.name}</td>
                <td className="px-4 py-3">{cert.event}</td>
                <td className="px-4 py-3">{cert.date}</td>
                <td className="px-4 py-3">
                  <a
                    href={cert.link}
                    className="text-blue-600 hover:underline"
                    download
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between text-sm text-gray-600 px-4 py-2 border-t">
          <span>
            {filtered.length} of {certificates.length}
          </span>
          <span>Rows per page: 10</span>
        </div>
      </div>
    </div>
  );
}
