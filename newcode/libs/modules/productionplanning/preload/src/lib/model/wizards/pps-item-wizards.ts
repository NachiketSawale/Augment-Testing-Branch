/*
 * Copyright(c) RIB Software GmbH
 */

import {IInitializationContext, IWizard} from '@libs/platform/common';

export const PPS_ITEM_WIZARDS: IWizard[] =
	[
		// todo: enableItem

		// todo: diableItem

		// todo: changeItemStatus

		{
			uuid: '9065e7dd71ab49eba2b6adc4f4001724',
			name: 'changeUpstreamStatus',
			execute(context): Promise<void> | undefined {
				return import('@libs/productionplanning/item').then((module) => new module.PpsItemWizard().changeUpstreamStatus(context));
			}
		},
		{
			uuid: '1a7923ae9b7b4ec3b6421e3255741e72',
			name: 'changeStatusForProjectDocument',
			execute(context: IInitializationContext) {
				return import('@libs/productionplanning/item').then((module) => new module.PpsItemWizard().changeDocumentProjectStatus(context));
			}
		}
	];