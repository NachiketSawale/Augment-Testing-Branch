/**
 * Created by sandu on 31.03.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigTranslationService
	 * @description provides translation for this module
	 */
	angular.module(moduleName).service('basicsConfigTranslationService', ['platformUIBaseTranslationService', 'basicsConfigModuleDetailLayout', 'basicsConfigTabDetailLayout', 'basicsConfigReportGroupDetailLayout', 'basicsConfigReportXGroupDetailLayout', 'basicsConfigWizardGroupLayout', 'basicsConfigWizardXGroupLayout', 'basicsConfigWizardXGroupPValueLayout', 'basicsConfigAdditionalWordsForGenericWizard',
		'basicsConfigAuditContainerLayout',
		'basicsConfigAuditColumnLayout', 'basicsConfigMcTwoQnADetailLayout', 'basicsConfigModuleViewsLayout', 'basicsConfigDataConfigurationColumnLayout', 'basicsConfigDataConfigurationDialogColumnLayout', 'basicsConfigDashboardXModuleLayout','basicsConfigCommandbarLayout','basicsConfigNavbarLayout',
		function (platformUIBaseTranslationService, basicsConfigModuleDetailLayout, basicsConfigTabDetailLayout, basicsConfigReportGroupDetailLayout, basicsConfigReportXGroupDetailLayout, basicsConfigWizardGroupLayout, basicsConfigWizardXGroupLayout, basicsConfigWizardXGroupPValueLayout, basicsConfigAdditionalWordsForGenericWizard,
				  basicsConfigAuditContainerLayout,
				  basicsConfigAuditColumnLayout, basicsConfigMcTwoQnADetailLayout, basicsConfigModuleViewsLayout, basicsConfigDataConfigurationColumnLayout, basicsConfigDataConfigurationDialogColumnLayout, basicsConfigDashboardXModuleLayout, basicsConfigCommandbarLayout, basicsConfigNavbarLayout) {

			var localBuffer = {};
			platformUIBaseTranslationService.call(this, new Array(basicsConfigModuleDetailLayout, basicsConfigTabDetailLayout, basicsConfigReportGroupDetailLayout, basicsConfigReportXGroupDetailLayout, basicsConfigWizardGroupLayout, basicsConfigWizardXGroupLayout, basicsConfigWizardXGroupPValueLayout, basicsConfigAdditionalWordsForGenericWizard,
				basicsConfigAuditContainerLayout,
				basicsConfigAuditColumnLayout, basicsConfigMcTwoQnADetailLayout, basicsConfigModuleViewsLayout, basicsConfigDataConfigurationColumnLayout, basicsConfigDataConfigurationDialogColumnLayout, basicsConfigDashboardXModuleLayout, basicsConfigCommandbarLayout, basicsConfigNavbarLayout),
			localBuffer);

		}
	]);
})(angular);