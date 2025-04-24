/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectMainProjectDetailController', ProjectMainProjectDetailController);

	ProjectMainProjectDetailController.$inject = [
		'$scope', 'platformContainerControllerService', 'projectMainCharacteristicColumnService', 'projectMainConstantValues',
		'platformFormConfigService', 'projectMainService', 'basicsCharacteristicDataServiceFactory', '$timeout',
	];

	function ProjectMainProjectDetailController(
		$scope, platformContainerControllerService, projectMainCharacteristicColumnService, projectMainConstantValues,
		platformFormConfigService, projectMainService, basicsCharacteristicDataServiceFactory, $timeout

	) {

		$scope.change = function(entity, field, column){
			projectMainCharacteristicColumnService.fieldChange(entity, field, column);
		};

		var characteristicDataService = basicsCharacteristicDataServiceFactory.getService(projectMainService, 40);

		platformContainerControllerService.initController($scope, moduleName, projectMainConstantValues.uuid.container.projectDetails, 'projectMainTranslationService');

		function changeCharacRows() {
			$scope.formOptions.configure = projectMainCharacteristicColumnService.getStandardConfigForDetailView();
			if (_.isNil($scope.formOptions.configure.uuid)){
				$scope.formOptions.configure.uuid = projectMainConstantValues.uuid.container.projectDetails;
			}
			platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);

			$timeout(function () {
				$scope.$broadcast('form-config-updated');
			});

		}

		projectMainCharacteristicColumnService.registerSetConfigLayout(changeCharacRows);
		characteristicDataService.registerItemValueUpdate(onItemUpdate);

		function onItemUpdate(e, item) {
			characteristicDataService.getItemByCharacteristicFk(item.CharacteristicFk).then(function () {
				projectMainCharacteristicColumnService.checkRow(item);
				$scope.formOptions.configure  = projectMainCharacteristicColumnService.getStandardConfigForDetailView();
				if (_.isNil($scope.formOptions.configure.uuid)){
					$scope.formOptions.configure.uuid = projectMainConstantValues.uuid.container.projectDetails;
				}
				platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
				$timeout(function () {
					$scope.$broadcast('form-config-updated');
				});
			});
		}

		characteristicDataService.registerItemDelete(onItemDelete);
		function onItemDelete(e, items) {
			projectMainCharacteristicColumnService.deleteRows(items);
			$scope.formOptions.configure  = projectMainCharacteristicColumnService.getStandardConfigForDetailView();
			platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
			$timeout(function () {
				$scope.$broadcast('form-config-updated');
			});
		}

		$scope.$on('$destroy', function () {
			characteristicDataService.unregisterItemDelete(onItemDelete);
			characteristicDataService.unregisterItemValueUpdate(onItemUpdate);
		   projectMainCharacteristicColumnService.unregisterSetConfigLayout(changeCharacRows);
		});

	}
})(angular);
