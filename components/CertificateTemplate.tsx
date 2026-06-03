import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Line,
} from "@react-pdf/renderer";

const gold = "#C9A96E";
const goldLight = "#E8D5A8";
const navy = "#0C1222";
const cardBg = "#111B2E";
const slate = "#7A8BA0";
const white = "#FFFFFF";
const accent = "#A78BFA";

const s = StyleSheet.create({
  page: {
    backgroundColor: navy,
    padding: 30,
    fontFamily: "Helvetica",
  },
  card: {
    flex: 1,
    backgroundColor: cardBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1E2A42",
    padding: 50,
    paddingTop: 0,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  goldBar: {
    width: "60%",
    height: 3,
    backgroundColor: gold,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    marginBottom: 40,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 30,
  },
  logoBox: {
    width: 32,
    height: 32,
    backgroundColor: accent,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    fontSize: 18,
    color: white,
    fontFamily: "Helvetica-Bold",
  },
  logoName: {
    fontSize: 14,
    color: white,
    letterSpacing: 5,
    fontFamily: "Helvetica-Bold",
  },
  logoSub: {
    fontSize: 7,
    color: slate,
    letterSpacing: 3,
    marginTop: 1,
  },
  label: {
    fontSize: 9,
    color: gold,
    letterSpacing: 6,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    color: goldLight,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 8,
    color: slate,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 30,
  },
  presentedLabel: {
    fontSize: 8,
    color: slate,
    letterSpacing: 4,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  studentName: {
    fontSize: 34,
    color: white,
    fontFamily: "Helvetica-Bold",
    textTransform: "capitalize",
    marginBottom: 10,
    letterSpacing: 1,
  },
  nameLine: {
    width: 160,
    height: 0.5,
    backgroundColor: gold,
    opacity: 0.3,
    marginBottom: 24,
  },
  courseLabel: {
    fontSize: 8,
    color: slate,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 16,
    color: goldLight,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 40,
  },
  footer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderTopWidth: 0.5,
    borderTopColor: "#1E2A42",
    paddingTop: 16,
    marginTop: "auto",
  },
  footerCol: {
    alignItems: "center",
    width: 160,
  },
  footerLine: {
    width: 120,
    height: 0.5,
    backgroundColor: slate,
    opacity: 0.3,
    marginBottom: 6,
  },
  footerValue: {
    fontSize: 9,
    color: white,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  footerLabel: {
    fontSize: 7,
    color: slate,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  certId: {
    fontSize: 6,
    color: "#2A3A52",
    letterSpacing: 1,
    fontFamily: "Courier",
  },
});

interface CertificateTemplateProps {
  studentName: string;
  courseTitle: string;
  completionDate: string;
  certificateId: string;
}

export const CertificateTemplate = ({
  studentName,
  courseTitle,
  completionDate,
  certificateId,
}: CertificateTemplateProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={s.page}>
      <View style={s.card}>
        {}
        <View style={s.goldBar} />

        {}
        <View style={s.logoRow}>
          <View style={s.logoBox}>
            <Text style={s.logoLetter}>S</Text>
          </View>
          <View>
            <Text style={s.logoName}>SMARTSIS</Text>
            <Text style={s.logoSub}>ACADEMY • HIMASIS</Text>
          </View>
        </View>

        {}
        <Text style={s.label}>Certificate</Text>
        <Text style={s.title}>Of Completion</Text>
        <Text style={s.subtitle}>Sistem Informasi Industri Otomotif</Text>

        {}
        <Svg
          viewBox="0 0 300 2"
          style={{ width: 300, height: 2, marginBottom: 24 }}
        >
          <Line
            x1="0"
            y1="1"
            x2="120"
            y2="1"
            stroke={gold}
            strokeWidth={0.3}
            opacity="0.4"
          />

          <Line
            x1="130"
            y1="1"
            x2="170"
            y2="1"
            stroke={gold}
            strokeWidth={0.5}
            opacity="0.8"
          />

          <Line
            x1="180"
            y1="1"
            x2="300"
            y2="1"
            stroke={gold}
            strokeWidth={0.3}
            opacity="0.4"
          />
        </Svg>

        {}
        <Text style={s.presentedLabel}>Proudly Presented To</Text>
        <Text style={s.studentName}>{studentName}</Text>
        <View style={s.nameLine} />

        {}
        <Text style={s.courseLabel}>For Successfully Completing</Text>
        <Text style={s.courseTitle}>{courseTitle}</Text>

        {}
        <View style={s.footer}>
          <View style={s.footerCol}>
            <View style={s.footerLine} />
            <Text style={s.footerValue}>HIMASIS Academic</Text>
            <Text style={s.footerLabel}>Division Coordinator</Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={s.certId}>{certificateId}</Text>
          </View>

          <View style={s.footerCol}>
            <View style={s.footerLine} />
            <Text style={s.footerValue}>{completionDate}</Text>
            <Text style={s.footerLabel}>Date Of Completion</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
