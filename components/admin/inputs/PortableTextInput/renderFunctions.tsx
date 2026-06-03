import type {
  RenderStyleFunction,
  RenderDecoratorFunction,
  RenderBlockFunction,
  RenderListItemFunction,
  RenderAnnotationFunction,
} from "@portabletext/editor";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export const renderStyle: RenderStyleFunction = (props) => {
  const style = props.schemaType.value;

  if (style === "h1") {
    return (
      <h1 className="text-3xl font-bold text-white mt-6 mb-3">
        {props.children}
      </h1>
    );
  }
  if (style === "h2") {
    return (
      <h2 className="text-2xl font-bold text-white mt-5 mb-2">
        {props.children}
      </h2>
    );
  }
  if (style === "h3") {
    return (
      <h3 className="text-xl font-semibold text-white mt-4 mb-2">
        {props.children}
      </h3>
    );
  }
  if (style === "h4") {
    return (
      <h4 className="text-lg font-semibold text-white mt-3 mb-1">
        {props.children}
      </h4>
    );
  }
  if (style === "blockquote") {
    return (
      <blockquote className="border-l-4 border-blue-600 pl-4 my-4 italic text-slate-400">
        {props.children}
      </blockquote>
    );
  }

  return <p className="text-slate-300 leading-relaxed my-2">{props.children}</p>;
};

export const renderDecorator: RenderDecoratorFunction = (props) => {
  const decorator = props.value;

  if (decorator === "strong") {
    return (
      <strong className="font-semibold text-white">{props.children}</strong>
    );
  }
  if (decorator === "em") {
    return <em className="italic">{props.children}</em>;
  }
  if (decorator === "underline") {
    return <u className="underline underline-offset-2">{props.children}</u>;
  }
  if (decorator === "strike-through") {
    return <s className="line-through">{props.children}</s>;
  }
  if (decorator === "code") {
    return (
      <code className="bg-slate-50 px-1.5 py-0.5 rounded text-sm text-blue-300 font-mono">
        {props.children}
      </code>
    );
  }

  return <>{props.children}</>;
};

export const renderAnnotation: RenderAnnotationFunction = (props) => {
  if (props.schemaType.name === "link") {
    const href = props.value?.href as string | undefined;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-300 underline underline-offset-2 transition-colors cursor-pointer"
      >
        {props.children}
      </a>
    );
  }

  return <>{props.children}</>;
};

export const renderBlock: RenderBlockFunction = (props) => {
  if (props.schemaType.name === "image") {
    const value = props.value as {
      asset?: { _ref?: string };
      caption?: string;
      alt?: string;
    };

    if (!value?.asset?._ref) {
      return (
        <div className="my-4 p-4 border border-dashed border-slate-600 rounded-lg text-center text-slate-500">
          Image not found
        </div>
      );
    }

    const imageUrl = urlFor({ asset: { _ref: value.asset._ref } })
      .width(800)
      .fit("max")
      .auto("format")
      .url();

    return (
      <figure className="my-6" contentEditable={false}>
        <div className="relative rounded-lg overflow-hidden bg-white">
          <Image
            src={imageUrl}
            alt={value.alt || "Image"}
            width={800}
            height={450}
            className="w-full h-auto object-contain"
          />
        </div>
        {value.caption && (
          <figcaption className="text-sm text-slate-400 mt-2 text-center italic">
            {value.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return <div className="my-1">{props.children}</div>;
};

export const renderListItem: RenderListItemFunction = (props) => {
  const listType = props.schemaType.value;

  if (listType === "bullet") {
    return (
      <li className="ml-6 list-disc text-slate-300 my-1">{props.children}</li>
    );
  }
  if (listType === "number") {
    return (
      <li className="ml-6 list-decimal text-slate-300 my-1">{props.children}</li>
    );
  }

  return <li className="ml-6 text-slate-300 my-1">{props.children}</li>;
};
