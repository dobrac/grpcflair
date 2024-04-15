import { act, render, screen } from "@testing-library/react";
import { type } from "../../../../tests/protobufjs-source";
import { getOptionsFromReflectionObject } from "@/services/protobufjs";
import FieldOptions from "@/components/parts/field/FieldOptions";
import FieldType from "@/components/parts/field/FieldType";
import protobuf from "protobufjs";

describe("FieldType", () => {
  type.fieldsArray.forEach((field) => {
    field.resolve();

    it(`renders ${field.name} - expanded false`, async () => {
      const renderedFieldType = await act(async () => {
        return render(
          <FieldType field={field} expanded={false} expandable={false} />,
        );
      });

      const element = renderedFieldType.container.firstChild;
      expect(element).toBeInTheDocument();

      expect(element).toMatchSnapshot();
    });

    it(`renders ${field.name} - expanded true`, async () => {
      const renderedFieldType = await act(async () => {
        return render(
          <FieldType field={field} expanded={true} expandable={true} />,
        );
      });

      const element = renderedFieldType.container.firstChild;
      expect(element).toBeInTheDocument();

      const typeDetail = renderedFieldType.queryByTestId("type-detail");
      if (field.resolvedType instanceof protobuf.Type) {
        expect(typeDetail).toBeInTheDocument();
      } else {
        expect(typeDetail).not.toBeInTheDocument();
      }

      const enumDetail = renderedFieldType.queryByTestId("enum");
      if (field.resolvedType instanceof protobuf.Enum) {
        expect(enumDetail).toBeInTheDocument();
      } else {
        expect(enumDetail).not.toBeInTheDocument();
      }
    });
  });
});
