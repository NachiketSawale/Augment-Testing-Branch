/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ResourceTypeRequestedTypeDataService } from '../services/data/resource-type-requested-type-data.service';
import { IRequestedTypeEntity } from '@libs/resource/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

const resourceTypeRequestedEntityInfo = <IEntityInfo<IRequestedTypeEntity>>{
		grid: {
			title: { key: 'resource.type' + '.requestedTypeListTitle' },
		},
		form: {
			title: { key: 'resource.type' + '.requestedTypeDetailTitle' },
			containerUuid: 'f7836fe22b9445e69cd2f881d69fa610',
		},
		dataService: (ctx) =>
			ctx.injector.get(ResourceTypeRequestedTypeDataService),
		dtoSchemeId: {
			moduleSubModule: 'Resource.Type', typeName: 'RequestedTypeDto',
		},

		permissionUuid: '009af8b7d07b48d5879e220f684e207e',
		layoutConfiguration: {
			groups: [
				{
					gid: 'Requested Types Details',
					attributes: [
						 'TypeRequestedFk', 'IsRequestedEntirePeriod', 'Duration', 'NecessaryOperators', 'UomDayFk'],
				},
			],
			overloads: {
				TypeRequestedFk: BasicsSharedLookupOverloadProvider.provideResourceTypeLookupOverload(true),
				UomDayFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			},
			labels: {
				...prefixAllTranslationKeys('resource.type.', {
					TypeRequestedFk: { key: 'entityTypeRequested' },
					IsRequestedEntirePeriod: { key: 'entityIsRequestedEntirePeriod' },
					Duration: { key: 'entityDuration' },
					NecessaryOperators: { key: 'entityNecessaryOperators' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					UomDayFk: { key: 'entityUoM' },
				}),
			},
		},
	};

export const RESOURCE_TYPE_REQUESTED_TYPE_ENTITY_INFO = EntityInfo.create(resourceTypeRequestedEntityInfo);
