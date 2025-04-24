(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name transportplanningPackageReadonlyDataServiceFactory
	 * @function
	 *
	 * @description
	 * transportplanningPackageReadonlyDataServiceFactory is the data service factory for readonly package data of Waypoint,"PackageSubFk", etc.
	 */
	var moduleName = 'transportplanning.package';
	var angModule = angular.module(moduleName);

	angModule.factory('transportplanningPackageReadonlyDataServiceFactory', service);

	service.$inject = [
		'$injector',
		'globals',
		'basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupDescriptorService',
		'platformDataServiceFactory',
		'ServiceDataProcessArraysExtension',
		'platformDataServiceProcessDatesBySchemeExtension',
		'transportplanningPackageDataProcessor',
		'transportplanningPackageImageProcessor',
		'transportplanningPackageGoodsHandler'];
	function service($injector,
					 globals,
					 basicsCommonMandatoryProcessor,
					 basicsLookupdataLookupDescriptorService,
					 platformDataServiceFactory,
					 ServiceDataProcessArraysExtension,
					 platformDataServiceProcessDatesBySchemeExtension,
					 transportplanningPackageDataProcessor,
					 transportplanningPackageImageProcessor,
					 packageGoodsHandler) {

		var serviceFactory = {};
		var serviceCache = {};
		serviceFactory.createNewComplete = function (option) {
			var parentService= $injector.get(option.parentServiceName);
			var systemOption = {
				flatLeafItem: {
					serviceName: option.serviceName,
					entityNameTranslationID: 'transportplanning.package.entityPackage',
					httpRead: {
						route: globals.webApiBaseUrl + 'transportplanning/package/',
						endRead: option.endRead
					},
					entityRole: {
						leaf: {
							itemName: 'TransportPackage',
							parentService: parentService,
							parentFilter: option.parentFilter
						}
					},
					actions: {},
					//processor: [new ServiceDataProcessArraysExtension(['ChildPackages'])],
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'TransportPackageDto',
						moduleSubModule: 'TransportPlanning.Package'
					}), transportplanningPackageDataProcessor, transportplanningPackageImageProcessor],

					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = {
									FilterResult: undefined,
									dtos: []
								};
								if (readData && readData.Main) {
									result.dtos = readData.Main;
								}
								if (readData && readData.FilterResult) {
									result.FilterResult = readData.FilterResult;
								}

								packageGoodsHandler.updateGoodsDescription(result.dtos, function () {
									serviceContainer.data.handleReadSucceeded(result, data);
								});
							}
						}
					}
				}
			};
			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(systemOption);
			serviceContainer.data.usesCache = false;
			return serviceContainer.service;
		};

		serviceFactory.getService = function (option) {
			if(!serviceCache[option.serviceName]){
				serviceCache[option.serviceName] = serviceFactory.createNewComplete(option);
			}
			return serviceCache[option.serviceName];
		};
		return serviceFactory;
	}
})(angular);