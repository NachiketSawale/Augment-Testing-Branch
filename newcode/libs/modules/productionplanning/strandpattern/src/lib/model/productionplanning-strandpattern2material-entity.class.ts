/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityIdentification } from '@libs/platform/common';

export class ProductionplanningStrandpattern2materialEntity implements IEntityIdentification {
	public Id!: number;
	public PpsStrandPatternFk!: number;
	public PpsMaterialFk!: number;
	public Sorting!:number;
}
