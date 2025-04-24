/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IProjectCostCodesComplete, IProjectCostCodesJobEntity, PrjCostCodesEntity } from '@libs/project/interfaces';
import { EstimateMainService } from '@libs/estimate/main';
import { ProjectMainDataService } from '@libs/project/shared';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IIdentificationData, PlatformTranslateService } from '@libs/platform/common';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';

// export const PROJECT_COST_CODE_DATA_SERVICE_TOKEN = new InjectionToken<ProjectCostcodesPriceListForJobDataService>('projectCostcodesPriceListForJobDataService');

@Injectable({
	providedIn: 'root',
})

/**
 * ProjectCostcodesPriceListForJobData  service
 */
export class ProjectCostcodesPriceListForJobDataService extends DataServiceFlatRoot<PrjCostCodesEntity, IProjectCostCodesComplete>{
	private projectMainDataService = inject(ProjectMainDataService);
	private estimateMainService = inject(EstimateMainService);
	//private estimateResourcesSummaryService = inject(EstimateResourcesSummaryService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private resourcesCostCodeJobs = [];
	private additionalPriceVersions = [
		{
			Id: -1,
			PriceListFk: -1,
			PriceListDescription: this.translateService.instant('project.main.updateCostCodeForJob.noData'),
			DescriptionInfo: {
				Description: this.translateService.instant('project.main.updateCostCodeForJob.baseVersion'),
				Translated: this.translateService.instant('project.main.updateCostCodeForJob.baseVersion'),
			},
		},
		{
			Id: -2,
			PriceListFk: -1,
			PriceListDescription: this.translateService.instant('project.main.updateCostCodeForJob.noData'),
			DescriptionInfo: {
				Description: this.translateService.instant('project.main.updateCostCodeForJob.weightedVersion'),
				Translated: this.translateService.instant('project.main.updateCostCodeForJob.weightedVersion'),
			},
		},
	];

