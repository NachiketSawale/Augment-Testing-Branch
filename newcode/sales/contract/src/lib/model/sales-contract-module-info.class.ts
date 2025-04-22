/*
 * Copyright(c) RIB Software GmbH
 */

import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { BusinessModuleInfoBase, DataTranslationGridComponent, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ContainerDefinition, ContainerTypeRef } from '@libs/ui/container-system';
import { SalesContractBoqConfigService, SalesContractBoqDataService } from '../services/sales-contract-boq.service';
import { SalesContractDocumentProjectDataService } from '../services/sales-contract-document-project-data.service';
import { ServiceLocator } from '@libs/platform/common';
import { SALES_CONTRACT_PAYMENT_SCHEDULE_ENTITY_INFO } from './sales-contract-payment-schedule-entity-info.model';
import { BoqMainModuleInfo, BoqSplitQuantityDataService } from '@libs/boq/main';
import { SalesContractBoqItemDataService } from '../services/sales-contract-boq-item-data.service';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { SALES_CONTRACT_CONTRACTS_ENTITY_INFO } from './entity-info/sales-contract-contracts-entity-info.model';
import { SALES_CONTRACT_ACTUAL_CERTIFICATE_ENTITY_INFO } from './entity-info/sales-contract-actual-certificate-entity-info.model';
import { SALES_CONTRACT_ADVANCE_ENTITY_INFO } from './entity-info/sales-contract-advance-entity-info.model';
import { SALES_CONTRACT_CERTIFICATES_ENTITY_INFO } from './entity-info/sales-contract-certificates-entity-info.model';
import { SALES_CONTRACT_CHANGE_ORDER_ENTITY_INFO } from './entity-info/sales-contract-change-order-entity-info.model';
import { SALES_CONTRACT_CHARACTERISTIC_ENTITY_INFO, SALES_CONTRACT_CHARACTERISTIC2_ENTITY_INFO } from './entity-info/sales-contract-characteristic-entity-info.model';
import { SALES_CONTRACT_CLERK_ENTITY_INFO } from './entity-info/sales-contract-clerk-entity-info.model';
import { SALES_CONTRACT_DOCUMENT_ENTITY_INFO } from './entity-info/sales-contract-document-entity-info.model';
import { SALES_CONTRACT_FORM_DATA_ENTITY_INFO } from './entity-info/sales-contract-form-data-entity-info.model';
import { SALES_CONTRACT_GENERALS_ENTITY_INFO } from './entity-info/sales-contract-generals-entity-info.model';
import { SALES_CONTRACT_MANDATORY_DEADLINES_ENTITY_INFO } from './entity-info/sales-contract-mandatory-deadlines-entity-info.model';
import { SALES_CONTRACT_PIN_BOARD_CONTAINER_ENTITY_INFO } from './entity-info/sales-contract-pin-board-entity-info.model';
import { SALES_CONTRACT_RELATED_BILL_ENTITY_INFO } from './entity-info/sales-contract-related-bill-entity-info.model';
import { SALES_CONTRACT_RELATED_WIP_ENTITY_INFO } from './entity-info/sales-contract-related-wip-entity-info.model';
import { SALES_CONTRACT_TRANSACTION_ENTITY_INFO } from './entity-info/sales-contract-transaction-entity-info.model';
import { SALES_CONTRACT_VALIDATION_ENTITY_INFO } from './entity-info/sales-contract-validation-entity-info.model';
import { SALES_CONTRACT_WARRANTY_ENTITY_INFO } from './entity-info/sales-contract-warranty-entity-info.model';
import { SALES_CONTRACT_MILESTONES_ENTITY_INFO } from './sales-contract-milestone-entity-info.model';
import { IOrdBoqCompositeEntity } from '@libs/sales/interfaces';
import { SALES_CONTRACT_PPS_HEADER_ENTITY_INFO } from './sales-contract-pps-header-entity-info.model';

/**
 * The module info object for the `sales.contract` content module.
 */
