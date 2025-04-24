/**
 * Created by uestuenel on 19.11.2015.
 */
(function () {
	'use strict';

	function modaldialogRescale($timeout, $window, platformGridAPI) {
		return {
			restrict: 'A',
			scope: false,
			link: function linkFunc(scope, elem) {

				var dialogMaxHeight = function () {
					return $(window).height() * 0.9;
				};

				var dialogMaxWidth = function () {
					return $(window).width() * 0.9;
				};

				var dialogMinWidth = function () {
					// default min-width: 600px
					return parseInt(scope.$parent.options.minWidth);
				};

				let dialogMinHeight = function () {
					let minHeight = scope.$parent.options.minHeight || 400;
					return parseInt(minHeight);
				};

				initResizable();

				function initResizable() {
					// check if timeout necessary.
					$timeout(function () {
						/*
						 if in the Option-Settings 'resizable' == true, get Modal-Dialog resize-function
						 */
						if (scope.$parent.options && scope.$parent.options.resizeable) {
							rescale();
						}

						/*
							no resizeable function -> show vertical scroll if modal-body to height for window-height
						 */
						setModalBodyMaxHeight(false);
					}, 0);

					angular.element($window).bind('resize', function () {
						setModalBodyMaxHeight(true);
					});
				}

				// if parent is kendo-splitter: all the child get the same height
				function checkParentElementIsSplitter(parentElement) {
					if (angular.element('.jsResizeGrid').hasClass('k-splitter')) {
						$timeout(function () {
							angular.forEach(angular.element('.jsResizeGrid').children(), function (elem) {
								angular.element(elem).height(parentElement.height());
							});
						}, 0);
					}
				}

				function resizeGrids() {
					// check if exist grids in DOM. Yes --> refresh after new window height
					if (getGridsInDialog().length > 0) {

						var newTDHeight;
						// check if used form-configurator
						if (existPlatformFormConfigurator()) {
							newTDHeight = processFreeSpace();
						}

						angular.forEach(getGridsInDialog(), function (item, index) {
							if (newTDHeight !== 0 && index < getCountGrid()) {
								// set new Height
								var parentElement = $('#' + item).parents('.modal-wrapper');
								parentElement.height(parentElement.height() + newTDHeight);

								checkParentElementIsSplitter(parentElement);
							}

							$timeout(function () {
								platformGridAPI.grids.resize(item);
							}, 0);


						});
					}
				}

				function processFreeSpace() {
					var modalBodyElem = angular.element(elem).find('.modal-body');
					var modalBodyHeight = modalBodyElem.height();
					/*
						existPlatformFormConfigurator -> if its true -->  .modal-body has a child. Therefore no if-condition
					 */
					angular.forEach(modalBodyElem.children(), function (value) {
						// if element is shown(not hidden) in the frontend.
						if (angular.element(value).is(':visible')) {
							modalBodyHeight -= angular.element(value).height();
						}
					});

					return modalBodyHeight / getCountGrid();
				}

				function getCountGrid() {
					var element = angular.element(elem).find('.jsResizeGrid');
					if (element.length > 0) {
						return element.length;
					} else {
						return getGridsInDialog().length;
					}
				}

				function existPlatformFormConfigurator() {
					return angular.element(elem).find('[data-platform-form-layout]').length > 0;
				}

				function getGridsInDialog() {
					var platformGridsContainer = angular.element(elem).find('.modal-body .platformgrid');
					var _gridItems = [];

					angular.forEach(platformGridsContainer, function (item) {
						var _ID = angular.element(item).attr('id');
						if (_ID && platformGridAPI.grids.exist(_ID)) {
							_gridItems.push(_ID);
						}
					});

					return _gridItems;
				}

				function rescale() {
					// jqueryui - resizeable
					$(elem).resizable({
						handles: 'se',
						minHeight: dialogMinHeight(),
						maxHeight: dialogMaxHeight(),
						minWidth: dialogMinWidth(),
						maxWidth: dialogMaxWidth(),
						delay: 50,
						resize: function () {
							// set css class for modal-content after resizing
							$(elem).addClass('resizeDialog');

							scope.$broadcast('resizeKendoSplitter');
						}
					});
				}

				function setModalBodyMaxHeight(resized) {
					var offsetBody = angular.element('.modal-header').outerHeight(true) + angular.element('.modal-footer').outerHeight(true);

					angular.element('.modal-body').css('max-height', dialogMaxHeight() - offsetBody);

					if (resized) {
						resizeGrids();
					}
				}
			}
		};
	}

	angular.module('platform').directive('platformModaldialogRescale', ['$timeout', '$window', 'platformGridAPI', modaldialogRescale]);
})();
