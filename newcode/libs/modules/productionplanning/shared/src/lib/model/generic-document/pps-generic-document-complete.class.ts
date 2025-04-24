/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IPpsGenericDocumentEntity} from './pps-generic-document-entity.interface';
import { IPpsGenericDocumentRevisionEntity} from './pps-generic-document-revision-entity.interface';

export class PpsGenericDocumentComplete implements CompleteIdentification<IPpsGenericDocumentEntity> {

	public MainItemId: number = 0;
	public GenericDocument: IPpsGenericDocumentEntity | null = null;

	public DocumentRevisionToSave: IPpsGenericDocumentRevisionEntity[] | null = [];
	public DocumentRevisionToDelete: IPpsGenericDocumentRevisionEntity[] | null = [];
}
