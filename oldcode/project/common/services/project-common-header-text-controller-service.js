/**
 * Created by shen on 10/21/2022
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectCommonHeaderTextControllerService
	 * @description provides validation methods for project common headerText entities
	 */
	angular.module('platform').factory('projectCommonHeaderTextControllerService', platformGridControllerService);

	platformGridControllerService.$inject = ['_', '$sce', 'platformGridAPI'];

	function platformGridControllerService(_, $sce, platformGridAPI) {

		let service = {};

		service.initFormattedTextController = function initFormattedTextController($scope, dataService) {
			// wysiwyg editor
			// define the possible text functions
			$scope.richTextToolbar = [
				['imageFile', 'fontName', 'fontSize', 'quote', 'bold', 'italics', 'underline', 'redo', 'undo', 'clear',
					'justifyLeft', 'justifyCenter', 'justifyRight', 'insertImage', 'insertLink']
			];
			$scope.trustAsHtml = $sce.trustAsHtml;
			$scope.imageDataUrl = 'from control';
			$scope.textareaEditable = false;
			$scope.data = {
				currentContent: '',
				currentTextItem: dataService.getSelected()
			};

			$scope.$watch('data.currentTextItem', function(newItem/* , oldItem */) {
				$scope.textareaEditable = newItem !== null;
				$scope.data.currentContent = newItem !== null ? newItem.Content : '';
			});

			// update changes to currentItem
			let selectedChanged = function selectedChanged(e, item) {
				$scope.data.currentTextItem = item ? item : null;
			};

			// React on changes only in case of a blur, i.e. the control loses the focus
			$scope.onBlur = function () {
				let currentContent = _.get($scope, 'data.currentContent');
				if ($scope.data.currentTextItem) {
					$scope.data.currentTextItem.Content = currentContent;
				}

				// content really changed? // TODO:
				// if (currentContent !== ) {
				dataService.onTextChanged();
				// }
			};

			selectedChanged(null, $scope.data.currentTextItem);

			dataService.registerSelectionChanged(selectedChanged);

			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(selectedChanged);
			});

		};

		service.initPlainTextController = function initPlainTextController($scope, dataService) {
			$scope.trustAsHtml = $sce.trustAsHtml;
			$scope.currentItem = dataService.getSelected();

			$scope.onTextChanged = function onTextChanged() {
				dataService.onTextChanged();
			};

			// inactive current editor, then the current row can be selected.
			$scope.commitEdit = function commitEdit() {
				platformGridAPI.grids.commitEdit($scope.gridId);
			};

			$scope.textEditorOptions = {
				options: {
					subtype: 'remark'
				},
				validationMethod: function (/* model, value */) {
				},
				actAsCellEditor: false
			};

			// update changes to currentItem
			let selectedChanged = function selectedChanged(e, item) {
				$scope.currentItem = item && item.Id ? item : {ContentString: '', PlainText: ''};
				$scope.rt$readonly = !item;
			};

			selectedChanged(null, $scope.currentItem);

			dataService.registerSelectionChanged(selectedChanged);

			$scope.$on('$destroy', function () {
				dataService.unregisterSelectionChanged(selectedChanged);
			});
		};

		return service;
	}
})();
