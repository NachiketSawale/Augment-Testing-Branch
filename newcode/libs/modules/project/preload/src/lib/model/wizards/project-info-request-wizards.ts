/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext, IWizard } from '@libs/platform/common';

export const PROJECT_INFO_REQUEST_WIZARDS: IWizard[] = [
	{
		uuid: '37124d24827e4fd68bbed592c24e6bf7',
		name: 'Synchronize BIM 360 FRIs to RIB 4.0',
		execute(context: IInitializationContext) {
			return import('@libs/project/inforequest').then((module) => {
				new module.ProjectInfoRequestWizards().syncBim360Issues(context);
			});
		},
	},
];
