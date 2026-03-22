export function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const err = error as any;

    if (err.data?.message) {
      return err.data.message;
    }

    if (err.message) {
      return err.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}
