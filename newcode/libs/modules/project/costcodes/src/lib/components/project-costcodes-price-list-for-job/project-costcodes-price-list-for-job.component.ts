import { Component, Injector, OnInit, inject } from '@angular/core';
import { ProjectCostcodesPriceListForJobUiStandardService } from '../../services/update-costcodes-price-form-wizard/project-costcodes-price-list-for-job-ui-standard.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { GridComponent, IGridConfiguration, IMenuItemsList, ItemType, UiCommonModule } from '@libs/ui/common';
import { EntityContainerCommand } from '@libs/ui/business-base';
import { ProjectMainDataService } from '@libs/project/shared';
//import { PROJECT_COST_CODE_DATA_SERVICE_TOKEN } from '../../services/update-costcodes-price-form-wizard/project-costcodes-price-list-for-job-data.service';
import { ProjectCostcodesPriceListForJobMessengerService } from '../../services/update-costcodes-price-form-wizard/project-costcodes-price-list-for-job-messenger.service';
import { PrjCostCodesEntity } from '@libs/project/interfaces';
import { ProjectCostcodesPriceListForJobDataService } from '../../services/update-costcodes-price-form-wizard/project-costcodes-price-list-for-job-data.service';

@Component({
	selector: 'project-costcodes-project-cost-codes-price-list-for-job',
	standalone: true,
	imports: [UiCommonModule, GridComponent],
	templateUrl: './project-costcodes-price-list-for-job.component.html',
})
export class ProjectCostCodesPriceListForJobComponent implements OnInit {
	private readonly entityGridService = inject(ProjectCostcodesPriceListForJobUiStandardService);
	private dataService = inject(ProjectCostcodesPriceListForJobDataService);
	public gridConfig: IGridConfiguration<PrjCostCodesEntity>;
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private projectMainDataService = inject(ProjectMainDataService);
	public projectCostcodesList: PrjCostCodesEntity[] = [];
	private readonly messangerService = inject(ProjectCostcodesPriceListForJobMessengerService);
	public readonly translate = inject(PlatformTranslateService);
	protected inject = inject(Injector);
	
	public constructor() {
		this.translate.load(['basics.costcodes']);

		this.gridConfig = {
			uuid: '3b971ff120df463da2d461da57a33511',
			columns: this.entityGridService.generateGridConfig(),
			items: [],
			iconClass: null,
			skipPermissionCheck: true,
			enableColumnReorder: true,
			enableCopyPasteExcel: false,
			treeConfiguration: {
				parent: () => {
					return null;
				},
				children: (element) => {
					return element.ProjectCostCodes ?? [];
				},
			},
		};
	}

	public ngOnInit() {
		this.getList();
		this.setSeletedToAll(true);
		this.calcAllRealFactors();
		// TODO this.projectJobDynamicColumnService.loadDynamicColumns();
	}

