/*
 * $Id: basics-controlling-costcodes-container-information-service.js winjit.deshkar $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';

	const moduleName = 'basics.controllingcostcodes';
	let MainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsControllingcostcodesContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */

	MainModule.factory('basicsControllingcostcodesContainerInformationService', ['$injector',
		function ($injector) {
			let dynamicConfigurations = {};
			let service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};

				switch (guid) {

					case 'ec5c193f31594e03b340da66dc42cc17':
						config.layout = $injector.get('basicsControllingCostCodesUIConfig').getControllingCostCodesUILayout();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsControllingCostCodesUIStandardService';
						config.dataServiceName = 'basicsControllingCostCodesMainService';
						config.validationServiceName = 'basicsControllingCostCodesValidationService';
						break;
					case 'f45707e67df846dfaf61f8a0c76053d3':
						config.layout = $injector.get('basicsControllingCostCodesUIConfig').getControllingCostCodesUILayout();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsControllingCostCodesUIStandardService';
						config.dataServiceName = 'basicsControllingCostCodesMainService';
						config.validationServiceName = 'basicsControllingCostCodesValidationService';
						break;
					default:
						config = service.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
						break;
				}
				return config;
			};

			service.hasDynamic = function hasDynamic(guid) {
				return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
			};

			service.takeDynamic = function takeDynamic(guid, config) {
				dynamicConfigurations[guid] = config;
			};

			return service;

		}
	]);
})(angular);