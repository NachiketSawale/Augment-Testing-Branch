/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IDocumentEntity } from './entities/document-entity.interface';

export class SalesContractDocumentComplete implements CompleteIdentification<IDocumentEntity>{

	public Id: number = 0;
	public DocumentToSave: IDocumentEntity[] | null = [];
}