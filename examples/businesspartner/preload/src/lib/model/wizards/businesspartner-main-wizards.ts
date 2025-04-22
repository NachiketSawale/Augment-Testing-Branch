/*
 * Copyright(c) RIB Software GmbH
 */
import { IInitializationContext, IWizard } from '@libs/platform/common';
/**
 * business Partner main wizards.
 */
export const BUSINESSPARTNER_MAIN_WIZARDS: IWizard[] =
	[
		{
			uuid: '6b38f8558c5b4e82bb200cf32b1b4906',
			name: 'Change Status For Project document',
			description: 'Change Status For Project document.',
			execute(context: IInitializationContext) {
				return import('@libs/businesspartner/main').then((module) => {
					module.BusinessPartnerMainChangeStatusForProjectDocumentService.execute(context);
				});
			},
		},
    ];