/**
 * Created by jie on 20/03/2023.
 */
(function (angular) {
	'use strict';
	let moduleName='basics.company';
	angular.module(moduleName).factory('basicsCompanyICPartnerAccDataService',[
		'globals','_','platformDataServiceFactory','basicsCompanyICPartnerCardDataService','basicsLookupdataLookupFilterService','platformContextService','basicsCompanyMainService',
		'basicsCommonMandatoryProcessor',
		function (globals,_,platformDataServiceFactory,basicsCompanyICPartnerCardDataService,basicsLookupdataLookupFilterService,platformContextService,basicsCompanyMainService,
			basicsCommonMandatoryProcessor) {
			var service = {};
			var basicsCompanyICPartnerAccOption = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'basicsCompanyICPartnerAccDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/company/icpartneracc/',
						endRead: 'listByICPartner',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = basicsCompanyICPartnerCardDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					entityRole: {
						leaf: {
							itemName: 'CompanyICPartnerAcc',
							parentService: basicsCompanyICPartnerCardDataService
						}
					},
					presenter: {
						list: {
							initCreationData: function initNumberCreationData(creationData) {
								var selected = basicsCompanyICPartnerCardDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					}
				}
			};
			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCompanyICPartnerAccOption);
			service = serviceContainer.service;


			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'CompanyICPartnerAccDto',
				moduleSubModule: 'Basics.Company',
				validationService: 'basicsCompanyICPartnerCardValidationServiceProcessor',
				mustValidateFields: ['PrcStructureFk']
			});
			var filters = [
				{
					key: 'prc-structure-filter',
					serverSide: true,
					serverKey: 'bas.company.procurement.structure.filterkey',
					fn: function (entity) {
						return {
							ContextFk:basicsCompanyMainService.getSelected() ? basicsCompanyMainService.getSelected().Id : null,
							FilterKey:'bas.company.procurement.structure.filterkey'
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
			//
			// service.getContainerUUID = function getContainerUUID() {
			// 	return 'DC54A929EB6341AB9B2BA8CB2152D989';
			// };

			return  service;
		}
	]);
})(angular);