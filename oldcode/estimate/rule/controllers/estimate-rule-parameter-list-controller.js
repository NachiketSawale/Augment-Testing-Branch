/**
 * Created by zos on 3/23/2016.
 */
(function () {

	'use strict';
	/* global _ */
	let moduleName = 'estimate.rule';

	/**
	* @ngdoc controller
	* @name estimateRuleParameterListController
	* @function
	*
	* @description
	* Controller for the  list view of estimate rule parameter entities.
	**/
	angular.module(moduleName).controller('estimateRuleParameterListController',
		['$scope','$injector', '$translate', 'platformGridAPI', 'platformModalService', 'platformGridControllerService', 'platformCreateUuid', 'estimateRuleParameterService',
			'estimateRuleParameterConfigurationService', 'estimateRuleParamValidationService', 'estimateRuleCommonService','platformPermissionService','userFormOpenMethod',
			function ($scope,$injector,  $translate, platformGridAPI, platformModalService, platformGridControllerService, platformCreateUuid, estimateRuleParameterService,
				configurationService, validationService, estimateRuleCommonService,platformPermissionService, userFormOpenMethod) {

				let myGridConfig = {};

				$scope.gridId = platformCreateUuid();

				platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

				function onCellChange(e, args) {
					let col = args.grid.getColumns()[args.cell].field;
					// ToDo: check the type and islookup and check the exist code
					estimateRuleParameterService.fieldChanged(col, args.item);
					if (col === 'Code' || col === 'IsLookup' || col === 'ValueType') {
						let dataService = $injector.get('estimateRuleService');
						let paramValueService = $injector.get('estimateRuleParameterValueService');
						switch (col) {
							case 'ValueType':
								$scope.$root.$broadcast('domainChanged');
								estimateRuleCommonService.handleParamAndParamterValue(args, dataService, estimateRuleParameterService, paramValueService, false);
								break;
							case 'IsLookup':
								estimateRuleParameterService.onIsLookupChangeEvent.fire(null, args.item[col]);
								estimateRuleCommonService.handleParamAndParamterValue(args, dataService, estimateRuleParameterService, paramValueService, false);
								break;
							case 'Code':
								args.item.Code = args.item.Code ? args.item.Code.toUpperCase() : args.item.Code;
								estimateRuleCommonService.handleParamAndParamterValue(args, dataService, estimateRuleParameterService, paramValueService, false, true);
								break;
						}
					}
				}

				platformGridControllerService.initListController($scope, configurationService, estimateRuleParameterService, validationService, myGridConfig);

				function selectionChangedCallBack(arg1,arg2) {
					if(arg2 && arg2.Code) {
						estimateRuleParameterService.SaveParameterInfo();
					}
				}

				estimateRuleParameterService.registerSelectionChanged(selectionChangedCallBack);

				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && item.id !== 't14';
				});

				let editForm = function () {
					estimateRuleParameterService.showForm(userFormOpenMethod.NewWindow);
				};

				let editPopForm = function () {
					estimateRuleParameterService.showForm(userFormOpenMethod.PopupWindow);
				};
				let toolbarItems = [
					{
						id: 't101',
						caption: 'basics.userform.editBy',
						type: 'dropdown-btn',
						iconClass: 'tlb-icons ico-preview-data',
						list: {
							showImages: true,
							cssClass: 'dropdown-menu-right',
							items: [{
								id: 't-navigation-pop-window',
								type: 'item',
								caption: 'basics.userform.popWindow',
								iconClass: 'tlb-icons ico-preview-data',
								fn: editPopForm
							},{
								id: 't-navigation-new-window',
								type: 'item',
								caption: 'basics.userform.newWindow',
								iconClass: 'tlb-icons ico-preview-data',
								fn: editForm
							}]
						},
						disabled: function () {
							let hasPermission = platformPermissionService.hasWrite('7268f6d33a2543d8b3be0906a253547f');
							let selectedRule = estimateRuleParameterService.parentService().getSelected();

							return !hasPermission || _.isEmpty(selectedRule) || !selectedRule.FormFk;
						}
					}
				];

				let ruleParamterCommonService = $injector.get('estimateParamComplexLookupCommonService');
				ruleParamterCommonService.setCurrentParamService(estimateRuleParameterService);
				let userFormCommonService = $injector.get('basicsUserformCommonService');
				userFormCommonService.formDataSaved.register(ruleParamterCommonService.syncUserFromToParameter);

				$scope.addTools(toolbarItems);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
					estimateRuleParameterService.unregisterSelectionChanged(selectionChangedCallBack);
					userFormCommonService.formDataSaved.unregister(ruleParamterCommonService.syncUserFromToParameter);
				});
			}
		]);
})();
