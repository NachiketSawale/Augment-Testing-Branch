angular.module('platform')
	.directive('platformModalDraggable', ['$document', '$timeout', function ($document, $timeout) {
		'use strict';

		return function (scope, element) {
			let startX = 0, startY = 0, x = 0, y = 0;
			let overElement = false;
			console.log('initialize false');

			element.css({
				position: 'relative'
			});

			element.on('mousedown', function (event) {
				// Prevent default dragging of selected content
				// event.preventDefault();

				if (overElement) {
					startX = event.clientX;
					startY = event.clientY;
					x = event.currentTarget.offsetLeft;
					y = event.currentTarget.offsetTop;
					element.addClass('move');
					$document.on('mousemove', mousemove);
					$document.on('mouseup', mouseup);
				}
			});

			function mousemove(event) {

				y += event.clientY - startY;
				x += event.clientX - startX;
				startX = event.clientX;
				startY = event.clientY;
				element.css({
					top: y + 'px',
					left: x + 'px',
					margin: 'unset'
				});

			}

			function mouseup() {
				element.removeClass('move');
				$document.off('mousemove', mousemove);
				$document.off('mouseup', mouseup);
			}

			function getHeaderElement(dialogElement) {
				return dialogElement.find('.modal-header')[0];
			}

			function getFooterElement(dialogElement) {
				return dialogElement.find('.modal-footer')[0];
			}

			function getMouseHandler() {
				return function mouseHandler(e) {
					switch (e.type) {
						case 'mouseout':
							overElement = false;
							break;
						case 'mouseover':
							overElement = !angular.element(e.target).closest('button').length;
							break;
					}
				};
			}

			function addEventListener(element) {
				if (element) {
					element.addEventListener('mouseout', getMouseHandler(element));
					element.addEventListener('mouseover', getMouseHandler(element));
				}
			}

			function prepareElements() {
				addEventListener(getHeaderElement(element));
				addEventListener(getFooterElement(element));
			}

			// timeout because the header is implemented with ng-include and its therefore not instantly available
			$timeout(function () {
				prepareElements();
			}, 200);
		};
	}]);
