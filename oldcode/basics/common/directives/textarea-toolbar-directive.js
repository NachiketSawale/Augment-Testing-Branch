(function (angular) {
	'use strict';

	var moduleName = 'basics.common';

	angular.module(moduleName).directive('basicsCommonTextAreaToolbarDirective', basicsCommonTextAreaToolbarDirective);

	basicsCommonTextAreaToolbarDirective.$inject = ['_', '$translate', 'toolbarCommonService', '$compile', 'platformCreateUuid'];

	function basicsCommonTextAreaToolbarDirective(_, $translate, toolbarCommonService, $compile, platformCreateUuid) {
		return {
			restrict: 'AE',
			link: function (scope, elem) {
				var isToolbarReady = false;
				scope.toolbarDataIdW = platformCreateUuid();
				scope.toolitems = {
					id: scope.toolbarDataIdW,
					items: []
				};
				var updateListInDropDownFunctions = [];
				var toolbarLanguageId = 'textarea-language';
				var toolbarVariableId = 'textarea-variable';

				if (scope.editoroptions && scope.editoroptions.language && scope.editoroptions.language.visible) {
					var language = createLanguageItem(scope);
					scope.toolitems.items.push(language.item);
					updateListInDropDownFunctions.push(language.updateListInDropDown);
				}

				if (scope.editoroptions && scope.editoroptions.variable && scope.editoroptions.variable.visible) {
					var variable = createVariableItem(scope);
					scope.toolitems.items.push(variable.item);
					updateListInDropDownFunctions.push(variable.updateListInDropDown);
				}

				function createLanguageItem(scope) {

					var languageItem = {
						id: toolbarLanguageId, // 'textarea-language',
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
						visible: true,
						disabled: !languageBtnEditable()
					};

					scope.$on('languageListUpdated', function () {
						if (isToolbarReady) {
							updateLanguageListInDropDown();
						}
					});

					scope.$on('languageEditableChanged', function () {
						if (!scope.editoroptions || !scope.editoroptions.language || !isToolbarReady) {
							return;
						}
						if (scope.editoroptions.language.current) {
							updateTextInSelectBox(toolbarLanguageId, scope.editoroptions.language.current.DescriptionInfo.Translated);
							var languageDisabled = !languageBtnEditable();
							var variableDisabled = !variableBtnEditable();
							// change the state.
							toolbarCommonService.updateItems(scope.toolbarDataIdW, [{
								id: toolbarLanguageId,
								disabled: languageDisabled
							}, {id: toolbarVariableId, disabled: variableDisabled}]);
						}
					});

					function updateLanguageListInDropDown() {
						if (initDropDownItems((scope.editoroptions && scope.editoroptions.language && scope.editoroptions.language.list) || [],
							toolbarLanguageId, 'editoroptions.language.current', (scope.editoroptions && scope.editoroptions.language && scope.editoroptions.language.onChanged) || null) !== false) {
							var descripition = '';
							if (scope.editoroptions && scope.editoroptions.language && scope.editoroptions.language.current) {
								descripition = scope.editoroptions.language.current.DescriptionInfo.Translated || descripition;
							}
							updateTextInSelectBox(toolbarLanguageId, descripition);
						}
					}

					function languageBtnEditable() {
						return scope.editoroptions && scope.editoroptions.language && scope.editoroptions.language.editable && scope.editoroptions.language.visible;
					}

					return {
						item: languageItem,
						updateListInDropDown: updateLanguageListInDropDown
					};
				}

				function createVariableItem(scope) {
					var variableItem = {
						id: toolbarVariableId,
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
						visible: true,
						disabled: !variableBtnEditable()
					};

					scope.$on('variableListUpdated', function () {
						if (isToolbarReady) {
							updateVariableListInDropDown();
						}
					});

					function updateVariableListInDropDown() {
						if (initDropDownItems((scope.editoroptions && scope.editoroptions.variable && scope.editoroptions.variable.list) || [],
							toolbarVariableId, 'editoroptions.variable.current', scope.onVariableChanged, true) !== false) {
							updateTextInSelectBox(toolbarVariableId, $translate.instant('platform.wysiwygEditor.insertVariable'));
						}
					}

					return {
						item: variableItem,
						updateListInDropDown: updateVariableListInDropDown
					};
				}

				function variableBtnEditable() {
					return scope.editoroptions && scope.editoroptions.variable && scope.editoroptions.variable.visible;
				}

				function updateTextInSelectBox(id, text) {
					var selectedItem = {
						id: id,
						caption: text
					};

					toolbarCommonService.updateItems(scope.toolbarDataIdW, selectedItem);
				}

				// initialize functionality with drop down items, like font, font size, language, variable and so on.
				function initDropDownItems(items, itemId, type, action, keepTextInSelectBox) {
					var dropdownItemForToolbar = [];
					if (!items || items.length === 0) {
						return false;
					}
					for (var i = 0; i < items.length; i++) {
						var object = {
							id: '_' + i + '_',
							type: 'item',
							fn: function (id, item, object) {

								if (!keepTextInSelectBox) {
									updateTextInSelectBox(itemId, item.caption);
									_.set(scope, type, item.value);
								}

								if (angular.isFunction(action)) {
									var _id = (item.value && item.value.Id) || null;
									action(_id, item, object);
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
								caption: item.DescriptionInfo.Translated + ' ' + item.Code,
								disabled: item.Id < 0
							};
						} else if (type === 'editoroptions.language.current') {
							item = items[i];
							partObject = {
								Id: item.Id,
								value: item,
								caption: item.DescriptionInfo.Translated
							};
						}

						dropdownItemForToolbar.push(_.assign(object, partObject));
					}

					toolbarCommonService.updateItemsById(scope.toolbarDataIdW, dropdownItemForToolbar, itemId);
				}

				function createTemplate() {
					var template = '<div class="wysiwyg-toolbar"><toolbar-directive data="toolitems"></toolbar-directive></div>';

					elem.append($compile(template)(scope));
				}

				scope.$on('initHTMLEditorToolbar', function () {

					// init toolbar-service
					scope.toolbarDataHTML = {
						state: scope.toolbarDataIdW
					};

					toolbarCommonService.register(scope.toolitems);

					// add htmlmarkup for the directive
					createTemplate();
					_.forEach(updateListInDropDownFunctions, function (fn) {
						if (angular.isFunction(fn)) {
							fn();
						}
					});

					isToolbarReady = true;
				});
			}
		};
	}
})(angular);