/*
 * Copyright(c) RIB Software GmbH
 */

import {IGridContainerLink} from '@libs/ui/business-base';
import { IPpsGenericDocumentRevisionEntity } from '../../../model/generic-document/pps-generic-document-revision-entity.interface';
import { DocumentsSharedBehaviorService } from '@libs/documents/shared';

export class PpsGenericDocumentRevisionGridBehavior extends DocumentsSharedBehaviorService<IPpsGenericDocumentRevisionEntity> {

	public override onCreate(containerLink: IGridContainerLink<IPpsGenericDocumentRevisionEntity>): void {
		super.onCreate(containerLink);
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']); // here we remove create/delete buttons because we should not add/delete record on revision container
	}
}