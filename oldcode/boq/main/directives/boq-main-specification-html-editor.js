/**
 * Created by reimer on 03.01.2017
 */
(function () {

	/* global _ */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name
	 * @description
	 */
	angular.module('boq.main').directive('boqMainSpecificationHtmlEditor', ['boqMainSpecificationControllerService','$rootScope','$','boqMainTextComplementHelperService', 'cloudDesktopUserfontService', 'platformEditorService', 'platformDialogService', '$q',
		function (boqMainSpecificationControllerService, $rootScope, $, textComplementHelperService, cloudDesktopUserfontService, platformEditorService, platformDialogService, $q) {
			var template = [];
			template += '<platform-Editor ';
			template +=    'id="" ';
			template +=    'show-toolbar="' + (!boqMainSpecificationControllerService.isForcedPlaintextForBoqSpecifications()).toString() + '" ';
			template +=    'textarea-id="htmlEditor" ';
			template +=    'textarea-class="" ';
			template +=    'textarea-name="specificationHtmlEditor" ';
			template +=    'textarea-height="100%" ';
			template +=    'textarea-required ';
			template +=    'data-ng-model="entity.Content" ';
			template +=    'enable-bootstrap-title="true" ';
			template +=    'textarea-editable="editable" ';
			template +=    'data-editoroptions="options" ';
			template +=    'data-action="onBlur()"';
			template +=    'data-entity="entity.Id"';

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
						else if($rootScope.currentModule ==='estimate.main'){
							element.contentEditable = false;
							return false;
						}
					}
					return true;
				}


				scope.options.canAddTextComplement = function() {
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
					// More than one 'ql-editor' element might be in the DOM.  
					function isChildOfBoqMainSpecificationController(editorElement) {
						var isExpected = false;

						if (editorElement) {
							var element = editorElement;
							while (!isExpected && element.parentElement) {
								if (element.id === 'boqMainSpecificationController') {
									isExpected = true;
								}
								element = element.parentElement;
							}
						}

						return isExpected;
					}

					const editorElements = _.filter(document.getElementsByClassName('ql-editor'), function(editorElement) { return isChildOfBoqMainSpecificationController(editorElement); }); 
					if (editorElements.length === 1) {
						scope.entity.Content = editorElements[0].innerHTML;
					}
				}

				function adjustContent() {
					scope.entity.Content = textComplementHelperService.adjustHtmlContent(scope.entity.Content);
					_isDirty = false;
				}

				// handle input of printable characters and paste
				element.on('keypress paste', function(e) {
					if (!canEditHtmlContent()) {

						e.preventDefault();
					}
				});

				element.on('paste', function(e) {
					if (boqMainSpecificationControllerService.isForcedPlaintextForBoqSpecifications()) {
						document.execCommand('insertText', false, e.originalEvent.clipboardData.getData('text/plain'));
						e.preventDefault();
					}

					if (boqMainSpecificationControllerService.isOenBoq()) {
						platformDialogService.showInfoBox('Das Einfügen von Text ist in einem ÖNORM-LV derzeit nicht möglich.');
						e.preventDefault();
					}
				});

				element.on('click', function (e) {
					if (angular.element(e.relatedTarget).parents('.wysiwyg-toolbar').length >= 1) {
						updateEntity();
					}

					if ($rootScope.currentModule === 'estimate.main'){

						let toolbars = element.find('.ql-toolbar');
						if(toolbars){
							$('.ql-toolbar').remove();
						}
					}
				});

				angular.element(element[0]).find('.wysiwyg-toolbar').children().bind('click', function () {
					updateEntity();
				});

				element.bind('keydown click', function(e) {
					if ([8,45].includes(e.keyCode)) // backspace/delete key
					{
						if (!canEditHtmlContent()) {
							e.preventDefault();
						}
					}

					// Disables tools when cursor is in a textcomplement
					if (scope.isOenBoq) {
						const canEdit = canEditHtmlContent() && !_.some(window.getSelection().getRangeAt(0).cloneContents().childNodes, function(child) { return child.outerHTML && child.outerHTML.includes('<textcomplement'); });
						var toolbars = element.find('.ql-toolbar');
						if (_.some(toolbars)) {
							_.forEach(_.filter(toolbars[0].childNodes, {className:'ql-formats'}), function(tool) {
								var button = _.find(tool.childNodes, function(child) { return ['button'].includes(child.type); });
								if (button) {
									button.disabled = !canEdit;
								}
							});
						}
					}
				});

				scope.onBlur = function() {
					if (_isDirty) {
						angular.noop();
					}
				};

				// In OENORM the formatting is restricted, therefor the toolbar must be reduced
				scope.$on('boq-loaded', function(event, isOenBoq) {

					scope.isOenBoq = isOenBoq;
					const oenTools = ['bold','italic','underline','header','script','list']; // 'script'==='subscript','superscript' 'list'==='orderedlist','unorderedlist'

					var toolbars = element.find('.ql-toolbar');
					if (_.some(toolbars)) {
						_.forEach(_.filter(toolbars[0].childNodes, {className:'ql-formats'}), function(tool) {
							var child = _.find(tool.childNodes, function(child) { return ['button','select-one'].includes(child.type); });
							if (isOenBoq) {
								if (!child || !oenTools.includes(child.className.substring(3))) {
									element.find(tool).hide();
								}
							}
							else {
								element.find(tool).show();
								if (child && child.disabled) {
									child.disabled = false; // might be disabled before in OENORM context
								}
							}
						});
					}
				});

				// entity was changed -> prepare content
				scope.$watch('entity.Id', function () {
					adjustContent();
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
						getTextarea().focus();
						platformEditorService.insertHtmlAtCurrentCursorPos('specificationHtmlEditor', newVal);
						updateEntity();
						scope.addTextComplement = null; // must clear value - otherwise watch will not be fired after next insertion of a text complement
						_isDirty = true;
					}
				});

				scope.$watch('selectTextComplement', function(markLblValue) {
					if (markLblValue && !_.isEmpty(scope.entity.Content)) {
						getTextarea().focus();
						var status = {};
						walkTheDOM(getMainDiv(), function (node) {
							if (node.nodeName.toLowerCase() === 'textcomplement') {
								for (var i=0; i<node.attributes.length; i++) {
									if (node.attributes[i].name.toLowerCase()==='marklbl' && node.attributes[i].value===markLblValue.toString()) {
										var startNode = node;
										var range = document.createRange();
										range.setStart(startNode, 0);
										range.setEnd(startNode, startNode.childNodes.length);
										var sel = window.getSelection();
										sel.removeAllRanges();
										sel.addRange(range);
										startNode.parentElement.scrollIntoView();
										status.cancel = true;
									}
								}
							}

						}, status);
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
})();
