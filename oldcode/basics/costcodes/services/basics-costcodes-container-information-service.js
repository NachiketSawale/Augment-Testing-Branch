/*
 * $Id: basics-costcodes-container-information-service.js winjit.deshkar $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';

	const moduleName = 'basics.costcodes';
	let MainModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name basicsCostcodesContainerInformationService
     * @function
     *
     * @description
     *
     */

	MainModule.factory('basicsCostcodesContainerInformationService', ['$injector','platformLayoutHelperService',
		function ($injector,platformLayoutHelperService) {
			let dynamicConfigurations = {};
			let service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};

				switch (guid) {

					case 'CEEB3A8D7F3E41ABA9AA126C7A802F87':
						config = platformLayoutHelperService.getStandardGridConfig(service.getBasicsCostcodeServiceInfos());
						break;
					case 'EF116AB75A4246BF98055F17833C6DB1':
						config = platformLayoutHelperService.getStandardDetailConfig(service.getBasicsCostcodeServiceInfos());
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

			service.getBasicsCostcodeServiceInfos = function getBasicsCostcodeServiceInfos() {
				return {
					standardConfigurationService: 'basicsCostCodesUIStandardService',
					dataServiceName: 'basicsCostCodesMainService',
					validationServiceName: 'basicsCostCodeskValidationService'
				};
			};

			return service;

		}
	]);
})(angular);