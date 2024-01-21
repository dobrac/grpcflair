import protobuf from "protobufjs";

export interface FieldCommentProps {
  field: protobuf.Field;
  dark?: boolean;
}

export default function FieldComment({ field, dark }: FieldCommentProps) {
  if (!field.comment) {
    return null;
  }

  return (
    <span className={["fst-italic", "small", "text-secondary"].join(" ")}>
      {field.comment}
    </span>
  );
}
