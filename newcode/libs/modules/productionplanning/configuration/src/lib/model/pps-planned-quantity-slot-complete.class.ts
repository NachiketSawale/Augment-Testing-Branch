/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsPlannedQuantitySlotEntity } from './entities/pps-planned-quantity-slot-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class PpsPlannedQuantitySlotComplete implements CompleteIdentification<IPpsPlannedQuantitySlotEntity> {

	/*
	 * PpsPlannedQuantitySlot
	 */
	public PpsPlannedQuantitySlot!: IPpsPlannedQuantitySlotEntity | null;
}
