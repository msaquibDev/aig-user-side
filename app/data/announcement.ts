export type Announcement = {
  id: number;
  date: string;
  title: string;
  description: string;
  author: string;
  downloadUrl: string;
};

export const dummyAnnouncements = (): Announcement[] => [
  {
    id: 1,
    date: "25 Apr 2025 at 06:00 PM (IST)",
    title: "Announcement 1",
    description:
      "Velit nulla at eget senectus tellus tristique volutpat. Aliquet pellentesque diam morbi pulvinar. Tincidunt placerat odio vulputate faucibus. Aenean tortor dictum nisl vel nisl fringilla. Dui dolor leo aenean ultrices a viverra aliquet dui id. Duis accumsan ornare turpis egestas. Auctor leo tortor adipiscing dictum ut auctor lacus.",
    author: "Admin",
    downloadUrl: "#",
  },
  {
    id: 2,
    date: "25 Apr 2025 at 06:00 PM (IST)",
    title: "Announcement 2",
    description:
      "Velit nulla at eget senectus tellus tristique volutpat. Aliquet pellentesque diam morbi pulvinar. Tincidunt placerat odio vulputate faucibus. Aenean tortor dictum nisl vel nisl fringilla. Dui dolor leo aenean ultrices a viverra aliquet dui id. Duis accumsan ornare turpis egestas. Auctor leo tortor adipiscing dictum ut auctor lacus.",
    author: "Admin",
    downloadUrl: "#",
  },
  {
    id: 3,
    date: "25 Apr 2025 at 06:00 PM (IST)",
    title: "Announcement 3",
    description:
      "Velit nulla at eget senectus tellus tristique volutpat. Aliquet pellentesque diam morbi pulvinar. Tincidunt placerat odio vulputate faucibus. Aenean tortor dictum nisl vel nisl fringilla. Dui dolor leo aenean ultrices a viverra aliquet dui id. Duis accumsan ornare turpis egestas. Auctor leo tortor adipiscing dictum ut auctor lacus.",
    author: "Admin",
    downloadUrl: "#",
  },
];
