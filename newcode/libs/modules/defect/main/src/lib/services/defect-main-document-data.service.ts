/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IDataServiceChildRoleOptions, IEntitySchemaId, ServiceRole } from '@libs/platform/data-access';
import { DocumentDataLeafService } from '@libs/documents/shared';
import { DefectMainComplete } from '../model/defect-main-complete.class';
import { DefectMainHeaderDataService } from './defect-main-header-data.service';
import { IDfmDocumentEntity } from '../model/entities/dfm-document-entity.interface';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { BasicsUploadAction, BasicsUploadSectionType, BasicsUploadServiceKey } from '@libs/basics/shared';

/**
 * The defect document data service
 */
@Injectable({
	providedIn: 'root',
})
export class DefectMainDocumentDataService extends DocumentDataLeafService<IDfmDocumentEntity, IDfmDefectEntity, DefectMainComplete> {
	public constructor(private parentService: DefectMainHeaderDataService) {
		super(
			{
				apiUrl: 'defect/document',
				roleInfo: <IDataServiceChildRoleOptions<IDfmDocumentEntity, IDfmDefectEntity, DefectMainComplete>>{
					role: ServiceRole.Leaf,
					itemName: 'DfmDocuments',
					parent: parentService,
				},
				readInfo: {
					endPoint: 'listbyparent',
					usePost: true,
				},
			},
			{
				uploadServiceKey: BasicsUploadServiceKey.Defect,
				configs: {
					sectionType: BasicsUploadSectionType.Defect,
					action: BasicsUploadAction.UploadWithCompress,
				},
			},
		);
	}

	protected override get entitySchemaId(): IEntitySchemaId | undefined {
		return { moduleSubModule: 'Defect.Main', typeName: 'DfmDocumentDto' };
	}

	public override IsParentEntityReadonly(): boolean {
		return this.parentService.getReadonlyStatus();
	}
}
