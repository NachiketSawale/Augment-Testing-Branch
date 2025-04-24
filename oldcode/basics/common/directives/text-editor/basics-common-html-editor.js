/**
 * Created by chi on 12.05.2022
 */
(function (angular) {
	'use strict';

	let moduleName = 'basics.common';

	angular.module(moduleName).directive('basicsCommonHtmlEditor', basicsCommonHtmlEditor);

	basicsCommonHtmlEditor.$inject = ['$timeout', 'basicsCommonTextEditorInsertTextService'];

	function basicsCommonHtmlEditor($timeout, basicsCommonTextEditorInsertTextService) {

		let template = [
			'<platform-Editor textarea-id="headerTextEditor" textarea-class="" ',
			'textarea-name="name" ',
			'textarea-height="100%" ',
			'textarea-required ',
			'data-ng-model="entity[field]" ',
			'enable-bootstrap-title="true" ',
			'textarea-editable="editable"/>'
		].join(' ');

		let arrowKeyCodes = [37, 38, 39, 40];
		return {
			restrict: 'A',
			scope: {
				onChange: '&',
				entity: '=',
				editable: '=',
				name: '@',
				editorOptions: '=',
				field: '@'
			},
			template: template,
			link: linker
		};

		function linker(scope, element) {
			scope.editoroptions = scope.editorOptions;
			let handler = basicsCommonTextEditorInsertTextService.getHtmlHandler({
				prefix: '<<',
				suffix: '>>',
				maxSearchLength: 300
			});

			element.on('keydown', function (event) {
				if (event.keyCode === 46) {
					handler.setDeleteRange('delete');
				} else if (event.keyCode === 8) {
					handler.setDeleteRange('backspace');
				}
			});

			element.on('keyup', function (event) {
				$timeout(function () {

					let keyArrow = null;
					if (arrowKeyCodes.indexOf(event.keyCode) > -1) {
						if (event.keyCode === 37) {
							keyArrow = 'right';
						} else if (event.keyCode === 39) {
							keyArrow = 'left';
						}

						handler.setRange(keyArrow);
					}
				});
			});

			element.on('mouseup', function () {
				$timeout(function () {
					handler.setRange(null);
				});
			});
		}
	}
})(angular);