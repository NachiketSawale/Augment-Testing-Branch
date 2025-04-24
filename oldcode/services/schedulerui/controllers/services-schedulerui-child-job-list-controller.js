/**
 * Created by aljami on 25.03.2022.
 */
(function () {

	'use strict';
	const moduleName = 'services.schedulerui';

	/**
	 * @ngdoc controller
	 * @name servicesSchedulerUIChildJobListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of job entities
	 **/
	angular.module(moduleName).controller('servicesSchedulerUIChildJobListController', servicesSchedulerUIChildJobListController);

	servicesSchedulerUIChildJobListController.$inject = ['$scope', 'platformContainerControllerService', 'platformGridAPI', 'servicesSchedulerUIJobDataService'];

	function servicesSchedulerUIChildJobListController($scope, platformContainerControllerService, platformGridAPI, servicesSchedulerUIChildJobDataService) {

		$scope.gridId = 'b4af02249edc42d28eaf7d71f08ff199';
		platformContainerControllerService.initController($scope, moduleName, $scope.gridId);

		function onSelectedRowsChanged() {
			platformGridAPI.items.data('68d4b4898f47498488adb531f715c48e', []);
			var selected = platformGridAPI.rows.selection({
				gridId: $scope.gridId
			});

			if (selected && selected.TaskType) {
				let oldParameter = selected.Parameter;
				const taskDef = servicesSchedulerUIChildJobDataService.getTask(selected.TaskType);
				const paramDef = servicesSchedulerUIChildJobDataService.getTaskParam(selected.TaskType);
				selected.Parameter = _.cloneDeep(paramDef);
				let task = _.cloneDeep(taskDef);
				if (task && !task.UiChangeable) {
					_.each(selected.Parameter, function (parameter) {
						parameter.ReadOnly = true;
					});
				}

				if (selected.Version > 0) {
					if (oldParameter && oldParameter.Length) {
						_.each(selected.Parameter, function (parameter) {
							var result = _.find(oldParameter, function (param) {
								return param.Name === parameter.Name;
							});
							if (result) {
								parameter.Value = result.Value;
							}
						});
					} else if (selected.ParameterList) {
						var parameterList = JSON.parse(selected.ParameterList);
						_.each(selected.Parameter, function (parameter) {
							var result = _.find(parameterList, function (param) {
								return param.Name === parameter.Name;
							});
							if (result) {
								parameter.Value = result.Value;
							}
						});
					}
				}
				platformGridAPI.items.data('68d4b4898f47498488adb531f715c48e', selected.Parameter);
			} else {
				platformGridAPI.items.data('68d4b4898f47498488adb531f715c48e', []);
			}
		}

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
		});
	}
})();