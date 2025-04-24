/*
 * Copyright(c) RIB Software GmbH
 */

import { ControllingGeneralContractorCostHeaderDataService } from '../services/controlling-general-contractor-cost-header-data.service';
import { inject, Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColumnDef, createLookup, FieldType, GridApiService, IGridApi, IGridDialog, IGridDialogOptions, IMenuItemEventInfo, ItemType, StandardDialogButtonId, UiCommonGridDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { IGccBudgetShiftEntity } from '../model/entities/gcc-budget-shift-entity.interface';
import { clone, forEach,find } from 'lodash';
import { BasicsShareControllingUnitLookupService, IControllingUnitEntity } from '@libs/basics/shared';
import { ValidationResult } from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})
export class GeneralContractorCreateBudgetShiftDialogService {
	private readonly parentService: ControllingGeneralContractorCostHeaderDataService = inject(ControllingGeneralContractorCostHeaderDataService);
	private readonly http = inject(HttpClient);
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly injector = inject(Injector);
	private costControlDataService = inject(ControllingGeneralContractorCostHeaderDataService);
	private gridApi?: IGridApi<IGccBudgetShiftEntity> | null;
	private gridGuid = '81D7FE4E05D543BBA5E8C99C95C3414B';

	public async onStartWizard() {
		const  parent = this.parentService.getSelectedEntity();
		if(!parent){
			await this.messageBoxService.showMsgBox('controlling.generalcontractor.NoControlingUnit', 'controlling.generalcontractor.GenerateBudgetShiftTitle', 'ico-info', 'message', false);
			return;
		}

		//TODO: let projectContext = _.find (cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
		const projectId = 1008170;
		const searchData = {
			ProjectId: projectId, // projectContext ? projectContext.id : -1,
			FixRateCheckType: 1
		};

		return this.http.post(this.configService.webApiBaseUrl + 'controlling/generalcontractor/budgetshiftcontroller/getbudgetshiftwizardstatus', searchData).subscribe(res=>{
			if(res && 'noGCCOrderSetting' in res && (res.noGCCOrderSetting as boolean) === true){
				this.messageBoxService.showMsgBox('controlling.generalcontractor.noGCCOrderSetting', 'controlling.generalcontractor.GenerateBudgetShiftTitle', 'ico-info', 'message', false);
				return;
			}

			if(res && 'isExistEstimateHeaderByProject' in res && (res.isExistEstimateHeaderByProject as boolean) === false){
				this.messageBoxService.showMsgBox('controlling.generalcontractor.NonexistentGCEstimateHeader', 'controlling.generalcontractor.GenerateBudgetShiftTitle', 'ico-info', 'message', false);
				return;
			}

			if(res && 'IsReadOnly' in res && (res.IsReadOnly as boolean) === true){
				this.messageBoxService.showMsgBox('controlling.generalcontractor.estHeaderIsReadOnly', 'controlling.generalcontractor.GenerateBudgetShiftTitle', 'ico-info', 'message', false);
				return;
			}

			const items = this.defaultList();
			if(res && 'Code' in res){
				forEach(items, item=> {
					item.Code = res.Code as string;
				});
			}

			const gridDialogData: IGridDialogOptions<IGccBudgetShiftEntity> = {
				headerText: 'controlling.generalcontractor.GenerateBudgetShiftTitle',
				width: '1100px',
				windowClass: 'grid-dialog',
				gridConfig:{
					uuid: this.gridGuid,
					columns: this.getColumns(),
					showSearchPanel: false,
					skipPermissionCheck: true,
					idProperty: 'Id'
				},
				items: items,
				selectedItems: [],
				buttons: [
					{
						id: StandardDialogButtonId.Ok,
						caption: {key: 'cloud.common.ok'},
						isDisabled: (info) => {
							const dialog = info.dialog.items as IGccBudgetShiftEntity[];
							return dialog.length <= 1;
						},
						autoClose: true
					},
					{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}}
				],
				resizeable: true,
				tools: {
					cssClass: 'tools',
					showImages: true,
					showTitles: false,
					isVisible: true,
					activeValue: '',
					overflow: false,
					iconClass: '',
					layoutChangeable: false,
					items: [
						{
							id: 'z1',
							sort: 10,
							type: ItemType.Item,
							caption: 'platform.wysiwygEditor.settings.toolAddRecord',
							iconClass: 'tlb-icons ico-rec-new',
							fn: (info: IMenuItemEventInfo<IGridDialog<IGccBudgetShiftEntity>>) => {
								this.createNewItem();
							},
						},
						{
							id: 'z2',
							sort: 20,
							caption: 'platform.wysiwygEditor.settings.toolDeleteRecord',
							iconClass: 'tlb-icons ico-rec-delete',
							type: ItemType.Item,
							fn: (info: IMenuItemEventInfo<IGridDialog<IGccBudgetShiftEntity>>) => {
								this.deleteItem();
							},
						},
					],
				}
			};

			this.gridDialogService.show(gridDialogData)?.then(result => {
				// $scope.isLoading = true;
				if(result.closingButtonId === StandardDialogButtonId.Ok){
					const items = this.gridApi?.items || [];
					forEach(items, item => {
						if(item.SorurceType && item.ShiftBudget > 0){
							item.ShiftBudget = 0-item.ShiftBudget;
						}
					});
					const data = {
						ProjectId : searchData.ProjectId,
						BudgetShiftItemDtos: items
					};

					return this.http.post(this.configService.webApiBaseUrl + 'controlling/generalcontractor/budgetshiftcontroller/createbudgetshift', data).subscribe(response =>{
						if(response){
							if('Error' in response && response.Error && response.Error as string !== ''){
								this.messageBoxService.showMsgBox(response.Error as string, 'controlling.generalcontractor.GenerateBudgetShiftTitle', 'ico-info', 'message', false);
							}else if('Warning' in response && response.Warning && response.Warning as string !== ''){
								this.messageBoxService.showMsgBox(response.Warning as string, 'controlling.generalcontractor.GenerateBudgetShiftTitle', 'ico-info', 'message', false);
							}else{
								this.costControlDataService.refreshAll();
							}
						}

						// $scope.isLoading = false;
						return true;
					});
				}
				return result;
			});
		});

	}

	private emptyObj = {
		Id: 0,
		Code:'',
		SourceOrTarget: 'Target',
		Description: '',
		Comment: '',
		MdcCounitTargetFk: null,
		PackageBudget: 0,
		BudgetInPackNSub:0,
		AvaiBudget: 0,
		ShiftBudget: 0,
		TotalBudget: 0,
		SorurceType:false,
		__rt$data: {
			errors: {
				MdcCounitTargetFk: {error: this.generateEmptyCUError()},
				Description: {error: this.generateEmptyDescError()}
			},
			readonly: [
				{field: 'Description', readonly: true},
				{field: 'Code', readonly: true}
			]
		}
	};

	private defaultList(){
		const costControl = this.parentService.getSelectedEntity();
		if(!costControl){
			return [];
		}
		const totalBudgetShift = costControl.Budget;
		const source: IGccBudgetShiftEntity =
			{
				Id:1,
				SourceOrTarget: 'Source',
				Code:'',
				Description: '',
				Comment: '',
				MdcCounitTargetFk: Math.abs(costControl.Id),
				PackageBudget: costControl.PackageValueNet,
				BudgetInPackNSub:0,
				AvaiBudget: 0,
				ShiftBudget: -(costControl.OwnBudget + costControl.OwnBudgetShift - costControl.PackageValueNet),
				TotalBudget: totalBudgetShift,
				SorurceType:true,
				__rt$data: {
					errors: {
						Description: {error: this.generateEmptyDescError()}
					},
					readonly: [
						{field: 'SourceOrTarget', readonly: true},
						{field: 'MdcCounitTargetFk', readonly: true},
						{field: 'BudgetInPackNSub', readonly: true},
						{field: 'AvaiBudget', readonly: true},
						{field: 'TotalBudget', readonly: true},
						{field: 'Code', readonly: true}
					]
				}
			};

		source.AvaiBudget = source.TotalBudget + source.ShiftBudget;
		source.BudgetInPackNSub = source.TotalBudget + source.ShiftBudget;
		if(source.ShiftBudget && source.ShiftBudget > 0){
			source.ShiftBudget = 0;
		}

		const list = [source as IGccBudgetShiftEntity];
		if((totalBudgetShift)> 0) {
			const targetOne = clone(this.emptyObj);
			targetOne.Id = 2;
			targetOne.ShiftBudget = -source.ShiftBudget;
			targetOne.AvaiBudget = targetOne.TotalBudget + targetOne.ShiftBudget;
			list.push(targetOne as IGccBudgetShiftEntity);
		}
		return list;
	}

	private getColumns(): ColumnDef<IGccBudgetShiftEntity>[]{
		return [
			{
				id: 'Code',
				model: 'Code',
				type: FieldType.Code,
				label: {
					key: 'controlling.generalcontractor.Code',
					text: 'Code'
				},
				sortable: true,
				visible: true,
				readonly: true,
				width: 50
			},
			{
				id: 'descriptionCol',
				model: 'Description',
				type: FieldType.Description,
				label: {
					key: 'controlling.generalcontractor.Description',
					text: 'Description'
				},
				sortable: true,
				visible: true,
				readonly: false,
				maxLength: 252,
				validator: info => {
					const result = new ValidationResult();
					const gridApi = this.getGridApi();
					if(!gridApi) {
						return result;
					}

					if(!info.value){
						result.valid = false;
						result.error = this.generateEmptyDescError().text;
						return result;
					}

					forEach(gridApi.items, item => {
						item.Description = info.value as string;
					});

					return result;

				}
			},
			{
				id: 'budget',
				model: 'TotalBudget',
				type: FieldType.Money,
				label: {
					key: 'controlling.generalcontractor.TotalBudget',
					text: 'Total Budget'
				},
				sortable: true,
				visible: true,
				readonly: true
			},
			{
				id: 'shiftBudget',
				model: 'ShiftBudget',
				type: FieldType.Money,
				label: {
					key: 'controlling.generalcontractor.ShiftBudget',
					text: 'Shift Budget'
				},
				sortable: true,
				visible: true,
				readonly: false,
				validator: info => {
					const result = new ValidationResult();
					const gridApi = this.getGridApi();
					if(!gridApi) {
						return result;
					}

					const list = gridApi.items;
					const entity = info.entity;
					let newValue = info.value as number;
					if(entity.SorurceType){
						newValue = newValue > 0 ? -newValue : newValue;
						if(-newValue > entity.TotalBudget - entity.BudgetInPackNSub){
							result.valid = false;
							result.error = this.translate.instant('controlling.generalcontractor.ShiftBudgetOutRange').text;
							return result;
						}else{
							if(list.length === 2){
								forEach(list, function(item){
									if(item.Id !== entity.Id){
										item.ShiftBudget = -newValue;
										item.AvaiBudget = item.TotalBudget + item.ShiftBudget;
									}
								});
							}else if(list.length > 2){
								let sum = 0;
								forEach(list, function (item){
									sum += (item.Id !== entity.Id ? item.ShiftBudget : newValue);
								});

								const lastOne = list[list.length - 1];
								lastOne.ShiftBudget = lastOne.ShiftBudget || 0;
								lastOne.ShiftBudget -= sum;
								if(lastOne.ShiftBudget < 0){
									lastOne.ShiftBudget = 0;
								}
								lastOne.AvaiBudget = lastOne.TotalBudget + lastOne.ShiftBudget;
							}
						}
					}

					let total = 0;
					forEach(list, function (item){
						total += (item.Id !== entity.Id ? item.ShiftBudget : newValue);
					});

					entity.AvaiBudget = entity.TotalBudget + newValue;

					if(total > 0){
						result.valid = false;
						result.error = this.translate.instant('controlling.generalcontractor.ShiftBudgetBigThenTotal').text;
						return result;
					}else{
						entity.ShiftBudget = newValue;
						total < 0 && this.isAnyBudgetToShift() && !this.isBudgetShiftOverproof() && this.createNewItem(-total);
						// TODO: CLEAR ERROR
						// clearShiftBudetColumnError(list,true);
					}

					//TODO update tool
					// forEach(scope.tools.items, function (item) {
					// 	if (item.id === 'create'){
					// 		item.disabled = !service.isAnyBudgetToShift() || service.isBudgetShiftOverproof() || service.isBudgetShiftFinish();
					// 	}
					// });
					// scope.tools.update();

					return result;
				}
			},
			{
				id: 'avaiBudget',
				model: 'AvaiBudget',
				type: FieldType.Money,
				label: {
					key: 'controlling.generalcontractor.AvaiBudget',
					text: 'Budget after shift'
				},
				sortable: true,
				visible: true,
				readonly: true
			},
			{
				id: 'BudgetInPackNSub',
				model: 'BudgetInPackNSub',
				type: FieldType.Money,
				label: {
					key: 'controlling.generalcontractor.BudgetInPackNSub',
					text: 'Budget spent'
				},
				sortable: true,
				visible: true,
				readonly: true
			},
			{
				id: 'sourceOrTar',
				model: 'SourceOrTarget',
				type: FieldType.Description,
				label: {
					key: 'controlling.generalcontractor.BudgetInPackNSub',
					text: 'Source/Target'
				},
				sortable: true,
				visible: true,
				readonly: true,
				width: 80
			},
			{
				id: 'mdccounittargetfk',
				model: 'MdcCounitTargetFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsShareControllingUnitLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated',
					clientSideFilter: {
						execute(item: IControllingUnitEntity): boolean {
							//TODO: let projectContext = _.find (cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
							const projectId = 1008170;
							return item.PrjProjectFk === projectId;
						}
					},
					serverSideFilter: {
						key: 'controlling-actuals-controlling-unit-filter',
						execute: context => {
							return {
								ByStructure: true,
								ExtraFilter: false,
								CompanyFk: context.injector.get(PlatformConfigurationService).getContext().clientId,
								FilterKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
								IsProjectReadonly: true,
								IsCompanyReadonly: true,
							};
						}
					}
				}),
				label: {
					key: 'controlling.generalcontractor.ControllingUnit',
					text: 'Controlling Unit'
				},
				sortable: true,
				visible: true,
				readonly: false,
				width: 90,
				validator: info => {
					const result = new ValidationResult();
					const gridApi = this.getGridApi();
					if(!gridApi) {
						return result;
					}


					const entity = info.entity;
					const value = info.value as number;

					if(!value){
						result.valid = false;
						result.error = this.generateEmptyCUError().text;
						return result;
					}

					// TODO: check whether leaf level
					if('children' in entity && entity.children){
						result.valid = false;
						result.error = this.translate.instant('controlling.generalcontractor.ErrorLeafNodeCu').text;
						return result;
					}

					const list = gridApi.items;
					let sameCu = null;
					forEach(list, function (item){
						if(item.Id !== entity.Id && item.MdcCounitTargetFk === value){
							sameCu = item;
						}
					});

					if(sameCu){
						result.valid = false;
						result.error = this.translate.instant('controlling.generalcontractor.RepeatedCu').text;
						return result;
					}

					const costControl = find(this.costControlDataService.getList(), {Id: value});
					if(costControl) {
						entity.TotalBudget = costControl.Budget;
						entity.PackageBudget = 0;
						entity.AvaiBudget = entity.TotalBudget + entity.ShiftBudget;
						entity.PackageBudget = costControl.PackageValueNet - 0;
						entity.BudgetInPackNSub = entity.PackageBudget + costControl.SubTotalBudget;
					}else{
						//TODO: let projectContext = _.find (cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
						const projectId = 1008170;
						this.http.get(this.configService.webApiBaseUrl + 'procurement/package/total/gettotalbycuid?projectId='+ projectId +'&controllingUnitId=' + (value || entity.MdcCounitTargetFk)).subscribe(function (res){
							if(res){
								const resList = res as {ValueNet?: number|null}[];
								entity.PackageBudget = entity.PackageBudget || 0;
								forEach(resList, function (total){
									if(entity.PackageBudget || entity.PackageBudget === 0) {
										entity.PackageBudget += (total.ValueNet || 0);
									}
								});
							}
						});
					}

					return result;
				}
			},
			//TODO: additional description column
			{
				id: 'comment',
				model: 'Comment',
				type: FieldType.Comment,
				label: {
					key: 'controlling.generalcontractor.Comment',
					text: 'Comment'
				},
				maxLength: 256,
				sortable: true,
				visible: true,
				readonly: false,
				width: 180
			}
		];
	}

	private generateEmptyCUError(){
		return this.translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.translate.instant('controlling.generalcontractor.ControllingUnitFk').text});
	}

	private generateEmptyDescError(){
		return this.translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: this.translate.instant('controlling.generalcontractor.Description').text});
	}

	private getGridApi(){
		this.gridApi = this.gridApi || this.injector.get(GridApiService).get(this.gridGuid);
		if(!this.gridApi){
			console.log('cannot find target Grid');
			return null;
		}

		return this.gridApi;
	}

	private createNewItem(shiftBudget?: number | null){
		const gridApi = this.getGridApi();
		if(!gridApi){
			return;
		}

		if(!this.isAnyBudgetToShift() || this.isBudgetShiftFinish()){
			return;
		}

		const list = gridApi.items;
		let maxId = 0;
		forEach(list, function (item){
			maxId = item.Id > maxId ? item.Id : maxId;
		});
		const newItem = clone(this.emptyObj);
		newItem.Id = maxId + 1;
		newItem.ShiftBudget = shiftBudget || 0;
		newItem.AvaiBudget = newItem.ShiftBudget;

		const source = find(list, {Id:1});
		if(!source){
			return;
		}
		newItem.Code = source.Code || '';
		newItem.Description = source.Description || '';
		if(source.Description){
			// TODO: remove grid error
			// removeError(newItem, 'Description');
		}

		const newList = [];
		forEach(list, (item) =>{
				newList.push(clone(item));
			}
		);
		newList.push(newItem);

		gridApi.items = newList;
		// this.refreshGuid();
	}

	private deleteItem(){
		const gridApi = this.getGridApi();
		if(!gridApi){
			return;
		}

		const selectedList = gridApi.selection;
		if(!selectedList || selectedList.length <= 0) {
			return;
		}

		const selected: IGccBudgetShiftEntity = selectedList[0];
		if(selected.SorurceType){
			return;
		}

		const list = gridApi.items;

		const newList: IGccBudgetShiftEntity[] = [];
		forEach(list, function (item){
			item.Id !== selected.Id && newList.push(clone(item));
		});

		let total = 0;
		forEach(newList, function (item){
			total += (item.ShiftBudget || 0);
		});

		if(total <= 0){
			// TODO: remove grid error
			// clearShiftBudetColumnError(newList);
		}

		gridApi.items = newList;
		// this.refreshGuid();
	}

	private isAnyBudgetToShift(){
		const gridApi = this.getGridApi();
		if(!gridApi){
			return;
		}

		const source = find(gridApi.items, {SorurceType:true});

		return source && source.ShiftBudget < 0 && (source.TotalBudget - source.BudgetInPackNSub) > 0;
	}

	private isBudgetShiftFinish(){
		const gridApi = this.getGridApi();
		if(!gridApi){
			return;
		}

		const list = gridApi.items;
		let total = 0;
		forEach(list, function (item){
			total += item.ShiftBudget;
		});

		return total === 0;
	}

	private isBudgetShiftOverproof(){
		const gridApi = this.getGridApi();
		if(!gridApi){
			return;
		}

		const list = gridApi.items;
		const source = find(list, {SorurceType:true});
		if(source){
			return source.TotalBudget - source.BudgetInPackNSub < (0 - source.ShiftBudget);
		}
		return false;
	}
}