/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.textmodules';

	angular.module(moduleName).controller('basicsTextModulesPlainTextController', basicsTextModulesPlainTextController);

	basicsTextModulesPlainTextController.$inject = ['$scope', '$q', 'basicsTextModulesTextDataService', 'basicsTextModulesTextControllerService',
		'basicsCommonTextFormatConstant',
		'basicsCommonTextEditorInsertTextService',
		'basicsTextModulesMainService',
		'$timeout'];

	function basicsTextModulesPlainTextController($scope, $q, dataService, controllerService,
		basicsCommonTextFormatConstant,
		basicsCommonTextEditorInsertTextService,
		basicsTextModulesMainService,
		$timeout) {

		// grid controller service.
		let uuid = '0d25e7c5b52b4d3cb324fdd2686086b4';
		let arrowKeyCodes = [37, 38, 39, 40];
		$scope.contentField = 'TextClob';
		$scope.textFormatType = basicsCommonTextFormatConstant.html;
		$scope.isVariableVisible = true;

		let handler = basicsCommonTextEditorInsertTextService.getHandler({
			textFormat: $scope.textFormatType,
			elementName: 'textModulePlainText',
			prefix: '<<',
			suffix: '>>',
			maxSearchLength: 300
		});

		$scope.onVariableChanged = onVariableChanged;
		$scope.onKeyDown = onKeyDown;
		$scope.onKeyUp = onKeyUp;
		$scope.onMouseUp = onMouseUp;

		// init $scope.
		controllerService.initController($scope, dataService, uuid);

		function onVariableChanged(variableId, itemOptions) {
			let parentItem = basicsTextModulesMainService.getSelected();

			if (parentItem && $scope.textFormatType === parentItem.TextFormatFk && variableId > 0 && itemOptions && itemOptions.value && $scope.textareaEditable) {
				let item = itemOptions.value;
				let temp = $scope.translation && $scope.translation.TextClob ? {PlainText: $scope.translation.TextClob.Content} : {};
				handler.insertText(temp, item.Code);

				if ($scope.translation && $scope.translation.TextClob) {
					$scope.translation.TextClob.Content = temp.PlainText;
				}
				dataService.markItemAsModified($scope.translation);
				$scope.oldContent = angular.copy($scope.translation[$scope.contentField]);
			}
		}

		function onKeyDown(event) {
			if (event.keyCode === 46) {
				handler.setDeleteRange('delete');
			} else if (event.keyCode === 8) {
				handler.setDeleteRange('backspace');
			}
		}

		function onKeyUp(event) {
			$timeout(function () {
				if (arrowKeyCodes.indexOf(event.keyCode) > -1) {
					var keyArrow = null;
					if (event.keyCode === 37) {
						keyArrow = 'right';
					}
					else if (event.keyCode === 39) {
						keyArrow = 'left';
					}
					handler.setRange(keyArrow);
				}
			});
		}

		function onMouseUp() {
			$timeout(function () {
				handler.setRange(null);
			});
		}
	}

})(angular);