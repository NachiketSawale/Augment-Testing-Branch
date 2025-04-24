/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'controlling.actuals';
	let actualsModule = angular.module(moduleName);

	/**
     * @ngdoc service
     *
     * @name controllingActualsCostDataListService
     * @function
     *
     * @description
     * controllingActualsCostDataListService is the data service for all currency related functionality.
     */

	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).factory('controllingActualsCostDataListService', ['_', '$http', '$q', '$rootScope', 'globals', 'platformDataServiceFactory',  'platformRuntimeDataService',
		'controllingActualsCostHeaderListService', 'controllingActualsCommonService', 'basicsLookupdataLookupFilterService','platformDataValidationService','basicsCommonMandatoryProcessor',
		'platformContextService','$injector', 'PlatformMessenger',
		function (_, $http, $q, $rootScope, globals, platformDataServiceFactory, platformRuntimeDataService,
			parentService, controllingActualsCommonService, basicsLookupdataLookupFilterService, platformDataValidationService, basicsCommonMandatoryProcessor,
			platformContextService, $injector, PlatformMessenger) {
			let service = null;
			let selectedCostHeaderItem, costHeaderFk;
			let _exchangeRateList = [];
			let _companyExchangeRateList = null;
			let amountFields = ['Amount', 'AmountOc', 'AmountProject'];

			// TODO: check if createData is used or can be removed
			// var createData = {};


			// The instance of the main service - to be filled with functionality below
			let controllingActualsCostDataListServiceOptions = {

				flatLeafItem: {
					module: actualsModule,
					// serviceName: 'controllingActualsCostDataListService',
					httpCreate: {
						route: globals.webApiBaseUrl + 'controlling/actuals/costdata/',
						endCreate: 'create'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'controlling/actuals/costdata/',
						endRead: 'list',
						initReadData: function (readData) {
							_exchangeRateList = [];
							_companyExchangeRateList = [];
							let selectedCostDataHeader = parentService.getSelected();
							readData.filter = '?mainItemId=' + (selectedCostDataHeader ? selectedCostDataHeader.Id : -1);
						}
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'controlling/actuals/costdata/',
						endDelete: 'delete'
					},
					entityRole: {
						leaf: {
							itemName: 'controllingActualsCostData',
							// moduleName: 'cloud.desktop.moduleDisplayNameControllingActuals',
							parentService: parentService
						}},
					entitySelection: {},
					presenter: {
						list: {
							isInitialSorted: true,
							initCreationData: function initCreationData(creationData) {
								selectedCostHeaderItem = parentService.getSelected();
								$rootScope.parentEntity = selectedCostHeaderItem;

								if (selectedCostHeaderItem && selectedCostHeaderItem.Id > 0) {
									creationData.CompanyCostHeaderFk = selectedCostHeaderItem.Id;
									creationData.CompanyCostHeaderIsFinal = !!selectedCostHeaderItem.IsFinal;
									creationData.CurrencyFk = selectedCostHeaderItem.CurrencyFk && selectedCostHeaderItem.CurrencyFk > 0 ? selectedCostHeaderItem.CurrencyFk : 0;
									creationData.LedgerContextFk = selectedCostHeaderItem.LedgerContextFk;
								}
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								var items = null;
								costHeaderFk = parentService.getSelectedCostHeaderId();
								selectedCostHeaderItem = parentService.getSelectedCostHeaderItem();
								var flag = true;
								if (costHeaderFk !== null && costHeaderFk > 0)
								{
									items = _.filter(readItems, {'CompanyCostHeaderFk': costHeaderFk});
								}
								else
								{
									items = readItems;
								}
								_.each(readItems, function (item) {
									if (selectedCostHeaderItem){
										item.LedgerContextFk = selectedCostHeaderItem.LedgerContextFk;
										item.ProjectFk = selectedCostHeaderItem.ProjectFk;
									}else{
										item.LedgerContextFk = null;
									}

									if (item.CurrencyFk === null) {
										item.CurrencyFk = selectedCostHeaderItem ?  selectedCostHeaderItem.CurrencyFk : null;
									}
									else {
										flag = !item.IsFixedAmount && selectedCostHeaderItem && item.CurrencyFk === selectedCostHeaderItem.CurrencyFk;
										let fields = [
											{field: 'AmountOc', readonly: flag}
										];
										platformRuntimeDataService.readonly(item, fields);
									}
								});
								service.onListReLoaded.fire();
								return data.handleReadSucceeded(items, data);
							}

						}
					},
					dataProcessor: [{
						processItem: function (item){
							service.addRepeatCheckKey(item);
							controllingActualsCommonService.processItem(item);
						}
					}]
				} };

			let serviceContainer = platformDataServiceFactory.createNewComplete(controllingActualsCostDataListServiceOptions);
			serviceContainer.data.doesRequireLoadAlways = true;

			service = serviceContainer.service;
			let lookupFilter = [
				{
					key: 'est-prj-controlling-unit-filter',
					serverSide: true,
					serverKey: 'controlling.structure.prjcontrollingunit.filterkey',
					fn: function () {
						return selectedCostHeaderItem ? 'ProjectFk=' + selectedCostHeaderItem.ProjectFk : 'ProjectFk=' + null;
					}
				},
				{
					key: 'actual-controlling-by-prj-filter',
					serverSide: true,
					serverKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
					fn: function (entity) {
						return {
							ByStructure: true,
							ExtraFilter: false,
							PrjProjectFk: (entity === undefined || entity === null) ? null : entity.ProjectFk,
							CompanyFk: platformContextService.getContext().clientId,
							FilterKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
							IsProjectReadonly: function () {
								let actualHeader = $injector.get('controllingActualsCostHeaderListService').getSelected();
								return actualHeader ? actualHeader.ProjectFk : false;
							},
							IsCompanyReadonly: function (){
								return true;
							}
						};
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(lookupFilter);

			service.onListReLoaded = new PlatformMessenger();

			service.loadCostDataByCostHeaderId = function loadCostDataByCostHeaderId(costHeaderItem) {
				return $http.get(globals.webApiBaseUrl + 'controlling/actuals/costdata/listbycostheaderid?id=' + costHeaderItem.Id).
					then(function (response){
						return response.data;
					});
			};

			service.setCostHeaderPrjInfo = function setCostHeaderPrjInfo(projectFk){
				_.forEach(service.getList(), function(costData){
					costData.ProjectFk = projectFk;
				});
			};

			service.getCompanyExchangeRate = function getCompanyExchangeRate(mdcControllingUnitFk, homeCurrencyFk, foreignCurrencyFk, isFixedAmount){
				let deffered = $q.defer();

				if(mdcControllingUnitFk <= 0 || homeCurrencyFk <= 0 || foreignCurrencyFk <= 0 || homeCurrencyFk === foreignCurrencyFk || isFixedAmount){
					deffered.resolve({ ExchangeRate: 1 });
					return deffered.promise;
				}

				let companyExchangeRate = _.find(_companyExchangeRateList, function(exchangeRate){
					return exchangeRate.MdcControllingUnitFk === mdcControllingUnitFk && exchangeRate.HomeCurrencyFk === homeCurrencyFk && exchangeRate.ForeignCurrencyFk === foreignCurrencyFk;
				});

				if (!companyExchangeRate) {
					let request = {
						MdcControllingUnitFk: mdcControllingUnitFk,
						CurrencyFk: homeCurrencyFk,
						ForeignCurrencyFk: foreignCurrencyFk
					};
					$http.post(globals.webApiBaseUrl + 'controlling/actuals/costdata/getexchangerate', request).then(function (response) {
						companyExchangeRate = response.data;
						_companyExchangeRateList.push(companyExchangeRate);
						deffered.resolve(companyExchangeRate);
					});
				} else {
					deffered.resolve(companyExchangeRate);
				}

				return deffered.promise;
			};

			service.getExchangeRate = function getExchangeRate(mdcControllingUnitFk, homeCurrencyFk){
				let deffered = $q.defer();

				if(!mdcControllingUnitFk || mdcControllingUnitFk <= 0 || !homeCurrencyFk || homeCurrencyFk <= 0){
					deffered.resolve({ ExchangeRate: 1 });
					return deffered.promise;
				}

				let exchangeRate = _.find(_exchangeRateList, function(exchangeRate){
					return exchangeRate.MdcControllingUnitFk === mdcControllingUnitFk && exchangeRate.HomeCurrencyFk === homeCurrencyFk;
				});

				if (!exchangeRate) {
					let request = {
						MdcControllingUnitFk: mdcControllingUnitFk,
						CurrencyFk: homeCurrencyFk,
						ForeignCurrencyFk: -1,
					};
					$http.post(globals.webApiBaseUrl + 'controlling/actuals/costdata/getexchangerate', request).then(function (response) {
						exchangeRate = response.data;
						_exchangeRateList.push(exchangeRate);
						deffered.resolve(exchangeRate);
					});
				} else {
					deffered.resolve(exchangeRate);
				}

				return deffered.promise;
			};

			service.calculateItemAmount = function(item, column){


				let promises = [];
				let selectedCostHeader = parentService.getSelected();
				let companyCurrencyFk = selectedCostHeader.CurrencyFk;

				promises.push(service.getCompanyExchangeRate(item.MdcControllingUnitFk, companyCurrencyFk, item.CurrencyFk, item.IsFixedAmount));
				promises.push(service.getExchangeRate(item.MdcControllingUnitFk, companyCurrencyFk));

				$q.all(promises).then(function(response){
					let companyExchange = response[0];
					let projectExchange = response[1];

					if(!item.IsFixedAmount){
						if(column === 'Amount'){
							item.AmountOc = companyExchange.ExchangeRate !== 0 ? item.Amount / companyExchange.ExchangeRate : item.Amount;
						}else if(column === 'AmountOc'){
							item.Amount = item.AmountOc * companyExchange.ExchangeRate;
						}
					}

					if(projectExchange){
						let projectCurrencyFk = projectExchange.ForeignCurrencyFk;
						if (projectCurrencyFk === companyCurrencyFk){
							item.AmountProject = item.Amount;
						}else if(projectCurrencyFk === item.CurrencyFk){
							item.AmountProject = item.AmountOc;
						}else{
							item.AmountProject = projectExchange.ExchangeRate !== 0 ? item.Amount / projectExchange.ExchangeRate : item.AmountProject;
						}
					}

					service.recalculateTotal();
					service.gridRefresh();
				});
			};

			let baseOnDeleteDone = serviceContainer.data.onDeleteDone;
			serviceContainer.data.onDeleteDone = function (deleteParams, data, response) {
				baseOnDeleteDone(deleteParams, data, response);
				service.recalculateTotal();
			};

			service.recalculateTotal = function recalculateTotal(){
				let list = service.getList();
				let selectedCostHeader = parentService.getSelected();

				if(list.length > 0 && selectedCostHeader){
					selectedCostHeader.Total = 0;
					selectedCostHeader.TotalOc = 0;
					_.forEach(service.getList(), function(costData){
						selectedCostHeader.Total += _.isNumber(costData.Amount) ? costData.Amount : 0;
						selectedCostHeader.TotalOc += _.isNumber(costData.AmountOc) ? costData.AmountOc : 0;
					});

					parentService.markItemAsModified(selectedCostHeader);
					parentService.gridRefresh();
				}
			};

			let onCreateSucceeded = serviceContainer.data.onCreateSucceeded;
			serviceContainer.data.onCreateSucceeded = function (newData, data){
				if (newData){
					let costHeader = parentService.getSelected();
					newData.ProjectFk = costHeader && costHeader.ProjectFk > 0 ? costHeader.ProjectFk : null;
					controllingActualsCommonService.setReadOnly(newData);
					_.forEach(amountFields, function(field){
						newData[field] = null;
					});
				}
				return onCreateSucceeded(newData, data);
			};

			service.addRepeatCheckKey = function (entity){
				// key: CompanyFk_ProjectFk_ValueTypeFk_CompanyYearFk_CompanyPeriodFk
				entity.RepeatCheckKey = (entity.MdcControllingUnitFk) + '_' + (entity.MdcCostCodeFk || 0) + '_' + (entity.MdcContrCostCodeFk || 0) + '_' + (entity.AccountFk || 0) + '_' + (entity.NominalDimension1 || 0)+ '_' + (entity.NominalDimension2 || 0)+ '_' + (entity.NominalDimension3 || 0)+ '_' + (entity.UomFk || 0);
			};

			service.getCurrencyConfigAsync = function (){
				var deferred = $q.defer();

				let selectedCostDataHeader = parentService.getSelected();
				let request = {
					CurrencyFk: 0,
					Currenct: 0
				};

				if(selectedCostDataHeader){
					request.CurrencyFk = selectedCostDataHeader.CurrencyFk > 0 ? selectedCostDataHeader.CurrencyFk : 0;
					request.ProjectFk = selectedCostDataHeader.ProjectFk > 0 ? selectedCostDataHeader.ProjectFk : 0;
				}

				$http.post(globals.webApiBaseUrl + 'controlling/actuals/costdata/getcurrencyconfig', request).then(function (response) {
					deferred.resolve(response.data);
				});

				return deferred.promise;
			};

			// TODO: check if setCreationData is used or can be removed
			// service.setCreationData = function setCreationData(data){
			//    createData = data;
			// };

			service.callRefresh = service.refresh || serviceContainer.data.onRefreshRequested;

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'CompanyCostDataDto',
				moduleSubModule: 'Controlling.Actuals',
				validationService: 'controllingActualsCostDataValidationService',
				mustValidateFields: ['MdcControllingUnitFk','MdcCostCodeFk','MdcContrCostCodeFk', 'AccountFk']
			});

			return serviceContainer.service;
		}]);
})(angular);

