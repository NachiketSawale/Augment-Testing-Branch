/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc directive
	 * @name model.resizable.directive:modelViewerPlatformResizableOverlay
	 * @require
	 * @element div
	 * @restrict EA
	 * @description resizable accordion container.
	 */
	const moduleName = 'platform';
	angular.module(moduleName).directive('resizableOverlay',
		resizableOverlay);

	resizableOverlay.$inject = ['$'];

	function resizableOverlay($) {
		return {
			restrict: 'EA',
			transclude: true,
			scope: {resizableOverlayDir: '=data'},
			template:
				'<div id="transparentContainer" ng-if="isDragging"></div>' +
				'<div id="resizableWrapper">' +
				'<div class="control-container">' +
				'<div class="control-icons ico-resize block-image resize-icon"></div>' +
				'<button data-toggle="collapse" href="#resizableDiv" ng-mouseup="minimizeDiv()" class="collapse-button control-icons ico-arrow-down block-image collapsed"></button>' +
				'</div>' +
				'<div id="resizableDiv" class="resizable" ng-class="resizableOverlayDir.collapsed? \'collapse hide\' :\'collapse show\'">' +
				'  <ng-transclude></ng-transclude>' +
				'  <div class="resizers">' +
				'    <div class="resizer top-left" ng-show="resizableOverlayDir.resizingPoints.topLeft"></div>' +
				'    <div class="resizer top-right" ng-show="resizableOverlayDir.resizingPoints.topRight"></div>' +
				'    <div class="resizer bottom-left" ng-show="resizableOverlayDir.resizingPoints.bottomLeft"></div>' +
				'    <div class="resizer bottom-right" ng-show="resizableOverlayDir.resizingPoints.bottomRight"></div>' +
				'  </div>' +
				'</div>' +
				'</div>',
			link:
				{
					pre: function (scope) {
						const div = '.resizable';
						const element = document.querySelector(div);
						const resizers = document.querySelectorAll(div + ' .resizer');
						const minimumSize = scope.resizableOverlayDir.minimumSize;
						const maximumSize = scope.resizableOverlayDir.maximumSize;
						let originalWidth = 0;
						let originalHeight = 0;
						let originalX = 0;
						let originalY = 0;
						let originalMouseX = 0;
						let originalMouseY = 0;
						let adjustedWidth;
						let adjustedHeight;
						makeResizableDiv();

						function makeResizableDiv() {
							for (let i = 0; i < resizers.length; i++) {
								const currentResizer = resizers[i];
								currentResizer.addEventListener('mousedown', activateResizingPoint);
							}
						}

						function activateResizingPoint(e) {
							e.preventDefault();
							originalWidth = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
							originalHeight = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
							originalX = element.offsetLeft;
							originalY = element.offsetTop;
							originalMouseX = e.pageX;
							originalMouseY = e.pageY;
							const wrapperDiv = document.getElementById('resizableWrapper');
							wrapperDiv.parentElement.addEventListener('mousemove', resize);
							wrapperDiv.parentElement.addEventListener('mouseup', stopResize);
						}

						function resize(e) {
							scope.isDragging = true;
							if (scope.resizableOverlayDir.resizingPoints.bottomRight) {
								const width = originalWidth + (e.pageX - originalMouseX);
								const height = originalHeight + (e.pageY - originalMouseY);
								if (maximumSize > width && width > minimumSize) {
									element.style.width = width + 'px';
									scope.resizableOverlayDir.width = width;
									if (scope.resizableOverlayDir.aspectRatio) {
										adjustedHeight = height * (scope.resizableOverlayDir.aspectRatio);
										element.style.height = adjustedHeight + 'px';
										scope.resizableOverlayDir.height = adjustedHeight;
									} else {
										element.style.height = height + 'px';
										scope.resizableOverlayDir.height = height;
									}

								}
								if (maximumSize > height && height > minimumSize) {
									element.style.height = height + 'px';
									scope.resizableOverlayDir.height = height;
									scope.resizableOverlayDir.width = width;

									if (scope.resizableOverlayDir.aspectRatio) {
										adjustedWidth = width * (1 / scope.resizableOverlayDir.aspectRatio);
										element.style.width = adjustedWidth + 'px';
										scope.resizableOverlayDir.width = adjustedWidth;
									} else {
										element.style.width = width + 'px';
										scope.resizableOverlayDir.width = width;
									}
								}
							} else if (scope.resizableOverlayDir.resizingPoints.bottomLeft) {
								const height = originalHeight + (e.pageY - originalMouseY);
								const width = originalWidth - (e.pageX - originalMouseX);

								if (maximumSize > height && height > minimumSize) {
									element.style.height = height + 'px';
									scope.resizableOverlayDir.height = height;
									scope.resizableOverlayDir.width = width;

									if (scope.resizableOverlayDir.aspectRatio) {
										adjustedWidth = height * (1 / scope.resizableOverlayDir.aspectRatio);
										element.style.width = adjustedWidth + 'px';
										scope.resizableOverlayDir.width = adjustedWidth;
									} else {
										element.style.width = width + 'px';
										scope.resizableOverlayDir.width = width;
									}

								}
								if (maximumSize > width && width > minimumSize) {

									element.style.width = width + 'px';
									scope.resizableOverlayDir.height = height;
									scope.resizableOverlayDir.width = width;

									element.style.left = originalX + (e.pageX - originalMouseX) + 'px';
									scope.resizableOverlayDir.width = width;

									if (scope.resizableOverlayDir.aspectRatio) {
										adjustedHeight = width * scope.resizableOverlayDir.aspectRatio;
										element.style.height = adjustedHeight + 'px';
										scope.resizableOverlayDir.height = adjustedHeight;
									} else {
										element.style.height = height + 'px';
										scope.resizableOverlayDir.height = height;
									}
								}
							} else if (scope.resizableOverlayDir.resizingPoints.topRight) {
								const width = originalWidth + (e.pageX - originalMouseX);
								const height = originalHeight - (e.pageY - originalMouseY);
								if (maximumSize > width && width > minimumSize) {
									element.style.width = width + 'px';
									scope.resizableOverlayDir.width = width;
									scope.resizableOverlayDir.height = height;

									if (scope.resizableOverlayDir.aspectRatio) {
										adjustedHeight = width * scope.resizableOverlayDir.aspectRatio;
										element.style.height = adjustedHeight + 'px';
										scope.resizableOverlayDir.height = adjustedHeight;

									} else {
										element.style.width = height + 'px';
										scope.resizableOverlayDir.height = height;
									}

								}
								if (maximumSize > height && height > minimumSize) {

									element.style.height = height + 'px';
									element.style.top = originalY + (e.pageY - originalMouseY) + 'px';

									scope.resizableOverlayDir.width = width;
									scope.resizableOverlayDir.height = height;

									if (scope.resizableOverlayDir.aspectRatio) {
										adjustedWidth = height * (1 / scope.resizableOverlayDir.aspectRatio);
										element.style.width = adjustedWidth + 'px';
										scope.resizableOverlayDir.width = adjustedWidth;
									} else {
										element.style.width = width + 'px';
										scope.resizableOverlayDir.width = width;
									}

								}
							} else if (scope.resizableOverlayDir.resizingPoints.topLeft) {
								const width = originalWidth - (e.pageX - originalMouseX);
								const height = originalHeight - (e.pageY - originalMouseY);
								if (maximumSize > width && width > minimumSize) {
									element.style.width = width + 'px';
									element.style.left = originalX + (e.pageX - originalMouseX) + 'px';

									scope.resizableOverlayDir.width = width;
									scope.resizableOverlayDir.height = height;

									if (scope.resizableOverlayDir.aspectRatio) {
										adjustedHeight = width * scope.resizableOverlayDir.aspectRatio;
										element.style.height = adjustedHeight + 'px';
										scope.resizableOverlayDir.height = adjustedHeight;
									} else {
										element.style.height = height + 'px';
										scope.resizableOverlayDir.height = height;
									}

								}
								if (maximumSize > height && height > minimumSize) {
									element.style.height = height + 'px';
									element.style.top = originalY + (e.pageY - originalMouseY) + 'px';

									scope.resizableOverlayDir.width = width;
									scope.resizableOverlayDir.height = height;

									if (scope.resizableOverlayDir.aspectRatio) {
										adjustedWidth = height * (1 / scope.resizableOverlayDir.aspectRatio);
										element.style.width = adjustedWidth + 'px';
										scope.resizableOverlayDir.width = adjustedWidth;
									} else {
										element.style.width = width + 'px';
										scope.resizableOverlayDir.width = width;
									}
								}
							}
							scope.resizableOverlayDir.resize();
							scope.$evalAsync();
						}

						function stopResize() {
							scope.isDragging = false;
							const wrapperDiv = document.getElementById('resizableWrapper');
							wrapperDiv.parentElement.removeEventListener('mousemove', resize);
							scope.$evalAsync();

							scope.resizableOverlayDir.saveSettings();

						}

					},
					post: function (scope) {
						const resizableDiv = $('#resizableDiv');
						resizableDiv.on('hide.bs.collapse', function () {
							scope.resizableOverlayDir.collapsed = true;
							scope.resizableOverlayDir.saveSettings();
						});

						resizableDiv.on('show.bs.collapse', function () {
							scope.resizableOverlayDir.collapsed = false;
							scope.resizableOverlayDir.saveSettings();
						});

					}
				}
		};
	}
})(angular);
