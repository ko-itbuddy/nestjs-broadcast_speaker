declare interface HttpResponse {
  statusCode: string;
  message: string;
  json?: any;
  error?: string;
}
declare interface ResultCodeMsg {
  CODE: string;
  MSG: string;
}
