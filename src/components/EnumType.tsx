import protobuf from "protobufjs";
import Field from "@/components/Field";

export interface EnumProps {
  enumType: protobuf.Enum;
}

export default function EnumType({ enumType }: EnumProps) {
  return (
    <div className="card px-2 py-1">
      <div>
        [Enum] <span className="fw-bolder">{enumType.name}</span>
        {" {"}
      </div>
      <div className="ps-3">
        {Object.entries(enumType.values).map(([key, value]) => (
          <div key={key}>
            {key} = {value}{" "}
            {!!enumType.valuesOptions && (
              <span>
                [
                {Object.entries(enumType.valuesOptions[key] ?? {}).map(
                  ([key, option]) => (
                    <div key={key} className="ms-3">
                      {key}: {option.toString()}
                    </div>
                  ),
                )}
                ]
              </span>
            )}
          </div>
        ))}
      </div>
      <div>{"}"}</div>
    </div>
  );
}
