import { Controller, ControllerProps, useFormContext } from "react-hook-form";
import { Form } from "react-bootstrap";

export interface FormControlledFieldProps {
  fieldName: string;
  render: ControllerProps["render"];
}

export default function FormControlledField({
  fieldName,
  render,
}: FormControlledFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Form.Group>
      <Controller name={fieldName} control={control} render={render} />
      <Form.Control.Feedback type="invalid">
        {JSON.stringify(errors[fieldName]?.message)}
      </Form.Control.Feedback>
    </Form.Group>
  );
}
