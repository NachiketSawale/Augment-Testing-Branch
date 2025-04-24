/**
 * Created by aljami on 20.12.2019.
 */
(function (angular) {

	'use strict';
	const moduleName = 'cloud.translation';

	/**
	 * @ngdoc controller
	 * @name cloudTranslationImportPreviewDialogController
	 * @function
	 *
	 * @description
	 * Controller for the language selection dialog before import
	 **/
	angular.module(moduleName).controller('cloudTranslationImportPreviewDialogController', cloudTranslationImportPreviewDialogController);

	cloudTranslationImportPreviewDialogController.$inject = ['$scope', '$timeout', '$translate', '_', 'platformGridAPI', 'cloudTranslationWizardService', 'platformTranslateService', 'cloudTranslationImportExportService', 'cloudDesktopInfoService'];

	function cloudTranslationImportPreviewDialogController($scope, $timeout, $translate, _, platformGridAPI, cloudTranslationWizardService, platformTranslateService, cloudTranslationImportExportService, cloudDesktopInfoService) {

		const statusNumbers = {
			Inserted: 1,
			Updated: 2,
			Unchanged: 3,
			Deleted: 4,
			ChangedInDb: 5,
			IsEmpty: 6,
			ResourceInsert: 7,
			ParameterInvalid: 8,
			ResourceNoSelect: 9
		};

		const statusTexts = {
			Inserted: $translate.instant('cloud.translation.previewdlg.status.inserted'),
			Updated: $translate.instant('cloud.translation.previewdlg.status.updated'),
			Unchanged: $translate.instant('cloud.translation.previewdlg.status.unchanged'),
			Deleted: $translate.instant('cloud.translation.previewdlg.status.deleted'),
			ChangedInDb: $translate.instant('cloud.translation.previewdlg.status.changeindb'),
			IsEmpty: $translate.instant('cloud.translation.previewdlg.status.isempty'),
			ResourceInsert: $translate.instant('cloud.translation.previewdlg.status.resourceinsert'),
			ParameterInvalid: $translate.instant('cloud.translation.previewdlg.status.parameterinvalid'),
			NotProcessed: $translate.instant('cloud.translation.previewdlg.status.notprocessed'),
			ResourceNoSelect: $translate.instant('cloud.translation.previewdlg.status.resourceNoSelect'),
			Empty: ''
		};

		const copyBtn = {
			id: 'copy-report',
			caption: $translate.instant('cloud.translation.previewdlg.buttons.copy'),
			fn: onCopyClicked,
			disabled: isButtonDisabled
		};

		const closeBtn = {
			id: 'cancel',
			caption: $translate.instant('cloud.translation.previewdlg.buttons.close'),
			fn: onCancelClicked,
			disabled: isButtonDisabled
		};

		const importBtn = {
			id: 'import',
			caption: $translate.instant('cloud.translation.previewdlg.buttons.import'),
			fn: onImportClicked,
			disabled: isImportButtonDisabled
		};

		const cancelBtn = {
			id: 'cancel',
			caption: $translate.instant('cloud.translation.previewdlg.buttons.cancel'),
			fn: onCancelClicked,
			disabled: isButtonDisabled
		};

		function isButtonDisabled(/* info */) {
			return $scope.loading;
		}

		function isImportButtonDisabled(/* info */) {
			return $scope.loading || ($scope.resourceChanged && !$scope.dialog.modalOptions.value.resourceVerifyConsent);
		}

		function onImportClicked(/* event, info */) {
			$scope.loading = true;
			$scope.dialog.buttons = [closeBtn];
			$scope.dialog.customButtons = [copyBtn];
			$scope.data = [];
			$scope.gridColums = [];
			$scope.gridTitle = $translate.instant('cloud.translation.previewdlg.gridTitleInvalid');
			$scope.loadingMessage = $translate.instant('cloud.translation.previewdlg.importLoadingMsg');
			$scope.stepInfo = $translate.instant('cloud.translation.previewdlg.messages.stepFinalInfo');
			$scope.validationImportDoneMessage = $translate.instant('cloud.translation.previewdlg.messages.importDone');

			$timeout(function () {
				platformGridAPI.columns.configuration($scope.gridId, $scope.gridColums);
				platformGridAPI.items.data($scope.gridId, $scope.data);

				return cloudTranslationImportExportService.executeImport($scope.dialog.modalOptions.value.selectedCultures, $scope.activeUserId, $scope.dialog.modalOptions.value.resetChanged, $scope.dialog.modalOptions.value.uuidImport).then(function (response) {
					cloudTranslationImportExportService.getExportColumnMap().then((languageResult)=>{
						$scope.loading = false;
						$scope.data = convertToGridData(response.data.invalidData, getStatusTextAtImport);
						$scope.gridColums = getGridColumns(response.data.invalidData, columnNameMap);
						updateStatusSummary(response.data.importReport.info);

						$timeout(function () {
							platformTranslateService.translateGridConfig($scope.gridColums);
							platformGridAPI.columns.configuration($scope.gridId, $scope.gridColums);
							platformGridAPI.items.data($scope.gridId, $scope.data);
						});
					});

				});
			});

		}

		function onCopyClicked(button, info) {
			let rows = platformGridAPI.rows.getRows($scope.gridId);
			let idx = [];
			for (let i = 0; i < rows.length; i++) {
				idx.push(i);
			}

			platformGridAPI.grids.setAllowCopySelection($scope.gridId, true);
			platformGridAPI.rows.selection({rows: idx, gridId: $scope.gridId, wantsArray: true});
			let gridInstance = platformGridAPI.grids.element('id', $scope.gridId);
			gridInstance.instance.selectedRange = new Slick.Range(0, 0, rows.length - 1, gridInstance.columns.current.length - 1);
			platformGridAPI.grids.copySelection($scope.gridId);
			info.dialog.setAlarm($scope.copyCompleteMessage);
		}

		function onCancelClicked(event, info) {
			cloudTranslationImportExportService.clearTempTable($scope.dialog.modalOptions.value.uuidImport);
			info.$close();
		}



		/*
		* converts numeric status to text
		* */
		function getStatusText(status) {

			switch (status) {
				case statusNumbers.Inserted:
					return statusTexts.Inserted;
				case statusNumbers.Updated:
					return statusTexts.Updated;
				case statusNumbers.Unchanged:
					return statusTexts.Unchanged;
				case statusNumbers.Deleted:
					return statusTexts.Deleted;
				case statusNumbers.ChangedInDb:
					return statusTexts.ChangedInDb;
				case statusNumbers.IsEmpty:
					return statusTexts.IsEmpty;
				case statusNumbers.ResourceInsert:
					return statusTexts.ResourceInsert;
				case statusNumbers.ParameterInvalid:
					return statusTexts.ParameterInvalid;
				case statusNumbers.ResourceNoSelect:
					return statusTexts.ResourceNoSelect;
				default:
					return statusTexts.NotProcessed;
			}
		}

		function getStatusTextAtImport(status) {

			switch (status) {
				case statusNumbers.Inserted:
					return statusTexts.Inserted;
				case statusNumbers.Updated:
					return statusTexts.Empty;
				case statusNumbers.Unchanged:
					return statusTexts.Unchanged;
				case statusNumbers.Deleted:
					return statusTexts.Deleted;
				case statusNumbers.ChangedInDb:
					return statusTexts.ChangedInDb;
				case statusNumbers.IsEmpty:
					return statusTexts.IsEmpty;
				case statusNumbers.ResourceInsert:
					return statusTexts.ResourceInsert;
				case statusNumbers.ParameterInvalid:
					return statusTexts.ParameterInvalid;
				case statusNumbers.ResourceNoSelect:
					return statusTexts.ResourceNoSelect;
				default:
					return statusTexts.NotProcessed;
			}
		}

		function getLanguageColumnId(language){
			return language.ColumnName;
		}

		function getLanguageStatusColumnId(language){
			return language.ColumnName + '_STATUS';
		}

		/*
		* converts response from server into a grid usable format
		* */
		function convertToGridData(dataArray, statusTextFunc) {
			const gridData = _.map(dataArray, function (el) {
				var temp = {};
				temp.Id = el.Id;
				temp.ISGLOSSARY = el.IsGlossary;
				temp.RESOURCE = el.Resource;
				_.forEach(el.SelectedLanguageColumn, function (language/* , index, arr */) {
					temp[getLanguageColumnId(language)] = language.ColumnValue;
					temp[getLanguageStatusColumnId(language)] = statusTextFunc(language.Status);
				});

				return temp;
			});

			return gridData;
		}

		/*
		* gets the grid usable column array from server response
		* */
		function getGridColumns(dataArray, columnMap) {
			if (dataArray.length === 0) {
				return [];
			}
			const columnWidth = 150;
			const statusWidth = 100;
			const sample = dataArray[0];
			const gridColumns = [];

			gridColumns.push({
				Id: 'Id',
				sortable: true,
				name: 'Id',
				name$tr$: 'cloud.translation.previewdlg.id',
				field: 'Id',
				width: 60
			});
			gridColumns.push({
				Id: 'ISGLOSSARY',
				name: 'Glossary',
				name$tr$: 'cloud.translation.previewdlg.isglossary',
				field: 'ISGLOSSARY',
				width: 60,
				formatter: 'boolean'
			});
			gridColumns.push({
				Id: 'RESOURCE',
				sortable: true,
				name$tr$: 'cloud.translation.previewdlg.resource',
				field: 'RESOURCE',
				width: columnWidth
			});

			_.forEach(sample.SelectedLanguageColumn, function (el/* , index, arr */) {
				let languageColumnId = getLanguageColumnId(el);
				let languageStatusColumnId = getLanguageStatusColumnId(el);
				let languageColumn = columnMap[languageColumnId];
				let languageStatusColumn = $translate.instant('cloud.translation.previewdlg.languageStatus') + ': ' + languageColumn;
				gridColumns.push({
					Id: languageColumnId,
					sortable: true,
					name: languageColumn,
					field: languageColumnId,
					width: columnWidth
				});
				gridColumns.push({
					Id: languageStatusColumnId,
					sortable: true,
					name: languageStatusColumn,
					field: languageStatusColumnId,
					width: statusWidth
				});
			});
			return gridColumns;
		}

		function updateStatusSummary(statusData) {
			$scope.statusSummary.inserted = 0;
			$scope.statusSummary.updated = 0;
			$scope.statusSummary.deleted = 0;
			$scope.statusSummary.unchanged = 0;

			_.forEach(statusData, function (el/* , index, arr */) {
				$scope.statusSummary.inserted += el.Value.Inserted;
				$scope.statusSummary.updated += el.Value.Updated;
				$scope.statusSummary.deleted += el.Value.Deleted;
				$scope.statusSummary.unchanged += el.Value.Unchanged;
			});
		}

		function addButtonsToDialog() {
			if ($scope.dialog.modalOptions.value.isPreview) {
				$scope.dialog.buttons = [importBtn, cancelBtn];
			} else {
				$scope.dialog.buttons = [closeBtn];
				$scope.dialog.customButtons = [copyBtn];
			}
		}

		function setStatusLabels() {
			$scope.labelInserted = $translate.instant('cloud.translation.previewdlg.status.inserted');
			$scope.labelUpdated = $translate.instant('cloud.translation.previewdlg.status.updated');
			$scope.labelDeleted = $translate.instant('cloud.translation.previewdlg.status.deleted');
			$scope.labelUnchanged = $translate.instant('cloud.translation.previewdlg.status.unchanged');
		}

		function initializeScopeVariables() {
			$scope.dialog.modalOptions.headerText = $translate.instant('cloud.translation.previewdlg.dialogTitlePreview');
			$scope.dialog.modalOptions.value.resourceVerifyConsentLabel = $translate.instant('cloud.translation.previewdlg.resourceVerifyConsentLabel');
			$scope.dialog.modalOptions.value.resourceVerifyConsent = false;
			$scope.resourceChanged = false;
			$scope.copyCompleteMessage = $translate.instant('cloud.translation.previewdlg.messages.copyComplete');
			$scope.loading = true;
			$scope.gridColums = [];
			$scope.data = [];
			$scope.gridId = 'preview-dialog';
			$scope.gridData = {
				state: $scope.gridId
			};

			$scope.statusSummary = {
				inserted: 0,
				updated: 0,
				deleted: 0,
				unchanged: 0
			};

			$scope.gridTitle = '';
			$scope.loadingMessage = '';

			const headerInfo = cloudDesktopInfoService.read();
			$scope.activeUserId = headerInfo.userInfo.UserId;
		}

		function initializeGrid() {
			var grid = {
				data: $scope.data,
				columns: $scope.gridColums,
				id: $scope.gridId,
				options: {
					tree: false,
					indicator: false,
					enableDraggableGroupBy: false,
					enableConfigSave: false,
					enableColumnReorder: false,
					enableCopyPasteExcel: true,
					idProperty: 'Id',
				}

			};
			platformGridAPI.grids.config(grid);

		}

		function refreshGrid() {
			$timeout(function () {
				platformTranslateService.translateGridConfig($scope.gridColums);
				platformGridAPI.columns.configuration($scope.gridId, $scope.gridColums);
				platformGridAPI.items.data($scope.gridId, $scope.data);
			});
		}

		function updatePreviewData(response) {
			/**
			 * data structure
			 * {
						validationResult = {
							info = [
								{
									Key: "ENGLISH",
									Value: {LanguageName: "English", Valid: 0, Invalid: 0, Inserted: 0, Updated: 0, Deleted: 0, Unchanged: 0}
								},
								{
									Key: "GERMAN",
									Value: {...}
								},
								...
							],
							resourceChanged = true/false
						},
						data = [
							{
								Id: 11111
								IsGlossary: true
								Resource: "Resource 1"
								SelectedLanguageColumn: [
									{ColumnName: "GERMAN", ColumnValue: "", Status: 6}
								]
							},
							{
								Id: 22222
								IsGlossary: false
								Resource: "Resource 2"
								SelectedLanguageColumn: [
									{ColumnName: "GERMAN", ColumnValue: "", Status: 6}
								]
							},
							...
						],
						uuid = 'uuid_for_this_import_session'
					}
			 * **/
			cloudTranslationImportExportService.getExportColumnMap().then((columnMap)=>{
				$scope.loading = false;
				$scope.gridTitle = $translate.instant('cloud.translation.previewdlg.gridTitlePreview');
				$scope.data = convertToGridData(response.data.data, getStatusText);
				$scope.gridColums = getGridColumns(response.data.data, columnMap);
				$scope.resourceChanged = response.data.validationResult.resourceChanged;
				updateStatusSummary(response.data.validationResult.info);
				refreshGrid();
			});

		}

		function updateImportData(response) {
			cloudTranslationImportExportService.getExportColumnMap().then((columnMap)=>{
				$scope.loading = false;
				$scope.gridTitle = $translate.instant('cloud.translation.previewdlg.gridTitleInvalid');
				$scope.data = convertToGridData(response.data.invalidData, getStatusTextAtImport);
				$scope.gridColums = getGridColumns(response.data.invalidData, columnMap);
				updateStatusSummary(response.data.importReport.info);
				refreshGrid();
			});

		}

		addButtonsToDialog();
		setStatusLabels();
		initializeScopeVariables();

		let gridInstance = platformGridAPI.grids.element('id', $scope.gridId);
		if (!gridInstance) {
			initializeGrid();
		}
		platformGridAPI.grids.setAllowCopySelection($scope.gridId, true);

		$timeout(function (){
			let gridInstance = platformGridAPI.grids.element('id', $scope.gridId);
			gridInstance.options.enableCopyPasteExcel = true;
			platformGridAPI.grids.register(gridInstance);
		}, 200);

		// fetch data here
		if ($scope.dialog.modalOptions.value.isPreview) {
			$scope.loadingMessage = $translate.instant('cloud.translation.previewdlg.validationLoadingMsg');
			$scope.stepInfo = $translate.instant('cloud.translation.previewdlg.messages.step3Info');
			$scope.validationImportDoneMessage = $translate.instant('cloud.translation.previewdlg.messages.validationDone');
			return cloudTranslationImportExportService.statusAndValidationCheck($scope.dialog.modalOptions.value.selectedCultures, $scope.activeUserId, $scope.dialog.modalOptions.value.resetChanged, $scope.dialog.modalOptions.value.uuidImport).then(function (response) {
				updatePreviewData(response);
			});
		} else {
			$scope.loadingMessage = $translate.instant('cloud.translation.previewdlg.importLoadingMsg');
			$scope.stepInfo = $translate.instant('cloud.translation.previewdlg.messages.stepFinalInfo');
			$scope.validationImportDoneMessage = $translate.instant('cloud.translation.previewdlg.messages.importDone');
			return cloudTranslationImportExportService.executeImportDirect($scope.dialog.modalOptions.value.selectedCultures, $scope.activeUserId, $scope.dialog.modalOptions.value.resetChanged, $scope.dialog.modalOptions.value.uuidImport).then(function (response) {
				updateImportData(response);
			});
		}

	}
})(angular);
