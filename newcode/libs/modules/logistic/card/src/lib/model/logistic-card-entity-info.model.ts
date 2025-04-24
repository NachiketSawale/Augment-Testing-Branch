/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { LogisticCardDataService } from '../services/logistic-card-data.service';
import { ILogisticCardEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';
import { LogisticCardValidationService } from '../services/logistic-card-validation.service';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';


export const LOGISTIC_CARD_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticCardEntity>({
	grid: {
		title: {key: 'logistic.card.cardListTitle'},
	},
	form: {
		title: {key: 'logistic.card.cardDetailTitle'},
		containerUuid: 'b3cd04f14e0d4c37a17255d3315f2e0e',
	},
	dataService: ctx => ctx.injector.get(LogisticCardDataService),
	validationService: ctx => ctx.injector.get(LogisticCardValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Card', typeName: 'JobCardDto'},
	permissionUuid: '05fd352d74ef4f5aa179d259e056c367',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['Code', 'Description', 'PlannedStart', 'WorkOperationTypeFk', 'ActualStart', 'ActualFinish', /*'JobFk',*/
					/*'JobCardTemplateFk', 'DispatchHeaderFk', 'JobCardStatusFk','ReservationFk', */ 'Comment', /*'PlantFk', 'ResourceFk', 'RequisitionFk',
				'RubricCategoryFk', */'JobCardAreaFk', 'JobCardGroupFk', 'JobCardPriorityFk', 'BasClerkOwnerFk', 'BasClerkResponsibleFk', 'Meterreading',
					'NotDoneCount' /*'JobPerformingFk'*/],
			}
		],
		// TODO: lookups missing
			overloads: {
				WorkOperationTypeFk: ResourceSharedLookupOverloadProvider.provideResourceWotFilterByPlantLookupOverload(true, 'PlantFk', ''),
				JobCardStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobCardStatusReadonlyLookupOverload(),
				RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryLookupOverload(true),
				JobCardAreaFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobCardAreaLookupOverload(true),
				JobCardPriorityFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobCardPriorityLookupOverload(true),
				JobCardGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobCardGroupLookupOverload(true),
				BasClerkOwnerFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
				BasClerkResponsibleFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					DescriptionInfo: {key: 'entityDescription'},
					RubricCategoryFk: { key: 'entityBasRubricCategoryFk' },
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					JobCardAreaFk: { key: 'jobcardarea' },
					JobCardGroupFk: { key: 'jobcardgroup' },
					JobCardPriorityFk: { key: 'jobcardpriority' },
				}),
				...prefixAllTranslationKeys('logistic.card.', {
					WorkOperationTypeFk: { key: 'workOperationTypeFk' },
					ActualStart: { key: 'actualStart' },
					ActualFinish: { key: 'actualFinish' },
					JobFk: { key: 'entityJob'},
					DispatchHeaderFk: { key: 'dispatchHeader'},
					JobPerformingFk: { key: 'entityJobPerforming'},
					PlannedStart: { key: 'plannedStart'},
					PlannedFinish: { key: 'plannedFinish'},
					Meterreading: { key: 'entityMeterreading'},
					BasClerkResponsibleFk: { key: 'entityBasClerkResponsibleFk'},
					BasClerkOwnerFk: { key: 'entityBasClerkOwnerFk'},
					NotDoneCount: { key: 'entityNotDoneCount'},
					JobCardTemplateFk: { key: 'cardTemplateEntity'},
					ReservationFk: { key: 'entityReservation'},
					PlantFk: { key: 'entityPlant'},
					ResourceFk: { key: 'entityResource'},
					RequisitionFk: { key: 'entityRequisition'},
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					JobCardStatusFk: {key: 'jobcardstatus'},
				}),
			}
	},
} as IEntityInfo<ILogisticCardEntity>);