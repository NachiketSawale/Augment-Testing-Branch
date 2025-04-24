/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';
import { IEstResourceEntity } from './estimate-resource-base-entity.interface';

export interface IEstEscalationAmountEntityGenerated extends IEntityBase {

/*
 * CharacteristicFk
 */
  CharacteristicFk?: number | null;

/*
 * EscAmt
 */
  EscAmt?: number | null;

/*
 * EscAmtTotal
 */
  EscAmtTotal?: number | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemEntity
 */
  EstLineItemEntity?: IEstLineItemEntity | null;

/*
 * EstResourceEntity
 */
  EstResourceEntity?: IEstResourceEntity | null;

/*
 * EstResourceFk
 */
  EstResourceFk?: number | null;

/*
 * Fraction
 */
  Fraction?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * LineitemFk
 */
  LineitemFk?: number | null;

/*
 * SpendPeriod
 */
  SpendPeriod?: string | null;
}
