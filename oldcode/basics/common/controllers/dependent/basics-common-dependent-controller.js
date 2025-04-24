(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).controller('basicsCommonDependentController', ['$scope', '$translate', 'platformGridAPI', 'platformTranslateService', '$http',
		'platformGridControllerService', '$timeout', '$injector', 'basicsCommonDependentUiService', 'basicsCommonDependentDataService',
		function ($scope, $translate, platformGridAPI, platformTranslateService, $http,
			gridControllerService, $timeout, $injector, basicsCommonDependentUiService, basicsCommonDependentDataService) {

			$scope.options = $scope.$parent.modalOptions;
			$scope.gridId = '35678EC1BF024655BB9E524116D3851C';
			$scope.gridData = {state: $scope.gridId};
			$scope.isShowDependantData = false;

			$scope.modalOptions.headerText = $scope.options.headerText;

			const uiConfig = basicsCommonDependentUiService.getStandardConfigForListView();

			const grid = {
				columns: angular.copy(uiConfig.columns),
				data: [],
				id: $scope.gridId,
				options: {
					tree: true,
					indicator: true,
					idProperty: 'Id',
					skipPermissionCheck: true,
					parentProp: 'ParentUuid',
					childProp: 'DetailChildren',
					collapsed: false
				}
			};

			platformGridAPI.grids.config(grid);

			let dataList = null;

			angular.extend($scope.options, {
				showDependantData: showDependantData,
				oK: function () {
					$scope.$close({yes: true});
				},
				cancel: function () {
					$scope.$close();
				}
			});

			function showDependantData() {
				$scope.dialogLoading = true;
				$scope.isShowDependantData = !$scope.isShowDependantData;
				if (!$scope.isShowDependantData) {
					return;
				}

				if (dataList) {
					$scope.dialogLoading = false;
					refreshGrid();
				} else {
					init();
				}
			}

			function init() {
				basicsCommonDependentDataService.loadDataList($scope.options).then(function (data) {
					$scope.dialogLoading = false;
					dataList = data;
					platformGridAPI.items.data($scope.gridId, dataList);
					refreshGrid();
				});
			}

			function refreshGrid() {
				$timeout(function () {
					platformGridAPI.grids.invalidate($scope.gridId);
					platformGridAPI.grids.resize($scope.gridId);
					platformGridAPI.grids.refresh($scope.gridId);
				}, 0);
			}
		}
	]);
})(angular);