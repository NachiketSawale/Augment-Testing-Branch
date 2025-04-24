/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo, ISplitGridConfiguration, SplitGridConfigurationToken, SplitGridContainerComponent } from '@libs/ui/business-base';
import { ICosGlobalParamGroupEntity } from '@libs/constructionsystem/shared';
import { FieldType } from '@libs/ui/common';
import { IInstanceHeaderParameterEntity } from '../entities/instance-header-parameter-entity.interface';
import { ConstructionSystemMainGlobalParameterGroupDataService } from '../../services/construction-system-main-global-parameter-group-data.service';
import { ConstructionSystemMainInstanceHeaderParameterDataService } from '../../services/construction-system-main-instance-header-parameter-data.service';
import { ConstructionSystemMainHeaderParameterListLayoutService } from '../../services/layouts/construction-system-main-header-parameter-list-layout.service';
import { CONSTRUCTION_SYSTEM_MAIN_INSTANCE_HEADER_PARAMETER_GRID_BEHAVIOR_TOKEN } from '../../behaviors/construction-system-main-instance-header-parameter-grid-behavior.service';
import { CONSTRUCTION_SYSTEM_MAIN_INSTANCE_HEADER_PARAMETER_FORM_BEHAVIOR_TOKEN } from '../../behaviors/construction-system-main-instance-header-parameter-form-behavior.service';
import { ConstructionSystemMainInstanceHeaderParameterValidationService } from '../../services/validations/construction-system-main-instance-header-parameter-validation.service';

export const CONSTRUCTION_SYSTEM_MAIN_GLOBAL_PARAMETER_ENTITY_INFO: EntityInfo = EntityInfo.create<IInstanceHeaderParameterEntity>({
	grid: {
		behavior: (ctx) => ctx.injector.get(CONSTRUCTION_SYSTEM_MAIN_INSTANCE_HEADER_PARAMETER_GRID_BEHAVIOR_TOKEN),
		title: { key: 'constructionsystem.main.globalParameterGroupGridContainerTitle' },
		containerType: SplitGridContainerComponent,
		providers: (ctx) => [
			{
				provide: SplitGridConfigurationToken,
				useValue: <ISplitGridConfiguration<IInstanceHeaderParameterEntity, ICosGlobalParamGroupEntity>>{
					parent: {
						uuid: 'fef05077bfc2417f87d6c7f2a6d46218',
						columns: [
							{
								id: 'code',
								model: 'Code',
								type: FieldType.Code,
								label: {
									text: 'Code',
									key: 'cloud.common.entityCode',
								},
								readonly: true,
							},
							{
								id: 'description',
								model: 'DescriptionInfo',
								type: FieldType.Translation,
								label: {
									text: 'Description',
									key: 'cloud.common.entityDescription',
								},
								sortable: true,
								visible: true,
								readonly: true,
							},
						],
						dataServiceToken: ConstructionSystemMainGlobalParameterGroupDataService,
						treeConfiguration: {
							parent: function (entity: ICosGlobalParamGroupEntity) {
								const service = ctx.injector.get(ConstructionSystemMainGlobalParameterGroupDataService);
								return service.parentOf(entity);
							},
							children: function (entity: ICosGlobalParamGroupEntity) {
								const service = ctx.injector.get(ConstructionSystemMainGlobalParameterGroupDataService);
								return service.childrenOf(entity);
							},
						},
					},
					searchServiceToken: ConstructionSystemMainInstanceHeaderParameterDataService,
				},
			},
		],
	},
	form: {
		title: { key: 'constructionsystem.main.instanceHeaderParameterFormContainerTitle' },
		containerUuid: 'ea84e185f04d44138eb829a14f7181af',
		behavior: (ctx) => ctx.injector.get(CONSTRUCTION_SYSTEM_MAIN_INSTANCE_HEADER_PARAMETER_FORM_BEHAVIOR_TOKEN),
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainInstanceHeaderParameterDataService),
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMainInstanceHeaderParameterValidationService),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Main', typeName: 'InstanceHeaderParameterDto' },
	permissionUuid: '962190ed40074f40a687064875cdccbb',
	layoutConfiguration: (context) => {
		return context.injector.get(ConstructionSystemMainHeaderParameterListLayoutService).generateLayout();
	},
});
