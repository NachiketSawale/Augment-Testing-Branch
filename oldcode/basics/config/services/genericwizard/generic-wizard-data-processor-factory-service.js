/**
 * Created by baf on 2016/06/01
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigGenericWizardContainerLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form of generic wizard instance
	 */
	angular.module(moduleName).service('basicsConfigGenericWizardDataProcessorFactoryService', BasicsConfigGenericWizardDataProcessorFactoryService);

	function BasicsConfigGenericWizardDataProcessorFactoryService() {
		this.getModuleFkDataProcessor = function getModuleFkDataProcessor(field, modServ) {
			return {
				processItem: function processItem(item) {
					item[field] = modServ.getSelected().DescriptionInfo.Translated;
				}
			};
		};

		this.getInstanceFkDataProcessor = function getInstanceFkDataProcessor(field, w2gServ) {
			return {
				processItem: function processItem(item) {
					item[field] = w2gServ.getSelected().DescriptionInfo.Translated;
				}
			};
		};

		this.getStepFkDataProcessor = function getStepFkDataProcessor(field, stepServ) {
			return {
				processItem: function processItem(item) {
					item[field] = stepServ.getSelected().Title;
				}
			};
		};

		this.getContainerFkDataProcessor = function getContainerFkDataProcessor(field, contServ) {
			return {
				processItem: function processItem(item) {
					item[field] = contServ.getSelected().Title;
				}
			};
		};
	}
})();
