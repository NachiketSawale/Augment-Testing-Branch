/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IDataServiceChildRoleOptions, IEntitySchemaId, ServiceRole } from '@libs/platform/data-access';
import { DocumentDataLeafService } from '@libs/documents/shared';
import { IMtgHeaderEntity, IMtgDocumentEntity } from '@libs/basics/interfaces';
import { BasicsMeetingComplete } from '../model/basics-meeting-complete.class';
import { BasicsMeetingDataService } from './basics-meeting-data.service';
import { BasicsUploadSectionType, BasicsUploadServiceKey } from '@libs/basics/shared';

/**
 * The meeting document data service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsMeetingDocumentDataService extends DocumentDataLeafService<IMtgDocumentEntity, IMtgHeaderEntity, BasicsMeetingComplete> {
	public constructor(private parentService: BasicsMeetingDataService) {
		super(
			{
				apiUrl: 'basics/meeting/document',
				roleInfo: <IDataServiceChildRoleOptions<IMtgDocumentEntity, IMtgHeaderEntity, BasicsMeetingComplete>>{
					role: ServiceRole.Leaf,
					itemName: 'MtgDocument',
					parent: parentService,
				},
				readInfo: {
					endPoint: 'listbyparent',
					usePost: true,
				},
			},
			{
				uploadServiceKey: BasicsUploadServiceKey.Meeting,
				configs: {
					sectionType: BasicsUploadSectionType.Meeting,
				},
			},
		);
	}

	protected override get entitySchemaId(): IEntitySchemaId | undefined {
		return {moduleSubModule: 'Basics.Meeting', typeName: 'MtgDocumentDto'};
	}

	public override IsParentEntityReadonly(): boolean {
		return this.parentService.isItemReadOnly();
	}
}
