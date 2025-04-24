/*
 * Copyright(c) RIB Software GmbH
 */


import { IWizard} from '@libs/platform/common';

export const MODEL_ANNOTATION_BCF_EXPORT_WIZARD : IWizard[] = [
	{
		uuid: 'b988e017af494a6cbaeff019c9bf65df',
		name: 'model.annotation.bcf.exportTitle',
		execute: (context) => {
			return import('@libs/model/annotation').then((module) => new module.AnnotationWizards().bcfExport(context));
		}
	},
	
];