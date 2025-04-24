import { BasicUserformMainHeaderGridBehavior } from '../../behaviors/userform-list-behavior.service';
import { BasicsUserformMainDataService } from '../../services/userform-main-data.service';
import { EntityInfo } from '@libs/ui/business-base';

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import {
	BasicsSharedRubricCategoryLookupService,
	Rubric,
	BasicsUserformWorkflowTemplateLookupService,
	IBasicUserFormWorkflowTemplateEntity
} from '@libs/basics/shared';
import { IFormEntity } from '../entities/form-entity.interface';
import { ILayoutConfiguration } from '@libs/ui/common';

const moduleName: string = 'basics.userform';

export const USER_FROM_ENTITY_INFO = EntityInfo.create<IFormEntity>({
	grid: {
		title: { text: 'Form list', key: moduleName + '.formListTitle' },
		behavior: (ctx) => ctx.injector.get(BasicUserformMainHeaderGridBehavior),
	},
	form: {
		title: { text: 'Form details', key: moduleName + '.formDetailsTitle' },
		containerUuid: 'fe81871fefa44373839de3d92fef6616'
	},
	dataService: (ctx) => ctx.injector.get(BasicsUserformMainDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.UserForm', typeName: 'FormDto' },
	permissionUuid: '093b912a666811e4b116123b93f75cba',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['Id', 'Sorting', 'RubricFk', 'IsContainer', 'DescriptionInfo', 'ValidFrom',
					'ValidTo', 'WorkflowTemplateFk', 'WindowParameter', 'ContainerUuid']
			}
		],
		overloads: {
			Id: { readonly: true },
			RubricFk: {
				type: FieldType.Lookup,
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRubricCategoryLookupService,
					serverSideFilter: {
						key: 'mdc-material-catalog-rubric-category-filter',
						execute() {
							return 'RubricFk = ' + Rubric.Material;
						}
					}
				})
			},
			WorkflowTemplateFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup<IFormEntity, IBasicUserFormWorkflowTemplateEntity>({
					dataServiceToken: BasicsUserformWorkflowTemplateLookupService,
					showClearButton: true,
					descriptionMember: 'Description'
				})
			}
		},
		labels: {
			...prefixAllTranslationKeys('basics.userform' + '.', {
				Id: { key: 'entityId' },
				IsContainer: { key: 'entityIsContainer' },
				ValidFrom: { key: 'entityValidFrom' },
				ValidTo: { key: 'entityValidTo' },
				WorkflowTemplateFk: { key: 'entityWorkflowTemplateFk' },
				WindowParameter: { key: 'entityWindowParameter' }
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				RubricFk: { key: 'RubricFk' },
				Sorting: { key: 'entitySorting' },
				DescriptionInfo: { key: 'entityDescription' }
			}),
		}
	} as ILayoutConfiguration<IFormEntity>
});