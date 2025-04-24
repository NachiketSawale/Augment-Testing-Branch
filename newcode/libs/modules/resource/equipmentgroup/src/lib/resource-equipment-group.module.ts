/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UiCommonModule } from '@libs/ui/common';
import { ResourceEquipmentGroupModuleInfo } from './model/resource-equipment-group-module-info.class';
import { EQUIPMENT_GROUP_DATA_TOKEN, EquipmentGroupDataService } from './services/equipment-group-data.service';
import { PLANT_GROUP_WO_TYPE_DATA_TOKEN, PlantGroupWoTypeDataService } from './services/plant-group-wo-type-data.service';
import { EQUIPMENT_GROUP_EUROLIST_DATA_TOKEN, EquipmentGroupEurolistDataService } from './services/equipment-group-eurolist-data.service';
import { EQUIPMENT_GROUP_PRICELIST_DATA_TOKEN, EquipmentGroupPricelistDataService } from './services/equipment-group-pricelist-data.service';
import { PLANT_GROUP_ACCOUNT_DATA_TOKEN, PlantGroupAccountDataService } from './services/plant-group-account-data.service';
import { PLANT_GROUP_2_CONTROLLING_UNIT_DATA_TOKEN, PlantGroup2ControllingUnitDataService } from './services/plant-group-2-controlling-unit-data.service';
import { PLANT_GROUP_2_COST_CODE_DATA_TOKEN, PlantGroup2CostCodeDataService } from './services/plant-group-2-cost-code-data.service';
import { PLANT_GROUP_TAX_CODE_DATA_TOKEN, PlantGroupTaxCodeDataService } from './services/plant-group-tax-code-data.service';
import { PLANT_GROUP_SPECIFIC_VALUE_DATA_TOKEN, PlantGroupSpecificValueDataService } from './services/plant-group-specific-value-data.service';
import { BusinessModuleRoute } from '@libs/ui/business-base';

const routes: Routes = [new BusinessModuleRoute(new ResourceEquipmentGroupModuleInfo())];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{ provide: EQUIPMENT_GROUP_DATA_TOKEN, useExisting: EquipmentGroupDataService },
		{ provide: PLANT_GROUP_WO_TYPE_DATA_TOKEN, useExisting: PlantGroupWoTypeDataService },
		{ provide: EQUIPMENT_GROUP_EUROLIST_DATA_TOKEN, useExisting: EquipmentGroupEurolistDataService },
		{ provide: EQUIPMENT_GROUP_PRICELIST_DATA_TOKEN, useExisting: EquipmentGroupPricelistDataService },
		{ provide: PLANT_GROUP_ACCOUNT_DATA_TOKEN, useExisting: PlantGroupAccountDataService },
		{ provide: PLANT_GROUP_2_CONTROLLING_UNIT_DATA_TOKEN, useExisting: PlantGroup2ControllingUnitDataService },
		{ provide: PLANT_GROUP_2_COST_CODE_DATA_TOKEN, useExisting: PlantGroup2CostCodeDataService },
		{ provide: PLANT_GROUP_TAX_CODE_DATA_TOKEN, useExisting: PlantGroupTaxCodeDataService },
		{ provide: PLANT_GROUP_SPECIFIC_VALUE_DATA_TOKEN, useExisting: PlantGroupSpecificValueDataService },
	]
})
export class ResourceEquipmentGroupModule {}