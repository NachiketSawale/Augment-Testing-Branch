/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ChangeProcurementRequisitionStatusWizardService } from '../../services/wizards/change-procurement-requisition-status-wizard.service';
import { ProcurementRequisitionChangeProjectDocumentStatusWizardService } from '../../services/wizards/procurement-requisition-change-project-document-status-wizard.service';
import { BasicsSharedCharacteristicBulkEditorService, ICharacteristicBulkEditorOptions } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { ProcurementRequisitionHeaderDataService } from '../../services/requisition-header-data.service';

/**
 * Procurement Requisition Wizard class
 */
export class ProcurementRequisitionWizard {

	public changeRequisitionStatus(context: IInitializationContext){
		const service = context.injector.get(ChangeProcurementRequisitionStatusWizardService);
		service.startChangeStatusWizard();
	}

	public changeStatusForProjectDocument(context: IInitializationContext){
		const service = context.injector.get(ProcurementRequisitionChangeProjectDocumentStatusWizardService);
		service.startChangeStatusWizard();
	}

	public async characteristicBulkEditor(context: IInitializationContext) {
		const options: ICharacteristicBulkEditorOptions = {
			initContext: context,
			moduleName: 'procurement.requisition',
			sectionId: BasicsCharacteristicSection.Requisition,
			afterCharacteristicsApplied: () => {
				const dataService = context.injector.get(ProcurementRequisitionHeaderDataService);
				dataService.refreshSelected();
			},
		};
		await context.injector.get(BasicsSharedCharacteristicBulkEditorService).showEditor(options);
	}

}