export class SalesContractModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: SalesContractModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): SalesContractModuleInfo {
		if (!this._instance) {
			this._instance = new SalesContractModuleInfo();
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
		return 'sales.contract';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Sales.Contract';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ SALES_CONTRACT_CONTRACTS_ENTITY_INFO,
					SALES_CONTRACT_GENERALS_ENTITY_INFO,
					SALES_CONTRACT_MILESTONES_ENTITY_INFO,
					SALES_CONTRACT_WARRANTY_ENTITY_INFO,
					SALES_CONTRACT_MANDATORY_DEADLINES_ENTITY_INFO,
					SALES_CONTRACT_CERTIFICATES_ENTITY_INFO,
					SALES_CONTRACT_RELATED_BILL_ENTITY_INFO,
					SALES_CONTRACT_RELATED_WIP_ENTITY_INFO,
					SALES_CONTRACT_ADVANCE_ENTITY_INFO,
					SALES_CONTRACT_VALIDATION_ENTITY_INFO,
					SALES_CONTRACT_DOCUMENT_ENTITY_INFO,
					SALES_CONTRACT_PAYMENT_SCHEDULE_ENTITY_INFO,
					this.SALES_CONTRACT_BOQ_ENTITY_INFO,
					SALES_CONTRACT_TRANSACTION_ENTITY_INFO,
					SALES_CONTRACT_CLERK_ENTITY_INFO,
					SALES_CONTRACT_ACTUAL_CERTIFICATE_ENTITY_INFO,
					SALES_CONTRACT_CHANGE_ORDER_ENTITY_INFO,
					SALES_CONTRACT_CHARACTERISTIC_ENTITY_INFO,
					SALES_CONTRACT_CHARACTERISTIC2_ENTITY_INFO,
					SALES_CONTRACT_FORM_DATA_ENTITY_INFO,
					SALES_CONTRACT_PPS_HEADER_ENTITY_INFO,
			...DocumentProjectEntityInfoService.create(this.internalPascalCasedModuleName, SalesContractDocumentProjectDataService),
					this.boqItemEntityInfo,
					this.boqOenItemEntityInfo,
					this.boqSplitQuantityEntityInfo
		];
	}

	private readonly boqItemEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqItemEntityInfo((ctx) => ctx.injector.get(SalesContractBoqItemDataService), '8d52d213015f4df6b3fb07d6fd81cb42');
	private readonly boqSplitQuantityEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqSplitQuantityEntityInfo(ctx => ctx.injector.get(BoqSplitQuantityDataService), '024492dad0a7493abf07220a9d2b6f84', '8d52d213015f4df6b3fb07d6fd81cb42');

	private readonly boqOenItemEntityInfo: EntityInfo = BoqMainModuleInfo.createBoqOenItemEntityInfo((ctx) => ctx.injector.get(SalesContractBoqItemDataService),'8d57520da7ac43cdb003ada9d0a42dba', '8d52d213015f4df6b3fb07d6fd81cb42');

	/**
	 * Load the translations file used for sales contract
	 * */
	public override get preloadedTranslations(): string[] {
		return [...super.preloadedTranslations, 'sales.common',
			'cloud.common',
			'boq.main',
			'procurement.common',
			'businesspartner.certificate',
			'procurement.contract',
			'documents.shared'
		];
	}

	protected override get containers(){
		return[...super.containers, new ContainerDefinition({
			uuid: '382b89267ebe4aec801a257618a2d012',
			title: { key: 'ui.business-base.translationContainerTitle' },
			containerType: DataTranslationGridComponent as ContainerTypeRef
		}),
			SALES_CONTRACT_PIN_BOARD_CONTAINER_ENTITY_INFO,
			DrawingContainerDefinition.createPDFViewer({
				uuid: 'd7bb075997478318bdbcd9fa1bc92262'
			})
		];
	}

	private SALES_CONTRACT_BOQ_ENTITY_INFO = EntityInfo.create({
		grid: { title: 'boq.main.boqList', },
		permissionUuid: 'ad818cba8fbb4ef1880027482ffaea1a',
		dataService:         ctx => ctx.injector.get(SalesContractBoqDataService),
		layoutConfiguration: ctx => ctx.injector.get(SalesContractBoqConfigService).getLayoutConfiguration(),
		entitySchema:    ServiceLocator.injector.get(SalesContractBoqConfigService).getSchema('IOrdBoqCompositeEntity'),
	} as IEntityInfo<IOrdBoqCompositeEntity>);
}
