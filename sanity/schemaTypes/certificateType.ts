import { defineField, defineType } from "sanity";

export const certificateType = defineType({
  name: "certificate",
  title: "Certificate",
  type: "document",
  fields: [
    defineField({
      name: "certificateId",
      title: "Certificate ID",
      type: "string",
      description: "Unique certificate identifier (e.g. SISCA-2026-ABCD)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "studentName",
      title: "Student Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "studentEmail",
      title: "Student Email",
      type: "string",
    }),
    defineField({
      name: "courseId",
      title: "Course ID (Sanity)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "courseTitle",
      title: "Course Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "courseSlug",
      title: "Course Slug",
      type: "string",
    }),
    defineField({
      name: "issuedAt",
      title: "Issued At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Valid", value: "valid" },
          { title: "Revoked", value: "revoked" },
        ],
      },
      initialValue: "valid",
    }),
  ],

  preview: {
    select: {
      title: "studentName",
      subtitle: "courseTitle",
      certId: "certificateId",
    },
    prepare({ title, subtitle, certId }) {
      return {
        title: title || "Unknown Student",
        subtitle: `${subtitle || "Unknown Course"} — ${certId || ""}`,
      };
    },
  },
});
