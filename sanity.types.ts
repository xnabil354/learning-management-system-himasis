import "@sanity/client";

import type { ProjectionBase } from "groq";

export declare const internalGroqTypeReferenceTo: unique symbol;

export type Note = {
  _id: string;
  _type: "note";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  content?: string;
  status?: "draft" | "inProgress" | "complete";
};

export type Review = {
  _id: string;
  _type: "review";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  courseId?: string;
  userId?: string;
  userName?: string;
  userImage?: string;
  rating?: number;
  comment?: string;
};

export type Lesson = {
  _id: string;
  _type: "lesson";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  slug?: Slug;
  description?: string;
  videoUrl?: string;
  duration?: number;
  content?: Array<
    | {
        children?: Array<{
          marks?: Array<string>;
          text?: string;
          _type: "span";
          _key: string;
        }>;
        style?:
          | "normal"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "blockquote";
        listItem?: "bullet" | "number";
        markDefs?: Array<{
          href?: string;
          _type: "link";
          _key: string;
        }>;
        level?: number;
        _type: "block";
        _key: string;
      }
    | {
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        media?: unknown;
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        caption?: string;
        alt?: string;
        _type: "image";
        _key: string;
      }
  >;
  completedBy?: Array<string>;
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type MuxVideo = {
  _type: "mux.video";
  asset?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "mux.videoAsset";
  };
};

export type Slug = {
  _type: "slug";
  current?: string;
  source?: string;
};

export type Module = {
  _id: string;
  _type: "module";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  description?: string;
  lessons?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "lesson";
  }>;
  completedBy?: Array<string>;
};

export type Course = {
  _id: string;
  _type: "course";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  slug?: Slug;
  description?: string;
  thumbnail?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    media?: unknown;
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  category?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "category";
  };
  tier?: "free" | "pro" | "ultra";
  modules?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "module";
  }>;
  featured?: boolean;
  completedBy?: Array<string>;
};

export type Category = {
  _id: string;
  _type: "category";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  description?: string;
  icon?: string;
  coursesInfo?: string;
};

export type MuxVideoAsset = {
  _id: string;
  _type: "mux.videoAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  status?: string;
  assetId?: string;
  playbackId?: string;
  filename?: string;
  thumbTime?: number;
  data?: MuxAssetData;
};

export type MuxAssetData = {
  _type: "mux.assetData";
  resolution_tier?: string;
  upload_id?: string;
  created_at?: string;
  id?: string;
  status?: string;
  max_stored_resolution?: string;
  passthrough?: string;
  encoding_tier?: string;
  video_quality?: string;
  master_access?: string;
  aspect_ratio?: string;
  duration?: number;
  max_stored_frame_rate?: number;
  mp4_support?: string;
  max_resolution_tier?: string;
  tracks?: Array<
    {
      _key: string;
    } & MuxTrack
  >;
  playback_ids?: Array<
    {
      _key: string;
    } & MuxPlaybackId
  >;
  static_renditions?: MuxStaticRenditions;
};

export type MuxStaticRenditions = {
  _type: "mux.staticRenditions";
  status?: string;
  files?: Array<
    {
      _key: string;
    } & MuxStaticRenditionFile
  >;
};

export type MuxStaticRenditionFile = {
  _type: "mux.staticRenditionFile";
  name?: string;
  ext?: string;
  height?: number;
  width?: number;
  bitrate?: number;
  filesize?: string;
  type?: string;
  status?: string;
  resolution_tier?: string;
  resolution?: string;
  id?: string;
  passthrough?: string;
};

export type MuxPlaybackId = {
  _type: "mux.playbackId";
  id?: string;
  policy?: string;
};

export type MuxTrack = {
  _type: "mux.track";
  id?: string;
  type?: string;
  max_width?: number;
  max_frame_rate?: number;
  duration?: number;
  max_height?: number;
};

export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type AllSanitySchemaTypes =
  | Note
  | Review
  | Lesson
  | SanityImageCrop
  | SanityImageHotspot
  | Slug
  | Module
  | Course
  | Category
  | SanityImagePaletteSwatch
  | SanityImagePalette
  | SanityImageDimensions
  | SanityImageMetadata
  | SanityFileAsset
  | SanityAssetSourceData
  | SanityImageAsset
  | Geopoint;

