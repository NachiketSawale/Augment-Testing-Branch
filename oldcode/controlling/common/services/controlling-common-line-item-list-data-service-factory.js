
(function () {
	/* global globals */
	'use strict';
	let moduleName = 'controlling.common';
	let module = angular.module(moduleName);

	module.factory('controllingCommonLineItemListDataServiceFactory',
		['$translate','$injector', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
			function ($translate,$injector, platformDataServiceFactory, lookupDescriptorService) {

				let factory = {};

				factory.createLineItemListDataService = function createLineItemListDataService(options,parentService,serviceName){

					let serviceOptions = {
						flatLeafItem: {
							module: moduleName,
							serviceName: serviceName,
							httpRead: {
								route: globals.webApiBaseUrl + 'estimate/main/lineitem/',
								endRead: 'projectcontrolslineitemlist',
								usePostForRead: true,
								initReadData: function initReadData(readData) {
									let selected = parentService.getSelected();
									readData.MdcControllingUnitFk = selected.ControllingUnitId;
									let project = parentService.getProjectInfo();
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
													let assembly = _.find(estassemblies, (assembly) => { return assembly.Key === lineitem.EstAssemblyFk; })
													lineitem.EstAssemblyCode = assembly ? assembly.Value : null;
												}
											})
										}

										lookupDescriptorService.attachData(readData);
										return serviceContainer.data.handleReadSucceeded(lineitems, data);
									}
								}
							},
							entityRole: {
								leaf: {itemName: 'ControllingCommonLineItemList', parentService: parentService}
							},
							actions: {delete: false, create: false, bulk: false}
						}
					};

					if (options.httpRead) {
						serviceOptions.flatLeafItem.httpRead.initReadData = options.httpRead.initReadData;
					}
					let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

					serviceContainer.data.usesCache = false;

					serviceContainer.service.canLoad = function () {
						return !!parentService.getSelected();
					};

					serviceContainer.service.isReadonly = function(){
						return true;
					};

					serviceContainer.data.markItemAsModified = angular.noop;
					serviceContainer.service.markItemAsModified = angular.noop;
					let service = serviceContainer.service;
					return service;
				};

				return factory;


			}]);
})();
