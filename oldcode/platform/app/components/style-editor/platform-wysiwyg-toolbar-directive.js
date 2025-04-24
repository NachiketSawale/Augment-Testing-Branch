(function () {
	'use strict';

	angular.module('platform').directive('platformWysiwygToolbarDirective', platformWysiwygToolbarDirective);

	platformWysiwygToolbarDirective.$inject = ['_', '$translate', 'toolbarCommonService', '$compile', 'platformCreateUuid'];

	function platformWysiwygToolbarDirective(_, $translate, toolbarCommonService, $compile, platformCreateUuid) {
		return {
			restrict: 'AE',
			link: function (scope, elem) {
				var isToolbarReady = false;
				scope.toolbarDataIdW = platformCreateUuid();

				scope.toolitems = {
					id: scope.toolbarDataIdW,
					items: getToolbarItems()
				};

				scope.updateToolbar = function () {
					var listOfItems = _.filter(getToolbarItems(), function (item) {
						return item.type === 'check';
					});

					var items = _.map(listOfItems, function (dto) {
						var selected = _.get(dto, 'value');
						return {
							id: dto.id,
							value: _.isFunction(selected) ? selected() : selected
						};
					});

					toolbarCommonService.updateItems(scope.toolbarDataIdW, items);
				};

				function getToolbarItems() {
					return [
						{
							cssClass: 'btn wysiwyg-tb-bold',
							iconClass: 'fa fa-bold',
							id: 'wysiwyg-tb-bold',
							value: scope.isBold,
							caption$tr$: 'platform.wysiwygEditor.bold',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('bold');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-italic',
							iconClass: 'fa fa-italic',
							id: 'wysiwyg-tb-italic',
							value: scope.isItalic,
							caption$tr$: 'platform.wysiwygEditor.italic',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('italic');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-underline',
							iconClass: 'fa fa-underline',
							id: 'wysiwyg-tb-underline',
							value: scope.isUnderlined,
							caption$tr$: 'platform.wysiwygEditor.underline',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('underline');
							}
						},
						{
							id: 'wysiwyg-tb-font',
							toolTip$tr$: 'platform.wysiwygEditor.font',
							type: 'dropdown-btn',
							caption$tr$: '',
							visible: true,
							cssClass: 'dropdown-btn-text middle wysiwyg-select wysiwyg-tb-font',
							list: {
								showImages: true,
								items: []
							}
						},
						{
							id: 'wysiwyg-tb-fontsize',
							cssClass: ' wysiwyg-select wysiwyg-tb-fontsize dropdown-btn-text small',
							toolTip$tr$: 'platform.wysiwygEditor.fontSize',
							caption$tr$: '',
							visible: true,
							type: 'dropdownBtn',
							popupOptions: {
								hasDefaultWidth: true
							},
							list: {
								showImages: true,
								items: []
							}
						},
						{
							id: 'wysiwyg-tb-language',
							toolTip: $translate.instant('platform.wysiwygEditor.selectLanguage'),
							type: 'dropdownBtn',
							caption$tr$: '',
							cssClass: 'dropdown-btn-text middle wysiwyg-select wysiwyg-tb-language',
							popupOptions: {
								hasDefaultWidth: false
							},
							list: {
								showImages: true,
								items: []// scope.editoroptions && scope.editoroptions.language && scope.editoroptions.language.list
							},
							visible: (scope.editoroptions && scope.editoroptions.language && scope.editoroptions.language.visible) || false,
							disabled: !languageBtnEditable()
						},
						{
							id: 'wysiwyg-tb-variable',
							toolTip: $translate.instant('platform.wysiwygEditor.insertVariable'),
							type: 'dropdownBtn',
							caption$tr$: '',
							cssClass: 'dropdown-btn-text middle wysiwyg-select wysiwyg-tb-variable',
							popupOptions: {
								hasDefaultWidth: false
							},
							list: {
								showImages: true,
								items: [] // scope.editoroptions && scope.editoroptions.variable && scope.editoroptions.variable.list
							},
							visible: (scope.editoroptions && scope.editoroptions.variable && scope.editoroptions.variable.visible) || false,
							disabled: !variableBtnEditable()
						},
						{
							cssClass: 'btn wysiwyg-tb-fontColor relative-container color-picker-wrapper',
							iconClass: 'fa fa-font',
							id: 'wysiwyg-tb-fontColor',
							selected: false,
							caption$tr$: 'platform.wysiwygEditor.fontColor',
							type: 'colorpicker',
							value: 0,
							visible: true,
							fn: function (fieldId, field) {
								scope.fontColor = field.value;
								scope.setFontColor();
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-highlightColor relative-container color-picker-wrapper',
							iconClass: 'fa fa-h-square',
							id: 'wysiwyg-tb-highlightColor',
							selected: false,
							visible: true,
							caption$tr$: 'platform.wysiwygEditor.highlightColor',
							type: 'colorpicker',
							value: 0,
							fn: function (fieldId, field) {
								scope.hiliteColor = field.value;
								scope.setHiliteColor();
							}
						},
						{
							cssClass: 'btn tb-table-btn',
							iconClass: 'fa fa-table',
							parentCssClass: 'wysiwyg tb-table',
							id: 'wysiwyg-tb-table-btn',
							value: false,
							caption$tr$: 'platform.wysiwygEditor.insertTable',
							type: 'check',
							visible: true,
							fn: function (fieldId, field, _object) {
								scope.tableOperations.showTableMenuItem(_object.e);
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-strikethrough',
							iconClass: 'fa fa-strikethrough',
							id: 'wysiwyg-tb-strikethrough',
							value: scope.isStrikethrough,
							caption$tr$: 'platform.wysiwygEditor.strikeThrough',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('strikethrough');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-subscript',
							iconClass: 'fa fa-subscript',
							id: 'wysiwyg-tb-subscript',
							value: scope.isSubscript,
							caption$tr$: 'platform.wysiwygEditor.subscript',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('subscript');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-superscript',
							iconClass: 'fa fa-superscript',
							id: 'wysiwyg-tb-superscript',
							value: scope.isSuperscript,
							caption$tr$: 'platform.wysiwygEditor.superscript',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('superscript');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-removeformatting',
							iconClass: 'fa fa-eraser',
							id: 'wysiwyg-tb-removeformatting',
							value: false,
							caption$tr$: 'platform.wysiwygEditor.removeFormatting',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.removeTextFormatting();
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-orderedlist',
							iconClass: 'fa fa-list-ol',
							id: 'wysiwyg-tb-orderedlist',
							value: scope.isOrderedList,
							caption$tr$: 'platform.wysiwygEditor.orderedList',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('insertorderedlist');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-unorderedlist',
							iconClass: 'fa fa-list-ul',
							id: 'wysiwyg-tb-unorderedlist',
							value: scope.isUnorderedList,
							caption$tr$: 'platform.wysiwygEditor.unorderedList',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('insertunorderedlist');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-outdent',
							iconClass: 'fa fa-outdent',
							id: 'wysiwyg-tb-outdent',
							value: false,
							caption$tr$: 'platform.wysiwygEditor.outdent',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('outdent');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-indent',
							iconClass: 'fa fa-indent',
							id: 'wysiwyg-tb-indent',
							value: false,
							caption$tr$: 'platform.wysiwygEditor.indent',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('indent');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-leftjustify',
							iconClass: 'fa fa-align-left',
							id: 'wysiwyg-tb-leftjustify',
							value: scope.isLeftJustified,
							caption$tr$: 'platform.wysiwygEditor.leftJustify',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('justifyleft');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-centerjustify',
							iconClass: 'fa fa-align-center',
							id: 'wysiwyg-tb-centerjustify',
							value: scope.isCenterJustified,
							caption$tr$: 'platform.wysiwygEditor.centerJustify',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('justifycenter');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-rightjustify',
							iconClass: 'fa fa-align-right',
							id: 'wysiwyg-tb-rightjustify',
							value: scope.isRightJustified,
							caption$tr$: 'platform.wysiwygEditor.rightJustify',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('justifyright');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-code',
							iconClass: 'fa fa-code',
							id: 'wysiwyg-tb-code',
							value: scope.isPre,
							caption$tr$: 'platform.wysiwygEditor.code',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.processFormatBlock('pre');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-blockquote',
							iconClass: 'fa fa-quote-right',
							id: 'wysiwyg-tb-blockquote',
							value: scope.isBlockquote,
							caption$tr$: 'platform.wysiwygEditor.quote',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.processFormatBlock('blockquote');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-link',
							iconClass: 'fa fa-link',
							id: 'wysiwyg-tb-link',
							value: false,
							caption$tr$: 'platform.wysiwygEditor.link',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.createLink();
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-unlink',
							iconClass: 'fa fa-unlink',
							id: 'wysiwyg-tb-unlink',
							value: false,
							caption$tr$: 'platform.wysiwygEditor.unlink',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.format('unlink');
							}
						},
						{
							cssClass: 'btn wysiwyg-tb-image',
							iconClass: 'fa fa-picture-o',
							id: 'wysiwyg-tb-image',
							value: false,
							caption$tr$: 'platform.wysiwygEditor.insertImage',
							type: 'check',
							visible: true,
							fn: function (event) {
								scope.insertImage();
							}
						}
					];
				}

				function getPartObjectForFontAndFontSize(type, item, id) {
					var displayMember = type === 'font' ? 'displayName' : 'size';

					var font = {
						id: id,
						displayName: item.displayName,
						fontFamily: item.fontFamily
					};

					var fontSize = {
						id: id,
						size: item.size,
						value: item.value
					};

					return {
						caption: item[displayMember],
						content: type === 'font' ? font : fontSize,
						selected: scope[type][displayMember] === item[displayMember],
						value: false
					};
				}

				function updateTextInSelectBox(id, text) {
					var selectedItem = {
						id: id,
						caption: text
					};

					toolbarCommonService.updateItems(scope.toolbarDataIdW, selectedItem);
				}

				scope.updateToolbarItem = function (id, isVisible) {
					var selectedItem = {
						id: id,
						value: isVisible
					};

					toolbarCommonService.updateItems(scope.toolbarDataIdW, selectedItem);
				};

				function updateSelectedValueInSelectBox(parentId, itemId, isSelected) {
					var updatePreSelectedItem = {
						id: itemId,
						value: isSelected
					};

					toolbarCommonService.updateItemsById(scope.toolbarDataIdW, updatePreSelectedItem, parentId);
				}

				// set visible tag false
				function checkPreSelectedItem(items, itemId) {
					var preSelectedItem = _.filter(items, function (item) {
						if (item.value) {
							return item;
						}
					});

					if (preSelectedItem.length !== 0) {
						angular.forEach(preSelectedItem, function (item) {
							updateSelectedValueInSelectBox(itemId, item.id, false);
						});
					}
				}

				function initDropDownItems(items, itemId, type, action, keepTextInSelectBox) {
					var dropdownItemForToolbar = [];

					if (!items || items.length === 0) {
						return false;
					}
					for (var i = 0; i < items.length; i++) {
						var object = {
							id: '_' + i + '_',
							type: (type === 'fontSize' || type === 'font') ? 'check' : 'item',
							fn: function (id, item, object) {
								if (type === 'editoroptions.variable.current' || type === 'editoroptions.language.current') {
									checkPreSelectedItem(object.scope.$parent.fields.items, itemId);
								}

								if (!keepTextInSelectBox) {
									updateTextInSelectBox(itemId, item.caption);
									_.set(scope, type, item.content);
								} else if (type !== 'editoroptions.variable.current' && type !== 'editoroptions.language.current') {
									scope[type] = item.value;
								}

								if (angular.isFunction(action)) {
									var _id = (item.value && item.value.Id) || null;
									action(_id, item, object);
								} else if (type === 'font') {
									scope.changeFontFamily();
								} else if (type === 'fontSize') {
									scope.changeFontSize();
								}
							}
						};

						var partObject = null;
						var item = null;
						if (type === 'editoroptions.variable.current') {
							item = items[i];
							partObject = {
								Id: item.Id,
								value: item,
								caption: item.DescriptionInfo.Translated + ' ' + item.Code
							};
						} else if (type === 'editoroptions.language.current') {
							item = items[i];
							partObject = {
								Id: item.Id,
								value: item,
								caption: item.Description
							};
						} else {
							partObject = getPartObjectForFontAndFontSize(type, items[i], '_' + i + '_');
						}

						dropdownItemForToolbar.push(_.assign(object, partObject));
					}

					toolbarCommonService.updateItemsById(scope.toolbarDataIdW, dropdownItemForToolbar, itemId);
				}

				function updateFontAttributesFromTextarea(parentId, text, type) {
					updateTextInSelectBox(parentId, text);

					var parentItem = _.find(scope.toolitems.items, {id: parentId});
					var childItemId = scope[type] ? _.find(parentItem.list.items, {caption: text}).id : undefined;

					checkPreSelectedItem(parentItem.list.items, parentId);

					if (childItemId) {
						updateSelectedValueInSelectBox(parentId, childItemId, true);
					}
				}

				scope.addFontItemsInDropDown = function () {
					initDropDownItems(scope.fonts, 'wysiwyg-tb-font', 'font');
					initDropDownItems(scope.fontSizes, 'wysiwyg-tb-fontsize', 'fontSize');

					updateTextInSelectBox('wysiwyg-tb-font', scope.font.displayName);
					updateTextInSelectBox('wysiwyg-tb-fontsize', scope.fontSize.size);
				};

				function addAdditionalTemplateInToolbar() {
					// need for uploading image-files
					return '<input type="file" id="editorImageUpload" input-file="" accept="image/*" ng-model="file" name="upload" ng-change="uploadFile()" onchange="angular.element(this).scope().uploadFile()" style="display: none;" />';
				}

				function createTemplate() {
					var template = '<div class="wysiwyg-toolbar"><toolbar-directive data="toolitems"></toolbar-directive>' + addAdditionalTemplateInToolbar() + '</div>';

					elem.append($compile(template)(scope));
				}

				function processToolButtons() {
					// get list from buttons that no checked in settings-dialog
					var listOfHideButtons = _.map(_.filter(scope.customSettings.buttons, {'visibility': false}), 'cssClass');
					// set one for one of display: none
					angular.forEach(scope.toolitems.items, function (button) {
						if (_.includes(listOfHideButtons, button.id)) {
							button.visible = false;
						}
					});
				}

				function updateVariableListInDropDown() {
					if (initDropDownItems((scope.editoroptions && scope.editoroptions.variable && scope.editoroptions.variable.list) || [],
						'wysiwyg-tb-variable', 'editoroptions.variable.current', scope.onVariableChanged, true) !== false) {
						updateTextInSelectBox('wysiwyg-tb-variable', $translate.instant('platform.wysiwygEditor.insertVariable'));
					}
				}

				function updateLanguageListInDropDown() {
					if (initDropDownItems((scope.editoroptions && scope.editoroptions.language && scope.editoroptions.language.list) || [],
						'wysiwyg-tb-language', 'editoroptions.language.current', (scope.editoroptions && scope.editoroptions.language && scope.editoroptions.language.onChanged) || null) !== false) {
						var descripition = '';
						if (scope.editoroptions && scope.editoroptions.language && scope.editoroptions.language.current) {
							descripition = scope.editoroptions.language.current.Description || descripition;
						}
						updateTextInSelectBox('wysiwyg-tb-language', descripition);
					}
				}

				function languageBtnEditable() {
					return scope.editoroptions && scope.editoroptions.language && scope.editoroptions.language.editable && scope.editoroptions.language.visible;
				}

				function variableBtnEditable() {
					return scope.editoroptions && scope.editoroptions.variable && scope.editoroptions.variable.visible;
				}

				scope.updateFontText = function () {
					updateFontAttributesFromTextarea('wysiwyg-tb-font', (scope.font ? scope.font.displayName : ''), 'font');
				};

				scope.updateFontSizeText = function () {
					updateFontAttributesFromTextarea('wysiwyg-tb-fontsize', (scope.fontSize ? scope.fontSize.size : ''), 'fontSize');
				};

				scope.initHTMLEditorToolbar = function () {
					processToolButtons();

					// init toolbar-service
					toolbarCommonService.register(scope.toolitems);

					// add htmlmarkup for the directive
					createTemplate();

					scope.addFontItemsInDropDown();

					updateLanguageListInDropDown();
					updateVariableListInDropDown();

					isToolbarReady = true;
				};

				scope.$on('languageListUpdated', function () {
					if (isToolbarReady) {
						updateLanguageListInDropDown();
					}
				});

				scope.$on('variableListUpdated', function () {
					if (isToolbarReady) {
						updateVariableListInDropDown();
					}
				});

				scope.$on('languageEditableChanged', function (event) {
					if (!scope.editoroptions || !scope.editoroptions.language || !isToolbarReady) {
						return;
					}
					if (scope.editoroptions.language.current) {
						updateTextInSelectBox('wysiwyg-tb-language', scope.editoroptions.language.current.Description);
						var languageDisabled = !languageBtnEditable();
						var variableDisabled = !variableBtnEditable();
						// change the state.
						toolbarCommonService.updateItems(scope.toolbarDataIdW, [{id: 'wysiwyg-tb-language', disabled: languageDisabled}, {id: 'wysiwyg-tb-variable', disabled: variableDisabled}]);
					}
				});
			}
		};
	}
})();