	public getList() {	
		let data: PrjCostCodesEntity[] = [];
		const url = `${this.configService.webApiBaseUrl}project/costcodes/pricelist/getprojectpricelistwithjob`;
		this.http
			.post<PrjCostCodesEntity[]>(url, {
				ProjectId: this.projectMainDataService.getSelection()[0].Id,
				// JobIds = _jobIds;
				// CostCodeIds = _costCodeIds;
			})
			.subscribe((response) => {
				const responce = this.formatDescription(response);
				this.gridConfig = {
					...this.gridConfig,
					items: responce,
				};
				data = responce;
				this.projectCostcodesList = data;
			});
		return data;
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

	public setAllBaseSelected() {
		// TODO ProjectCostCodesPriceListRecordBasCostCodesColumnService has dependency on platform
		// const list = this.getList();
		// let basCostCodesColumnService = inject(ProjectCostCodesPriceListRecordBasCostCodesColumnService);
		// list.forEach((item) => {
		// 	if (Object.prototype.hasOwnProperty.call(item, 'PriceListForUpdate') && Array.isArray(item.PriceListForUpdate)) {
		// 		item.PriceListForUpdate.forEach( (pItem)  => {
		// 			if (pItem.PriceVersionFk === -1) {
		// 				pItem.Selected = true;
		// 				basCostCodesColumnService.attachDataToColumn([pItem]).then(function () {
		// 					this.computePrjCostCodes(item);
		// 				});
		// 			} else {
		// 				pItem.Selected = false;
		// 			}
		// 		});
		// 	}
		// });
	}

	public setSeletedToAll(selected: boolean) {
		// const list = this.getList();
		// list.forEach((item) => {
		// 	item['IsChecked'] = selected;
		// });
	}

	public setFilters(jobIds:[], costCodeIds:number[]) {
		// TODO projectMainUpdatePricesWizardCommonService
		// let selectPrj = projectMainUpdatePricesWizardCommonService.getProject();
		// _projectId = selectPrj ? selectPrj.Id : -1;
		// _jobIds = jobIds || [];
		// _costCodeIds = costCodeIds || [];
	}

	public clearFiltersAndData() {
		// TODO
		// const _projectId = -1;
		// const _jobIds = [];
		// const _costCodeIds = [];
		// this.setList([]);
		// const childService = inject(ProjectCostCodesPriceListRecordDataService);
		// childService.setList([]);
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

	protected onSelectedRowsChanged(selectedItems: PrjCostCodesEntity[]) {
		if (selectedItems.length === 0) {
			return;
		}
		this.messangerService.sendData(selectedItems);
	}

	public changeCostCodePriceVersionByJob(args: PrjCostCodesEntity) {
		if (args && args.Job) {
			this.dataService.setCostCodePriceVersionByJob(args.Job, args.PriceVersionFk ?? 0);
		}
	}

	public changeCostCodePriceVersion(args: PrjCostCodesEntity) {
		if (args && args.ProjectCostCodes) {
			this.dataService.changeCostCodePriceVersion(args, args.PriceVersionFk ?? 0);
		}
	}

	public computePrjCostCodes(args: PrjCostCodesEntity) {
		if (args && args.ProjectCostCodes) {
			this.dataService.computePrjCostCodes(args);
		}
	}

	public calcAllRealFactors() {
		// const list = this.getList();
		// list.forEach((item) => {
		// 	this.calcRealFactors(item, item.NewFactorCosts ?? 0, 'NewFactorCosts');
		// 	this.calcRealFactors(item, item.NewFactorQuantity ?? 0, 'NewFactorQuantity');
		// });
	}

	public calcRealFactors(entity: PrjCostCodesEntity, value: number, model: string) {
		entity[model] = value;
		//const parentId = entity?.['VirtualParentId'] ?? null;
		// const parent = this.getList().find((i) => i.Id === parentId);
		// let prjRealFactor = '',
		// 	newRealFactor = '';
		// const realFactor = 1;
		// if (model === 'NewFactorCosts') {
		// 	prjRealFactor = 'RealFactorCosts';
		// 	newRealFactor = 'NewRealFactorCosts';
		// } else if (model === 'NewFactorQuantity') {
		// 	prjRealFactor = 'RealFactorQuantity';
		// 	newRealFactor = 'NewRealFactorQuantity';
		// }
		// if (parent && prjRealFactor) {
		// 	// realFactor = parent[prjRealFactor] ?? 1;
		// }
		// if (entity['OriginalId'] !== null && newRealFactor) {
		// 	entity[newRealFactor] = entity[model] ?? 0 * realFactor;
		// }
	}

	public updatePrice() {
		// const list = this.getList();
		// const dataToSave = [];
		// const allProjectCostCodes:PrjCostCodesEntity[] = [];
		// TODO const dynamicColumnService = inject(ProjectCostCodesPriceListJobDynColumnService);
		// list.forEach((item) => {
		// 	if (item['isJob']) {
		// 		const checkedProjectCostCodes: PrjCostCodesEntity[] = [];
		// 		const newItem = item;
		// 		// const prjCostCodes = newItem.ProjectCostCodes ?? [];
		// 		// this.dataService.getCheckedProjectCostCodes(prjCostCodes, checkedProjectCostCodes);
		// 		newItem.ProjectCostCodes = checkedProjectCostCodes;
		// 		dataToSave.push(newItem);
		// 		// allProjectCostCodes.push(allProjectCostCodes, checkedProjectCostCodes);
		// 	}
		// });
		// TODO
		// return dynamicColumnService.saveDynamicValues(allProjectCostCodes).then(function () {
		// 	return $http.post(globals.webApiBaseUrl + 'project/costcodes/pricelist/updatepricebypriceversion', convertNullToNum(dataToSave)).then(function (response) {
		// 		return response.data;
		// 	});
		// });
	}

	// TODO
	// public setDynamicColumnsLayoutToGrid(){
	// 	uiStandardService.applyToScope($scope);
	// }
	// uiStandardService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);

	// TODO
	// messengerService.JobPriceVersionSelectedChanged.register(changeCostCodePriceVersionByJob);
	// messengerService.PrjCostCodesPriceVersionSelectedChanged.register(changeCostCodePriceVersion);
	// messengerService.PriceListRecordSelectedChanged.register(computePrjCostCodes);
	// messengerService.PriceListRecordWeightingChanged.register(computePrjCostCodes);
}
