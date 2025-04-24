

(function () {
	'use strict';
	/* global  _, */
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainAllowanceCostCodeDetailAddController', ['$scope', '$timeout', '$injector', 'platformGridAPI',
		'platformGridControllerService', '$translate','estimateMainAllowanceCostCodeDetailAddServices','estimateAllowanceCostCodeAssigmentDialogUIServices',
		function ($scope, $timeout, $injector, platformGridAPI, platformGridControllerService, $translate, dataService, estimateAllowanceCostCodeAssigmentDialogUIServices) {

			$scope.gridId = 'fb13aa50abbd4efcac110df7209adadc';
			let gridConfig = {
				initCalled: false,
				columns: [],
				parentProp: 'CostCodeParentFk',
				childProp: 'CostCodes',
				skipPermissionCheck: true,
				collapsed: true,
				uuid:$scope.gridId,
				enableConfigSave: false
			};


			$scope.getContainerUUID = function () {
				return $scope.gridId;
			};

			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}
			$scope.setTools = function (tools) {
				tools.items = _.filter(tools.items,function (d) {
					return  d.id ==='gridSearchAll' || d.id ==='gridSearchColumn' ||d.id ==='t7' || d.id ==='t8'|| d.id ==='t9' || d.id ==='t10';
				});
				tools.update = function () {
					tools.version += 1;
				};

				$scope.tools = tools;
			};

			platformGridControllerService.initListController($scope, estimateAllowanceCostCodeAssigmentDialogUIServices, dataService, null, gridConfig);


			dataService.setGridId($scope.gridId);

			dataService.load().then(function () {
				platformGridAPI.rows.expandAllNodes($scope.gridId);
				platformGridAPI.grids.resize($scope.gridId);
			});

			$scope.onOK = function () {
				$injector.get('estStandardAllowancesCostCodeDetailDataService').setAllCostCodes(dataService.getList());
				$scope.dataItem = dataService.getSelected();
				$scope.$close({ok: true, data: $scope.dataItem});
			};

			$scope.onCancel = function () {
				$scope.$close({});
			};

			$scope.hasErrors = function checkForErrors() {
				return !dataService.getSelected();
			};

			function onDblClick (){
				$scope.onOK();
			}

			platformGridAPI.events.register($scope.gridId, 'onDblClick', onDblClick);



			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onDblClick', onDblClick);
			});
		}
	]);
})();
