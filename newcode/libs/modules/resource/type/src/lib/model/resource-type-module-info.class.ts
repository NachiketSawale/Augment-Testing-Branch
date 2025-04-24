/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';
import { RESOURCE_TYPE_ENTITY_INFO } from './resource-type-entity-info.model';
import { RESOURCE_TYPE_REQUIRED_SKILL_ENTITY_INFO } from './resource-type-required-skill-entity-info.model';
import { RESOURCE_TYPE_REQUESTED_TYPE_ENTITY_INFO } from './resource-type-requested-type-entity-info.model';
import { RESOURCE_TYPE_REQUESTED_SKILL_V_ENTITY_INFO } from './resource-type-requested-skill-v-entity-info.model';
import { RESOURCE_TYPE_PLANNING_BOARD_FILTER_ENTITY_INFO } from './resource-type-planning-board-filter-entity-info.model';
import { RESOURCE_TYPE_ALTERNATIVE_RES_TYPE_ENTITY_INFO } from './resource-type-alternative-res-type-entity-info.model';

export class ResourceTypeModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new ResourceTypeModuleInfo();

	private constructor(){
		super();
	}

	public override get internalModuleName(): string {
		return 'resource.type';
	}


	protected override get containers(): (ContainerDefinition | IContainerDefinition)[]{
		const languageContainerConfiguration : IContainerDefinition = {
			uuid : 'f60e4938e3d541eb95afe442a8cc6fa4',
			title: { key: 'ui.business-base.translationContainerTitle' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageContainerConfiguration)];
	}
	public override get entities(): EntityInfo[] {
		return [
			RESOURCE_TYPE_ENTITY_INFO,
			RESOURCE_TYPE_REQUIRED_SKILL_ENTITY_INFO,
			RESOURCE_TYPE_REQUESTED_TYPE_ENTITY_INFO,
			RESOURCE_TYPE_REQUESTED_SKILL_V_ENTITY_INFO,
			RESOURCE_TYPE_PLANNING_BOARD_FILTER_ENTITY_INFO,
			RESOURCE_TYPE_ALTERNATIVE_RES_TYPE_ENTITY_INFO
		];
	}

	/**
	 * Loads the translation file used for workflow main
	 */
	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations, 'cloud.common', 'basics.customize', 'resource.equipmentgroup', 'resource.skill'
		];
	}
}
