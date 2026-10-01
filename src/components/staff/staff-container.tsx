"use client";

import AddStaffModal from "./add-staff-modal";
import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import StaffTable from "./staff-table";
import { useQuery } from "@tanstack/react-query";
import { fetchStaff } from "@/lib/api/staff";

export default function StaffContaienr({
  staffMembers,
}: {
  staffMembers: User[];
}) {
  const t = useTranslations();

  const { data } = useQuery({
    queryFn: fetchStaff,
    queryKey: ["staff"],
    initialData: staffMembers,
  });
  return (
    <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-5 space-y-6">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {t("admin.staff.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("admin.staff.subtitle")}
          </p>
        </div>

        <AddStaffModal />
      </header>

      <StaffTable staffMembers={data} />
    </main>
  );
}
