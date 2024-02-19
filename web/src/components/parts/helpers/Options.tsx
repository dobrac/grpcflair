import protobuf from "protobufjs";
import { getOptionsFromReflectionObject } from "@/services/protobufjs";

export interface OptionsProps {
  reflectionObject: protobuf.ReflectionObject;
  className?: string;
}

export default function Options({
  reflectionObject,
  className = "",
}: OptionsProps) {
  const options = Object.entries(
    getOptionsFromReflectionObject(reflectionObject),
  );

  if (!options.length) {
    return null;
  }

  return (
    <div className={["small text-secondary fst-italic", className].join(" ")}>
      {options.map(([key, value]) => (
        <div key={key}>
          {key}: {JSON.stringify(value)}
        </div>
      ))}
    </div>
  );
}
