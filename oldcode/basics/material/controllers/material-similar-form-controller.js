(function (angular) {
	'use strict';

	angular.module('platform').controller('materialSimilarFormController', ['$scope',
		function ($scope) {
			const formConfig = $scope.dialog.modalOptions.formConfiguration;

			$scope.dataItem = $scope.dialog.modalOptions.dataItem;

			$scope.formOptions = {
				configure: formConfig
			};
			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				setTools: function () {}
			};

			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				version: 1,
				items: [{
					sort: 1,
					id: 'formSetting',
					type: 'item',
					tooltip: 'basics.material.lookup.setting',
					iconClass: 'tlb-icons ico-settings',
					fn: function () {
						$scope.formOptions.showConfigDialog();
					}
				}]
			};
		}
	]);
})(angular);