import { isAxiosError } from "axios";

export function getApiErrorMessage(err: unknown, fallback = "Algo deu errado. Tente novamente."): string {
  if (isAxiosError(err) && err.response?.data?.error) {
    return err.response.data.error as string;
  }
  return fallback;
}
