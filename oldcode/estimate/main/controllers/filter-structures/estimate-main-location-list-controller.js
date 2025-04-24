/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainLocationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Location entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainLocationListController',
		['$scope', '$injector', 'platformGridAPI', 'platformGridControllerService', 'estimateMainCommonUIService', 'estimateMainService', 'estimateMainLocationService', 'estimateMainValidationService', 'estimateDefaultGridConfig','estimateMainClipboardService', 'estimateMainFilterService', 'estimateCommonControllerFeaturesServiceProvider', 'estimateMainCommonFeaturesService',
			function ($scope, $injector, platformGridAPI, platformGridControllerService, estimateMainCommonUIService, estimateMainService, estimateMainLocationService, estimateMainValidationService, estimateDefaultGridConfig, estimateMainClipboardService, estimateMainFilterService, estimateCommonControllerFeaturesServiceProvider, estimateMainCommonFeaturesService) {

				let gridConfig = angular.extend({
						marker : {
							filterService: estimateMainFilterService,
							filterId: 'estimateMainLocationListController',
							dataService: estimateMainLocationService,
							serviceName: 'estimateMainLocationService'
						},
						propagateCheckboxSelection: true,
						parentProp: 'LocationParentFk', childProp: 'Locations', type: 'estPrjLocationItems',
						dragDropService: estimateMainClipboardService,
						skipPermissionCheck:true,
						cellChangeCallBack: function (arg) {
							let field = arg.grid.getColumns()[arg.cell].field;

							if (field === 'Rule') {
								let ruleToDelete = estimateMainLocationService.getRuleToDelete ();
								if (!arg.item.Rule.length && ruleToDelete && ruleToDelete.length) {

									let platformDeleteSelectionDialogService = $injector.get ('platformDeleteSelectionDialogService');
									platformDeleteSelectionDialogService.showDialog ({
										dontShowAgain: true,
										id: '7a9f7da5c9b44e339d49ba149a905987'
									}).then (result => {
										if (result.ok || result.delete) {
											estimateMainService.deleteParamByPrjRule (arg.item, ruleToDelete, 'EstPrjLocation');
										}
									});
								}
							}
						}
					}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(['Code', 'DescriptionInfo', 'Quantity', 'Rule', 'Param'], {serviceName: 'estimateMainLocationService', 'itemName':'EstPrjLocation'});

				platformGridControllerService.initListController($scope, uiService, estimateMainLocationService, estimateMainValidationService, gridConfig);

				estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);
				estimateMainCommonFeaturesService.disableTools($scope,['t7', 't8', 't9', 't10', 't12', 't13']);

				estimateMainLocationService.registerSelectionChanged(estimateMainLocationService.creatorItemChanged);
				estimateMainService.setIsEstimate(true);
				// refresh data when assemblies are refreshed
				estimateMainService.registerRefreshRequested(refreshLocation);

				let selectedRow = estimateMainLocationService.getSelected();
				if(selectedRow){
					estimateMainLocationService.creatorItemChanged(null,selectedRow)
				}

				function refreshLocation(){
					let projectId = estimateMainService.getSelectedProjectId();
					if(projectId){
						estimateMainLocationService.refresh();
					}
				}

				function onClickFuc(){
					$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, estimateMainLocationService);
				}
				platformGridAPI.events.register($scope.gridId, 'onClick',onClickFuc);

				estimateMainService.onContextUpdated.register(estimateMainLocationService.loadLocation);
				estimateMainLocationService.loadLocation(); // load data when open the container

				$scope.$on('$destroy', function () {
					estimateMainLocationService.unregisterSelectionChanged(estimateMainLocationService.creatorItemChanged);
					estimateMainService.unregisterRefreshRequested(refreshLocation);
					platformGridAPI.events.unregister($scope.gridId, 'onClick',onClickFuc);
					estimateMainService.onContextUpdated.unregister(estimateMainLocationService.loadLocation);
				});

			}]);
})();
