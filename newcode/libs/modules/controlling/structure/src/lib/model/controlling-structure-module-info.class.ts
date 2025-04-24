/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo } from '@libs/ui/business-base';
import { PROJECT_MAIN_FOR_COSTRUCTURE_ENTITY_INFO } from './project-main-for-costructure-entity-info.model';
import { CONTROLLING_STRUCTURE_GRID_ENTITY_INFO } from './controlling-structure-grid-entity-info.model';
import { CONTROLLING_STRUCTURE_UNITGROUP_ENTITY_INFO } from './controlling-structure-unitgroup-entity-info.model';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';
import { CONTROLLING_STRUCTURE_CHARACTERISTIC_ENTITY_INFO } from './controlling-structure-characteristic-entity-info.model';
import { CONTROLLING_STRUCTURE_CONTRACT_TOTAL_ENTITY_INFO } from './controlling-structure-contract-total-entity-info.model';
import { CONTROLLING_VERSIONS_ENTITY_INFO } from './controlling-versions-entity-info.model';
import { CONTROLLING_STRUCTURE_LINE_ITEM_ENTITY_INFO } from './controlling-structure-line-item-entity-info.model';
import { CONTROLLING_STRUCTURE_PES_TOTAL_ENTITY_INFO } from './controlling-structure-pes-total-entity-info.model';
import { CONTROLLING_STRUCTURE_ACTUAL_ENTITY_INFO } from './controlling-structure-actual-entity-info.model';

/**
 * The module info object for the `controlling.structure` content module.
 */
export class ControllingStructureModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ControllingStructureModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ControllingStructureModuleInfo {
		if (!this._instance) {
			this._instance = new ControllingStructureModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'controlling.structure';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [PROJECT_MAIN_FOR_COSTRUCTURE_ENTITY_INFO, CONTROLLING_STRUCTURE_GRID_ENTITY_INFO, CONTROLLING_STRUCTURE_UNITGROUP_ENTITY_INFO, CONTROLLING_STRUCTURE_CHARACTERISTIC_ENTITY_INFO, CONTROLLING_VERSIONS_ENTITY_INFO, CONTROLLING_STRUCTURE_LINE_ITEM_ENTITY_INFO,CONTROLLING_STRUCTURE_PES_TOTAL_ENTITY_INFO,CONTROLLING_STRUCTURE_ACTUAL_ENTITY_INFO,CONTROLLING_STRUCTURE_CONTRACT_TOTAL_ENTITY_INFO];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const languageConatinerConfiguration: IContainerDefinition = {
			uuid: '9DCD60856AB34626963F5F6DB332FB90',
			title: { key: 'ui.business-base.translationContainerTitle' },
			permission: '9dcd60856ab34626963f5f6db332fb90',
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageConatinerConfiguration)];
	}
	public override get preloadedTranslations() {
		return [
			...super.preloadedTranslations,
			'controlling.common',
			'controlling.projectcontrols',
			'cloud.common',
			'controlling.common.transferdatatobisExecutionReport'
		];
	}
}
