/**
 * Created by zwz on 7/15/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.common';
	var itemModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningCommonProductParamDataServiceFactory
	 * @function
	 *
	 * @description
	 *  data service factory of Product Parameters
	 */
	itemModule.factory('productionplanningCommonProductParamDataServiceFactory', DataServiceFactory);

	DataServiceFactory.$inject = ['$injector',
		'basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningCommonProductParamSortingProcessorExtension',
		'productionplanningCommonProductParamValidationServiceFactory'];

	function DataServiceFactory($injector,
								basicsCommonMandatoryProcessor,
								basicsLookupdataLookupDescriptorService,
								platformDataServiceFactory,
								platformDataServiceProcessDatesBySchemeExtension,
								sortingProcessorExtension,
								validationServiceFactory) {
		var serviceCache = {};

		function getOrCreateService (options) {
			if (!serviceCache[options.serviceName]) {
				serviceCache[options.serviceName] = createNewComplete(options);
			}
			return serviceCache[options.serviceName];
		}

		function getServiceByName (serviceName) {
			if (serviceCache[serviceName]) {
				return serviceCache[serviceName];
			}
			return null;
		}

		function createNewComplete (options) {
			var parentService = options.parentServiceName ? $injector.get(options.parentServiceName) : undefined;

			var paramServiceInfo = {
				flatLeafItem: {
					serviceName: options.serviceName,
					dataProcessor: [sortingProcessorExtension.create({'dataServiceName': options.serviceName})],
					entityNameTranslationID: 'productionplanning.common.product.paramEntity',
					httpCreate: {route: globals.webApiBaseUrl + 'productionplanning/common/product/param/'},
					httpRead: {route: globals.webApiBaseUrl + 'productionplanning/common/product/param/'},
					entityRole: {
						leaf: {
							itemName: 'ProductParam',
							parentService: parentService,
							parentFilter: 'productFk'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData || []
								};
								return container.data.handleReadSucceeded(result, data);
							},
							initCreationData: function (creationData) {
								creationData.Id = parentService.getSelected().Id;
							}
						}
					},
					translation: {
						uid: options.serviceName,
						title: 'productionplanning.common.product.paramEntity',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'ProductParamDto',
							moduleSubModule: 'ProductionPlanning.Common',
						},
					}
				}
			};

			/* jshint -W003 */
			var container = platformDataServiceFactory.createNewComplete(paramServiceInfo);

			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ProductParamDto',
				moduleSubModule: 'ProductionPlanning.Common',
				validationService: validationServiceFactory.getService({'dataService': container.service})

			});

			container.data.usesCache = false;

			return container.service;
		}

		return {
			getOrCreateService: getOrCreateService,
			getServiceByName: getServiceByName
		};
	}
})(angular);