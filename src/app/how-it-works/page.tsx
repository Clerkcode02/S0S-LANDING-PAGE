import { redirect } from "next/navigation";

/**
 * Redirects directly to the Step 1/4 section on the landing page.
 */
export default function HowItWorksRoute() {
  redirect("/#how-it-works");
}
