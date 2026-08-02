import { Marker, MarkerContent } from "@/components/ui/marker";

export default function MarkerText({ text }: { text: string }) {
  return (
    <Marker variant="separator" className="text-center text-sm text-muted-foreground">
      <MarkerContent>
        <span className="bg-background px-3 text-xs uppercase tracking-wide text-muted-foreground">
          {text}
        </span>
      </MarkerContent>
    </Marker>
  );
}