export type DefaultSchema =
  | Note
  | Review
  | Lesson
  | SanityImageCrop
  | SanityImageHotspot
  | Slug
  | Module
  | Course
  | Category
  | SanityImagePaletteSwatch
  | SanityImagePalette
  | SanityImageDimensions
  | SanityImageMetadata
  | SanityFileAsset
  | SanityAssetSourceData
  | SanityImageAsset
  | Geopoint;

declare module "groq" {
  interface SanitySchemas {
    default: DefaultSchema;
  }
}

export type FEATURED_COURSES_QUERYResult = Array<{
  _id: string;
  title: string | null;
  slug: Slug | null;
  description: string | null;
  tier: "free" | "pro" | "ultra" | null;
  featured: boolean | null;
  thumbnail: {
    asset: {
      _id: string;
      url: string | null;
    } | null;
  } | null;
  moduleCount: number | null;
  lessonCount: number | null;
}>;

export type ALL_COURSES_QUERYResult = Array<{
  _id: string;
  title: string | null;
  slug: Slug | null;
  description: string | null;
  tier: "free" | "pro" | "ultra" | null;
  featured: boolean | null;
  thumbnail: {
    asset: {
      _id: string;
      url: string | null;
    } | null;
  } | null;
  moduleCount: number | null;
  lessonCount: number | null;
}>;

export type COURSE_BY_ID_QUERYResult = {
  _id: string;
  title: string | null;
  slug: Slug | null;
  description: string | null;
  tier: "free" | "pro" | "ultra" | null;
  featured: boolean | null;
  thumbnail: {
    asset: {
      _id: string;
      url: string | null;
    } | null;
  } | null;
  category: {
    _id: string;
    title: string | null;
  } | null;
  modules: Array<{
    _id: string;
    title: string | null;
    description: string | null;
    lessons: Array<{
      _id: string;
      title: string | null;
      slug: Slug | null;
    }> | null;
  }> | null;
} | null;

export type COURSE_BY_SLUG_QUERYResult = {
  _id: string;
  title: string | null;
  slug: Slug | null;
  description: string | null;
  tier: "free" | "pro" | "ultra" | null;
  featured: boolean | null;
  thumbnail: {
    asset: {
      _id: string;
      url: string | null;
    } | null;
  } | null;
  category: {
    _id: string;
    title: string | null;
  } | null;
  modules: Array<{
    _id: string;
    title: string | null;
    description: string | null;
    lessons: Array<{
      _id: string;
      title: string | null;
      slug: Slug | null;
    }> | null;
  }> | null;
} | null;

export type STATS_QUERYResult = {
  courseCount: number;
  lessonCount: number;
};

export type DASHBOARD_COURSES_QUERYResult = Array<{
  _id: string;
  title: string | null;
  slug: Slug | null;
  description: string | null;
  tier: "free" | "pro" | "ultra" | null;
  featured: boolean | null;
  completedBy: Array<string> | null;
  thumbnail: {
    asset: {
      _id: string;
      url: string | null;
    } | null;
  } | null;
  category: {
    _id: string;
    title: string | null;
  } | null;
  modules: Array<{
    lessons: Array<{
      _id: string;
      title: string | null;
      slug: Slug | null;
      completedBy: Array<string> | null;
      duration: number | null;
    }> | null;
  }> | null;
  moduleCount: number | null;
  lessonCount: number | null;
}>;

export type COURSE_WITH_MODULES_QUERYResult = {
  _id: string;
  title: string | null;
  slug: Slug | null;
  description: string | null;
  tier: "free" | "pro" | "ultra" | null;
  featured: boolean | null;
  thumbnail: {
    asset: {
      _id: string;
      url: string | null;
    } | null;
  } | null;
  category: {
    _id: string;
    title: string | null;
  } | null;
  modules: Array<{
    _id: string;
    title: string | null;
    description: string | null;
    completedBy: Array<string> | null;
    lessons: Array<{
      _id: string;
      title: string | null;
      slug: Slug | null;
      description: string | null;
      completedBy: Array<string> | null;
      videoUrl: string | null;
      duration: number | null;
    }> | null;
  }> | null;
  completedBy: Array<string> | null;
  moduleCount: number | null;
  lessonCount: number | null;
  completedLessonCount: number | null;
} | null;

