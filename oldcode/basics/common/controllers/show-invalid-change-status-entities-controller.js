/**
 * Created by pel on 4/10/2020.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	angular.module(moduleName).controller('showInvalidChangeStatusEntitiesController', [
		'$scope',
		'$http',
		'$translate',
		'platformGridAPI',
		function (
			$scope,
			$http,
			$translate,
			platformGridAPI
		) {

			$scope.options = $scope.$parent.modalOptions;
			$scope.deleteParam = [];
			$scope.selectRows = [];

			$scope.modalOptions = {
				okButtonText: $translate.instant('cloud.common.nextStep'),
				cancelButtonText: $translate.instant('cloud.common.cancel')
			};

			$scope.modalOptions.ok = function () {
				$scope.$close({ok: true});
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close({ok: false});
			};

			const columns = [
				{
					id: 'Code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'basics.common.changeStatus.code',
					formatter: 'code',
					width: 100
				},
				{
					id: 'Description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'basics.common.changeStatus.description',
					formatter: 'description',
					width: 88
				}

			];

			$scope.gridId = '599a5b52b72c42dea28adc08f2224969';

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				const grid = {
					columns: columns,
					data: $scope.options.currentItem,
					id: $scope.gridId,
					lazyInit: true,
					options: {
						indicator: true,
						idProperty: 'Id',
						iconClass: ''
					}
				};
				platformGridAPI.grids.config(grid);
			}

			$scope.gridData = {
				state: $scope.gridId
			};
		}
	]);
})(angular);
