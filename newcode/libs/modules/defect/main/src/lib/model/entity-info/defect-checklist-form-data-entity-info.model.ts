/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { DefectChecklistFormDataService } from '../../services/defect-checklist-form-data.service';
import { DefectUserFormLookupService } from '../../services/defect-user-form-lookup.service';
import { DefectChecklistFormDataBehavior } from '../../services/behaviors/defect-checklist-form-data-behavior.service';
import { IHsqCheckList2FormEntity } from '@libs/hsqe/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';

export const DEFECT_CHECKLIST_FORM_DATA_ENTITY_INFO: EntityInfo = EntityInfo.create<IHsqCheckList2FormEntity>({
	grid: {
		title: { key: 'defect.main.checklistFormData' },
		behavior: (ctx) => ctx.injector.get(DefectChecklistFormDataBehavior),
	},

	dataService: (ctx) => ctx.injector.get(DefectChecklistFormDataService),
	dtoSchemeId: { moduleSubModule: 'Hsqe.CheckList', typeName: 'HsqCheckList2FormDto' },
	permissionUuid: '35b2d8affe714402aece9063c41738b0',

	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
				attributes: ['FormFk', 'Code', 'DescriptionInfo'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('hsqe.checklist.', { FormFk: { key: 'form.userForm', text: 'User Form' } }),
			...prefixAllTranslationKeys('cloud.common.', { Code: { key: 'entityCode', text: 'Code' }, DescriptionInfo: { key: 'entityDescription', text: 'Description' } }),
		},
		overloads: {
			FormFk: {
				type: FieldType.Lookup,
				width: 150,
				lookupOptions: createLookup({ dataServiceToken: DefectUserFormLookupService }),
			},
		},
	},
});
