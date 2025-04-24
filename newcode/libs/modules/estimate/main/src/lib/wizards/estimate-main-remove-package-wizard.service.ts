/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FieldType, IEditorDialogResult, IFormConfig, IGridConfiguration, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { firstValueFrom, map, Observable } from 'rxjs';
import { IPrcItemAssignmentEntity } from '../model/entities/common/estimate-main-prc-item-assignment-entity.interface';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { IEstMainPrcPackageDeleteDataEntity } from '../model/interfaces/estimate-main-prc-package-delete-data.interface';
import { EstimateMainScopeSelectionWizardService } from './estimate-main-scope-selection.service';
import { IPrcPackageEntity } from '../model/entities/common/estimate-main-prc-package-entity.interface';
import { EstimateMainRemovePackageResourcesDialogService } from './estimate-main-remove-package-resource-dialog.service';
import { EstimateMainResourceService } from '../containers/resource/estimate-main-resource-data.service';
import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';

@Injectable({ providedIn: 'root' })

/**
 *  Estimate main remove package wizard
 *  This services for provides functionality of remove packages
 */
export class EstimateMainRemovePackageWizardService extends EstimateMainScopeSelectionWizardService {
	private readonly configService = inject(PlatformConfigurationService);
	public override formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private endPoint: string = 'procurement/package/package/getprcitemassignmentsandpackages';
	private endPointRmvPkg: string = 'estimate/main/lineitem/removeprcpackage';
	private estimateMainService = inject(EstimateMainService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly estimateMainRemovePackageResourcesDialogService = inject(EstimateMainRemovePackageResourcesDialogService);
	private readonly estimateMainResourceService = inject(EstimateMainResourceService);
	private http = ServiceLocator.injector.get(HttpClient);
	// private removePackageDetailService: unknown; // todo
	// private removePackageResourcesDialogService: unknown; // todo
	private dataList: IPrcPackageEntity[] = [];
	private flag: boolean = true; // to conditionally open package resources grid 
	private isProtectContractedPackageOption: boolean = false; // to protect contracted packages

	/**
	 * defaultItem for IEstMainPrcPackageDeleteDataEntity interface
	 */
	private defaultItem: IEstMainPrcPackageDeleteDataEntity = {
		EstHeaderFk: 0,
		SelectedLevel: '',
		PrjProjectFk: 0,
		IsLineItems: true,
		IsResources: true,
		EstLineItems: [],
		NotMatchingEstLineItems: [],
		EstResources: [],
		PrcPackages: [],
		PackageResources: [],
		IsGeneratePrc: false,
		IsDisablePrc: false,
		IsChecked: false
	};

	/**
	 * isWizardOpen for wizard open state
	 */
	public isWizardOpen: boolean = false;

	/**
	 * estimateScope for estimate scope level
	 */
	private estimateScope: number = 0;

	/**
	 * Displays a dialog.
	 * @returns Result of the dialog.
	 */
	public async removePackage() {

		this.isWizardOpen = true;

		const estScope = parseInt(this.defaultItem.SelectedLevel);

		await firstValueFrom(this.setDataList(this.isWizardOpen, estScope));

		const result = await this.formDialogService
			.showDialog<IEstMainPrcPackageDeleteDataEntity>({
				id: 'removePackage',
				headerText: this.getDialogTitle(),
				formConfiguration: this.prepareFormConfig<IEstMainPrcPackageDeleteDataEntity>(),
				entity: this.defaultItem,
				runtime: undefined,
				customButtons: [],
				topDescription: '',
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleOk(result);
				}
			});

		return result;
	}

