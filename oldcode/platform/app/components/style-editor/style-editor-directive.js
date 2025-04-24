/**
 *
 used to show sample text style

 options
 textarea-id            The id to assign to the editable div
 textarea-class            The class(es) to assign to the the editable div
 textarea-height            If not specified in a text-area class then the hight of the editable div (default: 80px)
 textarea-name            The name attribute of the editable div
 textarea-required        HTML/AngularJS required validation
 ng-model                The angular data model
 style-handle="styleHandle"     catch the style

 enable-bootstrap-title    True/False whether or not to show the button hover title styled with bootstrap

 Requires:
 Twitter-bootstrap, fontawesome, jquery, angularjs, bootstrap-color-picker (https://github.com/buberdds/angular-bootstrap-colorpicker)


 usage example:
 <div data-text-style-editor textarea-id="itemTextHtmlEditor" textarea-class="cell-center"                             textarea-name="textareaQuestion"
 textarea-height="160px"
 ng-model="sampleText"
 style-handle="styleHandle"
 enable-bootstrap-title="true"
 data-ng-disable="true"
 id="textSampleArea"
 >
 </div>

 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platform.directive:  StyleEditor,  data-platform-style-editor-directive
	 * @element div
	 * @restrict A
	 * @description
	 *
	 */
	var moduleName = 'platform';
	// angular.module('procurement.pricecomparison', ['colorpicker.module']).directive('textStyleEditor', ['$timeout',
	angular.module(moduleName).directive('platformStyleEditorDirective', ['globals', '_', '$timeout', function (globals, _, $timeout) {

		var directive = {
			restrict: 'A',
			scope: {
				value: '=ngModel',
				textareaHeight: '@textareaHeight',
				textareaName: '@textareaName',
				textareaPlaceholder: '@textareaPlaceholder',
				textareaClass: '@textareaClass',
				textareaRequired: '@textareaRequired',
				textareaId: '@textareaId',
				action: '&',
				styleHandle: '=',
				customTemplate: '='
			},
			replace: true,
			require: 'ngModel',
			templateUrl: function (elem, attrs) {
				var path = attrs.customTemplate ? attrs.customTemplate : 'app/components/style-editor/style-editor-template.html';

				return globals.appBaseUrl + path;
			},
			link: linkFunction
		};

		var handleStyle = {
			toggleState: {},

			// simulate toggle two functions in jquery
			toggle: function (name, func1, func2) {
				var caller = this;
				if (angular.isUndefined(caller.toggleState[name])) {
					caller.toggleState[name] = 1;
				}
				if (caller.toggleState[name]) {
					func1.apply(null, arguments);
				} else {
					func2.apply(null, arguments);
				}
				caller.toggleState[name] = !(caller.toggleState[name]);

			},
			initialSampleText: function (elementTextArea, initStyle) {
				elementTextArea.html('<span style="' + initStyle + '">' + elementTextArea.html() + '</span>');
			}
		};

		function linkFunction(scope, element, attrs, ngModelController) {
			var textarea = element.find('div.wysiwyg-textarea');

			scope.styleHandle = scope.styleHandle || {};

			// wrap the text with <span> once the angular link is finished
			$timeout(function () {
				// pass the initial styleHandle
				scope.textStyle = handleStyle.initialSampleText(textarea, scope.styleHandle.initStyle || '');
			});

			scope.fonts = [
				'Georgia',
				'Palatino Linotype',
				'Times New Roman',
				'Arial',
				'Helvetica',
				'Arial Black',
				'Comic Sans MS',
				'Impact',
				'Lucida Sans Unicode',
				'Tahoma',
				'Trebuchet MS',
				'Verdana',
				'Courier New',
				'Lucida Console',
				'Helvetica Neue'
			].sort();

			scope.font = scope.fonts[6];

			scope.fontSizes = [
				{
					value: '1',
					size: '10px'
				},
				{
					value: '2',
					size: '13px'
				},
				{
					value: '3',
					size: '16px'
				},
				{
					value: '4',
					size: '18px'
				},
				{
					value: '5',
					size: '24px'
				},
				{
					value: '6',
					size: '32px'
				},
				{
					value: '7',
					size: '48px'
				}
			];

			scope.fontSize = scope.fontSizes[1];

			$timeout(function () {
				if (attrs.enableBootstrapTitle === 'true') {
					element.find('[title]').tooltip({
						container: 'body',
						template: '<div class="tooltip textEditor" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
					});
				}
			}, 50);

			// model -> view
			ngModelController.$render = function () {
				/*
					in workflow-sidebar we have the case that we have a span already in div
				 */
				if (textarea.children('span').length > 0) {
					textarea.children('span').html(ngModelController.$viewValue);
				} else {
					textarea.html(ngModelController.$viewValue);
				}
			};
			scope.isLink = false;

			// format('bold', 'font-weight');
			scope.format = function (cmd, arg, event) {
				toggleStyle(arg, cmd);
				// set class active
				var element = event.target.nodeName === 'I' ? angular.element(event.target).parent() : angular.element(event.target);
				element.toggleClass('active');
			};

			// can call this method from parent controller by using: styleHandle.setEditorStyle()
			scope.styleHandle.setEditorStyle = function (strStyle) {
				getSpanElement().attr('style', strStyle);
			};

			function getSpanElement() {
				return textarea.find('span:first-child');
			}

			// set the css string after click the toolbar icon
			function setCssString() {
				var strCurrentStyle = getSpanElement().attr('style');
				// call back to update parent scope's data
				if (angular.isFunction(scope.styleHandle.updateStyleCallback)) {
					scope.styleHandle.updateStyleCallback.apply(null, [strCurrentStyle]);
				}
				return strCurrentStyle;
			}

			function toggleStyle(property, value) {

				handleStyle.toggle(property,
					function () {
						getSpanElement().css(property, value);
					}, function () {
						getSpanElement().css(property, '');
					});
				setCssString();
			}

			scope.setFont = function () {
				getSpanElement().css('font-family', scope.font);
				setCssString();
			};

			scope.setFontSize = function () {
				getSpanElement().css('font-size', scope.fontSize.size);
				setCssString();
			};

			scope.setFontColor = function () {
				// scope.format('forecolor', scope.fontColor);
				getSpanElement().css('color', _.padStart(scope.fontColor.toString(16), 7, '#000000'));
				setCssString();
			};

			scope.setHiliteColor = function () {
				// scope.format('hiliteColor', scope.hiliteColor);
				getSpanElement().css('background-color', _.padStart(scope.hiliteColor.toString(16), 7, '#000000'));
				setCssString();
			};

			scope.removeAllStyles = function () {
				getSpanElement().attr('style', '');
				setCssString();
			};
		}

		return directive;
	}]);
})(angular);