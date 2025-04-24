/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IPpsDocumentEntity} from './pps-document-entity.interface';
import { IPpsDocumentRevisionEntity} from './pps-document-revision-entity.interface';

export class PpsDocumentComplete implements CompleteIdentification<IPpsDocumentEntity> {

	public MainItemId: number = 0;
	public PpsDocument: IPpsDocumentEntity | null = null;

	public RevisionToSave: IPpsDocumentRevisionEntity[] | null = [];
	public RevisionToDelete: IPpsDocumentRevisionEntity[] | null = [];
}
