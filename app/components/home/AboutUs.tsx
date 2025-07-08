"use client";

export default function AboutUs() {
  return (
    <section
      id="about"
      className="bg-white text-gray-800 px-4 md:px-12 py-16 scroll-mt-20"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          About Us
        </h2>

        <p className="text-base md:text-lg leading-relaxed text-justify">
          AIG Hospitals is a leading healthcare institution committed to
          excellence in clinical care, research, and education. With world-class
          infrastructure and a dedicated team of professionals, we aim to
          deliver cutting-edge medical services across various specialties.
        </p>

        <p className="text-base md:text-lg leading-relaxed text-justify">
          Our mission is to improve lives through innovation, compassion, and
          knowledge-sharing. Whether through international conferences,
          workshops, or continuous medical education (CMEs), AIG strives to
          foster a culture of learning and global collaboration in the
          healthcare community.
        </p>

        <p className="text-base md:text-lg leading-relaxed text-justify">
          We believe in creating impactful learning experiences for
          professionals and delivering exceptional care to patients—because
          healthcare is not just about treatment, but about transforming lives.
        </p>
      </div>
    </section>
  );
}
