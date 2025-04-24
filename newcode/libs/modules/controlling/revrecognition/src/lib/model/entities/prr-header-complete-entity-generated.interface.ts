/*
 * Copyright(c) RIB Software GmbH
 */


import { IPrrHeaderEntity } from './prr-header-entity.interface';
import { IPrrDocumentEntity } from './prr-document-entity.interface';


export interface IPrrHeaderCompleteEntityGenerated {

	/**
	 * MainItemId
	 */
	MainItemId: number;


	/**
	 * PrrHeader
	 */
	PrrHeader?: IPrrHeaderEntity | null;

	/**
	 * PrrDocument
	 */
	PrrDocumentToSave: IPrrDocumentEntity[];

	/**
	 * PrrDocument
	 */
	PrrDocumentToDelete: IPrrDocumentEntity[];
}
