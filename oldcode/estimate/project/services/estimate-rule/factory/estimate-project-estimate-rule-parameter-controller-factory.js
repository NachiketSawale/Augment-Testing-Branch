/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global  _ */
	'use strict';
	const moduleName = 'estimate.project';

	/**
	 * @ngdoc controller
	 * @name
	 * * estimateProjectEstRuleParameterControllerFactory
	 * @function
	 *
	 * @description
	 * Controller factory for the list view of any kind of entity causing a change in the Estimate rules parameter
	 **/

	angular.module(moduleName).factory('estimateProjectEstRuleParameterControllerFactory', estimateMainPrjEstRuleParamDtoListController);

	estimateMainPrjEstRuleParamDtoListController.$inject = ['$injector', 'platformGridControllerService', 'platformGridAPI', 'projectMainService',
		'platformPermissionService'];
	function estimateMainPrjEstRuleParamDtoListController($injector, platformGridControllerService, platformGridAPI, projectMainService,
		platformPermissionService) {

		let factoryService = {};

		factoryService.initRuleParameterListController = function (options) {
			if (!options){
				return;
			}
			let scope = options.scope,
				gridConfig = {initCalled: false, columns: [], grouping: true};

			if(options.gridConfig){
				angular.extend(gridConfig, options.gridConfig);
			}

			let dataValidationservice =  options.dataValidationServiceName,
				dataService = options.dataServiceName,
				configService = options.dataConfigServiceName,
				rootMainServiceName = options.rootMainServiceName,
				paramValueServiceName = options.paramValueServiceName,
				userFormOpenMethod = $injector.get('userFormOpenMethod');

			platformGridControllerService.initListController(scope, configService, dataService, dataValidationservice, gridConfig);

			platformGridAPI.events.register(scope.gridId, 'onCellChange', onCellChange);

			let editForm = function () {
				dataService.showForm(userFormOpenMethod.NewWindow);
			};

			let editPopForm = function () {
				dataService.showForm(userFormOpenMethod.PopupWindow);
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
						let hasPermission = platformPermissionService.hasWrite(scope.gridId);
						let selectedRule = dataService.parentService().getSelected();

						return !hasPermission || _.isEmpty(selectedRule) || !selectedRule.FormFk;
					}
				}
			];

			let ruleParamterCommonService = $injector.get('estimateParamComplexLookupCommonService');
			ruleParamterCommonService.setCurrentParamService(dataService);
			let userFormCommonService = $injector.get('basicsUserformCommonService');
			userFormCommonService.formDataSaved.register(ruleParamterCommonService.syncUserFromToParameter);

			scope.addTools(toolbarItems);

			function onCellChange(e, args) {
				let col = args.grid.getColumns()[args.cell].field;
				// ToDo: check the type and islookup
				dataService.fieldChanged(col, args.item);
				if (col === 'Code' || col=== 'IsLookup' || col === 'ValueType' ) {
					let mainService = $injector.get(rootMainServiceName);
					let paramValueService = $injector.get(paramValueServiceName);
					let ruleCommonService = $injector.get('estimateRuleCommonService');
					switch (col) {
						case 'ValueType':
							scope.$root.$broadcast('domainChanged');
							ruleCommonService.handleParamAndParamterValue(args, mainService, dataService, paramValueService, true);
							break;
						case 'IsLookup':
							dataService.onIsLookupChangeEvent.fire(null, args.item[col]);
							ruleCommonService.handleParamAndParamterValue(args, mainService, dataService, paramValueService, true);
							break;
						case 'Code':
							args.item.Code = args.item.Code ? args.item.Code.toUpperCase():args.item.Code;
							ruleCommonService.handleParamAndParamterValue(args, mainService, dataService, paramValueService, true, true);
							break;
					}
				}
			}

			scope.$on('$destroy', function () {
				platformGridAPI.events.unregister(scope.gridId, 'onCellChange', onCellChange);
				userFormCommonService.formDataSaved.unregister(ruleParamterCommonService.syncUserFromToParameter);
			});
		};

		return factoryService;
	}
})(angular);