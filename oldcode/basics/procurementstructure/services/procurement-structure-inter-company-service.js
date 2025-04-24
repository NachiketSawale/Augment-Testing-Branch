/**
 * Created by jie on 03/24/2023.
 */
(function (angular) {
	'use strict';
	let moduleName = 'basics.procurementstructure';
	angular.module(moduleName).factory('basicsProcurementInterCompanyDataService', [
		'$injector', 'platformDataServiceFactory', 'basicsInterCompanyHeaderConfigHeaderDataService', 'basicsProcurementStructureService', 'basicsLookupdataLookupFilterService',
		'basicsCommonMandatoryProcessor','$http','_',
		function ($injector, platformDataServiceFactory, parentService, basicsProcurementStructureService, basicsLookupdataLookupFilterService,
			basicsCommonMandatoryProcessor,$http,_) {
			let gridContainerGuid = 'ecf49aee59834853b0f78ee871676e38';
			let serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'basicsProcurementInterCompanyDataService',
					httpCreate: {route: globals.webApiBaseUrl + 'basics/procurementstructure/intercompany/', endCreate: 'createInterCompany'},
					httpDelete: {
						route: globals.webApiBaseUrl + 'basics/procurementstructure/intercompany/',
						endDelete: 'deleteInterCompany'
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'basics/procurementstructure/intercompany/',
						endUpdate: 'updateInterCompany'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/procurementstructure/intercompany/',
						endRead: 'listInterCompany',
						usePostForRead: true,
						initReadData: function initNumberReadData(readData) {
							var comp = parentService.getSelected();
							if (comp) {
								readData.SuperEntityId = comp.Id;
								readData.EntityId = basicsProcurementStructureService.getSelected().Id;
							}
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.SuperEntityId = parentService.getSelected().Id;
								creationData.EntityId = basicsProcurementStructureService.getSelected().Id;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'InterCompanyStructure',
							parentService: parentService
						}
					}
				}
			};
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = serviceContainer.service;
			serviceContainer.parentService = parentService;

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'InterCompanyStructureDto',
				moduleSubModule: 'Basics.ProcurementStructure',
				validationService: 'procurementStructureInterCompanyValidationService',
				mustValidateFields: ['PrcStructureToFk']
			});
			var filters = [
				{
					key: 'inter-company-prc-structure-filter',
					serverSide: true,
					serverKey: 'bas.procurement.structure.inter.company.filterkey',
					fn: function () {
						return {
							ContextFk:parentService.getSelected() ? parentService.getSelected().Id : null,
							FilterKey:'bas.procurement.structure.inter.company.filterkey'
						};
					}
				}
			];
			service.registerFilters = function registerFilters() {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};
			service.unregisterFilters = function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};
			service.registerFilters();

			service.synchronizeProcurementStructure = (e) => {
				let param = {
					prcStructureId : e.prcStructureId,
					prcStructureDesc : e.prcStructureDesc,
					contextId  : e.mdcContextId
				};
				$http.post(globals.webApiBaseUrl + 'basics/procurementstructure/intercompany/autoCreateInterCompany', param)
					.then(function (response) {
						if(response.data !== '' && response.data !== null) {
							for (let i = response.data.length-1; i >= 0; i--) {
								for (let j = 0; j < e.currentItem.length; j++) {
									if(e.currentItem[j].PrcStructureToFk === response.data[i].PrcStructureToFk){
										response.data.remove(i);
										break;
									}
								}
							}
							for (let i = 0; i < response.data.length; i++) {
								serviceContainer.data.handleOnCreateSucceeded(response.data[i], serviceContainer.data);
							}

						}
						},
						function (/*error*/) {
						});
			};

			return service;
		}
	]);
})(angular);