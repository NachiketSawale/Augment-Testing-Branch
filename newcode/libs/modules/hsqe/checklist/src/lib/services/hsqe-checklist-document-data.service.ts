/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IDataServiceChildRoleOptions, IEntitySchemaId, ServiceRole } from '@libs/platform/data-access';
import { DocumentDataLeafService } from '@libs/documents/shared';
import { HsqeChecklistDataService } from './hsqe-checklist-data.service';
import { CheckListComplete, IHsqCheckListDocumentEntity, IHsqCheckListEntity } from '@libs/hsqe/interfaces';
import { BasicsUploadAction, BasicsUploadSectionType, BasicsUploadServiceKey } from '@libs/basics/shared';

/**
 * Checklist document data service
 */
@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistDocumentDataService extends DocumentDataLeafService<IHsqCheckListDocumentEntity, IHsqCheckListEntity, CheckListComplete> {
	public constructor(private parentService: HsqeChecklistDataService) {
		super(
			{
				apiUrl: 'hsqe/checklist/document',
				roleInfo: <IDataServiceChildRoleOptions<IHsqCheckListDocumentEntity, IHsqCheckListEntity, CheckListComplete>>{
					role: ServiceRole.Leaf,
					itemName: 'Document',
					parent: parentService,
				},
				readInfo: {
					endPoint: 'listbyparent',
					usePost: true,
				},
			},
			{
				uploadServiceKey: BasicsUploadServiceKey.CheckList,
				configs: {
					sectionType: BasicsUploadSectionType.CheckList,
					action: BasicsUploadAction.UploadWithCompress,
				},
				checkDuplicate: {
					checkClientSide: true,
					checkServerSide: true,
				},
			},
		);
	}

	protected override get entitySchemaId(): IEntitySchemaId | undefined {
		return { moduleSubModule: 'Hsqe.CheckList', typeName: 'HsqCheckListDocumentDto' };
	}

	public override IsParentEntityReadonly(): boolean {
		return this.parentService.isReadonlyStatus();
	}

	public override canUploadAndCreateDocs() {
		if (!this.parentService.isSameContext()) {
			return false;
		}
		return super.canUploadAndCreateDocs();
	}

	public override canUploadForSelected() {
		if (!this.parentService.isSameContext()) {
			return false;
		}
		return super.canUploadForSelected();
	}
}
