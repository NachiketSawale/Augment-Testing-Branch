/**
 * Created by lid on 7/18/2017.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name ProductionplanningCommonHeaderMainServiceFactory
	 * @function
	 *
	 * @description
	 * ProductionplanningCommonHeaderMainServiceFactory is the data service for all entities related functionality.
	 */
	var moduleName = 'productionplanning.common';
	var masterModule = angular.module(moduleName);
	masterModule.factory('productionplanningCommonHeaderMainServiceFactory', ProductionplanningCommonHeaderMainServiceFactory);
	ProductionplanningCommonHeaderMainServiceFactory.$inject = ['$injector', 'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningCommonHeaderProcessor',
		'productionplanningCommonStatusLookupService',
		'basicsLookupdataLookupFilterService'];
	function ProductionplanningCommonHeaderMainServiceFactory($injector, platformDataServiceFactory,
															  basicsLookupdataLookupDescriptorService,
															  platformDataServiceProcessDatesBySchemeExtension,
															  productionplanningCommonHeaderProcessor,
															  statusService,
															  basicsLookupdataLookupFilterService) {

		var serviceFactroy = {};
		var serviceCache = {};

		serviceFactroy.createNewComplete = function (foreignKey, moduleId, mainService) {
			var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
				typeName: 'HeaderDto',
				moduleSubModule: 'ProductionPlanning.Common'
			});
			var serviceOption = {
				flatNodeItem: {
					module: masterModule,
					entityNameTranslationID: 'productionplanning.common.header.headerTitle',
					dataProcessor: [productionplanningCommonHeaderProcessor, dateProcessor],
					serviceName: mainService.getServiceName() + 'HeaderDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'productionplanning/header/',
						endRead: 'listForCommon'
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'productionplanning/header/',
						endCreate: 'createForCommon'
					},
					entityRole: {
						node: {
							itemName: 'PPSHeader',
							parentService: mainService,
							parentFilter: 'foreignKey=' + foreignKey + '&mainItemId'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData.Lookups);
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData.dtos || []
								};
								return serviceContainer.data.handleReadSucceeded(result, data);
							},
							initCreationData: function initCreationData(creationData, data) {
								creationData.mainItemId = data.parentService.getSelected().Id;
								creationData.foreignKey = foreignKey;
								if (foreignKey === 'OrdHeaderFk') {
									creationData.prjProjectFk = data.parentService.getSelected().ProjectFk;
								}
							}
						}
					},
					modification: true,
					actions: {
						delete: {},
						create: 'flat',
						canDeleteCallBackFunc: function (selectedItem) {
							if (selectedItem.Version <= 0) {
								return true;
							}

							var headerStatusList = statusService.getHeaderList();
							var status = _.find(headerStatusList, {Id: selectedItem.HeaderStatusFk});
							return status && status.Isdeletable;
						}

					},
					translation: {
						uid: 'productionplanningCommonHeaderMainService',
						title: 'productionplanning.common.header.headerTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'HeaderDto',
							moduleSubModule: 'ProductionPlanning.Common'
						},
					}
				}
			};

			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			var service = serviceContainer.service;
			serviceContainer.data.usesCache = false;
			serviceContainer.data.newEntityValidator = newEntityValidator();
			function newEntityValidator() {
				return {
					validate: function validate(entity) {
						if (entity.Version === 0) {
							var validService = $injector.get('productionplanningCommonHeaderValidationService').getValidationService(service, moduleId);
							validService.asyncValidateCode(entity, null, 'Code');
							//validate foreignKey fields
							validService.validateBasClerkPrpFk(entity, entity.BasClerkPrpFk === 0 ? null : entity.BasClerkPrpFk, 'BasClerkPrpFk');
							validService.validateBasSiteFk(entity, entity.BasSiteFk === 0 ? null : entity.BasSiteFk, 'BasSiteFk');

							validService.validatePrjProjectFk(entity, entity.PrjProjectFk === 0 ? null : entity.PrjProjectFk, 'PrjProjectFk');
							validService.validateLgmJobFk(entity, entity.LgmJobFk === 0 ? null : entity.LgmJobFk, 'LgmJobFk');

						}
					}
				};
			}

			var filters = [{
				key: 'productionplanning-common-header-engheader-filter',
				fn: function (engHeader, ppsHeader) {
					return engHeader.ProjectFk === ppsHeader.PrjProjectFk;
				}
			}];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			service.onValueChanged = function (item, col) {
				switch (col) {
					case 'PrjLocationFk':
						var locationCodeService = $injector.get('productionplanningCommonLocationInfoService');
						var location = basicsLookupdataLookupDescriptorService.getLookupItem('LocationInfo', item.PrjLocationFk);

						if (!location && item.PrjLocationFk !== null) {
							locationCodeService.handleNewLocation(item, service);
						}
						break;
				}
			};

			return service;
		};
		//get service or create service by module name
		serviceFactroy.getService = function getService(foreignKey, moduleId, mainService) {
			if (!serviceCache[moduleId]) {
				serviceCache[moduleId] = serviceFactroy.createNewComplete(foreignKey, moduleId, mainService);
			}
			return serviceCache[moduleId];
		};
		return serviceFactroy;
	}
})(angular);
