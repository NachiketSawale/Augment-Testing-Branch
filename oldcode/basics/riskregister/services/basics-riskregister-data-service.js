/*
 * Created by salopek on 03.10.2019.
 */

(function (angular) {
	'use strict';

	/*globals _,angular,globals,console*/
	var moduleName = 'basics.riskregister';
	var riskRegisterModule = angular.module(moduleName);

	/**
     * @ngdoc service
     *
     * @name basicsRiskRegisterDataService
     * @function
     *
     * @description
     * basicsRiskRegisterDataService is the data service for all risk register related functionality.
     */

	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).factory('basicsRiskRegisterDataService', ['PlatformMessenger', 'platformDataServiceFactory', 'ServiceDataProcessArraysExtension',
		'basicsLookupdataLookupDescriptorService','basicsRiskRegisterDependencyUpdateService',
		'basicsRiskRegisterDependencyFormatterService','$q',
		function (PlatformMessenger, platformDataServiceFactory, ServiceDataProcessArraysExtension,
			basicsLookupdataLookupDescriptorService,basicsRiskRegisterDependencyUpdateService,
			basicsRiskRegisterDependencyFormatterService,$q) {
			var selected = {};

			var canChildRiskRegister = function canChildRiskRegister() {
				var selectedItem = service.getSelected();
				return selectedItem !== null;
			};

			var basicsRiskRegisterServiceOptions = {
				hierarchicalRootItem: {
					module: riskRegisterModule,
					serviceName: 'basicsRiskRegisterDataService',
					entityNameTranslationID: 'basics.riskregister.riskEventsGridTitle',
					httpCRUD: {route: globals.webApiBaseUrl + 'basics/riskregister/'},
					actions: { create: 'hierarchical', canCreateChildCallBackFunc: canChildRiskRegister, delete : {}},
					presenter: {
						tree: {
							parentProp: 'RiskRegisterParentFk',
							childProp: 'RiskRegisters',
							//childSort: true,
							//isInitialSorted: true,
							//sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
							initCreationData: function initCreationData(creationData) {
								creationData.riskRegisterId = creationData.parentId;
								var list = serviceContainer.service.getList();
								if (creationData.parentId && list && list.length > 0) {
									var parent = _.find(list, {Id: creationData.parentId});
								}
							},
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								serviceContainer.data.sortByColumn(readItems);
								angular.forEach(readItems,function (item) {
									if(item.hasOwnProperty('LowImpactDetail')){
										item.LowImpactDetail = item.LowImpactDetail.toString();
									}else if(item.hasOwnProperty('HighImpactDetail')){
										item.HighImpactDetail = item.HighImpactDetail.toString();
									}
								});
								basicsLookupdataLookupDescriptorService.removeData('RiskEvents');
								basicsLookupdataLookupDescriptorService.updateData('RiskEvents', readItems);
								basicsRiskRegisterDependencyUpdateService.clear();
								basicsRiskRegisterDependencyFormatterService.refresh();
								return serviceContainer.data.handleReadSucceeded(readItems, data);
							},
							handleCreateSucceeded: function (newItem) {
								return newItem;
							}
						}
					},
					setCellFocus: true,
					dataProcessor: [new ServiceDataProcessArraysExtension(['RiskRegisters'])],
					entityRole: {
						root: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'RiskRegisters',
							moduleName: 'basics.riskregister.moduleDisplayNameRiskRegisters',
							handleUpdateDone: function (updateData, response, data) {
								updateData.RiskRegisters[0].RiskRegisterImpactEntities=$scope.newEntity;
								basicsRiskRegisterDependencyUpdateService.clear();

								if (data.itemList && response.RiskRegisters && response.RiskRegisters.length > 0) {

									angular.forEach(response.RiskRegisters, function (riskRegisterItem) {
										var index = data.itemList.indexOf(_.find(data.itemList, {Id: riskRegisterItem.Id}));
										if (index >= 0) {
											var subItems = data.itemList[index].RiskRegisters;
											angular.extend(data.itemList[index], riskRegisterItem);
											if (subItems !== null && subItems.length > 0) {
												data.itemList[index].HasChildren = true;
												data.itemList[index].RiskRegisters = subItems;
											}
										}
									});
									data.handleOnUpdateSucceeded(updateData, response, data, false);
									selected = serviceContainer.data.selectedItem;
									serviceContainer.data.sortByColumn(serviceContainer.data.itemTree);
									serviceContainer.data.listLoaded.fire();
									serviceContainer.service.setSelected(selected);
								}else {
									serviceContainer.service.updatedDoneMessenger.fire(null, updateData);
								}
								basicsRiskRegisterDependencyFormatterService.handleUpdateDone(response);
								data.handleOnUpdateSucceeded(updateData, response, data, true);
								//service.onUpdated.fire();
							}
						}
					},
					translation:{
						uid: 'basicsRiskRegisterDataService',
						title: 'basics.riskregister.riskEventsGridTitle',
						columns: [{ header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo' }]
					},
					entitySelection: {supportsMultiSelection: true}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsRiskRegisterServiceOptions);//jshint ignore:line

			var service = serviceContainer.service;

			angular.extend(serviceContainer.data,{
				provideUpdateData:provideUpdateData
			});
			angular.extend(serviceContainer.service,{
				updateList:updateList
			});
			//service.load();

			service.loadRegisters = function loadRegisters() {
				var defer = $q.defer();
				service.load().then(function(data){
					//service.setDataItems(data);
					defer.resolve(data);
				});
				return defer.promise;
			};
			basicsRiskRegisterDependencyFormatterService.setSelectedEvent(service.getSelected());
			service.onUpdated = new PlatformMessenger();
			service.updatedDoneMessenger = new PlatformMessenger();

			function provideUpdateData(updateData){
				basicsRiskRegisterDependencyUpdateService.updateDepenToSave(updateData);
			}
			function updateList(updateData, response) {
				basicsRiskRegisterDependencyUpdateService.clear();
				basicsRiskRegisterDependencyFormatterService.handleUpdateDone(response);
				if (response[serviceContainer.data.itemName]) {
					serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
				}
			}



			return service;
		}]);
})(angular);
