/*
 * Copyright(c) RIB Software GmbH
 */


import { IInitializationContext } from '@libs/platform/common';
import { BasicsMaterialCatalogEnableWizardService } from '../../service/wizards/basics-material-catalog-enable-wizard.service';

export class BasicsMaterialCatalogWizard{
	public enableWizard(context: IInitializationContext){
		const service = context.injector.get(BasicsMaterialCatalogEnableWizardService);
		service.onStartEnableWizard();
	}
}