	public constructor() {
		const options: IDataServiceOptions<PrjCostCodesEntity> = {
			apiUrl: 'project/costcodes/pricelist',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getprojectpricelistwithjob',
				usePost: true,

				prepareParam: (ident: IIdentificationData) => {
					const projectId = this.projectMainDataService.getSelection()[0];
					return { pKey1: projectId.Id };
				},
			},
			roleInfo: <IDataServiceRoleOptions<PrjCostCodesEntity>>{
				role: ServiceRole.Root,
				itemName: '',
			},
		};
		super(options);
	}

	// TODO
	// private filters = [
	// 	{
	// 		key: 'project-main-costcodes-price-price-version-filter',
	// 		serverSide: false,
	// 		fn: (lookupItem, item) => {
	// 			if (item.isJob) { // this is a job.
	// 				return lookupItem.Id !== -2;
	// 			}
	// 			if (item.PriceListForUpdate && item.PriceListForUpdate.length > 0) {
	// 				let versionIds = _.map(item.PriceListForUpdate, 'PriceVersionFk');
	// 				return versionIds.indexOf(lookupItem.Id) !== -1;
	// 			}
	// 			return false;
	// 		}
	// 	},
	// 	{
	// 		key: 'project-main-costcodes-currency-edit-filter',
	// 		serverSide: false,
	// 		fn: (lookupItem, item) => {
	// 			if (item.isJob) { // this is a job.
	// 				return false;
	// 			}
	// 			if (item.CurrencyFkList && item.CurrencyFkList.length > 0) {
	// 				return item.CurrencyFkList.indexOf(lookupItem.Id) !== -1;
	// 			}
	// 			return true;
	// 		}
	// 	}
	// ];
	// basicsLookupdataLookupFilterService.registerFilter(filters);
	// private projectJobDynamicColumnService = inject('projectCostCodesPriceListJobDynColumnService');

	public setDynamicDataToColumn(filteredList:PrjCostCodesEntity) {
		// TODO Dynamic columns
		// let dynamicColumnService = $injector.get('projectCostCodesPriceListJobDynColumnService');
		// var flatList = [];
		// _.forEach(filteredList, function (item) {
		// 	cloudCommonGridService.flatten(item.ProjectCostCodes, flatList, 'ProjectCostCodes');
		// });
		// dynamicColumnService.attachDataToColumn(flatList).then(function(){
		// 	service.gridRefresh();
		// });
	}

	public incorporateDataRead(responseData:PrjCostCodesEntity[], data:PrjCostCodesEntity[]) {
		this.setFirstJobRate(responseData);
		// TODO projectMainUpdatePricesWizardCommonService,estimateResourcesSummaryService
		// let isUsingInEstimateResourceSummary = projectMainUpdatePricesWizardCommonService.isUsingInEstimateResourceSummary();
		// if(isUsingInEstimateResourceSummary){
		// 	resourcesCostCodeJobs = _.map(_.filter(estimateResourcesSummaryService.getList(),function(resource) {
		// 		return resource.EstResourceTypeFk === 1;
		// 	}), function(resource){
		// 		return { MdcCostCodeFk: resource.MdcCostCodeFk, LgmJobFk: resource.LgmJobFk ? resource.LgmJobFk : estimateMainService.getLgmJobId(resource)  };
		// 	});
		// }

		if (responseData !== null || typeof responseData !== 'undefined') {
			responseData.forEach((item) => {
				item['isJob'] = true;
				item['image'] = 'ico-accordion-root';
				item.Rate = null;
				item['NewRate'] = null;
				item.DayWorkRate = 0;
				item['NewDayWorkRate'] = 0;
				item.FactorCosts = null;
				item.NewFactorCosts = null;
				item.FactorQuantity = null;
				item.NewFactorQuantity = null;
				//item.RealFactorCosts = 0; - TODO readonly property in estimate composite entity
				item.NewRealFactorCosts = null;
				item.RealFactorQuantity = null;
				item.NewRealFactorQuantity = null;
				item.FactorHour = 0;
				item['NewFactorHour'] = 0;
				// item.IsLabour = null; - TODO readonly property in estimate composite entity
				// item.IsRate = null;- TODO readonly property in estimate composite entity
				// item.IsLabour = null; - TODO readonly property in estimate composite entity
				// item.IsRate = null;- TODO readonly property in estimate composite entity
				item['NewCo2Source'] = null;
				item['NewCo2SourceFk'] = null;
				item['NewCo2Project'] = null;
		
				const readonlyFields = [];
				readonlyFields.push({field: 'NewRate', readonly: true});
				readonlyFields.push({field: 'NewDayWorkRate', readonly: true});
				readonlyFields.push({field: 'NewFactorCosts', readonly: true});
				readonlyFields.push({field: 'NewFactorQuantity', readonly: true});
				readonlyFields.push({field: 'NewCo2Source', readonly: true});
				readonlyFields.push({field: 'NewCo2SourceFk', readonly: true});
		
				// TODO platformRuntimeDataService
				// platformRuntimeDataService.readonly(item, readonlyFields);
				// if (item.ProjectCostCodes && item.ProjectCostCodes.length > 0) {
				//     setIconForList(item.ProjectCostCodes, isUsingInEstimateResourceSummary);
				//     if(isUsingInEstimateResourceSummary) {
				//         item.ProjectCostCodes = _.filter(item.ProjectCostCodes, { existsInResources: true });
				//     }
				// }
			});
		} 
		
		// TODO Dynamic Columns
		// let filteredList = _.filter(responseData, function(item){
		// 	return item.ProjectCostCodes && item.ProjectCostCodes.length > 0;
		// });
		// if(filteredList.length > 0){
		// 	this.setDynamicDataToColumn(filteredList);
		// }		
	}

	public setIconForList(prjCostCodesList:PrjCostCodesEntity[], isUsingInEstimateResourceSummary:boolean){
		prjCostCodesList.forEach((prjCostCodes) => {
			//prjCostCodes.image = 'ico-accordion-pos';
		
			if (prjCostCodes.ProjectCostCodes && prjCostCodes.ProjectCostCodes.length > 0) {
				this.setIconForList(prjCostCodes.ProjectCostCodes, isUsingInEstimateResourceSummary);
			}
		
			if (isUsingInEstimateResourceSummary) {
				let hasChildrenWithResources = false;
		
				// Check if any child exists in resources
				if(prjCostCodes.ProjectCostCodes !== null || typeof prjCostCodes.ProjectCostCodes !== 'undefined'){
					for (const child of prjCostCodes.ProjectCostCodes ?? []) {
						if (child['existsInResources'] === true) {
							hasChildrenWithResources = true;
							break;
						}
					}
				}			
		
				if (!hasChildrenWithResources) {
					prjCostCodes.ProjectCostCodes = null;
					prjCostCodes['HasChildren'] = false;
					// prjCostCodes['existsInResources'] = this.resourcesCostCodeJobs.findIndex(
					// 	(item) => item.MdcCostCodeFk === (prjCostCodes.BasCostCode ? prjCostCodes.BasCostCode.Id : null) &&
					// 			  item.LgmJobFk === prjCostCodes.LgmJobFk
					// ) > -1;
				} else {
					prjCostCodes['existsInResources'] = true;
					// prjCostCodes.ProjectCostCodes = prjCostCodes.ProjectCostCodes.filter((child) => child['existsInResources'] === true);
				}
			}
		});
		
	}	

	public setCostCodePriceVersionByJob(job: IProjectCostCodesJobEntity, priceVersionFk: number) {
		job.JobCostCodePriceVersionFk = priceVersionFk;
		if (job.ProjectCostCodes && job.ProjectCostCodes.length > 0) {
			const jobPriceVersionFk = job.JobCostCodePriceVersionFk;
			job.ProjectCostCodes.forEach((prjCostCodes: PrjCostCodesEntity) => {
				this.changeCostCodePriceVersion(prjCostCodes, jobPriceVersionFk);
			});
		}
	}

	public changeCostCodePriceVersion(prjCostCodes: PrjCostCodesEntity, priceVersionFk: number, needCompute?: boolean) {
		let hasPriceVersion = false;
		if (prjCostCodes.PriceListForUpdate && prjCostCodes.PriceListForUpdate.length > 0) {
			prjCostCodes.PriceListForUpdate.forEach((priceList) => {
				priceList['Selected'] = priceList.PriceVersionFk === priceVersionFk;
				if (priceList.PriceVersionFk === priceVersionFk) {
					priceList['Selected'] = true;
					hasPriceVersion = true;
				} else {
					priceList['Selected'] = false;
				}
			});
			this.refreshPriceListRecordGrid(prjCostCodes);
		}
		if (hasPriceVersion) {
			prjCostCodes['JobCostCodePriceVersionFk'] = priceVersionFk;
		}
		if (needCompute !== false) {
			this.computePrjCostCodes(prjCostCodes);
		}

		if (prjCostCodes.ProjectCostCodes && prjCostCodes.ProjectCostCodes.length > 0) {
			prjCostCodes.ProjectCostCodes.forEach((item) => {
				this.changeCostCodePriceVersion(item, priceVersionFk, needCompute);
			});
		}
	}

	public getExchangeRateMap(prjCostCodes: PrjCostCodesEntity, priceListCurrencyFk: number, newCurrencyFk: number) {
		//const exchangeRateMaps = prjCostCodes['ExchangeRateMaps'];
		const fromCurrencyFk = priceListCurrencyFk;
		const toCurrencyFk = newCurrencyFk || prjCostCodes['NewCurrencyFk'];
		if (fromCurrencyFk === toCurrencyFk) {
			return {
				FromCurrencyFk: fromCurrencyFk,
				ToCurrencyFk: toCurrencyFk,
				ExchangeRate: 1,
				HasError: false,
				ErrorMessage: null,
			};
		}
		return null;
		// TODO
		// return exchangeRateMaps.find(
		// 	rate => rate.FromCurrencyFk === fromCurrencyFk && rate.ToCurrencyFk === toCurrencyFk
		//   );
	}

	public computePrjCostCodes(prjCostCodes: PrjCostCodesEntity, currencyChange?: boolean, newCurrencyFk?: number) {
		currencyChange = currencyChange || false;
		// newCurrencyFk = newCurrencyFk || prjCostCodes['NewCurrencyFk'];
		const selectedPriceList = prjCostCodes.PriceListForUpdate?.filter((i) => i['Selected'] === true) ?? [];
		// const dynamicColumnService = inject(ProjectCostCodesPriceListJobDynColumnService);
		// let jobExtendDynamicColumns = _.filter(dynamicColumnService.getDynamicColumns(), function(column){ return column.isExtend; });
		if (selectedPriceList.length > 1) {
			// compute price by weighting
			let rateByWeighting = 0;
			let salesPriceByWeighting = 0;
			let factorCostsByWeighting = 0;
			let factorQuantityByWeighting = 0;
			let realFactorCostsByWeighting = 0;
			let realFactorQuantityByWeighting = 0;
			let factorHourByWeighting = 0;
			let co2ProjectByWeighting = 0;
			let co2SourceByWeighting = 0;
			// let dynamicByWeighting = [];
			let weightingTotal = 0;
			let noExchangeRate = false;
			let errorMessage = '';
			//let projectCostCodesPriceListRecordDynColumnService = inject(ProjectCostCodesPriceListRecordDynColumnService);
			//let recordDynamicColumns = projectCostCodesPriceListRecordDynColumnService.getDynamicColumns();
			selectedPriceList.some((item) => {
				const exchangeRateMap = this.getExchangeRateMap(prjCostCodes, item.CurrencyFk ?? 0, 0);
				const hasError = exchangeRateMap?.HasError ?? false;
				if (typeof exchangeRateMap !== 'undefined' || hasError) {
					noExchangeRate = true;
					errorMessage = exchangeRateMap?.ErrorMessage ?? '';
					return false;
				}
				if (item.Weighting === 0) {
					return true;
				}

				// item['ExchangeRate'] = exchangeRateMap.ExchangeRateMaps ?? 0;
				if (typeof item === 'object' && item !== null) {
					const exchangeRate = Number(item['ExchangeRate'] ?? 1);
					const weighting = item.Weighting ?? 0;
					const rate = Number(item.Rate ?? 0);
					const salesPrice = Number(item['SalesPrice'] ?? 0);
					rateByWeighting += (rate / exchangeRate) * weighting;
					salesPriceByWeighting += (salesPrice / exchangeRate) * weighting;
				}

				factorCostsByWeighting += (item.FactorCosts ?? 0) * (item.Weighting ?? 0);
				factorQuantityByWeighting += (item.FactorQuantity ?? 0) * (item.Weighting ?? 0);
				realFactorCostsByWeighting += (item.RealFactorCosts ?? 0) * (item.Weighting ?? 0);
				realFactorQuantityByWeighting += (item.RealFactorQuantity ?? 0) * (item.Weighting ?? 0);
				factorHourByWeighting += (item.FactorHour ?? 0) * (item.Weighting ?? 0);

				if (item.Co2Project !== null && item.Co2Project !== undefined) {
					co2ProjectByWeighting += (item.Co2Project ?? 0) * (item.Weighting ?? 0);
				}
				if (item.Co2Source !== null && item.Co2Source !== undefined) {
					co2SourceByWeighting += (item.Co2Source ?? 0) * (item.Weighting ?? 0);
				}
				// recordDynamicColumns.forEach((recordColumn: string, index: number) => {
				// 	if (!dynamicByWeighting[index]) {
				// 		dynamicByWeighting[index] = 0;
				// 	}
				// 	dynamicByWeighting[index] += ((item[recordColumn.field] ?? 0) / (item.ExchangeRate ?? 1)) * (item.Weighting ?? 0);
				// });
				weightingTotal += item.Weighting ?? 0;
				return false;
			});
			if (noExchangeRate) {
				//this.setDefault(prjCostCodes, dynamicColumnService);
				this.showExchangeRateError(prjCostCodes, errorMessage);
			} else {
				prjCostCodes['MdcPriceListFk'] = -1;
				prjCostCodes['JobCostCodePriceVersionFk'] = -2;

				prjCostCodes['NewRate'] = (weightingTotal ?? 0) === 0 ? 0 : (rateByWeighting ?? 0) / (weightingTotal ?? 1);
				prjCostCodes['NewDayWorkRate'] = (weightingTotal ?? 0) === 0 ? 0 : (salesPriceByWeighting ?? 0) / (weightingTotal ?? 1);
				prjCostCodes.NewFactorCosts = (weightingTotal ?? 0) === 0 ? prjCostCodes.NewFactorCosts ?? 0 : (factorCostsByWeighting ?? 0) / (weightingTotal ?? 1);
				prjCostCodes.NewFactorQuantity = (weightingTotal ?? 0) === 0 ? prjCostCodes.NewFactorQuantity ?? 0 : (factorQuantityByWeighting ?? 0) / (weightingTotal ?? 1);
				prjCostCodes['NewRealFactorCost'] = (weightingTotal ?? 0) === 0 ? prjCostCodes['NewRealFactorCost'] ?? 0 : (realFactorCostsByWeighting ?? 0) / (weightingTotal ?? 1);
				prjCostCodes.NewRealFactorQuantity = (weightingTotal ?? 0) === 0 ? prjCostCodes.NewRealFactorQuantity ?? 0 : (realFactorQuantityByWeighting ?? 0) / (weightingTotal ?? 1);
				prjCostCodes['NewFactorHour'] = (weightingTotal ?? 0) === 0 ? prjCostCodes['NewFactorHour'] ?? 0 : (factorHourByWeighting ?? 0) / (weightingTotal ?? 1);

				// TODO jobExtendDynamicColumns
				// jobExtendDynamicColumns.forEach((ExtendDynamicColumn, index) => {
				// 	prjCostCodes[ExtendDynamicColumn.field] = (weightingTotal ?? 0) === 0 ? 0 : (dynamicByWeighting?.[index] ?? 0) / (weightingTotal ?? 1);
				// });

				this.setExchangeRateSuccess(prjCostCodes);
			}
			prjCostCodes['NewCo2Project'] = weightingTotal === 0 ? prjCostCodes['NewCo2Project'] : (co2ProjectByWeighting ?? null) !== null ? co2ProjectByWeighting / weightingTotal : null;
			prjCostCodes['NewCo2Source'] = weightingTotal === 0 ? prjCostCodes['NewCo2Source'] : (co2SourceByWeighting ?? null) !== null ? co2SourceByWeighting / weightingTotal : null;
			prjCostCodes['NewCo2SourceFk'] = selectedPriceList?.sort((n, m) => n.Id - m.Id)[0]?.Co2SourceFk ?? null;
		} else if (selectedPriceList.length === 1) {
			// overwrite price and currency.
			const priceListItem = selectedPriceList[0];
			if (currencyChange === true && priceListItem.CurrencyFk !== newCurrencyFk) {
				let noExchangeRate = false;
				let errorMessage = '';
				const exchangeRateMap = this.getExchangeRateMap(prjCostCodes, priceListItem.CurrencyFk ?? 0, newCurrencyFk ?? 0);

				if (exchangeRateMap === undefined || exchangeRateMap === null || exchangeRateMap.HasError) {
					noExchangeRate = true;
					errorMessage = exchangeRateMap?.ErrorMessage ?? '';
				} else {
					priceListItem['ExchangeRate'] = exchangeRateMap.ExchangeRate;
				}

				if (noExchangeRate) {
					// this.setDefault(prjCostCodes, dynamicColumnService);
					this.showExchangeRateError(prjCostCodes, errorMessage);
				} else {
					// if currency is modified, means the data is not the same of price list, so set the price list to null.
					prjCostCodes['MdcPriceListFk'] = null;
					prjCostCodes['JobCostCodePriceVersionFk'] = null;
					prjCostCodes['NewRate'] = (Number(priceListItem?.Rate) ?? 0) / (Number(priceListItem?.['ExchangeRate']) ?? 1);
					prjCostCodes['NewDayWorkRate'] = (Number(priceListItem?.['SalesPrice']) ?? 0) / (Number(priceListItem?.['ExchangeRate']) ?? 1);

					// TODO dynamicColumnService
					// const extendFieldSuffix = dynamicColumnService.getExtendFieldSuffix();
					// jobExtendDynamicColumns.forEach((extendDynamicColumn) => {
					// 	const recordField = extendDynamicColumn.field.replace(extendFieldSuffix, '');
					// 	prjCostCodes[extendDynamicColumn.field] = priceListItem[recordField] / priceListItem.ExchangeRate;
					// });
					prjCostCodes['NewCurrencyFk'] = newCurrencyFk;
					this.setExchangeRateSuccess(prjCostCodes);
				}
			} else {
				prjCostCodes['MdcPriceListFk'] = priceListItem.PriceListFk;
				prjCostCodes['JobCostCodePriceVersionFk'] = priceListItem.PriceVersionFk;
				prjCostCodes['NewRate'] = priceListItem.Rate;
				prjCostCodes['NewDayWorkRate'] = priceListItem['SalesPrice'];
				prjCostCodes['NewCurrencyFk'] = priceListItem.CurrencyFk;
				// TODO sdynamicColumnService
				// let extendFieldSuffix = dynamicColumnService.getExtendFieldSuffix();
				// jobExtendDynamicColumns.forEach((extendDynamicColumn) => {
				// 	let recordField = extendDynamicColumn.field.replace(extendFieldSuffix, '');
				// 	prjCostCodes[extendDynamicColumn.field] = priceListItem[recordField];
				// });
				this.setExchangeRateSuccess(prjCostCodes);
			}
			prjCostCodes.NewFactorCosts = priceListItem.FactorCosts;
			prjCostCodes.NewFactorQuantity = priceListItem.FactorQuantity;
			prjCostCodes.NewRealFactorCosts = priceListItem.RealFactorCosts;
			prjCostCodes.NewRealFactorQuantity = priceListItem.RealFactorQuantity;
			prjCostCodes['NewFactorHour'] = priceListItem.FactorHour;

			prjCostCodes['NewCo2Source'] = priceListItem.Co2Source;
			prjCostCodes['NewCo2SourceFk'] = priceListItem.Co2SourceFk;
			prjCostCodes['NewCo2Project'] = priceListItem.Co2Project;
		} else {
			if (currencyChange === true) {
				// if change currencyFk, only set the currency. keep the other data.
				prjCostCodes['NewCurrencyFk'] = newCurrencyFk;
			} else {
				// TODO this.setDefault(prjCostCodes, dynamicColumnService);
			}
			this.setExchangeRateSuccess(prjCostCodes);
		}
		// service.gridRefresh();
		this.refreshPriceListRecordGrid(prjCostCodes);
	}

	public setDefault(prjCostCodes: PrjCostCodesEntity, dynamicColumnService: { setExtendValueBack: (arg0: PrjCostCodesEntity) => void }) {
		prjCostCodes['MdcPriceListFk'] = null;
		prjCostCodes['JobCostCodePriceVersionFk'] = null;
		prjCostCodes['NewRate'] = prjCostCodes.Rate;
		prjCostCodes['NewDayWorkRate'] = prjCostCodes.DayWorkRate;
		prjCostCodes.NewFactorCosts = prjCostCodes.FactorCosts;
		prjCostCodes.NewFactorQuantity = prjCostCodes.FactorQuantity;
		prjCostCodes.NewRealFactorCosts = prjCostCodes.RealFactorCosts;
		prjCostCodes.NewRealFactorQuantity = prjCostCodes.RealFactorQuantity;
		prjCostCodes['NewFactorHour'] = prjCostCodes.FactorHour;
		prjCostCodes['NewCurrencyFk'] = prjCostCodes.CurrencyFk;
		prjCostCodes['NewCo2Source'] = prjCostCodes.Co2Source;
		prjCostCodes['NewCo2SourceFk'] = prjCostCodes.Co2SourceFk;
		prjCostCodes['NewCo2Project'] = prjCostCodes.Co2Project;
		dynamicColumnService.setExtendValueBack(prjCostCodes);
	}

	public showExchangeRateError(prjCostCodes: PrjCostCodesEntity, error: string) {
		// const statusValues = inject(ProjectCostcodePriceListForJobStatusValueService);
		// prjCostCodes['Status'] = statusValues.error;
		prjCostCodes['ErrorMessage'] = error;
		return this.messageBoxService.showMsgBox(error, 'project.main.updateCostCodesPricesTitle', 'error');
	}

	public setExchangeRateSuccess(prjCostCodes: PrjCostCodesEntity) {
		// const statusValues = inject(ProjectCostcodePriceListForJobStatusValueService);
		// if (prjCostCodes.Status !== statusValues.success) {
		// 	prjCostCodes.Status = statusValues.success;
		// 	prjCostCodes.ErrorMessage = null;
		// }
	}

	public refreshPriceListRecordGrid(prjCostCodes: PrjCostCodesEntity) {
		// TODO BasicsCommonHeaderColumnCheckboxControllerService
		// if (this.getSelected() && this.getSelected().Id === prjCostCodes.Id) {
		// 	const childService = inject(ProjectCostcodesPriceListRecordDataService);
		// 	childService.gridRefresh();
		// 	$injector.get('basicsCommonHeaderColumnCheckboxControllerService').checkHeaderCheckBox('80c94a0fb2dc4048b54ca845febf2411', ['Selected']);
		// }
	}

	public getCheckedProjectCostCodes(projectCostCodes: PrjCostCodesEntity, checkedProjectCostCodes: PrjCostCodesEntity) {
		if (projectCostCodes !== null) {
			// TODO
			// projectCostCodes.forEach((item) => {
			// 	if (item.IsChecked && item.JobRateId && item.JobRateId >= 0) {
			// 		//	checkedProjectCostCodes.push(item);
			// 	}
			// 	if (item.ProjectCostCodes) {
			// 		this.getCheckedProjectCostCodes(item.ProjectCostCodes, checkedProjectCostCodes);
			// 		item.ProjectCostCodes = null;
			// 	}
			// });
		}
	}

	public convertNullToNum(costCodeList: PrjCostCodesEntity[]) {
		const list = costCodeList;
		if (!list || list.length <= 0) {
			return costCodeList;
		}
		while (!!list && list.length > 0) {
			const temp: PrjCostCodesEntity[] = [];
			list.forEach((item) => {
				item.Code = item.Code || '-';
			});
			list.forEach((item) => {
				item.DayWorkRate = (item.DayWorkRate ?? 0) - 0;
				item.FactorCosts = (item.FactorCosts ?? 0) - 0;
				item.FactorHour = (item.FactorHour ?? 0) - 0;
				item.FactorQuantity = (item.FactorQuantity ?? 0) - 0;
				//item.IsLabour = item.IsLabour ?? false;
				//item.IsRate = item.IsRate ?? false;
				//item.NewDayWorkRate = (item.NewDayWorkRate ?? 0) - 0;
				item.NewFactorCosts = (item.NewFactorCosts ?? 0) - 0;
				//item.NewFactorHour = (item.NewFactorHour ?? 0) - 0;
				item.NewFactorQuantity = (item.NewFactorQuantity ?? 0) - 0;
				//item.NewRate = (item.NewRate ?? 0) - 0;
				item.NewRealFactorCosts = (item.NewRealFactorCosts ?? 0) - 0;
				item.NewRealFactorQuantity = (item.NewRealFactorQuantity ?? 0) - 0;
				item.Rate = (item.Rate ?? 0) - 0;
				//item.RealFactorCosts = (item.RealFactorCosts ?? 0) - 0;
				item.RealFactorQuantity = (item.RealFactorQuantity ?? 0) - 0;
				//item.HourUnit = (item.HourUnit ?? 0) - 0;

				if (Array.isArray(item.ProjectCostCodes) && item.ProjectCostCodes.length > 0) {
					item.ProjectCostCodes.forEach((i) => {
						temp.push(i);
					});
				}
			});
		}
		return costCodeList;
	}

	public setFirstJobRate(dataList: PrjCostCodesEntity[]) {
		// TODO cloudCommonGridService
		// let originalIdMaps = {};
		// if (dataList && dataList.length > 0) {
		// 	let flattenList = [];
		// 	dataList.forEach((job) =>  {
		// 		cloudCommonGridService.flatten(job.ProjectCostCodes, flattenList, 'ProjectCostCodes');
		// 	});
		// 	flattenList.forEach((item) => {
		// 		if (!Object.prototype.hasOwnProperty.call(originalIdMaps, item.OriginalId)) {
		// 			if (item.JobRateId) {
		// 				item.FristJobRateFk = item.LgmJobFk;
		// 				originalIdMaps[item.OriginalId] = item;
		// 			}
		// 		} else if (item.JobRateId && originalIdMaps[item.OriginalId].JobRateId > item.JobRateId) {
		// 			originalIdMaps[item.OriginalId].FristJobRateFk = null;
		// 			item.FristJobRateFk = item.LgmJobFk;
		// 			originalIdMaps[item.OriginalId] = item;
		// 		}
		// 	});
		// }
	}
}
