/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { PPS_DRAWING_TYPE_ENTITY_INFO } from './pps-drawing-type-entity-info.model';
import {PPS_DRAWING_TYPE_SKILL_ENTITY_INFO} from './pps-drawing-type-skill-entity-info.model';

export class ProductionplanningDrawingtypeModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new ProductionplanningDrawingtypeModuleInfo();

	private constructor() {
		super();
	}
	public override get internalModuleName(): string {
		return 'productionplanning.drawingtype';
	}

	public override get entities(): EntityInfo[] {
		return [ PPS_DRAWING_TYPE_ENTITY_INFO, PPS_DRAWING_TYPE_SKILL_ENTITY_INFO ];
	}
}
