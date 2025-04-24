/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { PPS_FORMULA_ENTITY_INFO } from './pps-formula-entity-info.model';
import { PPS_FORMULA_VERSION_ENTITY_INFO } from './pps-formula-version-entity-info.model';
import { PPS_FORMULA_INSTANCE_ENTITY_INFO } from './pps-formula-instance-entity-info.model';

export class ProductionplanningFormulaconfigurationModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new ProductionplanningFormulaconfigurationModuleInfo();

	private constructor() {
		super();
	}
	
	public override get internalModuleName(): string {
		return 'productionplanning.formulaconfiguration';
	}

	public override get entities(): EntityInfo[] {
		return [ PPS_FORMULA_ENTITY_INFO, PPS_FORMULA_VERSION_ENTITY_INFO, PPS_FORMULA_INSTANCE_ENTITY_INFO ];
	}
}
