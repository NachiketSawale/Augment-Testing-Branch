/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { DocumentComplete, DocumentDataLeafService, DocumentProjectDataRootService, IDocumentProjectEntity, IDocumentRevisionEntity } from '@libs/documents/shared';

/**
 * The document project revision data service
 */
@Injectable({
	providedIn: 'root',
})
export class DocumentsMainRevisionDataService extends DocumentDataLeafService<IDocumentRevisionEntity, IDocumentProjectEntity, DocumentComplete> {
	public constructor(protected parentService: DocumentProjectDataRootService<object>) {
		super({
			apiUrl: 'documentsproject/revision/final',
			roleInfo: <IDataServiceChildRoleOptions<IDocumentRevisionEntity, IDocumentProjectEntity, DocumentComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'DocumentRevision',
				parent: parentService,
			},
			createInfo: {
				prepareParam: (ident) => {
					return {
						MainItemId: ident.pKey1!,
					};
				},
			},
			readInfo: {
				endPoint: 'list',
				prepareParam: (ident) => {
					return {
						MainItemId: ident.pKey1!,
					};
				},
			},
			entityActions:{
				createSupported:false,
				deleteSupported:false
			}
		});
	}

	public getParentService(): DocumentProjectDataRootService<object> {
		return this.parentService;
	}
}
