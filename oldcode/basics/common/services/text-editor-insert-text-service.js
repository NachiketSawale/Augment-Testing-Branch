/**
 * Created by chi on 10.23.2020.
 */
(function (angular) {

	'use strict';

	const moduleName = 'basics.common';

	/**
	 * use to handle inserting text in the text area.
	 */
	angular.module(moduleName).factory('basicsCommonTextEditorInsertTextService', basicsCommonTextEditorInsertTextService);

	basicsCommonTextEditorInsertTextService.$inject = ['$timeout', 'basicsCommonTextFormatConstant', '_'];

	function basicsCommonTextEditorInsertTextService($timeout, basicsCommonTextFormatConstant, _) {
		let excludeTexts = '\f\n\r\t\v';

		return {
			getHandler: getHandler,
			getHtmlHandler: getHtmlHandler,
			getPlainTextHandler: getPlainTextHandler
		};

		function getHandler(options) {
			options = options || {};

			switch (options.textFormat) {
				case basicsCommonTextFormatConstant.specification:
					return getHtmlHandler(options);
				case basicsCommonTextFormatConstant.html:
					return getPlainTextHandler(options);
				default:
					throw new Error('No such kind of text format or text format is missing');
			}
		}

		// ////////////////////////

		function getHtmlHandler(options) {
			let lastSpecificationRange = null;
			let specificationObj = null;
			$timeout(function () {
				if (!specificationObj && options.elementName) {
					specificationObj = document.getElementsByName(options.elementName)[0];
				}

				if (specificationObj) {
					if (!specificationObj.onclick) {
						specificationObj.onclick = function () {
							let selection = getSelection();
							if (selection && selection.rangeCount > 0) {
								lastSpecificationRange = selection.getRangeAt(0);
							}
						};
					}
				}
			});

			let placeHolderHandler = getHtmlPlaceholderHandler(options);
			return {
				insertText: insertTextInSpecification,
				setRange: placeHolderHandler && placeHolderHandler.setRange || _.noop,
				setDeleteRange: placeHolderHandler && placeHolderHandler.setDeleteRange || _.noop
			};

			function insertTextInSpecification(entity, value) {
				if (!entity || !value || !options.elementName) {
					return;
				}
				const selection = getSelection();
				if (!specificationObj) {
					specificationObj = document.getElementsByName(options.elementName)[0];
					if (specificationObj) {
						specificationObj.onclick = function () {
							const selection = getSelection();

							if (selection && selection.rangeCount > 0) {
								lastSpecificationRange = selection.getRangeAt(0);
							}
						};
					}
				}

				if (!specificationObj || !lastSpecificationRange) {
					if (entity.ContentString) {
						entity.ContentString += value;
					} else {
						entity.ContentString = value;
					}
				} else {
					selection.removeAllRanges();
					selection.addRange(lastSpecificationRange);
					pasteHtmlAtCaret(value);
				}
			}
		}

		function getSelection() {
			if (window.getSelection) {
				return window.getSelection();
			} else if (document.selection) {
				return document.selection.createRange();
			}
		}

		function getPlainTextHandler(options) {

			let placeHolderHandler = getPlainTextPlaceholderHandler(options);

			return {
				insertText: insertTextInHtml,
				setRange: placeHolderHandler && placeHolderHandler.setRange || _.noop,
				setDeleteRange: placeHolderHandler && placeHolderHandler.setDeleteRange || _.noop
			};

			function insertTextInHtml(entity, value) {
				if (!entity || !value || !options.elementName) {
					return;
				}

				let plainTextObj = document.getElementsByName(options.elementName)[0];

				if (!plainTextObj) {
					if (entity.PlainText) {
						entity.PlainText += value;
					} else {
						entity.PlainText = value;
					}
				} else {
					let plainTextElem = angular.element(plainTextObj);
					if (plainTextElem && plainTextElem[0]) {
						plainTextElem = plainTextElem[0];
						if (plainTextElem.selectionStart || plainTextElem.selectionStart === '0') {
							let startPos = plainTextElem.selectionStart;
							let endPos = plainTextElem.selectionEnd;
							let scrollTop = plainTextElem.scrollTop;
							plainTextElem.value = plainTextElem.value.substring(0, startPos) + value + plainTextElem.value.substring(endPos, plainTextElem.value.length);
							plainTextElem.selectionStart = plainTextElem.selectionEnd = startPos + value.length;
							plainTextElem.scrollTop = scrollTop;
						} else {
							plainTextElem.value += value;
						}

						entity.PlainText = plainTextElem.value;
					}
				}
			}
		}

		function getHtmlPlaceholderHandler(options) {
			if (!options || !options.prefix || !options.suffix) {
				return null;
			}
			let prefix = options.prefix;
			let suffix = options.suffix;
			let maxSearchLength = options.maxSearchLength || 0;

			return {
				setRange: setRange,
				setDeleteRange: setDeleteRange
			};

			function setRange(keyArrow) {
				if (document.getSelection) {
					let sel = document.getSelection();
					if (sel && sel.rangeCount > 0) {
					let range = sel.getRangeAt(0);
					let baseNode = sel.baseNode || sel.anchorNode;
					let baseOffset = sel.baseOffset || sel.anchorOffset;
					let startNode = range.startContainer;
					let startOffset = range.startOffset;
					let endNode = range.endContainer;
					let endOffset = range.endOffset;
					let direction = 'forward';
					if (baseNode === startNode && baseOffset === startOffset) {
						direction = 'forward';
					} else if (baseNode === endNode && baseOffset === endOffset) {
						direction = 'backward';
					}
					if (startNode === endNode) {
						let newRange = getRangeIncludePlaceholder(startNode.nodeValue, range.startOffset, range.endOffset, prefix, suffix, maxSearchLength, direction, keyArrow);
						if (newRange && newRange.isInRange) {
							if (startOffset === endOffset && newRange.start !== newRange.end) {
								if (keyArrow === 'right') {
									setStartAndEnd(sel, range, endNode, newRange.end, startNode, newRange.start);
								} else if (keyArrow === 'left') {
									setStartAndEnd(sel, range, startNode, newRange.start, endNode, newRange.end);
								} else {
									if (direction === 'forward') {
										setStartAndEnd(sel, range, startNode, newRange.start, endNode, newRange.end);
									} else {
										setStartAndEnd(sel, range, endNode, newRange.end, startNode, newRange.start);
									}
								}
							} else {
								if (direction === 'forward') {
									setStartAndEnd(sel, range, startNode, newRange.start, endNode, newRange.end);
								} else {
									setStartAndEnd(sel, range, endNode, newRange.end, startNode, newRange.start);
								}
							}
						}
					} else {
						let startRange = getRangeIncludePlaceholder(startNode.nodeValue, range.startOffset, startNode.length, prefix, suffix, maxSearchLength, direction, keyArrow);
						let newStartOffset = null;
						if (startRange && startRange.isInRange) {
							newStartOffset = startRange.start;
						}

						let endRange = getRangeIncludePlaceholder(endNode.nodeValue, 0, range.endOffset, prefix, suffix, maxSearchLength, direction, keyArrow);
						let newEndOffset = null;
						if (endRange && endRange.isInRange) {
							newEndOffset = endRange.end;
						}

						if (direction === 'forward') {
							setStartAndEnd(sel, range, startNode, newStartOffset !== null ? newStartOffset : startOffset, endNode, newEndOffset !== null ? newEndOffset : endOffset);
						} else {
							setStartAndEnd(sel, range, endNode, newEndOffset !== null ? newEndOffset : endOffset, startNode, newStartOffset !== null ? newStartOffset : startOffset);
						}
					}
					}
				}
			}

			function findTextNode(node, nextDirection) {
				if (!node || !angular.isString(nextDirection) || (nextDirection !== 'next' && nextDirection !== 'previous')) {
					return null;
				}

				if (node.nodeType === 3) {
					return node;
				}

				let childTextNode = null;
				if (node && angular.isFunction(node.hasChildNodes) && node.hasChildNodes()) {
					let firstNode = node.childNodes[0];
					childTextNode = findTextNode(firstNode, nextDirection);
				}

				if (childTextNode) {
					return childTextNode;
				}

				let nextNode = nextDirection === 'next' ? node.nextSibling : node.previousSibling;
				if (nextNode) {
					return findTextNode(nextNode, nextDirection);
				}

				return null;
			}

			function setDeleteRange(action) {
				if (action !== 'delete' && action !== 'backspace') {
					return;
				}

				if (document.getSelection) {
					let sel = document.getSelection();
					let range = sel.getRangeAt(0);
					let baseNode = sel.baseNode || sel.anchorNode;
					let baseOffset = sel.baseOffset || sel.anchorOffset;
					let startNode = range.startContainer;
					let startOffset = range.startOffset;
					let endNode = range.endContainer;
					let endOffset = range.endOffset;
					let direction = 'forward';
					if (baseNode === startNode && baseOffset === startOffset) {
						direction = 'forward';
					} else if (baseNode === endNode && baseOffset === endOffset) {
						direction = 'backward';
					}
					if (!startNode || !endNode || !(baseNode === startNode && baseNode === endNode && baseOffset === startOffset && baseOffset === endOffset)) {
						return;
					}

					if (startNode.nodeType !== 3 || startNode.nodeValue === null || startNode.nodeValue === undefined) {
						return;
					}
					if (action === 'delete') {
						startOffset++;
						endOffset++;
						if (!angular.isString(startNode.nodeValue[startOffset])) {
							let nextStartNode = findTextNode(startNode.nextSibling, 'next');
							if (nextStartNode) {
								startNode = endNode = nextStartNode;
								startOffset = endOffset = 1;
							}
						}
					} else if (action === 'backspace') {
						startOffset--;
						endOffset--;
						if (!angular.isString(startNode.nodeValue[startOffset])) {
							let previousStartNode = findTextNode(startNode.previousSibling, 'previous');
							if (previousStartNode) {
								startNode = endNode = previousStartNode;
								startOffset = endOffset = startNode.nodeValue.length - 1;
							}
						}
					}
					let newRange = getRangeIncludePlaceholder(startNode.nodeValue, startOffset, endOffset, prefix, suffix, maxSearchLength, direction, null);
					if (newRange && newRange.isInRange) {
						setStartAndEnd(sel, range, startNode, newRange.start, endNode, newRange.end);
					}
				}
			}
		}

		function setStartAndEnd(selection, range, startNode, startOffset, endNode, endOffset) {
			if (!selection || !range) {
				return;
			}

			if (selection.setBaseAndExtent) {
				selection.setBaseAndExtent(startNode, startOffset, endNode, endOffset);
			} else {
				let tempRange = range.cloneRange();
				tempRange.setStart(startNode, startOffset);
				tempRange.setEnd(endNode, endOffset);
				selection.removeAllRanges();
				selection.addRange(tempRange);
			}
		}

		function getPlainTextPlaceholderHandler(options) {
			if (!options || !options.prefix || !options.suffix || !options.elementName) {
				return null;
			}

			let elementName = options.elementName;
			let prefix = options.prefix;
			let suffix = options.suffix;
			let maxSearchLength = options.maxSearchLength || 0;

			return {
				setRange: setRange,
				setDeleteRange: setDeleteRange
			};

			function setRange(keyArrow) {
				let plainTextObj = document.getElementsByName(elementName)[0];
				if (!plainTextObj) {
					return;
				}
				let plainTextElem = angular.element(plainTextObj);
				if (plainTextElem && plainTextElem[0]) {
					plainTextElem = plainTextElem[0];
					if (angular.isDefined(plainTextElem.selectionStart)) {
						let sourceText = plainTextElem.value;
						let selStart = plainTextElem.selectionStart;
						let selEnd = plainTextElem.selectionEnd;
						let direction = plainTextElem.selectionDirection;
						let range = getRangeIncludePlaceholder(sourceText, selStart, selEnd, prefix, suffix, maxSearchLength, direction, keyArrow);
						if (range && range.isInRange) {
							let newDirection = null;
							if (plainTextElem.selectionStart === plainTextElem.selectionEnd && range.start !== range.end) {
								if (keyArrow === 'right') {
									newDirection = 'backward';
								} else if (keyArrow === 'left') {
									newDirection = 'forward';
								}
							}

							plainTextElem.selectionStart = range.start;
							plainTextElem.selectionEnd = range.end;
							if (newDirection) {
								plainTextElem.selectionDirection = newDirection;
							}
						}
					}
				}
			}

			function setDeleteRange(action) {
				if (action !== 'delete' && action !== 'backspace') {
					return;
				}
				let plainTextObj = document.getElementsByName(elementName)[0];
				if (!plainTextObj) {
					return;
				}
				// let selection = getSelection();
				let plainTextElem = angular.element(plainTextObj);
				if (plainTextElem && plainTextElem[0]) {
					plainTextElem = plainTextElem[0];
					if (plainTextElem.setSelectionRange) {
						let sourceText = plainTextElem.value;
						let selStart = plainTextElem.selectionStart;
						let selEnd = plainTextElem.selectionEnd;
						let direction = plainTextElem.selectionDirection;
						if (selStart !== selEnd) {
							return;
						}
						if (action === 'delete') {
							selStart++;
							selEnd++;
						} else if (action === 'backspace') {
							selStart--;
							selEnd--;
						}
						let range = getRangeIncludePlaceholder(sourceText, selStart, selEnd, prefix, suffix, maxSearchLength, direction, null);
						if (range && range.isInRange) {
							plainTextElem.selectionStart = range.start;
							plainTextElem.selectionEnd = range.end;
						}
					}
				}
			}
		}

		function getRangeIncludePlaceholder(source, selStart, selEnd, prefix, suffix, maxSearchLength, direction, keyArrow) {
			if (!source) {
				return {
					isInRange: false,
					start: selStart,
					end: selEnd
				};
			}

			let prefixes = prefix.split('');
			let suffixes = suffix.split('');
			let length = source.length;
			let prefixLength = prefix.length;
			let suffixLength = suffix.length;
			let hasPrefix = false;
			let hasSuffix = false;
			let hasEndFromStart = false;
			let hasStartFromEnd = false;
			let start = selStart - 1;
			let end = selEnd;
			let newStart = null;
			let newEnd = null;
			let endFromStart = null;
			let startFromEnd = null;
			let index = 0;
			let minPosition = maxSearchLength > 0 ? Math.max(selStart - maxSearchLength, 0) : 0;
			let maxPosition = maxSearchLength > 0 ? Math.min(selEnd + maxSearchLength, length) : length;

			while (start >= minPosition) {
				index = 0;
				while (index < prefixLength) {
					if (prefixes[index] === source[start + index]) {
						index++;
					} else {
						break;
					}
				}

				if (index === prefixLength) {
					hasPrefix = true;
					newStart = start;
					break;
				}

				if (excludeTexts.indexOf(source[start]) > -1) {
					break;
				}

				index = suffixLength - 1;
				while (index >= 0) {
					if (suffixes[index] === source[start - (suffixLength - index - 1)]) {
						index--;
					} else {
						break;
					}
				}

				if (index === -1) {
					break;
				}

				start--;
			}

			if (hasPrefix && selStart !== selEnd) {
				start = selStart;

				while (start <= selEnd) {
					if (excludeTexts.indexOf(source[start]) > -1) {
						break;
					}

					index = suffixLength - 1;
					while (index >= 0) {
						if (suffixes[index] === source[start - (suffixLength - index - 1)]) {
							index--;
						} else {
							break;
						}
					}

					if (index === -1) {
						endFromStart = start + 1;
						hasEndFromStart = true;
						break;
					}
					start++;
				}
			}

			while (end <= maxPosition) {
				index = suffixLength - 1;
				while (index >= 0) {
					if (suffixes[index] === source[end - (suffixLength - 1 - index)]) {
						index--;
					} else {
						break;
					}
				}

				if (index === -1) {
					hasSuffix = true;
					newEnd = end + 1;
					break;
				}

				if (excludeTexts.indexOf(source[end]) > -1) {
					break;
				}

				index = 0;
				while (index < prefixLength) {
					if (prefixes[index] === source[end + index]) {
						index++;
					} else {
						break;
					}
				}

				if (index === prefixLength) {
					break;
				}
				end++;
			}

			if (hasSuffix && selStart !== selEnd) {
				end = selEnd - 1;
				while (end >= selStart) {
					if (excludeTexts.indexOf(source[end]) > -1) {
						break;
					}

					index = 0;

					while (index < prefixLength) {
						if (prefixes[index] === source[end + index]) {
							index++;
						} else {
							break;
						}
					}

					if (index === prefixLength) {
						startFromEnd = end;
						hasStartFromEnd = true;
						break;
					}

					end--;
				}
			}

			if (selStart !== selEnd) {
				if (direction === 'forward' && keyArrow === 'right') {
					newEnd = hasStartFromEnd ? startFromEnd : newEnd;
				} else if (direction === 'backward' && keyArrow === 'left') {
					newStart = hasEndFromStart ? endFromStart : newStart;
				}
			}

			return {
				isInRange: (hasPrefix && hasEndFromStart) || (hasStartFromEnd && hasSuffix) || (hasPrefix && hasSuffix),
				start: (hasPrefix && hasEndFromStart) || (hasPrefix && !hasEndFromStart && hasSuffix) ? newStart : selStart,
				end: (hasSuffix && hasStartFromEnd) || (hasSuffix && !hasStartFromEnd && hasPrefix) ? newEnd : selEnd
			};
		}

		/**
		 * This function is similar with "doc.execCommand('insetHTML', false, arg);",
		 * but IE don't support command "insetHTML", so use it instead to get this functionality
		 * work for all browsers.
		 * @param html
	     */
		function pasteHtmlAtCaret(html) {
			let sel, range;
			let doc = document;
			if (window.getSelection) {
				// IE9 and non-IE
				sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					range = sel.getRangeAt(0);
					range.deleteContents();

					// Range.CreateContextualFragment() would be useful here but is
					// only relatively recently standardized and is not supported in
					// some browsers(IE(, for one)
					let el = doc.createElement('div');
					el.innerHTML = html;
					let frag = doc.createDocumentFragment(), node, lastNode;
					while ((node = el.firstChild)) {
						lastNode = frag.appendChild(node);
					}
					let firstNode = frag.firstChild;
					range.insertNode(frag);

					// Preserve the selection
					if (lastNode) {
						range = range.cloneRange();
						range.setStartAfter(lastNode);
						range.collapse(true);
						sel.removeAllRanges();
						sel.addRange(range);
					}
				}
			} else if ((sel = doc.selection) && sel.type !== 'Control') {
				// IE < 9
				let originalRange = sel.createRange();
				originalRange.collapse(true);
				sel.createRange().pasteHTML(html);
			}
		}
	}
})(angular);