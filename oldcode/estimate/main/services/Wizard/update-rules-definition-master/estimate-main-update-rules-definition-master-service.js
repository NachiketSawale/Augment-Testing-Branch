/*
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	/* global  globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainUpdateRulesDefinitionMasterService', [ '$q', '$http', '$injector','platformSchemaService', '$translate',
		'platformModalService', 'estimateMainRuleDataService','platformSidebarWizardCommonTasksService','cloudCommonGridService',
		function ( $q, $http,$injector, platformSchemaService, $translate,
			platformModalService, estimateMainRuleDataService,platformSidebarWizardCommonTasksService,cloudCommonGridService) {

			let currentItem = {};
			let service = {
				showDialog:showDialog,
				createOrUpdateRules : createOrUpdateRules,
				getCurrentItem:getCurrentItem,
				setCurrentItem:setCurrentItem
			};

			function getCurrentItem() {
				return currentItem;
			}

			function setCurrentItem(item) {
				currentItem = item;
			}

			function showDialog() {

				let selectedPrjEstRule = estimateMainRuleDataService.getSelected(),
					title = $translate.instant('estimate.main.updateRules'),
					msg = $translate.instant('estimate.main.noSelectedRule');

				if (platformSidebarWizardCommonTasksService.assertSelection(selectedPrjEstRule, title, msg)) {
					if (!selectedPrjEstRule.IsPrjRule) {
						platformModalService.showMsgBox($translate.instant('estimate.main.noMasterSelectedRule'), $translate.instant('estimate.main.updateRules'), 'warning');
						return;
					}
					let options = {
						templateUrl: globals.appBaseUrl + moduleName + '/templates/details-parameters-dialog/estimate-main-details-param-dialog.html',
						controller: 'estimateMainUpdateRulesDefinitionMasterController',
						width: '180',
						height: '300px',
						resizeable: true
					};

					$injector.get('estimateRuleLookupDataService').getList({lookupType:'estimatemasterrules', dataServiceName:'estimateRuleLookupDataService'})
						.then(function(list){
							let output = [];
							cloudCommonGridService.flatten(list, output, 'EstRules');
							let ruleId;
							let masterRuleItem = _.find(output, {MainId:estimateMainRuleDataService.getSelected().MainId});
							if(masterRuleItem){
								ruleId = masterRuleItem.Id;
							}else{
								ruleId = output[0].Id;
							}

							service.setCurrentItem({
								isCreateUpdateRule: 'IsUpdateRule',
								__rt$data: {
									readonly: [
										{field: 'Code', readonly: true},
										{field: 'Description', readonly: true}
									]
								},
								Code:'',
								rulesMasterTargetId:ruleId
							});

							platformModalService.showDialog(options);
						});
				}
			}

			function createOrUpdateRules(item) {
				let sourceRuleItem=estimateMainRuleDataService.getSelected();
				if (!sourceRuleItem.IsPrjRule) {
					platformModalService.showMsgBox($translate.instant('estimate.main.noMasterSelectedRule'), $translate.instant('estimate.main.updateRules'), 'warning');
					return;
				}

				let data = {
					SourceRuleId : sourceRuleItem.OriginalMainId,
					IsCreateRule: item.isCreateUpdateRule,
					NewRuleCode:item.Code,
					NewRuleDescription:item.Description,
					TargetRuleId:item.rulesMasterTargetId,
				};
				return $http.post(globals.webApiBaseUrl + 'estimate/rule/estimaterule/createoroverwritemasterrule', data)
					.then(function(response){
						let result = response.data;
						platformModalService.showMsgBox($translate.instant('estimate.main.updateRuleSuccess'), $translate.instant('estimate.main.updateRules'),'info');
						return result;
					});
			}
			return service;
		}]);

})(angular);
