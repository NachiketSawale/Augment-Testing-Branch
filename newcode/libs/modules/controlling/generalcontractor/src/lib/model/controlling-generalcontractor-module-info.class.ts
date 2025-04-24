/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ControllingGeneralContractorCostHeaderEntityInfo } from './controlling-general-contractor-cost-header-entity-info.model';
import { CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_ENTITY_INFO } from './controlling-general-contractor-pes-header-entity-info.model';
import {ControllingGeneralContractorAddExpensesEntityInfo} from './controlling-general-contractor-add-expenses-entity-info.model';
import { controllingGeneralContractorActualsEntityInfoModel} from './controlling-general-contractor-actuals-entity-info.model';
import {controllingGeneralContractorPackagesEntityInfo} from './controlling-general-contractor-packages-entity-info.model';
import {
	controllingGeneralContractorLineItemsEntityInfo
} from './controlling-general-contractor-line-items-entity-info.model';
import {ControllingGeneralContractorBudgetShiftEntityInfo} from './controlling-general-contractor-budget-shift-entity-info.model';
import {
	ControllingGeneralContractorSalesContractsEntityInfo
} from './controlling-general-contractor-sales-contracts-entity-info.model';
import {
	ControllingGeneralContractorPrcInvoiceEntityInfo
} from './controlling-general-contractor-prc-invoices-entity-info.model';
import {
	controllingGeneralContractorPrcContractsEntityInfo
} from './controlling-general-contractor-prc-contracts-entity-info.model';
import {DocumentProjectEntityInfoService} from '@libs/documents/shared';
import {IGccPrcInvoicesEntity} from './entities/gcc-prc-invoices-entity.interface';
import {
	ControllingGeneralDocumentProjectDataService
} from '../services/controlling-general-document-project-data.service';
import {MODULE_INFO_BUSINESSPARTNER} from '@libs/businesspartner/common';

/**
 * The module info object for the `controlling.generalcontractor` content module.
 */
export class ControllingGeneralContractorModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ControllingGeneralContractorModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ControllingGeneralContractorModuleInfo {
		if (!this._instance) {
			this._instance = new ControllingGeneralContractorModuleInfo();
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
		return 'controlling.generalcontractor';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Controlling.Generalcontractor';
	}

	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations, 'sales.common', 'sales.contract', MODULE_INFO_BUSINESSPARTNER.documentsSharedModuleName
		];
	}
	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [ ControllingGeneralContractorCostHeaderEntityInfo,
			CONTROLLING_GENERAL_CONTRACTOR_PES_HEADER_ENTITY_INFO,
			ControllingGeneralContractorAddExpensesEntityInfo,
			ControllingGeneralContractorBudgetShiftEntityInfo,
			ControllingGeneralContractorSalesContractsEntityInfo,
			ControllingGeneralContractorPrcInvoiceEntityInfo,
			controllingGeneralContractorActualsEntityInfoModel,
			controllingGeneralContractorPackagesEntityInfo,
			controllingGeneralContractorPrcContractsEntityInfo,
			controllingGeneralContractorLineItemsEntityInfo,
			...DocumentProjectEntityInfoService.create<IGccPrcInvoicesEntity>(this.internalPascalCasedModuleName, ControllingGeneralDocumentProjectDataService)
		];
	}
}