export type LESSON_BY_ID_QUERYResult = {
  _id: string;
  title: string | null;
  slug: Slug | null;
  description: string | null;
  videoUrl: string | null;
  duration: number | null;
  content: Array<
    | {
        children?: Array<{
          marks?: Array<string>;
          text?: string;
          _type: "span";
          _key: string;
        }>;
        style?:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
        listItem?: "bullet" | "number";
        markDefs?: Array<{
          href?: string;
          _type: "link";
          _key: string;
        }>;
        level?: number;
        _type: "block";
        _key: string;
      }
    | {
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        media?: unknown;
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        caption?: string;
        alt?: string;
        _type: "image";
        _key: string;
      }
  > | null;
  completedBy: Array<string> | null;
  courses: Array<{
    _id: string;
    title: string | null;
    slug: Slug | null;
    modules: Array<{
      _id: string;
      title: string | null;
      lessons: Array<{
        _id: string;
        title: string | null;
        slug: Slug | null;
        completedBy: Array<string> | null;
      }> | null;
    }> | null;
  }>;
} | null;

export type LESSON_BY_SLUG_QUERYResult = {
  _id: string;
  title: string | null;
  slug: Slug | null;
  description: string | null;
  videoUrl: string | null;
  duration: number | null;
  content: Array<
    | {
        children?: Array<{
          marks?: Array<string>;
          text?: string;
          _type: "span";
          _key: string;
        }>;
        style?:
          | "blockquote"
          | "h1"
          | "h2"
          | "h3"
          | "h4"
          | "h5"
          | "h6"
          | "normal";
        listItem?: "bullet" | "number";
        markDefs?: Array<{
          href?: string;
          _type: "link";
          _key: string;
        }>;
        level?: number;
        _type: "block";
        _key: string;
      }
    | {
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        media?: unknown;
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        caption?: string;
        alt?: string;
        _type: "image";
        _key: string;
      }
  > | null;
  completedBy: Array<string> | null;
  courses: Array<{
    _id: string;
    title: string | null;
    slug: Slug | null;
    modules: Array<{
      _id: string;
      title: string | null;
      lessons: Array<{
        _id: string;
        title: string | null;
        slug: Slug | null;
        completedBy: Array<string> | null;
      }> | null;
    }> | null;
  }>;
} | null;

export type LESSON_NAVIGATION_QUERYResult = {
  _id: string;
  title: string | null;
  tier: "free" | "pro" | "ultra" | null;
  modules: Array<{
    _id: string;
    title: string | null;
    lessons: Array<{
      _id: string;
      title: string | null;
    }> | null;
  }> | null;
} | null;

export type COURSE_REVIEWS_QUERYResult = Array<{
  _id: string;
  courseId: string | null;
  userId: string | null;
  userName: string | null;
  userImage: string | null;
  rating: number | null;
  comment: string | null;
  _createdAt: string;
}>;

export type USER_REVIEW_QUERYResult = {
  _id: string;
  rating: number | null;
  comment: string | null;
} | null;

