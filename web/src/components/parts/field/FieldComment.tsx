import protobuf from "protobufjs";

export interface FieldCommentProps {
  field: protobuf.Field | protobuf.OneOf;
  dark?: boolean;
}

export default function FieldComment({ field, dark }: FieldCommentProps) {
  if (!field.comment) {
    return null;
  }

  return (
    <span
      className={[
        "fst-italic",
        "small",
        "text-secondary",
        "whitespace-pre",
      ].join(" ")}
    >
      {field.comment}
    </span>
  );
}
