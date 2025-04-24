/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.efbsheets';
	let efbSheetModule = angular.module(moduleName);
	/* global globals */
	let serviceName = 'basicsEfbsheetsCrewMixCostCodePriceListService';

	/**
	 * @ngdoc service
	 * @name basicsEfbsheetsCrewMixCostCodePriceListService
	 * @function
	 *
	 * @description
	 * basicsEfbsheetsCrewMixCostCodePriceListService is the data service for all CrewMixes2CostCodePriceList related functionality.
	 */
	efbSheetModule.factory('basicsEfbsheetsCrewMixCostCodePriceListService',  ['_','$injector', '$translate', '$http','platformDataServiceFactory',
		'basicsEfbsheetsMainService','platformModalService','PlatformMessenger','basicsEfbsheetsCrewMixCostCodeService',
		function (_,$injector, $translate,$http, platformDataServiceFactory,
			basicsEfbsheetsMainService,platformModalService,PlatformMessenger,basicsEfbsheetsCrewMixCostCodeService) {

			let efbSheetCrewmixCostCodePriceListOption = {
				flatNodeItem: {
					module: moduleName,
					serviceName: serviceName,
					entityNameTranslationID: 'basics.efbsheets.costCodePriceList',
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixcostcodes/getcostcodeprice',
						initReadData: function initReadData(readData) {
							let selectedItem = basicsEfbsheetsCrewMixCostCodeService.getSelected();
							readData.CostCodeId = selectedItem.MdcCostCodeFk;
						},
						usePostForRead: true
					},
					entitySelection: {},
					setCellFocus:true,
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								service.setDataList(readData);
								serviceContainer.data.handleReadSucceeded(readData, data);
								service.gridRefresh();
							}
						}
					},
					entityRole: { node: { itemName: 'CostcodePriceList', moduleName: 'Crew Mixes',  parentService: basicsEfbsheetsCrewMixCostCodeService}},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: null,
							includeNonActiveItems: null,
							showOptions: false,
							showProjectContext: false,
							withExecutionHints: true
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(efbSheetCrewmixCostCodePriceListOption);
			let service = serviceContainer.service;

			service.hasToLoadOnSelectionChange = function hasToLoadOnSelectionChange(crewmix) {
				if(crewmix){
					serviceContainer.data.doNotLoadOnSelectionChange = false;
				}
			};

			service.isEnableTools = function isEnableTools(){
				let selectedCrewMix = basicsEfbsheetsMainService.getSelected();
				return !!selectedCrewMix;
			};

			let dataList  =[];

			angular.extend(service, {
				refreshGrid: refreshGrid,
				gridRefresh: refreshGrid,
				registerListLoaded: registerListLoaded,
				unregisterListLoaded: unregisterListLoaded,
				listLoaded: new PlatformMessenger(),
			});

			function refreshGrid() {
				service.listLoaded.fire();
			}

			function registerListLoaded(callBackFn) {
				service.listLoaded.register(callBackFn);
			}

			function unregisterListLoaded(callBackFn) {
				service.listLoaded.unregister(callBackFn);
			}

			service.setDataList= function(data,fromUpdate) {
				addItems(data,fromUpdate);
				serviceContainer.data.itemList = dataList;
			};

			function addItems(items,fromUpdate) {
				if(fromUpdate){
					dataList = items;
				}
				if (items === null) {
					dataList = null;
					return;
				}
				dataList = dataList ? dataList : [];
				angular.forEach(items, function(item){
					let matchItem = _.find(dataList, {Id : item.Id});
					if(!matchItem){
						dataList.push(item);
					}
				});
				service.refreshGrid();
			}

			service.updateCostCodesPriceList= function updateCostCodesPriceList() {
				let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
				let updateData = modTrackServ.getModifications(service);
				updateData.EstCrewMix = basicsEfbsheetsMainService.getSelected();
				updateData.EstCrewMixes = basicsEfbsheetsMainService.getSelectedEntities();
				updateData.MainItemId = updateData.EstCrewMix.Id;
				updateData.CostcodePriceList = service.getSelectedEntities();

				let updatePromise = $http.post(globals.webApiBaseUrl + 'basics/efbsheets/crewmixcostcodes/updatecostcodepricelist', updateData);

				return updatePromise.then(function () {
					updatePromise = null;
					let title = $translate.instant('basics.efbsheets.costCodePriceList'),
						msg = $translate.instant('basics.efbsheets.crewMixToCostCodePriceListSuccess');
					platformModalService.showMsgBox(msg, title, 'info').then(
						function (response) {
							if (response.ok === true) {
								let readData= {CostCodeId:0};
								readData.CostCodeId = basicsEfbsheetsCrewMixCostCodeService.getSelected().MdcCostCodeFk;
								$http.post(globals.webApiBaseUrl + 'basics/efbsheets/crewmixcostcodes/getcostcodepricelist', readData).then(function (result) {
									service.setDataList(result.data,true);
									service.gridRefresh();
								});
							}
						});
				});
			};

			return serviceContainer.service;
		}]);

})(angular);