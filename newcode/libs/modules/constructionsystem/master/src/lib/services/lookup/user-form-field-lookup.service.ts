/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EmptyError, firstValueFrom } from 'rxjs';
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { BasicsUserFormProcessingTypeLookupService } from '@libs/basics/shared';
import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

interface IUserformFieldEntity extends IEntityBase, IEntityIdentification {
	FormFk: number;
	FieldName?: string;
	VisibleName?: string;
	FieldType: number;
	ProcessingType: number;
	DataSource?: string;
	SqlQuery?: string;
	LookupQualifier?: string;
	ProcessingTypeDescription?: string;
}

/**
 * Basics User Form Field Lookup Service
 */
@Injectable({
	providedIn: 'root',
})
export class UserFormFieldLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IUserformFieldEntity, TEntity> {
	private readonly processingTypeLookup = inject(BasicsUserFormProcessingTypeLookupService);

	/**
	 * constructor
	 */
	public constructor() {
		super('UserFormField', {
			uuid: '1329f351edde4b78afc28f58ab5166fc',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'FieldName',
			showDialog: false,
			gridConfig: {
				columns: [
					{
						type: FieldType.Description,
						id: 'FieldName',
						model: 'FieldName',
						label: { text: 'Field Name', key: 'basics.userform.entityFieldName' },
						width: 100,
						sortable: true,
						visible: true,
					},
					{
						type: FieldType.Description,
						id: 'VisibleName',
						model: 'VisibleName',
						label: { text: 'Visible Name', key: 'basics.userform.entityVisibleName' },
						width: 100,
						sortable: true,
						visible: true,
					},
					{
						type: FieldType.Description,
						id: 'ProcessingTypeDescription',
						model: 'ProcessingTypeDescription',
						label: { text: 'Processing Type', key: 'basics.userform.entityProcessingType' },
						width: 150,
						sortable: true,
						visible: true,
					},
				],
			},
		});

		this.dataProcessors.push({ processItem: this.processItem });
	}

	private processItem: (item: IUserformFieldEntity) => void = async (item) => {
		try {
			const processingTypeEntity = await firstValueFrom(this.processingTypeLookup.getItemByKey({ id: item.ProcessingType }));
			item.ProcessingTypeDescription = processingTypeEntity.Description;
		} catch (error) {
			if (error instanceof EmptyError) {
				item.ProcessingTypeDescription = 'IN/OUT'; // todo:not supported in userForm module now , latter may be change.
			}
		}
	};
}
