import DeleteStaff from "./delete-staff";
import { User } from "@prisma/client";
import { getRoleVariant } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useTranslations } from "next-intl";

export default function StaffTable({ staffMembers }: { staffMembers: User[] }) {
  const t = useTranslations("admin.staff.table");

  return (
    <div className="border rounded-xl shadow-sm bg-card overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="text-base font-semibold">
          {t("title", { count: staffMembers.length })}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3 px-6 font-medium">{t("headName")}</th>
              <th className="py-3 px-6 font-medium">{t("headEmail")}</th>
              <th className="py-3 px-6 font-medium">{t("headRole")}</th>
              <th className="py-3 px-6 font-medium">{t("headJoined")}</th>
              <th className="py-3 px-6 font-medium text-right">
                {t("headActions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {staffMembers.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="py-3.5 px-6 font-medium">{member.name}</td>
                <td className="py-3.5 px-6 text-muted-foreground">
                  {member.email}
                </td>
                <td className="py-3.5 px-6">
                  <Badge variant={getRoleVariant(member.role)}>
                    {member.role}
                  </Badge>
                </td>
                <td className="py-3.5 px-6 text-muted-foreground">
                  {new Date(member.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-6 text-right">
                  <DeleteStaff userId={member.id} username={member.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
