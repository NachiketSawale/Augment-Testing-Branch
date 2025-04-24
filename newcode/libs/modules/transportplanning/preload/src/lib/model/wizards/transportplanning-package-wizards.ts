/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';
export const TRANSPORTPLANNING_PACKAGE_WIZARDS: IWizard[] = [
	{
		uuid: '822a54da829149cdbd8b01e26b855d00',
		name: 'changePackageStatus',
		execute(context): Promise<void> | undefined {
			return import('@libs/transportplanning/package').then((module) => new module.TransportPlanningPackageWizard().changePackageStatus(context));
		},
	},
];
