/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext } from '@libs/platform/common';
import { ChangeProcurementQuoteStatusWizardService } from '../../services/wizards/change-procurement-quote-status-wizard.service';
import { ProcurementQuoteChangeProjectDocumentStatusWizardService } from '../../services/wizards/procurement-quote-change-project-document-status-wizard.service';
import { ProcurementQuoteSplitOverallDiscountWizardService } from '../../services/wizards/quote-split-overall-discount-wizard.service';
import {
	ProcurementQuoteChangeConfigurationWizardService
} from '../../services/wizards/quote-change-procurement-configuration-wizard.service';

import { ProcurementQuoteChangeCodeWizardService } from '../../services/wizards/quote-chang-code-wizard.service';
import { ProcurementCommonImportMaterialService } from '@libs/procurement/common';
import { ProcurementQuoteHeaderDataService } from '../../services/quote-header-data.service';
import { ProcurementQuoteRequisitionDataService } from '../../services/quote-requisitions-data.service';
import { runInInjectionContext } from '@angular/core';
import { ProcurementQuoteValidateAndUpdateItemQuantityWizardService } from '../../services/wizards/procurement-quote-validate-and-update-item-quantity-wizard.service';
import { ProcurementQuoteExcelImportWizardService } from '../../services/wizards/procurement-quote-excel-import-wizard.service';
import { ProcurementQuoteExportMaterialWizardService } from '../../services/wizards/quote-export-material-wizard.service';
/**
 * Procurement Quote Wizard class
 */
export class ProcurementQuoteWizard {
	public changeQuoteStatus(context: IInitializationContext){
		const service = context.injector.get(ChangeProcurementQuoteStatusWizardService);
		service.startChangeStatusWizard();
	}

	public changeStatusForProjectDocument(context: IInitializationContext){
		const service = context.injector.get(ProcurementQuoteChangeProjectDocumentStatusWizardService);
		service.startChangeStatusWizard();
	}

	public splitOverallDiscount(context: IInitializationContext){
		const service = context.injector.get(ProcurementQuoteSplitOverallDiscountWizardService);
		service.onStartWizard();
	}

	public changeProcurementConfiguration(context: IInitializationContext){
		const service = context.injector.get(ProcurementQuoteChangeConfigurationWizardService);
		service.onStartWizard();
	}

	public changeCode(context: IInitializationContext){
		const service = context.injector.get(ProcurementQuoteChangeCodeWizardService);
		service.changeCode(context);
	}

	public importMaterial(context: IInitializationContext){

		const service = runInInjectionContext(context.injector, () => {

		const rootService = context.injector.get(ProcurementQuoteHeaderDataService);
		const dataService = context.injector.get(ProcurementQuoteRequisitionDataService);
		return  new ProcurementCommonImportMaterialService(rootService,dataService,'procurement.quote');
	});
		service.onStartWizard();
	}

	public showDialog(context: IInitializationContext){
		const service = context.injector.get(ProcurementQuoteValidateAndUpdateItemQuantityWizardService);
		service.showDialog();
	}

	public qtoExcelImport(context: IInitializationContext){
		const service = context.injector.get(ProcurementQuoteExcelImportWizardService);
		service.onStartWizard();
	}

	public exportMaterial(context: IInitializationContext){
		const service = context.injector.get(ProcurementQuoteExportMaterialWizardService);
		service.export();
	}
}