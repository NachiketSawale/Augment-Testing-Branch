/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IDocumentEntity } from '@libs/sales/interfaces';

export class SalesContractDocumentComplete implements CompleteIdentification<IDocumentEntity>{

	public Id: number = 0;
	public DocumentToSave: IDocumentEntity[] | null = [];
}