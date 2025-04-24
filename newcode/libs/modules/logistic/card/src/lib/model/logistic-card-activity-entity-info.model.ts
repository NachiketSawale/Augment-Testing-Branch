/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { LogisticCardActivityDataService } from '../services/logistic-card-activity-data.service';
import { ILogisticCardActivityEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { LogisticCardActivityValidationService } from '../services/logistic-card-activity-validation.service';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';


export const LOGISTIC_CARD_ACTIVITY_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticCardActivityEntity>({
	grid: {
		title: {key: 'logistic.card.cardActivityListTitle'},
	},
	form: {
		title: {key: 'logistic.card.cardActivityDetailTitle'},
		containerUuid: 'c3354dae2f434cd183862f01c2bb039b',
	},
	dataService: ctx => ctx.injector.get(LogisticCardActivityDataService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Card', typeName: 'JobCardActivityDto'},
	validationService: ctx => ctx.injector.get(LogisticCardActivityValidationService),
	permissionUuid: '8a2db2fa260e476a8928c2a56791b277',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['Code', 'Description', 'Remark', 'Comment', 'ClerkFk', 'IsDone', 'ActualStartDate', 'ActualStopDate', 'JobCardAreaFk'],
			}
		],
		overloads: {
			JobCardAreaFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobCardAreaLookupOverload(true),
			ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				DescriptionInfo: {key: 'entityDescription'},
				Remark: { key: 'entityRemark' },
			}),
			...prefixAllTranslationKeys('basics.common.', {
				ClerkFk: { key: 'entityClerk', text: 'Clerk' },
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				JobCardAreaFk: { key: 'jobcardarea' },
			}),
			...prefixAllTranslationKeys('logistic.card.', {
				IsDone: { key: 'entityIsDone' },
				ActualStartDate: { key: 'entityActualstartdate'},
				ActualStopDate: { key: 'entityActualstopdate'},

			}),
		}
	},
} as IEntityInfo<ILogisticCardActivityEntity>);