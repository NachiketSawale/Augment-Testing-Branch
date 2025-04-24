/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';
import { BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService, BasicsSharedChangeCertificateStatusWizardRegisterService } from '@libs/basics/shared';

export const BASICS_SHARED_WIZARDS: IWizard[] =
	[
		{
			uuid: '09e2088390c740e1ab8da6c98cf61fcc',
			name: 'changeRubricCategory',
			execute: context => {
				const currentModule = context.moduleManager.activeModule!;
				const moduleName = currentModule.internalModuleName;
				const featureKey = context.injector.get(BasicSharedChangeProjectDocumentRubricCategoryFeatureRegisterService).getFeature(moduleName);
				return context.moduleManager.currentModuleFeatures.getFeature(featureKey)?.execute(context);
			}
		},
		{
			uuid: '538325604b524f328fdf436fb14f1fc8',
			name: 'Change Certificate Status',
			execute: context => {
				const currentModule = context.moduleManager.activeModule!;
				const moduleName = currentModule.internalModuleName;
				const featureKey = context.injector.get(BasicsSharedChangeCertificateStatusWizardRegisterService).ensureFeature(moduleName);
				return context.moduleManager.currentModuleFeatures.getFeature(featureKey)?.execute(context);
			}
		},
	];