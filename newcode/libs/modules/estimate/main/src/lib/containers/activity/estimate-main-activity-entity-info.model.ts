/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EstimateMainActivityDataService } from './estimate-main-activity-data.service';
import { EstimateMainActivityBehavior } from './estimate-main-activity-behavior.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, IGridTreeConfiguration } from '@libs/ui/common';
import { IEstActivities } from '../../model/interfaces/estimate-main-activities.interface';

/**
 * Provides basic information about the container
 */
export const ESTIMATE_MAIN_ACTIVITY_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstActivities>({
	grid: {
		title: { key: 'estimate.main.activityContainer' },
		behavior: () => new EstimateMainActivityBehavior(),
		treeConfiguration: (ctx) => {
			return {
				rootEntities: () => {
					const service = ctx.injector.get(EstimateMainActivityDataService);
					const data =  service.getList();
					return data;
				},
				parent: function (entity: IEstActivities) {
					const service = ctx.injector.get(EstimateMainActivityDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IEstActivities) {
					const service = ctx.injector.get(EstimateMainActivityDataService);
					return service.childrenOf(entity);
				},
			} as unknown as IGridTreeConfiguration<IEstActivities>;
		},
	},

	dataService: (ctx) => ctx.injector.get(EstimateMainActivityDataService),
	dtoSchemeId: { moduleSubModule: 'Scheduling.Main', typeName: 'ActivityDto' },
	permissionUuid: 'F423A7DAA8CD474385097AF443F3C73F',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['Code', 'Description', 'Quantity', 'QuantityUoMFk', 'Rule', 'Param', 'LocationFk', 'PlannedStart', 'PlannedFinish', 'PlannedDuration', 'SCurveFk', 'PercentageCompletion'],
			},
			{
				gid: 'userDefTextGroup',
				attributes: ['UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05', 'UserDefinedText06', 'UserDefinedText07', 'UserDefinedText08', 'UserDefinedText09', 'UserDefinedText10']
			}
		],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Code: { key: 'entityCode' },
				Description: { key: 'entityDescription' },
				Quantity: { key: 'entityQuantity' },
				QuantityUoMFk: { key: 'entityUoM' },
				UserDefinedText01: {
					key: 'entityUserDefText',
					params: { p_0: '1' }
				},
				UserDefinedText02: {
					key: 'entityUserDefText',
					params: { p_0: '2' }
				},
				UserDefinedText03: {
					key: 'entityUserDefText',
					params: { p_0: '3' }
				},
				UserDefinedText04: {
					key: 'entityUserDefText',
					params: { p_0: '4' }
				},
				UserDefinedText05: {
					key: 'entityUserDefText',
					params: { p_0: '5' }
				},
				UserDefinedText06: {
					key: 'entityUserDefText',
					params: { p_0: '6' },
				},
				UserDefinedText07: {
					key: 'entityUserDefText',
					params: { p_0: '7' }
				},
				UserDefinedText08: {
					key: 'entityUserDefText',
					params: { p_0: '8' }
				},
				UserDefinedText09: {
					key: 'entityUserDefText',
					params: { p_0: '9' }
				},
				UserDefinedText10: {
					key: 'entityUserDefText',
					params: { p_0: '10' }
				},
			}),
			...prefixAllTranslationKeys('scheduling.main.', {
				LocationFk: { key: 'location' },
				PlannedStart: { key: 'plannedStart' },
				PlannedFinish: { key: 'plannedFinish' },
				PlannedDuration: { key: 'plannedDuration' },
				SCurveFk: { key: 'activitySCurve' },
				PercentageCompletion: { key: 'entityMeasuredPerformance' },
			}),
			...prefixAllTranslationKeys('estimate.rule.', {
				Rule: { key: 'rules' },
			}),
			...prefixAllTranslationKeys('estimate.parameter.', {
				Param: { key: 'params'}
			})
		},
        // TODO - Rule and Param Lookups are not ready
        transientFields: [{
			id: 'Rule',
			model: 'Rule',
			type: FieldType.Lookup,
			readonly: false
		},{
			id: 'Param',
			model: 'Param',
			type: FieldType.Lookup,
			readonly: false
		}]
	},
});
