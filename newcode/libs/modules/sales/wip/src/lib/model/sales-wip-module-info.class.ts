/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { SALES_WIP_WIPS_ENTITY_INFO } from './sales-wip-wips-entity-info.model';
import { SALES_LINE_ITEM_ENTITY_INFO } from './containers/sales-wip-line-items-entity-info.model';
import { SALES_WIP_RELATED_BILL_ENTITY_INFO } from './containers/sales-wip-related-bill-entity-info.model';
import { SALES_WIP_RELATED_CONTRACT_ENTITY_INFO } from './containers/sales-wip-related-contract-entity-info.model';
import { ContainerDefinition, ContainerTypeRef } from '@libs/ui/container-system';
import { SALES_WIP_CLERK_ENTITY_INFO } from './containers/sales-wip-clerk-entity-info.model';
import { SALES_WIP_TRANSACTION_ENTITY_INFO } from './containers/sales-wip-transaction-entity-info.model';
import { SALES_WIP_VALIDATION_ENTITY_INFO } from './containers/sales-wip-validation-entity-info.model';
import { SALES_WIP_DOCUMENT_ENTITY_INFO } from './containers/sales-wip-document-entity-info.model';
import { SALES_WIP_BILLING_SCHEMA_ENTITY_INFO } from './containers/sales-wip-billing-schema-entity.info.model';
import { SALES_WIP_ACCRUAL_ENTITY_INFO } from './containers/sales-wip-accrual-entity-info.model';
import { ServiceLocator } from '@libs/platform/common';
import { IWipBoqCompositeEntity } from './entities/wip-boq-composite-entity.interface';
import { SalesWipBoqConfigService, SalesWipBoqDataService } from '../services/sales-wip-boq.service';
import { BoqMainModuleInfo } from '@libs/boq/main';
import { SalesWipBoqItemDataService } from '../services/sales-wip-boq-item-data.service';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { SalesWipDocumentProjectDataService } from '../services/sales-wip-document-project-data.service';
import { SALES_WIP_CHARACTERISTIC2_ENTITY_INFO, SALES_WIP_CHARACTERISTIC_ENTITY_INFO } from './sales-wip-characteristic-entity-info.model';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { SALES_WIP_PIN_BOARD_CONTAINER_ENTITY_INFO } from './sales-wip-pin-board-container-entity-info.model';
import { SALES_WIP_FORM_DATA_ENTITY_INFO } from './sales-wip-form-data-entity-info.model';
import { SALES_WIP_PRICE_CONDITION_ENTITY_INFO } from './sales-wip-price-condition-param-entity-info.model';

/**
 * The module info object for the `sales.wip` content module.
 */
export class SalesWipModuleInfo extends BusinessModuleInfoBase  {
	private static _instance?: SalesWipModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): SalesWipModuleInfo {
		if (!this._instance) {
			this._instance = new SalesWipModuleInfo();
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
		return 'sales.wip';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Sales.Wip';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			SALES_WIP_WIPS_ENTITY_INFO,SALES_LINE_ITEM_ENTITY_INFO,SALES_WIP_RELATED_BILL_ENTITY_INFO,SALES_WIP_RELATED_CONTRACT_ENTITY_INFO,SALES_WIP_CLERK_ENTITY_INFO
			,SALES_WIP_TRANSACTION_ENTITY_INFO,SALES_WIP_VALIDATION_ENTITY_INFO,SALES_WIP_DOCUMENT_ENTITY_INFO,SALES_WIP_BILLING_SCHEMA_ENTITY_INFO,SALES_WIP_ACCRUAL_ENTITY_INFO,
          this.SALES_WIP_BOQ_ENTITY_INFO, this.boqItemEntityInfo,...DocumentProjectEntityInfoService.create(this.internalPascalCasedModuleName, SalesWipDocumentProjectDataService),
			SALES_WIP_CHARACTERISTIC_ENTITY_INFO,SALES_WIP_CHARACTERISTIC2_ENTITY_INFO,SALES_WIP_FORM_DATA_ENTITY_INFO,SALES_WIP_PRICE_CONDITION_ENTITY_INFO
		];
	}

	private readonly boqItemEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqItemEntityInfo((ctx) => ctx.injector.get(SalesWipBoqItemDataService), '6e5b061fc7014aec91717edbb576312c');

	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'cloud.common', 'procurement.common','basics.company','productionplanning.common','estimate.main','sales.contract','basics.billingschema','procurement.pes.transaction.', 'boq.main'];
	}

	// Todo: later Translation container can be shifted to shared for common use among all sales sub modules
	protected override get containers() {
		return [
			...super.containers,
			new ContainerDefinition({
				uuid: '1f821207112b4cbeb037d941b18b7338',
				title: { key: 'cloud.common.entityTranslation' },
				containerType: DataTranslationGridComponent as ContainerTypeRef,
			}),
			SALES_WIP_PIN_BOARD_CONTAINER_ENTITY_INFO,
			DrawingContainerDefinition.createPDFViewer({
				uuid: 'defa5e1daa2041ceb1f5807ef9b8a935'
			}),
		];
	}

	private SALES_WIP_BOQ_ENTITY_INFO = EntityInfo.create({
		grid: { title: 'boq.main.boqList', },
		permissionUuid: '27cbdfed58e44dbd8d3b3c07b54bbc1f',
		dataService:         ctx => ctx.injector.get(SalesWipBoqDataService),
		layoutConfiguration: ctx => ctx.injector.get(SalesWipBoqConfigService).getLayoutConfiguration(),
		entitySchema:    ServiceLocator.injector.get(SalesWipBoqConfigService).getSchema('IWipBoqCompositeEntity'),
	} as IEntityInfo<IWipBoqCompositeEntity>);
}
