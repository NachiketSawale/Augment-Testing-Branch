/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { ProductionplanningConfigurationModuleInfo } from './model/productionplanning-configuration-module-info.class';
import { ConfigurationEventTypeDataService } from './services/configuration-event-type-data.service';
import { ConfigurationEventTypeBehavior } from './behaviors/configuration-event-type-behavior.service';
import { ConfigurationEventtype2restypeDataService } from './services/configuration-eventtype2restype-data.service';
import { ConfigurationEventtype2restypeBehavior } from './behaviors/configuration-eventtype2restype-behavior.service';
import { ConfigurationEngtype2eventtypeDataService } from './services/configuration-engtype2eventtype-data.service';
import { ConfigurationEngtype2eventtypeBehavior } from './behaviors/configuration-engtype2eventtype-behavior.service';
import { ConfigurationEngtypeDataService } from './services/configuration-engtype-data.service';
import { ConfigurationEngtypeBehavior } from './behaviors/configuration-engtype-behavior.service';
import { ModuleNavBarService } from '@libs/ui/container-system';
import { ConfigurationEventTypeSlotDataService } from './services/configuration-event-type-slot-data.service';
import { ConfigurationEventTypeSlotBehavior } from './behaviors/configuration-event-type-slot-behavior.service';
import { ConfigurationEventTypeQtySlotDataService } from './services/configuration-event-type-qty-slot-data.service';
import { ConfigurationEventTypeQtySlotBehavior } from './behaviors/configuration-event-type-qty-slot-behavior.service';
import { ConfigurationClerkRoleSlotDataService } from './services/configuration-clerk-role-slot-data.service';
import { ConfigurationClerkRoleSlotBehavior } from './behaviors/configuration-clerk-role-slot-behavior.service';
import { ConfigurationPlannedQuantitySlotDataService } from './services/configuration-planned-quantity-slot-data.service';
import { ConfigurationPlannedQuantitySlotBehavior } from './behaviors/configuration-planned-quantity-slot-behavior.service';
import { ConfigurationPhaseDateSlotDataService } from './services/configuration-phase-date-slot-data.service';
import { ConfigurationPhaseDateSlotBehavior } from './behaviors/configuration-phase-date-slot-behavior.service';
import { ConfigurationLogConfigDataService } from './services/configuration-log-config-data.service';
import { ConfigurationLogConfigBehavior } from './behaviors/configuration-log-config-behavior.service';
import { ExternalConfigurationDataService } from './services/external-configuration-data.service';
import { ExternalConfigurationBehavior } from './behaviors/external-configuration-behavior.service';
import { ConfigurationUpstreamItemTemplateDataService } from './services/configuration-upstream-item-template-data.service';
import { ConfigurationUpstreamItemTemplateBehavior } from './behaviors/configuration-upstream-item-template-behavior.service';
import { ProductionplanningSharedModule } from '@libs/productionplanning/shared';

const routes: Routes = [new BusinessModuleRoute(ProductionplanningConfigurationModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, ProductionplanningSharedModule],
	providers: [
		{provide: ConfigurationEventTypeBehavior, deps: [ConfigurationEventTypeDataService]},
		{provide: ConfigurationEventtype2restypeBehavior, deps: [ConfigurationEventtype2restypeDataService]},
		{provide: ConfigurationEngtype2eventtypeBehavior, deps: [ConfigurationEngtype2eventtypeDataService]},
		{provide: ConfigurationEngtypeBehavior, deps: [ConfigurationEngtypeDataService, ModuleNavBarService]},
		{provide: ConfigurationEventTypeSlotBehavior, deps: [ConfigurationEventTypeSlotDataService]},
		{provide: ConfigurationEventTypeQtySlotBehavior, deps: [ConfigurationEventTypeQtySlotDataService]},
		{provide: ConfigurationClerkRoleSlotBehavior, deps: [ConfigurationClerkRoleSlotDataService]},
		{provide: ConfigurationPlannedQuantitySlotBehavior, deps: [ConfigurationPlannedQuantitySlotDataService]},
		{provide: ConfigurationPhaseDateSlotBehavior, deps: [ConfigurationPhaseDateSlotDataService]},
		{provide: ConfigurationLogConfigBehavior, deps: [ConfigurationLogConfigDataService]},
		{provide: ExternalConfigurationBehavior, deps: [ExternalConfigurationDataService]},
		{provide: ConfigurationUpstreamItemTemplateBehavior, deps: [ConfigurationUpstreamItemTemplateDataService]},
	],
})
export class ProductionplanningConfigurationModule {
}
