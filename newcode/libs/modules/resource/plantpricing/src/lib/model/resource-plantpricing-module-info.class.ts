/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo } from '@libs/ui/business-base';
import { RESOURCE_PLANTPRICING_PRICELIST_TYPE_ENTITY_INFO } from './resource-plantpricing-pricelist-type-entity-info.model';
import { RESOURCE_PLANTPRICING_PRICELIST_ENTITY_INFO } from './resource-plantpricing-pricelist-entity-info.model';
import { RESOURCE_PLANTPRICING_EST_PRICELIST_ENTITY_INFO } from './resource-plantpricing-est-pricelist-entity-info.model';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from "@libs/ui/container-system";

/**
 * The module info object for the `resource.plantpricing` content module.
 */
export class ResourcePlantpricingModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ResourcePlantpricingModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ResourcePlantpricingModuleInfo {
		if (!this._instance) {
			this._instance = new ResourcePlantpricingModuleInfo();
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
		return 'resource.plantpricing';
	}


	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const languageConatinerConfiguration : IContainerDefinition = {
			uuid : 'c354126f74754bbaade2b918d09b1f01',
			title: { key: 'ui.business-base.translationContainerTitle' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageConatinerConfiguration)];
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ RESOURCE_PLANTPRICING_PRICELIST_TYPE_ENTITY_INFO, RESOURCE_PLANTPRICING_PRICELIST_ENTITY_INFO, RESOURCE_PLANTPRICING_EST_PRICELIST_ENTITY_INFO, ];
	}



}
