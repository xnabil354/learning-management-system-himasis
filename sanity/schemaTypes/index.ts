import type { SchemaTypeDefinition } from "sanity";
import { adminUserType } from "./adminUserType";
import { categoryType } from "./categoryType";
import { courseType } from "./courseType";
import { lessonType } from "./lessonType";
import { moduleType } from "./moduleType";
import { noteType } from "./noteType";
import { quizResultType } from "./quizResultType";
import { reviewType } from "./reviewType";
import { userProgressType } from "./userProgressType";
import { certificateType } from "./certificateType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    courseType,
    moduleType,
    lessonType,
    categoryType,
    noteType,
    reviewType,
    adminUserType,
    certificateType,
    userProgressType,
    quizResultType,
  ],
};
