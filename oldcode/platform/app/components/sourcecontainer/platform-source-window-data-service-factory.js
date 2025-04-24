(function (angular) {
	'use strict';

	var moduleName = 'platform';

	/**
	 * @ngdoc service
	 * @name platformSourceWindowDataServiceFactory
	 * @description provides a service factory for data services of source windows in diverse modules
	 */
	angular.module(moduleName).service('platformSourceWindowDataServiceFactory', PlatformSourceWindowDataServiceFactory);

	PlatformSourceWindowDataServiceFactory.$inject = ['_', '$injector', 'platformDataServiceFactory'];

	function PlatformSourceWindowDataServiceFactory(_, $injector, platformDataServiceFactory) {
		var instances = {}, self = this;
		this.createDataService = function createDataService(modul, templInfo) {
			var dsName = self.getDataServiceName(modul, templInfo);

			var srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(modul, dsName, templInfo);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			let nameInfix = templInfo.dto;
			if(!_.isNil(templInfo.instance)){
				nameInfix = nameInfix + templInfo.instance;
			}
			return nameInfix;
		};

		this.getDataServiceName = function getDataServiceName(module, templInfo) {
			return _.camelCase(module) + self.getNameInfix(templInfo) + 'SourceDataService';
		};

		this.getUsePostForRead = function getUsePostForRead(templInfo, sourceDsv) {
			return templInfo.overrideDataServicePostForRead ?
				templInfo.usePostForRead :
				sourceDsv.usePostForRead && sourceDsv.usePostForRead();
		};

		this.getReadCallInitReadDataOverload = function getReadCallInitReadDataOverload(templInfo, serviceContainer, sourceDsv) {
			if (self.getUsePostForRead(templInfo, sourceDsv)) {
				return function (readData) {
					self.getSelectedFilter(serviceContainer, readData, templInfo.filterFk);
				};
			}
			return function (readData) {
				readData.filter = templInfo.filter + serviceContainer.service.getSelectedFilter(templInfo.filterFk);
			};
		};

		this.getSelectedFilter = function getSelectedFilter(serviceContainer, readData, nameSelected) {
			if (_.isArray(nameSelected)) {
				_.forEach(nameSelected, function (nS, index) {
					self.setPKeyForIndex(readData, serviceContainer.service.getSelectedFilter(nS), index);
				});
			} else {
				readData.PKey1 = serviceContainer.service.getSelectedFilter(nameSelected);
			}
		};

		this.setPKeyForIndex = function setPKeyForIndex(readData, value, index) {
			switch (index) {
				case 0:
					readData.PKey1 = value;
					break;
				case 1:
					readData.PKey2 = value;
					break;
				case 2:
					readData.PKey3 = value;
					break;
			}
		};

		this.getFlatLeafItemOptions = function getFlatLeafItemOptions(modul, dsName, templInfo, processor, serviceContainer, sourceDsv) {
			return {
				flatLeafItem: {
					module: angular.module(modul),
					serviceName: dsName,
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/',
						endRead: templInfo.endRead,
						usePostForRead: self.getUsePostForRead(templInfo, sourceDsv),
						initReadData: self.getReadCallInitReadDataOverload(templInfo, serviceContainer, sourceDsv)
					},
					dataProcessor: processor,
					presenter: {list: {}},
					actions: {delete: false, create: false}
				}
			};
		};

		this.getHierarchicalLeafItemOptions = function getHierarchicalLeafItemOptions(modul, dsName, templInfo, processor, serviceContainer, sourceDsv) {
			return {
				hierarchicalLeafItem: {
					module: angular.module(modul),
					serviceName: dsName,
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http,
						endRead: templInfo.endRead,
						usePostForRead: self.getUsePostForRead(templInfo, sourceDsv),
						initReadData: self.getReadCallInitReadDataOverload(templInfo, serviceContainer, sourceDsv)
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
						}
					},
					actions: {delete: false, create: false}
				}
			};
		};

		this.doCreateDataService = function doCreateDataService(modul, dsName, templInfo) {
			var sourceDsv = $injector.get(templInfo.sourceDataService);
			var processor = sourceDsv.getDataProcessor();

			var copyFromServiceOption;
			var serviceContainer = {};

			if (templInfo.presenter && templInfo.presenter === 'tree') {
				copyFromServiceOption = self.getHierarchicalLeafItemOptions(modul, dsName, templInfo, processor, serviceContainer, sourceDsv);
			} else {
				copyFromServiceOption = self.getFlatLeafItemOptions(modul, dsName, templInfo, processor, serviceContainer, sourceDsv);
			}

			var res = platformDataServiceFactory.createNewComplete(copyFromServiceOption);
			serviceContainer.data = res.data;
			serviceContainer.service = res.service;

			serviceContainer.data.filterFk = templInfo.filterFk;
			serviceContainer.data.selectedObject = {};

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

			// projectMainSourceFilterSelectionService.registerSelectionChanged( loadSelected);
			serviceContainer.service.setSelectedFilter = function setSelectedFilter(nameSelected, idSelected, filter) {
				serviceContainer.data.selectedObject[nameSelected] = idSelected;
				var notAllEntered;
				if (_.isArray(filter)) {
					notAllEntered = _.find(filter, function (f) {
						return _.isNil(serviceContainer.data.selectedObject[f]);
					});
				} else {
					notAllEntered = !serviceContainer.data.selectedObject[filter];
				}

				if (!notAllEntered) {
					serviceContainer.service.loadSelected(serviceContainer.data.filterFk);
				}
			};

			serviceContainer.service.getSelectedFilter = function getSelectedFilter(nameSelected) {
				if (serviceContainer.data.selectedObject.hasOwnProperty(nameSelected)) {
					return serviceContainer.data.selectedObject[nameSelected];
				}
				return null;
			};

			serviceContainer.service.clearList = function clearList() {
				serviceContainer.data.setList([]);
				serviceContainer.data.selectedObject = {};
			};

			return serviceContainer.service;
		};
	}

})(angular);
