(function (angular, global, doc) {
	'use strict';

	/* jshint -W072 */
	angular.module('model.wdeviewer').directive('modelWdeviewerPrintLabelEditor', ['keyCodes', 'platformModalService', '$rootScope',
		function (keyCodes, platformModalService, $rootScope) {

			return {
				restrict: 'A',
				scope: {
					submit: '&',
					init: '&',
					maxLength: '@',
					statusOptions: '=',
					entity: '=',
					config: '='
				},
				template: '<div class="section-text-area input-group-content selectable"' +
					' contenteditable="true" data-ng-focus="focus()" data-ng-keydown="onKeyDown($event)" data-ng-click="onClick($event)" ></div>',
				link: function (scope, element) {
					var tempSectionContent = [];
					var textarea = element.find('.section-text-area');
					textarea.attr('id', scope.config.name.toLowerCase());

					scope.focus = function focus() {
						scope.$parent.activeSection = scope.config.section;
						sectionContentChange();
					};

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

					function btnHtml(item) {
						return '<input type="button" id="' + item.id + '" value="X ' + item.value + '" class="btn section-word">';
					}

					function sectionContentChange() {
						var tempEntities = _.filter(scope.config.content, function (item) {
							if (item.title && item.title !== '') {
								return item;
							}
						});
						if (tempSectionContent.length !== tempEntities.length) {
							var insertItem = _.find(tempEntities, function (item) {
								var a = _.find(tempSectionContent, {id: item.id});
								if (a === null || angular.isUndefined(a)) {
									return item;
								}
							});
							if (insertItem) {
								tempSectionContent.push(insertItem);
								textarea.focus(); // focus text area to make it work.
								scope.format('insertHTML', btnHtml(insertItem));
							}
						}
					}

					scope.onKeyDown = function (event) {
						switch (event.keyCode) {
							case keyCodes.ENTER: {
								event.preventDefault();
							}
						}
					};

					scope.onClick = function (event) {
						if (event.target.className === 'btn section-word') {
							scope.config.content = _.filter(scope.config.content, function mapEntity(e) {
								return e.id !== event.target.id;
							});
							tempSectionContent = _.filter(tempSectionContent, function mapEntity(e) {
								return e.id !== event.target.id;
							});
							$(event.target).remove();
						}
						sectionContentChange();
					};

					// view -> model
					textarea.on('blur keyup change', function () {
						scope.$evalAsync(applyViewValue);
					});

					if (angular.isFunction(scope.init)) {
						scope.init();
					}

					function applyViewValue() {
						$rootScope.safeApply(function readViewText() {
							var html = textarea.html();

							if (html === '<br>') {
								html = '';
							}
							updataScopeEntity(html);
							// window.console.log(html);
							// window.console.log(textarea);
						});
					}

					function updataScopeEntity(html) {
						var splitStr = '~$#@!';
						var tempEntity = _.filter(scope.config.content, function (item) {
							if (item.title && item.title !== '') {
								return item;
							}
						});
						_.map(tempEntity, function (item) {
							html = html.replace(btnHtml(item), splitStr + item.value + splitStr);
						});
						var htmlArray = html.split(splitStr);
						htmlArray = _.filter(htmlArray, function (a) {
							return a !== '';
						});
						var id = 0;
						var newArray = _.map(htmlArray, function (item) {
							var entityItem = _.find(tempEntity, function (a) {
								return a.value === item;
							});
							if (entityItem) {
								tempEntity = _.filter(tempEntity, function (a) {
									return a.id !== entityItem.id;
								});
								return entityItem;
							} else {
								id++;
								return {id: id, value: item};
							}
						});
						scope.entity = newArray;
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
		var sel, range;
		if (global.getSelection) {
			// IE9 and non-IE
			sel = global.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();

				// Range.CreateContextualFragment() would be useful here but is
				// only relatively recently standardized and is not supported in
				// some browsers(IE(, for one)
				var el = doc.createElement('div');
				el.innerHTML = html;
				var frag = doc.createDocumentFragment(), node, lastNode;
				while ((node = el.firstChild)) {
					lastNode = frag.appendChild(node);
				}
				var firstNode = frag.firstChild;
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
			var originalRange = sel.createRange();
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
