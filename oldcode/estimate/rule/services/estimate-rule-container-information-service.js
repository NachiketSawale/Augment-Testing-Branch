/**
 * $Id:  $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global _ */

	/**
	 * @ngdoc service
	 * @name estimateRuleContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module('estimate.rule').service('estimateRuleContainerInformationService', EstimateRuleContainerInformationService);

	EstimateRuleContainerInformationService.$inject = ['$injector', 'platformLayoutHelperService'];

	function EstimateRuleContainerInformationService($injector, platformLayoutHelperService) {
		let dynamicConfigurations = {};
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				// for dynamic containers
				case '677F693B516C41C3B65FD3D1B68E652D':
					config = platformLayoutHelperService.getStandardGridConfig(this.getProjectEstRuleParamLayout());
					break;
				case 'EDAB9784710A4822AEA158E82ECE45F7':
					config = platformLayoutHelperService.getStandardGridConfig(this.getProjectEstRuleParamValueLayout());
					break;
				default:
					config = this.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
					break;
			}

			return config;
		};

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		this.getProjectEstRuleParamLayout = function getProjectEstRuleParamLayout() {
			return {
				standardConfigurationService: 'estimateProjectEstRuleParamConfigFactory',
				dataServiceName: 'estimateProjectEstRuleParamService',
				validationServiceName: 'estimateProjectEstRuleParamValidationService'
			};
		};

		this.getProjectEstRuleParamValueLayout = function getProjectEstRuleParamValueLayout() {
			return {
				standardConfigurationService: 'estimateProjectEstRuleParamValueConfigService',
				dataServiceName: 'estimateProjectEstRuleParameterValueService',
				validationServiceName: 'estimateProjectEstRuleParamValueValidationService'
			};
		};
	}
})(angular);

