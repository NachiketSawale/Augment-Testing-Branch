/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */
(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainRuleDetailUIConfigService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Rule Detail UI Config for dialog.
	 */
	angular.module(moduleName).factory('estimateMainRuleDetailUIConfigService',
		['$injector','basicsLookupdataConfigGenerator', 'platformTranslateService',
			function ($injector, basicsLookupdataConfigGenerator, platformTranslateService) {

				let service = {};

				let gridColumns = [
					{
						id: 'rootAssignmentLevel',
						field: 'EstRootAssignmentLevelFk',
						name: 'Estimate',
						name$tr$: 'estimate.main.estimate',
						width: 170,
						toolTip: 'Estimate',
						toolTip$tr$: 'estimate.main.estimate',
						editor: null,
						formatter: function () {
							return 'Root';
						},
						readonly: true
					},
					{
						id: 'rootAssignRules',
						field: 'EstRuleFk',
						name: 'Rules',
						name$tr$: 'estimate.main.estRuleAssignmentConfigDetails.rules',
						width: 170,
						toolTip: 'Rules',
						toolTip$tr$: 'estimate.main.estRuleAssignmentConfigDetails.rules',

						editor: 'lookup',
						editorOptions: {
							directive: 'estimate-main-est-rule-detail-rule-lookup',
							lookupOptions: {
								showClearButton: false,
								isTextEditable: false,
								gridOptions: {
									multiSelect: false
								},
								filterKey: 'estimate-main-est-rule-detail-rule-filter',
							},
						},
						formatter: 'lookup',
						formatterOptions: {
							dataServiceName: 'estimateMainEstRuleAssignRuleLookupService',
							lookupType: 'estimateRootConfigRuleLookup',
							displayMember: 'Code'
						}

					}
				];

				platformTranslateService.translateGridConfig(gridColumns);

				service.getStandardConfigForListView = function(){

					let dialogConfig = $injector.get('estimateMainDialogProcessService').getDialogConfig();
					let filterColumns = [];
					if(dialogConfig.editType==='customizeforall' || dialogConfig.editType==='customizeforstructure'){
						filterColumns = _.filter(gridColumns, function (item) {
							return item.id !== 'code';
						});
					}else{
						filterColumns = _.filter(gridColumns, function (item) {
							return item.id !== 'code1';
						});
					}

					return{
						addValidationAutomatically: true,
						columns : filterColumns
					};
				};

				service.getFields = function (){
					return ['RootAssignmentLevel', 'RootAssignRule'];
				};

				return service;

			}
		]);

})(angular);
