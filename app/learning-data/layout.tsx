import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout";

export default function LearningDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatedLayout>
      {children}
    </AuthenticatedLayout>
  );
} 