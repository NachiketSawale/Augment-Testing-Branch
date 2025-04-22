/*
 * Copyright(c) RIB Software GmbH
 */

import { ColorFormat, prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldOverloadSpec } from '@libs/ui/common';
import { IHighlightingItemEntity } from './entities/highlighting-item-entity.interface';

export const HL_ITEM_ENTITY_INFO_COMMON = {
	dtoSchemeId: {
		typeName: 'HighlightingItemDto',
		moduleSubModule: 'Model.Administration'
	},
};

export const HL_ITEM_ENTITY_LABELS = prefixAllTranslationKeys('model.administration.', {
	FilterStateFk: { key: 'filterState' },
	ObjectVisibilityFk: { key: 'objectVisibility' },
	Color: { key: 'faceColor' },
	UseObjectColor: { key: 'useObjectColor' },
	Opacity: { key: 'opacity' },
	Selectable: { key: 'selectable' }
});

export const HL_ITEM_ENTITY_OVERLOADS: {
	[key: string]: FieldOverloadSpec<IHighlightingItemEntity>
} = {
	Color: {
		format: ColorFormat.ArgbValue,
		showClearButton: true
	}
};