	/**
	 * Prepares the form configuration for the specified entity.
	 * @returns The form configuration.
	 */
	public override prepareFormConfig<TEntity extends object>(): IFormConfig<TEntity> {

		//const isPackageChecked = this.defaultItem.PrcPackages.some(packageItem => packageItem.IsChecked);

		const formConfig: IFormConfig<TEntity> = {
			formId: 'estimate.main.removePackage',
			showGrouping: true,
			groups: [
				{
					groupId: 'baseGroup',
					header: { key: 'estimate.rule.removePackageWizard.groupTitle1' },
					open: true,
				},
				{
					groupId: 'AdditionalSettings',
					header: { key: 'estimate.rule.removePackageWizard.groupTitle4' },
					open: true,
				},
				{
					groupId: 'selectPackages',
					header: { key: 'estimate.rule.removePackageWizard.groupTitle2' },
					open: true,
				},
				...(this.flag ? [{ // isPackageChecked ? true : false (Show only if any package is checked)
					groupId: 'selectPackageResources',
					header: { key: 'estimate.rule.removePackageWizard.groupTitle3' },
					open: true,
					visible: true,
				}] : []),
			],

			rows: [
				{
					groupId: 'baseGroup',
					id: 'radio',
					label: { key: 'estimate.main.selectUpdateScope' },
					type: FieldType.Radio,
					model: 'SelectedLevel',
					itemsSource: {
						items: [
							{
								id: this.ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.value,
								displayName: this.ESTIMATE_SCOPE.RESULT_SET.label,
							},
							{
								id: this.ESTIMATE_SCOPE.RESULT_SET.value,
								displayName: { key: this.ESTIMATE_SCOPE.RESULT_SET.label },
							},

							{
								id: this.ESTIMATE_SCOPE.ALL_ESTIMATE.value,
								displayName: { key: this.ESTIMATE_SCOPE.ALL_ESTIMATE.label }
							}
						]
					}
				},

				{
					groupId: 'AdditionalSettings',
					id: 'GeneratePrckage',
					label: {
						key: 'estimate.main.removePackageGeneratePrc',
					},
					type: FieldType.Boolean,
					model: 'IsGeneratePrc',
					sortOrder: 1
				},
				{
					groupId: 'AdditionalSettings',
					id: 'DisablePrc',
					label: {
						key: 'estimate.main.removePackageDisablePrc',
					},
					type: FieldType.Boolean,
					model: 'IsDisablePrc',

					sortOrder: 2
				},
				{
					groupId: 'selectPackages',
					id: 'grid-1',
					model: 'PrcPackages',
					required: false,
					type: FieldType.Grid,
					configuration: this.gridConfigPrcPackages as IGridConfiguration<object>,
					height: 100,
					sortOrder: 3,
					readonly: false
				},
				{
					groupId: 'selectPackageResources',
					id: 'selectPackageResources',
					model: 'PackageResources',
					required: false,
					type: FieldType.Grid,
					configuration: this.gridConfigPackageResources as IGridConfiguration<object>,
					sortOrder: 4,
					visible: false
				}
			]
		};

		return formConfig;
	}

	/**
	 * Grid configuration for PrcPackageEntity
	 */
	private gridConfigPrcPackages: IGridConfiguration<IPrcPackageEntity> = {
		uuid: '6f1b4d78935942dd8ba8a0f1d1568018',
		skipPermissionCheck: true,
		columns: [
			{
				id: 'isChecked',
				model: 'IsChecked',
				sortable: true,
				label: { text: 'estimate.main.generateProjectBoQsWizard.select' },
				type: FieldType.Boolean,
				required: true,
				searchable: true,
				tooltip: { text: 'Select' },
				width: 65,
				visible: true,
				cssClass: '',
				keyboard: {
					enter: true,
					tab: true,
				},
				pinned: false
				// change: (info: IFieldValueChangeInfo<IPrcPackageEntity>) => {
				// 	if (info.newValue === false) {
				// 		this.flag = true; // isPackageChecked
				// 	} else {
				// 		this.flag = false;
				// 	}
				// }
			},
			{
				id: 'code',
				model: 'Code',
				sortable: true,
				label: { text: 'cloud.common.entityCode' },
				type: FieldType.Description,
				readonly: false,
				searchable: true,
				tooltip: { text: 'Code' },
				width: 200,
				visible: true
			},
			{
				id: 'desc',
				model: 'Description',
				sortable: true,
				label: { text: 'cloud.common.entityDescription' },
				type: FieldType.Description,
				readonly: true,
				searchable: true,
				tooltip: { text: 'Description' },
				width: 275,
				visible: true
			}
		],

	};

