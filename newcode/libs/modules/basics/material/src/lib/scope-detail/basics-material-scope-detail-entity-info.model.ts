/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialScopeDetailDataService } from './basics-material-scope-detail-data.service';
import {
	BasicsSharedPlainTextContainerComponent,
	IPlainTextAccessor, PLAIN_TEXT_ACCESSOR,
} from '@libs/basics/shared';
import { BasicsMaterialScopeDetailLayoutService } from './basics-material-scope-detail-layout.service';
import { BasicsMaterialScopeDetailValidationService } from './basics-material-scope-detail-validation.service';
import { IMaterialScopeDetailEntity } from '@libs/basics/interfaces';


export const BASICS_MATERIAL_SCOPE_DETAIL_ENTITY_INFO = EntityInfo.create<IMaterialScopeDetailEntity>({
	grid: {
		title: { text: 'Scope of Supply', key: 'basics.material.scopeDetail.listTitle' }
	},
	form: {
		containerUuid: '18e3f417bc0fc27fb773a4dfba3f397c',
		title: { text: 'Variant Detail', key: 'basics.material.scopeDetail.formTitle' },
	},
	dataService: ctx => ctx.injector.get(BasicsMaterialScopeDetailDataService),
	validationService: context => context.injector.get(BasicsMaterialScopeDetailValidationService),
	permissionUuid: '65ff8ab73a2c8430e6aedeac3682b30a',
	dtoSchemeId: { moduleSubModule: 'Basics.Material', typeName: 'MaterialScopeDetailDto' },
	layoutConfiguration: ctx => ctx.injector.get(BasicsMaterialScopeDetailLayoutService<IMaterialScopeDetailEntity>).generateLayout(),
	additionalEntityContainers: [
		{
			uuid: '4ab4e56b8b89f8d679aa1fccf2798a0e',
			permission: 'f044708c79c2dbd9fd00612e3195bea0',
			title: 'basics.material.scopeDetail.itemPlainTextTitle',
			containerType: BasicsSharedPlainTextContainerComponent,
			providers: [
				{
					provide: PLAIN_TEXT_ACCESSOR,
					useValue: <IPlainTextAccessor<IMaterialScopeDetailEntity>>{
						getText(entity: IMaterialScopeDetailEntity): string | undefined {
							return entity.SpecificationInfo?.Translated;
						},
						setText(entity: IMaterialScopeDetailEntity, value?: string) {
							if (!entity.SpecificationInfo) {
								entity.SpecificationInfo = {
									Translated: '',
									Modified: false,
									Description: '',
									DescriptionTr: 0,
									DescriptionModified: false,
									VersionTr: 0,
									OtherLanguages: null,
								};
							}
							entity.SpecificationInfo.Translated = value || '';
							entity.SpecificationInfo.Modified = true;

						}
					}
				}
			]
		}
	]
});