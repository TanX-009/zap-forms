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

//function requestFailureCallback<TResponse>(
//  error: unknown,
//): TApiResponse<TResponse> {
//  if (axios.isAxiosError(error) && error.response) {
//    return {
//      success: false,
//      status: error.response.status,
//      error: error.response.data as TErrorResponse,
//    };
//  }
//  console.error("Error: ", error);
//  return {
//    success: false,
//    status: 0,
//    error: { detail: "Error!" } as TErrorResponse,
//  };
//}

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
    // delete tokens from user and logout the user
    deleteLogin();
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
  if (axios.isAxiosError(error) && error.response) {
    // original request which will be used later deep to retry the request
    const originalRequest = error.config as AxiosRequestConfig;

    if (error.response.status !== 401 && !originalRequest) {
      // other error by server
      return {
        success: false,
        status: error.response.status,
        error: error.response.data as TErrorResponse,
      };
    }

    return await handle401Error<TResponse>(originalRequest);
  }

  // error is unknown and unexpected
  console.error("Error: ", error);
  return {
    success: false,
    status: 0,
    error: { detail: "An unexpected error occurred!" } as TErrorResponse,
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
  //return instance
  //  .get<TResponse>(url, { params })
  //  .then((response: AxiosResponse<TResponse>) => response.data)
  //  .catch((error: AxiosError) => requestFailureCallback(url, error));
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
  //return instance
  //  .put<TResponse>(url, data)
  //  .then((response: AxiosResponse<TResponse>) => response.data)
  //  .catch((error: AxiosError) => requestFailureCallback(url, error));
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
  //return instance
  //  .post<TResponse>(url, data)
  //  .then((response: AxiosResponse<TResponse>) => response.data)
  //  .catch((error: AxiosError) => requestFailureCallback(url, error));
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
  //return instance
  //  .delete<TResponse>(url, { params })
  //  .then((response: AxiosResponse<TResponse>) => response.data)
  //  .catch((error: AxiosError) => requestFailureCallback(url, error));
}

export { get, post, put, delete_ };

export type { TApiResponse, TErrorResponse };
