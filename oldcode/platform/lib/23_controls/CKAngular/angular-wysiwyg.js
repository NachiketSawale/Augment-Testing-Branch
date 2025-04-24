/*
 NOTE:  It's customized. By replacing another library it does not work as desired.

 Usage: <wysiwyg textarea-id="question" textarea-class="form-control"  textarea-height="80px" textarea-name="textareaQuestion" textarea-required ng-model="question.question" enable-bootstrap-title="true"></wysiwyg>
 options
 textarea-id 			The id to assign to the editable div
 textarea-class			The class(es) to assign to the the editable div
 textarea-height			If not specified in a text-area class then the hight of the editable div (default: 80px)
 textarea-name			The name attribute of the editable div
 textarea-required		HTML/AngularJS required validation
 ng-model				The angular data model
 enable-bootstrap-title	True/False whether or not to show the button hover title styled with bootstrap
 editoroptions optional. for load external fonts and for a external css-file
*/

angular.module('wysiwyg.module', [])
		.directive('wysiwyg', ['$compile', '$window', '$timeout', '$translate', 'platformWysiwygEditorSettingsService', function ($compile, $window, $timeout, $translate, platformWysiwygEditorSettingsService) {
			'use strict';

			return {
				template: '<div class="wysiwyg-editor filler">' +
				'<platform-wysiwyg-toolbar-directive></platform-wysiwyg-toolbar-directive>' +
				'<div ng-blur="action()" contentEditable="{{textareaEditable}}" class="{{textareaClass}} wysiwyg-textarea" rows="{{textareaRows}}" name="{{textareaName}}" required="{{textareaRequired}}" placeholder="{{textareaPlaceholder}}" ng-model="value"></div>' +
				'</div>',
				restrict: 'E',
				scope: {
					value: '=ngModel',
					textareaHeight: '@textareaHeight',
					textareaName: '@textareaName',
					textareaPlaceholder: '@textareaPlaceholder',
					textareaClass: '@textareaClass',
					textareaRequired: '@textareaRequired',
					textareaId: '@textareaId',
					textareaEditable: '=?textareaEditable',
					action: '&',
					editoroptions: '=?editoroptions'
				},
				replace: true,
				require: 'ngModel',
				link: function (scope, element, attrs, ngModelController) {

					if(_.isUndefined(scope.textareaEditable)) {
						scope.textareaEditable = true;
					}
					var textarea = element.find('div.wysiwyg-textarea');
					scope.fontSizeType = 'pt';
					var isFontSizeSelectedFromSelectBox = false;
					var isFontFamilySelectedFromSelectBox = false;

					function replaceFontSizeType(fontSizeWithType) {
						if(fontSizeWithType) {
							return fontSizeWithType.replace(scope.fontSizeType, '');
						}
					}

					function addFontSizeType(fontSizeWithoutType) {
						return fontSizeWithoutType.concat(scope.fontSizeType);
					}

					function findFontSizeInList() {
						return _.find(scope.fontSizes, {size: replaceFontSizeType(scope.customSettings.defaultFontSize)});
					}

					function findIndexFontSizeInList(fontSize) {
						return _.findIndex(scope.fontSizes, {'size': replaceFontSizeType(fontSize)});
					}

					function setSettingFonts() {
						scope.fonts = scope.customSettings.fonts;
					}

					scope.fontSizes = [];

					function setSettingFontSizes() {
						scope.fontSizes = scope.customSettings.fontSizes;
					}

					scope.editoroptions = scope.editoroptions || {}; //war für bosch gedacht. evtl rausnehmen

					platformWysiwygEditorSettingsService.getSettings().then(function(response) {
						scope.customSettings = response;
						setSettingFonts();
						setSettingFontSizes();
						setDefaultFont();
						setDefaultFontSize();

						//call function in the wysiwyg-toolbar-directive. For the initializing toolbar-items
						scope.initHTMLEditorToolbar();
					});

					if (attrs.enableBootstrapTitle === 'true' && attrs.enableBootstrapTitle !== undefined) {
						//element.find('button[title]').tooltip({container: 'body'});

						element.find('button[title]').tooltip({
							container: 'body',
							template: '<div class="tooltip textEditor" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
						});
					}

					textarea.on('keyup mouseup', function () {
						scope.$apply(function readViewText() {
							var html = textarea.html();

							if (html === '<br>') {
								html = '';
							}

							setContentInModel(html);
						});
					});

					/*
					Usecase: text is marked. e.g. button for bold is clicked, and you clecked bot in textare back, you clicked an other iten in grid
					--> has the consequence that the bold-property is not saved in textarea.
					Therefore this focus-attribute.
					The problenm is still that when clicking the buttons in wyswyg-directive the focusout-event is called.
					So I ask, if the clicked element belongs to the wyswyg-container.
					*/
					element.on('focusout', function (e) {
						if(angular.element(e.relatedTarget).parents('.wysiwyg-toolbar').length < 1) {
							setContentInModel(textarea.html());
						}
					});

					function setContentInModel(htmlContent) {
						ngModelController.$setViewValue(htmlContent);
					}

					scope.isLink = false;

					//Used to detect things like A tags and others that dont work with cmdValue().
					function itemIs(tag) {
						var selection = getWindowSelectionRange();
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

					//Used to detect things like A tags and others that dont work with cmdValue().
					function getHiliteColor() {
						var selection = getWindowSelectionRange();
						if (selection) {
							var style = angular.element(selection.startContainer.parentNode).attr('style');

							if (!angular.isDefined(style)) {
								return false;
							}

							var a = style.split(';');
							for (var i = 0; i < a.length; i++) {
								var s = a[i].split(':');
								if (s[0].trim() === 'background-color') {
									return s[1];
								}
							}
							return '#fff';
						} else {
							return '#fff';
						}
					}

					function getWindowSelectionRange() {
						return window.getSelection().rangeCount > 0 ? window.getSelection().getRangeAt(0) : undefined;
					}
					//need for formatblock pre and blockquote
					//for remove format set a div-tag
					//and button in toolbar set/remove css class active
					scope.processFormatBlock = function (formatType) {
						var actualFormatType = scope.cmdValue('formatblock');
						if (actualFormatType !== formatType) {
							scope.format('formatblock', formatType);
						} else {
							scope.format('formatblock', 'div');
						}

						angular.element('.' + formatType).toggleClass('active');
					};

					textarea.on('mousedown', function (event) {
						//is an image clicked?
						if(!angular.element(event.target).hasClass('imageMarkup') && !angular.element(event.target).parent().hasClass('ui-wrapper')) {
							destroyResizableFnOnImageTag();
						}
					});

					textarea.on('focusout', function (event) {
						//as soon as you leave the html editor, remove resibale-function if exists
						if(angular.element(event.target).find('.imageMarkup').length > 0) {
							destroyResizableFnOnImageTag();
						}
					});

					function destroyResizableFnOnImageTag() {
						//remove all the HTML-Markup for the sesizable function. For to clean HTML Markup
						angular.element('.imageMarkup').each(function () {
							if(angular.element(this).parent('.ui-wrapper').length > 0) {
								angular.element(this).parent('.ui-wrapper').resizable('destroy');
							}
						});
					}

					function setDefaultFont() {
						if(scope.customSettings) {
							scope.font = scope.customSettings.defaultFont ? getFontFamilyFromDefaultFont() : scope.fonts[0];
							scope.setFont();
						}
					}

					function getFontFamilyFromDefaultFont() {
						//defaultFont is as displayName
						return _.find(scope.customSettings.fonts, { 'fontFamily': scope.customSettings.defaultFont});
					}

					function setDefaultFontSize() {
						if(scope.customSettings) {
							scope.fontSize = scope.customSettings.defaultFontSize ? findFontSizeInList() : scope.fontSizes[1];
						}
					}

					function checkOfDefaultAlignmentSetting() {
						if(_.isEmpty(textarea.text()) && !scope.cmdState(scope.customSettings.defaultAlignment.commandState)) {
							scope.format(scope.customSettings.defaultAlignment.commandState);
						}
					}

					function checkIsLiElement(event, selection) {
						if ((event.keyCode === 8 || event.keyCode === 46) && (scope.isOrderedList || scope.isUnorderedList)) {
							if (selection.startContainer.parentNode.nextSibling && selection.startContainer.parentNode.nextSibling.textContent) {
								//copy the text in a variable
								var cloneContentText = selection.startContainer.parentNode.nextSibling.textContent.trim();
								//delete the new line text.
								selection.startContainer.parentNode.parentNode.removeChild(selection.startContainer.parentNode.nextSibling);
								//append the text in prev span
								selection.startContainer.parentNode.append(cloneContentText);
							}
						}
					}

					function getFontSizeFromElement(startContainer) {

						/*
							in our Editor are the styles in  <span>-tag. But if you copy a text from html or word then the
							 style for the textes can be in another tag.
						 */
						if(startContainer.tagName && startContainer.style.fontSize) {
							return startContainer.style.fontSize;
						}
						else if(startContainer.parentNode && (!startContainer.parentNode.className || startContainer.parentNode.className.indexOf('wysiwyg') < 0)) {
							return getFontSizeFromElement(startContainer.parentNode);
						}
					}

					function getFontFamilyFromElement(startContainer) {

						/*
							in our Editor are the styles in  <span>-tag. But if you copy a text from html or word then the
							 style for the textes can be in another tag.
						 */
						if(startContainer.tagName && startContainer.style.fontFamily) {
							return startContainer.style.fontFamily.replace(/"/gi, '');
						}
						else if(startContainer.parentNode && (!startContainer.parentNode.className || startContainer.parentNode.className.indexOf('wysiwyg') < 0)) {
							return getFontFamilyFromElement(startContainer.parentNode);
						}
					}

					/*
						shift	16 / ctrl	17 / alt	18 / pause/break	19
				  */
					function checkOfNoneLetters(event) {
						var toReturn = true;
						var noneAvailableKeys = [16,17,18,19];
						if(event.ctrlKey || noneAvailableKeys.indexOf(event.keyCode) !== -1) {
							toReturn = false;
						}
						return toReturn;
					}

					function getIndexFromFonts(fontElement) {
						return _.findIndex(scope.fonts, function (font) {
							return font.fontFamily === fontElement;
						});
					}

					function getIndexOfFontFamilyList(fontFamilyInElement) {
						var _index;
						if (fontFamilyInElement.indexOf(',') !== -1) {
							//it exist more then one values in font-family. The first hit wins
							var fontFamilyArray = fontFamilyInElement.split(',');

							for (var i = 0; i < fontFamilyArray.length; i++) {
								_index = getIndexFromFonts(fontFamilyArray[i]);

								if (_index > -1) {
									break;
								}
							}
						}
						else {
							_index = getIndexFromFonts(fontFamilyInElement);
						}
						return _index;
					}

					function setIsState(event) {
						$timeout(function () {
							checkOfDefaultAlignmentSetting();
							scope.isBold = scope.cmdState('bold');
							scope.isUnderlined = scope.cmdState('underline');
							scope.isStrikethrough = scope.cmdState('strikethrough');
							scope.isItalic = scope.cmdState('italic');
							scope.isSuperscript = itemIs('SUP');//scope.cmdState('superscript');
							scope.isSubscript = itemIs('SUB');//scope.cmdState('subscript');
							scope.isRightJustified = scope.cmdState('justifyright');
							scope.isLeftJustified = scope.cmdState('justifyleft');
							scope.isCenterJustified = scope.cmdState('justifycenter');
							scope.isPre = scope.cmdValue('formatblock') === 'pre';
							scope.isBlockquote = scope.cmdValue('formatblock') === 'blockquote';
							scope.isOrderedList = scope.cmdState('insertorderedlist');
							scope.isUnorderedList = scope.cmdState('insertunorderedlist');

							var selection = getWindowSelectionRange();

							//8 ->backspace. 46 -> delete
							checkIsLiElement(event, selection);

							var fontFamilyInElement = selection ? getFontFamilyFromElement(selection.startContainer) : undefined;
							//check wenn mehrere --> welche ist in der liste

							var indexOfFontFamilyList;

							if(fontFamilyInElement) {
								indexOfFontFamilyList = getIndexOfFontFamilyList(fontFamilyInElement);
							}

							if(isFontFamilySelectedFromSelectBox) {
								//font-family is selected by dropdown-box
								scope.setFont();
							}
							else if (indexOfFontFamilyList > -1) {
								//existing font in html-markup?
								scope.font = scope.fonts[indexOfFontFamilyList];
							}
							else {
								if (_.isEmpty(textarea.text())) {
									//is textarea empty?
									setDefaultFont();
								} else {
									scope.font = undefined;
								}
							}

							scope.updateFontText();

							var elementFontSize = '';

							if (selection && selection.startContainer.tagName) {
								elementFontSize = selection.startContainer.style.fontSize;
							}

							//check next htmltag of fontSize
							if(selection && selection.startContainer.parentNode && elementFontSize === '') {
								elementFontSize = getFontSizeFromElement(selection.startContainer);
							}

							//check if font-size from element in scope.fontSizes
							var indexFromFontSizes = findIndexFontSizeInList(elementFontSize);

							//user select fontSize from dropdown-menue
							if (isFontSizeSelectedFromSelectBox && (event.keyCode && checkOfNoneLetters(event))) {
								scope.fontSize = scope.fontSizes[findIndexFontSizeInList(scope.fontSize.size)];
								isFontSizeSelectedFromSelectBox = false;
							}
							else if (indexFromFontSizes > -1) {
								scope.fontSize = scope.fontSizes[indexFromFontSizes];
							}

							//first element-container in HTML Editor.
							else if (_.isEmpty(textarea.text()) && !isFontSizeSelectedFromSelectBox) {
								scope.fontSize = scope.customSettings.defaultFontSize ? findFontSizeInList() : scope.fontSizes[1];
							}
							else if (isFontSizeSelectedFromSelectBox || (event.keyCode && checkOfNoneLetters(event) && elementFontSize !== '')) {
								if(!scope.fontSize) {
									scope.fontSize = scope.customSettings.defaultFontSize ? findFontSizeInList() : scope.fontSizes[1];
								}
								//user clicked a key. but is a letter
								setElementFontSize();
							}
							else if(indexFromFontSizes < 0){
								//fontSize-dropdown-menue is empty
								scope.fontSize = undefined;
							}

							scope.updateFontSizeText();

							var hiliteColor = getHiliteColor();
							scope.hiliteColor = hiliteColor ? rgb2hex(hiliteColor) : '#fff';
							element.find('#wysiwyg-tb-highlightcolor').css('background-color', scope.hiliteColor);

							scope.fontColor = rgb2hex(scope.cmdValue('forecolor'));
							element.find('#wysiwyg-tb-fontcolor').css('color', scope.fontColor);

							scope.isLink = itemIs('A');

							scope.updateToolbar();
							
							isFontFamilySelectedFromSelectBox = false;
						}, 10);
					}

					function setElementFontSize() {
						var selection = getWindowSelectionRange();
						if (selection && scope.fontSize && selection.startContainer.parentNode.className.indexOf('wysiwyg-editor') < 0) {
							var elem = angular.element(selection.startContainer.parentNode);
							elem.css('font-size', addFontSizeType(scope.fontSize.size));

							scope.fontSize = scope.fontSizes[findIndexFontSizeInList(scope.fontSize.size)];
						}
					}

					textarea.on('keydown', function ($event) {
						//metaKey --> for mac
						if(($event.ctrlKey || $event.metaKey) && $event.keyCode === 86) {
							$timeout(function () {
								var spanElements = element[0].querySelectorAll('.wysiwyg-textarea span');

								angular.forEach(spanElements, function (spanTag) {
									if(spanTag.style.fontSize === '') {
										spanTag.style.fontSize = addFontSizeType(scope.fontSize.size);
									}
								});
							}, 10);
						}
					});

					textarea.on('click keyup focus mouseup', function ($event) {
						setIsState($event);
					});

					//Function to convert hex format to a rgb color
					//color-attributes in HTML-Editor are in rgb-format. But for colorpicker we need HEX-format
					function rgb2hex(rgb) {
						rgb = rgb.trim().match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
						return (rgb && rgb.length === 4) ? '#' +
								('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) +
								('0' + parseInt(rgb[2], 10).toString(16)).slice(-2) +
								('0' + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
					}

					//angular.element(document.querySelector('#fileUpload')).on('change', fileUpload);
					scope.format = function (cmd, arg) {
						scope.cmdValue('formatblock');
						document.execCommand(cmd, false, arg);
					};

					scope.cmdState = function (cmd) {
						return document.queryCommandState(cmd);
					};

					scope.cmdValue = function (cmd) {
						return document.queryCommandValue(cmd);
					};

					scope.removeTextFormatting = function() {
						var selection = getWindowSelectionRange();
						var nodes = getNodes(selection.startContainer.parentNode, selection.endContainer.parentNode);

						if(selection.toString() !== '' && nodes.length > 0) {
							setDefaultFontFamilyAndSize();

							nodes.forEach (function(node, index) {
								//remove first all inline styles. set only default font-family and faont-size
								node.removeAttribute('style');
								checkIfExistFontSizeInElement(node);
							});
						}
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

									var img = new Image();
									img.src = content;

									img.onload = function(event) {

										/*
											Because the default settings no longer exist after adding pictures, therefore the
											html-elements have to be created 'manually'.
										 */
										var selection = window.getSelection();
										var range = selection.getRangeAt(0);

										var spanForImg = getNewSpanElement();
										spanForImg.style.display = 'block';

										var img = document.createElement('IMG');
										img.src = content;
										spanForImg.append(img);

										var span = getNewSpanElement();
										span.innerHTML = '<br>';

										range.insertNode(span);
										range.insertNode(spanForImg);
										//set cursor to the last span element
										selection.collapse(span,0);

										//add resizeble fn for the images
										createImageresizeable();
									};
								};
								reader.readAsDataURL(file);
							}
						}
					};

					function getNewSpanElement() {
						var span = document.createElement('span');
						span.style.fontSize = addFontSizeType(scope.fontSize.size);
						span.style.fontFamily = scope.font.fontFamily;

						return span;
					}

					function createImageresizeable() {
						angular.forEach(element.find('img'), function(value, key) {
							var a = angular.element(value);
							a.addClass('imageMarkup');
							a.click(function() {
								//use resiizable function from jquery ui.
								angular.element(this).resizable({
									aspectRatio: true,
									start: function(event, ui ) {
										ui.element.css('border', 'solid 1px gray');
									},
									stop: function(event, ui ) {
										ui.element.resizable('destroy');
									}
								});
							});
						});
					}

					scope.insertImage = function () {
						// in case the cursor is not in the editor place it there :)
						textarea.focus();
						angular.element(document.querySelector('#editorImageUpload')).click();
					};

					scope.changeFontFamily = function() {
						isFontFamilySelectedFromSelectBox = true;
						scope.setFont();
						scope.updateFontText();
					};


					scope.changeFontSize = function() {
						//a variable to check, if font-size chossen in selectbox or is a default-value
						isFontSizeSelectedFromSelectBox = true;
						scope.setFontSize();
						scope.updateFontSizeText();
					};

					scope.setFont = function () {
						scope.format('fontname', scope.font.fontFamily);
					};

					scope.setFontSize = function () {
						//is a text selected?
						if(getWindowSelectionRange() && getWindowSelectionRange().toString() !== '') {
							/*
							is needed. UseCase: select a text part in a text-element(SPAN). And change the font-size.
							Without this codeline: All text get the selected font-size. NOt this selected textpart.
							 */
							scope.format('fontsize', scope.fontSize.value);
						}

						var selection = getWindowSelectionRange();

						//darf nicht der startcontainer sein
						if (selection && selection.startContainer.parentNode.className.indexOf('wysiwyg-editor') < 0) {
							if(selection.startContainer.parentNode === selection.endContainer.parentNode) {
								var elem;
								/*
									sometimes is only text in startContainer. We need a html-element. The textes are in a span-element
								 */
								if (selection.startContainer.tagName === "SPAN") {
									elem = angular.element(selection.startContainer);
								}
								else if (selection.startContainer.parentNode.tagName === "SPAN") {
									elem = angular.element(selection.startContainer.parentNode);
								}

								if(elem) {
									elem.css('font-size', addFontSizeType(scope.fontSize.size));
								}
							}
							else {
								var nodes = getNodes(selection.startContainer.parentNode, selection.endContainer.parentNode);
								nodes.forEach (function(node, index) {
									checkIfExistFontSizeInElement(node);
								});
							}
						}
					};

					var getNodes = function(startNode, endNode) {
						if (startNode === endNode && startNode.childNodes.length === 0) {
							return [startNode];
						}

						var getNextNode = function(node, finalNode, skipChildren){
							//if there are child nodes and we didn't come from a child node
							if (finalNode === node) {
								//same element
								return null;
							}
							if (node.firstChild && !skipChildren) {
								return node.firstChild;
							}
							if (!node.parentNode){
								return null;
							}
							return node.nextSibling || getNextNode(node.parentNode, endNode, true);
						};

						var nodes = [];

						if(startNode && startNode.tagName && startNode.tagName.toUpperCase() === 'SPAN') {
							//add start-container
							nodes.push(startNode);
						}

						//get elements between start-container and end-container
						while ((startNode = getNextNode(startNode, endNode)) && (startNode !== endNode)){
							if(startNode && startNode.tagName && startNode.tagName.toUpperCase() === 'SPAN') {
								nodes.push(startNode);
							}
						}

						if(startNode && startNode.tagName && startNode.tagName.toUpperCase() === 'SPAN') {
							//add end-container
							nodes.push(endNode);
						}

						return nodes;
					};

					function checkIfExistFontSizeInElement(elem) {
						//exist an elem
						if(elem && elem.style) {
							elem.style.fontSize = addFontSizeType(scope.fontSize.size);
						}
					}

					scope.setFontColor = function () {
						scope.format('forecolor', _.padStart(scope.fontColor.toString(16), 7, '#000000'));
					};

					scope.setHiliteColor = function () {
						scope.format('hiliteColor', _.padStart(scope.hiliteColor.toString(16), 7, '#000000'));
					};

					scope.onVariableChanged = function (itemId, itemOptions) {
						var range = getWindowSelectionRange();
						if (range && isCursorInCurrentEditor() && itemId > 0) {
							var item = itemOptions.value;
							document.execCommand('insertText', false, item.Code);
						}
					};

					scope.tableOperations = {
						showTableMenuItem: showTableMenuItem,
						showOrHideInitInput: showOrHideTableInitInput,
						showOrHideDeleteList: showOrHideTableDeleteList,
						insertTable: insertTable,
						insertColumns: insertColumns,
						insertRow: insertRow,
						deleteRow: deleteRow,
						deleteColumns: deleteColumns,
						deleteSelectedCells: deleteSelectedCells,
						columnInput: 2,
						rowInput : 2,
						columns : [1, 2, 3, 4, 5],
						rows : [1, 2, 3, 4, 5, 6]
					};

					function showTableMenuItem(event){
						createTableMenuItems(event.currentTarget.parentElement);
					}

					function showOrHideTableInitInput(event, show){
						var initInputElem = angular.element('form.wysiwyg.tb-table-init-input');
						if(event){
							if(initInputElem[0].contains(event.target)){
								return;
							}
						}
						if(angular.isUndefined(show)){
							if(initInputElem.css('display') === 'block'){
								show = false;
							}else{
								show = true;
							}
						}
						if (show) {
							showRowInputForm(initInputElem);
						}else{
							initInputElem.css('display', 'none');
							resetInitInputForm(initInputElem[0]);
						}
					}

					function showOrHideTableDeleteList(event, show){
						var deleteListElem = angular.element('ul.wysiwyg.tb-table-delete-list');
						if(event){
							if(deleteListElem[0].contains(event.target)){
								return;
							}
						}
						if(angular.isUndefined(show)){
							if(deleteListElem.css('display') === 'table'){
								show = false;
							}else{
								show = true;
							}
						}
						if(show){
							showTableDeleteList(deleteListElem);
						}else{
							deleteListElem.css('display', 'none');
						}
					}

					function showTableDeleteList(target){
						var topElem = element.find('li.wysiwyg.tb-table')[0];
						var tbFnDivBounding = topElem.getBoundingClientRect();
						var tbDivParentBounding = topElem.parentElement.getBoundingClientRect();
						var boundingRight = tbDivParentBounding.right - tbFnDivBounding.right;
						var boundingLeft = tbDivParentBounding.left - tbFnDivBounding.left;
						var boundingBottom = textarea[0].getBoundingClientRect().bottom - target[0].parentElement.getBoundingClientRect().bottom; //todo
						var left = boundingRight > 240 ? '120px' : (boundingLeft === 0 ) ? '120px' : '-130px';
						var top = boundingBottom > 45 ? '0' : '-46px';
						target.css('left', left);
						target.css('top', top);
						target.css('display', 'table');
					}

					function showRowInputForm(target){
						var tableRootParentElem = element.find('li.wysiwyg.tb-table')[0];
						var tableBounding = tableRootParentElem.getBoundingClientRect();
						var tableParentBounding = tableRootParentElem.parentElement.getBoundingClientRect();
						var boundingRight = tableParentBounding.right - tableBounding.right;
						var boundingLeft = tableParentBounding.left - tableBounding.left;
						var left = boundingRight > 290 ? '120px' : (boundingLeft === 0) ? '120px' : '-210px';
						target.css('top', '0');
						target.css('left', left);
						target.css('display', 'inline-block');
					}

					function resetInitInputForm(target){
						if(target){
							target.reset();
						}
						scope.tableOperations.columnInput = 2;
						scope.tableOperations.rowInput = 2;
					}

					var tableMenuItemOptions = {
						options: {attrs: {class: 'wysiwyg tb-table-fn-list', unselectable:'on'}},
						items: [
							{attrs: {class: 'border-bottom wysiwyg tb-table-insert', 'ng-click': 'tableOperations.showOrHideInitInput($event)'}, icon: 'fa fa-table', isIconLeft: true, text: 'Insert Table', action: createInitInputElem},
							{attrs: {'ng-click': 'tableOperations.insertColumns()'}, text: 'Insert Columns'},
							{attrs: {'ng-click': 'tableOperations.insertRow()'}, text: 'Insert Rows'},
							{attrs: {'ng-click': 'tableOperations.insertColumns(true)'}, text: 'Append Columns'},
							{attrs: {class: 'border-bottom', 'ng-click': 'tableOperations.insertRow(true)'}, text: 'Append Rows'},
							{attrs: {class: 'wysiwyg tb-table-delete-cell relative-container', 'ng-click': 'tableOperations.showOrHideDeleteList($event)'}, icon: 'fa fa-caret-right', isIconLeft: false, text: 'Delete Cells',
								subItemOptions:{
									options: {attrs: {class: 'wysiwyg tb-table-delete-list'}},
									items:[
										{attrs: {'ng-click': 'tableOperations.deleteSelectedCells()'}, text: 'Delete Selected Cell'},
										{attrs: {'ng-click': 'tableOperations.deleteRow()'}, text: 'Delete Rows'},
										{attrs: {'ng-click': 'tableOperations.deleteColumns()'}, text: 'Delete Columns'}
									]}
							}
						]};

					function createTableMenuItems(parentElement){
						var mask = createMask(bcClickForTable);
						var tableOperationsElem = createMenuItems(tableMenuItemOptions);
						var boundingRect = parentElement.getBoundingClientRect();
						tableOperationsElem.css({
							position: 'absolute',
							top: boundingRect.top + boundingRect.height + 'px',
							left: boundingRect.left + 'px'
						});
						$compile(tableOperationsElem)(scope);
						mask.append(tableOperationsElem);
					}

					function createMenuItems(menuItemOptions){
						if(!menuItemOptions || !menuItemOptions.items || menuItemOptions.items.length === 0){
							return null;
						}
						var ul = angular.element('<ul></ul>');
						if(menuItemOptions.options && menuItemOptions.options.attrs){
							for(var i in menuItemOptions.options.attrs){
								if(menuItemOptions.options.attrs.hasOwnProperty(i)) {
									ul.attr(i, menuItemOptions.options.attrs[i]);
								}
							}
						}
						menuItemOptions.items.forEach(function(menuItem){
							var li = angular.element('<li></li>');
							if(menuItem.attrs){
								for(var i in menuItem.attrs){
									if(i === 'title'){
										li.attr(i, $translate.instant(menuItem.attrs[i]));
									}
									else{
										li.attr(i, menuItem.attrs[i]);
									}
								}
							}
							var icon = null;
							var text = angular.element('<span>' + menuItem.text +'</span>');
							if(menuItem.icon){
								icon = angular.element('<span class="icon"><i class="' + menuItem.icon + '"></i></span>');
							}
							if(icon && menuItem.isIconLeft){
								li.append(icon);
								li.append(text);
							}else if(icon){
								li.append(text);
								li.append(icon);
							}else{
								li.append(text);
							}
							if(menuItem.subItemOptions){
								var subItem = createMenuItems(menuItem.subItemOptions);
								if(subItem){
									li.append(subItem);
								}
							}
							if(angular.isFunction(menuItem.action)){
								menuItem.action(li);
							}
							ul.append(li);
						});
						return ul;
					}

					function createInitInputElem(parentElem){
						var form = angular.element('<form class="wysiwyg tb-table-init-input" unselectable="on">' +
								'<label>Rows:&nbsp;</label><select name="row-input" unselectable="on" ng-model="tableOperations.rowInput" ng-options="f for f in tableOperations.rows"></select>' +
								'<label>Columns:&nbsp;</label><select name="column-input" unselectable="on" ng-model="tableOperations.columnInput" ng-options="f for f in tableOperations.columns" ></select>' +
								'<button class="btn" name="table-insert" ng-click="tableOperations.insertTable()">OK</button>' +
								'</form>');

						parentElem.append(form);
					}

					function createMask(clickAction){
						var mask = angular.element('<div class="bc-context-menu"></div>');
						mask.css({
							width: '100%',
							height: '100%',
							position: 'absolute',
							top: 0,
							left: 0,
							zIndex: 9999,
							overflow: 'hidden'
						});
						mask.on('click', clickAction);
						angular.element('body').append(mask);
						return mask;
					}

					function bcClickForTable(event){
						var elem = angular.element('ul.wysiwyg.tb-table-fn-list');
						if(!elem[0] || !elem[0].contains(event.target)){
							event.currentTarget.remove();
						}
					}

					//insert table.
					function insertTable() {
						var selection = $window.getSelection();
						var anchorContainer = selection.anchorNode;
						var focusContainer = selection.focusNode;
						var editArea = textarea[0];
						if (editArea.contains(anchorContainer) && editArea.contains(focusContainer)) {
							$window.document.execCommand('insertText', false, '');
							var row = scope.tableOperations.rowInput;
							var column = scope.tableOperations.columnInput;
							if (row > 0 && column > 0) {
								var htmlTb = $window.document.createElement('table');
								var range = selection.getRangeAt(0);
								for (var i = 0; i < row; i++) {
									var newRow = htmlTb.insertRow(i);
									for (var j = 0; j < column; j++) {
										var newCell = newRow.insertCell(j);
										setCssStyle4Cell(newCell);
									}
								}
								htmlTb.style['border-collapse'] = 'collapse';
								htmlTb.style['width'] = '100%';
								htmlTb.style['resize'] = 'both';
								htmlTb.style['word-break'] = 'keep-all';
								range.insertNode(htmlTb);
								selection.setPosition(htmlTb.rows[0].cells[0], 0);
							}
						}
						showOrHideTableInitInput(null, false);
					}

					function isCursorInCurrentEditor(){
						var editArea = textarea[0];
						var range = getWindowSelectionRange();
						if(!range){
							return false;
						}

						//in IE, range.startContainer.parentElement is undefined. Node.contains(textNode) will return false.
						return (editArea.contains(range.startContainer) && editArea.contains(range.endContainer)) ||
								(editArea.contains(range.startContainer.parentNode) && editArea.contains(range.endContainer.parentNode));
					}

					//insert table cell.
					//@parameter: append, if it is false, insert before current columns. else append to current columns.
					function insertColumns(append) {
						var selection = $window.getSelection();
						var anchorContainer = selection.anchorNode;
						var focusContainer = selection.focusNode;
						var editArea = textarea[0];
						if (editArea.contains(anchorContainer) && editArea.contains(focusContainer)) {
							var result = findSelectionParentsFromTable(selection.anchorNode, editArea);
							var parentEle = result.tbEle;
							if (!parentEle || parentEle.tagName !== 'TABLE') {
								return;
							}
							var trEle = result.trEle;
							var tdEle = result.tdEle;
							//if trEle has value, it depends on selection position.
							//same for tdEle.
							var rowIndex = trEle ? trEle.rowIndex : 0; //todo
							var cellIndex = tdEle ? tdEle.cellIndex : 0; //todo
							if (append) {
								if (!trEle) {
									rowIndex = parentEle.rows.length - 1;
								}
								if (!tdEle) {
									cellIndex = parentEle.rows[rowIndex].cells.length;
								} else {
									cellIndex += 1;
								}
							}
							var rows = parentEle.rows;
							for (var i = 0; i < rows.length; i++) {
								var curRow = rows[i];
								var newCell = null;
								//there may be different cell length of rows.
								//some is shorter, some is longer.
								if (cellIndex >= curRow.cells.length) {
									newCell = curRow.insertCell(curRow.cells.length);
								} else {
									newCell = curRow.insertCell(cellIndex);
								}
								setCssStyle4Cell(newCell);
							}
							selection.setPosition(rows[rowIndex].cells[cellIndex], 0);
						}
					}

					//insert table row.
					//@parameter: 'append', if it is false, it will insert before current row. other wise, append to current row.
					function insertRow(append) {
						var selection = $window.getSelection();
						var anchorContainer = selection.anchorNode;
						var focusContainer = selection.focusNode;
						var editArea = textarea[0];
						if (editArea.contains(anchorContainer) && editArea.contains(focusContainer)) {
							var result = findSelectionParentsFromTable(selection.anchorNode, editArea);
							var parentEle = result.tbEle;
							if (!parentEle || parentEle.tagName !== 'TABLE') {
								return;
							}
							var trEle = result.trEle;
							var tdEle = result.tdEle;
							//if selection is not on td, default next selection position to the first of tr.
							var cellIndex = tdEle ? tdEle.cellIndex : 0;
							//if selection position is not on any tr, default to insert to the last of a table.
							var rowIndex = trEle ? trEle.rowIndex : 0; //parentEle.rows.length
							trEle = parentEle.rows[rowIndex];
							if (append) {
								if (!trEle) {
									rowIndex = parentEle.rows.length;
									trEle = parentEle.rows[rowIndex];
								} else {
									rowIndex += 1;
								}
							}
							var cellLength = trEle.cells.length;
							var newRow = parentEle.insertRow(rowIndex);
							for (var i = 0; i < cellLength; i++) {
								var newCell = newRow.insertCell(i);
								setCssStyle4Cell(newCell);
							}
							//set next selection position.
							selection.setPosition(newRow.cells[cellIndex], 0);
						}
					}

					//delete table row.
					function deleteRow() {
						var selection = $window.getSelection();
						var anchorContainer = selection.anchorNode;
						var focusContainer = selection.focusNode;
						var editArea = textarea[0];
						if (editArea.contains(anchorContainer) && editArea.contains(focusContainer)) {
							var result = findSelectionParentsFromTable(selection.anchorNode, editArea);
							var parentEle = result.tbEle;
							var trEle = result.trEle;
							var tdEle = result.tdEle;
							//it can delete tr only when the selection position is on some specific tr.
							if (!trEle || !parentEle || parentEle.tagName !== 'TABLE') {
								return;
							}
							//currently, only one tr, then delete the whole tb.
							var rowsLength = parentEle.rows.length;
							if (rowsLength === 1) {
								parentEle.parentElement.removeChild(parentEle);
								return;
							}
							var rowIndex = trEle.rowIndex;
							var cellIndex = tdEle ? tdEle.cellIndex : 0;
							parentEle.deleteRow(rowIndex);
							//set next selection position.
							if (rowIndex >= parentEle.rows.length) {
								rowIndex = parentEle.rows.length - 1;
							}
							selection.setPosition(parentEle.rows[rowIndex].cells[cellIndex], 0);
						}
					}

					//delete table column.
					function deleteColumns() {
						var selection = $window.getSelection();
						var anchorContainer = selection.anchorNode;
						var focusContainer = selection.focusNode;
						var editArea = textarea[0];
						if (editArea.contains(anchorContainer) && editArea.contains(focusContainer)) {
							var result = findSelectionParentsFromTable(selection.anchorNode, editArea);
							var parentEle = result.tbEle;
							var trEle = result.trEle;
							var tdEle = result.tdEle;
							//it can delete tds only selection position is in some specific td.
							if (!tdEle || !trEle || !parentEle || parentEle.tagName !== 'TABLE') {
								return;
							}
							var rows = parentEle.rows;
							//if the length is the same number and is 1, then delete the whole table.
							var sameCellLength = rows[0].cells.length;
							for (var j = 1; j < rows.Length; j++) {
								if (rows[j].cells.length !== sameCellLength) {
									sameCellLength = 2;
									break;
								}
							}
							if (sameCellLength === 1) {
								parentEle.parentElement.removeChild(parentEle);
								return;
							}
							var rowIndex = trEle.rowIndex;
							var cellIndex = tdEle.cellIndex;
							for (var k = rows.length - 1; k >= 0; k--) {
								var curRow = rows[k];
								var curCells = curRow.cells;
								var curCellLength = curCells.length;
								//delete td if the same cell index to selection position.
								if (curCellLength > cellIndex) {
									curRow.deleteCell(cellIndex);
								}
								//delete tr if it has no any td.
								curCellLength = curRow.cells.length;
								if (curCellLength === 0) {
									parentEle.deleteRow(curRow.rowIndex);
								}
							}
							//set next selection position.
							rowIndex = rowIndex >= parentEle.rows.length ? parentEle.rows.length - 1 : rowIndex;
							cellIndex = cellIndex === 0 ? 0 : cellIndex - 1;
							selection.setPosition(parentEle.rows[rowIndex].cells[cellIndex], 0);
						}
					}

					//delete table selected cells.
					function deleteSelectedCells() {
						var selection = $window.getSelection();
						var anchorContainer = selection.anchorNode;
						var focusContainer = selection.focusNode;
						var editArea = textarea[0];
						if (editArea.contains(anchorContainer) && editArea.contains(focusContainer)) {
							var result = findSelectionParentsFromTable(selection.anchorNode, editArea);
							var parentEle = result.tbEle;
							var trEle = result.trEle;
							var tdEle = result.tdEle;
							//it can delete tds only selection position is in some specific td.
							if (!tdEle || !trEle || !parentEle || parentEle.tagName !== 'TABLE') {
								return;
							}
							var rowIndex = trEle.rowIndex;
							var cellIndex = tdEle.cellIndex;
							for (var k = parentEle.rows.length - 1; k >= 0; k--) {
								for (var i = parentEle.rows[k].cells.length - 1; i >= 0; i--) {
									if (selection.containsNode(parentEle.rows[k].cells[i], true)) {
										parentEle.rows[k].deleteCell(parentEle.rows[k].cells[i].cellIndex);
									}
								}
								if (parentEle.rows[k].cells.length === 0) {
									parentEle.deleteRow(parentEle.rows[k].rowIndex);
								}
							}
							if (parentEle.rows.length === 0) {
								parentEle.parentElement.removeChild(parentEle);
								return;
							}
							//set next selection position.
							rowIndex = rowIndex >= parentEle.rows.length ? parentEle.rows.length - 1 : rowIndex;
							var row = parentEle.rows[rowIndex];
							cellIndex = cellIndex >= row.cells.length ? row.cells.length - 1 : cellIndex;
							selection.setPosition(parentEle.rows[rowIndex].cells[cellIndex], 0);
						}
					}

					//it is for table. add style for new td tag.
					function setCssStyle4Cell(newCell){
						newCell.style['width'] = 'auto';
						newCell.style['height'] = '20px';
						newCell.style['min-width'] = '30px';
						newCell.style['min-height'] = '15px';
						newCell.style.padding = '3px';
						newCell.style.border = 'solid 1px rgba(99, 99, 99, .8)';
					}
					//it is for table, find the the parent elements of selection, would includ td, tr, table tag.
					//it is helpful when operate a table.
					function findSelectionParentsFromTable(parentEle, editArea){
						var result = {};
						while (parentEle.tagName !== 'TABLE' && editArea.contains(parentEle)) {
							if (parentEle.tagName === 'TR') {
								result.trEle = parentEle;
							}
							if (parentEle.tagName === 'TD') {
								result.tdEle = parentEle;
							}
							parentEle = parentEle.parentElement;
						}
						result.tbEle = parentEle;
						return result;
					}

					/* step for IE11 and Safari.
					 *  Changements in colorpicker html-markup
					 */
					if (globals.useColorPicker) {
						//disabled Text
						element.find('.wysiwyg-fontlabel').css('display', 'none');

						//replace dropdown-icons
						element.find('#wysiwyg-tb-fontcolor').find('.caret').removeClass('caret').addClass('fa fa-font');
						element.find('#wysiwyg-tb-highlightcolor').find('.caret').removeClass('caret').addClass('fa fa-pencil');
					}

					scope.format('enableobjectresizing', true);
					scope.format('styleWithCSS', true);

					function setDefaultFontFamilyAndSize() {
						setDefaultFont();
						scope.updateFontText();
						setDefaultFontSize();
						scope.updateFontSizeText();
					}

					// model -> view
					ngModelController.$render = function () {
						//switch between the HTML Editors
						setDefaultFontFamilyAndSize();
						//set to defaultvalue
						isFontSizeSelectedFromSelectBox = false;
						isFontFamilySelectedFromSelectBox = false;
						textarea.html(ngModelController.$viewValue);
						//add resizable fn for the images
						createImageresizeable();
					};
				}
			};
		}]);