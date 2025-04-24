/**
 * Created by aljami on 31.01.2024
 */

(function () {

	'use strict';

	angular.module('cloud.common').controller('cloudCommonEnglishTranslationIssueController', ['$scope', 'cloudCommonTranslationIssueService', 'platformGridAPI', 'platformTranslateService', '$timeout', '$translate',
		function ($scope, translationIssueService, platformGridAPI, platformTranslateService, $timeout, $translate) {

			const optionGuidKeepTranslation = 'a68337e130ef472987aa0ae12da575b8';
			const optionGuidDirectDelete = '1ad3e06e12254f689441860ab0e0d799';

			$scope.activeIssue = getIssueToDisplay();
			$scope.hasIssue = $scope.activeIssue !== undefined;
			$scope.issueTitle = $translate.instant('cloud.common.translationIssueDialog.englishTranslationIssue.issueTitle');
			$scope.issueDescription = $translate.instant('cloud.common.translationIssueDialog.englishTranslationIssue.issueDescription');
			$scope.keepTranslationDescription = $translate.instant('cloud.common.translationIssueDialog.englishTranslationIssue.keepTranslationDescription');
			$scope.buttonTextRemoveTranslation = $translate.instant('cloud.common.translationIssueDialog.englishTranslationIssue.buttonRemove');

			$scope.gridId = '113013d4b88d423e9d115816182fe182';
			$scope.gridData = {
				state: $scope.gridId
			};
			$scope.selectedOptionGuid = '';

			$scope.resolutionDone = false;

			$scope.feedbackMessage = '';
			$scope.loading = false;
			$scope.loadingMessage = '';
			const removingTranslationMessage = $translate.instant('cloud.common.translationIssueDialog.englishTranslationIssue.loadingMessageRemoving');
			const updatingDataMessage = $translate.instant('cloud.common.translationIssueDialog.englishTranslationIssue.loadingMessageUpdating');

			let successMsgDirectRemove = $translate.instant('cloud.common.translationIssueDialog.englishTranslationIssue.successMessageDirectRemove');
			let successMsgTranslationKept = $translate.instant('cloud.common.translationIssueDialog.englishTranslationIssue.successMessageTranslationKept');

			$scope.performCleanup = () => {
				if (!$scope.dialog.modalOptions.value.keepTranslation) {
					performActionRemoveDirect();
				}
				if ($scope.dialog.modalOptions.value.keepTranslation && $scope.dialog.modalOptions.value.data) {
					performActionKeepTranslation();
				}
			};

			setupGrid();
			$timeout(function () {
				updateGrid([$scope.activeIssue]);
			}, 200);

			function performActionKeepTranslation() {
				$scope.loading = true;
				$scope.loadingMessage = updatingDataMessage;
				updateTableDataWithTranslation().then(response => {
					$scope.loadingMessage = removingTranslationMessage;
					resolveIssue(optionGuidKeepTranslation).then((result) => {
						$scope.resolutionDone = true;
						$scope.feedbackMessage = successMsgTranslationKept;
						reloadIssues();
						$scope.loading = false;
					});
				});
			}

			function performActionRemoveDirect() {
				$scope.loading = true;
				$scope.loadingMessage = removingTranslationMessage;
				resolveIssue(optionGuidDirectDelete).then((result) => {
					$scope.resolutionDone = true;
					$scope.feedbackMessage = successMsgDirectRemove;
					reloadIssues();
					$scope.loading = false;
				});
			}

			function reloadIssues() {

				const tableDataService = $scope.dialog.modalOptions.value.dataService;
				const selectedItemForDataService = tableDataService.getSelected();

				return tableDataService.read().then(() => {
					$timeout(()=>tableDataService.setSelected(selectedItemForDataService));
					return true;
				});

			}

			function resolveIssue(optionGuid) {
				return translationIssueService.resolveIssue($scope.activeIssue.IssueGuid, optionGuid, $scope.activeIssue.BasTranslationFk, $scope.activeIssue.ItemValue, $scope.activeIssue.ColumnName);
			}

			function updateTableDataWithTranslation() {
				let columnName = $scope.activeIssue.ColumnName;
				let dataItem = $scope.dialog.modalOptions.value.data.selectedItem;
				dataItem[columnName].Description = $scope.activeIssue.BasTranslationValue;
				dataItem[columnName].DescriptionModified = true;

				$scope.dialog.modalOptions.value.data.markItemAsModified(dataItem, $scope.dialog.modalOptions.value.data);
				if($scope.dialog.modalOptions.value.isInCustomizeModule) {
					return $scope.dialog.modalOptions.value.dataService.parentService().update();
				}
				return $scope.dialog.modalOptions.value.dataService.update();
			}

			function getIssueToDisplay() {
				let currentIssues = translationIssueService.getCurrentIssues();
				return currentIssues.length > 0 ? currentIssues[0] : undefined;
			}

			function updateGrid(resultGridData) {
				platformGridAPI.grids.invalidate($scope.gridId);
				platformGridAPI.items.data($scope.gridId, resultGridData);
			}

			function setupGrid() {

				const columns = [
					{
						id: 'item',
						name: 'Data Item',
						name$tr$: 'cloud.common.translationIssueDialog.englishTranslationIssue.columns.dataItem',
						field: 'ItemValue',
						width: 200,
						sortable: false
					},
					{
						id: 'translation',
						name: 'Translation',
						name$tr$: 'cloud.common.translationIssueDialog.englishTranslationIssue.columns.translation',
						field: 'BasTranslationValue',
						width: 200,
						sortable: false
					}
				];

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					const resultGridConfig = {
						columns: columns,
						data: [],
						id: $scope.gridId,
						options: {
							tree: false,
							indicator: false,
							idProperty: 'IssueGuid'
						}
					};
					platformGridAPI.grids.config(resultGridConfig);
					platformTranslateService.translateGridConfig(resultGridConfig.columns);
				}
			}
		}
	]);
})();