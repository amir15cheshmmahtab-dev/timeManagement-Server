/* eslint-disable @typescript-eslint/no-explicit-any */

export class ServiceException extends Error {
  public code: string;
  public status: number;
  public data: any;
  constructor(status: number, code: string, data: any = undefined) {
    super(code);
    this.status = status;
    this.code = code;
    this.data = data;
  }
}
