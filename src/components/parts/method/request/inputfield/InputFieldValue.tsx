import { Form } from "react-bootstrap";
import protobuf from "protobufjs";
import Type from "@/components/parts/Type";
import EnumType from "@/components/parts/EnumType";
import FieldType from "@/components/parts/field/FieldType";
import { useFormContext } from "react-hook-form";
import TabbedInputField, {
  InputTypeTab,
} from "@/components/parts/method/request/inputfield/layout/TabbedInputField";
import FormControlledField from "@/components/parts/method/request/inputfield/form/FormControlledField";
import { placeholderTransformation } from "@/services/form";
import { ChangeEvent } from "react";
import { groupBy } from "lodash";
import JSONBlock from "@/components/JSONBlock";

function ScalarInputField({ field }: InputFieldValueProps) {
  const {
    formState: { errors },
  } = useFormContext();

  if (field.type === "bytes") {
    return (
      <FormControlledField
        fieldName={field.name}
        render={({ field }) => (
          <Form.Control
            {...field}
            isInvalid={errors[field.name] !== undefined}
            type="file"
            value={field.value?.fileName}
            onChange={async (event: ChangeEvent<HTMLInputElement>) => {
              const file = event.target.files?.[0];
              if (!file) {
                field.onChange("");
                return;
              }
              const arrayBuffer = await file.arrayBuffer();
              const uint8Array = new Uint8Array(arrayBuffer);
              field.onChange(uint8Array);
            }}
          />
        )}
      />
    );
  }

  if (typeof field.typeDefault === "boolean") {
    return (
      <FormControlledField
        fieldName={field.name}
        render={({ field }) => (
          <Form.Select {...field} isInvalid={errors[field.name] !== undefined}>
            <option value=""></option>
            <option value="true">true</option>
            <option value="false">false</option>
          </Form.Select>
        )}
      />
    );
  }

  if (typeof field.typeDefault === "number") {
    return (
      <FormControlledField
        fieldName={field.name}
        render={({ field }) => (
          <Form.Control
            {...field}
            isInvalid={errors[field.name] !== undefined}
            as="input"
            type="number"
          />
        )}
      />
    );
  }

  return (
    <FormControlledField
      fieldName={field.name}
      render={({ field }) => (
        <Form.Control
          {...field}
          isInvalid={errors[field.name] !== undefined}
          as="input"
        />
      )}
    />
  );
}

export interface TypeInputFieldValueProps extends InputFieldValueProps {
  type: protobuf.Type;
}

function TypeInputField({ field, type }: TypeInputFieldValueProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const dataPlaceholder = placeholderTransformation(field);

  return (
    <TabbedInputField
      renderer={{
        [InputTypeTab.JSON]: (
          <FormControlledField
            fieldName={field.name}
            render={({ field }) => (
              <Form.Control
                {...field}
                as="textarea"
                rows={10}
                isInvalid={errors[field.name] !== undefined}
              />
            )}
          />
        ),
        [InputTypeTab.EXAMPLE]: (
          <JSONBlock dark={false}>
            {JSON.stringify(dataPlaceholder, null, 2)}
          </JSONBlock>
        ),
        [InputTypeTab.MODEL]: <Type type={type} expanded={true} />,
      }}
    />
  );
}

export interface EnumInputFieldProps extends InputFieldValueProps {
  enumType: protobuf.Enum;
}
function EnumInputField({ field, enumType }: EnumInputFieldProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const valuesById = groupBy(
    Object.entries(enumType.values),
    ([, value]) => value,
  );

  const dataPlaceholder = placeholderTransformation(field);

  return (
    <TabbedInputField
      renderer={{
        [InputTypeTab.ENUM]: (
          <FormControlledField
            fieldName={field.name}
            render={({ field }) => (
              <Form.Select
                {...field}
                isInvalid={errors[field.name] !== undefined}
              >
                <option value=""></option>
                {Object.entries(valuesById).map(([value, entries]) => (
                  <option key={value} value={value}>
                    {entries.map(([key]) => key).join(", ")} ({value})
                  </option>
                ))}
              </Form.Select>
            )}
          />
        ),
        [InputTypeTab.EXAMPLE]: (
          <JSONBlock dark={false}>
            {JSON.stringify(dataPlaceholder, null, 2)}
          </JSONBlock>
        ),
        [InputTypeTab.MODEL]: <EnumType enumType={enumType} expanded={true} />,
      }}
    />
  );
}

export interface InputFieldValueProps {
  field: protobuf.Field;
}

export default function InputFieldValue({ field }: InputFieldValueProps) {
  field.resolve();

  const resolvedType = field.resolvedType;

  const dataPlaceholder = placeholderTransformation(field);

  const {
    formState: { errors },
  } = useFormContext();

  if (field.repeated) {
    return (
      <TabbedInputField
        renderer={{
          [InputTypeTab.JSON]: (
            <FormControlledField
              fieldName={field.name}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={errors[field.name] !== undefined}
                  as="textarea"
                  rows={5}
                />
              )}
            />
          ),
          [InputTypeTab.EXAMPLE]: (
            <JSONBlock dark={false}>
              {JSON.stringify(dataPlaceholder, null, 2)}
            </JSONBlock>
          ),
          [InputTypeTab.MODEL]: (
            <div className="card px-2 py-1 d-inline-block">
              <FieldType field={field} expanded={true} />
            </div>
          ),
        }}
      />
    );
  }

  if (field.map) {
    return (
      <TabbedInputField
        renderer={{
          [InputTypeTab.JSON]: (
            <FormControlledField
              fieldName={field.name}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={errors[field.name] !== undefined}
                  as="textarea"
                  rows={10}
                />
              )}
            />
          ),
          [InputTypeTab.EXAMPLE]: (
            <JSONBlock dark={false}>
              {JSON.stringify(dataPlaceholder, null, 2)}
            </JSONBlock>
          ),
          [InputTypeTab.MODEL]: (
            <div className="card px-2 py-1 d-inline-block">
              <FieldType field={field} expanded={true} />
            </div>
          ),
        }}
      />
    );
  }

  if (!resolvedType) {
    return (
      <div>
        <ScalarInputField field={field} />
      </div>
    );
  }

  if (resolvedType instanceof protobuf.Type) {
    return <TypeInputField field={field} type={resolvedType} />;
  }

  if (resolvedType instanceof protobuf.Enum) {
    return <EnumInputField field={field} enumType={resolvedType} />;
  }

  return null;
}
