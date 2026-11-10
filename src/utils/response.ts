import type { Response } from 'express';

/**
 * Interface standar untuk respons API sukses
 */
interface SuccessResponseOptions<T> {
  res: Response;
  statusCode?: number;
  message: string;
  data?: T;
  meta?: Record<string, any>;
}

/**
 * Interface standar untuk respons API error
 */
interface ErrorResponseOptions {
  res: Response;
  statusCode?: number;
  message: string;
  errors?: any;
}

export class ResponseUtils {
  /**
   * Mengirimkan respons sukses yang seragam ke klien
   */
  public static success<T>({
    res,
    statusCode = 200,
    message,
    data,
    meta,
  }: SuccessResponseOptions<T>): Response {
    return res.status(statusCode).json({
      status: 'success',
      message,
      ...(data !== undefined && { data }),
      ...(meta !== undefined && { meta }),
    });
  }

  /**
   * Mengirimkan respons error yang seragam ke klien
   */
  public static error({
    res,
    statusCode = 400,
    message,
    errors,
  }: ErrorResponseOptions): Response {
    return res.status(statusCode).json({
      status: 'error',
      message,
      ...(errors !== undefined && { errors }),
    });
  }
}