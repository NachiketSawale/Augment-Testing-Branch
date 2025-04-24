/*
 * Copyright(c) RIB Software GmbH
 */

import { ProductionplanningStrandpattern2materialEntity } from './productionplanning-strandpattern2material-entity.class';
import { CompleteIdentification } from '@libs/platform/common';

export class ProductionplanningStrandpattern2materialComplete implements CompleteIdentification<ProductionplanningStrandpattern2materialEntity> {
	public Id: number = 0;

	public Datas: ProductionplanningStrandpattern2materialEntity[] | null = [];
}
