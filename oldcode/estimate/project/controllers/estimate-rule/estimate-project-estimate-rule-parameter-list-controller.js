/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';

	let moduleName = 'estimate.project';

	/**
	 * @ngdoc controller
	 * @name estimateProjectEstRuleParamListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of project estimate rule parameter entities.
	 **/
	angular.module(moduleName).controller('estimateProjectEstRuleParamListController', estimateProjectEstRuleParamListController);

	estimateProjectEstRuleParamListController.$inject = ['$scope','$injector', 'platformGridControllerService', 'platformGridAPI', 'estimateProjectEstRuleParamService', 'projectMainService','estimateProjectEstimateRuleCommonService',
		'platformPermissionService','userFormOpenMethod', 'estimateProjectEstRuleParamConfigService', 'estimateProjectEstRuleParamValidationService'];
	function estimateProjectEstRuleParamListController(
		$scope,$injector, platformGridControllerService, platformGridAPI, estimateProjectEstRuleParamService, projectMainService,estimateProjectEstimateRuleCommonService,
		platformPermissionService, userFormOpenMethod, estimateProjectEstRuleParamConfigService, estimateProjectEstRuleParamValidationService) {

		let gridConfig = {
			initCalled: false,
			columns: [],
			grouping: true
		};

		platformGridControllerService.initListController($scope,estimateProjectEstRuleParamConfigService, estimateProjectEstRuleParamService, estimateProjectEstRuleParamValidationService, gridConfig);

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		let editForm = function () {
			estimateProjectEstRuleParamService.showForm(userFormOpenMethod.NewWindow);
		};

		let editPopForm = function () {
			estimateProjectEstRuleParamService.showForm(userFormOpenMethod.PopupWindow);
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
					let hasPermission = platformPermissionService.hasWrite($scope.gridId);
					let selectedRule = estimateProjectEstRuleParamService.parentService().getSelected();

					return !hasPermission || _.isEmpty(selectedRule) || !selectedRule.FormFk;
				}
			}
		];

		let ruleParamterCommonService = $injector.get('estimateParamComplexLookupCommonService');
		ruleParamterCommonService.setCurrentParamService(estimateProjectEstRuleParamService);
		let userFormCommonService = $injector.get('basicsUserformCommonService');
		userFormCommonService.formDataSaved.register(ruleParamterCommonService.syncUserFromToParameter);

		$scope.addTools(toolbarItems);

		function onCellChange(e, args) {
			let col = args.grid.getColumns()[args.cell].field;
			// ToDo: check the type and islookup
			estimateProjectEstRuleParamService.fieldChanged(col, args.item);
			if (col === 'Code' || col=== 'IsLookup' || col === 'ValueType' ) {
				let dataService = $injector.get('projectMainService');
				let paramValueService = $injector.get('estimateProjectEstRuleParameterValueService');
				let ruleCommonService = $injector.get('estimateRuleCommonService');
				switch (col) {
					case 'ValueType':
						$scope.$root.$broadcast('domainChanged');
						ruleCommonService.handleParamAndParamterValue(args, dataService, estimateProjectEstRuleParamService, paramValueService, true);
						break;
					case 'IsLookup':
						estimateProjectEstRuleParamService.onIsLookupChangeEvent.fire(null, args.item[col]);
						ruleCommonService.handleParamAndParamterValue(args, dataService, estimateProjectEstRuleParamService, paramValueService, true);
						break;
					case 'Code':
						args.item.Code = args.item.Code ? args.item.Code.toUpperCase():args.item.Code;
						ruleCommonService.handleParamAndParamterValue(args, dataService, estimateProjectEstRuleParamService, paramValueService, true, true);
						break;
				}
			}
		}

		function selectionChangedCallBack(arg1,arg2) {
			if(arg2 && arg2.Code) {
				estimateProjectEstRuleParamService.SavePrjParameterInfo();
			}
		}

		estimateProjectEstRuleParamService.registerSelectionChanged(selectionChangedCallBack);
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			estimateProjectEstRuleParamService.unregisterSelectionChanged(selectionChangedCallBack);
			userFormCommonService.formDataSaved.unregister(ruleParamterCommonService.syncUserFromToParameter);
		});

	}

})();
