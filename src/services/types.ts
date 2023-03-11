/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig } from 'axios';

export interface ErrorResponseBody {
  code: number;
  message: string;
}

export interface GenericAxiosErrorResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
}

export interface GenericAxiosError<T> extends Error {
  config: AxiosRequestConfig;
  code?: number;
  response?: GenericAxiosErrorResponse<T>;
}

export interface GenericResponseBody<T> {
  code: number;
  data: T;
  message: string;
}

export type ErrorResponse = GenericAxiosError<ErrorResponseBody>;
