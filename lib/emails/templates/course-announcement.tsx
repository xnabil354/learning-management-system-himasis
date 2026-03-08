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

interface CourseAnnouncementEmailProps {
  firstName: string;
  courseTitle: string;
  courseDescription: string;
  courseUrl: string;
}

export function CourseAnnouncementEmail({
  firstName,
  courseTitle,
  courseDescription,
  courseUrl,
}: CourseAnnouncementEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={logo}>🎓 SISCA</Text>
            <Text style={subtitle}>HIMASIS E-Learning</Text>
          </Section>

          <Hr style={hr} />

          <Section style={contentSection}>
            <Text style={badge}>🆕 COURSE BARU</Text>

            <Text style={heading}>Hai {firstName}, ada course baru!</Text>

            <Section style={courseCard}>
              <Text style={courseTitle_style}>{courseTitle}</Text>
              <Text style={courseDesc}>{courseDescription}</Text>
            </Section>

            <Text style={paragraph}>
              Course baru telah ditambahkan ke platform SISCA. Mulai belajar
              sekarang dan tingkatkan kemampuanmu!
            </Text>

            <Section style={buttonSection}>
              <Button style={button} href={courseUrl}>
                Lihat Course →
              </Button>
            </Section>
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
  color: "#a78bfa",
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

const badge = {
  fontSize: "11px",
  fontWeight: "700" as const,
  color: "#7c3aed",
  backgroundColor: "#7c3aed20",
  border: "1px solid #7c3aed40",
  borderRadius: "4px",
  padding: "4px 10px",
  display: "inline-block" as const,
  letterSpacing: "1px",
  margin: "0 0 16px",
};

const heading = {
  fontSize: "22px",
  fontWeight: "700" as const,
  color: "#ffffff",
  margin: "0 0 16px",
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
  padding: "20px",
  margin: "12px 0 20px",
};

const courseTitle_style = {
  fontSize: "18px",
  fontWeight: "700" as const,
  color: "#ffffff",
  margin: "0 0 8px",
};

const courseDesc = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#a1a1aa",
  margin: "0",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#7c3aed",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  textDecoration: "none",
  padding: "12px 28px",
  display: "inline-block" as const,
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

export default CourseAnnouncementEmail;
