import { Suspense } from "react";
import { GoogleCallbackContent } from "./GoogleCallbackContent";
import { Loading } from "@/components/ui/Loading";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<Loading size="lg" text="Loading..." />}>
      <GoogleCallbackContent />
    </Suspense>
  );
}