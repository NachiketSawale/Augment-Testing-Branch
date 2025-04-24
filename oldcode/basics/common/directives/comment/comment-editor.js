/**
 * Created by wui on 1/12/2015.
 */

(function (angular, global, doc) {
	'use strict';

	/* jshint -W072 */
	angular.module('basics.common').directive('basicsCommonCommentEditor', [
		'keyCodes',
		'platformModalService',
		'$rootScope',
		'$sce',
		'basicsCommonFileUploadServiceLocator',
		'basicsCommonCommentDataServiceFactory',
		'PlatformMessenger',
		'basicsLookupdataPopupService',
		'$translate',
		'basicsCommonEditorHelperService',
		'globals',
		'$',
		function (
			keyCodes,
			platformModalService,
			$rootScope,
			$sce,
			basicsCommonFileUploadServiceLocator,
			basicsCommonCommentDataServiceFactory,
			PlatformMessenger,
			basicsLookupdataPopupService,
			$translate,
			editorHelperService,
			globals,
			$) {

			return {
				restrict: 'A',
				scope: {
					submit: '&',
					init: '&',
					maxLength: '@',
					statusOptions: '='
				},
				require: 'ngModel',
				templateUrl: globals.appBaseUrl + 'basics.common/templates/comment-editor.html',
				link: function (scope, element, attrs, ngModel) {

					scope.config = {
						options: scope.statusOptions
					};
					// var uploadServiceKey = basicsCommonCommentDataServiceFactory.getUploadServiceKey(),
					// fileUploadService = basicsCommonFileUploadServiceLocator.getService(uploadServiceKey);
					const textarea = element.find('.comment-text-area');
					const popupHelper = basicsLookupdataPopupService.getToggleHelper();

					scope.onMouseDown = function (event) {
						// prevent lost focus when click tool button.
						event.preventDefault();
					};

					scope.format = function (cmd, arg) {
						if (!doc.execCommand(cmd, false, arg)) {
							// fail to execute command
							if (cmd === 'insertHTML') {
								// IE don't support command 'insertHTML'
								pasteHtmlAtCaret(arg);
							}
						}
						applyViewValue();
					};

					scope.insertLink = function () {
						textarea.focus(); // focus text area to make it work.
						const tipText = $translate.instant('basics.common.enterLinkUrl');
						const input = prompt(tipText);
						if (input) {
							if (input.indexOf('https://') !== 0 && input.indexOf('http://') !== 0) {
								scope.format('insertHTML', '<a href="http://' + input + '" target = "_blank" >' + input + '</a>');
							} else {
								scope.format('insertHTML', '<a href="' + input + '" target = "_blank" >' + input + '</a>');
							}
						}
					};

					scope.insertImage = function () {
						const fileElement = angular.element('<input type="file" />');

						const fileFilter = '.emf, .gif, .bmp, .jpg, .png, .jpeg';
						fileElement.attr('accept', fileFilter);

						textarea.focus(); // focus text area to make it work.
						fileElement.bind('change', onAddImage);
						fileElement.click();

						function onAddImage(event) {
							if (event && event.target.files.length > 0) {
								const file = event.target.files[0],
									fileName = file.name,
									suffix = fileName.substr(fileName.lastIndexOf('.'), fileName.length - 1).toLocaleLowerCase();

								if (fileFilter && fileFilter.indexOf(suffix) !== -1) {
									const reader = new FileReader();
									reader.onload = function () {
										scope.format('insertHTML', '<img class="comment-image" alt="" src="' + reader.result + '" title="' + fileName + '" >');
									};
									reader.readAsDataURL(file);
								}
							}
						}
					};

					scope.insertEmotion = function () {
						const btn = element.find('.comment-emotion-btn');
						const popup = popupHelper.toggle({
							focusedElement: btn,
							relatedTarget: btn,
							scope: scope.$new(true),
							templateUrl: globals.appBaseUrl + 'basics.common/templates/emotion-view.html',
							controller: 'basicsCommonEmotionController',
							plainMode: true,
							hasDefaultWidth: false
						});

						if (popup) {
							popup.result.then(function (result) {
								if (result.isOk) {
									textarea.focus(); // focus text area to make it work.
									scope.format('insertHTML', result.value);
								}
							});
						}
					};

					scope.onKeyDown = function (event) {
						switch (event.keyCode) {
							case keyCodes.ENTER: {
								if (event.ctrlKey || event.shiftKey) {
									editorHelperService.addWordWrap(textarea[0]);
								} else {
									if (ngModel.$valid) { // comment is valid.
										scope.submit();
										textarea.empty();
									}
								}
								event.preventDefault();
							}
						}
					};

					scope.onClick = function (event) {
						if ($(event.target).is('img.comment-image')) {
							const modalOptions = {
								width: '800px',
								height: '600px',
								scope: scope,
								template: '<div data-basics-common-image-preview data-image="image" class="flex-element flex-box flex-column overflow-hidden"></div>',
								resizeable: true,
								headerText: $translate.instant('basics.common.button.preview')
							};

							scope.image = event.target;
							platformModalService.showDialog(modalOptions);
							event.stopPropagation();
						}
					};

					scope.invalid = function () {
						return ngModel.$invalid;
					};

					scope.isReadOnly = function () {
						let readonly = false;
						let parentScope = scope.$parent;
						while (parentScope) {
							if (parentScope.isReadOnly) {
								readonly = parentScope.isReadOnly();
								break;
							} else {
								parentScope = parentScope.$parent;
							}
						}
						return readonly;
					};

					scope.isEditable = function () {
						return !scope.isReadOnly();
					};

					scope.isDisabled = function () {
						return scope.isReadOnly();
					};

					// view -> model
					textarea.on('blur keyup change', function () {
						scope.$evalAsync(applyViewValue);
					});

					// model -> view
					ngModel.$render = function () {
						textarea.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
					};

					if (scope.maxLength) {
						const maxLength = parseInt(scope.maxLength);
						// comment validator
						ngModel.$validators.comment = function (modelValue, viewValue) {
							const value = modelValue || viewValue;
							return value && value.length ? value.length <= maxLength : true;
						};
					}

					if (angular.isFunction(scope.init)) {
						scope.init();
					}

					function applyViewValue() {
						$rootScope.safeApply(function readViewText() {
							let html = textarea.html();

							if (html === '<br>') {
								html = '';
							}

							ngModel.$setViewValue(html);
						});
					}
				}
			};

		}
	]);

	/**
	 * This function is similar with "doc.execCommand('insetHTML', false, arg);",
	 * but IE don't support command "insetHTML", so use it instead to get this functionality
	 * work for all browsers.
	 * @param html
	 * @param selectPastedContent
	 */
	function pasteHtmlAtCaret(html, selectPastedContent) {
		let sel, range;
		if (global.getSelection) {
			// IE9 and non-IE
			sel = global.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();

				// Range.CreateContextualFragment() would be useful here but is
				// only relatively recently standardized and is not supported in
				// some browsers(IE(, for one)
				const el = doc.createElement('div');
				el.innerHTML = html;
				let frag = doc.createDocumentFragment(), node, lastNode;
				while ((node = el.firstChild)) {
					lastNode = frag.appendChild(node);
				}
				const firstNode = frag.firstChild;
				range.insertNode(frag);

				// Preserve the selection
				if (lastNode) {
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					if (selectPastedContent) {
						range.setStartBefore(firstNode);
					} else {
						range.collapse(true);
					}
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
		} else if ((sel = doc.selection) && sel.type !== 'Control') {
			// IE < 9
			const originalRange = sel.createRange();
			originalRange.collapse(true);
			sel.createRange().pasteHTML(html);
			if (selectPastedContent) {
				range = sel.createRange();
				range.setEndPoint('StartToStart', originalRange);
				range.select();
			}
		}
	}

})(angular, window, document);
