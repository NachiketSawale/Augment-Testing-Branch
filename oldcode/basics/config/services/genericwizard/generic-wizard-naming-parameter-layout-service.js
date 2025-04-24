/**
 * Created by baf on 03.05.2016
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigGenericWizardNamingParameterLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form of generic wizard naming parameters
	 */
	angular.module(moduleName).service('basicsConfigGenericWizardNamingParameterLayoutService', basicsConfigGenericWizardNamingParameterLayoutService);

	basicsConfigGenericWizardNamingParameterLayoutService.$inject = ['basicsConfigGenericWizardUIConfigurationService'];

	function basicsConfigGenericWizardNamingParameterLayoutService(basicsConfigGenericWizardUIConfigurationService) {
		const service = {};
		var detailConfig = null;
		var listConfig = null;

		function initializeContainerConfigurations() {
			var entityLayout = basicsConfigGenericWizardUIConfigurationService.getNamingParameterLayout();

			var layouts = basicsConfigGenericWizardUIConfigurationService.provideContainerConfigurations(entityLayout, 'GenericWizardNamingParameterDto');
			detailConfig = layouts.detailLayout;
			listConfig = layouts.listLayout;
		}

		service.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			if (listConfig === null) {
				initializeContainerConfigurations();
			}

			return detailConfig;
		};

		service.getStandardConfigForListView = function getStandardConfigForListView() {
			if (listConfig === null) {
				initializeContainerConfigurations();
			}

			return listConfig;
		};

		return service;
	}
})();
