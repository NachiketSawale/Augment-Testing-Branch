/**
 * Created by joshi on 05.04.2016.
 */

(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';

	var modulename = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name
	 * @description
	 */
	angular.module(modulename).factory('constructionsystemMainDialogUIConfigService',
		['estimateMainEstConfigUIConfigService', 'estimateMainEstColumnConfigUIConfigurationService','estimateMainEstStructureUIConfigService','estimateMainEstUppUIConfigService','estimateMainDialogProcessService','platformTranslateService', 'estimateMainEstTotalsConfigUIConfigurationService', 'estimateMainCostBudgetUIConfigService', 'estimateMainCostCodeAssignmentDetailLookupDataService',
			function (estimateMainEstConfigUIConfigService, estimateMainEstColumnConfigUIConfigurationService, estimateMainEstStructureUIConfigService, estimateMainEstUppUIConfigService,estimateMainDialogProcessService, platformTranslateService,estimateMainEstTotalsConfigUIConfigurationService, estimateMainCostBudgetUIConfigService, estimateMainCostCodeAssignmentDetailLookupDataService) {

				var service = {};

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
					var formConfig = getBaseFormConfig();

					var dialogConfig = estimateMainDialogProcessService.getDialogConfig();
					estimateMainCostCodeAssignmentDetailLookupDataService.setEditType(dialogConfig.editType);

					var colConfig = estimateMainEstColumnConfigUIConfigurationService.getFormConfig(true,false);
					colConfig.rows[2].directive = 'constructionsystem-main-column-config-detail-grid';
					formConfig.groups = formConfig.groups.concat(colConfig.groups);
					formConfig.rows = formConfig.rows.concat(colConfig.rows);
					if (colConfig.overloads) {
						angular.extend(formConfig.overloads, colConfig.overloads);
					}
					platformTranslateService.translateFormConfig(formConfig);
					return formConfig;
				};

				return service;
			}

		]);

})();
