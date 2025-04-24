/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IRiskRegisterEntity } from './risk-register-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';

export interface IEstRiskevent2lineitemEntityGenerated extends IEntityBase {

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemEntity
 */
  EstLineItemEntity?: IEstLineItemEntity | null;

/*
 * EstLineItemFk
 */
  EstLineItemFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * RiskEventFk
 */
  RiskEventFk?: number | null;

/*
 * RiskRegisterEntity
 */
  RiskRegisterEntity?: IRiskRegisterEntity | null;
}
