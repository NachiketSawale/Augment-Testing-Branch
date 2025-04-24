/* global globals */
(function (angular) {
	'use strict';

	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainSourceDataServiceFactory
	 * @description provides validation methods for all kind of change entities
	 */
	angular.module(moduleName).service('schedulingMainSourceDataServiceFactory', SchedulingMainSourceDataServiceFactory);

	SchedulingMainSourceDataServiceFactory.$inject = ['_', '$injector', 'platformDataServiceFactory'];

	function SchedulingMainSourceDataServiceFactory(_, $injector, platformDataServiceFactory) {
		var instances = {}, self = this;
		var uiFilterSetter = function () {};
		this.createDataService = function createDataService(templInfo, filterSrv) {
			var dsName = self.getDataServiceName(templInfo);

			var srv = instances[dsName];
			if(_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo, filterSrv);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto;
		};

		this.getDataServiceName = function getDataServiceName(templInfo) {
			return 'schedulingMain' + self.getNameInfix(templInfo) + 'SourceDataService';
		};

		this.doCreateDataService = function doCreateDataService(dsName, templInfo) {
			var sourceDsv = $injector.get(templInfo.sourceDataService);
			var processor = sourceDsv.getDataProcessor();
			var flatLeafItem = {
				flatLeafItem: {
					module: angular.module('scheduling.main'),
					serviceName: dsName,
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http, endRead: templInfo.endRead,
						initReadData: function (readData) {
							readData.filter = templInfo.filter + serviceContainer.service.getSelectedFilter(templInfo.filterFk);
						}
					},
					dataProcessor: processor,
					presenter: { list: {} },
					actions: {delete: false, create: false}
				}
			};
			var hierarchicalLeafItem = {
				hierarchicalLeafItem: {
					module: angular.module('scheduling.main'),
					serviceName: dsName,
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http, endRead: templInfo.endRead,
						initReadData: function (readData) {
							readData.filter = templInfo.filter + serviceContainer.service.getSelectedFilter(templInfo.filterFk);
						}
					},
					dataProcessor: processor,
					presenter: {
						tree: {
							parentProp: templInfo.parentProp,
							childProp: templInfo.childProp,
							childSort: templInfo.childSort,
							sortOptions: templInfo.sortOptions,
							isInitialSorted: templInfo.isInitialSorted,
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								data.sortByColumn(readItems);
								return data.handleReadSucceeded(readItems, data);
							}
						}},
					actions: {delete: false, create: false}
				}
			};

			var projectMainCopyFromServiceOption;

			if(templInfo.presenter && templInfo.presenter === 'tree') {
				if(templInfo.filterFk ==='baselineFk'){
					hierarchicalLeafItem.hierarchicalLeafItem.entityRole =  { leaf: { itemName: 'ActivityByBaseline', parentService: sourceDsv  } };
				}
				projectMainCopyFromServiceOption = hierarchicalLeafItem;
			} else {
				projectMainCopyFromServiceOption = flatLeafItem;
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(projectMainCopyFromServiceOption);
			if(templInfo.filterFk ==='baselineFk'){
				serviceContainer.data.doNotLoadOnSelectionChange = true;
				serviceContainer.data.clearContent = function clearContent(){
					_.noop();
				};
				/*
				sourceDsv.registerListLoaded(function(){
					if(serviceContainer.data.selectedObject.baselineFk){
						serviceContainer.service.loadSelected('baselineFk');
					}
				});
*/
				sourceDsv.selectedScheduleChanged.register(function (){
					uiFilterSetter('baselineFk',null);
					serviceContainer.data.selectedObject.baselineFk = null;
					serviceContainer.data.itemTree.length = 0;
					serviceContainer.data.itemList.length = 0;
					serviceContainer.data.listLoaded.fire();
				});
			}
			serviceContainer.data.filterFk = templInfo.filterFk;
			serviceContainer.data.selectedObject = {};
			serviceContainer.service.loadSelected = function loadSelected (selected){
				if(selected === serviceContainer.data.filterFk) {
					serviceContainer.service.read();
				}
			};

			// projectMainSourceFilterSelectionService.registerSelectionChanged( loadSelected);
			serviceContainer.service.setSelectedFilter = function setSelectedId(nameSelected, idSelected, filter) {
				if (serviceContainer.data.selectedObject[nameSelected] !== idSelected){
					serviceContainer.data.selectedObject[nameSelected] = idSelected;
					if(nameSelected === 'projectFk'){
						uiFilterSetter('scheduleFk',null);
						uiFilterSetter('relationFk',null);
						serviceContainer.data.selectedObject.scheduleFk = null;
						serviceContainer.data.selectedObject.relationFk = null;

						serviceContainer.data.itemTree.length = 0;
						serviceContainer.data.itemList.length = 0;
						serviceContainer.data.listLoaded.fire();
					}
				}
				var notAllEntered = _.find(filter, function(f){
					return _.isNil(serviceContainer.data.selectedObject[f]);
				});
				if(!notAllEntered) {
					serviceContainer.service.loadSelected(serviceContainer.data.filterFk);
				}
			};

			serviceContainer.service.getSelectedFilter = function getSelectedId(nameSelected) {
				if (Object.prototype.hasOwnProperty.call(serviceContainer.data.selectedObject, nameSelected)) {
					return serviceContainer.data.selectedObject[nameSelected];
				}
				return null;
			};

			serviceContainer.service.registerFilterSetter = function registerFilterSetter(uiFilterSetterMethod) {
				uiFilterSetter = uiFilterSetterMethod;
			};
			serviceContainer.service.unRegisterFilterSetter = function unRegisterFilterSetter() {
				uiFilterSetter = function () {};
			};
			return serviceContainer.service;
		};
	}

})(angular);
