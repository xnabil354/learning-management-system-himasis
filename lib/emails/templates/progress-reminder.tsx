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

interface ProgressReminderEmailProps {
  firstName: string;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  courseUrl: string;
}

export function ProgressReminderEmail({
  firstName,
  courseTitle,
  completedLessons,
  totalLessons,
  courseUrl,
}: ProgressReminderEmailProps) {
  const percentage = Math.round((completedLessons / totalLessons) * 100);

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
            <Text style={heading}>Hai {firstName}, lanjut belajar yuk! 📖</Text>

            <Text style={paragraph}>
              Kamu sudah separuh jalan di course <strong>{courseTitle}</strong>.
              Jangan berhenti di sini!
            </Text>

            <Section style={progressCard}>
              <Text style={courseTitle_style}>{courseTitle}</Text>
              <Section style={progressBarOuter}>
                <Section
                  style={{
                    ...progressBarInner,
                    width: `${percentage}%`,
                  }}
                />
              </Section>
              <Text style={progressText}>
                {completedLessons}/{totalLessons} Lesson • {percentage}% selesai
              </Text>
            </Section>

            <Text style={motivationText}>
              {percentage < 50
                ? "Ayo mulai lagi! Setiap langkah kecil membawa perubahan besar. 🚀"
                : percentage < 80
                  ? "Sudah lebih dari setengah jalan! Tinggal sedikit lagi! 💪"
                  : "Hampir selesai! Sertifikat sudah menanti kamu! 🏆"}
            </Text>

            <Section style={buttonSection}>
              <Button style={button} href={courseUrl}>
                Lanjut Belajar →
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
  margin: "0 0 16px",
};

const progressCard = {
  backgroundColor: "#18181b",
  border: "1px solid #27272a",
  borderRadius: "8px",
  padding: "20px",
  margin: "12px 0 20px",
};

const courseTitle_style = {
  fontSize: "16px",
  fontWeight: "600" as const,
  color: "#ffffff",
  margin: "0 0 12px",
};

const progressBarOuter = {
  backgroundColor: "#27272a",
  borderRadius: "999px",
  height: "8px",
  overflow: "hidden" as const,
  margin: "0 0 8px",
};

const progressBarInner = {
  backgroundColor: "#7c3aed",
  height: "8px",
  borderRadius: "999px",
};

const progressText = {
  fontSize: "12px",
  color: "#a1a1aa",
  margin: "0",
};

const motivationText = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#d4d4d8",
  textAlign: "center" as const,
  margin: "0 0 8px",
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

export default ProgressReminderEmail;
