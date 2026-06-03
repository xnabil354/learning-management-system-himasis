import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface CertificateEmailProps {
  firstName: string;
  courseTitle: string;
  courseUrl: string;
}

export function CertificateEmail({
  firstName,
  courseTitle,
  courseUrl,
}: CertificateEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={logo}>🎓 SMARTSIS</Text>
            <Text style={subtitle}>HIMASIS E-Learning</Text>
          </Section>

          <Hr style={hr} />

          <Section style={contentSection}>
            <Text style={celebrationEmoji}>🎉🏆🎉</Text>

            <Text style={heading}>Selamat, {firstName}!</Text>

            <Text style={paragraph}>Kamu telah menyelesaikan course:</Text>

            <Section style={courseCard}>
              <Text style={courseTitle_style}>📚 {courseTitle}</Text>
            </Section>

            <Text style={paragraph}>
              Sertifikat penyelesaian sudah siap untuk didownload. Kunjungi
              halaman course untuk mengunduh sertifikatmu.
            </Text>

            <Section style={buttonSection}>
              <Button style={button} href={courseUrl}>
                Download Sertifikat →
              </Button>
            </Section>

            <Text style={motivationText}>
              Terus semangat belajar! Jelajahi course lainnya untuk meningkatkan
              skill-mu. 💪
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footerSection}>
            <Text style={footer}>
              © {new Date().getFullYear()} HIMASIS — STMI Jakarta
            </Text>
            <Text style={footerSmall}>
              Email ini dikirim otomatis. Jangan balas email ini.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#0a0a0a",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "24px",
  maxWidth: "560px",
};

const headerSection = {
  textAlign: "center" as const,
  padding: "20px 0",
};

const logo = {
  fontSize: "28px",
  fontWeight: "800" as const,
  color: "#60a5fa",
  margin: "0",
};

const subtitle = {
  fontSize: "13px",
  color: "#71717a",
  margin: "4px 0 0",
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
};

const hr = {
  borderColor: "#27272a",
  margin: "20px 0",
};

const contentSection = {
  padding: "0 8px",
};

const celebrationEmoji = {
  fontSize: "36px",
  textAlign: "center" as const,
  margin: "0 0 12px",
};

const heading = {
  fontSize: "22px",
  fontWeight: "700" as const,
  color: "#ffffff",
  margin: "0 0 16px",
  textAlign: "center" as const,
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#d4d4d8",
  margin: "0 0 12px",
};

const courseCard = {
  backgroundColor: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "8px",
  padding: "16px",
  margin: "12px 0 20px",
  textAlign: "center" as const,
};

const courseTitle_style = {
  fontSize: "16px",
  fontWeight: "600" as const,
  color: "#60a5fa",
  margin: "0",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#059669",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  textDecoration: "none",
  padding: "12px 28px",
  display: "inline-block" as const,
};

const motivationText = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#a1a1aa",
  textAlign: "center" as const,
  fontStyle: "italic" as const,
  margin: "0",
};

const footerSection = {
  textAlign: "center" as const,
};

const footer = {
  fontSize: "12px",
  color: "#52525b",
  margin: "0",
};

const footerSmall = {
  fontSize: "11px",
  color: "#3f3f46",
  margin: "4px 0 0",
};

export default CertificateEmail;
