/**
 * Created by zov on 03/02/2019.
 */
(function () {
	'use strict';
	/*global globals, angular, _*/

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('trsTransportSourceWindowDataServiceFactory', [
		'platformSourceWindowDataServiceFactory',
		'$injector',
		'platformDataServiceFactory',
		function (platformSourceWindowDataServiceFactory,
				  $injector,
				  platformDataServiceFactory) {
			var copyFactory = Object.create(platformSourceWindowDataServiceFactory);

			// override functions
			var instances = {}, self = copyFactory;
			copyFactory.createDataService = function createDataService(modul, templInfo) {
				var dsName = self.getDataServiceName(modul, templInfo);

				var srv = instances[dsName];
				if(_.isNull(srv) || _.isUndefined(srv)) {
					srv = self.doCreateDataService(modul, dsName, templInfo);
					instances[dsName] = srv;
				}

				return srv;
			};

			copyFactory.getDataService = function (serviceName) {
				return instances[serviceName];
			};

			copyFactory.getFlatLeafItemOptions = function getFlatLeafItemOptions(modul, dsName, templInfo, processor, serviceContainer, sourceDsv) {
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
						presenter: templInfo.presenter(serviceContainer),
						actions: {delete: false, create: false},
						entitySelection: {supportsMultiSelection: true},
						entityRole: {
							// root: {
							// 	itemName: 'Requisitions', // use to update res_requisition
							// 	moduleName: 'cloud.desktop.moduleDisplayNameTransport',
							// 	descField: 'DescriptionInfo.Translated',
							// 	addToLastObject: true,
							// 	lastObjectModuleName: moduleName
							// }
							node: {
								itemName: 'SpecialRequisition',
								parentService: $injector.get('transportplanningTransportMainService')
								//parentFilter: 'routeId'
							}
						},
						// httpUpdate: { // ensure can update
						// 	route: globals.webApiBaseUrl + "resource/requisition/",
						// 	endUpdate: "update"
						// }
					}
				};
			};

			copyFactory.doCreateDataService = function doCreateDataService(modul, dsName, templInfo) {
				var sourceDsv = $injector.get(templInfo.sourceDataService);
				var processor = sourceDsv.getDataProcessor();

				var copyFromServiceOption;
				var serviceContainer = {};

				if(templInfo.presenter && templInfo.presenter === 'tree') {
					copyFromServiceOption = self.getHierarchicalLeafItemOptions(modul, dsName, templInfo, processor, serviceContainer, sourceDsv);
				} else {
					copyFromServiceOption = self.getFlatLeafItemOptions(modul, dsName, templInfo, processor, serviceContainer, sourceDsv);
				}

				var res = platformDataServiceFactory.createNewComplete(copyFromServiceOption);
				serviceContainer.data = res.data;
				serviceContainer.service = res.service;


				serviceContainer.data.filterFk = templInfo.filterFk;
				serviceContainer.data.selectedObject = $injector.get('transportplanningTransportResRequisitionFilterService').entity;
				serviceContainer.service.loadSelected = function loadSelected (selected){
					if(selected === serviceContainer.data.filterFk) {
						this.parentService().update().then(
							serviceContainer.service.read()
						);
					}
				};

				// projectMainSourceFilterSelectionService.registerSelectionChanged( loadSelected);
				serviceContainer.service.setSelectedFilter = function setSelectedFilter(nameSelected, idSelected, filter) {
					serviceContainer.data.selectedObject[nameSelected] = idSelected;
					var notAllEntered;
					if(_.isArray(filter)){
						notAllEntered = _.find(filter, function(f){
							return _.isNil(serviceContainer.data.selectedObject[f]);
						});
					}else{
						notAllEntered = !serviceContainer.data.selectedObject[filter];
					}

					if(!notAllEntered) {
						serviceContainer.service.loadSelected(serviceContainer.data.filterFk);
					}
				};

				serviceContainer.service.getSelectedFilter = function getSelectedFilter(nameSelected) {
					if (Object.prototype.hasOwnProperty.call(serviceContainer.data.selectedObject,nameSelected)) {
						return serviceContainer.data.selectedObject[nameSelected];
					}
					return null;
				};

				serviceContainer.service.canForceUpdate = function canForceUpdate() {
					return true;
				};

				return serviceContainer.service;
			};

			return copyFactory;
		}
	]);
})();