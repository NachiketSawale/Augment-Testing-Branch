/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, ISplitGridConfiguration, SplitGridConfigurationToken, SplitGridContainerComponent } from '@libs/ui/business-base';
import { FieldType } from '@libs/ui/common';
import { CheckListGroupTemplateDataService } from '../../services/hsqe-checklist-group-template-data.service';
import { IHsqCheckListGroupEntity, IHsqChkListTemplateEntity } from '@libs/hsqe/interfaces';
import { CheckListTemplateDataService } from '../../services/hsqe-checklist-template-data.service';
import { HsqeChecklistTemplateLayoutService } from '../../services/layouts/hsqe-checklist-template-layout.service';

export const HSQE_CHECKLIST_GROUP_TEMPLATE_ENTITY_INFO = EntityInfo.create<IHsqChkListTemplateEntity>({
	grid: {
		title: { text: 'Check List Template', key: 'hsqe.checklist.header.HsqCheckListTemplate' },
		containerType: SplitGridContainerComponent,
		providers: (ctx) => [
			{
				provide: SplitGridConfigurationToken,
				useValue: <ISplitGridConfiguration<IHsqChkListTemplateEntity, IHsqCheckListGroupEntity>>{
					parent: {
						uuid: '99f11be1deaf4328889ab939663131a3',
						columns: [
							{
								id: 'code',
								model: 'Code',
								type: FieldType.Code,
								label: {
									text: 'Code',
									key: 'cloud.common.entityCode',
								},
								sortable: true,
								visible: true,
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
						dataServiceToken: CheckListGroupTemplateDataService,
						treeConfiguration: {
							parent: function (entity: IHsqCheckListGroupEntity) {
								const service = ctx.injector.get(CheckListGroupTemplateDataService);
								return service.parentOf(entity);
							},
							children: function (entity: IHsqCheckListGroupEntity) {
								const service = ctx.injector.get(CheckListGroupTemplateDataService);
								return service.childrenOf(entity);
							},
							collapsed: true,
						},
					},
					searchServiceToken: CheckListTemplateDataService,
				},
			},
		],
	},
	permissionUuid: '38c695e4561b426da29491a95c08f4b6',
	dataService: (ctx) => ctx.injector.get(CheckListTemplateDataService),
	dtoSchemeId: { moduleSubModule: 'Hsqe.CheckListTemplate', typeName: 'HsqChkListTemplateDto' },
	layoutConfiguration: (context) => {
		return context.injector.get(HsqeChecklistTemplateLayoutService).generateLayout();
	},
});
