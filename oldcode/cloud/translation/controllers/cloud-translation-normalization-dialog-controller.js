/**
 * Created by aljami on 17.12.2019.
 */
(function (angular) {

	'use strict';
	const moduleName = 'cloud.translation';

	/**
	 * @ngdoc controller
	 * @name cloudTranslationExportDialogController
	 * @function
	 *
	 * @description
	 * Controller for the export translation dialog
	 **/
	angular.module(moduleName).controller('cloudTranslationNormalizationDialogController', cloudTranslationNormalizationDialogController);

	cloudTranslationNormalizationDialogController.$inject = ['$scope', '$translate', '$timeout', '_', 'platformGridAPI', 'cloudTranslationGlossaryService'];

	function cloudTranslationNormalizationDialogController($scope, $translate, $timeout, _, platformGridAPI, cloudTranslationGlossaryService) {

		const executeBtn = {
			id: 'execute',
			caption: $translate.instant('cloud.translation.normalizedlg.buttons.execute'),
			fn: onExecuteBtnClick,
			disabled: function () {
				return $scope.loading;
			}
		};

		function initializeScopeVars() {
			$scope.displayInfo = true;
			$scope.instructionText = $translate.instant('cloud.translation.normalizedlg.instructions');
			$scope.warningText = $translate.instant('cloud.translation.normalizedlg.warning');
			$scope.message = $translate.instant('cloud.translation.normalizedlg.loadingMessage');
			$scope.loading = false;
			$scope.gridId = 'normalizationResultsGrid';
			$scope.gridData = {
				state: $scope.gridId
			};
			$scope.data = [];
			$scope.gridColumns = getGridColumns();
			$scope.statTitle = $translate.instant('cloud.translation.normalizedlg.statTitle');
			$scope.notificationText = '';
			$scope.dialog.buttons = [executeBtn, cancelBtn];
		}

		function getGridColumns() {
			const gridColumns = [];
			gridColumns.push({
				Id: 'Info',
				name: 'Info',
				name$tr$: 'cloud.translation.normalizedlg.columnInfo',
				field: 'Info',
				width: 100
			});
			gridColumns.push({
				Id: 'Total',
				name: 'Total Entries',
				name$tr$: 'cloud.translation.normalizedlg.columnTotal',
				field: 'Total',
				width: 80
			});
			gridColumns.push({
				Id: 'Glossary',
				name: 'Glossary Count',
				name$tr$: 'cloud.translation.normalizedlg.columnGlossary',
				field: 'Glossary',
				width: 80
			});
			gridColumns.push({
				Id: 'ReferencingAGlossary',
				name: 'Referencing a Glossary',
				name$tr$: 'cloud.translation.normalizedlg.columnGlossaryRefs',
				field: 'ReferencingAGlossary',
				width: 80
			});
			gridColumns.push({
				Id: 'NotReferencingAGlossary',
				name: 'Not Referencing a Glossary',
				name$tr$: 'cloud.translation.normalizedlg.columnGlossaryNonRefs',
				field: 'NotReferencingAGlossary',
				width: 80
			});
			return gridColumns;
		}

		function onExecuteBtnClick() {
			$scope.loading = true;
			$scope.displayInfo = false;
			cloudTranslationGlossaryService.getStat().then(function (initialStat) {
				cloudTranslationGlossaryService.normalizeResources().then(function (/* response */) {

					cloudTranslationGlossaryService.getStat().then(function (finalStat) {
						prepareOutput(initialStat.data.Stat, finalStat.data.Stat);
						$scope.loading = false;
					}, function (finalStatFailed) {
						showError(finalStatFailed);
						$scope.loading = false;
					});
				}, function (normalizationError) {
					$scope.loading = false;
					showError(normalizationError);
				});
			}, function (initialStatFailed) {
				$scope.loading = false;
				showError(initialStatFailed);
			});
		}


		const onCancelClicked = function (event, info) {
			info.$close();
		};

		const cancelBtn = {
			id: 'cancel',
			caption: $translate.instant('cloud.translation.normalizedlg.buttons.cancel'),
			fn: onCancelClicked
		};

		function prepareOutput(initialStat, finalStat) {
			angular.extend(initialStat, {
				Id: 1,
				Info: $translate.instant('cloud.translation.normalizedlg.initialInfo')
			});

			angular.extend(finalStat, {
				Id: 2,
				Info: $translate.instant('cloud.translation.normalizedlg.finalInfo')
			});

			const titles = {
				Info: $translate.instant('cloud.translation.normalizedlg.statTitle'),
				Total: $translate.instant('cloud.translation.normalizedlg.columnTotal'),
				Glossary: $translate.instant('cloud.translation.normalizedlg.columnGlossary'),
				ReferencingAGlossary: $translate.instant('cloud.translation.normalizedlg.columnGlossaryRefs'),
				NotReferencingAGlossary: $translate.instant('cloud.translation.normalizedlg.columnGlossaryNonRefs')
			};

			$scope.data = [titles, initialStat, finalStat];
			$scope.notificationText = $translate.instant('cloud.translation.normalizedlg.successText');
		}

		function showError() {
			$scope.notificationText = $translate.instant('cloud.translation.normalizedlg.errorText');
		}

		initializeScopeVars();
	}
})(angular);
