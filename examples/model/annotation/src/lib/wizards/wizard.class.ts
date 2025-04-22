/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ModelAnnotationStatusWizardService } from '../services/model-annotation-status-wizard.service';
import { ModelAnnotationBcfExportWizardService } from '../services/model-annotation-bcf-export-wizard.service';


export class AnnotationWizards  {
	public changeModelStatus(context: IInitializationContext){
		const service = context.injector.get(ModelAnnotationStatusWizardService);
		service.onStartChangeStatusWizard();
	}
	/**
	 * This method provides functionality for BCF Export 
	 */
	public bcfExport(context: IInitializationContext) {
		const service = context.injector.get(ModelAnnotationBcfExportWizardService);
		service.showDialog();
	}


	
}