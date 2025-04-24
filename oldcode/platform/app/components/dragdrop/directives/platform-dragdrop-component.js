/*
 * $Id: platform-dragdrop-component.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platform.directive:platformDragdropComponent
	 * @element div
	 * @restrict A
	 * @description Forwards drag-and-drop-related events from a UI component to the dragdrop service.
	 */
	angular.module('platform').directive('platformDragdropComponent', ['platformDragdropService', '$timeout', '_', 'platformGridAPI',
		function (platformDragdropService, $timeout, _, platformGridAPI) {
			return {
				restrict: 'A',
				scope: false,
				link: function ($scope, elem, attr) {
					let ddTarget = _.get($scope, attr.platformDragdropComponent);
					let timeOutDragDrop = null;
					let $viewport = null;
					let grid = null;
					let timerSet;

					function onMouseEnter(e) {
						platformDragdropService.mouseEnter(ddTarget, e);
					}

					function onMouseLeave(e) {
						platformDragdropService.mouseLeave(e);
					}

					let onCallbacks = {
						mouseenter: onMouseEnter,
						mouseleave: onMouseLeave
					};

					let dragDropScrollToBottom = function () {
						$viewport.scrollTop($viewport.scrollTop() + 5);
					};

					let dragDropScrollToTop = function () {
						$viewport.scrollTop($viewport.scrollTop() - 5);
					};

					let dragDropToBottom = function (viewportBottomPosition, e) {
						dragDropScrollToBottom();

						timeOutDragDrop = setTimeout(function () {
							/*
							mouse-event from Indicator has been on bottom from grid-container.
							top from last-row: viewportBottomPosition
							bottom from lat row: viewportBottomPosition - 25
							 */
							if ($('#dragIndicator').length > 0 &&
								$('#dragIndicator').hasClass('valid') &&
								$('#dragIndicator').offset().top < viewportBottomPosition &&
								($('#dragIndicator').offset().top > (viewportBottomPosition - 30))) {
								dragDropToBottom(viewportBottomPosition, e);
							}
						}, 200);
					};

					let dragDropToTop = function (e) {
						dragDropScrollToTop();

						timeOutDragDrop = setTimeout(function () {
							/*
							mouse-event from Indicator has been on top from grid-container.
							top from last-row: $viewport.offset().top
							bottom from last row: $viewport.offset().top + 30
							 */
							if ($('#dragIndicator').length > 0 &&
								$('#dragIndicator').hasClass('valid') &&
								$('#dragIndicator').offset().top > $viewport.offset().top &&
								($('#dragIndicator').offset().top < ($viewport.offset().top + 30))) {
								dragDropToTop(e);
							}
						}, 200);
					};

					function clearTimeoutDragDrop() {
						clearTimeout(timeOutDragDrop);
					}

					function handleScrollerWhileDragging(e) {
						let viewportBottomPosition = $viewport.height() + $viewport.offset().top;

						if (e.pageY > (viewportBottomPosition - 30)) {
							dragDropToBottom(viewportBottomPosition, e);
						} else if (e.pageY < ($viewport.offset().top + 30)) {
							dragDropToTop(e);
						} else {
							clearTimeoutDragDrop();
						}
					}

					/*
						the goal is: automatic scrolling when the mouse display is in the upper area(first slick-row) or in the lower area(last slick-row)
					 */
					function onContainerMouseMove(e) {
						if ($('#dragIndicator').length > 0) {
							handleScrollerWhileDragging(e);
						}
					}

					if (ddTarget) {
						timerSet = setTimeout(function () {
							elem.on(onCallbacks);
							grid = platformGridAPI.grids.element('id', ddTarget.id);
							if (grid) {
								$viewport = grid.instance.getViewportNodes(); // viewport is important for the mouse-positions
								platformGridAPI.events.register(ddTarget.id, 'onContainerMouseMove', onContainerMouseMove);
							}
						});
					}

					function onDestroy() {
						if (ddTarget) {
							elem.off(onCallbacks);
							platformGridAPI.events.unregister(ddTarget.id, 'onContainerMouseMove', onContainerMouseMove);
							clearTimeout(timerSet);
							ddTarget = grid = $viewport = null;
						}
					}

					$scope.$on('$destroy', onDestroy);
				}
			};
		}]);
})();
