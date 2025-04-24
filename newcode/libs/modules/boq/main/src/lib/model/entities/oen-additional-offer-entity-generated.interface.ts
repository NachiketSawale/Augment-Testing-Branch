/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenContractAdjustmentEntity } from './oen-contract-adjustment-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IOenAdditionalOfferEntityGenerated extends IEntityBase {

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * Nr
 */
  Nr: number;

/*
 * OenContractAdjustments
 */
  OenContractAdjustments?: IOenContractAdjustmentEntity[] | null;

/*
 * OenLvHeaderFk
 */
  OenLvHeaderFk: number;

/*
 * ProcessingStatusDate
 */
  ProcessingStatusDate?: string | null;
}
