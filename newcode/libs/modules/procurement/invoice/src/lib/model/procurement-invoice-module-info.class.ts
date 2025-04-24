/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PROCUREMENT_INVOICE_HEADER_ENTITY_INFO } from '../header/procurement-invoice-header-entity-info.model';
import { PrcModuleInfoBase} from '@libs/procurement/common';
import { PROCUREMENT_INVOICE_CHARACTERISTIC_ENTITY_INFO } from './entity-info/procurement-invoice-characteristics-entity-info.model';
import { PROCUREMENT_INVOICE_CHARACTERISTIC2_ENTITY_INFO } from './entity-info/procurement-invoice-characteristics2-entity-info.model';
import { PROCUREMENT_INVOICE_EVENT_ENTITY_INFO } from './entity-info/procurement-invoice-event-entity-info.model';
import { PROCUREMENT_INVOICE_FORM_DATA_ENTITY_INFO } from './entity-info/procurement-invoice-form-data-entity-info.model';
import { PROCUREMENT_INVOICE_CERTIFICATE_ENTITY_INFO } from './entity-info/procurement-invoice-certificate-entity-info.model';
import { PROCUREMENT_INVOICE_ACTUAL_CERTIFICATE_ENTITY_INFO } from './entity-info/procurement-invoice-actual-certificate-entity-info.model';
import { PROCUREMENT_INVOICE_IMPORT_ENTITY_INFO } from './entity-info/procurement-invoice-import-entity-info.model';
import { PROCUREMENT_INVOICE_CONTRACT_ITEM_ENTITY_INFO } from '../contractitem/procurement-invoice-contract-item-entity-info.model';
import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { IInvHeaderEntity } from './entities';
import { ProcurementInvoiceDocumentProjectDataService } from '../services/procurement-invoice-document-project-data.service';
import { PROCUREMENT_INVOICE_GENERALS_ENTITY_INFO } from './entity-info/procurement-invoice-generals-entity-info.model';
import { PROCUREMENT_INVOICE_CHAINED_INVOICE_ENTITY_INFO } from './entity-info/procurement-invoice-chained-invoice-entity-info.model';
import { PROCUREMENT_INVOICE_BILLING_SCHEMA_ENTITY_INFO } from './entity-info/procurement-invoice-billing-schema-entity-info.model';
import { PROCUREMENT_INVOICE_OTHER_ENTITY_INFO } from './entity-info/procurement-invoice-other-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { PROCUREMENT_INVOICE_IMPORT_INVOICE_WARNING_INFO } from './entity-info/procurement-invoice-import-invoice-warning-info.model';
import { PROCUREMENT_INVOICE_REJECTION_ENTITY_INFO } from './entity-info/procurement-invoice-rejection-entity-info.model';
import { PROCUREMENT_INVOICE_PAYMENT_ENTITY_INFO } from '../payment/procurement-invoice-payment-entity-info.model';
import { PROCUREMENT_INVOICE_SALES_TAX_ENTITY_INFO } from './entity-info/procurement-invoice-sales-tax-entity-info.model';
import { PROCUREMENT_INVOICE_CONTROLLING_GROUP_OTHER_SET_ENTITY_INFO } from './entity-info/procurement-invoice-controlling-group-set-other-entity-info.model';
import { PROCUREMENT_INVOICE_CONTROLLING_GROUP_CONTRACT_SET_ENTITY_INFO } from './entity-info/procurement-invoice-controlling-group-set-contract-entity-info.model';
import { PROCUREMENT_INVOICE_CONTROLLING_GROUP_TRANSACTION_SET_ENTITY_INFO } from './entity-info/procurement-invoice-controlling-group-set-transaction-entity-info.model';
import { PROCUREMENT_INVOICE_CONTROLLING_GROUP_REJECTION_SET_ENTITY_INFO } from './entity-info/procurement-invoice-controlling-group-set-rejection-entity-info.model';
import { PROCUREMENT_INVOICE_PES_ENTITY_INFO } from './entity-info/procurement-invoice-pes-entity-info.model';
import { PROCUREMENT_INVOICE_ACCRUAL_ENTITY_INFO } from './entity-info/procurement-invoice-accrual-entity-info.model';
import { PROCUREMENT_INVOICE_IC_TRANSACTION_ENTITY_INFO } from './entity-info/procurement-invoice-ic-transaction-entity-info.model';
import { PROCUREMENT_INVOICE_VALIDATION_ENTITY_INFO } from './entity-info/procurement-invoice-validation-entity-info.model';
import { PROCUREMENT_INVOICE_POST_CON_HISTORY_ENTITY_INFO } from './entity-info/procurement-invoice-postcon-history-entity-info.model';
import { PROCUREMENT_INVOICE_RECONCILIATION2_ENTITY_INFO } from './entity-info/procurement-invoice-reconciliation2-entity-info.model';
import { PROCUREMENT_INVOICE_ACCOUNT_ASSIGNMENT_ENTITY_INFO } from './entity-info/procurement-invoice-account-assignment-entity-info.model';
import { PROCUREMENT_INVOICE_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/procurement-invoice-pin-board-container-info.model';


/**
 * The module info object for the `procurement.invoice` content module.
 */
export class ProcurementInvoiceModuleInfo extends PrcModuleInfoBase {
	private static _instance?: ProcurementInvoiceModuleInfo;
	private readonly procurementInvoiceDocumentProjectEntityInfo = DocumentProjectEntityInfoService.create<IInvHeaderEntity>(this.internalPascalCasedModuleName, ProcurementInvoiceDocumentProjectDataService);

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ProcurementInvoiceModuleInfo {
		if (!this._instance) {
			this._instance = new ProcurementInvoiceModuleInfo();
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
		return 'procurement.invoice';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Procurement.Invoice';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			PROCUREMENT_INVOICE_HEADER_ENTITY_INFO,
			PROCUREMENT_INVOICE_EVENT_ENTITY_INFO,
			PROCUREMENT_INVOICE_CERTIFICATE_ENTITY_INFO,
			PROCUREMENT_INVOICE_ACTUAL_CERTIFICATE_ENTITY_INFO,
			PROCUREMENT_INVOICE_IMPORT_ENTITY_INFO,
			PROCUREMENT_INVOICE_FORM_DATA_ENTITY_INFO,
			PROCUREMENT_INVOICE_CHARACTERISTIC_ENTITY_INFO,
			PROCUREMENT_INVOICE_CHARACTERISTIC2_ENTITY_INFO,
			PROCUREMENT_INVOICE_CONTRACT_ITEM_ENTITY_INFO,
			...this.procurementInvoiceDocumentProjectEntityInfo,
			PROCUREMENT_INVOICE_GENERALS_ENTITY_INFO,
			PROCUREMENT_INVOICE_CHAINED_INVOICE_ENTITY_INFO,
			PROCUREMENT_INVOICE_BILLING_SCHEMA_ENTITY_INFO,
			PROCUREMENT_INVOICE_OTHER_ENTITY_INFO,
			PROCUREMENT_INVOICE_SALES_TAX_ENTITY_INFO,
			PROCUREMENT_INVOICE_REJECTION_ENTITY_INFO,
			PROCUREMENT_INVOICE_PAYMENT_ENTITY_INFO,
			PROCUREMENT_INVOICE_CONTROLLING_GROUP_OTHER_SET_ENTITY_INFO,
			PROCUREMENT_INVOICE_CONTROLLING_GROUP_CONTRACT_SET_ENTITY_INFO,
			PROCUREMENT_INVOICE_CONTROLLING_GROUP_TRANSACTION_SET_ENTITY_INFO,
			PROCUREMENT_INVOICE_CONTROLLING_GROUP_REJECTION_SET_ENTITY_INFO,
			PROCUREMENT_INVOICE_PES_ENTITY_INFO,
			PROCUREMENT_INVOICE_ACCRUAL_ENTITY_INFO,
			PROCUREMENT_INVOICE_IC_TRANSACTION_ENTITY_INFO,
			PROCUREMENT_INVOICE_VALIDATION_ENTITY_INFO,
			PROCUREMENT_INVOICE_POST_CON_HISTORY_ENTITY_INFO,
			PROCUREMENT_INVOICE_ACCOUNT_ASSIGNMENT_ENTITY_INFO,
		];
	}

	public override get preloadedTranslations(): string[] {
		return [
			...super.preloadedTranslations,
			'procurement.contract',
			'basics.procurementstructure',
			'procurement.pes',
			'cloud.common'
		];
	}

	protected override get containers(): (ContainerDefinition | IContainerDefinition)[] {
		return super.containers.concat([
			PROCUREMENT_INVOICE_IMPORT_INVOICE_WARNING_INFO,
			PROCUREMENT_INVOICE_RECONCILIATION2_ENTITY_INFO,
			PROCUREMENT_INVOICE_PIN_BOARD_CONTAINER_DEFINITION,
		]);
	}

}
