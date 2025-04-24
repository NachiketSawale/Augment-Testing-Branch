/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo, ISplitGridConfiguration, SplitGridConfigurationToken, SplitGridContainerComponent } from '@libs/ui/business-base';
import { ConstructionSystemMainHeaderListDataService } from '../../services/construction-system-main-header-list-data.service';
import { ConstructionSystemSharedHeaderLayoutService, ConstructionSystemSharedTemplateLookupService, ICosGroupEntity, ICosHeaderEntity, ICosTemplateEntity } from '@libs/constructionsystem/shared';
import { createLookup, FieldType, LookupEvent } from '@libs/ui/common';
import { ConstructionSystemMainHeaderGroupDataService } from '../../services/construction-system-main-header-group-data.service';
import { ConstructionSystemMainHeaderValidationService } from '../../services/validations/construction-system-main-header-validation.service';

export const CONSTRUCTION_SYSTEM_MAIN_HEADER_LIST_ENTITY_INFO: EntityInfo = EntityInfo.create<ICosHeaderEntity>({
	grid: {
		title: { key: 'constructionsystem.master.headerGridContainerTitle' },
		containerType: SplitGridContainerComponent,
		providers: (ctx) => [
			{
				provide: SplitGridConfigurationToken,
				useValue: <ISplitGridConfiguration<ICosHeaderEntity, ICosGroupEntity>>{
					parent: {
						uuid: 'fef05077bfc2417f87d6c7f2a6d46218',
						columns: [
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
						],
						dataServiceToken: ConstructionSystemMainHeaderGroupDataService,
						treeConfiguration: {
							parent: function (entity: ICosGroupEntity) {
								const service = ctx.injector.get(ConstructionSystemMainHeaderGroupDataService);
								return service.parentOf(entity);
							},
							children: function (entity: ICosGroupEntity) {
								const service = ctx.injector.get(ConstructionSystemMainHeaderGroupDataService);
								return service.childrenOf(entity);
							},
						},
					},
					searchServiceToken: ConstructionSystemMainHeaderListDataService,
				},
			},
		],
	},
	dataService: (ctx) => ctx.injector.get(ConstructionSystemMainHeaderListDataService),
	dtoSchemeId: { moduleSubModule: 'ConstructionSystem.Master', typeName: 'CosHeaderDto' },
	permissionUuid: 'f740181acaf54db8ad5fd19fc8aef02b',
	validationService: (ctx) => ctx.injector.get(ConstructionSystemMainHeaderValidationService),
	prepareEntityContainer: (ctx) => {
		ctx.injector.get(ConstructionSystemMainHeaderGroupDataService).refreshAll().then();
	},
	layoutConfiguration: (context) => {
		const layout = context.injector.get(ConstructionSystemSharedHeaderLayoutService).generateLayout();
		const basicsGroup = layout?.groups?.find((e) => e.gid === 'basicData');
		if (basicsGroup) {
			basicsGroup?.attributes.push('IsChecked');
			basicsGroup?.attributes.push('CosTemplateFk');
		}
		layout.transientFields = [
			{
				id: 'IsChecked',
				model: 'IsChecked',
				label: { key: 'cloud.common.entityChecked', text: 'Checked' },
				type: FieldType.Boolean,
			},
			{
				///todo seems doesnot show in grid
				id: 'costemplatefk',
				model: 'CosTemplateFk',
				label: { key: 'constructionsystem.master.entityTemplateFk', text: 'Template' },
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ConstructionSystemSharedTemplateLookupService,
					clientSideFilter: {
						execute(item, context): boolean {
							const current = context.entity as ICosHeaderEntity;
							if (current) {
								return item.CosHeaderFk === current.Id;
							}
							return false;
						},
					},
					events: [
						{
							name: 'onSelectedItemChanged',
							handler: (e) => {
								const dataService = context.injector.get(ConstructionSystemMainHeaderListDataService);
								const event = e as LookupEvent<ICosTemplateEntity, ICosHeaderEntity>;
								const selectedItem = event.selectedItem as ICosTemplateEntity;
								const header = event.context.entity;
								if (selectedItem) {
									dataService.saveSelectedTemplate(header?.Id ?? null, selectedItem.Id);
								} else {
									dataService.saveSelectedTemplate(header?.Id ?? null, null);
								}
							},
						},
					],
				}),
			},
		];
		return layout;
	},
});
// todo navigator on code
// todo onHeaderCheckboxChanged
