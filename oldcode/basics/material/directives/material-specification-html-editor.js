(function (angular) {
	'use strict';
	/* global _ */
	angular.module('basics.material').directive('materialSpecificationHtmlEditor', ['basicCustomizeSystemoptionLookupDataService', 'cloudDesktopUserfontService', 'platformEditorService', '$q', 'platformWysiwygEditorSettingsService',
		function (basicCustomizeSystemoptionLookupDataService, cloudDesktopUserfontService, platformEditorService, $q, platformWysiwygEditorSettingsService) {
			var template = [];
			template += '<platform-Editor ';
			template +=    'id="" ';
			template +=    'show-toolbar="' + (!isForcedPlaintextForBoqSpecifications()).toString() + '" ';
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

				scope.options.canAddTextComplement = function () {
					var el = window.getSelection().getRangeAt(0).startContainer;
					return canEditHtmlContent(el);
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
					scope.entity.Content = adjustHtmlContent(scope.entity.Content);
					_isDirty = false;
				}

				// handle input of printable characters and paste
				element.on('keypress paste', function (e) {
					var el = window.getSelection().getRangeAt(0).startContainer;
					if (!canEditHtmlContent(el)) {
						e.preventDefault();
					}
				});

				element.on('paste', function(e) {
					if (isForcedPlaintextForBoqSpecifications()) {
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
					var selection = getWindowSelectionRange();
					if (selection) {
						var el = selection.startContainer;
						if (e.keyCode === 8) // backspace key
						{
							if (!canEditHtmlContent(el)) {
								e.preventDefault();
							}
						}

						if (e.keyCode === 46)   // delete key
						{
							if (!canEditHtmlContent(el)) {
								e.preventDefault();
							}
						}
					}
				});

				function getWindowSelectionRange() {
					return window.getSelection().rangeCount > 0 ? window.getSelection().getRangeAt(0) : undefined;
				}

				scope.onBlur = function () {
					if (_isDirty) {
						angular.noop();
					}
				};

				function processToolbarItems(isOenBoq) {
					platformWysiwygEditorSettingsService.getSettings().then(function() {
						let disabledItems = '', availableItems = '';
						let disabledToolbarItems = [];

						// if (isOenBoq && !_.includes(['bold','italic','underline','subscript','superscript','table','orderedlist','unorderedlist'], item.id)) // Missing: h1, h2, h3, al, bl
						if (isOenBoq) {
							disabledToolbarItems = ['font','size'];
						}

						let toolbarItems = getToolbarItems(disabledToolbarItems);

						_.forEach(toolbarItems, function(item) {
							if(item.visible) {
								availableItems += '.ql-' + item['key'] + ', ';
							}
							else {
								disabledItems += '.ql-' + item['key'] + ', ';
							}
						});

						availableItems = availableItems.trim().substring(0, availableItems.trim().length - 1);
						disabledItems = disabledItems.trim().substring(0, disabledItems.trim().length - 1);

						// element.find(availableItems).parents('.ql-formats').show(); //add all items with visible=true
						// element.find(disabledItems).parents('.ql-formats').hide(); //remove all items with visible=false
					});
				}

				function getToolbarItems(items) {
					return _.forEach(getAllToolbarItems(), function(item) {
						item.visible = !_.includes(items, item.key);
					});
				}

				function getAllToolbarItems() {
					return [
						{key: 'bold',visible: true},
						{key: 'italic',visible: true},
						{key: 'underline',visible: true},
						{key: 'font',visible: true},
						{key: 'size',visible: true},
						{key: 'color-picker-font',visible: true},
						{key: 'color-picker-highlight',visible: true},
						{key: 'strike',visible: true},
						{key: 'script',visible: true},
						{key: 'clean',visible: true},
						{key: 'list',visible: true},
						{key: 'indent',visible: true},
						{key: 'align',visible: true},
						{key: 'code-block',visible: true},
						{key: 'blockquote',visible: true},
						{key: 'link',visible: true},
						{key: 'image',visible: true},
						{key: 'picker',visible: true},
						{key: 'table',visible: true},
						{key: 'document-view',visible: true}
					];
				}

				scope.$on('BoQToolbarProcess', function(evt, isOenBoq) {
					processToolbarItems(isOenBoq);
				});

				scope.$on('boq-loaded', function(event, isOenBoq) {
					platformWysiwygEditorSettingsService.getSettings().then(function(result) {
						let allToolbarItems = result.buttons;
						let invisibleToolbarItems = [], visibleToolbarItems = [];

						_.forEach(allToolbarItems, function(item) {
							// if (isOenBoq && !_.includes(['bold','italic','underline','subscript','superscript','table','orderedlist','unorderedlist'], item.id)) // Missing: h1, h2, h3, al, bl
							if (isOenBoq && _.includes(['font','fontSize'], item.id)) // Missing: h1, h2, h3, al, bl
							{    invisibleToolbarItems.push('.ql-' + item['id']); }
							else { visibleToolbarItems.push('.ql-' + item['id']); }
						});

						element.find(invisibleToolbarItems.join(',')).parents('.ql-formats').hide();
						element.find(  visibleToolbarItems.join(',')).parents('.ql-formats').show();
					});
				});

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

			function isForcedPlaintextForBoqSpecifications() {
				const isForcedPlaintextForBoqSpecifications = _.find(basicCustomizeSystemoptionLookupDataService.getList(), {'Id':50}).ParameterValue;
				return isForcedPlaintextForBoqSpecifications==='1';
			}

			function canEditHtmlContent(element) {
				while (element.parentNode) {
					element = element.parentNode;
					if (element.localName === 'textcomplement') {
						return false;
					}
				}
				return true;
			}

			function adjustHtmlContent(content) {
				if (content === null) {
					return content;
				}

				// 1. step: remove incomplete textcomplement nodes (may occur?)
				content = content.replace(/<textcomplement><complcaption>[\s\S]*?<\/complcaption><\/textcomplement>/gi, function () {
					return '';
				});
				content = content.replace(/<textcomplement><complbody>[\s\S]*?<\/complbody><\/textcomplement>/gi, function () {
					return '';
				});
				content = content.replace(/<textcomplement><compltail>[\s\S]*?<\/compltail><\/textcomplement>/gi, function () {
					return '';
				});

				// 2. step: remove empty text complements surroundings
				content = content.replace(/<span[^>]*? class="selectable textcomplement_(bidder|owner)"><\/span>/gi, function () {
					return '';
				});

				// 3. step: remove all other text complements surroundings
				content = content.replace(/<span[^>]*? class="selectable textcomplement.*?">([\s\S]*?<\/TextComplement>)<\/span>/gi, function (match, group) {
					return group;
				});

				// 4. step: remove empty tags
				content = content.replace(/<div><\/div>/gi, function () {
					return '';
				});
				content = content.replace(/<span><\/span>/gi, function () {
					return '';
				});

				return content;
			}
		}
	]);

})(angular);