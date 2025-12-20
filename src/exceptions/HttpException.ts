import { isEmpty } from 'class-validator';

export class HttpException extends Error {
  public status: number;
  public message: string;
  public data: object;
  public code: string;
  public validationData;

  constructor(
    status: number,
    code: string,
    data: object = undefined,
    validationData= {}
  ) {
    super(code);
    this.message = code;
    if (isEmpty(this.message)) {
      this.message = "error_code_unavailable";
    }
    this.status = status;
    this.validationData = validationData;
    this.code = code;
    this.data = data;
  }
}
