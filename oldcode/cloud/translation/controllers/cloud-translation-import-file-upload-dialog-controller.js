/**
 * Created by aljami on 20.12.2019.
 */
(function () {

	'use strict';
	const moduleName = 'cloud.translation';

	/**
	 * @ngdoc controller
	 * @name cloudTranslationImportFileUploadDialogController
	 * @function
	 *
	 * @description
	 * Controller for the export translation dialog
	 **/
	angular.module(moduleName).controller('cloudTranslationImportFileUploadDialogController', cloudTranslationImportFileUploadDialogController);

	cloudTranslationImportFileUploadDialogController.$inject = ['$scope', '$element', '$timeout', '_', 'platformGridAPI', 'cloudTranslationWizardService'];

	function cloudTranslationImportFileUploadDialogController($scope, $element, $timeout, _, platformGridAPI, cloudTranslationWizardService) {

		const uploadBtnDisabled = function () {
			return $scope.uploadBtnDisabled;
		};

		const onClickUploadBtn = function (event, info) {
			$scope.loading = true;
			$scope.showFileUpload = false;
			$scope.uploadBtnDisabled = true;
			cloudTranslationWizardService.showLanguageSelectionDialog($scope.file);
			info.$close(false);
		};

		const onFileSelected = function () {
			$scope.file = $scope.fileElement.files[0];
			$scope.fileName = $scope.fileElement.files[0].name;
			$scope.uploadBtnDisabled = false;
			$timeout(function () {
				$scope.fileElement.focus();
			});
		};

		$scope.dialog.buttons[0].disabled = uploadBtnDisabled;
		$scope.dialog.buttons[0].fn = onClickUploadBtn;
		$scope.uploadBtnDisabled = true;
		$scope.showFileUpload = true;
		$scope.loading = false;
		$scope.languageselection = false;
		$scope.fileElement = $element[0].querySelector('#fileElement');
		$scope.file = null;

		$scope.chooseFile = function (/* event */) {
			$timeout(function () {
				$scope.fileElement.click();
			});
		};

		$element.on('change', function (/* e */) {
			onFileSelected();
		});
	}
})();
