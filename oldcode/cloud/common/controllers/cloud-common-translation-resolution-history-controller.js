/**
 * Created by aljami on 21.02.2024
 */

(function () {

	'use strict';

	angular.module('cloud.common').controller('cloudCommonTranslationResolutionHistoryController', ['$scope', 'cloudCommonTranslationIssueService', 'platformGridAPI', 'platformTranslateService', '$timeout', '$translate',
		function ($scope, translationIssueService, platformGridAPI, platformTranslateService, $timeout, $translate) {

			$scope.historyTitle = $translate.instant('cloud.common.translationIssueDialog.history.title');

			$scope.gridId = 'd206b331987849da8612e9768007fced';
			$scope.gridData = {
				state: $scope.gridId
			};
			let actionDescriptions = [
				{id: 0, description: $translate.instant('cloud.common.translationIssueDialog.history.actionTranslationKept')},
				{id: 1, description: $translate.instant('cloud.common.translationIssueDialog.history.actionTranslationRemoved')},
			];

			$scope.loading = false;
			$scope.loadingMessage = $translate.instant('cloud.common.translationIssueDialog.history.loadingMessageFetching');

			function getTrValuesOfSelectedItem() {
				let selectedDataItem = $scope.dialog.modalOptions.value.data.selectedItem;
				let trValues = [];
				for(let prop in selectedDataItem) {
					if(selectedDataItem[prop] && selectedDataItem[prop].hasOwnProperty('DescriptionTr')) {
						if(selectedDataItem[prop]['DescriptionTr']) {
							trValues.push(selectedDataItem[prop]['DescriptionTr']);
						}
					}
				}
				return trValues;
			}

			setupGrid();
			$scope.loading = true;
			translationIssueService.getHistory(getTrValuesOfSelectedItem()).then(historyItems => {
				$scope.loading = false;
				updateGrid(historyItems);
			});

			function updateGrid(resultGridData) {
				platformGridAPI.grids.invalidate($scope.gridId);
				platformGridAPI.items.data($scope.gridId, resultGridData);
			}

			function setupGrid() {

				const columns = [
					{
						id: 'columnName',
						name: 'Column Name',
						name$tr$: 'cloud.common.translationIssueDialog.history.columns.columnName',
						field: 'ColumnName',
						width: 100,
						sortable: false
					},
					{
						id: 'columnValue',
						name: 'Column Value',
						name$tr$: 'cloud.common.translationIssueDialog.history.columns.columnValue',
						field: 'ColumnValue',
						width: 200,
						sortable: false
					},
					{
						id: 'basTranslationValue',
						name: 'Translation Value',
						name$tr$: 'cloud.common.translationIssueDialog.history.columns.translationValue',
						field: 'BasTranslationValue',
						width: 200,
						sortable: false
					},
					{
						id: 'actionTaken',
						name: 'Action Taken',
						name$tr$: 'cloud.common.translationIssueDialog.history.columns.actionTaken',
						field: 'ActionTaken',
						width: 200,
						sortable: false,
						formatter: function (row, cell, value) {
							return actionDescriptions.find(e => e.id === value).description;
						}},
					/*{
						id: 'inserted',
						name: 'Inserted At',
						name$tr$: 'cloud.common.translationIssueDialog.history.columns.inserted',
						field: 'InsertedAt',
						type: 'history',
						width: 100,
						sortable: false
					},
					{
						id: 'whoInserted',
						name: 'Inserted By',
						name$tr$: 'cloud.common.translationIssueDialog.history.columns.whoInserted',
						field: 'InsertedBy',
						formatter: 'history',
						width: 100,
						sortable: false
					}*/
				];

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					const resultGridConfig = {
						columns: columns,
						data: [],
						id: $scope.gridId,
						options: {
							tree: false,
							indicator: false,
							idProperty: 'Id'
						}
					};
					platformGridAPI.grids.config(resultGridConfig);
					platformTranslateService.translateGridConfig(resultGridConfig.columns);
				}
			}
		}
	]);
})();