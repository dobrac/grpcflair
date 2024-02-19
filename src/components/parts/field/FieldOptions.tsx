import protobuf from "protobufjs";
import Options from "@/components/parts/helpers/Options";

export interface FieldOptionsProps {
  field: protobuf.Field | protobuf.OneOf;
  dark?: boolean;
}

export default function FieldOptions({ field, dark }: FieldOptionsProps) {
  return <Options reflectionObject={field} />;
}
