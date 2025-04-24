/*
 * $Id: platform-rich-text-editor-directive.js 2020-12-16 12:52:34Z ong $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platformRichTextEditor.directive:platformRichTextEditor.directive
	 * @description
	 * # platformRichTextEditor.directive
	 */
	angular.module('platform').directive('platformEditor', platformEditor);

	// var myAppModule = angular.module('quill.module', ['ngQuill']);
	// myAppModule.config(['ngQuillConfigProvider', function (ngQuillConfigProvider) {
	//    ngQuillConfigProvider.set(null, null, 'custom placeholder');
	// }]);

	platformEditor.$inject = ['$rootScope', '$compile', '$window', '$timeout', '$translate', '_', '$', 'platformWysiwygEditorSettingsService', 'platformEditorConverterService', 'platformEditorToolbaritemsService', 'platformNavBarService', 'platformEditorService', 'mainViewService', 'platformDialogFormService',
		'platformTableCellPropertiesService', 'platformDialogService','platformEditorSettingService','platformRuntimeDataService','cloudDesktopUserSettingsService', 'cloudDesktopTextEditorConsts','platformImageResizeService'];

	// noinspection OverlyComplexFunctionJS
	function platformEditor($rootScope, $compile, $window, $timeout, $translate, _, $, platformWysiwygEditorSettingsService, platformEditorConverterService, platformEditorToolbaritemsService, platformNavBarService, platformEditorService, mainViewService, platformDialogFormService,
		platformTableCellPropertiesService, platformDialogService, platformEditorSettingService, platformRuntimeDataService,cloudDesktopUserSettingsService, cloudDesktopTextEditorConsts,platformImageResizeService) {

		return {
			restrict: 'E',
			require: 'ngModel',
			replace: false,
			link: function (scope, element, attrs) {

				let ro;
				let isInitialized = false;
				let unregister = [];
				let _isEditable = true;
				let _colorChange = false;
				let _variableDropDown;
				let _userInput = false;
				let _backspace = false;
				let _showRuler = true;
				let uuid = 'quillEditor' + Math.random().toString().substr(2, 10);
				let _showToolbar = attrs.showToolbar ? attrs.showToolbar === 'true' : true;
				let _enableShortcut = attrs.enableShortcut ? attrs.enableShortcut === 'true' : true;

				const Delta = Quill.import('delta');
				const Embed = Quill.import('blots/embed');
				const Block = Quill.import('blots/block');
				const Break = Quill.import('blots/break');
				const Parchment = Quill.import('parchment');

				let fontWhiteList = [];
				let availableFontSizes = [];

				if (scope.$parent && scope.$parent.getContainerUUID) {
					var containerUuid = scope.$parent.getContainerUUID();
				}

				function lineBreakMatcher(node, delta) {
					if(node.className === 'break') {
						let newDelta = new Delta();
						newDelta.insert({'break': ''});
						return newDelta;
					}
					return delta;
				}

				class SmartBreak extends Break {

					length () {
						return 1;
					}

					value () {
						return '\n';
					}

					insertInto(parent, ref) {
						Embed.prototype.insertInto.call(this, parent, ref);
					}
				}
				SmartBreak.blotName = 'break';
				SmartBreak.className = 'break';
				SmartBreak.tagName = 'BR';

				Quill.register(SmartBreak);

				function processEditorEnable(val, editor) {
					// disabled dropdown-click-events in toolbar
					const pickerElems = document.querySelectorAll('#' + uuid + ' .ql-toolbar span.ql-picker');
					pickerElems.forEach(e => {
						if (val) {
							e.classList.remove('disabled');
						} else {
							// disabled table-click-event
							e.classList.add('disabled');
						}
					});

					if (val) {
						editor.enable();
					} else {
						editor.disable();
					}
				}

				unregister.push(scope.$watch(attrs.textareaEditable, function (val) {
					_isEditable = val;
					const editor = platformEditorService.getEditor(attrs.textareaName);
					if (editor) {
						processEditorEnable(val, editor);
					}
				}));

				platformWysiwygEditorSettingsService.getBothSettings().then(function (response) {
					scope.customSettings = response;

					_showRuler = scope.customSettings.user.useSettings ? scope.customSettings.user.showRuler : scope.customSettings.system.showRuler;

					const template = '<ng-quill-editor id="' + uuid + '" class="quill-editor" ng-model="' + (attrs.model || attrs.ngModel) +
						'" on-set-config="onSetConfig(config)" ' +
						'on-editor-created="editorCreated(editor)" ' +
						'on-content-changed="contentChanged(editor, html, text, source)" ' +
						'on-selection-changed="onSelectionChanged(editor, oldRange, range, source)" style="height: 100%;">' +
						'<ng-quill-ruler class="ruler-container"><div class="ruler-div"><div class="ruler" data-platform-ruler data-unit-caption="unitCaption" data-width="editorWidth"/></div></ng-quill-ruler></ng-quill-editor>';

					const linkFn = $compile(template);
					const content = linkFn(scope);

					$timeout(function link() {
						element.replaceWith(content);
						updateRulerVisibility(_showRuler);
					});
				});

				scope.onSetConfig = function (config) {
					let toolbarConfig = [];
					const maxRows = 10;
					const maxCols = 5;
					const tableOptions = [];

					for (let r = 1; r <= maxRows; r++) {
						for (let c = 1; c <= maxCols; c++) {
							tableOptions.push('newtable_' + r + '_' + c);
						}
					}

					if (scope.editoroptions && scope.editoroptions.toolbar) {
						toolbarConfig = scope.editoroptions.toolbar;
					} else {
						// START: Set up fonts dropdown and default font
						// Add fonts to whitelist
						// eslint-disable-next-line no-undef
						const fonts = Quill.import('attributors/style/font'); // jshint ignore: line
						const fontToolbar = [];

						let availableFonts = platformWysiwygEditorSettingsService.getCurrentFonts(scope.customSettings.system);
						if(availableFonts) {
							availableFonts.forEach(function (font) {

								if (font.sources && font.sources.length > 0) {
									font.sources.forEach(function (source, index) {
										let fontName = getFontName(font.fontFamily);
										if (font.sources.length > 1) {
											fontName += index;
										}

										fontWhiteList.push(fontName);
										fontToolbar.push(fontName);
									});
								} else {
									fontWhiteList.push(font.displayName);
									fontToolbar.push(font.displayName);
								}
							});
						}

						fonts.whitelist = fontWhiteList;

						Quill.register(fonts, true); // jshint ignore: line
						// END: Set up fonts dropdown and default font

						// START: Set up font size dropdown and default font size
						// eslint-disable-next-line no-undef
						let Size = Quill.import('attributors/style/size'); // jshint ignore: line

						let fontsizeToolbar = [];
						let fontsizeWhiteList = [];

						scope.customSettings.system.fontSizes.forEach(function (fontsize) {
							fontsizeWhiteList.push(fontsize.size + 'pt');
							fontsizeToolbar.push(fontsize.size + 'pt');
						});

						availableFontSizes = scope.customSettings.system.fontSizes.map(a => a.size);

						Size.whitelist = fontsizeWhiteList;

						Quill.register(Size, true);// jshint ignore: line
						// END: Set up font size dropdown and default font size

						let Align = Quill.import('attributors/style/align'); // jshint ignore: line
						let Icons = Quill.import('ui/icons'); // jshint ignore: line
						Icons.align.left = Icons.align['']; // set icon for 'left' option, otherwise it's replaced with 'undefined' text
						Align.whitelist = ['left', 'center', 'right']; // add explicit 'left' option
						Quill.register(Align, true); // jshint ignore: line

						let languageToolbar = [];

						if (scope.editoroptions && scope.editoroptions.language && scope.editoroptions.language.visible) {
							scope.editoroptions.language.list.forEach(function (lang) {
								languageToolbar.push(lang.DescriptionInfo.Description);
							});
						}

						toolbarConfig = [
							getToolbarBtnVisibility('bold') ? ['bold'] : '',
							getToolbarBtnVisibility('italic') ? ['italic'] : '',
							getToolbarBtnVisibility('underline') ? ['underline'] : '',
							getToolbarBtnVisibility('header') ? [{'header': [1, 2, 3, false]}] : '',
							getToolbarBtnVisibility('font') ? [{'font': fontToolbar}] : '',
							getToolbarBtnVisibility('fontSize') ? [{'size': fontsizeToolbar}] : '',
							languageToolbar.length !== 0 && getToolbarBtnVisibility('language') ? [{'language': languageToolbar}] : '',
							// getToolbarBtnVisibility('fontColor') ? [{'color': []}] : '',
							// getToolbarBtnVisibility('highlightColor') ? [{'background': []}] : '',
							getToolbarBtnVisibility('strikethrough') ? ['strike'] : '',
							getToolbarBtnVisibility('subscript') ? [{'script': 'sub'}] : '',
							getToolbarBtnVisibility('superscript') ? [{'script': 'super'}] : '',
							getToolbarBtnVisibility('removeformatting') ? ['clean'] : '',
							getToolbarBtnVisibility('orderedlist') ? [{'list': 'ordered'}] : '',
							getToolbarBtnVisibility('unorderedlist') ? [{'list': 'bullet'}] : '',
							getToolbarBtnVisibility('outdent') ? [{'indent': '-1'}] : '',
							getToolbarBtnVisibility('indent') ? [{'indent': '+1'}] : '',
							getToolbarBtnVisibility('leftjustify') ? [{'align': 'left'}] : '',
							getToolbarBtnVisibility('centerjustify') ? [{'align': 'center'}] : '',
							getToolbarBtnVisibility('rightjustify') ? [{'align': 'right'}] : '',
							getToolbarBtnVisibility('code') ? ['code-block'] : '',
							getToolbarBtnVisibility('blockquote') ? ['blockquote'] : '',
							getToolbarBtnVisibility('link') ? ['link'] : '',
							getToolbarBtnVisibility('image') ? ['image'] : '',
							getToolbarBtnVisibility('table') ? [{table: tableOptions}] : ''
						];

						toolbarConfig = toolbarConfig.filter(x => x !== '');
					}

					let bindings = {
						// There is no default binding named 'moduleRefresh'
						// so this will be added without overwriting anything
						// Fix for defect 118755 - Hotkey STRG R / Textmodule - Browser update when the HTML editor has the focus
						moduleRefresh: {
							key: 'R',
							shortKey: true,
							handler: function (/* range, context */) {
								// Handle ctrl+r
								if (!$('.modal-dialog').length) {
									platformNavBarService.getActionByKey('refresh').fn();
								}
							}
						},
						moduleSave: {
							key: 'S',
							shortKey: true,
							handler: function (/* range, context */) {
								// Handle ctrl+s
								if (!$('.modal-dialog').length) {
									platformNavBarService.getActionByKey('save').fn();
								}
							}
						},
						handleEnter: {
							key: 13,
							handler: function (range, context) {
								if (range.length > 0) {
									this.quill.scroll.deleteAt(range.index, range.length);  // So we do not trigger text-change
								}
								let lineFormats = Object.keys(context.format).reduce(function(lineFormats, format) {
									if (Parchment.query(format, Parchment.Scope.BLOCK) && !Array.isArray(context.format[format])) {
										lineFormats[format] = context.format[format];
									}
									return lineFormats;
								}, {});
								var previousChar = this.quill.getText(range.index - 1, 1);
								// Earlier scroll.deleteAt might have messed up our selection,
								// so insertText's built in selection preservation is not reliable
								this.quill.insertText(range.index, '\n', lineFormats, Quill.sources.USER);
								if (previousChar == '' || previousChar == '\n') {
									this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
								} else {
									this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
								}
								//this.quill.selection.scrollIntoView();
								Object.keys(context.format).forEach((name) => {
									if (lineFormats[name] != null) return;
									if (Array.isArray(context.format[name])) return;
									if (name === 'link') return;
									this.quill.format(name, context.format[name], Quill.sources.USER);
								});
							}
						},
						linebreak: {
							key: 13,
							shiftKey: true,
							handler: function (range) {
								let currentLeaf = this.quill.getLeaf(range.index)[0];
								let nextLeaf = this.quill.getLeaf(range.index + 1)[0];

								this.quill.insertEmbed(range.index, 'break', true, 'user');

								// Insert a second break if:
								// At the end of the editor, OR next leaf has a different parent (<p>)
								if (nextLeaf === null || (currentLeaf.parent !== nextLeaf.parent)) {
									this.quill.insertEmbed(range.index, 'break', true, 'user');
								}

								// Now that we've inserted a line break, move the cursor forward
								this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
							}
						}
					};

					config.modules = {
						clipboard: {
							platformDialogService:platformDialogService,
							$translate:$translate,
							matchers: [
								['BR', lineBreakMatcher]
							]
						},
						keyboard: {
							bindings: bindings
						},
						history: {
							delay: 2000,
							maxStack: 500,
							userOnly: true
						},
						table: {
							scope: scope,
							addRowAbove: $translate.instant('platform.richTextEditor.table.addRowAbove'),
							addRowBelow: $translate.instant('platform.richTextEditor.table.addRowBelow'),
							addColumnBefore: $translate.instant('platform.richTextEditor.table.addColumnBefore'),
							addColumnAfter: $translate.instant('platform.richTextEditor.table.addColumnAfter'),
							deleteRow: $translate.instant('platform.richTextEditor.table.deleteRow'),
							deleteColumn: $translate.instant('platform.richTextEditor.table.deleteColumn'),
							deleteTable: $translate.instant('platform.richTextEditor.table.deleteTable'),
							showVBorder: $translate.instant('platform.richTextEditor.table.showVerticalBorder'),
							showHBorder: $translate.instant('platform.richTextEditor.table.showHorizontalBorder'),
							showAllBorders: $translate.instant('platform.richTextEditor.table.showAllBorders'),
							noBorder: $translate.instant('platform.richTextEditor.table.noBorder'),
							tableEditor: $translate.instant('platform.richTextEditor.table.tableEditor'),
							cellEditor: $translate.instant('platform.richTextEditor.table.cellEditor'),
							addTableOptions: $translate.instant('platform.richTextEditor.table.addTableOptions'),
							deleteTableOptions: $translate.instant('platform.richTextEditor.table.deleteTableOptions'),
							tableBorderSetting: $translate.instant('platform.richTextEditor.table.tableBorderSetting'),


							showTablePropertiesDialog: function (data)
							{
								let tableDialogOptions = platformTableCellPropertiesService.tableDialogOptions;

								tableDialogOptions.value={
									backgroundColor: data.backgroundColor,
									tableWidth: data.tableWidth,
									tableHeight: data.tableHeight,
									borderStyle: data.borderStyle,
									borderWidth: data.borderWidth,
									borderColor: data.borderColor,
									horizontal: data.horizontal
								};

								return platformDialogFormService.showDialog(tableDialogOptions);
							},
							showCellPropertiesDialog: function (data)
							{
								let cellDialogOptions = platformTableCellPropertiesService.cellDialogOptions;
								let settingsValue = scope.customSettings;
								let unit;
								if(settingsValue.user.useSettings)
								{
									unit = cloudDesktopTextEditorConsts.units.find(item => item.value === settingsValue.user.unitOfMeasurement);
								}
								else
								{
									unit = cloudDesktopTextEditorConsts.units.find(item => item.value === settingsValue.system.unitOfMeasurement);
								}

								cellDialogOptions.value = {
									cellWidth: data.cellWidth,
									cellHeight: data.cellHeight,
									verticalPadding: data.verticalPadding,
									horizontalPadding: data.horizontalPadding,
									borderStyle: data.borderStyle,
									borderWidth: data.borderWidth,
									borderColor: data.borderColor,
									backgroundColor: data.backgroundColor,
									horizontal: data.horizontal,
									vertical: data.vertical,
									unitLabel: unit.caption,
									options: { decimalPlaces: unit.decimal }
								};

								let dialogOption = {
									headerText: 'Cell Properties',
									bodyTemplateUrl: globals.appBaseUrl + 'cloud.desktop/templates/table-cell-properties-editor.html',
									minWidth: '700px',
									width: '700px',
									resizeable: true,
									showCancelButton: true,
									showOkButton: true,
									value: cellDialogOptions.value,
									sizeOptions:cellDialogOptions.value.options,
								};

								return platformDialogService.showDialog(dialogOption).then(function (result) {
									return result;
								});
							},
							platformWysiwygEditorSettingsService:platformWysiwygEditorSettingsService,
						},
						toolbar: _showToolbar ? {
							container: toolbarConfig,
							handlers: {
								'language': function (value) {
									if (value) {
										const selectedLanguage = scope.editoroptions.language.list.find(function (lang) {
											return lang.DescriptionInfo.Description === value;
										});
										if (selectedLanguage && scope.editoroptions.language.onChanged) {
											scope.editoroptions.language.onChanged(selectedLanguage.Id);
										}
									}
								}
							}
						} : false,
						blotFormatter: {
							maxImageWidth: scope.customSettings.user.useSettings ? scope.customSettings.user.documentWidth : scope.customSettings.system.documentWidth,
							platformWysiwygEditorSettingsService: platformWysiwygEditorSettingsService,
							platformImageResizeService: platformImageResizeService,
							alignBtnClickHandler: function() {

							}
						}
					};

					const Inline = Quill.import('blots/inline');

					class CustomAttributes extends Inline {
						constructor(domNode, value) {
							super(domNode, value);

							const span = this.replaceWith(new Inline(Inline.create()));

							span.children.forEach(child => {
								if (child.attributes) {
									child.attributes.copy(span);
								}
								if (child.unwrap) {
									child.unwrap();
								}
							});

							// here we apply every attribute from <font> tag to span as a style
							Object.keys(domNode.attributes).forEach(function (key) {

								if (domNode.attributes[key].name !== 'style')
								{
									let value = domNode.attributes[key].value;
									let name = domNode.attributes[key].name;
									if (name === 'face')
									{
										name = 'font-family';
										span.domNode.style.fontFamily = value;
									}
									else if (name === 'size')
									{
										name = 'font-size';
									}
									span.format(name, value);
								}
							});

							if (domNode.parentElement.childElementCount === 1) {
								domNode.parentElement.style.color =  span.domNode.style.color;
								domNode.parentElement.style.fontFamily =  span.domNode.style.fontFamily;
								domNode.parentElement.style.fontSize =  span.domNode.style.fontSize;
							}

							this.remove();

							return span;
						}
					}

					CustomAttributes.blotName = 'customAttributes';
					CustomAttributes.tagName = 'FONT';

					Quill.register(CustomAttributes, true);

					class CustomBlock extends Block {
						constructor(domNode, value) {
							super(domNode, value);
							let fontSize = _backspace ? getCurrentFontValue('ql-size') : scope.customSettings.system.defaultFontSize + 'pt';
							let font = _backspace ? getCurrentFontValue('ql-font') : scope.customSettings.system.defaultFont;
							this.format('size', domNode.style.fontSize ? domNode.style.fontSize : fontSize);
							this.format('font', domNode.style.fontFamily ? domNode.style.fontFamily : font);
							_backspace = false;
						}

						static formats(domNode) {
							return ['font', 'size'].reduce(function(formats, attribute) {
								if (attribute === 'font') {
									formats[attribute] = domNode.style.fontFamily ? domNode.style.fontFamily : scope.customSettings.system.defaultFont;
								}
								else if (attribute === 'size') {
									formats[attribute] = domNode.style.fontSize ? domNode.style.fontSize : scope.customSettings.system.defaultFontSize + 'pt';
								}

								return formats;
							}, {});
						}

						format(name, value) {
							if (name === 'size' && value) {
								this.domNode.style.fontSize = value;
							} else if (name === 'font' && value) {
								this.domNode.style.fontFamily = value;
							} /*else if (name === 'block' && value) {
								this.domNode.style.fontSize = value.size;
								this.domNode.style.fontFamily = value.font;
							}*/
							else {
								super.format(name, value);
							}
						}
					}

					Quill.register(CustomBlock, true); // jshint ignore: line

					const Image = Quill.import('formats/image'); // jshint ignore: line

					const ATTRIBUTES = [
						'alt',
						// 'height',
						'width',
						'class',
						'style', // Had to add this line because the style was inlined
					];

					class CustomImage extends Image {
						constructor(domNode, value) {
							super(domNode, value);
						}

						static formats(domNode) {
							if(domNode.width > 0 && !domNode.getAttribute('width')) {
								domNode.setAttribute('width', domNode.width);
							}

							if(domNode.getAttribute('height') && domNode.getAttribute('height') > 0) {
								domNode.removeAttribute('height');
							}
							return ATTRIBUTES.reduce(function(formats, attribute) {
								if (domNode.hasAttribute(attribute)) {
									formats[attribute] = domNode.getAttribute(attribute);
								}
								return formats;
							}, {});
						}

						format(name, value) {
							if (ATTRIBUTES.indexOf(name) > -1) {
								if (value) {
									this.domNode.setAttribute(name, value);
								} else {
									this.domNode.removeAttribute(name);
								}
							} else {
								super.format(name, value);
							}
						}
					}

					Quill.register(CustomImage, true); // jshint ignore: line

					// formating for the lists(ul, ol)
					const ListItem = Quill.import('formats/list/item');
					const customFontFamilyAttributor = new Parchment.Attributor.Style('custom-family-attributor', 'font-family')
					const customSizeAttributor = new Parchment.Attributor.Style('custom-size-attributor', 'font-size')
					const customColorAttributor = new Parchment.Attributor.Style('custom-color-attributor', 'color')

					class list extends ListItem {
						optimize(context) {
							super.optimize(context)

							if (this.children.length >= 1) {
								const child = this.children.head
								const attributes = child?.attributes?.attributes

								if (attributes) {
									for (const key in attributes) {
										const element = attributes[key]
										let name = element.keyName
										const value = element.value(child.domNode)

										if (name === 'color') super.format('custom-color-attributor', value)
										else if (name === 'font-family') super.format('custom-family-attributor', value)
										else if (name === 'font-size') super.format('custom-size-attributor', value)
									}
								}
							}
						}
					}

					Quill.register(customColorAttributor, true)
					Quill.register(customFontFamilyAttributor, true)
					Quill.register(customSizeAttributor, true)
					Quill.register(list, true);

					// format sup and sub
					let ScriptItem = Quill.import('formats/script');

					class scripts extends ScriptItem {
						constructor(domNode, value) {
							super(domNode, value);
							this.domNode.style.lineHeight = '100%';
						}
					}

					Quill.register(scripts, true);

					// Register table
					Quill.register(quillTable.TableCell); // jshint ignore: line
					Quill.register(quillTable.TableRow); // jshint ignore: line
					Quill.register(quillTable.Table); // jshint ignore: line
					Quill.register(quillTable.Contain); // jshint ignore: line
					Quill.register('modules/table', quillTable.TableModule); // jshint ignore: line

					Quill.register('modules/blotFormatter', QuillBlotFormatter.default); // jshint ignore: line

				};

				// generate code friendly names
				function getFontName(font) {
					return font.toLowerCase().replace(/\s/g, '-');
				}

				function getToolbarBtnVisibility(id) {
					if (scope.customSettings && scope.customSettings.system.buttons) {
						const btn = scope.customSettings.system.buttons.find(x => x.id === id);
						if (btn) {
							return btn.visibility;
						}
					}
					return true;
				}

				function getCurrentFontValue(type) {
					return $('#' + uuid + ' span.' + type + ' .ql-picker-label').attr('data-value');
				}

				$rootScope.$on('cfpLoadingBar:loading', function () {
					isInitialized = false;
				});

				$rootScope.$on('cfpLoadingBar:loaded', function () {
					isInitialized = true;
				});

				scope.contentChanged = function (editor, html, text, source) {
					if(source !== 'api') {
						if (isInitialized) {
							_userInput = true;
							if (scope.onChange) {
								scope.onChange();
							}
						} else {
							isInitialized = true;
						}
					}
					else {
						if(text === '\n' || text === '\n\n') {
							setFontDropdown(scope.customSettings.system.defaultFont);
							setFontSizeDropdown(scope.customSettings.system.defaultFontSize + 'pt');
						}

						// only set focus in editor if container already has focus
						if(scope.$parent.hasFocus) {
							editor.focus();
						}

						if (scope.modelChanged) {
							scope.modelChanged();
						}
					}
					updateRulerWidth(editor.container.classList.contains('document-view'));
				};

				function setFontDropdown(fontName) {
					let fontSelector = document.querySelector('.ql-font .ql-picker-label');
					if (fontSelector) {
						if (fontName) {
							fontName = fontName.replaceAll('\"', '')
							fontSelector.setAttribute('data-value', fontName);
						}
						else {
							fontSelector.setAttribute('data-value', scope.customSettings.system.defaultFont);
						}
					}
				}

				function setFontSizeDropdown(fontSize) {
					let fontSizeSelector = document.querySelector('.ql-size .ql-picker-label');
					if (fontSizeSelector) {
						if (fontSize) {
							fontSizeSelector.setAttribute('data-value', fontSize);
						}
						else {
							fontSizeSelector.setAttribute('data-value', scope.customSettings.system.defaultFontSize + 'pt');
						}
					}
				}

				function updateRulerVisibility(showRuler) {
					let rulerContainer = document.querySelector('.ruler-container');
					if (rulerContainer) {
						rulerContainer.style.display = showRuler ? 'block' : 'none';
					}
				}

				function updateRulerWidth(isDocumentView) {
					let documentWidth = scope.customSettings.user.useSettings ?  scope.customSettings.user.documentWidth : scope.customSettings.system.documentWidth;
					let documentPadding = scope.customSettings.user.useSettings ?  scope.customSettings.user.documentPadding : scope.customSettings.system.documentPadding;
					let unit = scope.customSettings.user.useSettings ?  scope.customSettings.user.unitOfMeasurement : scope.customSettings.system.unitOfMeasurement;


					if(!isDocumentView)
					{
						documentWidth = platformWysiwygEditorSettingsService.convertInRequiredUnit(unit, 'px', $('#' + uuid).width() - 10);

						let docView = document.querySelector('.ql-container > .ql-editor');
						if(docView)
						{
							docView.style.width = '';
							docView.style.padding = '';
						}

						let ruler = document.querySelector('.ruler-container > .ruler-div');
						if(ruler)
						{
							ruler.style.width = '';
							ruler.style.paddingLeft = '';
							ruler.style.paddingRight = '';
							ruler.style.left = '';
						}
					}
					else
					{
						let widthInMM = documentWidth;
						let paddingInMM = documentPadding;
						if(unit !== '1') {
							widthInMM = platformWysiwygEditorSettingsService.convertInRequiredUnit('1', unit, documentWidth);
							paddingInMM = platformWysiwygEditorSettingsService.convertInRequiredUnit('1', unit, documentPadding);
						}

						// Document View
						let docView = document.querySelector('.ql-container.document-view > .ql-editor');
						if(docView)
						{
							docView.style.width =  (widthInMM + 2 * paddingInMM) + 'mm';
							docView.style.padding = paddingInMM + 'mm';
						}
						// Ruler Document View
						if(_showRuler) {
							let ruler = document.querySelector('.ruler-container.document-view > .ruler-div');
							if(ruler)
							{
								ruler.style.width =  (widthInMM + 2 * paddingInMM) + 'mm';
								ruler.style.paddingRight = ruler.style.paddingLeft = paddingInMM + 'mm';
							}

							if (ruler.getBoundingClientRect().left > docView.getBoundingClientRect().left) {
								ruler.style.left = '-8px';
							}else{
								ruler.style.left = '';
							}
						}
					}

					scope.unitCaption = platformWysiwygEditorSettingsService.getUnitCaption(unit);
					scope.editorWidth = Math.floor(documentWidth);
				}

				scope.editorCreated = function (editor) {

					// workaround for a nasty issue with preserving white spaces (they get stripped out):
					// https://github.com/quilljs/quill/issues/1752
					// https://github.com/quilljs/quill/issues/2459
					// https://github.com/quilljs/quill/issues/1751
					editor.container.style.whiteSpace = 'pre-line';

					editor.container.onkeydown = function(e) {
						if ([8].includes(e.keyCode)) // backspace/delete key
						{
							_backspace = true;
						}
					};

					// allows the user to disable shortcuts in the editor
					overwriteShortCuts(editor);

					platformEditorService.register(attrs.textareaName, editor);

					editor.clipboard.addMatcher(Node.TEXT_NODE, function (node, delta) {
						return formatMatcher(node, delta);
					});

					function formatMatcher(node, delta) {
						const op = delta && delta.ops && delta.ops[0];
						if (op && op.insert === node.parentElement.textContent) {
							setQuillStyles(op, node.parentElement);
						}
						return delta;
					}

					function setQuillStyles(op, correspondingSpan) {
						if (!op.attributes) {
							op.attributes = {};
						}
						const verticalAlign = correspondingSpan.style.verticalAlign;
						if (verticalAlign === 'super' || verticalAlign === 'sub') {
							_.assign(op.attributes, {script: verticalAlign});
						}

						let fontFamily = correspondingSpan.style.fontFamily;
						if (fontFamily.includes(',')) {
							fontFamily = fontFamily.split(',')[0];
							fontFamily = fontFamily.replaceAll('"', '');
						}

						if (fontFamily.includes('\"')) {
							fontFamily = fontFamily.replaceAll('\"', '');
						}

						if (fontFamily) {
							let font = fontWhiteList.find(el => el.toUpperCase() === fontFamily.toUpperCase());
							if (font) {
								_.assign(op.attributes, {'font': font});
							}
						}

						let fontSize = correspondingSpan.style.fontSize;
						if (fontSize) {
							fontSize = fontSize.replace(/pt|px/gi, '');
							if (!availableFontSizes.includes(fontSize)) {
								fontSize = availableFontSizes.sort((a, b) => Math.abs(fontSize - a) - Math.abs(fontSize - b))[0];
							}
							_.assign(op.attributes, {'size': fontSize + 'pt'});
						}
						else {
							_.assign(op.attributes, {'size': scope.customSettings.system.defaultFontSize + 'pt'});
						}
					}

					if (_showToolbar) {

						if (scope.editoroptions && scope.editoroptions.variable && scope.editoroptions.variable.visible && getToolbarBtnVisibility('variable')) {
							var placeholderToolbar = {};
							scope.editoroptions.variable.list.forEach(function (variable) {
								placeholderToolbar[variable.DescriptionInfo.Translated + variable.Code] = variable.Code;
							});
							_variableDropDown = platformEditorToolbaritemsService.createDropDownItem({
								id: 'variable',
								label: 'Variable',
								rememberSelection: false,
								items: placeholderToolbar
							});
							platformEditorToolbaritemsService.attach(editor, _variableDropDown, 4);
							_variableDropDown.onSelect = function (label, value) {
								if (value) {
									const cursorPosition = editor.getSelection().index;
									editor.insertText(cursorPosition, value, 'user');
									editor.setSelection(cursorPosition + value.length);
								}
							};
						}

						if (getToolbarBtnVisibility('fontColor')) {
							var colorButton = platformEditorToolbaritemsService.createButton({
								id: 'color-picker-font',
								icon: '<i class="fa fa-font"></i>'
							});

							platformEditorToolbaritemsService.attach(editor, colorButton, 5);
						}

						if (getToolbarBtnVisibility('highlightColor')) {
							var highlightButton = platformEditorToolbaritemsService.createButton({
								id: 'color-picker-highlight',
								icon: '<i class="fa fa-h-square"></i>'
							});

							platformEditorToolbaritemsService.attach(editor, highlightButton, 6);
						}

						if (getToolbarBtnVisibility('documentView')) {
							var documentView = platformEditorToolbaritemsService.createButton({
								id: 'document-view',
								icon: '<img src="cloud.style/content/images/tlb-icons.svg#ico-document-view">',
								toggle: true
							});

							platformEditorToolbaritemsService.attach(editor, documentView);

							documentView.onClick = function (sender, quill) {
								if (quill.container) {
									let rulerContainer = document.querySelector('.ruler-container');
									let isActive = 'false';
									if (quill.container.classList.contains('document-view')) {
										quill.container.classList.remove('document-view');
										sender.toolbarEl.nextElementSibling.classList.remove('document-view');
										rulerContainer.classList.remove('document-view');
										updateRulerWidth(false);
									} else {
										quill.container.classList.add('document-view');
										isActive = 'true';
										sender.toolbarEl.nextElementSibling.classList.add('document-view');
										rulerContainer.classList.add('document-view');
										updateRulerWidth(true);
									}
									if (containerUuid) {
										mainViewService.customData(containerUuid, 'documentView', isActive);
									}
									if (scope.viewChanged) {
										scope.viewChanged();
									}
								}
							};
						}

						if (getToolbarBtnVisibility('settingsView')) {
							var settingsView = platformEditorToolbaritemsService.createButton({
								id: 'settings-view',
								icon: '<img src="cloud.style/content/images/tlb-icons.svg#ico-settings">',
							});

							platformEditorToolbaritemsService.attach(editor, settingsView);

							settingsView.onClick = function()
							{
								if( editor.container.querySelectorAll('.blot-formatter__overlay').length>0)
								{
									const condition = true;
									const button = editor.container.querySelectorAll('.blot-formatter__overlay');

									if (condition) {
										button[0].style.display = 'none';
									} else {
										button[0].style.display = 'block';
									}
								}

								let user = scope.customSettings.user;
								let unit = cloudDesktopTextEditorConsts.units.find(item => item.value === user.unitOfMeasurement);

								let settings = platformEditorSettingService.settings;
								settings.formConfig.configure.groups.find(grp => grp.gid === 'docview').header = $translate.instant('platform.wysiwygEditor.settings.groupDocview') + '(' + unit.caption + ')';
								settings.formConfig.configure.rows.find(row => row.rid === 'width').options.decimalPlaces = unit.decimal;
								settings.formConfig.configure.rows.find(row => row.rid === 'padding').options.decimalPlaces = unit.decimal;

								settings.value = {
									useSettings : user.useSettings,
									documentWidth: user.documentWidth,
									unitOfMeasurement: user.unitOfMeasurement,
									showRuler: user.showRuler,
									documentPadding: user.documentPadding,
									oldUnit: user.unitOfMeasurement,
									autoNumberSettings:user.autoNumberSettings,
								};

								let dataReadonly = !user.useSettings;
								platformRuntimeDataService.readonly(settings.value, [
									{field: 'unitOfMeasurement', readonly: dataReadonly},
									{field: 'showRuler', readonly: dataReadonly},
									{field: 'documentWidth', readonly: dataReadonly},
									{field: 'documentPadding', readonly: dataReadonly}
								]);

								return platformDialogFormService.showDialog(settings).then(function(result){
									if(result.ok)
									{
										cloudDesktopUserSettingsService.saveSubServiceSettings(result.value, 'wysiwygEditorSettings', 'user').then(function(response){
											scope.customSettings.user.documentWidth = result.value.documentWidth;
											scope.customSettings.user.showRuler = result.value.showRuler;
											scope.customSettings.user.unitOfMeasurement = result.value.unitOfMeasurement;
											scope.customSettings.user.documentPadding = result.value.documentPadding;
											scope.customSettings.user.useSettings = result.value.useSettings;
											scope.customSettings.user.autoNumberSettings = result.value.autoNumberSettings;

											_showRuler = scope.customSettings.user.useSettings ? scope.customSettings.user.showRuler : scope.customSettings.system.showRuler;

											updateRulerVisibility(_showRuler);
											updateRulerWidth(editor.container.classList.contains('document-view'));
										});
									}
								});
							};
						}
					}

					$timeout(function () {
						processEditorEnable(_isEditable, editor);

						if (containerUuid) {
							var isActiveStatus = mainViewService.customData(containerUuid, 'documentView');
							if (isActiveStatus === 'true') {
								documentView.qlButton.classList.add('active');
								editor.container.classList.add('document-view');
								let rulerContainer = document.querySelector('.ruler-container');
								rulerContainer.classList.add('document-view');
								updateRulerWidth(true);
							}
						}


						// START - initialize tooltips
						const showTooltip = (which, el) => {
							var tool;
							if (which === 'button') {
								tool = el.className.replace('ql-', '');
							} else if (which === 'span') {
								tool = el.className.replace('ql-', '');
								tool = tool.substr(0, tool.indexOf(' '));
							}
							if (tool) {
								// if element has value attribute.. handling is different
								// buttons without value
								if (el.value === '') {
									el.setAttribute('title', $translate.instant('platform.richTextEditor.' + tool));
								}
								// buttons with value
								else if (typeof el.value !== 'undefined' && el.value !== 'undefined') {
									el.setAttribute('title', $translate.instant('platform.richTextEditor.' + tool + '.' + el.value));
								}
								// default
								else {
									if (tool === 'table') {
										el.setAttribute('title', $translate.instant('platform.richTextEditor.insertTable'));
									} else {
										el.setAttribute('title', $translate.instant('platform.richTextEditor.' + tool));
									}
								}
							}
						};

						const toolbarElement = document.querySelector('.ql-toolbar');
						if (toolbarElement) {

							setFontDropdown(scope.customSettings.system.defaultFont);
							setFontSizeDropdown(scope.customSettings.system.defaultFontSize + 'pt');

							let langSelector = document.querySelector('.ql-language .ql-picker-label');
							if (langSelector && scope.editoroptions) {
								let id = scope.editoroptions.language.current.Id;
								let selectedLanguage = scope.editoroptions.language.list.find(function (lang) {
									return lang.Id === id;
								});
								if (selectedLanguage) {
									langSelector.setAttribute('data-value', selectedLanguage.DescriptionInfo.Description);
								}
							}

							let matchesButtons = toolbarElement.querySelectorAll('button');
							for (let el of matchesButtons) {
								showTooltip('button', el);
							}
							// for submenus inside
							let matchesSpans = toolbarElement.querySelectorAll('.ql-toolbar > span > span');
							for (let el of matchesSpans) {
								showTooltip('span', el);
							}
						}

						let node = document.getElementById(uuid);
						let parentNode = node? node.parentNode : null;

						if (parentNode) {
							if (!parentNode.style.height) {
								parentNode.style.height = '100%';
							}
							ro = new ResizeObserver(entries => { // jshint ignore: line
								$('#' + uuid + ' .ng-quill-div').height(parentNode.offsetHeight);
								let updatedHeight = getContainerHeight();

								let qlPickers = $('#' + uuid + ' .ql-picker-options');
								for (let i = 0; i < qlPickers.length; i++) {
									if (qlPickers[i].children.length * 22 > updatedHeight) {
										qlPickers[i].style.height = updatedHeight + 'px';
										setDropdownAttributes(i);
									} else {
										$('.ql-picker-options')[i].style.height = null;
									}
								}
								updateRulerWidth(editor.container.classList.contains('document-view'));
							});

							ro.observe(parentNode);
						}

						function closeColorPopup (colorPicker) {
							colorPicker.setAttribute('type','text');
							colorPicker.setAttribute('type','color');
						}

						let fontColorPicker = document.createElement('input');
						fontColorPicker.id = 'color-picker-font';
						fontColorPicker.type = 'color';
						fontColorPicker.title = $translate.instant('platform.richTextEditor.color-picker-font');
						fontColorPicker.classList.add('ql-picker-input');

						let fontColorPickerTimeout = setTimeout(() => {
							closeColorPopup(fontColorPicker);
						}, 2000);

						let highlightColorPicker = document.createElement('input');
						highlightColorPicker.id = 'color-picker-highlight';
						highlightColorPicker.type = 'color';
						highlightColorPicker.title = $translate.instant('platform.richTextEditor.color-picker-highlight');
						highlightColorPicker.classList.add('ql-picker-input');

						let highlightColorPickerTimeout = setTimeout(() => {
							closeColorPopup(highlightColorPicker);
						}, 2000);

						fontColorPicker.addEventListener('input', function () {
							clearTimeout(fontColorPickerTimeout);
							_colorChange = true;
							let range = editor.getSelection(true);
							if (range) {
								if (range.length > 0) {
									editor.formatText(range.index, range.length, 'color', fontColorPicker.value, 'user');
								} else {
									editor.format('color', fontColorPicker.value);
								}
								if (scope.onChange) {
									scope.onChange();
								}
							}
							fontColorPickerTimeout = setTimeout(() => {
								closeColorPopup(fontColorPicker);
							}, 2000);
						}, false);

						highlightColorPicker.addEventListener('input', function () {
							clearTimeout(highlightColorPickerTimeout);
							_colorChange = true;
							let range = editor.getSelection(true);
							if (range) {
								if (range.length > 0) {
									editor.formatText(range.index, range.length, 'background', highlightColorPicker.value, 'user');
								} else {
									editor.format('background', highlightColorPicker.value);
								}
								if (scope.onChange) {
									scope.onChange();
								}
							}
							highlightColorPickerTimeout = setTimeout(() => {
								closeColorPopup(highlightColorPicker);
							}, 2000);
						}, false);

						if (document.getElementsByClassName('ql-color-picker-font').length > 0) {
							$(fontColorPicker).insertBefore(document.getElementsByClassName('ql-color-picker-font')[0]);
						}

						if (document.getElementsByClassName('ql-color-picker-font').length > 0) {
							$(highlightColorPicker).insertBefore(document.getElementsByClassName('ql-color-picker-highlight')[0]);
						}

						if (!_showToolbar) {
							$('#' + uuid + ' .ql-container')[0].style.borderTop = 1;
						}

					}, 100);

					function overwriteShortCuts(editor) {
						// B
						if (editor.keyboard.bindings[66]) {
							editor.keyboard.bindings[66].unshift({
								key: 66,
								ctrlKey: true,
								handler: () => {
									return _showToolbar && _enableShortcut;
								}
							});
						}
						// I
						if (editor.keyboard.bindings[73]) {
							editor.keyboard.bindings[73].unshift({
								key: 73,
								ctrlKey: true,
								handler: () => {
									return _showToolbar && _enableShortcut;
								}
							});
						}
						// R
						if (editor.keyboard.bindings[82]) {
							editor.keyboard.bindings[82].unshift({
								key: 82,
								ctrlKey: true,
								handler: () => {
									return _showToolbar && _enableShortcut;
								}
							});
						}
						// S
						if (editor.keyboard.bindings[83]) {
							editor.keyboard.bindings[83].unshift({
								key: 83,
								ctrlKey: true,
								handler: () => {
									return _showToolbar && _enableShortcut;
								}
							});
						}
						// U
						if (editor.keyboard.bindings[85]) {
							editor.keyboard.bindings[85].unshift({
								key: 85,
								ctrlKey: true,
								handler: () => {
									return _showToolbar && _enableShortcut;
								}
							});
						}
						// Y
						if (editor.keyboard.bindings[89]) {
							editor.keyboard.bindings[89].unshift({
								key: 89,
								ctrlKey: true,
								handler: () => {
									return _showToolbar && _enableShortcut;
								}
							});
						}
						// Z
						if (editor.keyboard.bindings[90]) {
							editor.keyboard.bindings[90].unshift({
								key: 90,
								ctrlKey: true,
								handler: () => {
									return _showToolbar && _enableShortcut;
								}
							});
						}
					}

					function getContainerHeight() {
						return $('#' + uuid + ' .ng-quill-div').height() - $('#' + uuid + ' .ql-toolbar').outerHeight() - $('#' + uuid + ' .ruler-container').outerHeight();
					}

					function setDropdownAttributes(i) {
						let newWidth = getMaxWidthContainer($('#' + uuid + ' .ql-picker-options')[i]);
						if (newWidth < 70) {
							$('#' + uuid + ' .ql-picker-options')[i].style.width = '100px';
							$('#' + uuid + ' .ql-picker-options')[i].style.left = '-74px';
						} else {
							$('#' + uuid + ' .ql-picker-options')[i].style.width = newWidth + 'px';
						}
					}

					function getMaxWidthContainer(toolItem) {
						return $('#' + uuid + ' .ql-toolbar').outerWidth() - $(toolItem).parent().position().left;
					}
				};

				scope.onSelectionChanged = function (editor, oldRange, range) {
					if (!_colorChange) {
						if (range) {
							let format = editor.getFormat(range.index);
							if (format.font) {
								setFontDropdown(format.font);
							}
							if (format.size) {
								setFontSizeDropdown(format.size);
							}

							if ($('#color-picker-font') && $('#color-picker-font').length > 0) {
								if (format.color) {
									$('#color-picker-font')[0].value = format.color;
								} else {
									$('#color-picker-font')[0].value = '#000000';
								}
							}
							if ($('#color-picker-highlight') && $('#color-picker-highlight').length > 0) {
								if (format.background) {
									$('#color-picker-highlight')[0].value = format.background;
								} else {
									$('#color-picker-highlight')[0].value = '#FFFFFF';
								}
							}
						}
					} else {
						_colorChange = false;
					}
				};

				unregister.push(scope.$on('$destroy', function () {
					if(ro) {
						ro.disconnect();
					}
					_.over(unregister)();
				}));

				unregister.push(scope.$on('variableListUpdated', function () {
					if (_variableDropDown) {
						var editor = platformEditorService.getEditor(attrs.textareaName);
						if (editor && scope.editoroptions && scope.editoroptions.variable.visible) {
							var placeholderToolbar = {};
							scope.editoroptions.variable.list.forEach(function (variable) {
								placeholderToolbar[variable.DescriptionInfo.Translated + variable.Code] = variable.Code;
							});
							platformEditorToolbaritemsService.resetItems(placeholderToolbar, _variableDropDown);
						}
					}
				}));
			}
		};
	}
})(angular);
