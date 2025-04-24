/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqPriceconditionEntity } from './boq-pricecondition-entity.interface';
import { IBoqItemEntity } from '@libs/boq/interfaces';

export interface IBoqPriceConditionRecalculateEntityGenerated {

/*
 * AutoSave
 */
  AutoSave?: boolean | null;

/*
 * ErrorMessages
 */
  //ErrorMessages?: IPriceConditionCalcMessageEntity[] | null;

/*
 * ExchangeRate
 */
  ExchangeRate?: number | null;

/*
 * HeaderId
 */
  HeaderId?: number | null;

/*
 * HeaderName
 */
  HeaderName?: string | null;

/*
 * IsSuccess
 */
  IsSuccess?: boolean | null;

/*
 * Lookups
 */
  Lookups?: {[key: string]: unknown} | null;

/*
 * MainItem
 */
  MainItem?: IBoqItemEntity | null;

/*
 * PriceConditions
 */
  PriceConditions?: IBoqPriceconditionEntity[] | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * Reload
 */
  Reload?: boolean | null;

/*
 * VatPercent
 */
  VatPercent?: number | null;
}
