/*
 * Copyright(c) RIB Software GmbH
 */
/**
 * Price Condition Context
 */
export interface IPriceConditionContext {
      PrcPriceConditionId: number | null;
      HeaderId?: number;
      HeaderName: string;
      ProjectFk?: number;
      ExchangeRate?:number;
}