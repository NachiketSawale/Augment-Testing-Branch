/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceEquipmentGroupMainModuleInfo } from './resource-equipment-group-main-module-info.model';
import { resourceEquipmentGroupMainModuleCharacteristicInfo } from './resource-equipment-group-main-module-characteristic-info.model';
import { resourceEquipmentGroupPlantGroupWoTypeModuleInfo } from './resource-equipment-group-plant-group-wo-type-module-info.model';
import { resourceEquipmentGroupEquipmentGroupEurolistModuleInfo } from './resource-equipment-group-equipment-group-eurolist-module-info.model';
import { resourceEquipmentGroupEquipmentGroupPricelistModuleInfo } from './resource-equipment-group-equipment-group-pricelist-module-info.model';
import { resourceEquipmentGroupPlantGroupAccountModuleInfo } from './resource-equipment-group-plant-group-account-module-info.model';
import { resourceEquipmentGroupPlantGroup2ControllingUnitModuleInfo } from './resource-equipment-group-plant-group-2-controlling-unit-module-info.model';
import { resourceEquipmentGroupPlantGroup2CostCodeModuleInfo } from './resource-equipment-group-plant-group-2-cost-code-module-info.model';
import { resourceEquipmentGroupPlantGroupTaxCodeModuleInfo } from './resource-equipment-group-plant-group-tax-code-module-info.model';
import { resourceEquipmentGroupPlantGroupSpecificValueModuleInfo } from './resource-equipment-group-plant-group-specific-value-module-info.model';
import { EntityInfo, DataTranslationGridComponent, BusinessModuleInfoBase } from '@libs/ui/business-base';
import { ContainerDefinition, ContainerTypeRef, IContainerDefinition } from '@libs/ui/container-system';

export class ResourceEquipmentGroupModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance: ResourceEquipmentGroupModuleInfo = new ResourceEquipmentGroupModuleInfo();
	public override get internalModuleName(): string {
		return 'resource.equipmentgroup';
	}
	public override get internalPascalCasedModuleName(): string {
		return 'Resource.EquipmentGroup';
	}
	private readonly translationPrefix: string = 'resource.equipmentgroup';
	public override get entities(): EntityInfo[] {
		return [
			resourceEquipmentGroupMainModuleInfo,
			resourceEquipmentGroupPlantGroupWoTypeModuleInfo,
			resourceEquipmentGroupEquipmentGroupEurolistModuleInfo,
			resourceEquipmentGroupEquipmentGroupPricelistModuleInfo,
			resourceEquipmentGroupPlantGroupAccountModuleInfo,
			resourceEquipmentGroupPlantGroup2ControllingUnitModuleInfo,
			resourceEquipmentGroupPlantGroup2CostCodeModuleInfo,
			resourceEquipmentGroupPlantGroupTaxCodeModuleInfo,
			resourceEquipmentGroupPlantGroupSpecificValueModuleInfo,
			resourceEquipmentGroupMainModuleCharacteristicInfo,
		];
	}
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}
	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		const languageContainerConfiguration : IContainerDefinition = {
			uuid: 'b8903428bfb644f080588682f1d42e32',
			title: {
				key: 'ui.business-base.translationContainerTitle'
			},
			containerType: DataTranslationGridComponent as ContainerTypeRef
		};
		return [...super.containers, new ContainerDefinition(languageContainerConfiguration)];
	}
}