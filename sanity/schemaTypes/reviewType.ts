import { defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

export const reviewType = defineType({
  name: "review",
  title: "Review",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "courseId",
      title: "Course ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "userId",
      title: "User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "userImage",
      title: "User Image URL",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "comment",
      title: "Comment",
      type: "text",
      validation: (Rule) => Rule.required().min(1).max(1000),
    }),
  ],

  preview: {
    select: {
      userName: "userName",
      rating: "rating",
      comment: "comment",
    },
    prepare({ userName, rating, comment }) {
      return {
        title: `${userName ?? "Anonymous"} — ${"★".repeat(rating ?? 0)}${"☆".repeat(5 - (rating ?? 0))}`,
        subtitle: comment?.slice(0, 80) ?? "",
        media: StarIcon,
      };
    },
  },
});
