import React, { useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./richTextEditor.css";

/**
 * RichTextEditor — Quill wrapper for blog article body.
 * Outputs clean HTML (h2/h3/p/ul/ol/blockquote/a/strong/em) that the
 * client BlogDetail page renders + styles. Drop-in replacement for the
 * plain <textarea>: same value(string) / onChange(string) contract.
 */
const RichTextEditor = ({ value, onChange, placeholder }) => {
  // Header levels limited to 2 & 3 — matches BlogDetail's h2/h3 styling + TOC.
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "link"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "list",
    "blockquote",
    "link",
  ];

  return (
    <ReactQuill
      theme="snow"
      value={value || ""}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder || "Enter your content here..."}
    />
  );
};

export default RichTextEditor;
