/*
 * Copyright(c) RIB Software GmbH
 */
import {
	EntityInfo,
	ISplitGridConfiguration,
	SplitGridConfigurationToken,
	SplitGridContainerComponent
} from '@libs/ui/business-base';
import { IBoqItemSimpleEntity } from '@libs/boq/main';
import { FieldType, IGridTreeConfiguration } from '@libs/ui/common';
import { IWicGroupEntity } from '@libs/boq/wic';
import { EstimateMainWicBoqLayoutService } from './estimate-main-wic-boq-layout.service';
import { EstimateMainWicGroupDataService } from './estimate-main-wic-group-data.service';
import { EstimateMainWicBoqDataService } from './estimate-main-wic-boq-data.service';
import { EstimateMainWicBoqBehaviorService } from './estimate-main-wic-boq-behavior.service';

export const ESTIMATE_MAIN_WIC_BOQ_ENTITY_INFO =  EntityInfo.create<IBoqItemSimpleEntity>({
	grid: {
		title: {
			text: 'estimate.main.wicGroupContainer',
				key: 'estimate.main.wicGroupContainer'
		},
			behavior:(ctx) => ctx.injector.get(EstimateMainWicBoqBehaviorService),
			containerType: SplitGridContainerComponent,
			providers: (ctx) => [
			{
				provide: SplitGridConfigurationToken,
				useValue: <ISplitGridConfiguration<IBoqItemSimpleEntity, IWicGroupEntity>>{
					parent: {
						uuid: 'C6F28F5792C54DFD91409B16FA2E79A1',
						columns: [{
							id: 'description',
							model: 'Code',
							type: FieldType.Code,
							label: {
								text: 'Description',
								key: 'cloud.common.entityDescription'
							},
							width:200,
							sortable: true,
							visible: true,
							readonly: true,
							// formatterOptions: {
							// 	field: 'DescriptionInfo.Translated'
							// }
						}],
						dataServiceToken: EstimateMainWicGroupDataService,
						treeConfiguration: {
							parent: function (entity: IWicGroupEntity) {
								const service = ctx.injector.get(EstimateMainWicGroupDataService);
								return service.parentOf(entity);
							},
							children: function (entity: IWicGroupEntity) {
								const service = ctx.injector.get(EstimateMainWicGroupDataService);
								return service.childrenOf(entity);
							},
						},
					}
				}
			},
		],
			treeConfiguration: ctx => {
			return {
				parent: function (entity: IBoqItemSimpleEntity) {
					const service = ctx.injector.get(EstimateMainWicBoqDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IBoqItemSimpleEntity) {
					const service = ctx.injector.get(EstimateMainWicBoqDataService);
					return service.childrenOf(entity);
				}
			} as IGridTreeConfiguration<IBoqItemSimpleEntity>;
		}
	},
	dataService: ctx => ctx.injector.get(EstimateMainWicBoqDataService),
	dtoSchemeId: {moduleSubModule: 'Boq.Main', typeName: 'BoqItemSimpleDto'},
	permissionUuid: 'C6F28F5792C54DFD91409B16FA2E79A1',
		layoutConfiguration: context => {
		return context.injector.get(EstimateMainWicBoqLayoutService).generateLayout();
	},
});