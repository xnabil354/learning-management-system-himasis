import { defineField, defineType } from "sanity";

export const adminUserType = defineType({
  name: "adminUser",
  title: "Admin User",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email().error("Email harus valid"),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "addedAt",
      title: "Added At",
      type: "datetime",
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: "email",
      subtitle: "name",
    },
  },
});
