/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name estimateMainDissolveAssemblyWizardGridController
	 * @function
	 *
	 * @description
	 * Controller to show the Grid with Dissolve Assemblies on wizard
	 **/
	angular.module(moduleName).controller('estimateMainDissolveAssemblyWizardGridController', ['$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid',
		'estimateMainDissolveAssemblyWizardDetailService', 'platformGridControllerService', 'basicsCommonHeaderColumnCheckboxControllerService',
		function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid, estimateMainDissolveAssemblyWizardDetailService, platformGridControllerService, basicsCommonHeaderColumnCheckboxControllerService) {

			let myGridConfig = {
				initCalled: false,
				skipPermissionCheck: true,
				cellChangeCallBack: function () {
				}
			};

			$scope.gridId = platformCreateUuid();

			$scope.onContentResized = function () {
				resize();
			};

			$scope.gridData = {
				state: $scope.gridId
			};

			function resize() {
				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});
			}

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				let selectedScope = $scope && $scope.entity ? $scope.entity.estimateScope : 2;
				estimateMainDissolveAssemblyWizardDetailService.setDataList(true,selectedScope);
				platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
				platformGridControllerService.initListController($scope, estimateMainDissolveAssemblyWizardDetailService, estimateMainDissolveAssemblyWizardDetailService, null, myGridConfig);

				basicsCommonHeaderColumnCheckboxControllerService.setGridId($scope.gridId);
				basicsCommonHeaderColumnCheckboxControllerService.init($scope, estimateMainDissolveAssemblyWizardDetailService, ['IsChecked']);
			}

			$scope.isCheckedValueChange = function isCheckedValueChange() {
				return {apply: true, valid: true, error: ''};
			};

			function onHeaderCheckboxChange(e) {
				$scope.isCheckedValueChange(null, e.target.checked);
			}

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};

			init();

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				estimateMainDissolveAssemblyWizardDetailService.setDataList(false);
				platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChange);
			});
		}
	]);
})();
