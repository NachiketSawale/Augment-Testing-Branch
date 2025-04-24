/**
 * Created by baf on 03.05.2016
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigGenericWizardInstanceParameterLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form of generic wizard instance
	 */
	angular.module(moduleName).service('basicsConfigGenericWizardInstanceParameterLayoutService', BasicsConfigGenericWizardInstanceParameterLayoutService);

	BasicsConfigGenericWizardInstanceParameterLayoutService.$inject = ['basicsConfigGenericWizardUIConfigurationService'];

	function BasicsConfigGenericWizardInstanceParameterLayoutService(basicsConfigGenericWizardUIConfigurationService) {
		var self = this;
		var detailConfig = null;
		var listConfig = null;

		function initializeContainerConfigurations() {
			var entityLayout = basicsConfigGenericWizardUIConfigurationService.getInstanceParameterLayout();

			var layouts = basicsConfigGenericWizardUIConfigurationService.provideContainerConfigurations(entityLayout, 'GenericWizardInstanceParameterDto');
			detailConfig = layouts.detailLayout;
			listConfig = layouts.listLayout;
		}

		self.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			if(listConfig === null) {
				initializeContainerConfigurations();
			}

			return detailConfig;
		};

		self.getStandardConfigForListView = function getStandardConfigForListView() {
			if(listConfig === null) {
				initializeContainerConfigurations();
			}

			return listConfig;
		};
	}
})();
