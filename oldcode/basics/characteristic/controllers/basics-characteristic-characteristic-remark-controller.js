(function (angular) {
	'use strict';
	var moduleName = 'basics.characteristic';
	angular.module(moduleName).value('basicsCharacteristicCharacteristicRemarkConfiguration', {
		getStandardConfigForDetailView: function () {
			return {
				fid: 'basics.characteristic.characteristic.remark',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: '1',
						header: '',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [
					{
						gid: '1',
						rid: 'remark',
						label: '',
						type: 'remark',
						model: 'Remark',
						visible: true,
						sortOrder: 1,
						readonly: false
					}
				]
			};
		}
	});

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCharacteristicCharacteristicRemarkController', ['$scope', 'platformDetailControllerService', 'basicsCharacteristicCharacteristicService', 'basicsCharacteristicCharacteristicValidationService', 'basicsCharacteristicCharacteristicRemarkConfiguration', 'schedulingMainTranslationService',
		function ($scope, platformDetailControllerService, basicsCharacteristicCharacteristicService, basicsCharacteristicCharacteristicValidationService, basicsCharacteristicCharacteristicRemarkConfiguration, schedulingMainTranslationService) {
			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};
			platformDetailControllerService.initDetailController($scope, basicsCharacteristicCharacteristicService, basicsCharacteristicCharacteristicValidationService, basicsCharacteristicCharacteristicRemarkConfiguration, schedulingMainTranslationService);
		}
	]);
})(angular);