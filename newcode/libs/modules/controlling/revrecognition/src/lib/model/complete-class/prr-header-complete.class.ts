/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IPrrHeaderEntity } from '../entities/prr-header-entity.interface';
import { IPrrHeaderCompleteEntityGenerated } from '../entities/prr-header-complete-entity-generated.interface';
import { IPrrDocumentEntity } from '../entities/prr-document-entity.interface';

export class PrrHeaderComplete implements CompleteIdentification<IPrrHeaderCompleteEntityGenerated> {
	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;
	/**
	 * PrrHeader
	 */
	public PrrHeader?: IPrrHeaderEntity | null;
	/**
	 * PrrDocument
	 */
	public PrrDocumentToSave: IPrrDocumentEntity[] = [];
	/**
	 * PrrDocument
	 */
	public PrrDocumentToDelete: IPrrDocumentEntity[] = [];

	public constructor(entity: IPrrHeaderEntity | null) {
		if (entity) {
			this.MainItemId = entity.Id;
			this.PrrHeader = entity;
		}
	}
}