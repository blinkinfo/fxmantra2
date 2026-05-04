import { cn } from "@/lib/utils";
import { STATUS_COLORS, TX_TYPE_COLORS } from "@/lib/constants";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "status" | "type" | "default";
  status?: string;
  type?: string;
}

export function Badge({ children, className, status, type, variant = "default" }: BadgeProps) {
  let colorClass = "text-gray-400 bg-gray-400/10 border-gray-400/20";

  if (variant === "status" && status) {
    colorClass = STATUS_COLORS[status] ?? colorClass;
  } else if (variant === "type" && type) {
    colorClass = `${TX_TYPE_COLORS[type] ?? "text-gray-400"} bg-white/5 border-white/10`;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        colorClass,
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    failed: "Failed",
    processing: "Processing",
    completed: "Completed",
    rejected: "Rejected",
  };

  return (
    <Badge variant="status" status={status}>
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "confirmed" || status === "completed"
            ? "bg-emerald-400"
            : status === "pending" || status === "processing"
            ? "bg-yellow-400"
            : "bg-red-400"
        )}
      />
      {labels[status] ?? status}
    </Badge>
  );
}
