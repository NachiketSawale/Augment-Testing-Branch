/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainControllingListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Controlling Unit entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainControllingListController',
		['$scope', '$injector', 'platformGridAPI', 'platformGridControllerService', 'estimateMainFilterService', 'estimateMainCommonUIService', 'estimateMainService', 'estimateMainControllingService', 'estimateMainValidationService', 'estimateDefaultGridConfig','estimateMainClipboardService', 'estimateCommonControllerFeaturesServiceProvider',
			function ($scope, $injector, platformGridAPI, platformGridControllerService, estimateMainFilterService, estimateMainCommonUIService, estimateMainService, estimateMainControllingService, estimateMainValidationService, estimateDefaultGridConfig, estimateMainClipboardService, estimateCommonControllerFeaturesServiceProvider) {

				let gridConfig = angular.extend({
						marker : {
							filterService: estimateMainFilterService,
							filterId: 'estimateMainControllingListController',
							dataService: estimateMainControllingService,
							serviceName: 'estimateMainControllingService'
						},
						parentProp: 'ControllingunitFk',
						childProp: 'ControllingUnits',
						type: 'estCtuItems',
						propagateCheckboxSelection: true,
						skipPermissionCheck:true,
						dragDropService: estimateMainClipboardService,
						cellChangeCallBack: function (arg) {
							let field = arg.grid.getColumns()[arg.cell].field;
							if (field === 'Rule') {
								let ruleToDelete = estimateMainControllingService.getRuleToDelete ();
								if (!arg.item.Rule.length && ruleToDelete && ruleToDelete.length) {

									let platformDeleteSelectionDialogService = $injector.get ('platformDeleteSelectionDialogService');
									platformDeleteSelectionDialogService.showDialog ({
										dontShowAgain: true,
										id: '7a9f7da5c9b44e339d49ba149a905987'
									}).then (result => {
										if (result.ok || result.delete) {
											estimateMainService.deleteParamByPrjRule (arg.item, ruleToDelete, 'EstCtu');
										}
									});
								}
							}
						}
					}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(['Code', 'DescriptionInfo','Quantity','UomFk', 'Rule', 'Param'],
						{serviceName: 'estimateMainControllingService', itemName:'EstCtu'});

				platformGridControllerService.initListController($scope, uiService, estimateMainControllingService, estimateMainValidationService, gridConfig);

				estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

				estimateMainControllingService.registerSelectionChanged(estimateMainControllingService.creatorItemChanged);
				estimateMainService.setIsEstimate(true);
				// refresh data when assemblies are refreshed
				estimateMainService.registerRefreshRequested(refreshControlling);

				let selectedRow = estimateMainControllingService.getSelected();
				if(selectedRow){
					estimateMainControllingService.creatorItemChanged(null,selectedRow)
				}

				function refreshControlling(){
					let projectId = estimateMainService.getSelectedProjectId();
					if(projectId){
						estimateMainControllingService.refresh();
					}
				}

				function onClickFuc(){
					$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, estimateMainControllingService);
				}
				platformGridAPI.events.register($scope.gridId, 'onClick',onClickFuc);

				estimateMainService.onContextUpdated.register(estimateMainControllingService.loadControlling);
				estimateMainControllingService.loadControlling(); // load data when open the container

				$scope.$on('$destroy', function () {
					estimateMainControllingService.unregisterSelectionChanged(estimateMainControllingService.creatorItemChanged);
					estimateMainService.unregisterRefreshRequested(refreshControlling);
					platformGridAPI.events.unregister($scope.gridId, 'onClick',onClickFuc);
					estimateMainService.onContextUpdated.unregister(estimateMainControllingService.loadControlling);
				});

			}]);

})();