declare module "@sanity/client" {
  interface SanityQueries {
    '*[\n  _type == "course"\n  && featured == true\n] | order(_createdAt desc)[0...6] {\n  _id,\n  title,\n  slug,\n  description,\n  featured,\n  thumbnail {\n    asset-> {\n      _id,\n      url\n    }\n  },\n  "moduleCount": count(modules),\n  "lessonCount": count(modules[]->lessons[])\n}': FEATURED_COURSES_QUERYResult;
    '*[\n  _type == "course"\n] | order(_createdAt desc) {\n  _id,\n  title,\n  slug,\n  description,\n  featured,\n  thumbnail {\n    asset-> {\n      _id,\n      url\n    }\n  },\n  "moduleCount": count(modules),\n  "lessonCount": count(modules[]->lessons[])\n}': ALL_COURSES_QUERYResult;
    '*[\n  _type == "course"\n  && _id == $id\n][0] {\n  _id,\n  title,\n  slug,\n  description,\n  featured,\n  thumbnail {\n    asset-> {\n      _id,\n      url\n    }\n  },\n  category-> {\n    _id,\n    title\n  },\n  modules[]-> {\n    _id,\n    title,\n    description,\n    lessons[]-> {\n      _id,\n      title,\n      slug\n    }\n  }\n}': COURSE_BY_ID_QUERYResult;
    '*[\n  _type == "course"\n  && slug.current == $slug\n][0] {\n  _id,\n  title,\n  slug,\n  description,\n  featured,\n  thumbnail {\n    asset-> {\n      _id,\n      url\n    }\n  },\n  category-> {\n    _id,\n    title\n  },\n  modules[]-> {\n    _id,\n    title,\n    description,\n    lessons[]-> {\n      _id,\n      title,\n      slug\n    }\n  }\n}': COURSE_BY_SLUG_QUERYResult;
    '{\n  "courseCount": count(*[_type == "course"]),\n  "lessonCount": count(*[_type == "lesson"])\n}': STATS_QUERYResult;
    '*[\n  _type == "course"\n] | order(_createdAt desc) {\n  _id,\n  title,\n  slug,\n  description,\n  featured,\n  completedBy,\n  thumbnail {\n    asset-> {\n      _id,\n      url\n    }\n  },\n  category-> {\n    _id,\n    title\n  },\n  modules[]-> {\n    lessons[]-> {\n      completedBy\n    }\n  },\n  "moduleCount": count(modules),\n  "lessonCount": count(modules[]->lessons[])\n}': DASHBOARD_COURSES_QUERYResult;
    '*[\n  _type == "course"\n  && slug.current == $slug\n][0] {\n  _id,\n  title,\n  slug,\n  description,\n  featured,\n  thumbnail {\n    asset-> {\n      _id,\n      url\n    }\n  },\n  category-> {\n    _id,\n    title\n  },\n  modules[]-> {\n    _id,\n    title,\n    description,\n    completedBy,\n    lessons[]-> {\n      _id,\n      title,\n      slug,\n      description,\n      completedBy,\n      video {\n        asset-> {\n          playbackId\n        }\n      }\n    }\n  },\n  completedBy,\n  "moduleCount": count(modules),\n  "lessonCount": count(modules[]->lessons[]),\n  "completedLessonCount": count(modules[]->lessons[]->completedBy[@==$userId])\n}': COURSE_WITH_MODULES_QUERYResult;
    '*[\n  _type == "lesson"\n  && _id == $id\n][0] {\n  _id,\n  title,\n  slug,\n  description,\n  video {\n    asset-> {\n      playbackId,\n      status,\n      data {\n        duration\n      }\n    }\n  },\n  content,\n  completedBy,\n  "courses": *[_type == "course" && ^._id in modules[]->lessons[]->_id] | order(\n    select(tier == "free" => 0, tier == "pro" => 1, tier == "ultra" => 2)\n  ) {\n    _id,\n    title,\n    slug,\n    tier,\n    modules[]-> {\n      _id,\n      title,\n      lessons[]-> {\n        _id,\n        title,\n        slug,\n        completedBy\n      }\n    }\n  }\n}': LESSON_BY_ID_QUERYResult;
    '*[\n  _type == "lesson"\n  && slug.current == $slug\n][0] {\n  _id,\n  title,\n  slug,\n  description,\n  video {\n    asset-> {\n      playbackId,\n      status,\n      data {\n        duration\n      }\n    }\n  },\n  content,\n  completedBy,\n  "courses": *[_type == "course" && ^._id in modules[]->lessons[]->_id] | order(\n    select(tier == "free" => 0, tier == "pro" => 1, tier == "ultra" => 2)\n  ) {\n    _id,\n    title,\n    slug,\n    tier,\n    modules[]-> {\n      _id,\n      title,\n      lessons[]-> {\n        _id,\n        title,\n        slug,\n        completedBy\n      }\n    }\n  }\n}': LESSON_BY_SLUG_QUERYResult;
    '*[\n  _type == "course"\n  && $lessonId in modules[]->lessons[]->_id\n][0] {\n  _id,\n  title,\n  modules[]-> {\n    _id,\n    title,\n    lessons[]-> {\n      _id,\n      title\n    }\n  }\n}': LESSON_NAVIGATION_QUERYResult;
  }
}

