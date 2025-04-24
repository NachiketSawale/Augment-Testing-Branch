/*
 * Copyright(c) RIB Software GmbH
 */

import { ProductionplanningStrandpatternEntity } from './productionplanning-strandpattern-entity.class';
import { CompleteIdentification } from '@libs/platform/common';
import { ProductionplanningStrandpattern2materialEntity } from './productionplanning-strandpattern2material-entity.class';

export class ProductionplanningStrandpatternComplete implements CompleteIdentification<ProductionplanningStrandpatternEntity> {
	public MainItemId: number = 0;

	public StrandPattern: ProductionplanningStrandpatternEntity[] | null = [];
	
	public StrandPattern2MaterialToSave : ProductionplanningStrandpattern2materialEntity[] | null = [];
	public StrandPattern2MaterialToDelete: ProductionplanningStrandpattern2materialEntity[] | null = [];
}
