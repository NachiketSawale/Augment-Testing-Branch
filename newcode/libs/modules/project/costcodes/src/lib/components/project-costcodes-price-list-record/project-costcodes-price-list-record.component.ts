import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { ProjectMainDataService } from '@libs/project/shared';
import { GridComponent, IGridConfiguration, IMenuItemsList, ItemType, UiCommonModule } from '@libs/ui/common';
import { ProjectCostcodesPriceListRecordUiStandardService } from '../../services/update-costcodes-price-form-wizard/project-costcodes-price-list-record-ui-standard.service';
import { EntityContainerCommand } from '@libs/ui/business-base';
import { ProjectCostcodesPriceListForJobMessengerService } from '../../services/update-costcodes-price-form-wizard/project-costcodes-price-list-for-job-messenger.service';
import { PrjCostCodesEntity } from '@libs/project/interfaces';

@Component({
	selector: 'project-costcodes-project-costcodes-price-list-record',
	standalone: true,
	imports: [UiCommonModule, GridComponent],
	templateUrl: './project-costcodes-price-list-record.component.html',
})
export class ProjectCostcodesPriceListRecordComponent implements OnInit {
	private readonly entityGridService = inject(ProjectCostcodesPriceListRecordUiStandardService);
	public gridConfig: IGridConfiguration<PrjCostCodesEntity>;
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private projectMainDataService = inject(ProjectMainDataService);
	private readonly messangerService = inject(ProjectCostcodesPriceListForJobMessengerService);
	private data!:PrjCostCodesEntity[];

	public constructor() {
		this.gridConfig = {
			uuid: '80c94a0fb2dc4048b54ca845febf2411',
			columns: this.entityGridService.generateGridConfig(),
			items: [],
			iconClass: null,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
		};
	}

	public ngOnInit() {
		// TODO priceListRecordDynamicColumnService,priceListRecordBasCostCodesColumnService
		// priceListRecordDynamicColumnService.loadDynamicColumns();
		// priceListRecordBasCostCodesColumnService.loadDynamicColumns();
		this.messangerService.data$.subscribe((data) => {
			this.getList(data);
		});
	}

	public getList(data: PrjCostCodesEntity[]) {
		const responce = this.formatDescription(data);
		const items = data.every((item) => item.PriceListForUpdate !== null) ? responce : [];
		this.gridConfig = {
			...this.gridConfig,
			items: items,
		};
		this.data = items;		
	}

	private formatDescription(response: PrjCostCodesEntity[]) {
		response.forEach((i) => {
			if (i.Description === null) {
				i.Description = '';
			}
			if (i.ProjectCostCodes) {
				this.formatDescription(i.ProjectCostCodes);
			}
		});

		return response;
	}

