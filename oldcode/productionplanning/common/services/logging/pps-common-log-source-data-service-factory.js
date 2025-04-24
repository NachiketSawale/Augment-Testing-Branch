/**
 * Created by zwz on 6/30/2020.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.common';

	/**
     * @ngdoc factory
     * @name ppsCommonLogSourceDataServiceFactory
     * @description provides log data services for the source window in relative modules(like ppsItem module)
	 * @remarks code of ppsCommonLogSourceDataServiceFactory is referenced code of platformSourceWindowDataServiceFactory. For pps log, we have to create an own source data service factory.
     */
	angular.module(moduleName).factory('ppsCommonLogSourceDataServiceFactory', PpsCommonLogSourceDataServiceFactory);

	PpsCommonLogSourceDataServiceFactory.$inject = ['_', '$injector', 'globals',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceFactory',
		'ppsCommonLoggingHelper'];

	function PpsCommonLogSourceDataServiceFactory(_, $injector, globals,
												  platformDataServiceProcessDatesBySchemeExtension,
												  platformDataServiceFactory,
												  ppsCommonLoggingHelper) {

		var serviceFactory = {};
		var instances = {};
		serviceFactory.createDataService = function createDataService(modul, templInfo) {
			var dsName = getDataServiceName(modul, templInfo);

			var srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = doCreateDataService(modul, dsName, templInfo);
				instances[dsName] = srv;
			}

			return srv;
		};

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
			typeName: 'PpsLogReportVDto',
			moduleSubModule: 'ProductionPlanning.Common'
		});

		function getNameInfix(templInfo) {
			return templInfo.dto;
		}

		function getDataServiceName(module, templInfo) {
			return _.camelCase(module) + getNameInfix(templInfo) + 'SourceDataService';
		}

		function getUsePostForRead(sourceDsv) {
			return sourceDsv.usePostForRead && sourceDsv.usePostForRead();
		}

		function getReadCallInitReadDataOverload(templInfo, serviceContainer, sourceDsv) {
			if (getUsePostForRead(sourceDsv)) {
				return function (readData) {
					getSelectedFilter(serviceContainer, readData, templInfo.filterFk);
				};
			}
			return function (readData) {
				readData.filter = templInfo.filter + serviceContainer.service.getSelectedFilter(templInfo.filterFk);
			};
		}

		function getSelectedFilter(serviceContainer, readData, nameSelected) {
			var selectedObject = serviceContainer.data.selectedObject;
			if (_.isArray(nameSelected)) {
				_.forEach(nameSelected, function (ns) {
					readData[ns] = selectedObject[ns];
				});
			} else {
				readData[nameSelected] = selectedObject[nameSelected];
			}
		}

		function getFlatLeafItemOptions(modul, dsName, templInfo, processor, serviceContainer, sourceDsv) {
			if(_.isArray(processor)){
				processor.push(dateProcessor);
			}
			return {
				flatLeafItem: {
					module: angular.module(modul),
					serviceName: dsName,
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/',
						endRead: templInfo.endRead,
						usePostForRead: getUsePostForRead(sourceDsv),
						initReadData: getReadCallInitReadDataOverload(templInfo, serviceContainer, sourceDsv)
					},
					entityRole: {
						node: {
							itemName: 'Log',
							parentService: templInfo.parentService
						}
					},
					dataProcessor: processor,
					presenter: {
						list: {
							incorporateDataRead: function incorporateDataRead(readItems, data) {
								if(readItems.length > 0){
									// translate ColumnName of log records
									var translationService = $injector.get(templInfo.translationServiceName);
									ppsCommonLoggingHelper.translateLogColumnName(readItems, translationService, serviceContainer.service);
								}
								return data.handleReadSucceeded(readItems, data);
							}
						}
					},
					actions: { delete: false, create: false }
				}
			};
		}

		function doCreateDataService(modul, dsName, templInfo) {
			var sourceDsv = $injector.get(templInfo.sourceDataService);
			var processor = sourceDsv.getDataProcessor();

			var serviceContainer = {};

			var copyFromServiceOption = getFlatLeafItemOptions(modul, dsName, templInfo, processor, serviceContainer, sourceDsv);

			var res = platformDataServiceFactory.createNewComplete(copyFromServiceOption);
			serviceContainer.data = res.data;
			serviceContainer.service = res.service;

			serviceContainer.data.filterFk = templInfo.filterFk;
			serviceContainer.data.selectedObject = {};
			if(angular.isFunction(templInfo.initFilters)) {
				templInfo.initFilters(serviceContainer.data.selectedObject);
			}

			if (templInfo.onHeaderSelectionChanged && !!templInfo.parentService) {
				var selectedHeader = templInfo.parentService.getSelected();
				if (selectedHeader) {
					templInfo.onHeaderSelectionChanged(serviceContainer.data, selectedHeader);
				}
				serviceContainer.service.onHeaderSelectionChanged = function onHeaderSelectionChanged(e, sel) {
					templInfo.onHeaderSelectionChanged(serviceContainer.data, sel);
				};

				templInfo.parentService.registerSelectionChanged(serviceContainer.service.onHeaderSelectionChanged);
			}

			serviceContainer.service.loadSelected = function loadSelected(selected) {
				if (selected === serviceContainer.data.filterFk) {
					serviceContainer.service.read();
				}
			};

			serviceContainer.service.setSelectedFilter = function setSelectedFilter(nameSelected, idSelected, filter) {
				serviceContainer.data.selectedObject[nameSelected] = idSelected;
				serviceContainer.service.loadSelected(serviceContainer.data.filterFk);
			};

			serviceContainer.service.getSelectedFilter = function getSelectedFilter(nameSelected) {
				if (Object.prototype.hasOwnProperty.call(serviceContainer.data.selectedObject, nameSelected)) {
					return serviceContainer.data.selectedObject[nameSelected];
				}
				return null;
			};
			return serviceContainer.service;
		}


		return serviceFactory;



	}
})(angular);
