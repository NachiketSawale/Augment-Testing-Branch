/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialScopeDataService } from './basics-material-scope-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsMaterialScopeLayoutService } from './basics-material-scope-layout.service';
import { mergeLayout } from '@libs/basics/shared';
import { BasicsMaterialScopeValidationService } from './basics-material-scope-validation.service';
import { IMaterialScopeEntity } from '@libs/basics/interfaces';

export const BASICS_MATERIAL_SCOPE_ENTITY_INFO = EntityInfo.create<IMaterialScopeEntity>({
	grid: {
		title: {text: 'Variant', key: 'basics.material.scope.listTitle'}
	},
	form: {
		containerUuid: '51b0ba93b767989c8829cb4c9cc3a099',
		title: {text: 'Variant Detail', key: 'basics.material.scope.formTitle'},
	},
	dataService: ctx => ctx.injector.get(BasicsMaterialScopeDataService),
	validationService: context => context.injector.get(BasicsMaterialScopeValidationService),
	permissionUuid: '34b38ef093254e26bd13cbe2c7a27c3c',
	dtoSchemeId: {moduleSubModule: 'Basics.Material', typeName: 'MaterialScopeDto'},
	layoutConfiguration: async context => {
		return mergeLayout(await context.injector.get(BasicsMaterialScopeLayoutService).generateLayout(), {
			groups: [
				{
					gid: 'basicData',
					attributes: ['IsLive']
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'IsLive': {
						key: 'entityIsLive',
						text: 'Active'
					}
				})
			}
		});
	}
});