	public get tools(): IMenuItemsList {
		return {
			cssClass: 'tools',
			items: [
				{					
					caption: { key: 'cloud.common.toolbarCollapse' },
					hideItem: false,
					iconClass: 'tlb-icons ico-tree-collapse',
					id: 'collapse',
					fn: () => {
						throw new Error('This method is not implemented');
					},
					sort: 60,
					type: ItemType.Item,
				},
				{
					caption: { key: 'cloud.common.toolbarExpand' },
					hideItem: false,
					iconClass: 'tlb-icons ico-tree-expand',
					id: 'expand',
					fn: () => {
						throw new Error('This method is not implemented');
					},
					sort: 70,
					type: ItemType.Item,
				},

				{
					caption: { key: 'cloud.common.toolbarCollapseAll' },
					hideItem: false,
					iconClass: ' tlb-icons ico-tree-collapse-all',
					id: EntityContainerCommand.CollapseAll,
					fn: () => {
						throw new Error('This method is not implemented');
					},
					sort: 80,
					type: ItemType.Item,
				},
				{
					caption: { key: 'cloud.common.toolbarExpandAll' },
					hideItem: false,
					iconClass: 'tlb-icons ico-tree-expand-all',
					id: EntityContainerCommand.ExpandAll,
					fn: () => {
						throw new Error('This method is not implemented');
					},
					sort: 90,
					type: ItemType.Item,
				},
				{
					type: ItemType.Item,
					caption: { key: 'cloud.common.taskBarSearch', text: 'Search' },
					iconClass: 'tlb-icons ico-search-all',
					id: 'create',
				},
				{
					type: ItemType.Item,
					caption: { key: 'cloud.common.taskBarColumnFilter', text: 'Column Filter' },
					iconClass: 'tlb-icons ico-search-column',
					id: 'delete',
					disabled: () => {
						return false;
					},
				},
				{
					caption: { key: 'cloud.common.exportClipboard' },
					groupId: 'dropdown-btn-t199',
					iconClass: 'tlb-icons ico-clipboard',
					id: EntityContainerCommand.Clipboard,
					sort: 200,
					type: ItemType.DropdownBtn,
					list: {
						cssClass: 'dropdown-menu-right',
						showImages: false,
						showTitles: true,
						items: [
							{
								caption: { key: 'cloud.common.exportArea' },
								id: EntityContainerCommand.CopyCellArea,
								sort: 100,
								type: ItemType.Item,
								fn: () => {
									throw new Error('This method is not implemented');
								},
							},
							{
								caption: { key: 'cloud.common.exportCopy' },
								id: EntityContainerCommand.Copy,
								sort: 200,
								type: ItemType.Item,
								fn: () => {
									throw new Error('This method is not implemented');
								},
							},
							{
								id: EntityContainerCommand.ExportOptions,
								type: ItemType.Sublist,
								sort: 400,
								list: {
									items: [
										{
											caption: { key: 'cloud.common.exportWithHeader' },
											id: EntityContainerCommand.CopyWithHeader,
											sort: 100,
											type: ItemType.Item,
											fn: () => {
												throw new Error('This method is not implemented');
											},
										},
									],
								},
							},
						],
					},
				},
				{
					caption: {
						key: 'cloud.common.gridSettings',
						text: 'Grid Settings',
					},
					iconClass: 'tlb-icons ico-settings',
					isSet: true,
					cssClass: 'tlb-icons ico-settings',
					groupId: 'dropdown-btn-t205',
					hideItem: false,
					id: 't205',
					list: {
						showImages: false,
						showTitles: true,
						cssClass: 'dropdown-menu-right',
						items: [
							{
								id: 't111',
								sort: 112,
								caption: {
									key: 'cloud.common.gridlayout',
								},
								type: ItemType.Item,
							},
							{
								id: 't155',
								sort: 200,
								caption: {
									key: 'cloud.common.showStatusbar',
								},
								type: ItemType.Check,
								value: true,
							},
							{
								id: 't255',
								sort: 200,
								caption: {
									key: 'cloud.common.markReadonlyCells',
								},
								type: ItemType.Check,
								value: true,
							},
						],
					},
					sort: 200,
					type: ItemType.DropdownBtn,
				},
			],
		};
	}

	public setSeletedToAll(selected:boolean) {
		this.data.forEach((item) => {
			item['Selected'] = selected;
		});
	}

	// TODO
	// private removeToolByClass(cssClassArray) {
	// 	$scope.tools.items = _.filter($scope.tools.items, function (toolItem) {
	// 		let notFound = true;
	// 		_.each(cssClassArray, function (CssClass) {
	// 			if (CssClass === toolItem.iconClass) {
	// 				notFound = false;
	// 			}
	// 		});
	// 		return notFound;
	// 	});
	// 	$scope.tools.update();
	// }

	// TODO platformContainerUiAddOnService,basicsCommonHeaderColumnCheckboxControllerService
	// $injector.get('platformContainerUiAddOnService').addManagerAccessor($scope, $element, angular.noop);
	// 		let checkboxFields = ['Selected'];
	// 		let headerCheckBoxEvents = [
	// 			{
	// 				source: 'grid',
	// 				name: 'onHeaderCheckboxChanged',
	// 				fn: function (e) {
	// 					dataService.setSeletedToAll(e.target.checked);
	// 					let parentService = $injector.get('projectCostCodesPriceListForJobDataService');
	// 					messengerService.PriceListRecordSelectedChanged.fire(null, {prjCostCodes: parentService.getSelected()});
	// 				}
	// 			}
	// 		];
	// 		basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, checkboxFields, headerCheckBoxEvents);

	// TODO Dynamic Columns - projectCostCodesPriceListRecordDynColumnService,projectCostCodesPriceListRecordBasCostCodesColumnService
	// function setDynamicColumnsLayoutToGrid(){
	// 	uiService.applyToScope($scope);
	// }
	// uiService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);
	// let priceListRecordDynamicColumnService = $injector.get('projectCostCodesPriceListRecordDynColumnService');
	// priceListRecordDynamicColumnService.loadDynamicColumns();
	// let priceListRecordBasCostCodesColumnService = $injector.get('projectCostCodesPriceListRecordBasCostCodesColumnService');
	// priceListRecordBasCostCodesColumnService.loadDynamicColumns();
}
