/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainAssemblyCategoryTreeController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Assembly Category entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainAssemblyCategoryTreeController',
		['$scope','$injector', 'platformGridAPI', 'platformGridControllerService', 'estimateMainCommonUIService', 'estimateMainService', 'estimateMainAssembliesCategoryService', 'estimateDefaultGridConfig', 'estimateMainClipboardService', 'estimateMainFilterService', 'estimateMainValidationService',
			function ($scope, $injector, platformGridAPI, platformGridControllerService, estimateMainCommonUIService, estimateMainService, estimateMainAssembliesCategoryService, estimateDefaultGridConfig, estimateMainClipboardService, estimateMainFilterService, estimateMainValidationService) {

				let gridConfig = angular.extend({
						marker: {
							filterService: estimateMainFilterService,
							filterId: 'estimateMainAssemblyCategoryTreeController',
							dataService: estimateMainAssembliesCategoryService,
							serviceName: 'estimateMainAssembliesCategoryService'
						},
						parentProp: 'EstAssemblyCatFk',
						childProp: 'AssemblyCatChildren',
						type: 'estAssemblyItems',
						skipPermissionCheck:true,
						propagateCheckboxSelection : true,
						dragDropService: estimateMainClipboardService,
						cellChangeCallBack: function (arg) {
							let field = arg.grid.getColumns ()[arg.cell].field;
							if(field ==='Rule'){

								let ruleToDelete = estimateMainAssembliesCategoryService.getRuleToDelete();
								if(!arg.item.Rule.length && ruleToDelete && ruleToDelete.length) {

									let platformDeleteSelectionDialogService = $injector.get ('platformDeleteSelectionDialogService');
									platformDeleteSelectionDialogService.showDialog ({
										dontShowAgain: true,
										id: '7a9f7da5c9b44e339d49ba149a905987'
									}).then (result => {
										if (result.ok || result.delete) {
											estimateMainService.deleteParamByPrjRule(arg.item, ruleToDelete, 'EstAssemblyCat');
										}
									});
								}
							}
						}
					}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(['Code', 'DescriptionInfo', 'Rule', 'Param'], {serviceName: 'estimateMainAssembliesCategoryService', 'itemName':'EstAssemblyCat', isRuleParamTransient: true});

				platformGridControllerService.initListController($scope, uiService, estimateMainAssembliesCategoryService, estimateMainValidationService, gridConfig);

				estimateMainAssembliesCategoryService.registerSelectionChanged(estimateMainAssembliesCategoryService.creatorItemChanged);

				estimateMainService.setIsEstimate(true);

				let selectedRow = estimateMainAssembliesCategoryService.getSelected();
				if(selectedRow){
					estimateMainAssembliesCategoryService.creatorItemChanged(null,selectedRow)
				}

				// refresh data when assemblies are refreshed
				estimateMainService.registerRefreshRequested(refreshAssembly);
				function refreshAssembly(){
					let projectId = estimateMainService.getSelectedProjectId();
					if(projectId){
						estimateMainAssembliesCategoryService.refresh();
					}
				}

				function onClickFuc(){
					$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, estimateMainAssembliesCategoryService);
				}
				platformGridAPI.events.register($scope.gridId, 'onClick',onClickFuc);

				estimateMainService.onContextUpdated.register(estimateMainAssembliesCategoryService.loadAssemblyCatalog);
				estimateMainAssembliesCategoryService.loadAssemblyCatalog(); // load data when open the container

				$scope.$on('$destroy', function () {
					estimateMainAssembliesCategoryService.unregisterSelectionChanged(estimateMainAssembliesCategoryService.creatorItemChanged);
					estimateMainService.unregisterRefreshRequested(refreshAssembly);
					platformGridAPI.events.unregister($scope.gridId, 'onClick',onClickFuc);
					estimateMainService.onContextUpdated.unregister(estimateMainAssembliesCategoryService.loadAssemblyCatalog);
				});

			}
		]);
})();
