import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { cn } from "cn";
import { useLocale } from "next-intl";

export interface PasswordInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "type"
> {
  ref?: React.Ref<HTMLInputElement>;
}

export function PasswordInput({
  className,
  disabled,
  ref,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const locale = useLocale();
  return (
    <div className="relative w-full">
      <Input
        id="password"
        ref={ref}
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        className={cn(locale === "ar" ? "pl-10 " : "pr-10", className)}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        disabled={disabled}
        onClick={() => setShowPassword((prev) => !prev)}
        aria-pressed={showPassword}
        className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
