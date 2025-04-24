/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { LogisticCardActivityClerkDataService } from '../services/logistic-card-activity-clerk-data.service';
import { ILogisticCardActClerkEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { LogisticCardActivityClerkValidationService } from '../services/logistic-card-activity-clerk-validation.service';


export const LOGISTIC_CARD_ACTIVITY_CLERK_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticCardActClerkEntity>({
	grid: {
		title: {key: 'logistic.card.cardActivityClerkListTitle'},
	},
	form: {
		title: {key: 'logistic.card.cardActivityClerkDetailTitle'},
		containerUuid: 'B51C43904B6E4FD8A1A40DBD2830D47D',
	},
	dataService: ctx => ctx.injector.get(LogisticCardActivityClerkDataService),
	validationService: ctx => ctx.injector.get(LogisticCardActivityClerkValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Card', typeName: 'JobCardActClerkDto'},
	permissionUuid: 'ecc6bbcf8be84e5e84e6ed2b2a2497a7',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['ClerkFk', 'Start', 'Finish'],
			}
		],
		overloads: {
			ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('logistic.card.', {
				Start: { key: 'start'},
				Finish: { key: 'finish'},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				ClerkFk: {key: 'entityClerk'}
			}),
		}
	},
} as IEntityInfo<ILogisticCardActClerkEntity>);