	/**
	 * Grid configuration for PackageResources
	 */
	public gridConfigPackageResources: IGridConfiguration<IEstMainPrcPackageDeleteDataEntity> = {
		uuid: '2107d90077744e53a2491037639a8487',
		skipPermissionCheck: true,
		columns: [
			{
				id: 'isChecked',
				model: 'IsChecked',
				sortable: true,
				label: { text: 'estimate.main.generateProjectBoQsWizard.select' },
				type: FieldType.Boolean,
				required: true,
				searchable: true,
				tooltip: { text: 'Select' },
				width: 65,
				visible: true,
				cssClass: '',
				keyboard: {
					enter: true,
					tab: true,
				},
				pinned: false,
				sortOrder: 1
			},
			{
				id: 'code',
				model: 'Code',
				sortable: true,
				label: { text: 'cloud.common.entityCode' },
				type: FieldType.Description,
				readonly: false,
				searchable: true,
				tooltip: { text: 'Code' },
				width: 120,
				visible: true,
				sortOrder: 2
			},
			{
				id: 'desc',
				model: 'Description',
				sortable: true,
				label: { text: 'cloud.common.entityDescription' },
				type: FieldType.Description,
				readonly: true,
				searchable: true,
				tooltip: { text: 'Description' },
				width: 90,
				visible: true,
				sortOrder: 3
			},
			{
				id: 'PackageAssignments',
				model: 'PackageAssignments',
				sortable: true,
				label: { text: 'estimate.main.createMaterialPackageWizard.procurementPackage' },
				type: FieldType.Description,
				readonly: true,
				searchable: true,
				tooltip: { text: 'PackageAssignments' },
				width: 90,
				visible: true,
				sortOrder: 4
			},
			{
				id: 'estLineItemCode',
				model: 'EstLineItemCode',
				sortable: true,
				label: { text: 'estimate.main.aiWizard.lineItemCode' },
				type: FieldType.Code,
				readonly: true,
				searchable: true,
				tooltip: { text: 'LineItem Code' },
				width: 120,
				visible: true,
				sortOrder: 5
			},
			{
				id: 'BusinessPartner',
				model: 'BusinessPartner',
				sortable: true,
				label: { text: 'estimate.main.createMaterialPackageWizard.businessPartner' },
				type: FieldType.Description,
				readonly: true,
				searchable: true,
				tooltip: { text: 'Business Partner' },
				width: 120,
				visible: true,
				sortOrder: 6
			},
			{
				id: 'CommentText',
				model: 'CommentText',
				sortable: true,
				label: { text: 'estimate.main.Comment' },
				type: FieldType.Comment,
				readonly: true,
				searchable: true,
				tooltip: { text: 'Comment' },
				width: 90,
				visible: true,
				sortOrder: 7
			},
			{
				id: 'DescriptionInfo1',
				model: 'DescriptionInfo1',
				sortable: true,
				label: { text: 'estimate.main.descriptionInfo1' },
				type: FieldType.Translation,
				readonly: true,
				searchable: true,
				tooltip: { text: 'Additional Description' },
				width: 120,
				visible: true,
				sortOrder: 8
			},

		]

	};

