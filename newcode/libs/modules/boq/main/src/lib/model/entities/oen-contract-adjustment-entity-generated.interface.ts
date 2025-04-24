/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IOenAdditionalOfferEntity } from './oen-additional-offer-entity.interface';

export interface IOenContractAdjustmentEntityGenerated extends IEntityBase {

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
 * OenAdditionalOffer
 */
  OenAdditionalOffer?: IOenAdditionalOfferEntity | null;

/*
 * OenAdditionalOfferFk
 */
  OenAdditionalOfferFk?: number | null;

/*
 * OenLvHeaderFk
 */
  OenLvHeaderFk: number;

/*
 * ProcessingStatusDate
 */
  ProcessingStatusDate?: string | null;
}
