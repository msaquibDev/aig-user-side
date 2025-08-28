import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch from the external API
    const res = await fetch("https://admin.aigevent.tech/api/announcements", {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch announcements" },
        { status: 500 }
      );
    }

    const json = await res.json();

    // 🔹 Map external fields -> internal fields
    const mapped = json.data.map((item: any) => ({
      _id: item._id,
      updatedAt: item.updatedAt,
      title: item.heading,
      description: item.description,
      author: item.postedBy,
      downloadUrl: "",
    }));

    return NextResponse.json({ success: true, data: mapped }, { status: 200 });
  } catch (error) {
    console.error("GET Announcements Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}
