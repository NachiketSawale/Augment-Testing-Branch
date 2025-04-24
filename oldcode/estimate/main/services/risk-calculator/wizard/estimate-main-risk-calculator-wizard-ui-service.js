/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).service('estimateMainRiskRegisterCalculatorWizardUIService', [
		'estimateMainRiskCalculatorDialogUIConfigService','estimateCommonDynamicConfigurationServiceFactory',
		'platformTranslateService',
		function (estMainRiskCalculatorDialogUI,estimateCommonDynamicConfigurationServiceFactory,
			platformTranslateService) {

			let formConfig = angular.copy(estMainRiskCalculatorDialogUI.getBaseFormConfig());
			let resultConfig = angular.copy(estMainRiskCalculatorDialogUI.getRiskCalculatorResultsConfig());
			let impactConfig = angular.copy(estMainRiskCalculatorDialogUI.getRiskCalculatorImpactConfig());
			let eventsConfig = angular.copy(estMainRiskCalculatorDialogUI.getRiskCalculatorRiskEventsConfig());
			let registerConfig = angular.copy(estMainRiskCalculatorDialogUI.getRiskCalculatorRegisterConfig());
			let impactUITest = _.cloneDeep(estimateCommonDynamicConfigurationServiceFactory.getService('basicsRiskRegisterImpactStandardConfigurationService', platformTranslateService).getStandardConfigForDetailView());
			let confirmationConfig = angular.copy(estMainRiskCalculatorDialogUI.getConfirmationConfig());
			let service = {};

			let customizeButtonObj = {
				gid:'basicData',
				rid:'customizeBtn',
				label: 'Customize',
				label$tr$: 'estimate.main.riskCalculator.customize',
				type: 'boolean',
				model:'CustomizeImpact',// 'wizardData.SelectedImpact.CustomizeImpact',
				readonly: false,
				checked: false,
				disabled: false,
				visible: true,
				sortOrder: 0
			};

			service.getResultConfig= function () {

				return createFinalConfig(resultConfig);
			};

			service.getImpactConfig= function () {
				impactConfig.rows[0].model = 'wizardData.SelectedImpact.CustomizeImpact';
				impactConfig.rows[1].model = 'wizardData.SelectedImpact';
				return createFinalConfig(impactConfig);
			};

			service.getProjectEventsConfig= function () {

				return createFinalConfig(eventsConfig);
			};

			service.getRegisterConfig= function () {
				return createFinalConfig(registerConfig);
			};

			service.getConfirmationConfig = function(){
				return createFinalConfig(confirmationConfig);
			};

			service.getImpactUITest = function () {

				let uiToChange = angular.copy(impactUITest);
				// impactUITest.rows = angular.copy(impactUITest.rows);
				uiToChange.rows = uiToChange.rows.concat(customizeButtonObj);
				return createFinalConfig(uiToChange);
			};


			function createFinalConfig(configObj){

				let base = angular.copy(formConfig);

				base.groups = base.groups.concat(configObj.groups);
				base.rows = base.rows.concat(configObj.rows);

				return base;
			}

			return service;
		}
	]);
})(angular);
