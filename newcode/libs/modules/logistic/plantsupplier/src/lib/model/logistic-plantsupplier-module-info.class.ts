/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { LOGISTIC_PLANTSUPPLIER_PLANT_SUPPLIER_ENTITY_INFO } from './logistic-plantsupplier-plant-supplier-entity-info.model';
import { LOGISTIC_PLANTSUPPLIER_PLANT_SUPPLY_ITEM_ENTITY_INFO } from './logistic-plantsupplier-plant-supply-item-entity-info.model';
import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';

export class LogisticPlantsupplierModuleInfo extends BusinessModuleInfoBase {
	public static readonly instance: LogisticPlantsupplierModuleInfo = new LogisticPlantsupplierModuleInfo();
	public override get internalModuleName(): string {
		return 'logistic.plantsupplier';
	}
	public override get internalPascalCasedModuleName(): string {
		return 'Logistic.Plantsupplier';
	}
	private readonly translationPrefix: string = 'logistic.plantsupplier';
	public override get entities(): EntityInfo[] {
		return [
			LOGISTIC_PLANTSUPPLIER_PLANT_SUPPLIER_ENTITY_INFO,
			LOGISTIC_PLANTSUPPLIER_PLANT_SUPPLY_ITEM_ENTITY_INFO,
		];
	}
	public override get preloadedTranslations(): string[] {
		return [this.internalModuleName, 'cloud.common'];
	}
	protected override get translationContainer(): string | undefined {
		return '';
	}
}