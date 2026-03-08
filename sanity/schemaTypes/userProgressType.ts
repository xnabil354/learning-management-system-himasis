import { defineField, defineType } from "sanity";

export const userProgressType = defineType({
  name: "userProgress",
  title: "User Progress",
  type: "document",
  fields: [
    defineField({
      name: "clerkUserId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
    }),
    defineField({
      name: "userImage",
      title: "User Image URL",
      type: "string",
    }),
    defineField({
      name: "totalXp",
      title: "Total XP",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "lessonsCompleted",
      title: "Lessons Completed",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "coursesCompleted",
      title: "Courses Completed",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "currentStreak",
      title: "Current Streak (days)",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "lastActiveDate",
      title: "Last Active Date",
      type: "date",
    }),
    defineField({
      name: "badges",
      title: "Badges",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Badge ID",
              type: "string",
            }),
            defineField({
              name: "name",
              title: "Badge Name",
              type: "string",
            }),
            defineField({
              name: "earnedAt",
              title: "Earned At",
              type: "datetime",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "xpHistory",
      title: "XP History",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "amount",
              title: "Amount",
              type: "number",
            }),
            defineField({
              name: "reason",
              title: "Reason",
              type: "string",
            }),
            defineField({
              name: "earnedAt",
              title: "Earned At",
              type: "datetime",
            }),
          ],
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: "userName",
      xp: "totalXp",
    },
    prepare({ title, xp }) {
      return {
        title: title || "Unknown User",
        subtitle: `${xp || 0} XP`,
      };
    },
  },
});
