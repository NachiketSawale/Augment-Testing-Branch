(function (angular) {
	/* global _ */
	'use strict';

	// TODO this function copy from boqMainSpecificationHtmlEditor
	/**
	 * @ngdoc directive
	 * @name
	 * @description
	 */
	angular.module('procurement.common').directive('prcCommonItemSpecificationPlainHtmlEditor', ['boqMainSpecificationControllerService', 'boqMainTextComplementHelperService', 'cloudDesktopUserfontService', 'platformEditorService', '$q',
		function (boqMainSpecificationControllerService, textComplementHelperService, cloudDesktopUserfontService, platformEditorService, $q) {
			var template = [];
			template += '<platform-Editor ';
			template +=    'id="" ';
			template +=    'show-toolbar="' + (!boqMainSpecificationControllerService.isForcedPlaintextForBoqSpecifications()).toString() + '" ';
			template +=    'textarea-id="htmlEditor" ';
			template +=    'textarea-class="" ';
			template +=    'textarea-name="itemSpecificationPlainHtmlEditor" ';
			template +=    'textarea-height="100%" ';
			template +=    'textarea-required ';
			template +=    'data-ng-model="entity.Content" ';
			template +=    'enable-bootstrap-title="true" ';
			template +=    'textarea-editable="editable" ';
			template +=    'data-editoroptions="options" ';
			template +=    'data-action="onBlur()"';
			template += '/>';

			return {
				restrict: 'A',
				scope: {
					ngModel: '=',
					ngChange: '&',
					entity: '=',
					addTextComplement: '=', // changes force directive to add a text complement at the current pos
					selectTextComplement: '=',
					editable: '=',
					options: '='
				},
				template: template,
				link: linker
			};

			function linker(scope, element) {

				function getTextarea() {
					return element.find('div.ql-editor');
				}

				function getMainDiv() {
					return getTextarea()[0];
				}

				var _isDirty = false;

				function canEditHtmlContent() {
					var element = window.getSelection().getRangeAt(0).startContainer;
					while (element.parentNode) {
						element = element.parentNode;
						if (element.localName === 'textcomplement') {
							return false;
						}
					}
					return true;
				}

				scope.options.canAddTextComplement = function () {
					return canEditHtmlContent();
				};

				function walkTheDOM(node, func, status) {
					func(node);
					node = node.firstChild;
					while (node && !status.cancel) {
						walkTheDOM(node, func, status);
						node = node.nextSibling;
					}
				}

				function updateEntity() {
					scope.entity.Content = document.getElementsByClassName('ql-editor')[0].innerHTML;
				}

				function adjustContent() {
					scope.entity.Content = textComplementHelperService.adjustHtmlContent(scope.entity.Content);
					_isDirty = false;

				}

				// handle input of printable characters and paste
				element.on('keypress paste', function (e) {
					if (!canEditHtmlContent()) {
						e.preventDefault();
					}
				});

				element.on('paste', function (e) {
					if (boqMainSpecificationControllerService.isForcedPlaintextForBoqSpecifications()) {
						document.execCommand('insertText', false, e.originalEvent.clipboardData.getData('text/plain'));
						e.preventDefault();
					}
				});

				element.on('click', function (e) {
					if (angular.element(e.relatedTarget).parents('.wysiwyg-toolbar').length >= 1) {
						updateEntity();
					}
				});

				angular.element(element[0]).find('.wysiwyg-toolbar').children().bind('click', function () {
					updateEntity();
				});

				// handle backspace, delete keys
				element.bind('keydown click', function (e) {
					if ([8, 46].includes(e.keyCode)) // backspace/delete key
					{
						if (!canEditHtmlContent()) {
							e.preventDefault();
						}
					}

					// Disables tools when cursor is in a textcomplement
					if (scope.isOenBoq) {
						const canEdit = canEditHtmlContent() && !_.some(window.getSelection().getRangeAt(0).cloneContents().childNodes, function (child) {
							return child.outerHTML && child.outerHTML.includes('<textcomplement');
						});
						var toolbars = element.find('.ql-toolbar');
						if (_.some(toolbars)) {
							_.forEach(_.filter(toolbars[0].childNodes, {className: 'ql-formats'}), function (tool) {
								var button = _.find(tool.childNodes, function (child) {
									return ['button'].includes(child.type);
								});
								if (button) {
									button.disabled = !canEdit;
								}
							});
						}
					}
				});

				scope.onBlur = function () {
					if (_isDirty) {
						angular.noop();
					}
				};

				// entity was changed -> prepare content
				scope.$watch('entity.Id', function () {
					adjustContent();
					// _suppressOnChangedEvent = true;
				});

				// need watch for entity since binding does not properly work!
				scope.$watch('entity', function (newValue, oldValue) {
					if (newValue.Id === oldValue.Id && newValue.Version === oldValue.Version && (newValue.Content || '') !== (oldValue.Content || '')) {
						_isDirty = true;
						if (scope.ngChange) {
							scope.ngChange();
						}
					}
				}, true);

				scope.$watch('addTextComplement', function (newVal) {
					if (newVal) {
						// _textElement.focus();
						getTextarea().focus();
						// document.execCommand('insertHTML', false, addAttributes(newVal) + '&nbsp;');  // add space to allow editing past complement
						platformEditorService.insertHtmlAtCurrentCursorPos('specificationHtmlEditor', newVal);
						updateEntity();

						scope.addTextComplement = null; // must clear value - otherwise watch will not be fired after next insertion of a text complement
						_isDirty = true;
					}
				});

				scope.$watch('selectTextComplement', function (newVal) {
					if (newVal) {
						if (scope.entity.Content !== null && scope.entity.Content.length > 0) {
							var parts = newVal.split('|');
							var searchText = (parts[0] + '\'' + parts[1] + '\'' + parts[2]).replace(/\s+|\n|\r/g, '');   // remove spaces
							// _textElement.focus();
							getTextarea().focus();
							var status = {};
							// walkTheDOM(_mainDiv, function (node) {
							walkTheDOM(getMainDiv(), function (node) {
								// console.log( node.nodeName + ': ' + node.nodeValue);
								// if (node.nodeValue !== null && node.nodeValue.indexOf(newVal) !== -1) {
								if (node.nodeName.toLowerCase() === 'textcomplement' && node.innerText.replace(/\s+|\n|\r/g, '') === searchText) {
									var startNode = node;
									var range = document.createRange();
									range.setStart(startNode, 0);
									// range.setEnd(startNode, startNode..innerText.length);
									range.setEnd(startNode, startNode.childNodes.length);
									var sel = window.getSelection();
									sel.removeAllRanges();
									sel.addRange(range);
									startNode.parentElement.scrollIntoView();
									status.cancel = true;
								}

							}, status);
						}
					}
				});

				// #region setup html editor

				// override default values with user specific values
				function loadUserfonts() {

					var p1 = cloudDesktopUserfontService.loadData();
					var p2 = cloudDesktopUserfontService.loadCSS();
					$q.all([p1, p2]).then(function () {

						var css = cloudDesktopUserfontService.getCSS();
						if (css && css.length > 0) {
							scope.options.css = css;
						}

						var fonts = cloudDesktopUserfontService.getList();
						if (fonts && fonts.length > 0) {
							scope.options.fonts = fonts;
							scope.options.font = scope.options.fonts[0];
						}
					});
				}

				loadUserfonts();

				// #endregion
			}
		}
	]);

})(angular);
