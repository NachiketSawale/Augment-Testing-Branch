/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { BoqMainModuleInfo } from '@libs/boq/main';
import { SalesBidBoqItemDataService } from '../services/sales-bid-boq-item-data.service';

/**
 * The module info object for the `sales.bid` content module.
 */
export class SalesBidModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: SalesBidModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): SalesBidModuleInfo {
		if (!this._instance) {
			this._instance = new SalesBidModuleInfo();
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
		return 'sales.bid';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Sales.Bid';
	}
	
	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ ];
	}

	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'sales.common',
			'sales.billing',
			'project.main',
			'object.main',
			'estimate.main',
			'basics.customize',
			'documents.project',
			'boq.main',
			'sales.contract',
			'businesspartner.certificate',
		]);
	}
	
	
	

	

	private readonly boqItemEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqItemEntityInfo((ctx) => ctx.injector.get(SalesBidBoqItemDataService), 'ce8cd4ae57f34df0b5e2ea3e60acb28e');
}