	/**
	 * setDataList for fetching data from API
	 * @param isWizardOpen 
	 * @param selectedScope 
	 * @returns 
	 */
	private setDataList(isWizardOpen: boolean, selectedScope: number): Observable<PrcItemPackageResponse[]> {
		if (isWizardOpen) {
			this.dataList = [];
		}

		const selectedLineItemIds: number[] = [];
		const currentEntity = this.estimateMainService.getSelectedEntity();
		if (currentEntity?.EstLineItemFk) {
			selectedLineItemIds.push(currentEntity.EstLineItemFk);
		}

		const selectedEntities =
			selectedScope === 2
				? this.estimateMainService.getSelection()
				: selectedScope === 1
					? this.estimateMainService.getList()
					: [];

		if (selectedEntities?.length > 0) {
			selectedEntities.forEach(entity => {
				if (entity.EstLineItemFk) {
					selectedLineItemIds.push(entity.EstLineItemFk);
				}
			});
		}

		const requestData = {
			estHeaderId: this.estimateMainService.getSelection().map((item) => item.EstHeaderFk),
			selectedLineItemIds: selectedLineItemIds,
		};

		return this.http
			.post<PrcItemPackageResponse[]>(
				`${this.configService.webApiBaseUrl}${this.endPoint}`,
				requestData
			)
			// this.uncheckContractedPackages(response.item1);
			.pipe(
				map((response: PrcItemPackageResponse[]) => {
					if (response?.length > 0) {
						response.forEach((respData: PrcItemPackageResponse) => {
							this.processResponseData(respData.Item1);
						});
					}

					this.defaultItem.PrcPackages = this.dataList;
					this.estimateMainRemovePackageResourcesDialogService.setIsLoading(false);
					this.estimateMainRemovePackageResourcesDialogService.setDataList(isWizardOpen, this.dataList, 1);
					this.defaultItem.PackageResources = this.estimateMainRemovePackageResourcesDialogService.getDataItem();

					return response;
				})
			);
	}

	/**
	 * Process response data
	 * @param items 
	 */
	private processResponseData(items: IPrcPackageEntity[]) {
		if (this.dataList) {
			items.forEach((packageItem: IPrcPackageEntity) => {
				const existingItem = this.dataList.find(item => item.Id === packageItem.Id);
				if (existingItem) {
					//packageItem.IsChecked = packageItem.IsContracted ? false : existingItem.IsChecked;
				}
			});
		}

		this.addItems(items);
	}

	/**
	 * addItems for adding items to dataList
	 * @param items 
	 */
	private addItems(items: IPrcPackageEntity[]) {
		this.dataList.push(...items);
	}

	/**
	 * Sets header to wizard.
	 * @returns The header text.
	 */
	public getDialogTitle(): string {
		return 'estimate.main.removePackage';
	}

	/**
	 * Ok button functionality.
	 * @param result The result of the dialog.
	 */
	private async handleOk(result: IEditorDialogResult<IEstMainPrcPackageDeleteDataEntity>): Promise<void> {

		if (!result || !result.value) {
			return;
		}
		this.removePackageFrmItems();

		// if ((parseInt(result.value.SelectedLevel) === 1 || parseInt(result.value.SelectedLevel) === 2) && this.estimateMainService.getIfSelectedIdElse() <= 0) {
		// 	return;
		// }

		// let selectedAssemblies = this.estimateMainDissolveAssemblyWizardDetailService.getDissolveAssemblies();
		// let selectedAssemblyIds = [];
		// _.forEach(selectedAssemblies, function (item) {
		// 	selectedAssemblyIds.push(item.Id);
		// });
		// if (result.data.estimateScope === 2) {
		// 	postData.EstLineItems = estimateMainService.getSelectedEntities();
		// } else if (result.data.estimateScope === 1) {
		// 	postData.EstLineItems = estimateMainService.getList();
		// }	

	}

	/**
	 * getPostData for getting post data
	 * @param result 
	 * @returns 
	 */
	private getPostData(result: IEstMainPrcPackageDeleteDataEntity): IPostData {
		return {
			EstHeaderFk: this.estimateMainContextService.getSelectedEstHeaderId(),
			ProjectId: this.estimateMainContextService.getSelectedProjectId(),
			SelectedLevel: this.getEstimateScope(),
			SelectedItemId: this.getIfSelectedIdElse(-1),
			EstLineItemIds: this.estimateMainService.getSelection().map((entity) => entity.Id),
			EstResource: this.estimateMainResourceService.getSelection().map((entity) => entity.Id),
			IsLineItems: result.IsLineItems,
			IsResources: result.IsResources,
			PrcPackages: result.PrcPackages.map((packageItem) => packageItem.Id),
			PackageResources: result.PackageResources,
			IsGeneratePrc: result.IsGeneratePrc,
			IsDisablePrc: result.IsDisablePrc,
		};
	}

