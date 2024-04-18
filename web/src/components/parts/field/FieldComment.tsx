import protobuf from "protobufjs";

export interface FieldCommentProps {
  field: protobuf.Field | protobuf.OneOf;
  dark?: boolean;
}

export default function FieldComment({ field }: FieldCommentProps) {
  if (!field.comment) {
    return null;
  }

  return (
    <span
      className={[
        "fst-italic",
        "small",
        "text-secondary",
        "whitespace-pre-wrap",
      ].join(" ")}
    >
      {field.comment}
    </span>
  );
}
