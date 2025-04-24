(function () {

	'use strict';
	const moduleName = 'cloud.translation';
	angular.module(moduleName).controller('cloudTranslationExportModuleDialogController', CloudTranslationExportModuleDialogController);

	CloudTranslationExportModuleDialogController.$inject = ['$scope', 'cloudDesktopModuleService', '_', '$translate', 'platformGridAPI', '$timeout', 'platformTranslateService', 'cloudTranslationImportExportService'];

	function CloudTranslationExportModuleDialogController($scope, cloudDesktopModuleService, _, $translate, platformGridAPI, $timeout, platformTranslateService, cloudTranslationImportExportService) {

		$scope.selectedItem = null;

		$scope.selectItem = function (item){
			$scope.selectedItem = item;
			$scope.moduleExportStr = JSON.stringify($scope.moduleExport[$scope.selectedItem.id], null, ' ');
		};

		$scope.jsonEditorOptions = {
			lineWrapping:  true,
			lineNumbers:  true,
			singleLine: false,
			lint: false,
			showHint: false,
			readOnly: true,
			height: 'auto',
			mode: {
				name: 'javascript',
				json: true,
				statementIndent: 4
			},
			indentWithTabs: true,
			tabSize: 4
		};

		$scope.loading = true;
		$scope.selectedModules = $scope.dialog.modalOptions.value.selectedModules;
		$scope.loadingMessage = $translate.instant('cloud.translation.exportModuleDlg.spinnerMsg');
		$scope.moduleExport = {};
		$scope.moduleExportStr = '';
		$scope.loadingDoneCount = 0;
		$scope.nameProperty = 'displayName';
		$scope.words = {
			availableModules: $translate.instant('cloud.translation.exportModuleDlg.availableModules'),
			selectedModules: $translate.instant('cloud.translation.exportModuleDlg.selectedModules'),
			moduleSelectionHeader: $translate.instant('cloud.translation.exportModuleDlg.moduleSelectionHeader'),
			exportedValueHeader: $translate.instant('cloud.translation.exportModuleDlg.exportedValueHeader')
		};

		_.forEach($scope.selectedModules, (module) => {
			cloudTranslationImportExportService.exportModulesToJson(module.id).then(function (result){
				$scope.loadingDoneCount++;
				_.assign($scope.moduleExport, {[module.id]:result.data});
			}, function (error){
				$scope.loadingDoneCount++;
				let info = {
					message: 'Export Failed!!!',
					moduleId: module.id,
					error: error.data
				};
				_.assign($scope.moduleExport, {[module.id]:info});
			});
		});

		$scope.$watch('loadingDoneCount', function (){
			if($scope.loadingDoneCount === $scope.selectedModules.length){
				$scope.loading = false;
				$scope.loadingDoneCount = 0;
				if($scope.selectedModules.length > 0){
					$scope.selectItem($scope.selectedModules[0]);
				}
			}
		});

		$scope.$on('$destroy', function () {
			$scope.loadingDoneCount = 0;
		});
	}

})();