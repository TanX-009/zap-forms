import axios, { AxiosRequestConfig } from "axios";
import Services from "./serviceUrls";
import { deleteLogin } from "@/app/actions/cookies";

interface TErrorResponse {
  detail: string;
  [key: string]: string | string[] | number | boolean | undefined;
}

interface TApiSuccess<T> {
  success: true;
  data: T;
}

interface TApiFailure {
  success: false;
  status: number;
  error: TErrorResponse;
}

type TApiResponse<T> = TApiSuccess<T> | TApiFailure;

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL as string,
  timeout: 300000,
  headers: {
    Accept: "application/json",
    "content-type": "application/json",
  },
});

async function handleTokenRefresh<TResponse>(
  originalRequest: AxiosRequestConfig,
): Promise<TApiResponse<TResponse>> {
  // retry the original request
  return await axios<TResponse>(originalRequest)
    .then(
      (retryResponse) =>
        // return the retired request data
        ({
          success: true,
          data: retryResponse.data,
        }) as TApiResponse<TResponse>,
    )
    .catch((retryError) => {
      console.error("Retry failed: ", retryError);
      return {
        success: false,
        status: retryError.status,
        error: { detail: "Retry failed!", error: retryError },
      };
    });
}

async function handle401Error<TResponse>(
  originalRequest: AxiosRequestConfig,
): Promise<TApiResponse<TResponse>> {
  try {
    // try to refresh token
    await instance.post<TResponse>(
      Services.refresh,
      {},
      { withCredentials: true },
    );

    // if refreshed successfully
    return await handleTokenRefresh(originalRequest);
  } catch (error) {
    // the tokens are now expired
    console.error("Refresh token error: ", error);
    // ------------------------------------------
    // delete tokens from user and logout the user
    deleteLogin();
    // handler block when the tokens expire
    // ------------------------------------------
    return {
      success: false,
      status: 401,
      error: {
        detail: "Refresh token expired!",
        error: error,
      } as TErrorResponse,
    };
  }
}

async function requestFailureCallback<TResponse>(
  error: unknown,
): Promise<TApiResponse<TResponse>> {
  if (!axios.isAxiosError(error)) {
    // error is unknown and unexpected
    console.error("Error: ", error);
    return {
      success: false,
      status: 0,
      error: { detail: "An unexpected error occurred!" } as TErrorResponse,
    };
  }

  if (error.code === "ERR_NETWORK") {
    return {
      success: false,
      status: 0,
      error: { detail: "Network error!" },
    };
  }

  if (!error.response) {
    return {
      success: false,
      status: 0,
      error: { detail: "Unknown network error occured!" },
    };
  }

  const originalRequest = error.config as AxiosRequestConfig;

  if (!originalRequest) {
    console.error("Original request config not found!");
    return {
      success: false,
      status: error.response.status,
      error: { detail: "An unexpected error occurred!" },
    };
  }

  if (error.response.status === 401) {
    return await handle401Error<TResponse>(originalRequest);
  }

  // other error by server
  return {
    success: false,
    status: error.response.status,
    error: {
      detail: "Request failed with status: " + error.response.status,
      data: error.response.data,
    },
  };
}

async function get<TRequest, TResponse>(
  url: string,
  params?: TRequest,
  withCredentials: boolean = false,
): Promise<TApiResponse<TResponse>> {
  try {
    const response = await instance.get<TResponse>(url, {
      params,
      withCredentials,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return requestFailureCallback(error);
  }
}

async function put<TRequest, TResponse>(
  url: string,
  data: TRequest,
  withCredentials: boolean = false,
): Promise<TApiResponse<TResponse>> {
  try {
    const response = await instance.put<TResponse>(url, data, {
      withCredentials,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return requestFailureCallback(error);
  }
}

async function post<TRequest, TResponse>(
  url: string,
  data: TRequest,
  withCredentials: boolean = false,
): Promise<TApiResponse<TResponse>> {
  try {
    const response = await instance.post<TResponse>(url, data, {
      withCredentials,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return requestFailureCallback(error);
  }
}

async function delete_<TRequest, TResponse>(
  url: string,
  params?: TRequest,
  withCredentials: boolean = false,
): Promise<TApiResponse<TResponse>> {
  try {
    const response = await instance.delete<TResponse>(url, {
      params,
      withCredentials,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return requestFailureCallback(error);
  }
}

export { get, post, put, delete_ };

export type { TApiResponse, TErrorResponse };
