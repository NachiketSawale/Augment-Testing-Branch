/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ENTITY_DEFAULT_GROUP_ID } from '@libs/ui/business-base';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IModelEntity } from './entities/model-entity.interface';

export const MODEL_LAYOUT_CONFIGURATION: ILayoutConfiguration<IModelEntity> = {
	groups: [
		{
			gid: ENTITY_DEFAULT_GROUP_ID,
			attributes: ['Code', 'IsComposite', 'Description', 'ProjectFk', 'LodFk', 'TypeFk', 'CommentText', 'Remark', 'DocumentTypeFk']
		},
		{
			gid: 'modelLifecycleGroup',
			attributes: ['StatusFk', 'IsLive', 'ModelVersion', 'ModelRevision']
		},
		{
			gid: 'linkageGroup',
			attributes: ['ScheduleFk', 'EstimateHeaderFk']
		},
		{
			gid: 'expiryGroup',
			attributes: ['ExpiryDate', 'ExpiryDays']
		}
	],
	overloads: {
		IsComposite: {
			readonly: true
		},
		IsLive: {
			readonly: true
		},
		// TODO: StatusFk lookup
		LodFk: BasicsSharedCustomizeLookupOverloadProvider.provideModelLevelOfDevelopmentLookupOverload(false),
		TypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideModelTypeLookupOverload(false),
		// TODO: ProjectFk lookup
		// TODO: ScheduleFk lookup
		// TODO: EstimateHeaderFk lookup
		DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(false)
	},
	labels: {
		...prefixAllTranslationKeys('model.project.', {
			modelLifecycleGroup: 'modelLifecycleGroup',
			linkageGroup: 'linkageGroup',
			expiryGroup: 'expiryGroup',
			IsComposite: 'isComposite',
			ProjectFk: 'entityProjectNo',
			LodFk: 'entityLod',
			DocumentTypeFk: 'modelDocType',
			ScheduleFk: 'entitySchedule',
			EstimateHeaderFk: 'entityHeader',
			ExpiryDate: 'expiryDate',
			ExpiryDays: 'expiryDays'
		}),
		TypeFk: {key: 'cloud.common.entityType'}
	}
};
