import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { TutorWidget } from "@/components/tutor";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#8b5cf6",
          colorBackground: "#0a0a0a",
          colorInputBackground: "#141414",
          colorInputText: "#e4e4e7",
          colorText: "#fafafa",
          colorTextSecondary: "#a1a1aa",
          colorDanger: "#ef4444",
          colorSuccess: "#22c55e",
          borderRadius: "0.75rem",
          fontFamily: "inherit",
        },
        elements: {
          card: {
            backgroundColor: "#0a0a0a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
          },
          userButtonPopoverCard: {
            backgroundColor: "#0a0a0a",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          userButtonPopoverActionButton: {
            color: "#a1a1aa",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "#fafafa",
            },
          },
          userPreviewMainIdentifier: {
            color: "#fafafa",
          },
          userPreviewSecondaryIdentifier: {
            color: "#71717a",
          },
          navbarButton: {
            color: "#a1a1aa",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "#fafafa",
            },
          },
          navbarButtonActive: {
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            color: "#8b5cf6",
          },
          headerTitle: {
            color: "#fafafa",
          },
          headerSubtitle: {
            color: "#71717a",
          },
          formButtonPrimary: {
            backgroundColor: "#8b5cf6",
            "&:hover": {
              backgroundColor: "#7c3aed",
            },
          },
          formFieldLabel: {
            color: "#a1a1aa",
          },
          formFieldInput: {
            backgroundColor: "#141414",
            borderColor: "rgba(255, 255, 255, 0.1)",
            color: "#fafafa",
            "&:focus": {
              borderColor: "#8b5cf6",
              boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.15)",
            },
          },
          profileSectionTitle: {
            color: "#fafafa",
            borderBottomColor: "rgba(255, 255, 255, 0.05)",
          },
          profileSectionContent: {
            color: "#a1a1aa",
          },
          badge: {
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            color: "#8b5cf6",
            border: "1px solid rgba(139, 92, 246, 0.2)",
          },
          footerActionLink: {
            color: "#8b5cf6",
            "&:hover": {
              color: "#a78bfa",
            },
          },
          footer: {
            "& + div": {
              background: "transparent",
            },
          },
        },
      }}
    >
      <div>{children}</div>
      <SanityLive />
      <TutorWidget />
    </ClerkProvider>
  );
}

export default AppLayout;
