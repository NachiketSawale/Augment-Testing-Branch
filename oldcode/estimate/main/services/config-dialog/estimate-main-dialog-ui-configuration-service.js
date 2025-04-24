/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let modulename = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name
	 * @description
	 */
	angular.module(modulename).factory('estimateMainDialogUIConfigService',
		['estimateMainEstConfigUIConfigService', 'estimateMainEstColumnConfigUIConfigurationService','estimateMainEstStructureUIConfigService','estimateMainEstUppUIConfigService','estimateMainDialogProcessService','platformTranslateService', 'estimateMainEstTotalsConfigUIConfigurationService', 'estimateMainCostBudgetUIConfigService', 'estimateMainCostCodeAssignmentDetailLookupDataService', 'estimateMainEstRuleUIConfigService','estimateAllowanceAssignmentUIConfigurationService', 'estimateMainRoundingConfigUIConfigurationService',
			function (estimateMainEstConfigUIConfigService, estimateMainEstColumnConfigUIConfigurationService, estimateMainEstStructureUIConfigService, estimateMainEstUppUIConfigService,estimateMainDialogProcessService, platformTranslateService,estimateMainEstTotalsConfigUIConfigurationService, estimateMainCostBudgetUIConfigService, estimateMainCostCodeAssignmentDetailLookupDataService, estimateMainEstRuleUIConfigService,estimateAllowanceAssignmentUIConfigurationService, roundingConfigUIService) {

				let service = {};

				function getBaseFormConfig(){
					return {
						showGrouping: true,
						change:'change',
						addValidationAutomatically: true,
						groups: [],
						rows: [],
						overloads: {},
						skipPermissionCheck : true
					};
				}

				/**
			 * @ngdoc function
			 * @name getFormConfig
			 * @function
			 * @methodOf estimateMainUIConfigService
			 * @description Builds and returns the form configuration for the estimate configuration dialog
			 */
				service.getFormConfig = function() {
					let formConfig = getBaseFormConfig();

					let dialogConfig = estimateMainDialogProcessService.getDialogConfig();
					estimateMainCostCodeAssignmentDetailLookupDataService.setEditType(dialogConfig.editType);
					let isAssemblies = dialogConfig.editType==='assemblies';

					if(dialogConfig.editType==='estimate' || dialogConfig.editType==='customizeforall' || dialogConfig.editType==='assemblies') {
					// merge estimate config
						let estConfig = estimateMainEstConfigUIConfigService.getFormConfig(dialogConfig.editType==='customizeforall', isAssemblies);
						formConfig.groups = formConfig.groups.concat(estConfig.groups);
						formConfig.rows = formConfig.rows.concat(estConfig.rows);
						if (estConfig.overloads) {
							angular.extend(formConfig.overloads, estConfig.overloads);
						}
					}

					if(dialogConfig.editType==='estimate' || dialogConfig.editType==='customizeforall' || dialogConfig.editType==='customizeforcolumn' || dialogConfig.editType==='assemblies') {
					// merge column config
						let colConfig = estimateMainEstColumnConfigUIConfigurationService.getFormConfig(dialogConfig.editType==='customizeforall' || dialogConfig.editType==='customizeforcolumn', isAssemblies);
						formConfig.groups = formConfig.groups.concat(colConfig.groups);
						formConfig.rows = formConfig.rows.concat(colConfig.rows);
						if (colConfig.overloads) {
							angular.extend(formConfig.overloads, colConfig.overloads);
						}
					}

					if(dialogConfig.editType==='estimate' || dialogConfig.editType==='customizeforall' || dialogConfig.editType==='customizefortotals' || dialogConfig.editType==='assemblies') {
					// merge estimate totals config
						let estTotalsConfig = estimateMainEstTotalsConfigUIConfigurationService.getFormConfig(dialogConfig.editType==='customizeforall' || dialogConfig.editType==='customizefortotals', isAssemblies);
						formConfig.groups = formConfig.groups.concat(estTotalsConfig.groups);
						formConfig.rows = formConfig.rows.concat(estTotalsConfig.rows);
						if (estTotalsConfig.overloads) {
							angular.extend(formConfig.overloads, estTotalsConfig.overloads);
						}
					}

					if(dialogConfig.editType==='estimate' || dialogConfig.editType==='customizeforall' || dialogConfig.editType==='customizeforstructure' || dialogConfig.editType==='assemblies') {
					// merge estimate structure config
						let estStructConfig = estimateMainEstStructureUIConfigService.getFormConfig(dialogConfig.editType==='customizeforall' || dialogConfig.editType==='customizeforstructure', isAssemblies);
						formConfig.groups = formConfig.groups.concat(estStructConfig.groups);
						formConfig.rows = formConfig.rows.concat(estStructConfig.rows);
						if (estStructConfig.overloads) {
							angular.extend(formConfig.overloads, estStructConfig.overloads);
						}
					}

					if(dialogConfig.editType==='estBoqUppConfig') {
						// merge upp config
						let uppConfig = estimateMainEstUppUIConfigService.getEstBoqFormConfig();
						formConfig.groups = formConfig.groups.concat(uppConfig.groups);
						formConfig.rows = formConfig.rows.concat(uppConfig.rows);
						if (uppConfig.overloads) {
							angular.extend(formConfig.overloads, uppConfig.overloads);
						}
					}

					if(dialogConfig.editType==='customizeforupp') {
						// merge upp config
						let uppConfig = estimateMainEstUppUIConfigService.getFormConfig();
						formConfig.groups = formConfig.groups.concat(uppConfig.groups);
						formConfig.rows = formConfig.rows.concat(uppConfig.rows);
						if (uppConfig.overloads) {
							angular.extend(formConfig.overloads, uppConfig.overloads);
						}
					}

					if(dialogConfig.editType==='estimate' || dialogConfig.editType==='customizeforall' || dialogConfig.editType==='customizeforruleassign') {
					// merge estimate rule assignment config
						let estRuleAssignmentConfig = estimateMainEstRuleUIConfigService.getFormConfig(dialogConfig.editType==='customizeforall' || dialogConfig.editType==='customizeforruleassign', isAssemblies);
						formConfig.groups = formConfig.groups.concat(estRuleAssignmentConfig.groups);
						formConfig.rows = formConfig.rows.concat(estRuleAssignmentConfig.rows);
						if (estRuleAssignmentConfig.overloads) {
							angular.extend(formConfig.overloads, estRuleAssignmentConfig.overloads);
						}
					}

					if(dialogConfig.editType==='customizeforall'){
						let estAllowanceAssignmentConfig = estimateAllowanceAssignmentUIConfigurationService.getFormConfig();
						formConfig.groups = formConfig.groups.concat(estAllowanceAssignmentConfig.groups);
						formConfig.rows = formConfig.rows.concat(estAllowanceAssignmentConfig.rows);
						if (estAllowanceAssignmentConfig.overloads) {
							angular.extend(formConfig.overloads, estAllowanceAssignmentConfig.overloads);
						}
					}

					if(dialogConfig.editType==='estimate' || dialogConfig.editType==='customizeforall' || dialogConfig.editType==='customizeforroundingconfig' || dialogConfig.editType==='assemblies') {
						// merge estimate rounding config
						let estRoundingConfig = roundingConfigUIService.getFormConfig(dialogConfig.editType==='customizeforall' || dialogConfig.editType==='customizeforroundingconfig', isAssemblies);
						formConfig.groups = formConfig.groups.concat(estRoundingConfig.groups);
						formConfig.rows = formConfig.rows.concat(estRoundingConfig.rows);
						if (estRoundingConfig.overloads) {
							angular.extend(formConfig.overloads, estRoundingConfig.overloads);
						}
					}

					platformTranslateService.translateFormConfig(formConfig);
					return formConfig;
				};

				return service;
			}
		]);

})();
