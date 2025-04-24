/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ESTIMATE_ASSEMBLIES_ENTITY_INFO } from '../containers/assemblies/estimate-assemblies-entity-info.class';
import { ESTIMATE_ASSEMBLIES_RESOURCE_ENTITY_INFO } from '../containers/resource/estimate-assemblies-resource-entity-info.class';
import { ESTIMATE_ASSEMBLIES_REFERENCES_ENTITY_INFO } from '../containers/assemblies-references/estimate-assemblies-references-entity-info.class';
import { ESTIMATE_ASSEMBLIES_ASSEMBLY_CATEGORY_ENTITY_INFO } from '../containers/assembly-category/estimate-assemblies-assembly-category-entity-info.model';
import { ESTIMATE_ASSEMBLIES_RULE_ENTITY_INFO } from '../containers/rule/estimate-assemblies-rule-entity-info.model';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { EstimateAssembliesResourceDataService } from '../containers/resource/estimate-assemblies-resource-data.service';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EstimateAssembliesService } from '../containers/assemblies/estimate-assemblies-data.service';
import { ESTIMATE_ASSEMBLIES_CTRL_GROUP_ENTITY_INFO } from './estimate-assemblies-ctrl-group-entity-info.model';
import { ESTIMATE_ASSEMBLIES_TOTAL_ENTITY_INFO } from '../containers/total/estimate-assemblies-total-entity-info.class';

/**
 * The module info object for the `estimate.assemblies` content module.
 */
export class EstimateAssembliesModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: EstimateAssembliesModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): EstimateAssembliesModuleInfo {
		if (!this._instance) {
			this._instance = new EstimateAssembliesModuleInfo();
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
		return 'estimate.assemblies';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			ESTIMATE_ASSEMBLIES_ENTITY_INFO,
			ESTIMATE_ASSEMBLIES_ASSEMBLY_CATEGORY_ENTITY_INFO,
			ESTIMATE_ASSEMBLIES_RESOURCE_ENTITY_INFO,
			ESTIMATE_ASSEMBLIES_REFERENCES_ENTITY_INFO,
			ESTIMATE_ASSEMBLIES_RULE_ENTITY_INFO,
			this.ESTIMATE_ASSEMBLIES_RESOURCE_CHAR_DATA_ENTITY_INFO,
			this.ESTIMATE_ASSEMBLIES_CHAR2_DATA_ENTITY_INFO,
			this.ESTIMATE_ASSEMBLIES_CHAR_DATA_ENTITY_INFO,
			ESTIMATE_ASSEMBLIES_CTRL_GROUP_ENTITY_INFO,
			ESTIMATE_ASSEMBLIES_TOTAL_ENTITY_INFO,
		];
	}

	/**
	 * EntityInfo for Estimate Assemblies Resource Characteristics Data Entity.
	 */
	private readonly ESTIMATE_ASSEMBLIES_RESOURCE_CHAR_DATA_ENTITY_INFO: EntityInfo = BasicsSharedCharacteristicDataEntityInfoFactory.create<IEstResourceEntity>({
		permissionUuid: '72ee39b4c7b74ceaa533a0f340780d70',
		sectionId: BasicsCharacteristicSection.AssemblyResources,
		gridTitle: 'estimate.assemblies.resourceCharacteristics',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(EstimateAssembliesResourceDataService);
		},
	});

	/**
	 * EntityInfo for Estimate Assemblies Characteristics2 Data Entity
	 */
	private readonly ESTIMATE_ASSEMBLIES_CHAR2_DATA_ENTITY_INFO: EntityInfo = BasicsSharedCharacteristicDataEntityInfoFactory.create<IEstLineItemEntity>({
		permissionUuid: 'b7c8b98ac24c4565b296492ca9407ad6',
		sectionId: BasicsCharacteristicSection.Assembly2,
		gridTitle: 'cloud.common.ContainerCharacteristicDefaultTitle2',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(EstimateAssembliesService);
		},
	});

	/**
	 * EntityInfo for Estimate Assemblies Characteristics Data Entity
	 */
	private readonly ESTIMATE_ASSEMBLIES_CHAR_DATA_ENTITY_INFO: EntityInfo = BasicsSharedCharacteristicDataEntityInfoFactory.create<IEstLineItemEntity>({
		permissionUuid: '3ad1fb03bfb14342bac0401d73019dab',
		sectionId: BasicsCharacteristicSection.Assembly1,
		gridTitle: 'cloud.common.ContainerCharacteristicDefaultTitle',
		parentServiceFn: (ctx) => {
			return ctx.injector.get(EstimateAssembliesService);
		},
	});

	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat(['estimate.main']);
	}

	/**
	 * Returns the translation container uuid for assemblies module.
	 */
	protected override get translationContainer(): string | undefined {
		return '45249f7155b24adfb8eb809f54131172';
	}
}
