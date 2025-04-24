/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { EstimateUpdateAssembliesWizardService } from './estimate-update-assemblies-wizard.service';
import {EstimateAssembliesReplaceResourceWizardService} from './estimate-assemblies-replace-resource-wizard.service';
import { EstimateAssemblyModifyResourceWizardService } from './estimate-assemblies-modify-resource-wizard.service';

/**
 * Class representing a wizard for estimating assemblies.
 */
export class EstimateAssembliesWizard {

/**
 * Updates assemblies using the provided context.
*/
	public updateAssemblies(context: IInitializationContext) {
		const service = context.injector.get(EstimateUpdateAssembliesWizardService);
		service.updateAssemblies();
	}

	/**
	 * replace Resource using the provided context.
	 */
	public replaceResource(context: IInitializationContext) {
		const service = context.injector.get(EstimateAssembliesReplaceResourceWizardService);
		service.showReplaceResourceWizardDialog();
	}

	public modifyResource(context: IInitializationContext) {
		const service = context.injector.get(EstimateAssemblyModifyResourceWizardService);
		service.openModifyResourceDialog();
	}
}
