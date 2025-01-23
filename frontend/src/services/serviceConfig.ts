import axios from "axios";

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
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "content-type": "application/json",
  },
});

const formDataInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL as string,
  timeout: 100000,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "content-type": "multipart/form-data",
  },
});

function requestFailureCallback<TResponse>(
  error: unknown,
): TApiResponse<TResponse> {
  if (axios.isAxiosError(error) && error.response) {
    return {
      success: false,
      status: error.response.status,
      error: error.response.data as TErrorResponse,
    };
  }
  console.error("Error: ", error);
  return {
    success: false,
    status: 0,
    error: { detail: "Error!" } as TErrorResponse,
  };
}

async function get<TRequest, TResponse>(
  url: string,
  params?: TRequest,
): Promise<TApiResponse<TResponse>> {
  try {
    const response = await instance.get<TResponse>(url, { params });
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
): Promise<TApiResponse<TResponse>> {
  try {
    const response = await instance.put<TResponse>(url, data);
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
): Promise<TApiResponse<TResponse>> {
  try {
    const response = await instance.post<TResponse>(url, data);
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
): Promise<TApiResponse<TResponse>> {
  try {
    const response = await instance.delete<TResponse>(url, { params });
    return { success: true, data: response.data };
  } catch (error) {
    return requestFailureCallback(error);
  }
  //return instance
  //  .delete<TResponse>(url, { params })
  //  .then((response: AxiosResponse<TResponse>) => response.data)
  //  .catch((error: AxiosError) => requestFailureCallback(url, error));
}

async function formDataPut<TResponse>(
  url: string,
  data?: FormData,
): Promise<TApiResponse<TResponse>> {
  try {
    const response = await formDataInstance.put<TResponse>(url, data);
    return { success: true, data: response.data };
  } catch (error) {
    return requestFailureCallback(error);
  }
  //return formDataInstance
  //  .put<TResponse>(url, data)
  //  .then((response: AxiosResponse<TResponse>) => response.data)
  //  .catch((error: AxiosError) => requestFailureCallback(url, error));
}

async function formDataPost<TResponse>(
  url: string,
  data?: FormData,
): Promise<TApiResponse<TResponse>> {
  try {
    const response = await formDataInstance.post<TResponse>(url, data);
    return { success: true, data: response.data };
  } catch (error) {
    return requestFailureCallback(error);
  }
  //return formDataInstance
  //  .post<TResponse>(url, data)
  //  .then((response: AxiosResponse<TResponse>) => response.data)
  //  .catch((error: AxiosError) => requestFailureCallback(url, error));
}

export { get, post, put, delete_, formDataPut, formDataPost };

export type { TApiResponse, TErrorResponse };
