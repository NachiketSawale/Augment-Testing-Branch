/*
 * Copyright(c) RIB Software GmbH
 */
import { IGridContainerLink } from '@libs/ui/business-base';
import { IPpsDocumentRevisionEntity } from '../../../model/document/pps-document-revision-entity.interface';
import { DocumentsSharedBehaviorService } from '@libs/documents/shared';

export class PpsDocumentRevisionGridBehavior extends DocumentsSharedBehaviorService<IPpsDocumentRevisionEntity> {

	public override onCreate(containerLink: IGridContainerLink<IPpsDocumentRevisionEntity>): void {
		super.onCreate(containerLink);
		containerLink.uiAddOns.toolbar.deleteItems(['create', 'delete']); // here we remove create/delete buttons because we should not add/delete record on revision container
	}
}