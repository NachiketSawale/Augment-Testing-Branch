/**
 * Created by aljami on 17.12.2019.
 */
(function () {

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
	angular.module(moduleName).controller('cloudTranslationExportDialogController', cloudTranslationExportDialogController);

	cloudTranslationExportDialogController.$inject = ['$scope', '$translate', '_', 'platformGridAPI', 'cloudTranslationWizardService', 'platformTranslateService', 'cloudTranslationImportExportService'];

	function cloudTranslationExportDialogController($scope, $translate, _, platformGridAPI, cloudTranslationWizardService, platformTranslateService, cloudTranslationImportExportService) {

		function printFailedText(err) {
			$scope.loading = false;
			$scope.failed = true;
			$scope.error = err;
		}

		function populateDialogWithLanguage(languages) {
			$scope.checkboxItems = [];
			languages.map(function (language) {
				if (language !== 'ENGLISH') {
					$scope.dialog.modalOptions.value.checkboxItems.push({
						checked: false,
						text: language
					});
				}
			});
		}

		function populateDialogWithCategories(categories){
			$scope.dialog.modalOptions.value.checkBoxCategories = [];
			categories.map(function (category){
				$scope.dialog.modalOptions.value.checkBoxCategories.push({
					checked: false,
					text: category.Description,
					item: category
				});
			});
		}

		function showEverything(){
			$scope.loading = false;
			$scope.dialog.modalOptions.value.buttonActive = true;
		}

		const onExport = function (event, info) {
			$scope.dialog.modalOptions.value.buttonActive = false;
			$scope.loading = true;
			$scope.message = $translate.instant('cloud.translation.exportdlg.exportLoadingMessage');
			$scope.selectedLanguages = _.filter(info.value.checkboxItems, function (item) {
				return item.checked;
			});

			const selectedLanguageNames = _.map($scope.selectedLanguages, function (item) {
				return item.text;
			});

			let selectedCategoryBoxes = _.filter(info.value.checkBoxCategories, function (category){
				return category.checked;
			});

			let selectedCategories = _.map(selectedCategoryBoxes, function (category){
				return category.item.Id;
			});

			const filters = {
				untranslated : $scope.dialog.modalOptions.value.untranslated,
				changed : $scope.dialog.modalOptions.value.exportChanged,
				resourceRemark: $scope.dialog.modalOptions.value.resourceRemarkAdded,
				translationRemark: $scope.dialog.modalOptions.value.translationRemarkAdded,
				addCategory: $scope.dialog.modalOptions.value.categoryAdded,
				path: $scope.dialog.modalOptions.value.pathAdded,
				parameterInfo: $scope.dialog.modalOptions.value.parameterInfoAdded,
				categories: selectedCategories
			};

			cloudTranslationImportExportService.exportWithFilter(selectedLanguageNames, filters).then(function (result) {
				$scope.linkActive = true;
				$scope.linkData = result.data;
				const parts = result.data.split('/');
				$scope.fileName = parts[parts.length - 1];
				$scope.loading = false;
			}, function failedExport(err) {
				printFailedText(err);
			});
		};

		function initializeScopeVars() {
			$scope.dialog.modalOptions.value.checkboxItems = [];
			$scope.dialog.buttons[0].fn = onExport;

			$scope.message = $translate.instant('cloud.translation.exportdlg.fetchLanguageLoadingMessage');
			$scope.failed = false;
			$scope.loading = true;
			$scope.linkActive = false;
			$scope.linkData = '';
			$scope.checkboxOptions = {
				flatDesign: false
			};
			$scope.infoText = $translate.instant('cloud.translation.exportdlg.infoText');
			$scope.titleTextConfig = $translate.instant('cloud.translation.exportdlg.titleTextConfig');
			$scope.titleTextLanguages = $translate.instant('cloud.translation.exportdlg.titleTextLanguages');
			$scope.titleTextAdditionalColumns = $translate.instant('cloud.translation.exportdlg.titleTextAdditionalColumns');
			$scope.selectedLanguages = [];
		}

		initializeScopeVars();

		cloudTranslationImportExportService.getLanguages().then(function (response) {
			let languages = _.sortBy(response.data);
			populateDialogWithLanguage(languages);
			// cloudTranslationImportExportService.getResourceCategories().then(function (categories){
			// 	populateDialogWithCategories(categories.data)
			// 	showEverything();
			// });
			populateDialogWithCategories(cloudTranslationImportExportService.resourceCategories);
			showEverything();
		}, function failFetchLanguage(err) {
			printFailedText(err);
		});
	}
})();
