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
  AlertCircle,
} from "lucide-react";
import { useWorkshopStore } from "@/app/store/useWorkshopStore";

type Workshop = {
  _id: string;
  eventId: string;
  workshopName: string;
  workshopType: string;
  hallName: string;
  amount: number;
  maxRegAllowed: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isEventRegistrationRequired: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type RegisteredWorkshop = {
  _id: string;
  workshopId: Workshop;
  status: string;
  createdAt: string;
};

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
  const [apiWorkshops, setApiWorkshops] = useState<Workshop[]>([]);
  const [registeredWorkshops, setRegisteredWorkshops] = useState<
    RegisteredWorkshop[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  // Sorting state
  const [sortBy, setSortBy] = useState<"name" | "date" | "price" | "type">(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch registered workshops from API when eventId changes
  useEffect(() => {
    const fetchRegisteredWorkshops = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/workshop-registrations/my-workshops?eventId=${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        console.log("Fetched registered workshops:", data);

        if (data.success && Array.isArray(data.data)) {
          setRegisteredWorkshops(data.data);

          // Extract workshop details from registered workshops
          const workshopsData = data.data.map(
            (reg: RegisteredWorkshop) => reg.workshopId
          );
          setApiWorkshops(workshopsData);
        } else {
          setError("No registered workshops found for this event");
          setRegisteredWorkshops([]);
          setApiWorkshops([]);
        }
      } catch (error) {
        console.error("Error fetching registered workshops:", error);
        setError("Failed to load registered workshops");
        setRegisteredWorkshops([]);
        setApiWorkshops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredWorkshops();
  }, [eventId]);

  const toggleSort = (column: "name" | "date" | "price" | "type") => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Check if a workshop is registered
  const isWorkshopRegistered = (workshopId: string): boolean => {
    return registeredWorkshops.some((reg) => reg.workshopId._id === workshopId);
  };

  // Get workshop registration status
  const getWorkshopRegistrationStatus = (workshopId: string): string => {
    const registration = registeredWorkshops.find(
      (reg) => reg.workshopId._id === workshopId
    );
    return registration?.status || "Not Registered";
  };

  const getSortedWorkshops = () => {
    let filtered = apiWorkshops.filter((w) =>
      w.workshopName.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        if (sortBy === "name") {
          const nameA = a.workshopName.toLowerCase();
          const nameB = b.workshopName.toLowerCase();
          return sortOrder === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        } else if (sortBy === "date") {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortBy === "price") {
          return sortOrder === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        } else if (sortBy === "type") {
          return sortOrder === "asc"
            ? a.workshopType.localeCompare(b.workshopType)
            : b.workshopType.localeCompare(a.workshopType);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading registered workshops...</p>
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
            My Registered Workshops
          </h2>
          {eventId && (
            <p className="text-gray-600 text-sm mt-1">
              View your registered workshops for this event
            </p>
          )}
        </div>
        <Button
          onClick={onAddClick}
          className="bg-[#00509E] hover:bg-[#003B73] transition-colors cursor-pointer whitespace-nowrap"
          disabled={!eventId}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Register for More Workshops
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search registered workshops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white border-gray-300"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

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
                Registration Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((workshop, index) => {
                const isRegistered = isWorkshopRegistered(workshop._id);
                const registrationStatus = getWorkshopRegistrationStatus(
                  workshop._id
                );

                return (
                  <TableRow key={workshop._id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">
                          {workshop.workshopName}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Max Participants: {workshop.maxRegAllowed}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          workshop.workshopType === "Pre Conference"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {workshop.workshopType}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{workshop.startDate}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {workshop.startTime} - {workshop.endTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{workshop.hallName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-[#00509E]">
                      {workshop.amount > 0
                        ? `₹${workshop.amount.toLocaleString("en-IN")}`
                        : "Free"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          registrationStatus === "confirmed" ||
                          registrationStatus === "registered"
                            ? "bg-green-100 text-green-800"
                            : registrationStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : registrationStatus === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {isRegistered ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <AlertCircle className="w-3 h-3 mr-1" />
                        )}
                        {registrationStatus.charAt(0).toUpperCase() +
                          registrationStatus.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <PlusCircle className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-gray-600">No registered workshops</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {eventId
                        ? "You haven't registered for any workshops yet"
                        : "Please select an event to view registered workshops"}
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
