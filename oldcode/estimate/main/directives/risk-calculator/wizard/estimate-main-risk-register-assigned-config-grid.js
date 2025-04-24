/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc directive
	 * @name estimateMainColumnConfigDetailGrid
	 * @requires
	 * @description display a gridview to configure dynamic columns
	 */

	angular.module(moduleName).directive('estimateMainRiskRegisterAssignedConfigGrid', [
		'_', '$compile', 'platformGridAPI', 'platformTranslateService', '$timeout','estimateMainAssignedRiskDataService',
		'estimateMainRiskCalculatorWizardService','estimateMainCalculateRiskDataService',
		function (
			_, $compile, platformGridAPI, platformTranslateService, $timeout,estimateMainAssignedRiskDataService,
			estimateMainRiskCalculatorWizardService,estimateMainCalculateRiskDataService) {
			return {
				restrict: 'A',
				scope: {
					entity: '=',
					model: '='
				},
				// entity:'=',
				// templateUrl: globals.appBaseUrl + 'estimate.main/templates/column-config/estimate-main-column-config-details.html'
				// template : $templateCache.get('estimate-main-risk-register.html')
				link: function($scope,elem){
					$scope.gridId = '422565139318432e9a84ef611e7d1b84';
					$scope.gridData = {
						state: $scope.gridId
					};
					// estimateMainAssignedRiskDataService.load();
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					let grid = {
						readonly:true,
						data: [],
						lazyInit: true,
						enableConfigSave: false,
						columns: [{
							id: 'code',
							formatter: 'code',
							field: 'Code',
							name: 'Code',
							name$tr$: 'cloud.common.entityCode',
							editor: 'directive',
							grouping: {
								title: 'cloud.common.entityCode',
								getter: 'Code',
								aggregators: [],
								aggregateCollapsed: true
							},
							editorOptions: {
								directive: 'basics-common-limit-input',
								validKeys: {
									regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,15})?$'
								}
							},
							width: 70
						},{
							id: 'description',
							field: 'DescriptionInfo',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter: 'translation',
							width: 400,
							// formatter: 'description',
							sortable: true,
							searchable: true,
							resizeable: true
						}],
						id: $scope.gridId,
						options: {
							skipPermissionCheck: true,
							tree: true,
							indicator: true,
							idProperty: 'Code',
							parentProp: 'RiskRegisterParentFk',
							childProp: 'RiskRegisters'
						}
					};
					platformTranslateService.translateObject(grid.columns, 'name');
					platformGridAPI.grids.config(grid);

					elem.append($compile('<div class="flex-box flex-column"><div data-platform-Grid class="subview-container flex-basis-auto" data="gridData"></div></div>')($scope));

					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					});
					$scope.$on('wzdlgStepChanged', function () {
						// eslint-disable-next-line no-console
						console.log('Scope of directive',$scope);
						platformGridAPI.grids.resize($scope.gridId);
					});

					function removeDuplicateValue(riskArray){
						let newRiskArray = [];
						angular.forEach(riskArray, function(value/* , key */) {
							let exists = false;
							angular.forEach(newRiskArray, function(val2/* , key */) {
								if(angular.equals(value.Id, val2.Id)){ exists = true; }
							});
							if(exists === false && value.Id !== '') { newRiskArray.push(value); }
						});
						return newRiskArray;
					}
					$timeout(function () {
						let list = _.filter(estimateMainCalculateRiskDataService.getList(),function (item) {
							return (item.HasChildren === true ||(item.HasChildren === false && item.RiskRegisterParentFk === null));
						});
						list = removeDuplicateValue(list);
						platformGridAPI.items.data($scope.gridId, list);
						platformGridAPI.grids.resize($scope.gridId);
					});

					$scope.onResult=function(value){
						$scope.estimateScope = value;
						$scope.$parent.entity.estimateScope=value;
						// eslint-disable-next-line no-console
						console.log('OnResult: ',value);
					};

					$scope.$on('$destroy', function () {
						platformGridAPI.grids.unregister($scope.gridId);
					});
				}
			};
		}
	]);

})(angular);
