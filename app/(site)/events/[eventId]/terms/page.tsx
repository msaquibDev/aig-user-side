// app/events/[eventId]/terms/page.tsx
import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, AlertTriangle, AlertCircle } from "lucide-react";

type Params = { params: { eventId: string } };

export default async function TermsPage({ params }: Params) {
  const { eventId } = params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/events/${eventId}/terms-and-conditions`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("Failed fetching terms:", res.status, text);
      return (
        <main className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Link
                href={`/registration/my-registration?eventId=${eventId}`}
                className="inline-flex items-center text-[#00509E] hover:text-[#003B73] font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Registration
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Terms & Conditions
              </h1>
              <p className="text-gray-600 mb-6">
                No terms & conditions found for this event.
              </p>
              <Button asChild>
                <Link href={`/registration/my-registration?eventId=${eventId}`}>
                  Return to Registration
                </Link>
              </Button>
            </div>
          </div>
        </main>
      );
    }

    const data = await res.json();

    if (!data?.success || !Array.isArray(data.data) || data.data.length === 0) {
      return (
        <main className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Link
                href={`/registration/my-registration?eventId=${eventId}`}
                className="inline-flex items-center text-[#00509E] hover:text-[#003B73] font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Registration
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Terms & Conditions
              </h1>
              <p className="text-gray-600 mb-6">
                No terms & conditions found for this event.
              </p>
              <Button asChild>
                <Link href={`/registration/my-registration?eventId=${eventId}`}>
                  Return to Registration
                </Link>
              </Button>
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={`/registration/my-registration?eventId=${eventId}`}
              className="inline-flex items-center text-[#00509E] hover:text-[#003B73] font-medium transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#00509E]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Terms & Conditions
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Please read the following terms carefully before proceeding
                    with your registration
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms Content */}
          <div className="space-y-6">
            {data.data.map((t: any, index: number) => (
              <section
                key={t._id}
                id={`offer${t._id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#00509E] text-white rounded-full text-sm flex items-center justify-center">
                      {index + 1}
                    </span>
                    {t.title || `Terms ${index + 1}`}
                  </h2>
                </div>
                <div className="p-6">
                  <div
                    className="prose prose-blue max-w-none"
                    dangerouslySetInnerHTML={{ __html: t.description || "" }}
                  />
                </div>
              </section>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                By proceeding with registration, you agree to all the terms and
                conditions mentioned above.
              </p>
              <Button asChild>
                <Link href={`/registration/my-registration?eventId=${eventId}`}>
                  I Understand - Return to Registration
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (err) {
    console.error("Error loading terms:", err);
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href={`/registration/my-registration?eventId=${eventId}`}
              className="inline-flex items-center text-[#00509E] hover:text-[#003B73] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Unable to Load Terms
            </h1>
            <p className="text-gray-600 mb-6">
              We encountered an error while loading the terms and conditions.
              Please try again later.
            </p>
            <Button asChild>
              <Link href={`/registration/my-registration?eventId=${eventId}`}>
                Return to Registration
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }
}

// Button component (add this if not already imported)
function Button({ children, asChild, ...props }: any) {
  const Comp = asChild ? "span" : "button";
  return (
    <Comp
      className="inline-flex items-center justify-center px-6 py-3 bg-[#00509E] text-white font-medium rounded-lg hover:bg-[#003B73] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00509E] focus:ring-offset-2"
      {...props}
    >
      {children}
    </Comp>
  );
}
