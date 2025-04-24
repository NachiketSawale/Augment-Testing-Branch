/*
 * Copyright(c) RIB Software GmbH
 */

import { SALES_BID_GENERALS_ENTITY_INFO } from './entity-info/sales-bid-generals-entity-info.model';
import { BusinessModuleInfoBase, EntityInfo, ITranslationContainerInfo } from '@libs/ui/business-base';
import { SALES_BID_BIDS_ENTITY_INFO } from './entity-info/sales-bid-bids-entity-info.model';
import { SALES_BID_WARRANTY_ENTITY_INFO } from './entity-info/sales-bid-warranty-entity-info.model';
import { SALES_BID_ACTUAL_CERTIFICATE_ENTITY_INFO } from './entity-info/sales-bid-actual-certificate-entity-info.model';
import { SALES_BID_CERTIFICATE_ENTITY_INFO } from './entity-info/sales-bid-certificate-entity-info.model';
import { SALES_BID_CLERK_ENTITY_INFO } from './entity-info/sales-bid-clerk-entity-info.model';
import { SALES_BID_BOQ_ENTITY_INFO } from './entity-info/sales-bid-boq-entity-info.model';
import { SALES_BID_MILESTONES_ENTITY_INFO } from './entity-info/sales-bid-milestone-entity-info.model';
import { SALES_BID_FORM_DATA_ENTITY_INFO } from './entity-info/sales-bid-form-data-entity-info.model';
import { SALES_BID_CHARACTERISTIC2_ENTITY_INFO } from './entity-info/sales-bid-characteristics2-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { SALES_BID_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/sales-bid-pin-board-container-info.model';
import { SALES_BID_CHARACTERISTIC_ENTITY_INFO } from './entity-info/sales-bid-characteristic-entity-info.model';
import { IBidHeaderEntity } from '@libs/sales/interfaces';
import { SalesBidDocumentProjectDataService } from '../services/sales-bid-document-project-data.service';
import {DocumentMainProviderEntityInfoService} from '@libs/documents/main';
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
		return [
			SALES_BID_BIDS_ENTITY_INFO,
			SALES_BID_ACTUAL_CERTIFICATE_ENTITY_INFO,
			SALES_BID_CERTIFICATE_ENTITY_INFO,
			SALES_BID_CLERK_ENTITY_INFO,
			SALES_BID_BOQ_ENTITY_INFO,
			SALES_BID_MILESTONES_ENTITY_INFO,
			SALES_BID_GENERALS_ENTITY_INFO,
			SALES_BID_CHARACTERISTIC2_ENTITY_INFO,
			SALES_BID_CHARACTERISTIC_ENTITY_INFO,
			...DocumentMainProviderEntityInfoService.create<IBidHeaderEntity>(this.internalPascalCasedModuleName, SalesBidDocumentProjectDataService),
			SALES_BID_WARRANTY_ENTITY_INFO,
			SALES_BID_FORM_DATA_ENTITY_INFO,
			this.boqItemEntityInfo,
		];
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
	
	protected override get translationContainer(): string | ITranslationContainerInfo | undefined {
        return '96ec1c43569a44c490010d4af9365715';
    }
	

	protected override get containers():  (ContainerDefinition | IContainerDefinition)[]{
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: '178b2b2002d24384a9802cfdb3973816'
			}),
			SALES_BID_PIN_BOARD_CONTAINER_DEFINITION
		]);
	}

	private readonly boqItemEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqItemEntityInfo((ctx) => ctx.injector.get(SalesBidBoqItemDataService), 'ce8cd4ae57f34df0b5e2ea3e60acb28e');
}
