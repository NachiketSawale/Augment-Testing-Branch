/*
 * Copyright(c) RIB Software GmbH
 */

import { ACCESS_SCOPE_UI_HELPER_TOKEN } from '@libs/basics/interfaces';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IHighlightingSchemeEntity } from './entities/highlighting-scheme-entity.interface';
import { ENTITY_DEFAULT_GROUP_ID } from '@libs/ui/business-base';
import { ColorFormat, IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';

export const HL_SCHEME_ENTITY_INFO_COMMON = {
	dtoSchemeId: {
		typeName: 'HighlightingSchemeDto',
		moduleSubModule: 'Model.Administration'
	},
	layoutConfiguration: async (ctx: IInitializationContext) => {
		const accessScopeUiHelper = await ctx.lazyInjector.inject(ACCESS_SCOPE_UI_HELPER_TOKEN);

		return <ILayoutConfiguration<IHighlightingSchemeEntity>>{
			groups: [{
				gid: ENTITY_DEFAULT_GROUP_ID,
				attributes: ['DescriptionInfo', 'scopeLevel', 'BackgroundColor', 'SelectionColor']
			}],
			overloads: {
				scopeLevel: {
					type: FieldType.Select,
					itemsSource: {
						items: accessScopeUiHelper.createSelectItems(false)
					}
				},
				BackgroundColor: {
					format: ColorFormat.ArgbValue,
					showClearButton: true
				},
				SelectionColor: {
					format: ColorFormat.ArgbValue,
					showClearButton: true
				}
			},
			labels: {
				...prefixAllTranslationKeys('model.administration.', {
					scopeLevel: { key: 'scope' },
					BackgroundColor: { key: 'bgColor' },
					SelectionColor: { key: 'selColor' }
				})
			}
		};
	}
};
