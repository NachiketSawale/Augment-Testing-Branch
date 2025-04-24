/**
 * Created by balkanci on 02.12.2015.
 */
(function (angular) {
	'use strict';

	angular.module('basics.common').controller('basicsCommonMatrixCellDefinitionController', ['$scope', 'platformObjectHelper', 'basicsCommonCellDefinitionDataService', '_',
		function ($scope, platformObjectHelper, dataService, _) {

			let unwatch;

			function setUpWatch() {
				unwatch = $scope.$watch('cellDefinition', function (newVal, oldVal) {
					if ((platformObjectHelper.isSet(oldVal) && platformObjectHelper.isSet(newVal)) && oldVal !== newVal) {
						if (_.isEmpty(dataService.getList())) {
							dataService.setList([newVal]);
						}
						dataService.markItemAsModified(newVal);
					}
				}, true);
			}

			function setEntity(entity) {
				if (entity) {
					$scope.cellDefinition = entity;
					setUpWatch();
				}
			}

			$scope.sumPixelValues = function (pixVal1, pixVal2, pixVal3) {
				const sum = pixVal1 + pixVal2 + pixVal3;
				return angular.isNumber(sum) ? sum : 0;
			};

			dataService.getSelectedCellDefinition().then(function () {
				setEntity(dataService.getSelected());
			});

			$scope.$on('$destroy', function () {
				if (angular.isFunction(unwatch)) {
					unwatch();
				}
			});

		}
	]);

})(angular);

