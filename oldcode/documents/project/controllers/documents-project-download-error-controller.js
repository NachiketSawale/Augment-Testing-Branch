(function () {
	'use strict';

	const moduleName = 'documents.project';
	angular.module(moduleName).controller('documentsProjectDownloadErrorController', [
		'$scope', 'platformGridAPI', '$translate', 'platformTranslateService',
		function ($scope, platformGridAPI, $translate, platformTranslateService) {
			const _params = $scope.$parent.modalOptions.params;

			$scope.gridId = '47b7b67f11b84c9dbade152ce453565a';

			$scope.gridData = {
				state: $scope.gridId
			};

			$scope.onOK = function () {
				$scope.$close(false);
			};

			const gridColumns = [
				{
					id: 'code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode',
					readonly: true,
					formatter: 'code',
					width: 120
				},
				{
					id: 'description',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription',
					formatter: 'description',
					readonly: true,
					width: 180
				},
				{
					id: 'originFileName',
					field: 'OriginFileName',
					name: 'OriginFileName',
					name$tr$: 'documents.project.entityFileArchiveDoc',
					formatter: 'description',
					readonly: true,
					width: 200
				},
				{
					id: 'reason',
					field: 'Reason',
					name: 'Reason',
					name$tr$: 'basics.common.reason',
					formatter: 'description',
					readonly: true,
					width: 280
				}
			];

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				platformTranslateService.translateGridConfig(gridColumns);
				const grid = {
					id: $scope.gridId,
					data: _params,
					columns: gridColumns,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id',
					}
				};
				platformGridAPI.grids.config(grid);
			}
			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister($scope.gridId);
			});
		}
	]);
})(angular);