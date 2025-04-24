(function () {
	'use strict';

	var controllingStructureModule = angular.module('controlling.structure');

	controllingStructureModule.factory('controllingStructureLineItemDataService', ['_', 'globals', '$injector', 'platformDataServiceFactory', 'cloudCommonGridService',
		'controllingStructureDashboardSubscriberService', 'projectMainForCOStructureService','basicsLookupdataLookupDescriptorService',
		function (_, globals, $injector, platformDataServiceFactory, cloudCommonGridService,
			controllingStructureDashboardSubscriberService, projectMainForCOStructureService,lookupDescriptorService) {

			var serviceContainer = platformDataServiceFactory.createNewComplete({
				flatLeafItem: {
					module: controllingStructureModule,
					serviceName: 'controllingStructureLineItemDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/',
						endRead: 'controllingunitlineitemlist',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selected = controllingStructureDashboardSubscriberService.getSelected();
							readData.MdcControllingUnitFk = selected.ControllingUnitId;
							readData.ControllingCostCodeId = selected.ControllingCostCodeId;
							let project = projectMainForCOStructureService.getSelected();
							if (project) {
								readData.prjProjectFk = project.Id;
							}
							return readData;
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								let lineitems = readData && _.isArray(readData.Main) ? readData.Main : [];
								let estassemblies = readData && _.isArray(readData.estassemblies) ? readData.estassemblies : [];
								if(_.size(estassemblies) > 0){
									_.forEach(lineitems, (lineitem) =>{
										if(lineitem.EstAssemblyFk){
											let assembly = _.find(estassemblies, (assembly) => { return assembly.Id === lineitem.EstAssemblyFk; })
											lineitem.EstAssemblyCode = assembly ? assembly.Code : null;
										}
									})
								}

								lookupDescriptorService.attachData(readData);
								return serviceContainer.data.handleReadSucceeded(lineitems, data);
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'ControllingUnitTotals', parentService: controllingStructureDashboardSubscriberService}
					},
					actions: {delete: false, create: false, bulk: false}
				}
			});


			serviceContainer.data.usesCache = false;

			serviceContainer.service.canLoad = function () {
				return !!controllingStructureDashboardSubscriberService.getSelected();
			};

			serviceContainer.service.isReadonly = function(){
				return true;
			};

			return serviceContainer.service;
		}]);
})();
