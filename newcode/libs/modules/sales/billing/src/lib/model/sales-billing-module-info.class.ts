/*
 * Copyright(c) RIB Software GmbH
 */

import { DocumentProjectEntityInfoService } from '@libs/documents/shared';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
import { BusinessModuleInfoBase, EntityInfo, ITranslationContainerInfo } from '@libs/ui/business-base';
import { SALES_BILLING_FORM_DATA_ENTITY_INFO } from './entity-info/sales-billing-form-data-entity-info.model';
import { SalesBillingDocumentProjectDataService } from '../services/sales-billing-document-project-data.service';
import { SALES_BILLING_BILLS_ENTITY_INFO } from './entity-info/sales-billing-bills-entity-info.model';
import { SALES_BILLING_GENERALS_ENTITY_INFO } from './entity-info/sales-billing-generals-entity-info.model';
import { SALES_BILLING_CHARACTERISTIC2_ENTITY_INFO } from './entity-info/sales-billing-characteristic2-entity-info.model';
import { SALES_BILLING_CHARACTERISTICS_ENTITY_INFO } from './entity-info/sales-billing-characteristics-entity-info.model';
import { SALES_BILLING_ITEM_ENTITY_INFO } from './entity-info/sales-billing-item-entity-info.model';
import { SALES_BILLING_TRANSACTION_ENTITY_INFO } from './entity-info/sales-billing-transaction-entity-info.model';
import { SALES_BILLING_DOCUMENT_ENTITY_INFO } from './entity-info/sales-billing-document-entity-info.model';
import { SALES_BILLING_VALIDATION_ENTITY_INFO } from './entity-info/sales-billing-validation-entity-info.model';
import { ContainerDefinition, IContainerDefinition } from '@libs/ui/container-system';
import { SALES_BILLING_PIN_BOARD_CONTAINER_DEFINITION } from './entity-info/sales-billing-pin-board-container-info.model';
import { DrawingContainerDefinition } from '@libs/model/shared';
import { SALES_BILLING_ACCRUAL_ENTITY_INFO } from './entity-info/sales-billing-accrual-entity-info.model';

import { SALES_BILLING_PREVIOUS_BILLS_ENTITY_INFO } from './entity-info/sales-billing-previous-bills-entity-info.model';
import { SALES_BILLING_CLERK_ENTITY_INFO } from './entity-info/sales-billing-clerk-entity-info.model';
import { SALES_BILLING_PAYMENT_ENTITY_INFO } from './entity-info/sales-billing-payment-entity-info.model';
import { Injector } from '@angular/core';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService } from '@libs/basics/shared';
import { ChangeProjectDocumentRubricCategoryWizardService } from '../wizards/sales-billing-change-project-document-wizard.service';

/**
 * The module info object for the `sales.billing` content module.
 */
export class SalesBillingModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: SalesBillingModuleInfo;

	private readonly salesBillingDocumentProjectEntityInfo = DocumentProjectEntityInfoService.create<IBilHeaderEntity>(this.internalPascalCasedModuleName, SalesBillingDocumentProjectDataService);
	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): SalesBillingModuleInfo {
		if (!this._instance) {
			this._instance = new SalesBillingModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	public override initializeModule(injector: Injector) {
		super.initializeModule(injector);
		injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).registerFeature(injector, this.internalModuleName, this.featureRegistry, ChangeProjectDocumentRubricCategoryWizardService);
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'sales.billing';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Sales.Billing';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			SALES_BILLING_BILLS_ENTITY_INFO,
			SALES_BILLING_FORM_DATA_ENTITY_INFO,
			SALES_BILLING_CHARACTERISTICS_ENTITY_INFO,
			...this.salesBillingDocumentProjectEntityInfo, 
			SALES_BILLING_TRANSACTION_ENTITY_INFO,
			SALES_BILLING_GENERALS_ENTITY_INFO,
			SALES_BILLING_CHARACTERISTIC2_ENTITY_INFO,
			SALES_BILLING_DOCUMENT_ENTITY_INFO,
			SALES_BILLING_CLERK_ENTITY_INFO,
			SALES_BILLING_PAYMENT_ENTITY_INFO,
			SALES_BILLING_ACCRUAL_ENTITY_INFO,
			SALES_BILLING_VALIDATION_ENTITY_INFO,
			SALES_BILLING_PREVIOUS_BILLS_ENTITY_INFO,
			SALES_BILLING_ITEM_ENTITY_INFO,
		];
	}

	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([
			'sales.common',
			'sales.wip',
			'procurement.invoice',
			'basics.customize',
			'project.main',
			'object.main',
			'basics.bank',
			'basics.characteristic',
			'documents.shared',
			'model.wdeviewer',
			'documents.shared',
			'procurement.common',
			'estimate.main',
			'basics.costcodes',
		]);
	}

	protected override get containers():  (ContainerDefinition | IContainerDefinition)[]{
		return super.containers.concat([
			DrawingContainerDefinition.createPDFViewer({
				uuid: '20ee0cb4411e4d159a030efd0c562fcb'
			}),
			SALES_BILLING_PIN_BOARD_CONTAINER_DEFINITION
		]);
	}

	protected override get translationContainer(): string | ITranslationContainerInfo | undefined {
        return '0c1c039b62e8439a8c82eb287bac3441';
    }
}
