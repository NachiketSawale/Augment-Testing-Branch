/**
 * Directive call: data-platform-kendo-splitter-adjust
 * Optional:
 * option="{panes: [ { collapsible: true, size: '20%' },{ collapsible: true, size: '80%' }],orientation:'horizontal'}"
 *          --> Adjust the side of both sides.
 *          --> Default size: 50%. Variable 'defaultPanesConfig'.
 */

(function () {
	'use strict';

	function kendoSplitterAdjust($timeout, platformGridAPI, _) {
		return {
			restrict: 'A',
			scope: {
				option: '=',
				onResize: '<'
			},
			link: function (scope, elem) {

				// Default size when no size is specified explicity
				var defaultPanesConfig = {panes: [{collapsible: true, size: '50%'}, {collapsible: true, size: '50%'}], orientation: 'horizontal'};
				// init config
				var panesConfig = scope.option ? scope.option : defaultPanesConfig;

				var splitter = elem.closest('.k-splitter');
				var _gridItems = [];

				// For the container in which the splitter needs to be initialized later. modal-dialog for example
				var _withDelay = false;

				// check if splitter-html--markup in DOM.
				if (splitter.length < 1) {
					$timeout(function () {
						// splitter = elem.kendoSplitter(panesConfig);
						_withDelay = true;
						initKendoSplitterContainer();
					}, 60); // --> minimum 50. because LazyLoad-function
				} else {
					initKendoSplitterContainer();
				}

				function initKendoSplitterContainer() {

					/*
					ALM#131005.
					the splitter doesn't get the full width of the dialog because the modal dialog has a vertical scroller.
					If the splitter divides the containers, the width (scroller-width) on the right side is empty.
					The native scroller is therefore hidden. 
					 */
					if(elem.parents('.modal-body').length > 0) {
						elem.parents('.modal-body').addClass('overflow-hidden');
					}

					// init kendo splitter
					splitter = elem.kendoSplitter(panesConfig);

					/*
					 Find possibly grids. And save in  _gridItems.
					 */
					setGridIdsInSplitteContainer();

					if (_withDelay) {
						// in modal-dialogs grids columns have no Resize event. Ad manually
						setPlatformGridAPIEventsRegister();
					}

					// rize grid-form
					resizePlatformGrid();

					// resize grid, if splitter moved
					if (splitter.data('kendoSplitter')) {
						splitter.data('kendoSplitter').bind('resize', function () {
							// resize gridform
							resizePlatformGrid();
							if (_.isFunction(scope.onResize)) {
								scope.onResize({
									splitterType: 'kendo',
									splitter: splitter.data('kendoSplitter')
								});
							}
						});
					}

					elem.parents('.modal-body').removeClass('overflow-hidden');
				}

				function resizeKendoContainer() {
					var modalHeaderHeight = 43;
					var modalFooterHeight = 62;
					var diffInnerBodyHeight = 28; // margin - padding - border
					var newModalBodyHeight = angular.element(elem).parents('.modal-content').height() - modalHeaderHeight - modalFooterHeight - diffInnerBodyHeight;

					/*
					 All containers with the css-class 'exclude-resize' are also deducted from the height.
					 The remaining height is for the resizing.
					 */
					$('.modal-content .exclude-resize').each(function () {
						newModalBodyHeight -= $(this).outerHeight(true);
					});

					if (newModalBodyHeight) {
						angular.element(elem).children('.k-pane').height(newModalBodyHeight);
						angular.element(elem).children('.k-splitbar').height(newModalBodyHeight);
					}
				}

				function setGridIdsInSplitteContainer() {

					var platformGridsContainer = $(elem).find('.platformgrid');

					angular.forEach(platformGridsContainer, function (item) {
						if (item.id && platformGridAPI.grids.exist(item.id)) {
							_gridItems.push(item.id);
						}
					});
				}

				function setPlatformGridAPIEventsRegister() {
					if (splitter.data('kendoSplitter') && _gridItems.length > 0) {
						angular.forEach(_gridItems, function (item) {
							platformGridAPI.events.register(item, 'onColumnsResized', onColumnsResized);
						});
					}
				}

				function resizePlatformGrid() {
					if (splitter.data('kendoSplitter') && _gridItems.length > 0) {
						angular.forEach(_gridItems, function (item) {
							platformGridAPI.grids.resize(item);
						});
					}
				}

				function onColumnsResized() {
					resizePlatformGrid();
				}

				scope.$on('resizeKendoSplitter', function () {
					resizeKendoContainer();
				});

				scope.$on('$destroy', function () {
					splitter.unbind('resize');
					// nur für modal dialoge
					if (_withDelay && (_gridItems.length > 0)) {
						angular.forEach(_gridItems, function (item) {
							platformGridAPI.events.unregister(item, 'onColumnsResized', onColumnsResized);
						});
					}
				});
			}
		};
	}

	angular.module('platform').directive('platformKendoSplitterAdjust', ['$timeout', 'platformGridAPI', '_',
		kendoSplitterAdjust]);
})();