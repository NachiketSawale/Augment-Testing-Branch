/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { ENTITY_DEFAULT_GROUP_ID, ENTITY_HISTORY_GROUP_ID } from './default-entity-ids.model';

/**
 * Provides labels for various standard texts that occur across many entity types.
 */
export const COMMON_ENTITY_LABELS: {
	readonly labels: {
		readonly [key: string]: Translatable
	},
	readonly translationModules: string[]
} = {
	labels: {
		Id: { key: 'cloud.common.entityId' },
		Description: { key: 'cloud.common.entityDescription' },
		DescriptionInfo: { key: 'cloud.common.entityDescription' },
		Code: { key: 'cloud.common.entityCode' },
		Sorting: { key: 'cloud.common.entitySorting' },
		Comment: { key: 'cloud.common.entityComment' },
		CommentInfo: { key: 'cloud.common.entityComment' },
		Remark: { key: 'cloud.common.entityRemark' },
		RemarkInfo: { key: 'cloud.common.entityRemark' },
		IsMandatory: { key: 'cloud.common.entityIsMandatory' },
		IsRequired: { key: 'cloud.common.entityIsRequired' },
		IsLive: { key: 'cloud.common.entityIsLive' },
		IsActive: { key: 'cloud.common.entityIsActive' },
		IsDefault: { key: 'cloud.common.entityIsDefault' },
		Name: { key: 'cloud.common.entityName' },
		Parent: { key: 'cloud.common.entityParent' },
		Group: { key: 'cloud.common.entityGroup' },
		baseGroup: { key: 'cloud.common.entityProperties' },
		[ENTITY_DEFAULT_GROUP_ID]: { key: 'cloud.common.entityProperties' },
		[ENTITY_HISTORY_GROUP_ID]: { key: 'cloud.common.entityHistory' },
		InsertedAt: { key: 'cloud.common.entityInsertedAt' },
		InsertedBy: { key: 'cloud.common.entityInsertedBy' },
		UpdatedAt: { key: 'cloud.common.entityUpdatedAt' },
		UpdatedBy: { key: 'cloud.common.entityUpdatedBy' },
		Version: { key: 'cloud.common.entityVersion' },
	},
	translationModules: [
		'cloud.common'
	]
};