declare module "groq" {
  interface SanityQueries {
    '*[\n  _type == "course"\n  && featured == true\n] | order(_createdAt desc)[0...6] {\n  _id,\n  title,\n  slug,\n  description,\n  featured,\n  thumbnail {\n    asset-> {\n      _id,\n      url\n    }\n  },\n  "moduleCount": count(modules),\n  "lessonCount": count(modules[]->lessons[])\n}': FEATURED_COURSES_QUERYResult;
    '*[\n  _type == "course"\n] | order(_createdAt desc) {\n  _id,\n  title,\n  slug,\n  description,\n  featured,\n  thumbnail {\n    asset-> {\n      _id,\n      url\n    }\n  },\n  "moduleCount": count(modules),\n  "lessonCount": count(modules[]->lessons[])\n}': ALL_COURSES_QUERYResult;
    '*[\n  _type == "course"\n  && _id == $id\n][0] {\n  _id,\n  title,\n  slug,\n  description,\n  featured,\n  thumbnail {\n    asset-> {\n      _id,\n      url\n    }\n  },\n  category-> {\n    _id,\n    title\n  },\n  modules[]-> {\n    _id,\n    title,\n    description,\n    lessons[]-> {\n      _id,\n      title,\n      slug\n    }\n  }\n}': COURSE_BY_ID_QUERYResult;
    '*[\n  _type == "course"\n  && slug.current == $slug\n][0] {\n  _id,\n  title,\n  slug,\n  description,\n  featured,\n  thumbnail {\n    asset-> {\n      _id,\n      url\n    }\n  },\n  category-> {\n    _id,\n    title\n  },\n  modules[]-> {\n    _id,\n    title,\n    description,\n    lessons[]-> {\n      _id,\n      title,\n      slug\n    }\n  }\n}': COURSE_BY_SLUG_QUERYResult;
    '{\n  "courseCount": count(*[_type == "course"]),\n  "lessonCount": count(*[_type == "lesson"])\n}': STATS_QUERYResult;
    '*[\n  _type == "course"\n] | order(_createdAt desc) {\n  _id,\n  title,\n  slug,\n  description,\n  featured,\n  completedBy,\n  thumbnail {\n    asset-> {\n      _id,\n      url\n    }\n  },\n  category-> {\n    _id,\n    title\n  },\n  modules[]-> {\n    lessons[]-> {\n      completedBy\n    }\n  },\n  "moduleCount": count(modules),\n  "lessonCount": count(modules[]->lessons[])\n}': DASHBOARD_COURSES_QUERYResult;
    '*[\n  _type == "course"\n  && slug.current == $slug\n][0] {\n  _id,\n  title,\n  slug,\n  description,\n  featured,\n  thumbnail {\n    asset-> {\n      _id,\n      url\n    }\n  },\n  category-> {\n    _id,\n    title\n  },\n  modules[]-> {\n    _id,\n    title,\n    description,\n    completedBy,\n    lessons[]-> {\n      _id,\n      title,\n      slug,\n      description,\n      completedBy,\n      video {\n        asset-> {\n          playbackId\n        }\n      }\n    }\n  },\n  completedBy,\n  "moduleCount": count(modules),\n  "lessonCount": count(modules[]->lessons[]),\n  "completedLessonCount": count(modules[]->lessons[]->completedBy[@==$userId])\n}': COURSE_WITH_MODULES_QUERYResult;
    '*[\n  _type == "lesson"\n  && _id == $id\n][0] {\n  _id,\n  title,\n  slug,\n  description,\n  video {\n    asset-> {\n      playbackId,\n      status,\n      data {\n        duration\n      }\n    }\n  },\n  content,\n  completedBy,\n  "courses": *[_type == "course" && ^._id in modules[]->lessons[]->_id] | order(\n    select(tier == "free" => 0, tier == "pro" => 1, tier == "ultra" => 2)\n  ) {\n    _id,\n    title,\n    slug,\n    tier,\n    modules[]-> {\n      _id,\n      title,\n      lessons[]-> {\n        _id,\n        title,\n        slug,\n        completedBy\n      }\n    }\n  }\n}': LESSON_BY_ID_QUERYResult;
    '*[\n  _type == "lesson"\n  && slug.current == $slug\n][0] {\n  _id,\n  title,\n  slug,\n  description,\n  video {\n    asset-> {\n      playbackId,\n      status,\n      data {\n        duration\n      }\n    }\n  },\n  content,\n  completedBy,\n  "courses": *[_type == "course" && ^._id in modules[]->lessons[]->_id] | order(\n    select(tier == "free" => 0, tier == "pro" => 1, tier == "ultra" => 2)\n  ) {\n    _id,\n    title,\n    slug,\n    tier,\n    modules[]-> {\n      _id,\n      title,\n      lessons[]-> {\n        _id,\n        title,\n        slug,\n        completedBy\n      }\n    }\n  }\n}': LESSON_BY_SLUG_QUERYResult;
    '*[\n  _type == "course"\n  && $lessonId in modules[]->lessons[]->_id\n][0] {\n  _id,\n  title,\n  modules[]-> {\n    _id,\n    title,\n    lessons[]-> {\n      _id,\n      title\n    }\n  }\n}': LESSON_NAVIGATION_QUERYResult;
  }
}
