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
  Search,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  ChevronUp,
  ChevronDown,
  Edit,
} from "lucide-react";

type AccompanyPerson = {
  _id: string;
  fullName: string;
  relation: string;
  age: number;
  gender: string;
  mealPreference: string;
  isPaid: boolean;
  regNum?: string;
};

type PaidAccompany = {
  _id: string;
  event: {
    _id: string;
    eventName: string;
    eventCode: string;
    startDate: string;
    endDate: string;
  };
  registration: {
    _id: string;
    regNum: string;
    registrationSlabName: string;
    isPaid: boolean;
  };
  paidAccompanies: AccompanyPerson[];
};

type Props = {
  eventId?: string | null;
  registrationId?: string | null;
  onAddClick: () => void;
  onEditClick: (person: AccompanyPerson) => void; // Updated to accept person object
};

export default function AccompanyingTable({
  eventId,
  registrationId,
  onAddClick,
  onEditClick,
}: Props) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paidAccompanies, setPaidAccompanies] = useState<PaidAccompany[]>([]);

  // Sorting state
  const [sortBy, setSortBy] = useState<"name" | "relation" | "age" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch paid accompanies from API
  const fetchPaidAccompanies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accompanies/paid`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setPaidAccompanies(data.data);
      } else {
        console.error("Failed to fetch paid accompanies:", data);
        setPaidAccompanies([]);
      }
    } catch (error) {
      console.error("Error fetching paid accompanies:", error);
      setPaidAccompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaidAccompanies();
  }, []);

  // Flatten all paid accompany persons
  const allPaidPersons: AccompanyPerson[] = paidAccompanies.flatMap(
    (accompany) => accompany.paidAccompanies
  );

  const toggleSort = (column: "name" | "relation" | "age") => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortedPeople = () => {
    let filtered = allPaidPersons.filter((p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === "name") {
          const nameA = a.fullName.toLowerCase();
          const nameB = b.fullName.toLowerCase();
          return sortOrder === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        } else if (sortBy === "relation") {
          const relationA = a.relation.toLowerCase();
          const relationB = b.relation.toLowerCase();
          return sortOrder === "asc"
            ? relationA.localeCompare(relationB)
            : relationB.localeCompare(relationA);
        } else if (sortBy === "age") {
          return sortOrder === "asc" ? a.age - b.age : b.age - a.age;
        }
        return 0;
      });
    }

    return filtered;
  };

  const sortedPeople = getSortedPeople();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedPeople.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedPeople.slice(startIndex, endIndex);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, sortOrder]);

  const getSortIcon = (column: "name" | "relation" | "age") => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading accompanying persons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#00509E]">
            Accompanying Persons
          </h2>
          {eventId && (
            <p className="text-gray-600 text-sm mt-1">
              Managing accompanying persons for your registration
            </p>
          )}
        </div>
        <Button
          onClick={onAddClick}
          className="bg-[#00509E] hover:bg-[#003B73] transition-colors cursor-pointer whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Accompanying Person
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-gray-300"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-900">#</TableHead>
              <TableHead
                className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSort("relation")}
              >
                <div className="flex items-center gap-1">
                  Relation
                  {getSortIcon("relation")}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSort("age")}
              >
                <div className="flex items-center gap-1">
                  Age
                  {getSortIcon("age")}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Gender
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Meal Preference
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Registration No.
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((person, index) => (
                <TableRow key={person._id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {person.fullName}
                  </TableCell>
                  <TableCell className="capitalize">
                    {person.relation}
                  </TableCell>
                  <TableCell>{person.age} years</TableCell>
                  <TableCell>{person.gender}</TableCell>
                  <TableCell className="capitalize">
                    {person.mealPreference}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {person.regNum || "Pending"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        person.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {person.isPaid ? "Paid" : "Pending"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer"
                      onClick={() => onEditClick(person)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <PlusCircle className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-gray-600">
                      No accompanying persons added yet
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Click "Add Accompanying Person" to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {sortedPeople.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, sortedPeople.length)} of {sortedPeople.length}{" "}
              entries
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
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
                onClick={handleNext}
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
