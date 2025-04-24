(function () {
	/*global globals*/
	'use strict';
	var companyModule = angular.module('basics.company');
	/**
	 * @ngdoc service
	 * @name basicsCompanyTransheaderService
	 * @function
	 *
	 * @description
	 * basicsCompanyTransheaderService is the data service for all Company related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	companyModule.factory('basicsCompanyTransheaderService', ['_', 'platformRuntimeDataService', 'basicsCompanyPeriodsService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension','basicsCompanyMainService',

		function (_, platformRuntimeDataService, basicsCompanyPeriodsService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCompanyMainService) {

			var basicsTransheaderServiceOption = {
				flatNodeItem: {
					module: companyModule,
					serviceName: 'basicsCompanyTransheaderService',
					entityNameTranslationID: 'basics.company.entityTransheader',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/company/transheader/'
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'CompanyTransheaderDto',
						moduleSubModule: 'Basics.Company'
					}),{
						processItem: function processItem(hdr) {
							platformRuntimeDataService.readonly(hdr, hdr.IsSuccess);
						}
					}],
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var compPeriod = basicsCompanyPeriodsService.getSelected();
								var companyId = basicsCompanyMainService.getSelected();
								creationData.periodId = compPeriod.Id;
								creationData.companyId =companyId.Id;
								creationData.periods = compPeriod;
							}
						}
					},
					entityRole: {node: {itemName: 'Transheader', parentService: basicsCompanyPeriodsService}}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsTransheaderServiceOption);
			//serviceContainer.data.newEntityValidator = basicsCompanyTransheaderValidationProcessor;
			var service = serviceContainer.service;

			service.canDelete = function canDelete() {
				var hdr = service.getSelected();

				return !!hdr && !hdr.IsSuccess;
			};

			return serviceContainer.service;
		}]);
})(angular);
