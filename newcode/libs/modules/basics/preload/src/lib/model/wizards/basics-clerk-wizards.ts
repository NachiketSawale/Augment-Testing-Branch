/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';
export const BASICS_CLERK_WIZARDS: IWizard[] =
	[ // createClerksFromUsers
		{
			uuid: '13e2ed83635142b9965c9fd873ef322c',
			name: 'disableClerk',
			execute: context => {
				return import('@libs/basics/clerk').then((module) => new module.BasicsClerkWizards().disableClerk(context));
			}
		},
		{
			uuid: '31ff2dc732194d7da5d36dcd35c30a96',
			name: 'enableClerk',
			execute: context => {
				return import('@libs/basics/clerk').then((module) => new module.BasicsClerkWizards().enableClerk(context));
			}
		},
		{
			uuid: '9fc228d8786d419ca4c795ff7f50f66a',
			name: 'createClerksFromUsers',
			execute: context => {
				return import('@libs/basics/clerk').then((module) => new module.BasicsClerkWizards().createClerksFromUsers(context));
			   }
		   }
	];
