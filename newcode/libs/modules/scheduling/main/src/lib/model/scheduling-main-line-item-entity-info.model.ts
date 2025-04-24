import { EntityInfo } from '@libs/ui/business-base';
import { SchedulingMainLineItemProgressDataService } from '../services/scheduling-main-line-item-progress-data.service';
import { ILineItemProgressEntity } from './models';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

export const SCHEDULING_MAIN_LINE_ITEM_PROGRESS_ENTITY_INFO: EntityInfo = EntityInfo.create<ILineItemProgressEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.entityLineItemProgress'},
	},
	form: {
		title: { key: 'scheduling.main' + '.detailLineItemProgressTitle' },
		containerUuid: '7DCAA269EC3F4BAC8059B6C2AF97BAE2',
	},
	dataService: ctx => ctx.injector.get(SchedulingMainLineItemProgressDataService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'LineItemProgressDto'},
	permissionUuid: '5c2a4c1d66c5438981aa934f449e1d4d',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['ActivityCode', 'ActivityDescription', 'LineItemCode', 'LineItemDescription', 'ExternalCode', 'EstimationCode', 'EstimationDescription', 'UoMFk', 'Quantity', 'Work', 'CostTotal', 'PlannedStart', 'PlannedFinish', 'PlannedDuration', 'ProgressReportMethodFk',
				'PCo', 'PeriodQuantityPerformance', 'DueDateQuantityPerformance', 'RemainingLineItemQuantity', 'PeriodWorkPerformance', 'DueDateWorkPerformance', 'RemainingLineItemWork']
			}
		],
		labels: {
			...prefixAllTranslationKeys('scheduling.main.', {
				LineItemCode: {key:'entityLineItem'},
				LineItemDescription:{key:'entityLineItemDesc'},
				ExternalCode: {key:'entityExternalCode'},
				EstimationCode: {key:'entityEstimationHeader'},
				CostTotal: {key:'entityEstimationCostTotal'},
				PlannedStart: {key: 'plannedStart'},
				PlannedFinish: {key: 'plannedFinish'},
				PlannedDuration: {key: 'plannedDuration'},
				ProgressReportMethodFk: {key: 'progressReportMethod'},
				PCo: {key: 'entityPCo'},
				PeriodQuantityPerformance: {key: 'entityPeriodQuantityPerformance'},
				DueDateQuantityPerformance: {key: 'entityDueDateQuantityPerformance'},
				RemainingLineItemQuantity: {key: 'entityRemainingQuantity'},
				PeriodWorkPerformance: {key: 'entityPeriodWorkPerformance'},
				DueDateWorkPerformance: {key: 'entityDueDateWorkPerformance'},
				RemainingLineItemWork: {key: 'entityRemainingWork'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				ActivityCode:{key:'entityCode'},
				ActivityDescription:{ key: 'entityDescription'},
				EstimationDescription: {key:'entityEstimateHeaderDescription'},
				UoMFk: {key:'entityUoM'},
				Work: {key:'sidebarInfoDescription.work'}
			}),
			...prefixAllTranslationKeys('basics.common.', {
				Quantity:{key:'Quantity'}
			})
		},
		overloads:{
			ProgressReportMethodFk: BasicsSharedCustomizeLookupOverloadProvider.provideProgressReportMethodReadonlyLookupOverload(),
			UoMFk: BasicsSharedLookupOverloadProvider.provideUoMReadonlyLookupOverload(),
		}
	}
});