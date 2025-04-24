/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainActivityListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Activity entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainActivityListController',
		['$scope','$timeout', '$injector', 'platformGridAPI', 'platformGridControllerService', 'estimateMainCommonUIService', 'estimateMainService', 'estimateMainActivityService', 'estimateMainValidationService', 'loadingIndicatorExtendServiceFactory', 'estimateDefaultGridConfig', 'estimateMainClipboardService', 'estimateMainFilterService', 'estimateCommonControllerFeaturesServiceProvider', 'estimateMainCommonFeaturesService',
			function ($scope,$timeout, $injector, platformGridAPI, platformGridControllerService, estimateMainCommonUIService, estimateMainService, estimateMainActivityService, estimateMainValidationService, loadingIndicatorExtendServiceFactory, estimateDefaultGridConfig, estimateMainClipboardService, estimateMainFilterService, estimateCommonControllerFeaturesServiceProvider, estimateMainCommonFeaturesService) {

				loadingIndicatorExtendServiceFactory.createServiceForDataServiceFactory($scope, 500, estimateMainActivityService);

				let gridConfig = angular.extend({
						marker : {
							filterService: estimateMainFilterService,
							filterId: 'estimateMainActivityListController',
							dataService: estimateMainActivityService,
							serviceName: 'estimateMainActivityService'
						},

						parentProp: 'ParentActivityFk',
						childProp: 'Activities',
						type: 'estActivityItems',
						propagateCheckboxSelection: true,
						skipPermissionCheck:true,
						dragDropService: estimateMainClipboardService,
						dragActionText: 'assign',
						cellChangeCallBack: function (arg) {
							let field = arg.grid.getColumns ()[arg.cell].field;

							if (field === 'Rule') {
								let ruleToDelete = [];
								if (arg.item.IsRoot) {
									ruleToDelete = $injector.get ('estimateMainRootService').getRuleToDelete ();
								} else {
									ruleToDelete = estimateMainActivityService.getRuleToDelete ();
								}

								if (!arg.item.Rule.length && ruleToDelete && ruleToDelete.length) {

									let platformDeleteSelectionDialogService = $injector.get ('platformDeleteSelectionDialogService');
									platformDeleteSelectionDialogService.showDialog ({
										dontShowAgain: true,
										id: '7a9f7da5c9b44e339d49ba149a905987'
									}).then (result => {
										if (result.ok || result.delete) {
											estimateMainService.deleteParamByPrjRule (arg.item, ruleToDelete, 'EstActivity');
										}
									});
								}
							}
						}
					}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(['Code', 'Description', 'Quantity', 'QuantityUoMFk', 'Rule', 'Param', 'LocationFk','PlannedStart','PlannedFinish','PlannedDuration','SCurveFk','PercentageCompletion'],
						{
							serviceName: 'estimateMainActivityService',
							itemName :'EstActivity',
							RootServices : ['estimateMainBoqService', 'estimateMainRootService', 'estimateMainActivityService'],
							userDefGroup : [{
								'gid': 'userDefTextGroup',
								'attName' : 'UserDefinedText',
								'type' : 'string',
								'formatter' : 'comment',
								'isUserDefText': true,
								'attCount': 10
							}]
						}
					);

				platformGridControllerService.initListController($scope, uiService, estimateMainActivityService, estimateMainValidationService, gridConfig);

				estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);
				estimateMainCommonFeaturesService.disableTools($scope,['t7', 't8', 't9', 't10', 't12', 't13']);

				estimateMainActivityService.registerSelectionChanged(estimateMainActivityService.creatorItemChanged);
				estimateMainService.setIsEstimate(true);
				// refresh data when assemblies are refreshed
				estimateMainService.registerRefreshRequested(refreshActivity);

				let selectedRow = estimateMainActivityService.getSelected();
				if(selectedRow){
					estimateMainActivityService.creatorItemChanged(null,selectedRow)
				}

				function refreshActivity(){
					let projectId = estimateMainService.getSelectedProjectId();
					if(projectId){
						estimateMainActivityService.refresh();
					}
				}

				function onClickFuc(){
					$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, estimateMainActivityService);
				}
				platformGridAPI.events.register($scope.gridId, 'onClick',onClickFuc);

				estimateMainService.onContextUpdated.register(estimateMainActivityService.loadActivyty);

				$timeout (function () {
					estimateMainActivityService.loadActivyty(); // load data when open the container
				},500);

				$scope.$on('$destroy', function () {
					estimateMainActivityService.unregisterSelectionChanged(estimateMainActivityService.creatorItemChanged);
					estimateMainService.unregisterRefreshRequested(refreshActivity);
					platformGridAPI.events.unregister($scope.gridId, 'onClick',onClickFuc);
					estimateMainService.onContextUpdated.unregister(estimateMainActivityService.loadActivyty);
				});
			}]);

})();
