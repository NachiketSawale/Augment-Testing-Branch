/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard } from '@libs/platform/common';

export const PPS_HEADER_WIZARDS: IWizard[] =
	[
		{
			uuid: 'bcdd43e906b449bcb3a23f041a0a747a',
			name: 'enableHeader',
			execute: (context) => {
				return import('@libs/productionplanning/header').then((module) => new module.PpsHeaderWizard().enableHeader(context));
			},
		},
		{
			uuid: 'c2ff7e202d5f4ea7bf16abcd450f3594',
			name: 'disableHeader',
			execute: (context) => {
				return import('@libs/productionplanning/header').then((module) => new module.PpsHeaderWizard().disableHeader(context));
			},
		},
		{
			uuid: 'a7905833028a4766bdc95cc3549035f8',
			name: 'changeHeaderStatus',
			execute(context): Promise<void> | undefined {
				return import('@libs/productionplanning/header').then((module) => new module.PpsHeaderWizard().changeHeaderStatus(context));
			}
		},
		{
			uuid: '9065e7dd71ab49eba2b6adc4f4001724', // maybe require another unique wizard uuid, or the related code of platform need to be adjusted
			name: 'changeUpstreamStatus',
			execute(context): Promise<void> | undefined {
				return import('@libs/productionplanning/header').then((module) => new module.PpsHeaderWizard().changeUpstreamStatus(context));
			}
		},
		{
			uuid: '2c2c1621cb2f49d9be279cf430ffc694',
			name: 'Change Status For Project document',
			execute(context) {
				return import('@libs/productionplanning/header').then((module) => new module.PpsHeaderWizard().changeDocumentProjectStatus(context));
			},
		},

	];