export class BotError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "BotError";
  }
}

export class PermissionError extends BotError {
  constructor(message: string) {
    super(message, "PERMISSION_ERROR");
  }
}
