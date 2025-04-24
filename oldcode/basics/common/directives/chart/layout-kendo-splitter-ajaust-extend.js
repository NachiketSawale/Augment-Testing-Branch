/**
 * Directive call: data-platform-kendo-splitter-adjust
 * Optional:
 * option="{panes: [ { collapsible: true, size: '20%' },{ collapsible: true, size: '80%' }],orientation:'horizontal'}"
 *          --> Adjust the side of both sides.
 *          --> Default size: 50%. Variable 'defaultPanesConfig'.
 */

// will remove later
(function () {
	'use strict';

	function kendoSplitterAdjust($timeout, platformGridAPI, $) {
		return {
			restrict: 'A',
			scope: {
				option: '='
			},
			link: function (scope, elem) {

				// Default size when no size is specified explicity
				const defaultPanesConfig = {
					panes: [{collapsible: true, size: '50%'}, {collapsible: true, size: '50%'}],
					orientation: 'horizontal'
				};
				// init config
				const panesConfig = scope.option ? scope.option : defaultPanesConfig;

				let splitter = elem.closest('.k-splitter');
				const _gridItems = [];

				// For the container in which the splitter needs to be initialized later. modal-dialog for example
				let _withDelay = false;

				// check if splitter-html--markup in DOM.
				if (splitter.length < 1) {
					$timeout(function () {
						// splitter = elem.kendoSplitter(panesConfig);
						_withDelay = true;
						initKendoSplitterContainer();
					}, 50); // --> minimum 50. because LazyLoad-function
				} else {
					initKendoSplitterContainer();
				}

				function initKendoSplitterContainer() {

					// init kendo splitter
					// noinspection JSUnresolvedFunction
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
					splitter.data('kendoSplitter').bind('resize', function () {
						resizePlatformGrid();
						scope.$emit('splitter.ResizeChanged', {});
					});
				}

				function setGridIdsInSplitteContainer() {

					const platformGridsContainer = $(elem).find('.platformgrid');

					angular.forEach(platformGridsContainer, function (item) {
						angular.forEach(item.classList, function (gridcssclass) {
							if (gridcssclass.length === 32) {
								if (platformGridAPI.grids.exist(gridcssclass)) {
									_gridItems.push(gridcssclass);
								}
							}
						});
					});
				}

				function setPlatformGridAPIEventsRegister() {
					if (_gridItems.length > 0) {
						angular.forEach(_gridItems, function (item) {
							platformGridAPI.events.register(item, 'onColumnsResized', onColumnsResized);
						});
					}
				}

				function resizePlatformGrid() {
					if (_gridItems.length > 0) {
						angular.forEach(_gridItems, function (item) {
							platformGridAPI.grids.resize(item);
						});
					}
				}

				function onColumnsResized() {
					resizePlatformGrid();
				}

				// nur für modal dialoge
				scope.$on('$destroy', function () {
					splitter.unbind('resize');
					if (_withDelay && (_gridItems.length > 0)) {
						angular.forEach(_gridItems, function (item) {
							platformGridAPI.events.unregister(item, 'onColumnsResized', onColumnsResized);
						});
					}
				});
			}
		};
	}

	angular.module('basics.common').directive('commonKendoSplitterAdjustExtend', ['$timeout', 'platformGridAPI', '$', kendoSplitterAdjust]);
})();