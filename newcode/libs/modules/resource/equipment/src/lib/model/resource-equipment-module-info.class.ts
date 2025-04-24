/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { RESOURCE_EQUIPMENT_BULK_PLANT_OWNER_ENTITY_INFO } from './resource-equipment-bulk-plant-owner-entity-info.model';
import { RESOURCE_EQUIPMENT_BUSINESS_PARTNER_ENTITY_INFO } from './resource-equipment-business-partner-entity-info.model';
import { RESOURCE_EQUIPMENT_CERTIFICATED_PLANT_ENTITY_INFO } from './resource-equipment-certificated-plant-entity-info.model';
import { RESOURCE_EQUIPMENT_MAINTENANCE_ENTITY_INFO } from './resource-equipment-maintenance-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_2_CLERK_ENTITY_INFO } from './resource-equipment-plant-2-clerk-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_2_CONTROLLING_UNIT_ENTITY_INFO } from './resource-equipment-plant-2-controlling-unit-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_2_ESTIMATE_PRICE_LIST_ENTITY_INFO } from './resource-equipment-plant-2-estimate-price-list-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_2_ESTIMATE_PRICE_LIST_LINE_ITEM_ENTITY_INFO } from './resource-equipment-plant-2-estimate-price-list-line-item-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_ACCESSORY_ENTITY_INFO } from './resource-equipment-plant-accessory-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_ALLOC_V_ENTITY_INFO } from './resource-equipment-plant-alloc-v-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_ASSIGNMENT_ENTITY_INFO } from './resource-equipment-plant-assignment-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_COMMENT_ENTITY_INFO } from './resource-equipment-plant-comment-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_COMPATIBLE_MATERIAL_ENTITY_INFO } from './resource-equipment-plant-compatible-material-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_COMPATIBLE_MATERIAL_EXTENDED_ENTITY_INFO } from './resource-equipment-plant-compatible-material-extended-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_COMPONENT_ENTITY_INFO } from './resource-equipment-plant-component-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_COMPONENT_MAINT_SCHEMA_ENTITY_INFO } from './resource-equipment-plant-component-maint-schema-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_COST_V_ENTITY_INFO } from './resource-equipment-plant-cost-v-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_DOCUMENT_ENTITY_INFO } from './resource-equipment-plant-document-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_ENTITY_INFO } from './resource-equipment-plant-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_EUROLIST_ENTITY_INFO } from './resource-equipment-plant-eurolist-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_FIXED_ASSET_ENTITY_INFO } from './resource-equipment-plant-fixed-asset-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_MAINTENANCE_V_ENTITY_INFO } from './resource-equipment-plant-maintenance-v-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_METER_READING_ENTITY_INFO } from './resource-equipment-plant-meter-reading-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_METERING_EVALUATION_ENTITY_INFO } from './resource-equipment-plant-metering-evaluation-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_PICTURE_ENTITY_INFO } from './resource-equipment-plant-picture-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_PRICELIST_ENTITY_INFO } from './resource-equipment-plant-pricelist-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_PROCUREMENT_CONTRACT_V_ENTITY_INFO } from './resource-equipment-plant-procurement-contract-v-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_SPECIFIC_VALUE_ENTITY_INFO } from './resource-equipment-plant-specific-value-entity-info.model';
import { RESOURCE_EQUIPMENT_PLANT_WARRANTY_ENTITY_INFO } from './resource-equipment-plant-warranty-entity-info.model';
import { OptionallyAsyncResource } from '@libs/platform/common';
import { BusinessModuleInfoBase, EntityInfo, IBusinessModuleAddOn } from '@libs/ui/business-base';
import { ContainerDefinition } from '@libs/ui/container-system';
import { CatalogRecordsComponent } from '../components/catalog-records/catalog-records.component';
import { RESOURCE_CATALOG_MODULE_ADD_ON_TOKEN } from '@libs/resource/interfaces';

export class ResourceEquipmentModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance: ResourceEquipmentModuleInfo = new ResourceEquipmentModuleInfo();
	public override get internalModuleName(): string {
		return 'resource.equipment';
	}
	public override get internalPascalCasedModuleName(): string {
		return 'Resource.Equipment';
	}
	private readonly translationPrefix: string = 'resource.equipment';
	public override get entities(): EntityInfo[] {
		return [
			RESOURCE_EQUIPMENT_PLANT_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_DOCUMENT_ENTITY_INFO,
			RESOURCE_EQUIPMENT_BUSINESS_PARTNER_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_FIXED_ASSET_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_ACCESSORY_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_PICTURE_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_COMMENT_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_ASSIGNMENT_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_COMPONENT_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_EUROLIST_ENTITY_INFO,
			RESOURCE_EQUIPMENT_MAINTENANCE_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_PRICELIST_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_ALLOC_V_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_2_CONTROLLING_UNIT_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_METER_READING_ENTITY_INFO,
			RESOURCE_EQUIPMENT_CERTIFICATED_PLANT_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_COST_V_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_COMPONENT_MAINT_SCHEMA_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_MAINTENANCE_V_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_2_CLERK_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_2_ESTIMATE_PRICE_LIST_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_2_ESTIMATE_PRICE_LIST_LINE_ITEM_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_WARRANTY_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_METERING_EVALUATION_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_COMPATIBLE_MATERIAL_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_COMPATIBLE_MATERIAL_EXTENDED_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_PROCUREMENT_CONTRACT_V_ENTITY_INFO,
			RESOURCE_EQUIPMENT_PLANT_SPECIFIC_VALUE_ENTITY_INFO,
			RESOURCE_EQUIPMENT_BULK_PLANT_OWNER_ENTITY_INFO,
		];
	}
	/**
	 * Returns the definitions of all containers that are available in the module.
	 */
	public override get containers(): ContainerDefinition[] {
		const containerDefinitions: ContainerDefinition[] = [
			new ContainerDefinition({
				containerType: CatalogRecordsComponent,
				uuid: '00d61b7a655d47448292f819b321d6a1',
				title: { text: 'Catalog Records 1', key: 'resource.equipment.record1ListTitle' },
				permission: 'bae34453f83744d3a6f7e53b7851e657'
			}),
		];

		for (const ei of this.entities) {
			containerDefinitions.push(...ei.containers);
		}
		return containerDefinitions;
	}

	protected override get includedAddOns(): OptionallyAsyncResource<IBusinessModuleAddOn>[] {
		return [
			...super.includedAddOns,
			RESOURCE_CATALOG_MODULE_ADD_ON_TOKEN
		];
	}
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common', 'basics.customize', 'resource.catalog'];
	}
	protected override get translationContainer(): string | undefined {
		return '';
	}
}