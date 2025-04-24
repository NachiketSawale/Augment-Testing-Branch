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
	var moduleName = 'platform';
	angular.module(moduleName).directive('platformStyleEditor2Directive', ['$timeout', '$translate', function ($timeout, $translate) {

		return {
			templateUrl: 'app/components/style-editor/style-editor2-template.html',
			// template: '<div class="wysiwyg-editor filler">' +
			// 	'<div class="wysiwyg-toolbar">' +
			// 	'<div class="btn-group btn-group-sm">' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.bold') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'bold\')" ng-class="{ active: isBold}"><i class="fa fa-bold"></i></button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.italic') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'italic\')" ng-class="{ active: isItalic}"><i class="fa fa-italic"></i></button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.underline') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'underline\')" ng-class="{ active: isUnderlined}"><i class="fa fa-underline"></i></button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.strikeThrough') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'strikethrough\')" ng-class="{ active: isStrikethrough}"><i class="fa fa-strikethrough"></i></button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.subscript') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'subscript\')" ng-class="{ active: isSubscript}"><i class="fa fa-subscript"></i></button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.superscript') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'superscript\')" ng-class="{ active: isSuperscript}"><i class="fa fa-superscript"></i></button>' +
			// 	'</div>' +
			// 	'<div class="btn-group btn-group-sm">' +
			// 	'<select tabindex="-1" title="' + $translate.instant('platform.wysiwygEditor.font') + '" unselectable="on" class="wysiwyg-select" ng-model="font" ng-options="f for f in editoroptions.fonts" ng-change="setFont()">' +
			// 	'</select>' +
			// 	'</div>' +
			// 	'<div class="btn-group btn-group-sm">' +
			// 	'<select unselectable="on" title="' + $translate.instant('platform.wysiwygEditor.fontSize') + '" tabindex="-1" class="wysiwyg-select" ng-model="fontSize" ng-options="f.size for f in fontSizes" ng-change="setFontSize()">' +
			// 	'</select>' +
			// 	'</div>' +
			// 	'<div class="btn-group btn-group-sm">' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.fontColor') + '" tabindex="-1" colorpicker="rgba" type="button" class="btn btn-default ng-valid ng-dirty wysiwyg-colorpicker wysiwyg-fontcolor" ng-model="fontColor" ng-change="setFontColor()">A</button>'+
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.highlightColor') + '" tabindex="-1" colorpicker="rgba" type="button" class="btn btn-default ng-valid ng-dirty wysiwyg-colorpicker wysiwyg-hiliteColor" ng-model="hiliteColor" ng-change="setHiliteColor()">H</button>'+
			// 	'</div>' +
			// 	'<div class="btn-group btn-group-sm">' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.removeFormatting') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'removeFormat\')" ><i class="fa fa-eraser"></i></button>' +
			// 	'</div>' +
			// 	'<div class="btn-group btn-group-sm">' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.orderedList') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'insertorderedlist\')" ng-class="{ active: isOrderedList}"><i class="fa fa-list-ol"></i></button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.unorderedList') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'insertunorderedlist\')" ng-class="{ active: isUnorderedList}"><i class="fa fa-list-ul"></i></button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.outdent') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'outdent\')"><i class="fa fa-outdent"></i></button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.indent') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'indent\')"><i class="fa fa-indent"></i></button>' +
			// 	'</div>' +
			// 	'<div class="btn-group btn-group-sm">' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.leftJustify') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'justifyleft\')" ng-class="{ active: isLeftJustified}"><i class="fa fa-align-left"></i></button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.centerJustify') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'justifycenter\')" ng-class="{ active: isCenterJustified}"><i class="fa fa-align-center"></i></button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.rightJustify') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'justifyright\')" ng-class="{ active: isRightJustified}"><i class="fa fa-align-right"></i></button>' +
			// 	'</div>' +
			// 	'<div class="btn-group btn-group-sm">' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.code') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'formatblock\', \'pre\')"  ng-class="{ active: isPre}"><i class="fa fa-code"></i></button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.quote') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'formatblock\', \'blockquote\')"  ng-class="{ active: isBlockquote}"><i class="fa fa-quote-right"></i></button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.paragraph') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'insertParagraph\')"  ng-class="{ active: isParagraph}">P</button>' +
			// 	'</div>' +
			// 	'<div class="btn-group btn-group-sm">' +
			// 	'<button ng-show="!isLink" tabindex="-1" title="' + $translate.instant('platform.wysiwygEditor.link') + '" type="button" unselectable="on" class="btn btn-default" ng-click="createLink()"><i class="fa fa-link" ></i> </button>' +
			// 	'<button ng-show="isLink" tabindex="-1" title="' + $translate.instant('platform.wysiwygEditor.unlink') + '" type="button" unselectable="on" class="btn btn-default" ng-click="format(\'unlink\')"><i class="fa fa-unlink"></i> </button>' +
			// 	'<button title="' + $translate.instant('platform.wysiwygEditor.insertImage') + '" tabindex="-1" type="button" unselectable="on" class="btn btn-default" ng-click="insertImage()"><i class="fa fa-picture-o"></i> </button>' +
			// 	'<input title="' + $translate.instant('platform.wysiwygEditor.uploadFile') + '" type="file" id="editorImageUpload" input-file="" ng-model="file" name="upload" ng-change="uploadFile()" onchange="angular.element(this).scope().uploadFile()" style="display: none" />' +
			// 	'</div>' +
			// 	'</div>' +
			// 	'<div ng-blur="action()" contentEditable="{{textareaEditable}}" class="{{textareaClass}} wysiwyg-textarea" rows="{{textareaRows}}" name="{{textareaName}}" required="{{textareaRequired}}" placeholder="{{textareaPlaceholder}}" ng-model="value"></div>' +
			// 	'</div>',
			restrict: 'AE',
			scope: {
				value: '=ngModel',
				textareaHeight: '@textareaHeight',
				textareaName: '@textareaName',
				textareaPlaceholder: '@textareaPlaceholder',
				textareaClass: '@textareaClass',
				textareaRequired: '@textareaRequired',
				textareaId: '@textareaId',
				textareaEditable: '=textareaEditable',
				action: '&',
				editoroptions: '=editoroptions'
			},
			replace: true,
			require: 'ngModel',
			link: function (scope, element, attrs, ngModelController) {

				var textarea = element.find('div.wysiwyg-textarea');

				scope.showBold = {};

				var defaultFonts = [
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

				if (!scope.editoroptions.fonts || scope.editoroptions.fonts.length === 0) {
					scope.editoroptions.fonts = defaultFonts;
					scope.font = scope.editoroptions.fonts[6];
				}

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

				if (attrs.enableBootstrapTitle === 'true' && attrs.enableBootstrapTitle !== undefined) {
					element.find('button[title]').tooltip({container: 'body'});
				}

				textarea.on('keyup mouseup', function () {
					scope.$apply(function readViewText() {
						var html = textarea.html();

						if (html === '<br>') {
							html = '';
						}

						ngModelController.$setViewValue(html);
					});
				});
				scope.isLink = false;

				// Used to detect things like A tags and others that dont work with cmdValue().
				function itemIs(tag) {
					var selection = window.getSelection().getRangeAt(0);
					if (selection) {
						if (selection.startContainer.parentNode.tagName === tag.toUpperCase() || selection.endContainer.parentNode.tagName === tag.toUpperCase()) {
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				}

				// Used to detect things like A tags and others that dont work with cmdValue().
				function getHiliteColor() {
					var selection = window.getSelection().getRangeAt(0);
					if (selection) {
						var style = $(selection.startContainer.parentNode).attr('style');

						if (!angular.isDefined(style)) {
							return false;
						}

						var a = style.split(';');
						for (var i = 0; i < a.length; i++) {
							var s = a[i].split(':');
							if (s[0] === 'background-color') {
								return s[1];
							}
						}
						return '#fff';
					} else {
						return '#fff';
					}
				}

				textarea.on('click keyup focus mouseup', function () {
					$timeout(function () {
						scope.isBold = scope.cmdState('bold');
						scope.isUnderlined = scope.cmdState('underline');
						scope.isStrikethrough = scope.cmdState('strikethrough');
						scope.isItalic = scope.cmdState('italic');
						scope.isSuperscript = itemIs('SUP');// scope.cmdState('superscript');
						scope.isSubscript = itemIs('SUB');// scope.cmdState('subscript');
						scope.isRightJustified = scope.cmdState('justifyright');
						scope.isLeftJustified = scope.cmdState('justifyleft');
						scope.isCenterJustified = scope.cmdState('justifycenter');
						scope.isPre = scope.cmdValue('formatblock') === 'pre';
						scope.isBlockquote = scope.cmdValue('formatblock') === 'blockquote';

						scope.isOrderedList = scope.cmdState('insertorderedlist');
						scope.isUnorderedList = scope.cmdState('insertunorderedlist');

						// scope.fonts.forEach(function (v) { //works but kinda crappy.
						scope.editoroptions.fonts.forEach(function (v) { // works but kinda crappy.
							if (scope.cmdValue('fontname').indexOf(v) > -1) {
								scope.font = v;
								return false;
							}
						});

						scope.fontSizes.forEach(function (v) {
							if (scope.cmdValue('fontsize') === v.value) {
								scope.fontSize = v;
								return false;
							}
						});

						scope.hiliteColor = getHiliteColor();
						element.find('button.wysiwyg-hiliteColor').css('background-color', scope.hiliteColor);

						scope.fontColor = scope.cmdValue('forecolor');
						element.find('button.wysiwyg-fontcolor').css('color', scope.fontColor);

						scope.isLink = itemIs('A');
					}, 10);
				});

				// model -> view
				ngModelController.$render = function () {
					textarea.html(ngModelController.$viewValue);
				};

				// angular.element(document.querySelector('#fileUpload')).on('change', fileUpload);
				scope.format = function (cmd, arg) {
					document.execCommand(cmd, false, arg);
				};

				scope.cmdState = function (cmd) {
					return document.queryCommandState(cmd);
				};

				scope.cmdValue = function (cmd) {
					return document.queryCommandValue(cmd);
				};

				scope.createLink = function () {
					var input = prompt('Enter the link URL');
					if (input && input !== undefined) {
						scope.format('createlink', input);
					}
				};

				scope.uploadFile = function () {
					var element = angular.element(document.querySelector('#editorImageUpload'));
					if (element === undefined) {
						console.log('fileupload control not found');
					} else {
						var file = element[0].files[0];
						if (file === undefined) {
							// handle error?
							console.log('no file specified for upload');
						} else {
							var reader = new FileReader();
							reader.onload = function (res) {
								var content = res.target.result;

								scope.format('insertHTML', '<img src=\"' + content + '\" style=\"width: 50%\" />');
								// scope.format( 'insertImage', content );
							};
							reader.readAsDataURL(file);
						}
					}
				};

				scope.insertImage = function () {
					// in case the cursor is not in the editor place it there :)
					textarea.focus();
					angular.element(document.querySelector('#editorImageUpload')).click();
				};

				scope.setFont = function () {
					scope.format('fontname', scope.font);
				};

				scope.setTable = function () {
					scope.format('table');
				};

				scope.setFontSize = function () {
					scope.format('fontsize', scope.fontSize.value);
				};

				scope.setFontColor = function () {
					scope.format('forecolor', _.padStart(scope.fontColor.toString(16), 7, '#000000'));
				};

				scope.setHiliteColor = function () {
					scope.format('hiliteColor', _.padStart(scope.hiliteColor.toString(16), 7, '#000000'));
				};

				/* step for IE11 and Safari  */
				if (globals.useColorPicker) {
					// disabled Text
					element.find('.wysiwyg-fontlabel').css('display', 'none');

					// replace dropdown-icons
					element.find('#wysiwyg-tb-fontcolor').find('.caret').removeClass('caret').addClass('fa fa-font');
					element.find('#wysiwyg-tb-highlightcolor').find('.caret').removeClass('caret').addClass('fa fa-pencil');
				}

				scope.format('enableobjectresizing', true);
				scope.format('styleWithCSS', true);

				scope.$watch('editoroptions.css', function () {

					if (scope.editoroptions.css) {
						element.append('<style type="text/css">' + scope.editoroptions.css + '</style>');
					}

					if (scope.editoroptions.defaultfont) {
						scope.font = scope.editoroptions.defaultfont;
						scope.setFont();
					}

					// --> done by css
					// if (scope.editoroptions.hideButtons && scope.editoroptions.hideButtons.length > 0) {
					// 	angular.forEach(scope.editoroptions.hideButtons, function(btn) {
					// 		document.getElementById(btn).style.display = 'none';
					// 	});
					// }

				});

			}
		};
	}]);
})(angular);