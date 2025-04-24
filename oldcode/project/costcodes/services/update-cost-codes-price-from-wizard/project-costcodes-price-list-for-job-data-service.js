/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	angular.module(moduleName).factory('projectCostCodesPriceListForJobDataService', projectCostCodesPriceListForJobDataService);
	projectCostCodesPriceListForJobDataService.$inject = [
		'_',
		'$http',
		'$translate',
		'$injector',
		'platformModalService',
		'globals',
		'platformDataServiceFactory',
		'platformRuntimeDataService',
		'basicsLookupdataLookupFilterService',
		'projectMainUpdatePricesWizardCommonService',
		'projectCostCodesPriceListForJobProcessor',
		'cloudCommonGridService'
	];

	function projectCostCodesPriceListForJobDataService(
		_,
		$http,
		$translate,
		$injector,
		platformModalService,
		globals,
		platformDataServiceFactory,
		platformRuntimeDataService,
		basicsLookupdataLookupFilterService,
		projectMainUpdatePricesWizardCommonService,
		priceListForJobProcessor,
		cloudCommonGridService
	) {
		// filters
		let _projectId = -1;
		let _jobIds = [];
		let _costCodeIds = [];
		let serviceOptions = {
			module: angular.module(moduleName),
			serviceName: 'projectCostCodesPriceListForJobDataService',
			httpRead: {
				route: globals.webApiBaseUrl + 'project/costcodes/pricelist/', endRead: 'getprojectpricelistwithjob',
				usePostForRead: true,
				initReadData: function initReadData(readData) {
					readData.ProjectId = _projectId;
					readData.JobIds = _jobIds;
					readData.CostCodeIds = _costCodeIds;
				}
			},
			presenter: {
				tree: {
					parentProp: 'VritualParentId',
					childProp: 'ProjectCostCodes',
					incorporateDataRead: incorporateDataRead
				}
			},
			dataProcessor: [priceListForJobProcessor],
			entitySelection: {},
			modification: {},
			actions: {
				delete: true,
				create: true
			}
		};

		let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		let service = serviceContainer.service ? serviceContainer.service : {};
		let data = serviceContainer.data;
		// To filter only materials with resources
		let estimateMainService = $injector.get('estimateMainService');
		let estimateResourcesSummaryService = $injector.get('estimateResourcesSummaryService');
		let resourcesCostCodeJobs = [];
		// let projectMainUpdatePricesWizardCommonService = $injector.get('projectMainUpdatePricesWizardCommonService');
		function incorporateDataRead(responseData, data) {
			setFirstJobRate(responseData);
			let isUsingInEstimateResourceSummary = projectMainUpdatePricesWizardCommonService.isUsingInEstimateResourceSummary();
			if(isUsingInEstimateResourceSummary){
				resourcesCostCodeJobs = _.map(_.filter(estimateResourcesSummaryService.getList(),function(resource) {
					return resource.EstResourceTypeFk === 1;
				}), function(resource){
					return { MdcCostCodeFk: resource.MdcCostCodeFk, LgmJobFk: resource.LgmJobFk ? resource.LgmJobFk : estimateMainService.getLgmJobId(resource)  };
				});
			}

			_.forEach(responseData, function (item) {
				item.isJob = true;
				item.image = 'ico-accordion-root';
				item.Rate = null;
				item.NewRate = null;
				item.DayWorkRate = null;
				item.NewDayWorkRate = null;
				item.FactorCosts = null;
				item.NewFactorCosts = null;
				item.FactorQuantity = null;
				item.NewFactorQuantity = null;
				item.RealFactorCosts = null;
				item.NewRealFactorCosts = null;
				item.RealFactorQuantity = null;
				item.NewRealFactorQuantity = null;
				item.FactorHour = null;
				item.NewFactorHour = null;
				item.IsLabour = null;
				item.IsRate = null;
				item.NewCo2Source = null;
				item.NewCo2SourceFk = null;
				item.NewCo2Project = null;
				let readonlyFields = [];
				readonlyFields.push({field: 'NewRate', readonly: true});
				readonlyFields.push({field: 'NewDayWorkRate', readonly: true});
				readonlyFields.push({field: 'NewFactorCosts', readonly: true});
				readonlyFields.push({field: 'NewFactorQuantity', readonly: true});
				readonlyFields.push({field: 'NewCo2Source', readonly: true});
				readonlyFields.push({field: 'NewCo2SourceFk', readonly: true});
				platformRuntimeDataService.readonly(item, readonlyFields);
				if (item.ProjectCostCodes && item.ProjectCostCodes.length > 0) {
					setIconForList(item.ProjectCostCodes, isUsingInEstimateResourceSummary);
					if(isUsingInEstimateResourceSummary) {
						item.ProjectCostCodes = _.filter(item.ProjectCostCodes, { existsInResources: true });
					}
				}
			});
			let filteredList = _.filter(responseData, function(item){
				return item.ProjectCostCodes && item.ProjectCostCodes.length > 0;
			});
			if(filteredList.length > 0){
				setDynamicDataToColumn(filteredList);
			}

			return data.handleReadSucceeded(filteredList, data);
		}

		// Set dynamic data to column
		function setDynamicDataToColumn(filteredList) {
			let dynamicColumnService = $injector.get('projectCostCodesPriceListJobDynColumnService');
			var flatList = [];
			_.forEach(filteredList, function (item) {
				cloudCommonGridService.flatten(item.ProjectCostCodes, flatList, 'ProjectCostCodes');
			});
			dynamicColumnService.attachDataToColumn(flatList).then(function(){
				service.gridRefresh();
			});
		}

		function setIconForList(prjCostCodesList, isUsingInEstimateResourceSummary){
			_.forEach(prjCostCodesList, function (prjCostCodes) {
				prjCostCodes.image = 'ico-accordion-pos';
				if(prjCostCodes.ProjectCostCodes && prjCostCodes.ProjectCostCodes.length){
					setIconForList(prjCostCodes.ProjectCostCodes, isUsingInEstimateResourceSummary);
				}
				if(isUsingInEstimateResourceSummary) {
					if (!_.some(prjCostCodes.ProjectCostCodes, function (child) {
						return child.existsInResources === true; })) {
						prjCostCodes.ProjectCostCodes = null;
						prjCostCodes.HasChildren = false;
						prjCostCodes.existsInResources = _.findIndex(resourcesCostCodeJobs, {
							MdcCostCodeFk: prjCostCodes.BasCostCode ? prjCostCodes.BasCostCode.Id : null, LgmJobFk: prjCostCodes.LgmJobFk }) > -1;
					} else {
						prjCostCodes.existsInResources = true;
						prjCostCodes.ProjectCostCodes = _.filter(prjCostCodes.ProjectCostCodes, {existsInResources: true});
					}
				}
			});
		}

		data.markItemAsModified = function () {
		};

		service.markItemAsModified = function () {
		};

		service.setFilters = function setFilters(jobIds, costCodeIds) {
			let selectPrj = projectMainUpdatePricesWizardCommonService.getProject();
			_projectId = selectPrj ? selectPrj.Id : -1;
			_jobIds = jobIds || [];
			_costCodeIds = costCodeIds || [];
		};

		service.clearFiltersAndData = function clearFiltersAndData() {
			_projectId = -1;
			_jobIds = [];
			_costCodeIds = [];
			service.setList([]);
			let childService = $injector.get('projectCostCodesPriceListRecordDataService');
			childService.setList([]);
		};

		service.setSeletedToAll = function setSeletedToAll(selected) {
			let list = service.getList();
			_.forEach(list, function (item) {
				item.IsChecked = selected;
			});
		};

		service.setAllBaseSelected = function setAllBaseSelected() {
			let list = service.getList();
			let basCostCodesColumnService = $injector.get('projectCostCodesPriceListRecordBasCostCodesColumnService');
			_.forEach(list, function (item) {
				if (Object.prototype.hasOwnProperty.call(item, 'PriceListForUpdate') && _.isArray(item.PriceListForUpdate)) {
					_.forEach(item.PriceListForUpdate, function (pItem) {
						if (pItem.PriceVersionFk === -1) {
							pItem.Selected = true;
							basCostCodesColumnService.attachDataToColumn([pItem]).then(function () {
								service.computePrjCostCodes(item);
							});
						} else {
							pItem.Selected = false;
						}
					});
				}
			});
		};

		service.changeCostCodePriceVersionByJob = function setCostCodePriceVersionByJob(job, priceVersionFk) {
			job.JobCostCodePriceVersionFk = priceVersionFk;
			if (job.ProjectCostCodes && job.ProjectCostCodes.length > 0) {
				let jobPriceVersionFk = job.JobCostCodePriceVersionFk;
				_.forEach(job.ProjectCostCodes, function (prjCostCodes) {
					service.changeCostCodePriceVersion(prjCostCodes, jobPriceVersionFk);
				});
			}
		};

		service.changeCostCodePriceVersion = function changeCostCodePriceVersion(prjCostCodes, priceVersionFk, needCompute) {
			let hasPriceVersion = false;
			if (prjCostCodes.PriceListForUpdate && prjCostCodes.PriceListForUpdate.length > 0) {
				_.forEach(prjCostCodes.PriceListForUpdate, function (priceList) {
					priceList.Selected = (priceList.PriceVersionFk === priceVersionFk);
					if (priceList.PriceVersionFk === priceVersionFk) {
						priceList.Selected = true;
						hasPriceVersion = true;
					} else {
						priceList.Selected = false;
					}
				});
				refreshPriceListRecordGrid(prjCostCodes);
			}
			if (hasPriceVersion) {
				prjCostCodes.JobCostCodePriceVersionFk = priceVersionFk;
			}
			if (needCompute !== false) {
				service.computePrjCostCodes(prjCostCodes);
			}

			if(prjCostCodes.ProjectCostCodes && prjCostCodes.ProjectCostCodes.length>0){
				angular.forEach(prjCostCodes.ProjectCostCodes,function (item) {
					service.changeCostCodePriceVersion(item, priceVersionFk, needCompute);
				});
			}
		};

		function getExchangeRateMap(prjCostCodes, priceListCurrencyFk, newCurrencyFk){
			let exchangeRateMaps = prjCostCodes.ExchangeRateMaps;
			let fromCurrencyFk = priceListCurrencyFk;
			let toCurrencyFk = newCurrencyFk || prjCostCodes.NewCurrencyFk;
			if(fromCurrencyFk === toCurrencyFk) {
				return {
					FromCurrencyFk: fromCurrencyFk,
					ToCurrencyFk: toCurrencyFk,
					ExchangeRate: 1,
					HasError: false,
					ErrorMessage: null
				};
			}
			return _.find(exchangeRateMaps, {FromCurrencyFk: fromCurrencyFk, ToCurrencyFk: toCurrencyFk});
		}

		// if trigger from currencyFk set currencyChange to true and set the newCurrencyFk.
		service.computePrjCostCodes = function computePrjCostCodes(prjCostCodes, currencyChange, newCurrencyFk) {
			currencyChange = currencyChange || false;
			newCurrencyFk = newCurrencyFk || prjCostCodes.NewCurrencyFk;
			let selectedPriceList = _.filter(prjCostCodes.PriceListForUpdate || [], {Selected: true});
			let dynamicColumnService = $injector.get('projectCostCodesPriceListJobDynColumnService');
			let jobExtendDynamicColumns = _.filter(dynamicColumnService.getDynamicColumns(), function(column){ return column.isExtend; });
			if (selectedPriceList.length > 1) { // compute price by weighting
				let rateByWeighting = 0;
				let salesPriceByWeighting = 0;
				let factorCostsByWeighting = 0;
				let factorQuantityByWeighting = 0;
				let realFactorCostsByWeighting = 0;
				let realFactorQuantityByWeighting = 0;
				let factorHourByWeighting = 0;
				let co2ProjectByWeighting = null;
				let co2SourceByWeighting = null;
				let dynamicByWeighting = [];
				let weightingTotal = 0;
				let noExchangeRate = false;
				let errorMessage = '';
				let projectCostCodesPriceListRecordDynColumnService = $injector.get('projectCostCodesPriceListRecordDynColumnService');
				let recordDynamicColumns = projectCostCodesPriceListRecordDynColumnService.getDynamicColumns();
				_.forEach(selectedPriceList, function (item) {
					let exchangeRateMap = getExchangeRateMap(prjCostCodes, item.CurrencyFk);
					if (angular.isUndefined(exchangeRateMap) || exchangeRateMap.HasError) {
						noExchangeRate = true;
						errorMessage = exchangeRateMap.ErrorMessage;
						return false; // break.
					}
					if (item.Weighting === 0) {
						return true; // continue.
					}
					item.ExchangeRate = exchangeRateMap.ExchangeRate;
					rateByWeighting += item.Rate / item.ExchangeRate * item.Weighting;
					salesPriceByWeighting += item.SalesPrice / item.ExchangeRate * item.Weighting;
					factorCostsByWeighting += item.FactorCosts * item.Weighting;
					factorQuantityByWeighting += item.FactorQuantity * item.Weighting;
					realFactorCostsByWeighting += item.RealFactorCosts * item.Weighting;
					realFactorQuantityByWeighting += item.RealFactorQuantity * item.Weighting;
					factorHourByWeighting += item.FactorHour * item.Weighting;

					if (item.Co2Project !== null) {
						co2ProjectByWeighting += item.Co2Project * item.Weighting;
					}
					if (item.Co2Source !== null) {
						co2SourceByWeighting += item.Co2Source * item.Weighting;
					}
					_.forEach(recordDynamicColumns, function (recordColumn, index) {
						if (!dynamicByWeighting[index]) {
							dynamicByWeighting[index] = 0;
						}
						dynamicByWeighting[index] += item[recordColumn.field] / item.ExchangeRate * item.Weighting;
					});
					weightingTotal += item.Weighting;
				});
				if (noExchangeRate) {
					setDefault(prjCostCodes, dynamicColumnService);
					showExchangeRateError(prjCostCodes, errorMessage);
				} else {
					prjCostCodes.MdcPriceListFk = -1;
					prjCostCodes.JobCostCodePriceVersionFk = -2;
					prjCostCodes.NewRate = weightingTotal === 0 ? 0 : rateByWeighting / weightingTotal;
					prjCostCodes.NewDayWorkRate = weightingTotal === 0 ? 0 : salesPriceByWeighting / weightingTotal;
					prjCostCodes.NewFactorCosts = weightingTotal === 0 ? prjCostCodes.NewFactorCosts : factorCostsByWeighting / weightingTotal;
					prjCostCodes.NewFactorQuantity = weightingTotal === 0 ? prjCostCodes.NewFactorQuantity : factorQuantityByWeighting / weightingTotal;
					prjCostCodes.NewRealFactorCost = weightingTotal === 0 ? prjCostCodes.NewRealFactorCost : realFactorCostsByWeighting / weightingTotal;
					prjCostCodes.NewRealFactorQuantity = weightingTotal === 0 ? prjCostCodes.NewRealFactorQuantity : realFactorQuantityByWeighting / weightingTotal;
					prjCostCodes.NewFactorHour = weightingTotal === 0 ? prjCostCodes.NewFactorHour : factorHourByWeighting / weightingTotal;
					_.forEach(jobExtendDynamicColumns, function (ExtendDynamicColumn, index) {
						prjCostCodes[ExtendDynamicColumn.field] = weightingTotal === 0 ? 0 : dynamicByWeighting[index] / weightingTotal;
					});
					setExchangeRateSuccess(prjCostCodes);
				}
				prjCostCodes.NewCo2Project = weightingTotal === 0 ? prjCostCodes.NewCo2Project : co2ProjectByWeighting !== null ? co2ProjectByWeighting / weightingTotal : null;
				prjCostCodes.NewCo2Source = weightingTotal === 0 ? prjCostCodes.NewCo2Source : co2SourceByWeighting !== null ? co2SourceByWeighting / weightingTotal : null;
				prjCostCodes.NewCo2SourceFk = selectedPriceList.sort((n,m)=>n.Id-m.Id)[0].Co2SourceFk;
			} else if (selectedPriceList.length === 1) { // overwrite price and currency.
				let priceListItem = selectedPriceList[0];
				if(currencyChange === true && priceListItem.CurrencyFk !== newCurrencyFk){
					let noExchangeRate = false;
					let errorMessage = '';
					let exchangeRateMap = getExchangeRateMap(prjCostCodes, priceListItem.CurrencyFk, newCurrencyFk);
					if (angular.isUndefined(exchangeRateMap) || exchangeRateMap.HasError) {
						noExchangeRate = true;
						errorMessage = exchangeRateMap.ErrorMessage;
					}else{
						priceListItem.ExchangeRate = exchangeRateMap.ExchangeRate;
					}
					if (noExchangeRate) {
						setDefault(prjCostCodes, dynamicColumnService);
						showExchangeRateError(prjCostCodes, errorMessage);
					} else {
						// if currency is modified, means the data is not the same of price list, so set the price list to null.
						prjCostCodes.MdcPriceListFk = null;
						prjCostCodes.JobCostCodePriceVersionFk = null;
						prjCostCodes.NewRate = priceListItem.Rate / priceListItem.ExchangeRate;
						prjCostCodes.NewDayWorkRate = priceListItem.SalesPrice / priceListItem.ExchangeRate;
						// dynamicColumnService
						let extendFieldSuffix = dynamicColumnService.getExtendFieldSuffix();
						_.forEach(jobExtendDynamicColumns, function(extendDynamicColumn) {
							let recordField = extendDynamicColumn.field.replace(extendFieldSuffix, '');
							prjCostCodes[extendDynamicColumn.field] = priceListItem[recordField] / priceListItem.ExchangeRate;
						});
						prjCostCodes.NewCurrencyFk = newCurrencyFk;
						setExchangeRateSuccess(prjCostCodes);
					}
				} else {
					prjCostCodes.MdcPriceListFk = priceListItem.PriceListFk;
					prjCostCodes.JobCostCodePriceVersionFk = priceListItem.PriceVersionFk;
					prjCostCodes.NewRate = priceListItem.Rate;
					prjCostCodes.NewDayWorkRate = priceListItem.SalesPrice;
					prjCostCodes.NewCurrencyFk = priceListItem.CurrencyFk;
					// dynamicColumnService
					let extendFieldSuffix = dynamicColumnService.getExtendFieldSuffix();
					_.forEach(jobExtendDynamicColumns, function(extendDynamicColumn) {
						let recordField = extendDynamicColumn.field.replace(extendFieldSuffix, '');
						prjCostCodes[extendDynamicColumn.field] = priceListItem[recordField];
					});
					setExchangeRateSuccess(prjCostCodes);
				}
				prjCostCodes.NewFactorCosts = priceListItem.FactorCosts;
				prjCostCodes.NewFactorQuantity = priceListItem.FactorQuantity;
				prjCostCodes.NewRealFactorCosts = priceListItem.RealFactorCosts;
				prjCostCodes.NewRealFactorQuantity = priceListItem.RealFactorQuantity;
				prjCostCodes.NewFactorHour = priceListItem.FactorHour;

				prjCostCodes.NewCo2Source = priceListItem.Co2Source;
				prjCostCodes.NewCo2SourceFk = priceListItem.Co2SourceFk;
				prjCostCodes.NewCo2Project = priceListItem.Co2Project;
			} else {
				if(currencyChange === true) { // if change currencyFk, only set the currency. keep the other data.
					prjCostCodes.NewCurrencyFk = newCurrencyFk;
				}else{
					setDefault(prjCostCodes, dynamicColumnService);
				}
				setExchangeRateSuccess(prjCostCodes);
			}
			service.gridRefresh();
			refreshPriceListRecordGrid(prjCostCodes);
		};

		service.parentService = function () {
		};

		service.assertSelectedEntityEntry = function () {
		};

		service.addEntitiesToModified =function () {
		};

		function setDefault(prjCostCodes, dynamicColumnService) {
			prjCostCodes.MdcPriceListFk = null;
			prjCostCodes.JobCostCodePriceVersionFk = null;
			prjCostCodes.NewRate = prjCostCodes.Rate;
			prjCostCodes.NewDayWorkRate = prjCostCodes.DayWorkRate;
			prjCostCodes.NewFactorCosts =  prjCostCodes.FactorCosts;
			prjCostCodes.NewFactorQuantity =  prjCostCodes.FactorQuantity;
			prjCostCodes.NewRealFactorCosts = prjCostCodes.RealFactorCosts;
			prjCostCodes.NewRealFactorQuantity =  prjCostCodes.RealFactorQuantity;
			prjCostCodes.NewFactorHour =  prjCostCodes.FactorHour;
			prjCostCodes.NewCurrencyFk = prjCostCodes.CurrencyFk;
			prjCostCodes.NewCo2Source = prjCostCodes.Co2Source;
			prjCostCodes.NewCo2SourceFk = prjCostCodes.Co2SourceFk;
			prjCostCodes.NewCo2Project = prjCostCodes.Co2Project;
			dynamicColumnService.setExtendValueBack(prjCostCodes);
		}

		function showExchangeRateError(prjCostCodes, error) {
			let statusValues = $injector.get('projectCostcodesPriceListForJobStatusValues');
			prjCostCodes.Status = statusValues.error;
			prjCostCodes.ErrorMessage = error;
			return platformModalService.showMsgBox(error, 'project.main.updateCostCodesPricesTitle', 'error');
		}

		function setExchangeRateSuccess(prjCostCodes) {
			let statusValues = $injector.get('projectCostcodesPriceListForJobStatusValues');
			if (prjCostCodes.Status !== statusValues.success) {
				prjCostCodes.Status = statusValues.success;
				prjCostCodes.ErrorMessage = null;
			}
		}

		function refreshPriceListRecordGrid(prjCostCodes) {
			if (service.getSelected() && service.getSelected().Id === prjCostCodes.Id) {
				let childService = $injector.get('projectCostCodesPriceListRecordDataService');
				childService.gridRefresh();
				$injector.get('basicsCommonHeaderColumnCheckboxControllerService').checkHeaderCheckBox('80c94a0fb2dc4048b54ca845febf2411', ['Selected']);
			}
		}

		service.additionalPriceVersions = [{
			Id: -1,
			PriceListFk: -1,
			PriceListDescription: $translate.instant('project.main.updateCostCodeForJob.noData'),
			DescriptionInfo: {
				Description: $translate.instant('project.main.updateCostCodeForJob.baseVersion'),
				Translated: $translate.instant('project.main.updateCostCodeForJob.baseVersion')
			}
		}, {
			Id: -2,
			PriceListFk: -1,
			PriceListDescription: $translate.instant('project.main.updateCostCodeForJob.noData'),
			DescriptionInfo: {
				Description: $translate.instant('project.main.updateCostCodeForJob.weightedVersion'),
				Translated: $translate.instant('project.main.updateCostCodeForJob.weightedVersion')
			}
		}];

		service.calcAllRealFactors = function () {
			let list = service.getList();
			_.forEach(list, function (item) {
				service.calcRealFactors(item, item.NewFactorCosts, 'NewFactorCosts');
				service.calcRealFactors(item, item.NewFactorQuantity, 'NewFactorQuantity');
			});
		};

		service.calcRealFactors = function calcRealFactors(entity, value, model) {
			entity[model] = value;
			let parentId = _.get(entity, 'VirtualParentId');
			let parent = _.find(service.getList(), {'Id': parentId});
			let prjRealFactor = '', newRealFactor = '';
			let realFactor = 1;
			if (model === 'NewFactorCosts') {
				prjRealFactor = 'RealFactorCosts';
				newRealFactor = 'NewRealFactorCosts';
			} else if (model === 'NewFactorQuantity') {
				prjRealFactor = 'RealFactorQuantity';
				newRealFactor = 'NewRealFactorQuantity';
			}
			if (parent && prjRealFactor) {
				realFactor = parent[prjRealFactor] ? parent[prjRealFactor] : 1;
			}
			if (entity.OriginalId > 0 && newRealFactor) {
				entity[newRealFactor] = entity[model] * realFactor;
			}
		};

		function getCheckedProjectCostCodes(projectCostCodes, checkedProjectCostCodes) {
			_.forEach(projectCostCodes, function (item) {
				if(item.IsChecked && item.JobRateId && item.JobRateId >= 0) {
					checkedProjectCostCodes.push(item);
				}
				if (item.ProjectCostCodes) {
					getCheckedProjectCostCodes(item.ProjectCostCodes, checkedProjectCostCodes);
					item.ProjectCostCodes = null;
				}
			});
		}

		service.updatePrice = function () {
			let list = service.getList();
			let dataToSave = [];
			let allProjectCostCodes = [];
			let dynamicColumnService = $injector.get('projectCostCodesPriceListJobDynColumnService');
			_.forEach(list, function (item) {
				if (item.isJob) {
					let checkedProjectCostCodes = [];
					let newItem = angular.copy(item);
					getCheckedProjectCostCodes(newItem.ProjectCostCodes, checkedProjectCostCodes);
					newItem.ProjectCostCodes = checkedProjectCostCodes;
					dataToSave.push(newItem);
					allProjectCostCodes.push.apply(allProjectCostCodes, checkedProjectCostCodes);
				}
			});
			return dynamicColumnService.saveDynamicValues(allProjectCostCodes).then(function(){
				return $http.post(globals.webApiBaseUrl + 'project/costcodes/pricelist/updatepricebypriceversion', convertNullToNum(dataToSave)).then(function (response) {
					return (response.data);
				});
			});
		};

		function convertNullToNum(costCodeList){
			let list = costCodeList;
			if(!list || list.length <= 0){
				return costCodeList;
			}
			while (!!list && list.length > 0){
				let temp = [];
				// for root level, cause no Code, then set a default one.
				_.forEach(list, function (item){
					item.Code = item.Code || '-';
				});
				_.forEach(list, function (item){
					item.DayWorkRate -= 0;
					item.FactorCosts -= 0;
					item.FactorHour -= 0;
					item.FactorQuantity -= 0;
					item.IsLabour = item.IsLabour || false;
					item.IsRate = item.IsRate || false;
					item.NewDayWorkRate -= 0;
					item.NewFactorCosts -= 0;
					item.NewFactorHour -= 0;
					item.NewFactorQuantity -= 0;
					item.NewRate -= 0;
					item.NewRealFactorCosts -= 0;
					item.NewRealFactorQuantity -= 0;
					item.Rate -= 0;
					item.RealFactorCosts -= 0;
					item.RealFactorQuantity -= 0;
					item.HourUnit -= 0;
					if(!!item.ProjectCostCodes && item.ProjectCostCodes.length > 0){
						_.forEach(item.ProjectCostCodes, function (i){
							temp.push(i);
						});
					}
					list = temp;
				});
			}
			return costCodeList;
		}

		let filters = [
			{
				key: 'project-main-costcodes-price-price-version-filter',
				serverSide: false,
				fn: function (lookupItem, item) {
					if (item.isJob) { // this is a job.
						return lookupItem.Id !== -2;
					}
					if (item.PriceListForUpdate && item.PriceListForUpdate.length > 0) {
						let versionIds = _.map(item.PriceListForUpdate, 'PriceVersionFk');
						return versionIds.indexOf(lookupItem.Id) !== -1;
					}
					return false;
				}
			},
			{
				key: 'project-main-costcodes-currency-edit-filter',
				serverSide: false,
				fn: function (lookupItem, item) {
					if (item.isJob) { // this is a job.
						return false;
					}
					if (item.CurrencyFkList && item.CurrencyFkList.length > 0) {
						return item.CurrencyFkList.indexOf(lookupItem.Id) !== -1;
					}
					return true;
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		function setFirstJobRate(dataList) {
			var originalIdMaps = {};
			if (dataList && dataList.length > 0) {
				var flattenList = [];
				_.forEach(dataList, function (job) {
					cloudCommonGridService.flatten(job.ProjectCostCodes, flattenList, 'ProjectCostCodes');
				});
				_.forEach(flattenList, function (item) {
					if (!Object.prototype.hasOwnProperty.call(originalIdMaps, item.OriginalId)) {
						if (item.JobRateId) {
							item.FristJobRateFk = item.LgmJobFk;
							originalIdMaps[item.OriginalId] = item;
						}
					} else if (item.JobRateId && originalIdMaps[item.OriginalId].JobRateId > item.JobRateId) {
						originalIdMaps[item.OriginalId].FristJobRateFk = null;
						item.FristJobRateFk = item.LgmJobFk;
						originalIdMaps[item.OriginalId] = item;
					}
				});
			}
		}

		return service;
	}
})(angular);