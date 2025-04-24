/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemEntity } from '@libs/boq/interfaces';

export interface IBoqPriceConditionReloadParamEntityGenerated {

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
 * IsCopyFromBoqDivision
 */
  IsCopyFromBoqDivision?: boolean | null;

/*
 * IsCopyFromPrcItem
 */
  IsCopyFromPrcItem?: boolean | null;

/*
 * IsFromMaterial
 */
  IsFromMaterial?: boolean | null;

/*
 * MainItem
 */
  MainItem?: IBoqItemEntity | null;

/*
 * MaterialPriceListId
 */
  MaterialPriceListId?: number | null;

/*
 * PrcPriceConditionId
 */
  PrcPriceConditionId?: number | null;

/*
 * SaveBoqAndPriceConditions
 */
  SaveBoqAndPriceConditions?: boolean | null;
}
