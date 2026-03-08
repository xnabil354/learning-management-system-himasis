import { PlayIcon, UserIcon, VideoIcon, EditIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const lessonType = defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  icon: PlayIcon,
  groups: [
    { name: "content", title: "Content", icon: PlayIcon, default: true },
    { name: "video", title: "Video", icon: VideoIcon },
    { name: "quiz", title: "Quiz", icon: EditIcon },
    { name: "settings", title: "Settings" },
    { name: "completion", title: "Completed By", icon: UserIcon },
  ],

  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (Rule) => [
        Rule.required().error("Lesson title is required"),
        Rule.max(100).warning("Keep lesson titles concise"),
      ],
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "settings",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => [
        Rule.required().error("Slug is required for URL generation"),
      ],
    }),
    defineField({
      name: "description",
      type: "text",
      group: "content",
      description: "Brief overview of what this lesson covers",
      validation: (Rule) => [
        Rule.max(500).warning("Keep descriptions under 500 characters"),
      ],
    }),
    defineField({
      title: "YouTube Video URL",
      name: "videoUrl",
      type: "url",
      group: ["content", "video"],
      description:
        "Paste a YouTube video URL (e.g. https://www.youtube.com/watch?v=abc123)",
      validation: (Rule) => [
        Rule.uri({
          scheme: ["http", "https"],
        }).error("Must be a valid URL"),
      ],
    }),
    defineField({
      title: "Video Duration (minutes)",
      name: "duration",
      type: "number",
      group: ["content", "video"],
      description: "Duration of the video in minutes (e.g. 15)",
      validation: (Rule) => [
        Rule.min(0).error("Duration must be a positive number"),
      ],
    }),
    defineField({
      name: "content",
      type: "array",
      group: "content",
      description: "Additional lesson content, notes, or resources",
      of: [
        defineArrayMember({
          type: "block",
        }),
        defineArrayMember({
          type: "image",
          fields: [
            defineField({
              name: "caption",
              type: "string",
              description: "Optional caption for the image",
            }),
            defineField({
              name: "alt",
              type: "string",
              description: "Alternative text for accessibility",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "completedBy",
      type: "array",
      group: "completion",
      description: "List of user IDs who have completed this lesson",
      of: [defineArrayMember({ type: "string" })],
      readOnly: true,
    }),

    defineField({
      name: "quiz",
      title: "Quiz / Assessment",
      type: "array",
      group: "quiz",
      description:
        "Add multiple choice questions for this lesson. Students will be quizzed after reading the material.",
      of: [
        defineArrayMember({
          type: "object",
          name: "question",
          title: "Question",
          icon: EditIcon,
          fields: [
            defineField({
              name: "questionText",
              title: "Question",
              type: "text",
              rows: 3,
              validation: (Rule) =>
                Rule.required().error("Question text is required"),
            }),
            defineField({
              name: "options",
              title: "Answer Options",
              type: "array",
              description:
                "Add 2-6 answer options. Exactly one must be marked as correct.",
              validation: (Rule) =>
                Rule.required()
                  .min(2)
                  .max(6)
                  .error("Must have 2-6 answer options"),
              of: [
                defineArrayMember({
                  type: "object",
                  name: "option",
                  fields: [
                    defineField({
                      name: "text",
                      title: "Option Text",
                      type: "string",
                      validation: (Rule) =>
                        Rule.required().error("Option text is required"),
                    }),
                    defineField({
                      name: "isCorrect",
                      title: "Is Correct Answer?",
                      type: "boolean",
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: {
                      title: "text",
                      isCorrect: "isCorrect",
                    },
                    prepare({ title, isCorrect }) {
                      return {
                        title: title || "Untitled Option",
                        subtitle: isCorrect ? "✅ Correct Answer" : "",
                      };
                    },
                  },
                }),
              ],
            }),
            defineField({
              name: "explanation",
              title: "Explanation (shown after answering)",
              type: "text",
              rows: 2,
              description:
                "Optional explanation that appears after the student answers this question.",
            }),
          ],
          preview: {
            select: {
              title: "questionText",
              options: "options",
            },
            prepare({ title, options }) {
              const optionCount = options?.length || 0;
              return {
                title: title || "Untitled Question",
                subtitle: `${optionCount} option${optionCount !== 1 ? "s" : ""}`,
                media: EditIcon,
              };
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: "title",
      quiz: "quiz",
    },
    prepare({ title, quiz }) {
      const quizCount = quiz?.length || 0;
      return {
        title: title || "Untitled Lesson",
        subtitle:
          quizCount > 0
            ? `📝 ${quizCount} quiz question${quizCount !== 1 ? "s" : ""}`
            : undefined,
        media: PlayIcon,
      };
    },
  },
});
