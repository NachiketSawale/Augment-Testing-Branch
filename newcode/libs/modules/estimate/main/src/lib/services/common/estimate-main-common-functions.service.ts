/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import {  PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { IConfDetailItem, IEstLineItemToSave, IEstPrjUpdateData, IEstResourceToSave, IEstRuleToSave, IEstSelectedRows } from '../../model/interfaces/estimate-main-common.interface';
import { IPrjMaterialEntity } from '@libs/project/interfaces';
import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';

import * as _ from 'lodash';
import { EstimateMainGenerateSortingService } from '@libs/estimate/shared';
import { GridApiService, IGridApi } from '@libs/ui/common';



@Injectable({
	providedIn: 'root'
})

/**
 * This service is for common function used in EstimateMainCommonService
 */
export class EstimateMainCommonFunctionsService {
	private estimateMainGenerateSortingService = inject(EstimateMainGenerateSortingService);
	private translateService = inject(PlatformTranslateService);
	private gridApi?: IGridApi<IEstResourceEntity> | null;

	private checkBoxFields: (keyof IEstLineItemEntity)[] = ['IsLumpsum', 'IsDisabled', 'IsGc', 'IsOptional', 'IsOptionalIT', 'IsFixedPrice', 'IsIncluded'];

	/**
	 * Translate comment text
	 * @param commentText Coommnet text to be modified
	 */
	public translateCommentColtext(commentText: string): string {
		const reg = /{.*?}/gi;
		if (commentText && reg.test(commentText)) {
			const list = commentText.match(reg);
			if (list) {
				list.forEach((item) => {
					const translatedItem = 'estimate.main.' + item.substring(1, item.length - 1);
					commentText = commentText.replace(item, translatedItem);
					this.translateService.instant(commentText);
				});
			}
		}

		return commentText.replace(/,\s*$/, '');
	}

	/**
	 * Save config details columns
	 * @param combinedLineItems Line items
	 * @param confDetailColumns Detail columns
	 */
	public collectConfDetailColumnsToSave(combinedLineItems: IEstLineItemEntity[], confDetailColumns: IConfDetailItem[]): IConfDetailItem[] {
		const confDetail: IConfDetailItem[] = [];
	
		combinedLineItems.forEach((item) => {
			// Check if CombinedLineItems exists and has data
			// if (item.CombinedLineItems && item.CombinedLineItems.length > 0) {
			// 	confDetailColumns.forEach((col) => {
			// 		const combinedItem = item.CombinedLineItems[0];
					
			// 		// Check if the column id exists in the combined item
			// 		if (combinedItem[col.id]) {
			// 			const confDetailItem: IConfDetailItem = {
			// 				key: col.id,
			// 				value: combinedItem[col.id]
			// 			};
	
			// 			confDetail.push(confDetailItem);
			// 		}
			// 	});
			// }
		});
	
		return confDetail;
	}
	

	/**
	 * Remove useless characters from formula
	 */
	private removeUselessChars(formula: string) {
		if (!formula) {
			return null;
		}
		formula = formula.replace(/[,]/gi, '.');
		formula = formula.replace(/\s/gi, '');
		formula = formula.replace(/mod/gi, '%').replace(/'.*?'/gi, '').replace(/{.*?}/gi, '');
		formula = formula.replace(/div/gi, '%');
		return formula;
	}

	/**
	 * Check detail format
	 * @param dtos Data from server
	 * @param dataService Dynamic dataservice
	 */
	public checkDetailFormat(dtos: IEstResourceEntity[], dataService: unknown) {
		if (!dtos || dtos.length <= 0) {
			return;
		}

		// let formulas = [],
		// 	numReg = new RegExp('^(-)?\\d+(\\.\\d+)?$');

		// dtos.forEach((dto) => {
		// 	this.detailColumns.forEach((col) => {
		// 		let formula = dto[col];
		// 		this.commonFun.removeUselessChars(formula);
		// 		if (formula && col === 'QuantityDetail' && dto.EstResourceTypeFk === estimateMainResourceType.ComputationalLine) {
		// 			formula = formula.replace(/(\d+)\(([^)]+)\)/g, '$1*($2)'); // brackets
		// 			formula = formula.replace(/(\d+)\s*([A-Za-z_]+)|([A-Za-z_]+)*\s(\d+)/g, '$1*$2'); // consecutive text
		// 		}
		// 		if (formula && !numReg.test(formula) && formulas.indexOf(formula) < 0) {
		// 			formulas.push(formula);
		// 		}
		// 	});
		// });

		// if (formulas.length > 0) {
		// 	this.http.post(this.configurationService.webApiBaseUrl + 'basics/common/calculateexpressions/formulascheck', formulas).subscribe((response) => {
		// 		if (response && response.data) {
		// 			dtos.forEach((dto) => {
		// 				this.detailColumns.forEach((col) => {
		// 					let formula = angular.copy(dto[col]);
		// 					this.commonFun.removeUselessChars(formula);

		// 					if (formula && !numReg.test(formula) && response.data[formula]) {
		// 						dto.__rt$data = dto.__rt$data || {};
		// 						dto.__rt$data.errors = dto.__rt$data.errors || {};
		// 						let errStr = '',
		// 							i = 1;
		// 						if (response.data[formula].length > 1) {
		// 							response.data[formula].forEach((item) => {
		// 								errStr += '【' + i + ', ' + item + '】';
		// 								i++;
		// 							});
		// 						} else {
		// 							errStr = response.data[formula][0];
		// 						}
		// 						dto.__rt$data.errors[col] = { error: errStr };
		// 					}
		// 				});
		// 			});
		// 			dataService.gridRefresh();
		// 		}
		// 	});
		// }
	}

	/**
	 * Clear error
	 * @param updateData Date to be modify
	 */
	public clearDeserializationError(updateData: IEstPrjUpdateData) {
		if (updateData && updateData.PrjEstLineItemToSave) {
			updateData.PrjEstLineItemToSave.forEach((estLineItem: IEstLineItemToSave) => {
				if (estLineItem.PrjEstLineItem) {
					estLineItem.PrjEstLineItem.DayWorkRateUnit = estLineItem.PrjEstLineItem.DayWorkRateUnit ? estLineItem.PrjEstLineItem.DayWorkRateUnit : 0;
					estLineItem.PrjEstLineItem.BudgetUnit = estLineItem.PrjEstLineItem.BudgetUnit ? estLineItem.PrjEstLineItem.BudgetUnit : 0;
					estLineItem.PrjEstLineItem.DayWorkRateTotal = estLineItem.PrjEstLineItem.DayWorkRateTotal ? estLineItem.PrjEstLineItem.DayWorkRateTotal : 0;
				}

				if (estLineItem.PrjEstResourceToSave) {
					estLineItem.PrjEstResourceToSave.forEach((estResrouce: IEstResourceToSave) => {
						if (estResrouce.PrjEstResource) {
							estResrouce.PrjEstResource.DayWorkRateTotal = estResrouce.PrjEstResource.DayWorkRateTotal ? estResrouce.PrjEstResource.DayWorkRateTotal : 0;
						}
					});
				}
			});
		}

		if (updateData.PrjEstRuleToSave) {
			updateData.PrjEstRuleToSave.forEach((prjEstRule: IEstRuleToSave) => {
				if (prjEstRule.PrjEstRuleParamToSave) {
					// TODO
					// prjEstRule.PrjEstRuleParamToSave.forEach((prjEstRuleParam:IPrjEstRuleEntity) => {
					// 	if (prjEstRuleParam.PrjEstRuleParam) {
					// 		prjEstRuleParam.PrjEstRuleParam.DefaultValue = prjEstRuleParam.PrjEstRuleParam.DefaultValue ? prjEstRuleParam.PrjEstRuleParam.DefaultValue : 0;
					// 	}
					// });
				}
			});
		}
	}

	/**
	 * Set activate header
	 * @param isActivate Check if it is activate
	 */
	public setActivateEstIndicator(isActivate: boolean) {
		isActivate = false; // default value
		// TODO BasicCustomizeSystemoptionLookupDataService
		// let basicCustomizeSystemoptionLookupDataService = inject(BasicCustomizeSystemoptionLookupDataService);
		// if (basicCustomizeSystemoptionLookupDataService) {
		// 	let systemOptions = basicCustomizeSystemoptionLookupDataService.getList();
		// 	if (systemOptions && systemOptions.length > 0) {
		// 		let items = _.filter(systemOptions, function (systemOption) {
		// 			if (systemOption.Id === 10011) {
		// 				return systemOption;
		// 			}
		// 		});

		// 		if (items && items.length > 0) {
		// 			if (items[0].ParameterValue && (items[0].ParameterValue.toLowerCase() === 'true' || items[0].ParameterValue === '1')) {
		// 				this.isActivate = true;
		// 			}
		// 		}
		// 	}
		// }
	}

	/**
	 * Set LsumUom Id
	 */
	public setLsumUom() {
		// TODO BasicsUnitLookupDataService
		// inject(BasicsUnitLookupDataService)
		// 	.getList({ lookupType: 'Uom', dataServiceName: 'basicsUnitLookupDataService' })
		// 	.subscribe((list) => {
		// 		this.lsumUom = _.find(list, { UomTypeFk: 8 });
		// 	});
	}

	/**
	 * check if it is LumpsumUom
	 * @param uomId Id of Uom
	 */
	public isLumpsumUom(uomId: number) {
		// TODO BasicsUnitLookupDataService
		// return inject(BasicsUnitLookupDataService)
		// 	.getItemByIdAsync(uomId, { lookupType: 'Uom', dataServiceName: 'basicsUnitLookupDataService' })
		// 	.then((uom) => {
		// 		if (uom && uom.UomTypeFk === 8) {
		// 			this.lsumUom = uom;
		// 			return true;
		// 		}
		// 		return false;
		// 	});
	}

	/**
	 * Delete Rules
	 * @param updateData Items to be deleted
	 */
	// public collectRule2Deleted(updateData: any /**replace with EstCompleteEntity not ready */) {
	// 	// TODO All this services are not ready yet
	// 	// $injector.get('estimateMainRootService').setRuleToDelete(updateData.EstHeaderRuleToDelete);
	// 	// $injector.get('estimateMainControllingService').setRuleToDelete(updateData.EstCtuRuleToDelete);
	// 	// $injector.get('estimateMainProcurementStructureService').setRuleToDelete(updateData.EstPrcStructureRuleToDelete);
	// 	// $injector.get('estimateMainLocationService').setRuleToDelete(updateData.EstPrjLocationRuleToDelete);
	// 	// $injector.get('costGroupStructureDataServiceFactory').setRuleToDelete(updateData.EstCostGrpRuleToDelete);
	// 	// $injector.get('estimateMainBoqService').setRuleToDelete(updateData.EstBoqRuleToDelete);
	// 	// $injector.get('estimateMainActivityService').setRuleToDelete(updateData.EstActivityRuleToDelete);
	// 	// $injector.get('estimateMainAssembliesCategoryService').setRuleToDelete(updateData.EstAssemblyCatRuleToDelete);
	// 	// $injector.get('estimateMainService').setRuleToDelete(updateData.EstLineItemsRuleToDelete);
	// }

	/**
	 * Get Grid selected info
	 *  @param gridId Grid id of container
	 */
	public getGridSelectedInfos(gridId: string) {
		let selectedInfo!: IEstSelectedRows;
		// TODO platformGridAPI
		// let gridinstance = this.platformGridAPI.grids.element('id', gridId).instance;
		// selectedInfo.SelectedRows = angular.isDefined(gridinstance) ? gridinstance.getSelectedRows() : [];
		// selectedInfo.selectedItems = selectedInfo.SelectedRows.map((row) => {
		// 	return gridinstance.getDataItem(row);
		// });
		return selectedInfo;
	}

	/**
	 * Move selected item
	 * @param type Moveup/MoveDown
	 * @param gridId Grid id of container
	 */
	public moveSelectedItemTo(type: number, gridId: string) {

		this.gridApi =  ServiceLocator.injector.get(GridApiService).get(gridId);

		if(!this.gridApi){
			console.log('cannot find target Grid');
			return;
		}
		
		const items = this.gridApi.items;
		const selectedData = this.getGridSelectedInfos(gridId);
		let i: number;

		selectedData.SelectedRows = this.estimateMainGenerateSortingService.sortNumber(selectedData.SelectedRows);

		switch (type) {
			case 1:
				// moveUp
				for (i = 0; i < selectedData.SelectedRows.length && selectedData.SelectedRows[i] - 1 >= 0; i++) {
					items.splice(selectedData.SelectedRows[i] - 1, 0, items.splice(selectedData.SelectedRows[i], 1)[0]);
				}
				break;
			case 3:
				// moveDown
				selectedData.SelectedRows = selectedData.SelectedRows.reverse();
				for (i = 0; i < selectedData.SelectedRows.length && selectedData.SelectedRows[i] + 1 < items.length; i++) {
					items.splice(selectedData.SelectedRows[i] + 1, 0, items.splice(selectedData.SelectedRows[i], 1)[0]);
				}
				break;
		}

		this.gridApi.items.push(...items);
		// TODO push list to selection this.gridApi.selection.push(selectedData.SelectedItems);

		// update the sorting
		let index = 0;
		items.forEach((item) => {
			item.Sorting = index;
			index++;
		});
	}

	/**
	 * Modify resource changing isChange property
	 * @param source Sourceline item
	 * @param target Target line item
	 */
	public isLineItemChange(source: IEstLineItemEntity[], target: IEstLineItemEntity[]) {
		type resultType = {
			isChange: boolean;
			changeFields: string[];
		};

		const result: resultType = {
			isChange: false,
			changeFields: []
		};

		this.checkBoxFields.forEach((field) => {
			if (_.get(source, field) !== _.get(target, field)) {
				result.isChange = true;
				result.changeFields.push(field);
			}
		});

		return result;
	}

	/**
	 * Reset Price list
	 * @param resItem Select resource
	 * @param selectedItem Selected line item
	 */
	public resetLastPriceListToResource(resItem: IEstResourceEntity, selectedItem: IPrjMaterialEntity) {
		// resItem.MaterialPriceListFk = selectedItem.MaterialPriceListFk;
		// if (resItem.MaterialPriceListFk && selectedItem.PriceLists && selectedItem.PriceLists.length > 0) {
		// 	const priceItem = selectedItem.PriceLists.find((item) => item.Id === resItem.MaterialPriceListFk);
		// 	if (priceItem) {
		// 		resItem.Charges = priceItem.Charges;
		// 		resItem.Cost = priceItem.Cost;
		// 		resItem.BasCurrencyFk = priceItem.CurrencyFk;
		// 		resItem.Discount = priceItem.Discount;
		// 		resItem.ListPrice = priceItem.ListPrice;
		// 		resItem.PriceExtra = priceItem.PriceExtras;
		// 		resItem.RetailPrice = priceItem.RetailPrice;
		// 		resItem.Co2Source = priceItem.Co2Source;
		// 		resItem.BasCo2SourceFk = priceItem.BasCo2SourceFk;
		// 		resItem.Co2Project = priceItem.Co2Project;
		// 		resItem.MdcTaxCodeFk = priceItem.TaxCodeFk;
		// 		resItem.DayworkRate = priceItem.DayworkRate;
		// 		resItem.EstimatePrice = priceItem.EstimatePrice;
		// 		resItem.DayWorkRateUnit = priceItem.DayWorkRate || priceItem.DayworkRate;
		// 	}
		// }
	}
}
