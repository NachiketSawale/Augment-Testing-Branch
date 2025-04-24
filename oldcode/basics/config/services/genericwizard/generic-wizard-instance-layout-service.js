/**
 * Created by baf on 03.05.2016
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigGenericWizardInstanceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form of generic wizard instance
	 */
	angular.module(moduleName).service('basicsConfigGenericWizardInstanceLayoutService', BasicsConfigGenericWizardInstanceLayoutService);

	BasicsConfigGenericWizardInstanceLayoutService.$inject = ['basicsConfigGenericWizardUIConfigurationService'];

	function BasicsConfigGenericWizardInstanceLayoutService(basicsConfigGenericWizardUIConfigurationService) {
		var self = this;
		var detailConfig = null;
		var listConfig = null;

		function initializeContainerConfigurations() {
			var entityLayout = basicsConfigGenericWizardUIConfigurationService.getInstanceLayout();

			var layouts = basicsConfigGenericWizardUIConfigurationService.provideContainerConfigurations(entityLayout, 'GenericWizardInstanceDto');
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
