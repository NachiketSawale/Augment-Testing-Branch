(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonEditorHelperService', commonEditorHelper);

	commonEditorHelper.$inject = [];

	function commonEditorHelper() {

		return {
			addWordWrap: addWordWrap
		};

		/*
		* editContent should be an DOM element.
		* */
		function addWordWrap(editContainer) {
			if (!editContainer) {
				return;
			}
			if (editContainer.children.length === 0 && !editContainer.textContent) {
				editContainer.appendChild(createWordWrapViaDIV());
			}
			let range = getRange();
			if (range) {
				let wordWrap = null;
				const wrapFormat = ensureWordWrapFormat(editContainer);
				if (wrapFormat === 0) {
					wordWrap = createWordWrapViaBR();
					range.insertNode(wordWrap);
				} else if (wrapFormat === 1) {
					wordWrap = createWordWrapViaDIV();
					const relativeElement = findInsertBeforeNode(editContainer);
					if (relativeElement) {
						editContainer.insertBefore(wordWrap, relativeElement);
					} else {
						editContainer.appendChild(wordWrap);
					}
					range = createRangeNode(wordWrap);
				}
				if (wordWrap && range) {
					range.collapse(false);
					wordWrap.scrollIntoView();
				}
			}
		}

		/*
		* create a range and set a selected node.
		* */
		function createRangeNode(node) {
			const range = new Range();
			range.setStart(node, 0);
			range.setEnd(node, 0);
			const selection = window.getSelection();
			selection.removeAllRanges();
			selection.addRange(range);

			return range;
		}

		/*
		* find a node where a new node insert before.
		* */
		function findInsertBeforeNode(editContainer) {
			//
			const rangeNode = getRange();
			let relativeNode = rangeNode.startContainer;
			while (relativeNode !== editContainer && relativeNode.parentElement !== editContainer) {
				relativeNode = relativeNode.parentElement;
			}

			if (relativeNode === editContainer) {
				return null;
			}

			return relativeNode.nextElementSibling;
		}

		/*
		* check and ensure format.
		* if returned value is 0, means '<br>'
		* else if returned value is 1, means '<div><br></div>'
		* */
		function ensureWordWrapFormat(editContainer) {

			const rangeNode = getRange();
			if (!rangeNode || !editContainer) {
				return -1;
			}
			const startContainer = rangeNode.startContainer;
			const endContainer = rangeNode.endContainer;
			const endOffset = rangeNode.endOffset;
			if (startContainer !== endContainer || startContainer.textContent.length > endOffset || (endContainer.nodeType === 3 && endContainer.nextSibling !== null)) {
				return 0;
			}

			return 1;
		}

		/*
		* create <br> as the word wrap.
		* */
		function createWordWrapViaBR() {
			return document.createElement('br');
		}

		/*
		* create <div><br></div> as the word wrap.
		* */
		function createWordWrapViaDIV() {
			const wordWrapDIV = document.createElement('div');
			wordWrapDIV.innerHTML = '<br>';
			return wordWrapDIV;
		}

		/*
		* get range. returned value would be null or Range Object.
		* */
		function getRange() {
			const selection = window.getSelection();
			return selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
		}

	}

})(angular);