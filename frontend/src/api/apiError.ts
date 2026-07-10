import { data } from "react-router-dom";

function detailToMessage(detail: unknown): string | null {
     if (typeof detail === "string") {
          return detail;
     }

     if (Array.isArray(detail)) {
          const messages = detail
               .map((item) => {
                    if (item && typeof item === "object" && "msg" in item) {
                         return String(item.msg);
                    }
                    return typeof item === "string" ? item : null;
               })
               .filter(Boolean);

          return messages.length > 0 ? messages.join(", ") : null;
     }

     return null;
}

export async function getApiErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
     try {
          const body = await response.json();
          const detailMessage = detailToMessage(body?.detail);

          if (detailMessage) {
               return detailMessage;
          }
     } catch {
          return fallbackMessage;
     }

     return fallbackMessage;
}

export async function throwApiError(response: Response, fallbackMessage: string): Promise<never> {
     const message = await getApiErrorMessage(response, fallbackMessage);
     throw data(message, { status: response.status });
}
