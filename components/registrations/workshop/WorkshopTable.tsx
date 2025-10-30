// components/registrations/workshop/WorkshopTable.tsx
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
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useWorkshopStore, Workshop } from "@/app/store/useWorkshopStore";

type Props = {
  eventId?: string | null;
  registrationId?: string | null;
  onAddClick: () => void;
  onEditClick: (workshopId: number) => void;
};

export default function WorkshopTable({
  eventId,
  registrationId,
  onAddClick,
  onEditClick,
}: Props) {
  const { workshops, selectedWorkshops } = useWorkshopStore();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Sorting state
  const [sortBy, setSortBy] = useState<"name" | "date" | "price" | "type">(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const toggleSort = (column: "name" | "date" | "price" | "type") => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Check if a workshop is selected
  const isWorkshopSelected = (workshopId: number): boolean => {
    return Object.values(selectedWorkshops).includes(workshopId);
  };

  // Get workshop status
  const getWorkshopStatus = (workshopId: number): string => {
    return isWorkshopSelected(workshopId) ? "Registered" : "Available";
  };

  const getSortedWorkshops = () => {
    let filtered = workshops.filter(
      (w) =>
        w.name.toLowerCase().includes(search.toLowerCase()) &&
        w.name !== "Workshop Not Required"
    );

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === "name") {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return sortOrder === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        } else if (sortBy === "date") {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortBy === "price") {
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        } else if (sortBy === "type") {
          return sortOrder === "asc"
            ? a.type.localeCompare(b.type)
            : b.type.localeCompare(a.type);
        }
        return 0;
      });
    }

    return filtered;
  };

  const sortedWorkshops = getSortedWorkshops();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedWorkshops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = sortedWorkshops.slice(startIndex, endIndex);

  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, sortOrder]);

  const getSortIcon = (column: "name" | "date" | "price" | "type") => {
    if (sortBy !== column) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  // Fetch workshops when eventId changes
  useEffect(() => {
    const fetchWorkshops = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        // TODO: Add API call to fetch available workshops for this event
        // const response = await fetch(`/api/events/${eventId}/workshops`);
        // const data = await response.json();
        // Update store with fetched data
      } catch (error) {
        console.error("Error fetching workshops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading workshops...</p>
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
            Available Workshops
          </h2>
          {eventId && (
            <p className="text-gray-600 text-sm mt-1">
              Browse and register for workshops
            </p>
          )}
        </div>
        <Button
          onClick={onAddClick}
          className="bg-[#00509E] hover:bg-[#003B73] transition-colors cursor-pointer whitespace-nowrap"
          disabled={!eventId}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Register for Workshop
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search workshops..."
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
                  Workshop Name
                  {getSortIcon("name")}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSort("type")}
              >
                <div className="flex items-center gap-1">
                  Type
                  {getSortIcon("type")}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date & Time
                  {getSortIcon("date")}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Venue
              </TableHead>
              <TableHead
                className="font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSort("price")}
              >
                <div className="flex items-center gap-1">
                  Price
                  {getSortIcon("price")}
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-900">
                Status
              </TableHead>
              <TableHead className="font-semibold text-gray-900 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((workshop, index) => {
                const isSelected = isWorkshopSelected(workshop.id);
                const status = getWorkshopStatus(workshop.id);

                return (
                  <TableRow key={workshop.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{workshop.name}</div>
                        {workshop.group && (
                          <div className="text-xs text-gray-500 mt-1">
                            {workshop.group}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          workshop.type === "Pre Conference"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {workshop.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {workshop.date ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>
                            {new Date(workshop.date).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {workshop.venue ? (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{workshop.venue}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-[#00509E]">
                      {workshop.price > 0
                        ? `₹${workshop.price.toLocaleString("en-IN")}`
                        : "Free"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isSelected
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`hover:bg-blue-50 cursor-pointer ${
                          isSelected
                            ? "text-green-600 hover:text-green-800"
                            : "text-blue-600 hover:text-blue-800"
                        }`}
                        onClick={() => onEditClick(workshop.id)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {isSelected ? "View" : "Register"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <PlusCircle className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-gray-600">No workshops available</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {eventId
                        ? "No workshops found for this event"
                        : "Please select an event to view workshops"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {sortedWorkshops.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, sortedWorkshops.length)} of{" "}
              {sortedWorkshops.length} entries
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
