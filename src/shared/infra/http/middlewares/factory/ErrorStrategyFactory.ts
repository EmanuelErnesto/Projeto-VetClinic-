import ApplicationError from "@shared/errors/ApplicationError";
import { IErrorStrategy } from "../strategy/IErrorStrategy";
import { ApplicationErrorStrategy } from "../strategy/ApplicationErrorStrategy";
import { InternalServerErrorStrategy } from "../strategy/InternalServerErrorStrategy";
import { HttpServerErrors } from "@shared/types/HttpErrors";

export class ErrorStrategyFactory {
  private strategies: Map<string, IErrorStrategy> = new Map();

  constructor() {
    this.strategies.set("ApplicationError", new ApplicationErrorStrategy());
    this.strategies.set("default", new InternalServerErrorStrategy());
  }

  public getStrategy(error: HttpServerErrors): IErrorStrategy | undefined {
    if (error instanceof ApplicationError) {
      return this.strategies.get("ApplicationError");
    }

    return this.strategies.get("default");
  }
}
