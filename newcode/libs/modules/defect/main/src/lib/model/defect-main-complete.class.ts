/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { IDfmDocumentEntity } from './entities/dfm-document-entity.interface';
import { IDfmPhotoEntity } from './entities/dfm-photo-entity.interface';

export class DefectMainComplete implements CompleteIdentification<IDfmDefectEntity> {
	public MainItemId: number = 0;

	/**
	 * Defect
	 */
	public DfmDefect?: IDfmDefectEntity[] | null = [];

	public DfmDocumentsToSave: IDfmDocumentEntity[] | null = [];
	public DfmDocumentsToDelete: IDfmDocumentEntity[] | null = [];

	public DfmPhotoToSave: IDfmPhotoEntity[] | null = [];
	public DfmPhotoToDelete: IDfmPhotoEntity[] | null = [];

	public constructor(e: IDfmDefectEntity | null) {
		if (e != null) {
			this.MainItemId = e.Id;
			this.DfmDefect = [e];
		}
	}
}
