
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/**
	 * @ngdoc service
	 * @name procurementCommonOverviewTreeDataService
	 * @function
	 *
	 * @description Provides data buffer
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonOverviewTreeDataService',
		['platformDataServiceFactory', 'ServiceDataProcessArraysExtension',
			'procurementCommonDataImageProcessor', '$translate','$http',
			'platformDataServiceDataProcessorExtension', 'procurementContextService',
			'basicsLookupdataLookupDescriptorService', 'platformDataServiceSelectionExtension','PlatformMessenger','procurementCommonOverviewDataHelperService',
			'$q',
			function (dataServiceFactory, ServiceDataProcessArraysExtension,
				imageProcessor, $translate, $http, platformDataServiceDataProcessorExtension,
				moduleContext, basicsLookupdataLookupDescriptorService, platformDataServiceSelectionExtension,PlatformMessenger,procurementCommonOverviewDataHelperService,
				$q) {

				/* var updated = new Messenger(); */
				function constructorFn(mainService,leadingService) {
					var overViewService;
					// eslint-disable-next-line no-unused-vars
					var services = {},
						serviceOption = {
							hierarchicalLeafItem: {
								module: angular.module('procurement.common'),
								httpRead: {
									route: globals.webApiBaseUrl + 'procurement/common/module/overview/', usePostForRead: true,
									endRead: 'data',
									initReadData: function (readData) {
										var mainItemInfo = procurementCommonOverviewDataHelperService.getMainItemInfo();
										readData.mainItemId = mainItemInfo.mainItemId ? mainItemInfo.mainItemId : 0;
										readData.moduleIdentifier = mainItemInfo.moduleIdentifier;
										readData.searchLevel = mainItemInfo.searchLevel;

										if(mainItemInfo.moduleIdentifier === 'procurement.quote'){
											var item = leadingService.getSelected();
											if(item && item.IsBidderDeniedRequest){
												readData.mainItemId = -1;
											}
										}
									}
								},
								dataProcessor: [new ServiceDataProcessArraysExtension(['Children'])],
								presenter: {
									tree: {
										parentProp: 'ParentFk', childProp: 'Children',
										incorporateDataRead: function incorporateDataRead(readData, data) {
											var containerList = procurementCommonOverviewDataHelperService.processContainerData(readData);
											var result = procurementCommonOverviewDataHelperService.processDataMakeTree(containerList);
											return data.handleReadSucceeded(result, data, true);
										}
									}
								},
								entityRole: {
									leaf: {
										itemName: 'PrcOverview',
										parentService: leadingService || mainService,
										doesRequireLoadAlways:true
									}
								}
							}
						};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
					// automatically refresh the overview after updated root.
					serviceContainer.service.refreshAfterSave = function refreshAfterSave() {
						var readData = {
							filter: ''
						};
						var mainItemInfo = procurementCommonOverviewDataHelperService.getMainItemInfo();
						readData.mainItemId = mainItemInfo.mainItemId ? mainItemInfo.mainItemId : 0;
						readData.moduleIdentifier = mainItemInfo.moduleIdentifier;
						readData.searchLevel = mainItemInfo.searchLevel;

						if(mainItemInfo.moduleIdentifier === 'procurement.quote'){
							var item = leadingService.getSelected();
							if(item && item.IsBidderDeniedRequest){
								readData.mainItemId = -1;
							}
						}
						$http.post(globals.webApiBaseUrl + 'procurement/common/module/overview/data', readData)
							.then(function (response) {
								procurementCommonOverviewDataHelperService.getContainerJSON().then(function (responseData) {
									var containerList = procurementCommonOverviewDataHelperService.processContainerData(response.data);
									var result = procurementCommonOverviewDataHelperService.processDataMakeTree(containerList, responseData);
									// eslint-disable-next-line no-unused-vars
									var dataRead = serviceContainer.data.handleReadSucceeded(result, serviceContainer.data, true);
								});

							}, function (/* error */) {
							});
					};

					// when the leading service and main service are not equal
					if(leadingService && mainService !== leadingService) {
						var doBaseReadData = serviceContainer.data.doReadData;
						var loadAndUpdateOverview = function () {
							doBaseReadData(serviceContainer.data);
							serviceContainer.data.listLoaded.fire();
						};
						serviceContainer.data.doReadData = function () {
							var deffered = $q.defer();
							deffered.resolve();
							return deffered.promise;
						};
						if(mainService.loadOverview) {
							mainService.loadOverview.register(loadAndUpdateOverview);
						}
					}

					// read service from serviceContainer
					overViewService = serviceContainer.service;
					serviceContainer.service.treePresOpt = serviceContainer.data.treePresOpt;
					overViewService.canDelete = overViewService.canCreateChild = overViewService.canCreate = null;

					var processItemImage = imageProcessor('ParentFk', function (item) {
						var sel = mainService.getSelected();
						if (platformDataServiceSelectionExtension.isSelection(sel) && mainService.allMainItemToDictionary) {
							return item.PrcHeaderFk !== sel.PrcHeaderFk;
						}
						return false;
					});

					var collaseRow = function collaseRow () {
						var itemList = overViewService.getList();
						_.forEach(itemList, function (item) {
							processItemImage.processItem(item);
						});
						serviceContainer.data.listLoaded.fire();
					};
					mainService.registerSelectionChanged(collaseRow);

					return overViewService;
				}

				// service repository function
				var dataServiceRepository = {};
				return {
					/**
					 * get over view service
					 * @returns {*}
					 * @param mainService
					 * @param leadingService
					 */
					getService: function getService(mainService,leadingService) {
						procurementCommonOverviewDataHelperService.initContainerJson();
						var serviceName = mainService.getItemName();
						if(leadingService){
							serviceName = mainService.getItemName() + leadingService.getItemName();
						}
						var dataService = dataServiceRepository[serviceName];
						if (!dataService) {
							dataService = constructorFn.apply(this, arguments);
							dataServiceRepository[serviceName] = dataService;
						}
						return dataService;
					},
					initContainerJson:function(){
						return procurementCommonOverviewDataHelperService.initContainerJson();
					}
				};
			}]);
})(angular);