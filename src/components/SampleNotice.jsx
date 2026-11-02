import { Info } from "lucide-react";

export default function SampleNotice() {
  return (
    <p
      id="sample-notice"
      className="mb-8 flex items-start gap-2 rounded-lg border border-dashed bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>
        Showing the bundled sample menu because the store backend is not
        connected. Buying is disabled.
      </span>
    </p>
  );
}
