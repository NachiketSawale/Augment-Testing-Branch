/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsPhaseDateSlotEntity } from './entities/pps-phase-date-slot-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class PpsPhaseDateSlotComplete implements CompleteIdentification<IPpsPhaseDateSlotEntity> {

	/*
	 * PpsPhaseDateSlot
	 */
	public PpsPhaseDateSlot!: IPpsPhaseDateSlotEntity | null;
}
