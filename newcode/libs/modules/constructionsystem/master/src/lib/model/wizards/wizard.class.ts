/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ConstructionSystemMasterEnableDisableRecordWizardService } from '../../services/wizards/enable-disable-record-wizard.service';
import { ConstructionSystemMasterUpdateParameterTemplatesWizardService } from '../../services/wizards/update-parameter-templates-wizard.service';

export class ConstructionSystemMasterWizard {

	public onStartDisableWizard(context: IInitializationContext){
		const service = context.injector.get(ConstructionSystemMasterEnableDisableRecordWizardService);
		service.onStartDisableWizard();
	}

	public onStartEnableWizard(context: IInitializationContext){
		const service = context.injector.get(ConstructionSystemMasterEnableDisableRecordWizardService);
		service.onStartEnableWizard();
	}

	public updateParameterTemplates(context: IInitializationContext){
		const service = context.injector.get(ConstructionSystemMasterUpdateParameterTemplatesWizardService);
		service.updateParameterTemplates();
	}
}