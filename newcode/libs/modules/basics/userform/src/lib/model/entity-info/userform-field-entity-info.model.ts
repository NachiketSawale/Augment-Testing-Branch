/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicUserformFieldHeaderGridBehavior } from '../../behaviors/userform-field-list-behavior.service';
import { BasicsUserformFieldDataService } from '../../services/userform-field-data.service';
import { EntityInfo } from '@libs/ui/business-base';

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import {
	BasicsUserformRubricDataSourceLookupService,
	IBasicUserFormRubricDataSourceEntity,
	BasicsUserformLookupQualifierLookupService,
	IBasicUserFormLookupQualifierEntity,
	BasicsUserFormFieldTypeLookupService,
	IBasicUserFormFieldTypeEntity,
	BasicsUserFormProcessingTypeLookupService,
	IBasicUserFormProcessingTypeEntity
} from '@libs/basics/shared';
import { BasicsUserformMainDataService } from '../../services/userform-main-data.service';
import { IFormFieldEntity } from '../entities/form-field-entity.interface';


const moduleName: string = 'basics.userform';

export const USER_FROM_FIELD_ENTITY_INFO = EntityInfo.create<IFormFieldEntity>({
	grid: {
		title: { text: 'Field list', key: moduleName + '.formFieldListTitle' },
		behavior: (ctx) => ctx.injector.get(BasicUserformFieldHeaderGridBehavior),
	},
	dataService: (ctx) => ctx.injector.get(BasicsUserformFieldDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.UserForm', typeName: 'FormFieldDto' },
	permissionUuid: '19e14eb86a4e11e4b116123b93f75cba',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['Id', 'FieldName', 'VisibleName', 'FieldType', 'ProcessingType', 'DataSource',
					'SqlQuery', 'LookupQualifier']
			}
		],
		overloads: {
			Id: { readonly: true },
			DataSource: {
				type: FieldType.Lookup,
				lookupOptions: createLookup<IFormFieldEntity, IBasicUserFormRubricDataSourceEntity>({
					dataServiceToken: BasicsUserformRubricDataSourceLookupService,
					showClearButton: true,
					descriptionMember: 'Description',
					serverSideFilter:
					{
						key: '',
						execute(context: ILookupContext<IBasicUserFormRubricDataSourceEntity, IFormFieldEntity>) {
							return {
								RubricId: context.injector.get(BasicsUserformMainDataService).getSelection()[0].RubricFk
							};
						}
					}
				})
			},
			LookupQualifier: {
				type: FieldType.Lookup,
				lookupOptions: createLookup<IFormFieldEntity, IBasicUserFormLookupQualifierEntity>({
					dataServiceToken: BasicsUserformLookupQualifierLookupService,
					showClearButton: true,
					descriptionMember: 'Description'
				})
			},
			FieldType: {
				type: FieldType.Lookup,
				lookupOptions: createLookup<IFormFieldEntity, IBasicUserFormFieldTypeEntity>({
					dataServiceToken: BasicsUserFormFieldTypeLookupService,
					showClearButton: true,
					descriptionMember: 'Description'
				})
			},
			ProcessingType: {
				type: FieldType.Lookup,
				lookupOptions: createLookup<IFormFieldEntity, IBasicUserFormProcessingTypeEntity>({
					dataServiceToken: BasicsUserFormProcessingTypeLookupService,
					showClearButton: true,
					descriptionMember: 'Description'
				})
			}
		},
		labels: {
			...prefixAllTranslationKeys('basics.userform' + '.', {
				Id: { key: 'entityId' },
				FieldName: { key: 'entityFieldName' },
				VisibleName: { key: 'entityVisibleName' },
				FieldType: { key: 'entityFieldType' },
				ProcessingType: { key: 'entityProcessingType' },
				DataSource: { key: 'entityDataSource' },
				SqlQuery: { key: 'entitySqlQuery' },
				LookupQualifier: { key: 'entityLookupQualifier' }
			})
		}
	} as ILayoutConfiguration<IFormFieldEntity>,
});