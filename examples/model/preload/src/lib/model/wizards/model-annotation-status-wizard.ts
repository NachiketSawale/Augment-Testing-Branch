/*
 * Copyright(c) RIB Software GmbH
 */


import { IWizard} from '@libs/platform/common';

export const MODEL_CHANGE_ANNOTATION_STATUS_WIZARD : IWizard[] = [
	{
		uuid: '0b774ff87d5d4f58985fef4b545eca2c',
		name: 'model.annotation.modelAnnotationStatusWizardService',
		execute: (context) => {
			return import('@libs/model/annotation').then((module) => new module.AnnotationWizards().changeModelStatus(context));
		}
		
	},
	
];