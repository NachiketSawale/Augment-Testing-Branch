/**
 * Created by aljami on 18.12.2019.
 */
(function () {

	'use strict';
	var moduleName = 'cloud.translation';

	/**
	 * @ngdoc controller
	 * @name cloudTranslationLanguageSelectionDialogController
	 * @function
	 *
	 * @description
	 * Controller for the language selection dialog before import
	 **/
	angular.module(moduleName).controller('cloudTranslationLanguageSelectionDialogController', cloudTranslationLanguageSelectionDialogController);

	cloudTranslationLanguageSelectionDialogController.$inject = ['$scope', '$translate', '_', 'platformGridAPI', 'cloudTranslationWizardService', 'platformTranslateService', 'cloudTranslationImportExportService'];

	function cloudTranslationLanguageSelectionDialogController($scope, $translate, _, platformGridAPI, cloudTranslationWizardService, platformTranslateService, cloudTranslationImportExportService) {

		$scope.loading = true;

		function getSelectedCultures(info) {
			var selectedLanguages = info.value.checkboxItems.filter(function (item) {
				return item.checked;
			});

			if (info.value.englishResource.checked) {
				selectedLanguages.splice(0, 0, info.value.englishResource);
			}
			return _.map(selectedLanguages, 'culture');
		}

		var onPreviewImportClicked = function (event, info) {
			var selectedCultures = getSelectedCultures(info);
			cloudTranslationWizardService.showPreviewImportDialog(selectedCultures, $scope.dialog.modalOptions.value.resetChanged, $scope.dialog.modalOptions.value.uuidImport);
			info.$close(false);
		};

		var onImportClicked = function (event, info) {
			var selectedCultures = getSelectedCultures(info);
			cloudTranslationWizardService.showImportReportDialog(selectedCultures, $scope.dialog.modalOptions.value.resetChanged, $scope.dialog.modalOptions.value.uuidImport);
			info.$close(false);
		};

		var onCancelClicked = function (event, info) {
			cloudTranslationImportExportService.clearTempTable($scope.dialog.modalOptions.value.uuidImport);
			info.$close(false);
		};

		var isButtonDisabled = function () {
			return $scope.loading;
		};

		var isImportButtonDisabled = function () {
			return $scope.loading || $scope.dialog.modalOptions.value.englishResource.checked;
		};

		var buttons = [
			{
				id: 'preview',
				caption: $translate.instant('cloud.translation.languageSelectionDlg.buttons.preview'),
				fn: onPreviewImportClicked,
				disabled: isButtonDisabled
			},
			{
				id: 'import',
				caption: $translate.instant('cloud.translation.languageSelectionDlg.buttons.import'),
				fn: onImportClicked,
				disabled: isImportButtonDisabled
			},
			{
				id: 'clear',
				caption: $translate.instant('cloud.translation.languageSelectionDlg.buttons.cancel'),
				fn: onCancelClicked,
				disabled: isButtonDisabled
			}
		];

		$scope.dialog.buttons = buttons;
		cloudTranslationWizardService.clearSessionUuid();
		cloudTranslationImportExportService.uploadFile($scope.dialog.modalOptions.value.selectedFile).then(function (res) {
			var fileInfo = res.data.fileInfo;
			var uuidImport = res.data.uuid;
			cloudTranslationWizardService.setSessionUuid(uuidImport);

			fileInfo.languages.map(function (language) {
				if (language.field !== 'ENGLISH') {
					angular.extend(language, {
						checked: false,
						text: language.field
					});
					$scope.dialog.modalOptions.value.checkboxItems.push(language);
				}
			});
			$scope.dialog.modalOptions.value.englishResource = {
				field: 'ENGLISH',
				id: 1,
				culture: 'en',
				checked: false,
				text: 'ENGLISH'
			};
			$scope.dialog.modalOptions.value.infoList.push({
				key: $translate.instant('cloud.translation.languageSelectionDlg.resourceCount'),
				value: fileInfo.resourceCount
			});
			$scope.dialog.modalOptions.value.infoList.push({
				key: $translate.instant('cloud.translation.languageSelectionDlg.languageCount'),
				value: fileInfo.languages.length
			});
			$scope.loading = false;
			$scope.dialog.modalOptions.value.languageselection = true;
			$scope.dialog.modalOptions.value.uuidImport = uuidImport;
			$scope.dialog.modalOptions.value.checkboxTitle = $translate.instant('cloud.translation.languageSelectionDlg.checkboxTitle');
			$scope.dialog.modalOptions.value.fileInfoTitle = $translate.instant('cloud.translation.languageSelectionDlg.fileInfoTitle');
			$scope.dialog.modalOptions.value.messageUploadSuccess = $translate.instant('cloud.translation.languageSelectionDlg.messages.uploadSuccess');
			$scope.dialog.modalOptions.value.messageButtonHints = $translate.instant('cloud.translation.languageSelectionDlg.messages.buttonHints');
			$scope.dialog.modalOptions.value.messageInstruction = $translate.instant('cloud.translation.languageSelectionDlg.messages.instruction');
			$scope.dialog.modalOptions.value.step2Info = $translate.instant('cloud.translation.languageSelectionDlg.messages.step2Info');
			$scope.dialog.modalOptions.value.messageEnglishSelected = $translate.instant('cloud.translation.languageSelectionDlg.messages.resourceSelected');
		});
	}
})();