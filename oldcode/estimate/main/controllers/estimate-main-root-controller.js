/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainRootController
	 * @function
	 *
	 * @description
	 * Controller for estimate root and related rules and parameter.
	 **/
	angular.module(moduleName).controller('estimateMainRootController',
		['$scope', '$timeout', '$injector', 'platformGridAPI', 'platformGridControllerService', 'estimateMainCommonUIService', 'estimateMainRootService', 'estimateDefaultGridConfig', 'estimateMainClipboardService', 'estimateMainValidationService',
			function ($scope, $timeout, $injector, platformGridAPI, platformGridControllerService, estimateMainCommonUIService, estimateMainRootService, estimateDefaultGridConfig, estimateMainClipboardService, estimateMainValidationService) {

				let gridConfig = angular.extend({
						grouping : false,
						type: 'estHeaderItems',
						isRoot: false,
						dragDropService: estimateMainClipboardService,
						skipPermissionCheck:true,
						cellChangeCallBack: function (arg) {
							let field = arg.grid.getColumns()[arg.cell].field;

							if(field ==='Rule'){

								let ruleToDelete = estimateMainRootService.getRuleToDelete();
								if(!arg.item.Rule.length && ruleToDelete && ruleToDelete.length) {

									let platformDeleteSelectionDialogService = $injector.get ('platformDeleteSelectionDialogService');
									platformDeleteSelectionDialogService.showDialog ({
										dontShowAgain: true,
										id: '7a9f7da5c9b44e339d49ba149a905987'
									}).then (result => {
										if (result.ok || result.delete) {
											$injector.get('estimateMainService').deleteParamByPrjRule(arg.item, ruleToDelete, 'EstHeader');
										}
									});
								}
							}

						}
					}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(['Estimate',  'Rule', 'Param'], {serviceName : 'estimateMainRootService', itemName :'EstHeader',  RootServices : ['estimateMainActivityService', 'estimateMainBoqService', 'estimateMainRootService']});

				platformGridControllerService.initListController($scope, uiService, estimateMainRootService, estimateMainValidationService, gridConfig);
				$injector.get('estimateMainService').setIsEstimate(true);

				function onClickFuc(){
					$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, estimateMainRootService);
				}
				platformGridAPI.events.register($scope.gridId, 'onClick',onClickFuc);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onClick',onClickFuc);
				});

			}]);
})();
