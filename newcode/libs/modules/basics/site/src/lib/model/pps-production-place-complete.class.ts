/*
 * Copyright(c) RIB Software GmbH
 */

import { PpsProdPlaceChildrenEntity } from './pps-prod-place-children-entity.class';
import { PpsProductionPlaceEntity } from './pps-production-place-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class PpsProductionPlaceComplete implements CompleteIdentification<PpsProductionPlaceEntity> {
	public Id: number = 0;

	public ProductionPlace: PpsProductionPlaceEntity[] | null = [];

	public ProductionPlaceChildrenToSave: PpsProdPlaceChildrenEntity[] | null =[];
	public ProductionPlaceChildrenToDelete:  PpsProdPlaceChildrenEntity[] | null = [];

}
