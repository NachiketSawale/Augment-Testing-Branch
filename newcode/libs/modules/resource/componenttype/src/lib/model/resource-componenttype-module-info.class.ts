/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';

import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';

import { RESOURCE_COMPONENT_TYPE_ENTITY_INFO } from './resource-component-type-entity-info.model';
import { ResourceComponentTypeDataService } from '../services/resource-component-type-data.service';


/**
 * The module info object for the `resource.componenttype` content module.
 */
export class ResourceComponenttypeModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ResourceComponenttypeModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ResourceComponenttypeModuleInfo {
		if (!this._instance) {
			this._instance = new ResourceComponenttypeModuleInfo();
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
		return 'resource.componenttype';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Resource.Componenttype';
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const languageConfiguration : IContainerDefinition = {
			uuid : '09477b3b7d7a4cb1a2980770f0aa0294',
			title: { key: 'ui.business-base.translationContainerTitle' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageConfiguration)];
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ RESOURCE_COMPONENT_TYPE_ENTITY_INFO, this.basicsCharacteristicDataEntityInfo];
	}

	private readonly basicsCharacteristicDataEntityInfo: EntityInfo = BasicsSharedCharacteristicDataEntityInfoFactory.create({
		permissionUuid: '3d67ffbc921346179407980c0ccb7a91',
		sectionId:BasicsCharacteristicSection.PlantComponentType,
		parentServiceFn: (ctx) => {
			return ctx.injector.get(ResourceComponentTypeDataService);
		},
	});
}
