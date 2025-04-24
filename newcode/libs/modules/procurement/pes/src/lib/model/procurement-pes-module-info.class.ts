/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PROCUREMENT_PES_ENTITY_INFO } from './entity-info/procurement-pes-header-entity-info.model';
import { PrcModuleInfoBase } from '@libs/procurement/common';
import { PROCUREMENT_PES_EVENTS_ENTITY_INFO } from './entity-info/procurement-pes-events-entity-info.model';
import { PROCUREMENT_PES_CHARACTERISTIC2_ENTITY_INFO } from './entity-info/procurement-pes-characteristic2-entity-info.model';
import { PROCUREMENT_PES_CHARACTERISTIC_ENTITY_INFO } from './entity-info/procurement-pes-characteristic-entity-info.model';
import { PROCUREMENT_PES_FORM_DATA_ENTITY_INFO } from './entity-info/procurement-pes-form-data-entity-info.model';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { IPesHeaderEntity } from './entities';
import { ProcurementPesDocumentProjectDataService } from '../services/procurement-pes-document-project-data.service';
import { PROCUREMENT_PES_ITEM_ENTITY_INFO } from './entity-info/procurement-pes-item-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { PROCUREMENT_PES_EXT_BIDDER_ENTITY_INFO } from './entity-info/procurement-pes-extbidder-entity-info.model';
import { PROCUREMENT_PES_TRANSACTION_ENTITY_INFO } from './entity-info/procurement-pes-transaction-entity-info.model';
import { PROCUREMENT_PES_BILLING_SCHEMA_ENTITY_INFO } from './entity-info/procurement-pes-billing-schema-entity-info.model';
import { PROCUREMENT_PES_DELIVERY_SCHEDULE_ENTITY_INFO } from './entity-info/procurement-pes-delivery-schedule-entity-info.model';
import { PROCUREMENT_PES_POST_CON_HISTORY_ENTITY_INFO } from './entity-info/procurement-pes-postcon-history-entity-info.model';
import { PROCUREMENT_PES_PRICE_CONDITION_ENTITY_INFO } from './entity-info/procurement-pes-price-condition-entity-info.model';
import { PES_HISTORICAL_PRICE_FOR_BOQ_ENTITY_INFO } from './entity-info/procurement-pes-historical-price-for-boq-entity-info.model';
import { PES_STATUS_HISTORY_ENTITY_INFO } from './entity-info/procurement-pes-status-history-entity-info.model';
import { PROCUREMENT_PES_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO } from './entity-info/procurement-pes-historical-price-for-item-entity-info.model';
import { PROCUREMENT_PES_SHIPMENT_INFO_ENTITY_INFO } from './entity-info/procurement-pes-shipment-info-entity-info.model';
import { PROCUREMENT_PES_SELFBILLING_DETAIL_ENTITY_INFO } from './entity-info/procurement-pes-selfbilling-detail-entity-info.model';
import { PROCUREMENT_PES_CONTROLLING_GROUP_SET_ENTITY_INFO } from './entity-info/procurement-pes-controlling-group-set-entity-info.model';
import { PROCUREMENT_PES_ACCRUAL_ENTITY_INFO } from './entity-info/procurement-pes-accrual-entity-info.model';
import { PROCUREMENT_PES_EXTBIDDER2CONTACT_ENTITY_INFO } from './entity-info/procurement-pes-extbidder2contact-entity-info.model';
import { PROCUREMENT_PES_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/procurement-pes-pin-board-container-info.model';
import { PROCUREMENT_PES_BOQ_ENTITY_INFO } from './entity-info/procurement-pes-boq-entity-info.model';
import { BoqMainModuleInfo } from '@libs/boq/main';
import { ProcurementPesBoqItemDataService } from '../services/procurement-pes-boq-item-data.service';

/**
 * The module info object for the `procurement.pes` content module.
 */
export class ProcurementPesModuleInfo extends PrcModuleInfoBase {
	private static _instance?: ProcurementPesModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProcurementPesModuleInfo {
		if (!this._instance) {
			this._instance = new ProcurementPesModuleInfo();
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
		return 'procurement.pes';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Procurement.Pes';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			PROCUREMENT_PES_ENTITY_INFO,
			PROCUREMENT_PES_EVENTS_ENTITY_INFO,
			PROCUREMENT_PES_CHARACTERISTIC2_ENTITY_INFO,
			PROCUREMENT_PES_CHARACTERISTIC_ENTITY_INFO,
			PROCUREMENT_PES_FORM_DATA_ENTITY_INFO,
			PROCUREMENT_PES_ITEM_ENTITY_INFO,
			...DocumentProjectEntityInfoService.create<IPesHeaderEntity>(this.internalPascalCasedModuleName, ProcurementPesDocumentProjectDataService),
			PROCUREMENT_PES_EXT_BIDDER_ENTITY_INFO,
			PROCUREMENT_PES_TRANSACTION_ENTITY_INFO,
			PROCUREMENT_PES_BILLING_SCHEMA_ENTITY_INFO,
			PROCUREMENT_PES_DELIVERY_SCHEDULE_ENTITY_INFO,
			PROCUREMENT_PES_POST_CON_HISTORY_ENTITY_INFO,
			PES_HISTORICAL_PRICE_FOR_BOQ_ENTITY_INFO,
			...PROCUREMENT_PES_PRICE_CONDITION_ENTITY_INFO,
			PES_STATUS_HISTORY_ENTITY_INFO,
			PROCUREMENT_PES_HISTORICAL_PRICE_FOR_ITEM_ENTITY_INFO,
			PROCUREMENT_PES_SHIPMENT_INFO_ENTITY_INFO,
			PROCUREMENT_PES_SELFBILLING_DETAIL_ENTITY_INFO,
			PROCUREMENT_PES_CONTROLLING_GROUP_SET_ENTITY_INFO,
			PROCUREMENT_PES_ACCRUAL_ENTITY_INFO,
			PROCUREMENT_PES_EXTBIDDER2CONTACT_ENTITY_INFO,
			PROCUREMENT_PES_BOQ_ENTITY_INFO,
			this.boqItemEntityInfo,
		];
	}

	private readonly boqItemEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqItemEntityInfo((ctx) => ctx.injector.get(ProcurementPesBoqItemDataService), 'F52BE674B318460DA047748DF4F07BEC');

	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'basics.procurementstructure',
			'procurement.contract',
			'procurement.invoice'
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: '15f967a1ac87242a0f91776d0482c14f'
			}),
			PROCUREMENT_PES_PIN_BOARD_CONTAINER_DEFINITION,
		]);
	}
}
