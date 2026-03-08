import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Img,
} from "@react-email/components";
import * as React from "react";

interface WelcomeEmailProps {
  firstName: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ firstName, dashboardUrl }: WelcomeEmailProps) {
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
            <Text style={heading}>Selamat Datang, {firstName}! 👋</Text>

            <Text style={paragraph}>
              Terima kasih sudah bergabung di{" "}
              <strong>SISCA — Sistem Informasi Course Akademik</strong> oleh
              HIMASIS, STMI Jakarta.
            </Text>

            <Text style={paragraph}>
              Kamu sekarang bisa mengakses berbagai course, modul, dan lesson
              yang telah disiapkan oleh Divisi Akademik HIMASIS untuk
              meningkatkan kemampuanmu.
            </Text>

            <Text style={paragraph}>Apa yang bisa kamu lakukan:</Text>

            <Text style={listItem}>📚 Akses course & modul pembelajaran</Text>
            <Text style={listItem}>✅ Tandai progress belajar</Text>
            <Text style={listItem}>📜 Dapatkan sertifikat setelah selesai</Text>
            <Text style={listItem}>🤖 Konsultasi dengan AI Tutor</Text>

            <Section style={buttonSection}>
              <Button style={button} href={dashboardUrl}>
                Mulai Belajar Sekarang →
              </Button>
            </Section>
          </Section>

          <Hr style={hr} />

          <Section style={footerSection}>
            <Text style={footer}>
              © {new Date().getFullYear()} HIMASIS — Himpunan Mahasiswa Sistem
              Informasi, STMI Jakarta
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

const listItem = {
  fontSize: "14px",
  lineHeight: "28px",
  color: "#d4d4d8",
  margin: "0",
  paddingLeft: "8px",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "28px 0",
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

export default WelcomeEmail;
