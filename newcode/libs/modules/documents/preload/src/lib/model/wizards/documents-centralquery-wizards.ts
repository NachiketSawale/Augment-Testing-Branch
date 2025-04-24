/*
 * Copyright(c) RIB Software GmbH
 */

import { IWizard, IInitializationContext } from '@libs/platform/common';

export const DOCUMENT_CENTER_QUERY_WIZARDS: IWizard[] = [
	{
		uuid: '1951cfa8f4e4425aa5a2c1e4d93b2089',
		name: 'Change Status',
		description: 'Change Status.',
		execute: async (context: IInitializationContext) => {
			const module = await import('@libs/documents/centralquery');
			return new module.DocumentCentralQueryWizard().changeDocumentProjectStatus(context);
		},
	},
	{
		uuid: '1db192a34c234076a849a955ed787e51',
		name: 'Synchronize BIM 360 documents to RIB 4.0',
		description: 'Synchronize BIM 360 documents to RIB 4.0',
		execute: async (context: IInitializationContext) => {
			const module = await import('@libs/documents/centralquery');
			return new module.DocumentCentralQueryWizard().syncBim360Document(context);
		},
	},
	{
		uuid: 'c6d1233e576e45f4bfa81e582152858c',
		name: 'Synchronize RIB 4.0 documents to BIM 360',
		description: 'Synchronize RIB 4.0 documents to BIM 360',
		execute: async (context: IInitializationContext) => {
			const module = await import('@libs/documents/centralquery');
			return new module.DocumentCentralQueryWizard().syncDocument2Bim360(context);
		},
	},
];
