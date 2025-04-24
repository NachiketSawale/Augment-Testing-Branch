/**
 * Created by leo on 30.07.2019.
 */
/* jshint -W072 */
angular.module('resource.equipment').controller('resourceEquipmentAdjustAllocationDialogController', ['$scope', '$injector', '$timeout',
	'resourceEquipmentAdjustAllocationDialogService', '$translate', 'platformGridAPI', 'platformTranslateService',
	function Controller($scope, $injector, $timeout,
	                    mainService, $translate, platformGridAPI, platformTranslateService) {
		'use strict';

		var gridConfig = mainService.getGridConfiguration();

		// grid's id === container's uuid
		$scope.gridId = mainService.getGridUUID();

		$scope.gridData = {
			state: $scope.gridId
		};

		if (!gridConfig.isTranslated) {
			platformTranslateService.translateGridConfig(gridConfig.columns);
			gridConfig.isTranslated = true;
		}

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			var grid = {
				columns: angular.copy(gridConfig.columns),
				data: [],
				id: $scope.gridId,
				lazyInit: true,
				options: {
					tree: false,
					indicator: true,
					idProperty: 'Id',
					iconClass: '',
					editorLock: new Slick.EditorLock(),
					multiSelect: true
				}
			};
			platformGridAPI.grids.config(grid);
		}

		$scope.formOptions = mainService.getFormConfiguration();

		$scope.entity = mainService.entity;

		mainService.load($scope.entity.options);

		function update(e, data) {
			platformGridAPI.items.data($scope.gridId, data);
		}

		mainService.listLoaded.register(update);

		$scope.$on('$destroy', function () {
			platformGridAPI.grids.unregister($scope.gridId);
			mainService.listLoaded.unregister(update);
		});
	}]);