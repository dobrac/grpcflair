export const mockFormContext = {
  formState: {
    isValid: true,
  },
  setError: jest.fn(),
};

jest.mock("react-hook-form", () => {
  const module = jest.requireActual("react-hook-form");
  const useFormContext = () => ({
    ...module.useFormContext(),
    ...mockFormContext,
  });
  return {
    ...module,
    useFormContext,
  };
});
