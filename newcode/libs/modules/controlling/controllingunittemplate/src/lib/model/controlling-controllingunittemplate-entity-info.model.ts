
/*
* Copyright(c) RIB Software GmbH
*/

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingControllingunittemplateDataService } from '../services/controlling-controllingunittemplate-data.service';
import { ControllingControllingunittemplateBehavior } from '../behaviors/controlling-controllingunittemplate-behavior.service';
import { IControltemplateEntity } from './entities/controltemplate-entity.interface';

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsCompanyLookupService } from '@libs/basics/shared';
import { FieldType, createLookup } from '@libs/ui/common';


export const CONTROLLING_CONTROLLINGUNITTEMPLATE_ENTITY_INFO: EntityInfo = EntityInfo.create<IControltemplateEntity>({
	grid: {
		title: { key: 'controllingunittemplateListTitle' },
		behavior: ctx => ctx.injector.get(ControllingControllingunittemplateBehavior),
	},
	form: {
		title: { key: 'controlling.controllingunittemplate' + '.controllingunittemplateDetailTitle' },
		containerUuid: 'a16785bd94a8441f9f4e6fb5798a7112',
	},
	dataService: ctx => ctx.injector.get(ControllingControllingunittemplateDataService),
	dtoSchemeId: { moduleSubModule: 'Controlling.ControllingUnitTemplate', typeName: 'ControltemplateDto' },
	permissionUuid: '201b468b575042a090e366d830c5a60d',

	layoutConfiguration: {
		groups: [
			{ gid: 'Basic Data', attributes: ['Code', 'DescriptionInfo', 'IsDefault', 'IsLive', 'BasCompanyFk'] },
		],
		overloads: {
			Code: { label: { text: 'Code', key: 'Code' }, visible: true },
			DescriptionInfo: { label: { text: 'Description info', key: 'DescriptionInfo' }, visible: true },
			IsDefault: { readonly: false },
			IsLive: { readonly: true },
			BasCompanyFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyLookupService,
				})
			}
			//BasCompanyFk: BasicsSharedCustomizeLookupOverloadProvider.provideCompanyTypeLookupOverload(true),
			//MdcContextFk: BasicsSharedCustomizeLookupOverloadProvider.providemdcCnt(false, true),

		},
		labels: {
			...prefixAllTranslationKeys('controlling.controllingunittemplate.', {
				MdcContextFk: { key: 'entityMdcContext' }, // TODO: replace with existing translation
			}),
			...prefixAllTranslationKeys('basics.company.', {
				BasCompanyFk: { key: 'entityBasCompanyFk' },
			}),
		},
	}

});