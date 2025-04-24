/*
 * Copyright(c) RIB Software GmbH
 */

import { IApplicationModuleInfo } from '@libs/platform/common';
import { EstimateSharedModuleInfo } from './lib/model/estimate-shared-module-info.class';

export * from './lib/assemblies/index';
export * from './lib/calculation/index';
export * from './lib/common/index';
export * from './lib/line-item/index';
export * from './lib/lookups/index';
export * from './lib/model/index';
export * from './lib/rule/index';
export * from './lib/urb-config';
export * from './lib/estimate-shared.module';

export * from './lib/modiy-resource';

export * from './lib/cost-group/estimate-share-cost-group-complete.class';
export * from './lib/cost-group/estimate-share-cost-group-behavior.service';
export * from './lib/cost-group/estimate-share-cost-group-layout.service';
export * from './lib/cost-group/estimate-share-cost-group-entity-info-factory.service';
export * from './lib/cost-group/estimate-share-cost-group-catalog-data.service';
export * from './lib/cost-group/estimate-share-cost-group-data.service';
export * from './lib/lookups/plant-assembly-template/estimate-main-plant-assembly-template-lookup.service';
export * from './lib/unit-test-data/estimate-test-data-builder.service';
export * from './lib/calculation/services/budget-calculation.service';
export * from './lib/common/model/est-structure-detai-basel-entity.interface';
export * from './lib/line-item/services/estimate-resource-base-date.service';
export * from './lib/components/detail-column/detail-column-cell/estimate-main-detail-column.component';
export * from './lib/model/estimate-main-rule-and-param-entity.interface';
export * from './lib/calculation/services/estimate-main-complete-calculation.service';
export * from './lib/calculation/services/resource-quantity-calculation.service';
export * from './lib/common/services/estimate-main-exchange-rate.service';
export * from './lib/common/services/assembly-type-data.service';
export * from './lib/common/services/multi-currency-common.service';
export function getModuleInfo(): IApplicationModuleInfo {
	return EstimateSharedModuleInfo.instance;
}
