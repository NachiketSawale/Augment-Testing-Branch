/**
 * Created by jie 2024.08.12
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.package';
	var module = angular.module(moduleName);

	angular.module(moduleName).factory('packageExtBidder2ContactDataService',
		['$q', '$http', '$injector', '$log', 'platformDataServiceFactory', 'procurementPackage2ExtBidderService', 'procurementModuleName', 'procurementContextService','basicsCommonMandatoryProcessor',
			function ($q, $http, $injector, $log, platformDataServiceFactory, procurementPackage2ExtBidderService, procurementModuleName, procurementContextService,mandatoryProcessor) {

				function constructorFn(moduleName, leadingService, directParentServiceName) {
					var option = {
						moduleName: moduleName,
						leadingService: leadingService,
						directParentServiceName: directParentServiceName ?? null
					};
					var packageExtBidder2ContactServiceOptions = {
						flatLeafItem: {
							module: module,
							serviceName: 'packageExtBidder2ContactDataService',
							httpCRUD: {
								route: globals.webApiBaseUrl + 'procurement/package/extbidder2contact/',
								endCreate: 'create',
								endRead: 'list',
								initReadData: initReadData
							},
							presenter: {
								list: {
									initCreationData: initCreate
								}
							},
							entityRole: {
								leaf: {
									itemName: 'PrcPackage2ExtBpContact',
									parentService: procurementPackage2ExtBidderService.getProcurementExtBidderService(option)
								}
							},
							useItemFilter: true
						}
					};

					function initReadData(readData) {
						const extBidder = getExtBidder();
						if (extBidder) {
							readData.filter = '?mainItemId=' + extBidder.Id;
							return readData;
						}
					}

					function initCreate(readData) {
						const extBidder = getExtBidder();
						if (extBidder) {
							readData.PKey1 = extBidder.Id;
							return readData;
						}
					}

					function getExtBidder() {
						const extBidder = procurementPackage2ExtBidderService.getProcurementExtBidderService(option).getSelected();
						if (extBidder) {
							return extBidder;
						}
						return {};
					}

					var serviceContainer = platformDataServiceFactory.createNewComplete(packageExtBidder2ContactServiceOptions);

					var service = serviceContainer.service;

					service.cleanServiceCache =()=> {
						serviceContainer.service.clearCache();
					}

					service.canCreate=()=>{
						const extBidder = procurementPackage2ExtBidderService.getProcurementExtBidderService(option).getSelected();
						if (extBidder) {
							return !_.isNil(extBidder.BusinessPartnerFk);
						}
						return false;
					}
					var validationOption = {
						moduleName: moduleName,
						service:service
					}
					var generalValidationService = $injector.get('packageExtBidder2ContactValidationService');
					var validationService = generalValidationService.getExtBidder2ContactValidationService(validationOption);
					serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
						typeName: 'PrcPackage2ExtBpContactDto',
						moduleSubModule: 'Procurement.Common',
						validationService: validationService,
						mustValidateFields: ['BpdContactFk']
					});

					return service;
				}
				var serviceCache = {};
				function createExt2ContactService(option) {
					var moduleName = option.moduleName;
					if (!serviceCache.hasOwnProperty(moduleName)) {
						serviceCache[moduleName] = constructorFn.apply(null, [option.moduleName, option.leadingService, option.directParentServiceName]);
					}
					var service = serviceCache[moduleName];
					return service;
				}
				return{
					createExt2ContactService:createExt2ContactService
				}
			}]);

})(angular);