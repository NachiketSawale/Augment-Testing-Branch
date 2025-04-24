/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainProcurementStructureTreeController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Procurement Structure entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainProcurementStructureTreeController',
		['$scope', '$injector', 'platformGridAPI', 'platformGridControllerService', 'estimateMainCommonUIService', 'estimateMainService', 'estimateMainProcurementStructureService', 'estimateDefaultGridConfig', 'estimateMainClipboardService', 'estimateMainFilterService', 'estimateMainValidationService',
			function ($scope, $injector, platformGridAPI, platformGridControllerService, estimateMainCommonUIService, estimateMainService, estimateMainProcurementStructureService, estimateDefaultGridConfig, estimateMainClipboardService, estimateMainFilterService, estimateMainValidationService) {

				let gridConfig = angular.extend({
						marker : {
							filterService: estimateMainFilterService,
							filterId: 'estimateMainProcurementStructureTreeController',
							dataService: estimateMainProcurementStructureService,
							serviceName: 'estimateMainProcurementStructureService'
						},
						propagateCheckboxSelection: true,
						parentProp: 'PrcStructureFk', childProp: 'ChildItems', type: 'estPrcStructureItems',
						dragDropService: estimateMainClipboardService,
						skipPermissionCheck:true,
						cellChangeCallBack: function (arg) {
							let field = arg.grid.getColumns()[arg.cell].field;

							if (field === 'Rule') {
								let ruleToDelete = estimateMainProcurementStructureService.getRuleToDelete ();
								if (!arg.item.Rule.length && ruleToDelete && ruleToDelete.length) {

									let platformDeleteSelectionDialogService = $injector.get ('platformDeleteSelectionDialogService');
									platformDeleteSelectionDialogService.showDialog ({
										dontShowAgain: true,
										id: '7a9f7da5c9b44e339d49ba149a905987'
									}).then (result => {
										if (result.ok || result.delete) {
											estimateMainService.deleteParamByPrjRule (arg.item, ruleToDelete, 'EstPrcStructure');
										}
									});
								}
							}
						}
					}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(['Code', 'DescriptionInfo', 'Rule', 'Param'], {serviceName: 'estimateMainProcurementStructureService', 'itemName':'EstPrcStructure'});

				platformGridControllerService.initListController($scope, uiService, estimateMainProcurementStructureService, estimateMainValidationService, gridConfig);

				let selectedRow = estimateMainProcurementStructureService.getSelected();
				if(selectedRow){
					estimateMainProcurementStructureService.creatorItemChanged(null,selectedRow)
				}

				estimateMainProcurementStructureService.registerSelectionChanged(estimateMainProcurementStructureService.creatorItemChanged);
				estimateMainService.setIsEstimate(true);
				// refresh data
				estimateMainService.registerRefreshRequested(refreshProcurementStructure);
				function refreshProcurementStructure(){
					let projectId = estimateMainService.getSelectedProjectId();
					if(projectId){
						estimateMainProcurementStructureService.refresh();
					}
				}

				function onClickFuc(){
					$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, estimateMainProcurementStructureService);
				}
				platformGridAPI.events.register($scope.gridId, 'onClick',onClickFuc);

				estimateMainService.onContextUpdated.register(estimateMainProcurementStructureService.loadPrcStructure);
				estimateMainProcurementStructureService.loadPrcStructure(); // load data when open the container

				$scope.$on('$destroy', function () {
					estimateMainProcurementStructureService.unregisterSelectionChanged(estimateMainProcurementStructureService.creatorItemChanged);
					estimateMainService.unregisterRefreshRequested(refreshProcurementStructure);
					platformGridAPI.events.unregister($scope.gridId, 'onClick',onClickFuc);
					estimateMainService.onContextUpdated.unregister(estimateMainProcurementStructureService.loadPrcStructure);
				});
			}
		]);
})();