	/**
	 * removePackageFrmItems for removing package from items
	 * @returns 
	 */
	private removePackageFrmItems() {
		const postData = this.getPostData(this.defaultItem); // Assuming defaultItem is properly defined

		return this.http.post<IRemovePackageResponse>(
			`${this.configService.webApiBaseUrl}${this.endPointRmvPkg}`,
			postData
		).subscribe({
			next: (response) => {
				// Now, TypeScript knows `response.EstLineItems` exists
				if (response && response.EstLineItems) {
					//const lineItems = response.EstLineItems;
					//this.estimateMainService.addList(lineItems);
					//this.estimateMainService.refresh();
					//this.estimateMainService.fireListLoaded();

					this.estimateMainService.select(null).then(() => {
						const list = this.estimateMainService.getList();
						const selected = list.find((item) => item.Id === postData.SelectedItemId) || null;
						this.estimateMainService.select(selected);
					});
				}
			}
		});
	}

	/**
	 * getIfSelectedIdElse for getting selected id else
	 * @param elseValue 
	 * @returns 
	 */
	private getIfSelectedIdElse(elseValue: number): number {
		const sel = this.estimateMainService.getSelectedEntity();
		return sel?.Id ?? elseValue;
	}

	/**
	 * getEstimateScope for getting estimate scope
	 * @returns 
	 */
	private getEstimateScope(): string {
		if (this.estimateScope === 1 || this.estimateScope === 2) {
			return 'SelectedLineItems';
		} else {
			return 'AllItems';
		}
	}

	/**
	 * uncheckContractedPackages for unchecking contracted packages
	 * @param list 
	 */
	private uncheckContractedPackages(list: IPrcPackageEntity[]): void {
		if (this.isProtectContractedPackageOption) {
			// let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
			// forEach(list, (item: IPrcPackageEntity) => {
			// 	// let pakStatus = basicsLookupdataLookupDescriptorService.getData('PackageStatus');
			// 	let status = find(pakStatus, { Id: item.StatusFk });
			// 	if (status.IsContracted) {
			// 		item.IsChecked = true;
			// 		item.IsContracted = !item.IsContracted;
			// 		//platformRuntimeDataService.readonly(item, [{ field: 'IsChecked', readonly: true }]);
			// 	}
			// 	else {
			// 		let prcItem = find(list[0].item2, { PrcPackageFk: item.Id, IsContracted: true });
			// 		if (prcItem) {
			// 			item.IsChecked = !item.IsContracted;
			// 			item.IsContracted = true;
			// 			//platformRuntimeDataService.readonly(item, [{ field: 'IsChecked', readonly: true }]);
			// 		}
			// 	}
			// });
		}
	}

	/**
	 * updateOnHeaderCheckBoxChange for updating on header checkbox change
	 */
	private updateOnHeaderCheckBoxChange(): void {
		this.dataList = this.dataList ? this.dataList : [];
		this.uncheckContractedPackages(this.dataList);

		if (this.isProtectContractedPackageOption) {
			this.defaultItem.PrcPackages = this.dataList;
			this.refresh();
		}
	}

	/**
	 * refresh for refreshing the grid by updating the data list
	 */
	private refresh(): void {
		const updatedDataList = [...this.dataList];
		this.addItems(updatedDataList);
	}

	/**
	 * getPackageResourcesToRemove for getting package resources to remove
	 */
	private getPackagesToRemove(): IPrcPackageEntity[] {
		if (this.dataList && this.dataList.length > 0) {
			return this.dataList.filter((item: IPrcPackageEntity) => {
				return item.IsChecked && item.IsContracted;
			});
		}
		return [];
	}
}


interface PrcItemPackageResponse {
	Item1: IPrcPackageEntity[];
	Item2: IPrcItemAssignmentEntity[];
}

interface IRemovePackageResponse {
	EstLineItems: IEstLineItemEntity[];
}

interface IPostData {
	EstHeaderFk: number;
	ProjectId: number;
	SelectedLevel: string;
	SelectedItemId: number;
	EstLineItemIds: number[];
	EstResource: number[];
	IsLineItems: boolean;
	IsResources: boolean;
	PrcPackages: number[];
	PackageResources: IEstResourceEntity[];
	IsGeneratePrc: boolean;
	IsDisablePrc: boolean;
}