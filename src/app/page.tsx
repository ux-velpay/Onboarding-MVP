import { OnboardingProvider } from "@/components/onboarding/provider";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export default function Home() {
  return (
    <OnboardingProvider>
      <OnboardingWizard />
    </OnboardingProvider>
  );
}
