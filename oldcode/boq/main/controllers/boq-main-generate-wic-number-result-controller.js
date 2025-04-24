/**
 * Created by xia on 6/1/2018.
 */
(function (angular) {
	/* global */
	'use strict';

	var moduleName = 'boq.main';

	angular.module(moduleName).controller('boqMainGenerateWicNumberResultController', ['$scope', '$injector', '$translate', '$timeout', 'platformGridAPI', 'platformTranslateService', 'boqMainService',
		function ($scope, $injector, $translate, $timeout, platformGridAPI, platformTranslateService, boqMainService) {

			var resultInfo = $scope.$eval('modalOptions').resultInfo;

			$scope.changedRecordsGridId = '1097289d50f8443a9bcf64f142234555';
			$scope.changedRecordsGridData = {
				state: $scope.changedRecordsGridId
			};

			$scope.unChangedRecordsGridId = '1097289d50f8443a9bcf64f142234556';
			$scope.unChangedRecordsGridData = {
				state: $scope.unChangedRecordsGridId
			};

			$scope.inputOpen = true;

			$scope.resultInfo = resultInfo;

			$scope.modalOptions.headerText = $translate.instant('boq.main.generateWicNumber');

			var columns = [
				{
					id: 'Brief',
					field: 'BriefInfo.Description',
					name: 'Brief',
					formatter: 'description',
					name$tr$: 'cloud.common.entityBrief'
				},
				{
					id: 'Reference',
					formatter: 'string',
					field: 'Reference',
					name: 'Reference',
					name$tr$: 'boq.main.Reference'
				},
				{
					id: 'Reference2',
					formatter: 'string',
					field: 'Reference2',
					name: 'Reference2',
					name$tr$: 'boq.main.Reference2'
				},
				{
					id: 'WicNumber',
					formatter: 'string',
					field: 'WicNumber',
					name: 'WicNumber',
					name$tr$: 'boq.main.WicNumber'
				}
			];

			if (!columns.isTranslated) {
				platformTranslateService.translateGridConfig(columns);
				columns.isTranslated = true;
			}

			function initializeGrid(gridId, data) {
				if (!platformGridAPI.grids.exist(gridId)) {
					var grid = {
						columns: angular.copy(columns),
						data: data ? data : [],
						id: gridId,
						lazyInit: false,
						enableConfigSave: false,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id'
						}
					};

					platformGridAPI.grids.config(grid);

					$timeout(function () {
						platformGridAPI.grids.resize(gridId);
					});
				}
				else {
					platformGridAPI.columns.configuration(gridId, angular.copy(columns));
					platformGridAPI.items.data(gridId, data ? data : []);
				}
			}

			initializeGrid($scope.changedRecordsGridId, resultInfo.changedRecords);

			initializeGrid($scope.unChangedRecordsGridId, resultInfo.unChangedRecords);

			$scope.$on('$destroy', function () {

				if (platformGridAPI.grids.exist($scope.changedRecordsGridId)) {
					platformGridAPI.grids.unregister($scope.changedRecordsGridId);
				}

				if (platformGridAPI.grids.exist($scope.unChangedRecordsGridId)) {
					platformGridAPI.grids.unregister($scope.unChangedRecordsGridId);
				}
			});

			$scope.onOK = function () {
				var boqRuleComplexLookupService = $injector.get('boqRuleComplexLookupService');
				boqRuleComplexLookupService.loadLookupData();
				boqMainService.load();
				$scope.$close({ok: true, data: {}});
			};

			$scope.onClose = function () {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

		}]);
})(angular);