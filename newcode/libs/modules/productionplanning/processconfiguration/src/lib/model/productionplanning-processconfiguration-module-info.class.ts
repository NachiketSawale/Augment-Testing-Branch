/*
 * Copyright(c) RIB Software GmbH
 */
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { Translatable } from '@libs/platform/common';

import { PPS_PROCESS_TEMPLATE_ENTITY_INFO } from './entity-infos/pps-process-template-entity-info.model';
import { PPS_PHASE_TEMPLATE_ENTITY_INFO } from './entity-infos/pps-phase-template-entity-info.model';
import { PPS_PHASE_REQUIREMENT_TEMPLATE_ENTITY_INFO } from './entity-infos/pps-phase-requirement-template-entity-info.model';

export class ProductionplanningProcessconfigurationModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance = new ProductionplanningProcessconfigurationModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'productionplanning.processconfiguration';
	}

	public override get internalPascalCasedModuleName(): string {
		//return kebabCaseModuleNameToPascalCase(this.internalModuleName);
		return 'Productionplanning.ProcessConfiguration';
		// remark: the result of kebabCaseModuleNameToPascalCase(this.internalModuleName) is "Productionplanning.Processconfiguration",
		// but the corresponding name of server side is "Productionplanning.ProcessConfiguration", so we have to override method internalPascalCasedModuleName
	}

	public override get entities(): EntityInfo[] {
		return [PPS_PROCESS_TEMPLATE_ENTITY_INFO, PPS_PHASE_TEMPLATE_ENTITY_INFO, PPS_PHASE_REQUIREMENT_TEMPLATE_ENTITY_INFO];
	}

	public override get moduleName(): Translatable {
		return {
			key: 'cloud.desktop.moduleDisplayNamePpsProcessConfig'
		};
	}

	/**
	 * Loads the translation file used for PPS Process Configuration
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'basics.common',
			'cloud.common',
			'productionplanning.common',
			// 'productionplanning.formwork',
		]);
	}
}
