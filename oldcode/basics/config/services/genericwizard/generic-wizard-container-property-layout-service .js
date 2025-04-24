/**
 * Created by baf on 03.05.2016
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigGenericWizardContainerPropertyLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form of generic wizard instance
	 */
	angular.module(moduleName).service('basicsConfigGenericWizardContainerPropertyLayoutService', BasicsConfigGenericWizardContainerPropertyLayoutService);

	BasicsConfigGenericWizardContainerPropertyLayoutService.$inject = ['basicsConfigGenericWizardUIConfigurationService'];

	function BasicsConfigGenericWizardContainerPropertyLayoutService(basicsConfigGenericWizardUIConfigurationService) {
		var self = this;
		var detailConfig = null;
		var listConfig = null;

		function initializeContainerConfigurations() {
			var entityLayout = basicsConfigGenericWizardUIConfigurationService.getContainerPropertyLayout();

			var layouts = basicsConfigGenericWizardUIConfigurationService.provideContainerConfigurations(entityLayout, 'GenericWizardContainerPropertiesDto');
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
