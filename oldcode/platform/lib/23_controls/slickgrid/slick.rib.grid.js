/**
 * @license
 * (c) 2009-2013 Michael Leibman
 * michael{dot}leibman{at}gmail{dot}com
 * http://github.com/mleibman/slickgrid
 *
 * Distributed under MIT license.
 * All rights reserved.
 *
 * SlickGrid v2.2
 *
 * NOTES:
 *     Cell/row DOM manipulations are done directly bypassing jQuery's DOM manipulation methods.
 *     This increases the speed dramatically, but can only be done safely because there are no event handlers
 *     or data associated with any cell/row DOM nodes.  Cell editors must make sure they implement .destroy()
 *     and do proper cleanup.
 *
 */

// make sure required JavaScript modules are loaded
if (typeof jQuery === 'undefined') {
	throw 'SlickGrid requires jquery module to be loaded';
}
if (!jQuery.fn.drag) {
	throw 'SlickGrid requires jquery.event.drag module to be loaded';
}
if (typeof Slick === 'undefined') {
	throw 'slick.core.js not loaded';
}

if (!Array.prototype.move) {
	Object.defineProperty(Array.prototype, 'move', {
		value: function (from, to) {
			if (to >= this.length) {
				var k = to - this.length;
				while ((k--) + 1) {
					this.push(undefined);
				}
			}
			this.splice(to, 0, this.splice(from, 1)[0]);
			return this; // for testing purposes
		},
		enumerable: false, // Ensure the method is non-enumerable
		writable: true, // Allow the method to be overridden if needed
		configurable: true, // Allow the method to be deleted if needed
	});
}

if (!Array.prototype.findIndex) {
	Array.prototype.findIndex = function (predicate) {
		if (this === null) {
			throw new TypeError('Array.prototype.findIndex called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;

		for (var i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return i;
			}
		}
		return -1;
	};
}

if (!Array.prototype.find) {
	Array.prototype.find = function (predicate) {
		if (this === null) {
			throw new TypeError('Array.prototype.find called on null or undefined');
		}
		if (typeof predicate !== 'function') {
			throw new TypeError('predicate must be a function');
		}
		var list = Object(this);
		var length = list.length >>> 0;
		var thisArg = arguments[1];
		var value;

		for (var i = 0; i < length; i++) {
			value = list[i];
			if (predicate.call(thisArg, value, i, list)) {
				return value;
			}
		}
		return undefined;
	};
}

(function ($) {
	// Slick.Grid
	$.extend(true, window, {
		Slick: {
			Grid: SlickGrid
		}
	});

	// shared across all grids on the page
	var scrollbarDimensions;
	var maxSupportedCssHeight; // browser's breaking point

	// ////////////////////////////////////////////////////////////////////////////////////////////
	// SlickGrid class implementation (available as Slick.Grid)

	/**
	 * Creates a new instance of the grid.
	 * @class SlickGrid
	 * @constructor
	 * @param {Node}              container   Container node to create the grid in.
	 * @param {Array,Object}      data        An array of objects for databinding.
	 * @param {Array}             columns     An array of column definitions.
	 * @param {Object}            options     Grid options.
	 **/
	function SlickGrid(container, data, columns, options) {
		// settings
		var defaults = {
			explicitInitialization: false,
			rowHeight: 25,
			defaultColumnWidth: 80,
			enableAddRow: false,
			leaveSpaceForNewRows: false,
			editable: false,
			autoEdit: true,
			enableCellNavigation: true,
			enableColumnReorder: true,
			asyncEditorLoading: false,
			asyncEditorLoadDelay: 100,
			forceFitColumns: false,
			enableAsyncPostRender: false,
			asyncPostRenderDelay: 50,
			autoHeight: false,
			editorLock: Slick.GlobalEditorLock,
			showHeaderRow: false,
			headerRowHeight: 25,
			showTopPanel: false,
			topPanelHeight: 25,
			formatterFactory: null,
			editorFactory: null,
			cellFlashingCssClass: 'flashing',
			selectedCellCssClass: 'selected',
			highlightedCellCssClass: 'highlighted',
			multiSelect: true,
			enableTextSelectionOnCells: true,
			dataItemColumnValueExtractor: null,
			frozenBottom: false,
			frozenColumn: -1,
			frozenRow: -1,
			fullWidthRows: false,
			multiColumnSort: false,
			numberedMultiColumnSort: false,
			tristateMultiColumnSort: true,
			showFilterRow: false,
			defaultFormatter: defaultFormatter,
			forceSyncScrolling: false,
			editOnClick: true,
			enableDraggableGroupBy: false,
			enableColumnSort: true,
			enableCopyPasteExcel: true,
			includeHeaderWhenCopyingToExcel: false,
			mainTopPanelheight: 25,
			groupPanelText: 'Drop a column header here...',
			groupPanelheight: 33,
			groupByRemoveImage: '',
			footerHeight: 33,
			showFooter: false,
			saveSearch: true,
			showGroupingPanel: false,
			showMainTopPanel: false,
			defaultSortColumn: ''
		};

		var columnDefaults = {
			name: '',
			resizable: true,
			sortable: false,
			minWidth: 30,
			rerenderOnResize: false,
			headerCssClass: null,
			defaultSortAsc: true,
			focusable: true,
			selectable: true
		};

		// scroller
		var th;   // virtual height
		var h;    // real scrollable height
		var ph;   // page height
		var n;    // number of pages
		var cj;   // "jumpiness" coefficient

		var page = 0; // current page
		var offset = 0; // current page offset
		var vScrollDir = 1;

		// private
		var initialized = false;
		var $container;
		var uid = 'slickgrid_' + Math.round(1000000 * Math.random());
		var self = this;
		var $focusSink, $focusSink2;
		var $headerScroller;
		var $headers;
		var $headerRow, $headerRowScroller, $headerRowSpacerL, $headerRowSpacerR;
		var $topPanelScroller;
		var $topPanel;
		var $viewport;
		var $canvas;
		var $style;
		var $boundAncestors;
		var stylesheet, columnCssRulesL, columnCssRulesR;
		var viewportH, viewportW;
		var canvasWidth, canvasWidthL, canvasWidthR;
		var headersWidth, headersWidthL, headersWidthR;
		var viewportHasHScroll, viewportHasVScroll;
		var headerColumnWidthDiff = 0,
			headerColumnHeightDiff = 0,
			// border+padding
			cellWidthDiff = 0,
			cellHeightDiff = 0;
		var absoluteColumnMinWidth;
		var hasFrozenRows = false;
		var frozenRowsHeight = 0;
		var actualFrozenRow = -1;
		var paneTopH = 0;
		var paneBottomH = 0;
		var viewportTopH = 0;
		var viewportBottomH = 0;
		var topPanelH = 0;
		var headerRowH = 0;

		var tabbingDirection = 1;
		var $activeCanvasNode;
		var $activeViewportNode;
		var activePosX;
		var activeRow, activeCell;
		var activeCellNode = null;
		var activeColumnHeader = null;
		var currentEditor = null;
		var serializedEditorValue;
		var editController;

		var rowsCache = {};
		var renderedRows = 0;
		var numVisibleRows = 0;
		var prevScrollTop = 0;
		var scrollTop = 0;
		var lastRenderedScrollTop = 0;
		var lastRenderedScrollLeft = 0;
		var prevScrollLeft = 0;
		var scrollLeft = 0, scrollLeftV = 0;

		var selectionModel;
		var selectedRows = [];

		var plugins = [];
		var cellCssClasses = {};

		var columnsById = {};
		var sortColumns = [];
		var columnPosLeft = [];
		var columnPosRight = [];

		// async call handles
		var h_editorLoader = null;
		var h_render = null;
		var h_postrender = null;
		var postProcessedRows = {};
		var postProcessToRow = null;
		var postProcessFromRow = null;

		var h_scrollActive = null;

		// perf counters
		var counter_rows_rendered = 0;
		var counter_rows_removed = 0;

		var $paneHeaderL;
		var $paneHeaderR;
		var $paneTopL;
		var $paneTopR;
		var $paneBottomL;
		var $paneBottomR;

		var $cellDecoratorPane;

		var $headerScrollerL;
		var $headerScrollerR;

		var $headerL;
		var $headerR;

		var $headerRowScrollerL;
		var $headerRowScrollerR;

		var $headerRowL;
		var $headerRowR;

		var $topPanelScrollerL;
		var $topPanelScrollerR;

		var $topPanelL;
		var $topPanelR;

		var $viewportTopL;
		var $viewportTopR;
		var $viewportBottomL;
		var $viewportBottomR;

		var $viewportSkeletonL;
		var $viewportSkeletonR;

		var $canvasTopL;
		var $canvasTopR;
		var $canvasBottomL;
		var $canvasBottomR;

		var $viewportScrollContainerX;
		var $viewportScrollContainerY;
		var $headerScrollContainer;
		var $headerRowScrollContainer;
		var $gridContainer;
		var $gridContainerScroller;

		var $headerDraggableGroupBy;
		var $headerHelpInfo;
		var headerElements = [];
		var $mainTopPanelScroller;
		var $mainTopPanel;
		var $overlay;
		var $overlayInner;
		var $headerRowPanel;

		var $footer;
		var $footerL;
		var $footerR;
		var footerH;

		//////////////////////////////////////////////////////////////////////////////////////////////
		// My modifications. Variables
		//////////////////////////////////////////////////////////////////////////////////////////////

		var _columnOrder = new Map(),
			_origColumns = columns,
			_inEditMode = false,
			_lastEditMode = false,
			_lastRow = 0,
			_lastCell = 0,
			groupPanelH = 0,
			searchPanelH = 0,
			inputNav = false,
			navDir = 0,
			gridContainerH;

		var pinOrderColumns = [];
		var scrollBarH = 0;
		var readOnly = false;
		var hasMouseFocus = false;
		var isGroupRow = false;
		var systemColumns = ['tree', 'indicator', 'marker', 'group'];
		var scrollBarVBeforeResize = -1;

		//////////////////////////////////////////////////////////////////////////////////////////////
		// Initialization
		//////////////////////////////////////////////////////////////////////////////////////////////

		function init() {
			$container = $(container);
			if ($container.length < 1) {
				throw new Error('SlickGrid requires a valid container, ' + container + ' does not exist in the DOM.');
			}
			// calculate these only once and share between grid instances
			maxSupportedCssHeight = maxSupportedCssHeight || getMaxSupportedCssHeight();
			scrollbarDimensions = scrollbarDimensions || measureScrollbar();

			options = $.extend({}, defaults, options);
			validateAndEnforceOptions();
			columnDefaults.width = options.defaultColumnWidth;

			updateColumnProps();

			// validate loaded JavaScript modules against requested options
			if (options.enableColumnReorder && !$.fn.sortable) {
				throw new Error('SlickGrid"s "enableColumnReorder = true" option requires jquery-ui.sortable module to be loaded');
			}

			editController = {
				'commitCurrentEdit': commitCurrentEdit,
				'cancelCurrentEdit': cancelCurrentEdit
			};

			$container
				.empty()
				.css('overflow', 'hidden')
				.css('outline', 0)
				.addClass(uid)
				.addClass('ui-widget');

			// set up a positioning container if needed
			if (!/relative|absolute|fixed/.test($container.css('position'))) {
				$container.css('position', 'relative');
			}

			$focusSink = $('<div tabIndex="0" hideFocus style="position:fixed;width:0;height:0;top:0;left:0;outline:0;"></div>').appendTo($container);

			if (options.enableDraggableGroupBy) {
				$headerDraggableGroupBy = $('<div class="slick-groupby ui-state-default" style="overflow:hidden;position:relative;"></div>').appendTo($container);
				$headerDraggableGroupBy.hide();
				headerElements.push($headerDraggableGroupBy);
			}

			$headerHelpInfo = $('<div class="slick-helpinfo"></div>').appendTo($container);
			$headerHelpInfo.hide();

			$mainTopPanelScroller = $('<div class="ui-state-default slick-search-panel-scroller" />').appendTo($container);
			$mainTopPanel = $('<div class="slick-search-panel" style="width:10000px" />').appendTo($mainTopPanelScroller);
			if (!options.showMainTopPanel) {
				$mainTopPanelScroller.hide();
			}
			$gridContainer = $('<div class="slick-container" style="height: 100%; width: 100%; overflow: hidden" />').appendTo($container);
			// Containers used for scrolling frozen columns and rows
			$paneHeaderL = $('<div class="slick-pane slick-pane-header slick-pane-left" tabIndex="0" />').appendTo($gridContainer);
			$paneHeaderR = $('<div class="slick-pane slick-pane-header slick-pane-right" tabIndex="0" />').appendTo($gridContainer);
			$cellDecoratorPane = $('<div class="cell-decorator-pane" style="height: 100%; width: 100%;" tabIndex="0"/>');
			$cellDecoratorPane.appendTo($gridContainer);
			$paneTopL = $('<div class="slick-pane slick-pane-top slick-pane-left" tabIndex="0" />').appendTo($cellDecoratorPane);
			$paneTopR = $('<div class="slick-pane slick-pane-top slick-pane-right" tabIndex="0" />').appendTo($cellDecoratorPane);
			$paneBottomL = $('<div class="slick-pane slick-pane-bottom slick-pane-left" tabIndex="0" />').appendTo($gridContainer);
			$paneBottomR = $('<div class="slick-pane slick-pane-bottom slick-pane-right" tabIndex="0" />').appendTo($gridContainer);

			// $overlay = $('<div id="' + uid + '_overlay" style="z-index: 1000; position: relative;height: 100%;width: 100%;display: none; background-color: #000;opacity: 0.5;">' + '</div>').appendTo($container);
			$overlay = $('<div id="' + uid + '_overlay" class="slick-overlay">' + '</div>').appendTo($container);
			$overlayInner = $('<div style="display: table-cell; vertical-align: middle; text-align: center; width: 100%;"><div class="spinner-lg"></div></div>').appendTo($overlay);

			headerElements.push($paneHeaderL, $paneHeaderR, $paneTopL, $paneTopR, $paneBottomL, $paneBottomR);

			// Append the header scroller containers
			$headerScrollerL = $('<div class="ui-state-default slick-header slick-header-left" />').appendTo($paneHeaderL);
			$headerScrollerR = $('<div class="ui-state-default slick-header slick-header-right" />').appendTo($paneHeaderR);

			$headerRowPanel = $('<div class="slick-headerrow-panel" tabIndex="0" />').appendTo($paneHeaderR);

			// Cache the header scroller containers
			$headerScroller = $().add($headerScrollerL).add($headerScrollerR);

			// Append the columnn containers to the headers
			$headerL = $('<div class="slick-header-columns slick-header-columns-left ' + uid + '_headers" style="left:-1000px" />').appendTo($headerScrollerL);
			$headerR = $('<div class="slick-header-columns slick-header-columns-right ' + uid + '_headers" style="left:-1000px" />').appendTo($headerScrollerR);

			// Cache the header columns
			$headers = $().add($headerL).add($headerR);

			$headerRowScrollerL = $('<div class="ui-state-default slick-headerrow" />').appendTo($paneTopL);
			$headerRowScrollerR = $('<div class="ui-state-default slick-headerrow" />').appendTo($paneTopR);

			$headerRowScroller = $().add($headerRowScrollerL).add($headerRowScrollerR);

			$headerRowSpacerL = $('<div style="display:block;height:1px;position:absolute;top:0;left:0;"></div>')
				.css('width', getCanvasWidth() + scrollbarDimensions.width + 'px')
				.appendTo($headerRowScrollerL);
			$headerRowSpacerR = $('<div style="display:block;height:1px;position:absolute;top:0;left:0;"></div>')
				.css('width', getCanvasWidth() + scrollbarDimensions.width + 'px')
				.appendTo($headerRowScrollerR);

			$headerRowL = $('<div class="slick-headerrow-columns slick-headerrow-columns-left" />').appendTo($headerRowScrollerL);
			$headerRowR = $('<div class="slick-headerrow-columns slick-headerrow-columns-right" />').appendTo($headerRowScrollerR);

			$headerRow = $().add($headerRowL).add($headerRowR);

			// Append the top panel scroller
			$topPanelScrollerL = $('<div class="ui-state-default slick-top-panel-scroller" />').appendTo($paneTopL);
			$topPanelScrollerR = $('<div class="ui-state-default slick-top-panel-scroller" />').appendTo($paneTopR);

			$topPanelScroller = $().add($topPanelScrollerL).add($topPanelScrollerR);

			// Append the top panel
			$topPanelL = $('<div class="slick-top-panel" style="width:10000px" />').appendTo($topPanelScrollerL);
			$topPanelR = $('<div class="slick-top-panel" style="width:10000px" />').appendTo($topPanelScrollerR);

			$topPanel = $().add($topPanelL).add($topPanelR);

			if (!options.showTopPanel) {
				$topPanelScroller.hide();
			}

			if (!options.showHeaderRow) {
				$headerRowScroller.hide();
			}

			// Append the viewport containers
			$viewportTopL = $('<div class="slick-viewport slick-viewport-top slick-viewport-left" tabIndex="0" hideFocus />').appendTo($paneTopL);
			$viewportTopR = $('<div class="slick-viewport slick-viewport-top slick-viewport-right" tabIndex="0" hideFocus />').appendTo($paneTopR);
			$viewportBottomL = $('<div class="slick-viewport slick-viewport-bottom slick-viewport-left" tabIndex="0" hideFocus />').appendTo($paneBottomL);
			$viewportBottomR = $('<div class="slick-viewport slick-viewport-bottom slick-viewport-right" tabIndex="0" hideFocus />').appendTo($paneBottomR);

			// Cache the viewports
			$viewport = $().add($viewportTopL).add($viewportTopR).add($viewportBottomL).add($viewportBottomR);

			// Default the active viewport to the top left
			$activeViewportNode = $viewportTopL;

			//append the skeleton containers
			$viewportSkeletonL = $('<div class="viewport-skeleton-left" tabIndex="0" style="display:none" hideFocus />').appendTo($viewportTopL);
			$viewportSkeletonR = $('<div class="viewport-skeleton-right" tabIndex="0" style="display:none" hideFocus />').appendTo($viewportTopR);

			// Append the canvas containers
			$canvasTopL = $('<div class="grid-canvas grid-canvas-top grid-canvas-left" tabIndex="0" hideFocus />').appendTo($viewportTopL);
			$canvasTopR = $('<div class="grid-canvas grid-canvas-top grid-canvas-right" tabIndex="0" hideFocus />').appendTo($viewportTopR);
			$canvasBottomL = $('<div class="grid-canvas grid-canvas-bottom grid-canvas-left" tabIndex="0" hideFocus />').appendTo($viewportBottomL);
			$canvasBottomR = $('<div class="grid-canvas grid-canvas-bottom grid-canvas-right" tabIndex="0" hideFocus />').appendTo($viewportBottomR);

			// Cache the canvases
			$canvas = $().add($canvasTopL).add($canvasTopR).add($canvasBottomL).add($canvasBottomR);

			// Default the active canvas to the top left
			$activeCanvasNode = $canvasTopL;

			$focusSink2 = $focusSink.clone().appendTo($container);

			// $gridContainerScroller = $("<div style='height: 20px;width: 100%; overflow-x: visible; overflow-y: hidden; position: absolute; bottom: 0;'><div style='height: inherit; width: 3200px'></div></div>").appendTo($gridContainer);
			$gridContainerScroller = $('<div class="grid-scroll"><div></div></div>').appendTo($gridContainer);

			if (options.showFooter) {
				$footerL = $('<div class="slick-footer"></div>');
				$footerR = $('<div class="slick-footer"></div>');
				$footer = $().add($footerL).add($footerR);
			}

			if (!options.explicitInitialization) {
				finishInitialization();
			}
		}

		function processForTouchDevice() {
			var startx = 0;

			function touchEventOutOfScroll(event) {
				/*
				 touch-event for swiping is registered on div.slick-container.
				 And for width-resizing in header is in div.slick-container, too. I have 2 events. But with event-stopPropagation() is not working here.
				 Therefore I ask, if clicked element for resing in header. if yes , break this event for swiping
				 */
				return $(event.target).hasClass('slick-resizable-handle');
			}

			$gridContainer.bind('touchstart', function (event) {
				if (touchEventOutOfScroll(event)) {
					return null;
				}

				// define startposition. In touchmove function to know if swipe to left side or to right. And for the first calculation.
				startx = parseInt(event.clientX); // x-coordinate to viewport
			});

			$gridContainer.bind('touchmove', function (event) {
				if (touchEventOutOfScroll(event)) {
					return null;
				}

				var toSwipe = $gridContainerScroller.scrollLeft(); // actual position from scroller
				// check if start-position greater then start-position now. If yes, then swipe to right. Otherwise swipe to left
				if (startx > parseInt(event.clientX)) {
					toSwipe += (startx - parseInt(event.clientX));
				} else {
					toSwipe -= (parseInt(event.clientX) - startx);
				}

				// from now on there is a new startposition ('right here i sthe finger position').
				startx = parseInt(event.clientX);

				// set in pixel how to move. It triggers the grid-scroll container, so that the logic is the same.
				$gridContainerScroller.scrollLeft(toSwipe);
			});
		}

		function initEvents() {
			$container.unbind();
			$viewport.unbind();
			$gridContainerScroller.unbind();
			$headerScroller.unbind();
			$headerRowScroller.unbind();
			$focusSink.unbind();
			$canvas.unbind();

			// touch events is needed in using mobile device
			if (globals.isTouchDevice) {
				processForTouchDevice();
			}

			$container
				.on('mouseenter', handleContainerMouseEnter)
				.on('mouseleave', handleContainerMouseLeave)
				.on('mousemove', handleContainerMouseMove)
				.on('resize.slickgrid', resizeGrid);
			$viewport
				.on('scroll', handleScroll);
			$viewportTopR[0].addEventListener('scrollend', handleScrollEnd);

			$gridContainerScroller.on('scroll', handleScroll);
			if (jQuery.fn.mousewheel && (hasFrozenColumns() || hasFrozenRows)) {
				$viewport
					.on('mousewheel', handleMouseWheel);
			}
			$headerScroller
				.on('contextmenu', handleHeaderContextMenu)
				.on('click', handleHeaderClick)
				.on('mouseenter', '.slick-header-column', handleHeaderMouseEnter)
				.on('mouseleave', '.slick-header-column', handleHeaderMouseLeave);
			$headerRowScroller
				.on('scroll', handleHeaderRowScroll);
			$focusSink
				.on('keydown', handleKeyDown);
			$focusSink2
				.on('keydown', handleKeyDown);
			$canvas
				.on('keydown', handleKeyDown)
				.on('click', handleClick)
				.on('dblclick', handleDblClick)
				.on('contextmenu', handleContextMenu)
				.on('draginit', handleDragInit)
				.on('dragstart', { distance: 3 }, handleDragStart)
				.on('drag', handleDrag)
				.on('dragend', handleDragEnd)
				.on('mouseenter', '.slick-cell', handleMouseEnter)
				.on('mouseleave', '.slick-cell', handleMouseLeave);
		}

		function finishInitialization() {
			if (!initialized) {

				getViewportWidth();
				getViewportHeight();

				// header columns and cells may have different padding/border
				// skewing width calculations (box-sizing, hello?)
				// calculate the diff so we can set consistent sizes
				measureCellPaddingAndBorder();

				// for usability reasons, all text selection in SlickGrid is
				// disabled with the exception of input and textarea elements (selection
				// must be enabled there so that editors work as expected); note that
				// selection in grid cells (grid body) is already unavailable in
				// all browsers except IE;
				disableSelection($headers); // disable all text selection in header (including input and textarea)

				if (!options.enableTextSelectionOnCells) {
					// disable text selection in grid cells except in input and textarea elements
					// (this is IE-specific, because selectstart event will only fire in IE)
					$viewport.bind('selectstart.ui', function (event) {
						return $(event.target).is('input,textarea');
					});
				}

				setFrozenOptions();
				setPaneVisibility();
				setScroller();
				setOverflow();

				updateColumnCaches();
				createColumnHeaders();
				if (options.enableColumnSort) {
					setupColumnSort();
				}
				createCssRules();
				resizeCanvas();
				bindAncestorScrollEvents();

				initEvents();
				initialized = true;
				recalcMainScrollbar();
			}
			if (data.hasOwnProperty('groupBy') && data.setGrid) {
				data.setGrid(self);
				data.setColumns(_origColumns);
			}
		}

		function hasFrozenColumns(ignoreIndicator) {
			if (ignoreIndicator) {
				return options.frozenColumn > 1;
			} else {
				return options.frozenColumn > -1;
			}
		}

		function hasPlugin(plugin) {
			let found = _.find(plugins, { name: plugin.pluginName });
			if(found) {
				return true;
			}
			return false;
		}

		function registerPlugin(plugin) {
			plugins.unshift(plugin);
			plugin.init(self);
		}

		function unregisterPlugin(plugin) {
			if (plugins.length > 0 && plugin) {
				for (var i = plugins.length; i >= 0; i--) {
					if (plugins[i] && (plugins[i] === plugin || plugins[i].pluginName === plugin.pluginName)) {
						if (plugins[i].destroy) {
							plugins[i].destroy();
						}
						plugins.splice(i, 1);
						// break;
					}
				}
			}
		}

		function getPluginByName(name) {
			for (var i = plugins.length-1; i >= 0; i--) {
				if (plugins[i].pluginName === name) {
					return plugins[i];
				}
			}
			return undefined;
		}

		function setSelectionModel(model) {
			if (selectionModel) {
				selectionModel.onSelectedRangesChanged.unsubscribe(handleSelectedRangesChanged);
				if (selectionModel.destroy) {
					selectionModel.destroy();
				}
			}

			selectionModel = model;
			if (selectionModel) {
				selectionModel.init(self);
				selectionModel.onSelectedRangesChanged.subscribe(handleSelectedRangesChanged);
			}
		}

		function getHeaders() {
			return $headers;
		}

		function getHeaderLeft() {
			return $headerL;
		}

		function getHeaderRight() {
			return $headerR;
		}

		function getSelectionModel() {
			return selectionModel;
		}

		function getCanvasNode() {
			return $canvas[0];
		}

		function getContainer() {
			return $gridContainer;
		}

		function getContainerForCopy() {
			return $cellDecoratorPane;
		}

		function getViewportNodes() {
			return $viewport;
		}

		function getActiveCanvasNode(element) {
			setActiveCanvasNode(element);

			return $activeCanvasNode[0];
		}

		function getCanvases() {
			return $canvas;
		}

		function setActiveCanvasNode(element) {
			if (element) {
				$activeCanvasNode = $(element.target).closest('.grid-canvas');
			}
		}

		function getViewportNode() {
			return $viewport[0];
		}

		function getActiveViewportNode(element) {
			setActiveViewPortNode(element);

			return $activeViewportNode[0];
		}

		function setActiveViewportNode(element) {
			if (element) {
				$activeViewportNode = $(element.target).closest('.slick-viewport');
			}
		}

		function measureScrollbar() {
			var $c = $('<div style="position:absolute; top:-10000px; left:-10000px; width:100px; height:100px; overflow:scroll;"></div>').appendTo('body');
			var dim = {
				width: $c.width() - $c[0].clientWidth,
				height: $c.height() - $c[0].clientHeight
			};
			$c.remove();
			return dim;
		}

		function getHeadersWidth() {
			headersWidth = headersWidthL = headersWidthR = 0;

			for (var i = 0, ii = columns.length; i < ii; i++) {
				var width = columns[i].width;

				if ((options.frozenColumn) > -1 && (!columns[i].pinned)) {
					// if (( options.frozenColumn ) > -1 && ( i > options.frozenColumn )) {
					headersWidthR += width;
				} else {
					headersWidthL += width;
				}
			}

			if (hasFrozenColumns()) {
				headersWidthL = headersWidthL + 1000;

				headersWidthR = Math.max(headersWidthR, viewportW) + headersWidthL;
				headersWidthR += scrollbarDimensions.width;
			} else {
				headersWidthL += scrollbarDimensions.width;
				headersWidthL = Math.max(headersWidthL, viewportW) + 1000;
			}

			headersWidth = headersWidthL + headersWidthR;
			return headersWidth;
		}

		function getHeaderLeftWidth() {
			return headersWidthL;
		}

		function getHeaderRightWidth() {
			return headersWidthR;
		}

		function getCanvasWidth() {
			var availableWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;

			var i = columns.length;

			canvasWidthL = canvasWidthR = 0;

			while (i--) {
				if (!columns[i].hidden) {
					if (hasFrozenColumns() && (!columns[i].pinned)) {
						canvasWidthR += columns[i].width;
					} else {
						canvasWidthL += columns[i].width;
					}
				}
			}

			var totalRowWidth = canvasWidthL + canvasWidthR;

			return options.fullWidthRows ? Math.max(totalRowWidth, availableWidth) : totalRowWidth;
		}

		function updateCanvasWidth(forceColumnWidthsUpdate) {

			var oldCanvasWidth = canvasWidth;
			var oldCanvasWidthL = canvasWidthL;
			var oldCanvasWidthR = canvasWidthR;
			var widthChanged;
			canvasWidth = getCanvasWidth();

			widthChanged = canvasWidth !== oldCanvasWidth || canvasWidthL !== oldCanvasWidthL || canvasWidthR !== oldCanvasWidthR;

			if (widthChanged || hasFrozenColumns() || hasFrozenRows) {
				$canvasTopL.width(canvasWidthL);

				getHeadersWidth();

				$headerL.width(headersWidthL);
				$headerR.width(headersWidthR);

				if (hasFrozenColumns()) {
					var sbd = 0;
					if (hasScrollbar().scrollbarV) {
						sbd = scrollbarDimensions.width + 1;
					}
					$canvasTopR.width(canvasWidthR);

					$paneHeaderL.width(canvasWidthL);
					$paneHeaderR.css('left', canvasWidthL);
					$paneHeaderR.css('width', viewportW - canvasWidthL);

					$paneTopL.width(canvasWidthL);
					$paneTopR.css('left', canvasWidthL);
					$paneTopR.css('width', viewportW - canvasWidthL);

					$headerRowScrollerL.width(canvasWidthL);
					$headerRowScrollerR.width(viewportW - canvasWidthL - sbd);

					$headerRowL.width(canvasWidthL);
					$headerRowR.width(canvasWidthR);

					$viewportTopL.width(canvasWidthL);
					$viewportTopR.width(viewportW - canvasWidthL);

					if (hasFrozenRows) {
						$paneBottomL.width(canvasWidthL);
						$paneBottomR.css('left', canvasWidthL);

						$viewportBottomL.width(canvasWidthL);
						$viewportBottomR.width(viewportW - canvasWidthL);

						$canvasBottomL.width(canvasWidthL);
						$canvasBottomR.width(canvasWidthR);
					}
				} else {
					$paneHeaderL.width('100%');

					$paneTopL.width('100%');

					$headerRowScrollerL.width('100%');

					$headerRowL.width(canvasWidth);

					$viewportTopL.width('100%');

					if (hasFrozenRows) {
						$viewportBottomL.width('100%');
						$canvasBottomL.width(canvasWidthL);
					}
				}

				viewportHasHScroll = (canvasWidth > viewportW - scrollbarDimensions.width);
			}

			$headerRowSpacerL.width(canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));
			$headerRowSpacerR.width(canvasWidth + (viewportHasVScroll ? scrollbarDimensions.width : 0));

			if (widthChanged || forceColumnWidthsUpdate) {
				applyColumnWidths();
			}
		}

		function disableSelection($target) {
			if ($target && $target.jquery) {
				$target.attr('unselectable', 'on').css('MozUserSelect', 'none').bind('selectstart.ui', function () {
					return false;
				}); // from jquery:ui.core.js 1.7.2
			}
		}

		function getMaxSupportedCssHeight() {
			var supportedHeight = 1000000;
			// FF reports the height back but still renders blank after ~6M px
			var testUpTo = navigator.userAgent.toLowerCase().match(/firefox/) ? 6000000 : 1000000000;
			var div = $('<div style="display:none" />').appendTo(document.body);

			while (true) {
				var test = supportedHeight * 2;
				div.css('height', test);
				if (test > testUpTo || div.height() !== test) {
					break;
				} else {
					supportedHeight = test;
				}
			}

			div.remove();
			return supportedHeight;
		}

		// TODO:  this is static.  need to handle page mutation.
		function bindAncestorScrollEvents() {
			var elem = (hasFrozenRows && !options.frozenBottom) ? $canvasBottomL[0] : $canvasTopL[0];
			while ((elem = elem.parentNode) !== document.body && elem != null) {
				// bind to scroll containers only
				if (elem === $viewportTopL[0] || elem.scrollWidth !== elem.clientWidth || elem.scrollHeight !== elem.clientHeight) {
					var $elem = $(elem);
					if (!$boundAncestors) {
						$boundAncestors = $elem;
					} else {
						$boundAncestors = $boundAncestors.add($elem);
					}
					$elem.bind('scroll.' + uid, handleActiveCellPositionChange);
				}
			}
		}

		function unbindAncestorScrollEvents() {
			if (!$boundAncestors) {
				return;
			}
			$boundAncestors.unbind('scroll.' + uid);
			$boundAncestors = null;
		}

		function updateColumnHeader(columnId, title, toolTip) {
			if (!initialized) {
				return;
			}
			var idx = getColumnIndex(columnId);
			if (idx == null) {
				return;
			}

			var columnDef = columns[idx];
			var $header = $headers.children().eq(idx);
			if ($header) {
				if (title !== undefined) {
					columns[idx].name = title;
				}
				if (toolTip !== undefined) {
					columns[idx].toolTip = toolTip;
				}

				trigger(self.onBeforeHeaderCellDestroy, {
					'node': $header[0],
					'column': columnDef
				});

				$header.attr('title', toolTip || '').children().eq(0).html(title);

				trigger(self.onHeaderCellRendered, {
					'node': $header[0],
					'column': columnDef
				});
			}
		}

		function getHeaderRow() {
			return (hasFrozenColumns()) ? $headerRow : $headerRow[0];
		}

		function getHelperInfoRow() {
			return $headerHelpInfo;
		}

		function getDraggableGroupByPanel() {
			return $headerDraggableGroupBy;
		}

		function getHeaderRowColumn(columnId) {
			var idx = getColumnIndex(columnId);

			var $headerRowTarget;

			if (hasFrozenColumns()) {
				if (columns[idx].pinned) {
					// if (idx <= options.frozenColumn) {
					$headerRowTarget = $headerL;
				} else {
					$headerRowTarget = $headerR;

					idx -= options.frozenColumn;// + 1;
				}
			} else {
				$headerRowTarget = $headerL;
			}

			var $header = $headerRowTarget.children().eq(idx);
			return $header && $header[0];
		}

		function createColumnHeaders() {
			function onMouseEnter() {
				$(this).addClass('ui-state-hover');
			}

			function onMouseLeave() {
				$(this).removeClass('ui-state-hover');
			}

			$headers.find('.slick-header-column')
				.each(function () {
					var columnDef = $(this).data('column');
					if (columnDef) {
						trigger(self.onBeforeHeaderCellDestroy, {
							'node': this,
							'column': columnDef
						});
					}
				});

			$headerL.empty();
			$headerR.empty();

			getHeadersWidth();

			$headerL.width(headersWidthL);
			$headerR.width(headersWidthR);

			$headerRow.find('.slick-headerrow-column')
				.each(function () {
					var columnDef = $(this).data('column');
					if (columnDef) {
						trigger(self.onBeforeHeaderRowCellDestroy, {
							'node': this,
							'column': columnDef
						});
					}
				});

			$headerRowL.empty();
			$headerRowR.empty();

			var readonlyColCount = 0;
			columns.forEach((column) => {
				readonlyColCount += column.editor === null ? 1 : 0;
			});
			if (readonlyColCount === columns.length - 1) { // minus 1 for indicator
				readOnly = true;
			}

			for (var i = 0; i < columns.length; i++) {
				var m = columns[i];
				if (columns[i].hidden) {
					continue;
				}
				var label = m.displayName || m.name; // introducing new properties is bad for angular migration
				label=$('<div>').text(label).html();
				var tmp;
				if (m.headerChkbox) {
					tmp = '<div class="slick-column-name checkbox-radio-box"><label><input id="chkbox_' + uid + '_' + m.id + '" type="checkbox"/>' + label + '</div>';
				} else if (m.aggregates) {
					var css;
					switch (m.aggregates) {
						case 'SUM':
							css = 'control-icons ico-evaluation-total';
							break;
						case 'AVG':
							css = 'control-icons ico-evaluation-average';
							break;
						case 'MIN':
							css = 'control-icons ico-evaluation-min';
							break;
						case 'MAX':
							css = 'control-icons ico-evaluation-max';
							break;
					}
					tmp = '<span class="slick-column-name">' + label + '</span><span class="block-image pull-right ' + css + '"></span>';
				} else {
					tmp = '<span class="slick-column-name">' + label + '</span>';
				}
				var $headerTarget = (hasFrozenColumns()) ? ((columns[i].pinned) ? $headerL : $headerR) : $headerL;
				var $headerRowTarget = (hasFrozenColumns()) ? ((columns[i].pinned) ? $headerRowL : $headerRowR) : $headerRowL;

				var header = $('<div class="ui-state-default slick-header-column" />');
				if (m.id === 'indicator') {
					header.addClass('indicator');
				} else if (!readOnly) // perform readonly check on other columns
				{
					if (!_.isUndefined(m.editor) && m.editor === null) {
						if (!_.isUndefined(m.editorOptions) && m.editorOptions === null) {
							header.addClass('slick-header-readonly');
						} else if (_.isUndefined(m.editorOptions)) {
							header.addClass('slick-header-readonly');
						}
					}
				}
				header
					.html(tmp)
					.outerWidth(m.width - headerColumnWidthDiff)
					.attr('id', '' + uid + m.id)
					.attr('title', m.toolTip || '')
					.data('column', m)
					.addClass(m.headerCssClass || '')
					.css('left', '1000px')
					.appendTo($headerTarget);

				if ((options.enableColumnReorder || m.sortable) && !m.isIndicator) {
					header
						.on('mouseenter', onMouseEnter)
						.on('mouseleave', onMouseLeave);
				}

				if (m.sortable && options.enableColumnSort && !m.isIndicator) {
					header.addClass('slick-header-sortable');
					header.append('<span class="slick-sort-indicator" />');
				}

				trigger(self.onHeaderCellRendered, {
					'node': header[0],
					'column': m
				});

				// Start - Generation of Column Filter Row
				var headerRowCell = $('<div class="slick-cell ' + uid + ' l' + i + ' r' + i + ' item-field_' + m.id + '"></div>')
					.data('column', m);

				if (m.id === 'indicator') {
					headerRowCell.addClass('indicator');
					headerRowCell.addClass('control-icons ico-indicator-search');
				}

				headerRowCell.appendTo($headerRowTarget);

				trigger(self.onHeaderRowCellRendered, {
					'node': headerRowCell,
					'column': m
				});
				// End
			}

			if (options.enableColumnSort) {
				setSortColumns(sortColumns);
			}

			setupColumnResize();
			if (options.enableColumnReorder) {
				setupColumnReorder();
			}
		}

		function setupColumnSort() {
			$headers.click(function (e) {
				// temporary workaround for a bug in jQuery 1.7.1
				// (http://bugs.jquery.com/ticket/11328)
				e.metaKey = e.metaKey || e.ctrlKey;

				if ($(e.target).hasClass('slick-resizable-handle')) {
					return;
				}

				var $col = $(e.target).closest('.slick-header-column');
				if (!$col.length) {
					return;
				}

				var column = $col.data('column');
				if (column.sortable && !column.isIndicator) {
					if (!getEditorLock().commitCurrentEdit()) {
						return;
					}

					var sortColumn = null;
					var i = 0;
					for (; i < sortColumns.length; i++) {
						if (sortColumns[i].columnId === column.id) {
							sortColumn = sortColumns[i];
							sortColumn.sortAsc = !sortColumn.sortAsc;
							break;
						}
					}

					var hadSortCol = !!sortColumn;

					if (options.tristateMultiColumnSort) {
						if (!sortColumn) {
							sortColumn = { columnId: column.id, sortAsc: column.defaultSortAsc };
						}
						if (hadSortCol && sortColumn.sortAsc) {
							// three state: remove sort rather than go back to ASC
							sortColumns.splice(i, 1);
							sortColumn = null;
						}
						if (!options.multiColumnSort) {
							sortColumns = [];
						}
						if (sortColumn && (!hadSortCol || !options.multiColumnSort)) {
							sortColumns.push(sortColumn);
						}
					} else {
						// legacy behavior
						if (e.metaKey && options.multiColumnSort) {
							if (sortColumn) {
								sortColumns.splice(i, 1);
							}
						} else {
							if ((!e.shiftKey && !e.metaKey) || !options.multiColumnSort) {
								sortColumns = [];
							}

							if (!sortColumn) {
								sortOpts = {
									columnId: column.id,
									sortAsc: column.defaultSortAsc
								};
								sortColumns.push(sortColumn);
							} else if (sortColumns.length === 0) {
								sortColumns.push(sortColumn);
							}
						}
					}

					setSortColumns(sortColumns);

					if (!options.multiColumnSort) {
						trigger(self.onSort, {
							multiColumnSort: false,
							sortCol: (sortColumns.length > 0 ? column : null),
							sortAsc: (sortColumns.length > 0 ? sortColumns[0].sortAsc : true)
						}, e);
					} else {
						trigger(
							self.onSort, {
								multiColumnSort: true,
								sortCols: $.map(
									sortColumns, function (col) {
										return {
											sortCol: columns[getColumnIndex(col.columnId)],
											sortAsc: col.sortAsc
										};
									})
							}, e);
					}
				}
			});
		}

		function setupColumnReorder() {
			$headers.filter(':ui-sortable').sortable('destroy');
			var columnScrollTimer = null;

			function scrollColumnsRight() {
				$gridContainerScroller[0].scrollLeft = $gridContainerScroller[0].scrollLeft + 10;
				$headerScrollerR[0].scrollLeft = scrollLeft;
				// $viewportScrollContainerX[0].scrollLeft = $viewportScrollContainerX[0].scrollLeft + 10;
			}

			function scrollColumnsLeft() {
				// $viewportScrollContainerX[0].scrollLeft = $viewportScrollContainerX[0].scrollLeft - 10;
				$gridContainerScroller[0].scrollLeft = $gridContainerScroller[0].scrollLeft - 10;
			}

			if (options.enableDraggableGroupBy) {
				$headers.sortable({
					distance: 3,
					cursor: 'default',
					tolerance: 'intersection',
					helper: 'clone',
					placeholder: 'slick-sortable-placeholder ui-state-default slick-header-column',
					forcePlaceholderSize: true,
					appendTo: 'body',
					zIndex: 1500,
					start: function (e, ui) {
						$(ui.helper).addClass('slick-header-column-active');
					},
					beforeStop: function (e, ui) {
						$(ui.helper).removeClass('slick-header-column-active');
					},
					stop: function (e, ui) {
						if (_groupingWasSet) {
							_groupingWasSet = false;
							return;
						}
						if (!getEditorLock().commitCurrentEdit()) {
							$(this).sortable('cancel');
							return;
						}

						if(!checkIfColumnsCanBeReorder(ui)) {
							$(this).sortable('cancel');
							return;
						}

						var reorderedIdsL = $($headers[0]).sortable('toArray');
						var reorderedIdsR = $($headers[1]).sortable('toArray');
						var reorderedIds = reorderedIdsL.concat(reorderedIdsR);

						pinOrderColumns = [];

						var reorderedColumns = [];
						var pinOrder = 0;

						for (var j = 0; j < reorderedIds.length; j++) {
							var id = reorderedIds[j].replace(uid, '');
							var col = _origColumns[getColumnIndex(id)];
							reorderedColumns.push(_origColumns[getColumnIndex(id)]);
							if(col.pinned)
							{
								col.pinOrder = pinOrder++;
								pinOrderColumns.push(col);
							}
						}

						setColumns(reorderedColumns);

						trigger(self.onColumnsReordered, {});
						e.stopPropagation();
						setupColumnResize();
					}
				});
			} else {
				var columnGrouping = _.find(plugins, { name: 'ColumnGroup' });

				if (!columnGrouping || !columnGrouping.isColumnGroupingEnabled()) {
					$headers.sortable({
						containment: 'parent',
						distance: 3,
						axis: 'x',
						cursor: 'default',
						tolerance: 'intersection',
						helper: 'clone',
						placeholder: 'slick-sortable-placeholder ui-state-default slick-header-column',
						forcePlaceholderSize: true,
						start: function (e, ui) {
							$(ui.helper).addClass('slick-header-column-active');
						},
						beforeStop: function (e, ui) {
							$(ui.helper).removeClass('slick-header-column-active');
						},
						stop: function (e, ui) {
							if (!getEditorLock().commitCurrentEdit()) {
								$(this).sortable('cancel');
								return;
							}

							if(!checkIfColumnsCanBeReorder(ui)) {
								$(this).sortable('cancel');
								return;
							}

							var reorderedIdsL = $($headers[0]).sortable('toArray');
							var reorderedIdsR = $($headers[1]).sortable('toArray');
							var reorderedIds = reorderedIdsL.concat(reorderedIdsR);

							var reorderedColumns = [];
							for (var i = 0; i < reorderedIds.length; i++) {
								reorderedColumns.push(columns[getColumnIndex(reorderedIds[i].replace(uid, ''))]);
							}
							setColumns(reorderedColumns, true);
							trigger(self.onColumnsReordered, {});
							e.stopPropagation();
							setupColumnResize();
						}
					});
				}
			}
		}

		function checkIfColumnsCanBeReorder(ui) {
			var reorderedIdsL = $($headers[0]).sortable('toArray');
			let reorderedIndex = reorderedIdsL.findIndex(item => item === ui.item[0].id);
			if(reorderedIndex >= 0) {
				let systemColCount = 0;
				for (var i = 0; i < reorderedIdsL.length; i++) {
					if (systemColumns.some(v => reorderedIdsL[i].includes(v))) {
						systemColCount++;
					}
				}
				if(reorderedIndex < systemColCount) {
					return false;
				}
			}
			return true;
		}

		function setupColumnResize() {
			var $col, j, c, pageX, columnElements, minPageX, maxPageX, firstResizable, lastResizable;
			columnElements = $headers.children();
			columnElements.find('.slick-resizable-handle').remove();
			columnElements.each(function (i) {
				if (columns[i].resizable && !columns[i].isIndicator) {
					if (firstResizable === undefined) {
						firstResizable = i;
					}
					lastResizable = i;
				}
			});
			if (firstResizable === undefined) {
				return;
			}
			columnElements.each(function (i, e) {
				if (i < firstResizable || (options.forceFitColumns && i >= lastResizable)) {
					return;
				}
				$col = $(e); // fue
				$('<div class="slick-resizable-handle" />')
					.appendTo(e)
					.bind('dragstart touchstart', function (e) {
						if (!getEditorLock().commitCurrentEdit()) {
							return false;
						}
						pageX = e.pageX;
						$(this).parent().addClass('slick-header-column-active');
						var shrinkLeewayOnRight = null,
							stretchLeewayOnRight = null;
						// lock each column's width option to current width
						columnElements.each(function (i, e) {
							columns[i].previousWidth = $(e).outerWidth();
						});
						if (options.forceFitColumns) {
							shrinkLeewayOnRight = 0;
							stretchLeewayOnRight = 0;
							// columns on right affect maxPageX/minPageX
							for (j = i + 1; j < columnElements.length; j++) {
								c = columns[j];
								if (c.resizable) {
									if (stretchLeewayOnRight !== null) {
										if (c.maxWidth) {
											stretchLeewayOnRight += c.maxWidth - c.previousWidth;
										} else {
											stretchLeewayOnRight = null;
										}
									}
									shrinkLeewayOnRight += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth);
								}
							}
						}
						var shrinkLeewayOnLeft = 0,
							stretchLeewayOnLeft = 0;
						for (j = 0; j <= i; j++) {
							// columns on left only affect minPageX
							c = columns[j];
							if (c.resizable) {
								if (stretchLeewayOnLeft !== null) {
									if (c.maxWidth) {
										stretchLeewayOnLeft += c.maxWidth - c.previousWidth;
									} else {
										stretchLeewayOnLeft = null;
									}
								}
								shrinkLeewayOnLeft += c.previousWidth - Math.max(c.minWidth || 0, absoluteColumnMinWidth);
							}
						}
						if (shrinkLeewayOnRight === null) {
							shrinkLeewayOnRight = 100000;
						}
						if (shrinkLeewayOnLeft === null) {
							shrinkLeewayOnLeft = 100000;
						}
						if (stretchLeewayOnRight === null) {
							stretchLeewayOnRight = 100000;
						}
						if (stretchLeewayOnLeft === null) {
							stretchLeewayOnLeft = 100000;
						}
						maxPageX = pageX + Math.min(shrinkLeewayOnRight, stretchLeewayOnLeft);
						minPageX = pageX - Math.min(shrinkLeewayOnLeft, stretchLeewayOnRight);
					}).bind('drag touchmove', function (e) {

						var actualMinWidth, d = Math.min(maxPageX, Math.max(minPageX, e.pageX)) - pageX,
							x;

						if (d < 0) { // shrink column
							x = d;

							var newCanvasWidthL = 0, newCanvasWidthR = 0;

							for (j = i; j >= 0; j--) {
								c = columns[j];
								if (c.resizable) {
									actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth);
									if (x && c.previousWidth + x < actualMinWidth) {
										x += c.previousWidth - actualMinWidth;
										c.width = actualMinWidth;
									} else {
										c.width = c.previousWidth + x;
										x = 0;
									}
								}
							}

							for (k = 0; k <= i; k++) {
								c = columns[k];

								if (hasFrozenColumns() && (!c.pinned)) {
									newCanvasWidthR += c.width;
								} else {
									newCanvasWidthL += c.width;
								}
							}

							if (options.forceFitColumns) {
								x = -d;

								for (j = i + 1; j < columnElements.length; j++) {
									c = columns[j];
									if (c.resizable) {
										if (x && c.maxWidth && (c.maxWidth - c.previousWidth < x)) {
											x -= c.maxWidth - c.previousWidth;
											c.width = c.maxWidth;
										} else {
											c.width = c.previousWidth + x;
											x = 0;
										}

										if (hasFrozenColumns() && (!c.pinned)) {
											newCanvasWidthR += c.width;
										} else {
											newCanvasWidthL += c.width;
										}
									}
								}
							} else {
								for (j = i + 1; j < columnElements.length; j++) {
									c = columns[j];

									if (hasFrozenColumns() && (!c.pinned)) {
										newCanvasWidthR += c.width;
									} else {
										newCanvasWidthL += c.width;
									}
								}
							}
						} else { // stretch column
							x = d;

							var newCanvasWidthL = 0, newCanvasWidthR = 0;

							for (j = i; j >= 0; j--) {
								c = columns[j];
								if (c.resizable) {
									if (x && c.maxWidth && (c.maxWidth - c.previousWidth < x)) {
										x -= c.maxWidth - c.previousWidth;
										c.width = c.maxWidth;
									} else {
										c.width = c.previousWidth + x;
										x = 0;
									}
								}
							}

							for (k = 0; k <= i; k++) {
								c = columns[k];

								if (hasFrozenColumns() && (!c.pinned)) {
									newCanvasWidthR += c.width;
								} else {
									newCanvasWidthL += c.width;
								}
							}

							if (options.forceFitColumns) {
								x = -d;

								for (j = i + 1; j < columnElements.length; j++) {
									c = columns[j];
									if (c.resizable) {
										actualMinWidth = Math.max(c.minWidth || 0, absoluteColumnMinWidth);
										if (x && c.previousWidth + x < actualMinWidth) {
											x += c.previousWidth - actualMinWidth;
											c.width = actualMinWidth;
										} else {
											c.width = c.previousWidth + x;
											x = 0;
										}

										if (hasFrozenColumns() && (!c.pinned)) {
											newCanvasWidthR += c.width;
										} else {
											newCanvasWidthL += c.width;
										}
									}
								}
							} else {
								for (j = i + 1; j < columnElements.length; j++) {
									c = columns[j];

									if (hasFrozenColumns() && (!c.pinned)) {
										newCanvasWidthR += c.width;
									} else {
										newCanvasWidthL += c.width;
									}
								}
							}
						}

						if (hasFrozenColumns() && newCanvasWidthL !== canvasWidthL) {
							$headerL.width(newCanvasWidthL + 1000);
							$paneHeaderR.css('left', newCanvasWidthL);
						}

						applyColumnHeaderWidths();
						if (options.syncColumnCellResize) {
							updateCanvasWidth();
							applyColumnWidths();
						}
					}).bind('dragend touchend', function (e, dd) {
						var newWidth;
						$(this).parent().removeClass('slick-header-column-active');
						for (j = 0; j < columnElements.length; j++) {
							c = columns[j];
							newWidth = $(columnElements[j]).outerWidth();

							if (c.previousWidth !== newWidth && c.rerenderOnResize) {
								invalidateAllRows();
							}
						}

						getViewportHeight();
						updateCanvasWidth(true);
						render();
						trigger(self.onColumnsResized, {});
						resizeCanvas();
					});
			});
		}

		function getVBoxDelta($el) {
			var p = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];
			var delta = 0;
			$.each(p, function (n, val) {
				delta += parseFloat($el.css(val)) || 0;
			});
			return delta;
		}

		function remapColumns(cols) {

			var frozen = 0;
			var columnList;
			if (cols) {
				columnList = cols;
			} else {
				columnList = _origColumns;
			}

			columns = [];
			pinOrderColumns = _origColumns.filter(function (item) {
				return item.pinned === true;
			});
			pinOrderColumns.sort(function (a, b) {
				return a.pinOrder - b.pinOrder;
			});
			for (var i = 0; i < pinOrderColumns.length; i++) {
				var c = pinOrderColumns[i] = $.extend({}, columnDefaults, pinOrderColumns[i]);;
				columns.push(c);
			}
			frozen = columns.length;
			for (var i = 0; i < columnList.length; i++) {
				var col = columnList[i] = $.extend({}, columnDefaults, columnList[i]);
				if (!col.pinned) {
					columns.push(col);
				}
			}
			options.frozenColumn = (frozen >= 0 && frozen < columns.length) ? parseInt(frozen) : -1;
		}

		function setColumnsFixed(cols) {
			for (var i = 0; i < cols.length; i++) {
				for (var j = 0; j < _origColumns.length; i++) {
					if (cols[i].id === _origColumns[j].id) {
						_origColumns[j].pinned = cols.pinned;
					}
					if (i !== j) {
						_origColumns.move(j, i);
					}
				}
			}
			remapColumns();
		}

		function setFrozenOptions(defs) {
			remapColumns(defs);

			options.frozenRow = (options.frozenRow >= 0 && options.frozenRow < numVisibleRows) ? parseInt(options.frozenRow) : -1;

			if (options.frozenRow > -1) {
				hasFrozenRows = true;
				frozenRowsHeight = (options.frozenRow) * options.rowHeight;

				var dataLength = getDataLength() || this.data.length;

				actualFrozenRow = (options.frozenBottom) ? (dataLength - options.frozenRow) : options.frozenRow;
			} else {
				hasFrozenRows = false;
			}
		}

		function setPaneVisibility() {
			if (hasFrozenColumns()) {
				$paneHeaderR.show();
				$paneTopR.show();

				if (hasFrozenRows) {
					$paneBottomL.show();
					$paneBottomR.show();
				} else {
					$paneBottomR.hide();
					$paneBottomL.hide();
				}
			} else {
				$paneHeaderR.hide();
				$paneTopR.hide();
				$paneBottomR.hide();

				if (hasFrozenRows) {
					$paneBottomL.show();
				} else {
					$paneBottomR.hide();
					$paneBottomL.hide();
				}
			}
		}

		function setOverflow() {
			$viewportTopL.css({
				'overflow-x': (hasFrozenColumns()) ? (hasFrozenRows) ? 'hidden' : 'hidden' : (hasFrozenRows) ? 'hidden' : 'hidden',
				'overflow-y': (hasFrozenColumns()) ? (hasFrozenRows) ? 'hidden' : 'hidden' : (hasFrozenRows) ? 'hidden' : 'auto'
			});

			$viewportTopR.css({
				'overflow-x': (hasFrozenColumns()) ? (hasFrozenRows) ? 'hidden' : 'hidden' : (hasFrozenRows) ? 'hidden' : 'hidden',
				'overflow-y': (hasFrozenColumns()) ? (hasFrozenRows) ? 'hidden' : 'auto' : (hasFrozenRows) ? 'hidden' : 'auto'
			});

			$viewportBottomL.css({
				'overflow-x': (hasFrozenColumns()) ? (hasFrozenRows) ? 'hidden' : 'hidden' : (hasFrozenRows) ? 'hidden' : 'hidden',
				'overflow-y': (hasFrozenColumns()) ? (hasFrozenRows) ? 'hidden' : 'hidden' : (hasFrozenRows) ? 'hidden' : 'auto'
			});

			$viewportBottomR.css({
				'overflow-x': (hasFrozenColumns()) ? (hasFrozenRows) ? 'hidden' : 'hidden' : (hasFrozenRows) ? 'hidden' : 'hidden',
				'overflow-y': (hasFrozenColumns()) ? (hasFrozenRows) ? 'auto' : 'auto' : (hasFrozenRows) ? 'auto' : 'auto'
			});
		}

		function setScroller() {
			if (hasFrozenColumns()) {
				$headerScrollContainer = $headerScrollerR;
				$headerRowScrollContainer = $headerRowScrollerR;

				if (hasFrozenRows) {
					if (options.frozenBottom) {
						$viewportScrollContainerX = $viewportBottomR;
						$viewportScrollContainerY = $viewportTopR;
					} else {
						$viewportScrollContainerX = $viewportScrollContainerY = $viewportBottomR;
					}
				} else {
					$viewportScrollContainerX = $viewportScrollContainerY = $viewportTopR;
				}
			} else {
				$headerScrollContainer = $headerScrollerL;
				$headerRowScrollContainer = $headerRowScrollerL;

				if (hasFrozenRows) {
					if (options.frozenBottom) {
						$viewportScrollContainerX = $viewportBottomL;
						$viewportScrollContainerY = $viewportTopL;
					} else {
						$viewportScrollContainerX = $viewportScrollContainerY = $viewportBottomL;
					}
				} else {
					$viewportScrollContainerX = $viewportScrollContainerY = $viewportTopL;
				}
			}
		}

		function measureCellPaddingAndBorder() {
			var el;
			var h = ['borderLeftWidth', 'borderRightWidth', 'paddingLeft', 'paddingRight'];
			var v = ['borderTopWidth', 'borderBottomWidth', 'paddingTop', 'paddingBottom'];

			el = $('<div class="ui-state-default slick-header-column" style="visibility:hidden">-</div>').appendTo($headers);
			headerColumnWidthDiff = headerColumnHeightDiff = 0;
			if (el.css('box-sizing') !== 'border-box' && el.css('-moz-box-sizing') !== 'border-box' && el.css('-webkit-box-sizing') !== 'border-box') {
				$.each(h, function (n, val) {
					headerColumnWidthDiff += parseFloat(el.css(val)) || 0;
				});
				$.each(v, function (n, val) {
					headerColumnHeightDiff += parseFloat(el.css(val)) || 0;
				});
			}
			if (headerColumnWidthDiff === 0) {
				headerColumnWidthDiff = 9;
			}
			el.remove();

			var r = $('<div class="slick-row" />').appendTo($canvas);
			el = $('<div class="slick-cell" id="" style="visibility:hidden">-</div>').appendTo(r);
			cellWidthDiff = cellHeightDiff = 0;
			if (el.css('box-sizing') !== 'border-box' && el.css('-moz-box-sizing') !== 'border-box' && el.css('-webkit-box-sizing') !== 'border-box') {
				$.each(h, function (n, val) {
					cellWidthDiff += parseFloat(el.css(val)) || 0;
				});
				$.each(v, function (n, val) {
					cellHeightDiff += parseFloat(el.css(val)) || 0;
				});
			}
			r.remove();

			absoluteColumnMinWidth = Math.max(headerColumnWidthDiff, cellWidthDiff);
		}

		function createCssRules() {
			$style = $('<style type="text/css" rel="stylesheet" />').appendTo($('head'));
			var rowHeight = (options.rowHeight - cellHeightDiff);
			var rules = [
				'.' + uid + ' .slick-header-column { left: 1000px; }',
				'.' + uid + ' .slick-top-panel { height:' + options.topPanelHeight + 'px; }',
				'.' + uid + ' .slick-headerrow-columns { height:' + options.headerRowHeight + 'px; }',
				'.' + uid + ' .slick-cell { height:' + rowHeight + 'px; }',
				'.' + uid + ' .slick-row { height:' + options.rowHeight + 'px; }'
			];

			for (var i = 0; i < columns.length; i++) {
				if (columns[i].hidden === true) {
					continue;
				}
				rules.push('.' + uid + ' .l' + i + ' { }');
				rules.push('.' + uid + ' .r' + i + ' { }');
			}

			if ($style[0].styleSheet) { // IE
				$style[0].styleSheet.cssText = rules.join(' ');
			} else {
				$style[0].appendChild(document.createTextNode(rules.join(' ')));
			}
		}

		function getColumnCssRules(idx) {
			if (!stylesheet) {
				var sheets = document.styleSheets;
				for (var i = 0; i < sheets.length; i++) {
					if ((sheets[i].ownerNode || sheets[i].owningElement) === $style[0]) {
						stylesheet = sheets[i];
						break;
					}
				}

				if (!stylesheet) {
					throw new Error('Cannot find stylesheet.');
				}

				// find and cache column CSS rules
				columnCssRulesL = [];
				columnCssRulesR = [];
				var cssRules = (stylesheet.cssRules || stylesheet.rules);
				var matches, columnIdx;
				for (var i = 0; i < cssRules.length; i++) {
					var selector = cssRules[i].selectorText;
					if ((matches = /\.l\d+/.exec(selector))) {
						columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
						columnCssRulesL[columnIdx] = cssRules[i];
					} else if ((matches = /\.r\d+/.exec(selector))) {
						columnIdx = parseInt(matches[0].substr(2, matches[0].length - 2), 10);
						columnCssRulesR[columnIdx] = cssRules[i];
					}
				}
			}

			return {
				'left': columnCssRulesL[idx],
				'right': columnCssRulesR[idx]
			};
		}

		function removeCssRules() {
			$style.remove();
			stylesheet = null;
		}

		function destroy(shouldDestroyAllElements) {
			if (rowsCache) {
				_.forEach(rowsCache, (row, idx) => {
					removeRowFromCache(idx);
				});
			}
			rowsCache = {};
			getEditController().cancelCurrentEdit();
			trigger(self.onBeforeDestroy, {});
			var i = plugins.length;
			while (i--) {
				unregisterPlugin(plugins[i]);
			}
			if (options.enableColumnReorder) {
				$headers.filter(':ui-sortable').sortable('destroy');
			}
			unbindAncestorScrollEvents();
			$container.off();
			removeCssRules();
			$canvas.unbind('draginit dragstart dragend drag');
			$canvas.off();
			$viewport.off();
			$headerScroller.off();
			$headerRowScroller.off();
			$focusSink.off();
			$('.' + uid + ' .slick-resizable-handle').off();
			$('.' + uid + ' .slick-header-column').off();
			$container.empty().removeClass(uid);
			if (shouldDestroyAllElements) {
				destroyAllElements();
			}
		}

		function destroyAllElements() {
			headerElements = [];
			$activeCanvasNode = null;
			$activeViewportNode = null;
			$boundAncestors = null;
			$canvas = null;
			$canvasTopL = null;
			$canvasTopR = null;
			$canvasBottomL = null;
			$canvasBottomR = null;
			$container = null;
			$focusSink = null;
			$focusSink2 = null;
			$headerL = null;
			$headerR = null;
			$headers = null;
			$headerRow = null;
			$headerRowL = null;
			$headerRowR = null;
			$headerRowSpacerL = null;
			$headerRowSpacerR = null;
			$headerRowScrollContainer = null;
			$headerRowScroller = null;
			$headerRowScrollerL = null;
			$headerRowScrollerR = null;
			$headerScrollContainer = null;
			$headerScroller = null;
			$headerScrollerL = null;
			$headerScrollerR = null;
			$topPanel = null;
			$topPanelScroller = null;
			$style = null;
			$topPanelScrollerL = null;
			$topPanelScrollerR = null;
			$topPanelL = null;
			$topPanelR = null;
			$paneHeaderL = null;
			$paneHeaderR = null;
			$paneTopL = null;
			$paneTopR = null;
			$paneBottomL = null;
			$paneBottomR = null;
			$viewport = null;
			$viewportTopL = null;
			$viewportTopR = null;
			$viewportBottomL = null;
			$viewportBottomR = null;
			$viewportScrollContainerX = null;
			$viewportScrollContainerY = null;
		}

		// ////////////////////////////////////////////////////////////////////////////////////////////
		// General

		function trigger(evt, args, e) {
			e = e || new Slick.EventData();
			args = args || {};
			args.grid = self;
			return evt.notify(args, e, self);
		}

		function getEditorLock() {
			return options.editorLock;
		}

		function getEditController() {
			return editController;
		}

		function getColumnIndex(id) {
			return columnsById[id];
		}

		function autosizeColumns() {
			var i, c, widths = [],
				shrinkLeeway = 0,
				total = 0,
				prevTotal, availWidth = viewportHasVScroll ? viewportW - scrollbarDimensions.width : viewportW;

			for (i = 0; i < columns.length; i++) {
				c = columns[i];
				widths.push(c.width);
				total += c.width;
				if (c.resizable) {
					shrinkLeeway += c.width - Math.max(c.minWidth, absoluteColumnMinWidth);
				}
			}

			// shrink
			prevTotal = total;
			while (total > availWidth && shrinkLeeway) {
				var shrinkProportion = (total - availWidth) / shrinkLeeway;
				for (i = 0; i < columns.length && total > availWidth; i++) {
					c = columns[i];
					var width = widths[i];
					if (!c.resizable || width <= c.minWidth || width <= absoluteColumnMinWidth) {
						continue;
					}
					var absMinWidth = Math.max(c.minWidth, absoluteColumnMinWidth);
					var shrinkSize = Math.floor(shrinkProportion * (width - absMinWidth)) || 1;
					shrinkSize = Math.min(shrinkSize, width - absMinWidth);
					total -= shrinkSize;
					shrinkLeeway -= shrinkSize;
					widths[i] -= shrinkSize;
				}
				if (prevTotal === total) { // avoid infinite loop
					break;
				}
				prevTotal = total;
			}

			// grow
			prevTotal = total;
			while (total < availWidth) {
				var growProportion = availWidth / total;
				for (i = 0; i < columns.length && total < availWidth; i++) {
					c = columns[i];
					if (!c.resizable || c.maxWidth <= c.width) {
						continue;
					}
					var growSize = Math.min(Math.floor(growProportion * c.width) - c.width, (c.maxWidth - c.width) || 1000000) || 1;
					total += growSize;
					widths[i] += growSize;
				}
				if (prevTotal === total) { // avoid infinite loop
					break;
				}
				prevTotal = total;
			}

			var reRender = false;
			for (i = 0; i < columns.length; i++) {
				if (columns[i].rerenderOnResize && columns[i].width !== widths[i]) {
					reRender = true;
				}
				columns[i].width = widths[i];
			}

			applyColumnHeaderWidths();
			updateCanvasWidth(true);
			if (reRender) {
				invalidateAllRows();
				render();
			}
		}

		function applyColumnHeaderWidths() {
			if (!initialized) {
				return;
			}
			var h;

			for (var i = 0, headers = $headers.children(), ii = headers.length; i < ii; i++) {
				h = $(headers[i]);

				if (h.width() !== columns[i].width - headerColumnWidthDiff) {
					h.width(columns[i].width - headerColumnWidthDiff);
				}
			}

			updateColumnCaches();
		}

		function applyColumnWidths() {
			var x = 0,
				_leftColOffset = 0, _rightColOffset = 0,
				w, rule;
			for (var i = 0; i < columns.length; i++) {
				w = columns[i].width;
				if (columns[i].hidden === true) {
					continue;
				}
				x = columns[i].pinned ? _leftColOffset : _rightColOffset;
				rule = getColumnCssRules(i);
				rule.left.style.left = x + 'px';
				rule.right.style.right = (((options.frozenColumn !== -1 && !columns[i].pinned) ? canvasWidthR : canvasWidthL) - x - w) + 'px';
				if (columns[i].pinned) {
					_leftColOffset += w;
				} else {
					_rightColOffset += w;
				}
			}
		}

		function setSortColumn(columnId, ascending) {
			setSortColumns([
				{
					columnId: columnId,
					sortAsc: ascending
				}
			]);
		}

		function setSortColumns(cols) {
			sortColumns = cols;
			var numberCols = options.numberedMultiColumnSort && sortColumns.length > 1;
			var headerColumnEls = $headers.children();
			headerColumnEls.removeClass('slick-header-column-sorted').find('.slick-sort-indicator').removeClass('slick-sort-indicator-asc slick-sort-indicator-desc');
			headerColumnEls
				.find('.slick-sort-indicator-numbered')
				.text('');

			$.each(sortColumns, function (i, col) {
				if (col.sortAsc == null) {
					col.sortAsc = true;
				}
				var columnIndex = getColumnIndex(col.columnId);
				if (columnIndex !== null) {
					headerColumnEls.eq(columnIndex)
						.addClass('slick-header-column-sorted')
						.find('.slick-sort-indicator')
						.addClass(col.sortAsc ? 'slick-sort-indicator-asc' : 'slick-sort-indicator-desc');
					if (numberCols) {
						headerColumnEls.eq(columnIndex)
							.find('.slick-sort-indicator-numbered')
							.text(i + 1);
					}
				}
			});
		}

		function getSortColumns() {
			return sortColumns;
		}

		var lastSelectedRows = [];

		function handleSelectedRangesChanged(e, args) {
			selectedRows = [];
			var ranges = args.ranges;
			var hash = {};
			for (var i = 0; i < ranges.length; i++) {
				for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
					if (!hash[j]) { // prevent duplicates
						selectedRows.push(j);
						hash[j] = {};
					}
					for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
						if (canCellBeSelected(j, k)) {
							hash[j][columns[k].id] = options.selectedCellCssClass;
						}
					}
				}
			}

			setCellCssStyles(options.selectedCellCssClass, hash);

			var currentSelectedRows = getSelectedRows();
			if (!compareArrays(currentSelectedRows, lastSelectedRows)) {
				if (!args.surpressNotification) {
					trigger(self.onSelectedRowsChanged, { rows: getSelectedRows(), previousRows: lastSelectedRows }, e);
				}
				lastSelectedRows = getSelectedRows();
			}
		}

		function highlightRanges(ranges) {
			var hash = {};

			for (var i = 0; i < ranges.length; i++) {
				for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
					if (!hash[j]) {
						hash[j] = {};
					}
					for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
						hash[j][columns[k].id] = options.highlightedCellCssClass;
					}
				}
			}

			setCellCssStyles(options.highlightedCellCssClass, hash);
		}

		function highlightRows(rows) {
			highlightRanges(rowsToRanges(rows));
		}

		function clearHighlightRows() {
			removeCellCssStyles(options.highlightedCellCssClass);
		}

		function clearSelectedRows(){
			removeCellCssStyles(options.selectedCellCssClass);
		}

		function compareArrays(array1, array2) {
			// if the other array is a falsy value, return
			if (!array1 || !array2) {
				return false;
			}

			// compare lengths - can save a lot of time
			if (array1.length !== array2.length) {
				return false;
			}

			for (var i = 0, l = array1.length; i < l; i++) {
				// Check if we have nested arrays
				if (array1[i] instanceof Array && array2[i] instanceof Array) {
					// recurse into the nested arrays
					if (!array1[i].equals(array2[i])) {
						return false;
					}
				} else if (array1[i] !== array2[i]) {
					// Warning - two different object instances will never be equal: {x:20} != {x:20}
					return false;
				}
			}
			return true;
		}

		function getColumns() {
			return columns;
		}

		function updateColumnCaches() {
			// Pre-calculate cell boundaries.
			columnPosLeft = [];
			columnPosRight = [];
			var x = 0, _leftColOffset = 0, _rightColOffset = 0;
			for (var i = 0, ii = columns.length; i < ii; i++) {
				x = columns[i].pinned ? _leftColOffset : _rightColOffset;
				columnPosLeft[i] = x;
				columnPosRight[i] = x + columns[i].width;

				if (columns[i].pinned) {
					_leftColOffset += columns[i].width;
				} else {
					_rightColOffset += columns[i].width;
				}
			}
		}

		function updateColumnProps() {
			columnsById = {};
			for (var i = 0; i < columns.length; i++) {
				var m = columns[i] = $.extend({}, columnDefaults, columns[i]);
				if (columns[i].hidden === true) {
					continue;
				}
				columnsById[m.id] = i;
				if (m.minWidth && m.width < m.minWidth) {
					m.width = m.minWidth;
				}
				if (m.maxWidth && m.width > m.maxWidth) {
					m.width = m.maxWidth;
				}
			}
		}

		function reorderColumns(columnDefs) {
			_origColumns = columnDefs;
			remapColumns(columnDefs);
			updateColumnCaches();

			if (initialized) {
				setFrozenOptions(columnDefs);
				setPaneVisibility();
				setScroller();
				setOverflow();

				invalidateAllRows();
				createColumnHeaders();
				removeCssRules();
				createCssRules();
				resizeCanvas();
				updateCanvasWidth();
				applyColumnWidths();
				handleScroll();
				recalcMainScrollbar();
			}
		}

		function setColumns(columnDefinitions) {
			_origColumns = columnDefinitions;
			if (data.hasOwnProperty('groupBy')) {
				data.setColumns(_origColumns);
			}

			remapColumns(columnDefinitions);
			updateColumnProps();
			updateColumnCaches();

			if (initialized) {
				setFrozenOptions();
				setPaneVisibility();
				setScroller();
				setOverflow();

				invalidateAllRows();
				createColumnHeaders();
				removeCssRules();
				createCssRules();
				resizeCanvas();
				updateCanvasWidth();
				applyColumnWidths();
				handleScroll();
				recalcMainScrollbar();
			}
		}

		function getOptions() {
			return options;
		}

		function setOptions(args, suppressColumnSet) {
			if (!getEditorLock().commitCurrentEdit()) {
				return;
			}

			makeActiveCellNormal();

			if (options.enableAddRow !== args.enableAddRow) {
				invalidateRow(getDataLength());
			}

			options = $.extend(options, args);
			validateAndEnforceOptions();

			setFrozenOptions();
			setScroller();

			if (!suppressColumnSet) {
				setColumns(columns);
			}
			render();
		}

		function validateAndEnforceOptions() {
			if (options.autoHeight) {
				options.leaveSpaceForNewRows = false;
			}
		}

		function setData(newData, scrollToTop) {
			data = newData;
			invalidateAllRows();
			updateRowCount();

			if (scrollToTop) {
				scrollTo(0);
			}
		}

		function getData() {
			return data;
		}

		function getDataLength() {
			if (data.getLength) {
				return data.getLength();
			} else {
				return data.length;
			}
		}

		function getDataLengthIncludingAddNew() {
			return getDataLength() + (options.enableAddRow ? 1 : 0);
		}

		function getDataItem(i) {
			if (data.getItem) {
				return data.getItem(i);
			} else {
				return data[i];
			}
		}

		function getTopPanel() {
			return $topPanel[0];
		}

		function getMainTopPanel() {
			return $mainTopPanelScroller;
		}

		function setTopPanelVisibility(visible) {
			if (options.showTopPanel !== visible) {
				options.showTopPanel = visible;
				if (visible) {
					$topPanelScroller.slideDown('fast', resizeGrid);
				} else {
					$topPanelScroller.slideUp('fast', resizeGrid);
				}
			}
		}

		function setHeaderRowVisibility(visible) {
			if (options.showHeaderRow !== visible) {
				options.showHeaderRow = visible;
				if (visible) {
					$headerRowScroller.slideDown('fast', resizeGrid);
				} else {
					$headerRowScroller.slideUp('fast', resizeGrid);
				}
			}
		}

		function getContainerNode() {
			return $container.get(0);
		}

		// ////////////////////////////////////////////////////////////////////////////////////////////
		// Rendering / Scrolling

		function getRowTop(row) {
			return options.rowHeight * row - offset;
		}

		function getRowFromPosition(y) {
			return Math.floor((y + offset) / options.rowHeight);
		}

		function scrollTo(y) {
			y = Math.max(y, 0);
			y = Math.min(y, th - $viewportScrollContainerY.height() + ((viewportHasHScroll || hasFrozenColumns()) ? scrollbarDimensions.height : 0));

			var oldOffset = offset;

			page = Math.min(n - 1, Math.floor(y / ph));
			offset = Math.round(page * cj);
			var newScrollTop = y - offset;

			if (offset !== oldOffset) {
				var range = getVisibleRange(newScrollTop);
				cleanupRows(range);
				updateRowPositions();
			}

			if (prevScrollTop !== newScrollTop) {
				vScrollDir = (prevScrollTop + oldOffset < newScrollTop + offset) ? 1 : -1;

				lastRenderedScrollTop = (scrollTop = prevScrollTop = newScrollTop);

				if (hasFrozenColumns()) {
					$viewportTopL[0].scrollTop = newScrollTop;
				}

				if (hasFrozenRows) {
					$viewportBottomL[0].scrollTop = $viewportBottomR[0].scrollTop = newScrollTop;
				}

				$viewportScrollContainerY[0].scrollTop = newScrollTop;

				trigger(self.onViewportChanged, {});
			}
		}

		function defaultFormatter(row, cell, value) {
			if (value == null) {
				return '';
			} else {
				return (value + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}
		}

		function getFormatter(row, column) {
			var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
			var columnOverrides;
			if (rowMetadata && rowMetadata.group && getColumnIndex(column.id) !== 0) {
				columnOverrides = rowMetadata && rowMetadata.group &&
					rowMetadata.group.columns &&
					(rowMetadata.group.columns[1] || rowMetadata.group.columns[1]);
			} else if (rowMetadata) {
				rowMetadata = rowMetadata.group || rowMetadata.mergedCells || rowMetadata.groupTotals;
				columnOverrides = rowMetadata &&
					rowMetadata.columns &&
					(rowMetadata.columns[column.id] || rowMetadata.columns[getColumnIndex(column.id)]);
			}

			// look up by id, then index

			return (columnOverrides && columnOverrides.formatter) ||
				(rowMetadata && rowMetadata.formatter) ||
				(column && column.formatter) ||
				(options.formatterFactory && options.formatterFactory.getFormatter(column)) ||
				options.defaultFormatter;
		}

		function getEditor(row, cell) {
			var column = columns[cell];
			var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
			var columnMetadata = rowMetadata && rowMetadata.columns;

			if (columnMetadata && columnMetadata[column.id] && columnMetadata[column.id].editor !== undefined) {
				return columnMetadata[column.id].editor;
			}
			if (columnMetadata && columnMetadata[cell] && columnMetadata[cell].editor !== undefined) {
				return columnMetadata[cell].editor;
			}

			return column.editor || (options.editorFactory && options.editorFactory.getEditor(column));
		}

		function getDataItemValueForColumn(item, columnDef) {
			if (options.dataItemColumnValueExtractor) {
				return options.dataItemColumnValueExtractor(item, columnDef);
			}
			return item[columnDef.field];
		}

		function buildRowHtml(rowCss, row, d, left) {
			var frozenRowOffset = getFrozenRowOffset(row);
			rowCss += left === true ? ' slick-fix-row' : '';
			if (options.tree && d.nodeInfo.children) {
				rowHtml = '<div class="ui-widget-content levelnode ' + rowCss + '" style="top:'
					+ (getRowTop(row) - frozenRowOffset)
					+ 'px" level' + d.nodeInfo.level + '>';
			} else {
				rowHtml = '<div class="ui-widget-content ' + rowCss + '" style="top:'
					+ (getRowTop(row) - frozenRowOffset)
					+ 'px">';
			}
			return rowHtml;
		}

		function appendRowHtml(stringArrayL, stringArrayR, row, range, dataLength) {
			var d = getDataItem(row);
			var dataLoading = row < dataLength && !d;

			var rowCss = 'slick-row' +
				(dataLoading ? ' loading' : '') +
				(row === activeRow ? ' active' : '');

			if (options.tree && d && d.nodeInfo && d.nodeInfo.children) {
				rowCss += ' tree-node';
			} else if ((options.tree && d && d.nodeInfo && !d.nodeInfo.children) || (!d.__group && getData().grouped())) {
				rowCss += ' odd';
			} else if (!options.tree) {
				rowCss += (row % 2 === 1 ? ' odd' : ' even');
			}
			if (!d) {
				rowCss += ' ' + options.addNewRowCssClass;
			}
			if (d.__rt$data && d.__rt$data.rowCss) {
				var css = Array.isArray(d.__rt$data.rowCss) ? d.__rt$data.rowCss.join(' ') : d.__rt$data.rowCss;
				rowCss += ' ' + css;
			}

			let cellCss = {
				'fieldname': 'cssclass'
			};

			var metadata = data.getItemMetadata && data.getItemMetadata(row);
			if (metadata && (metadata.mergedCells || metadata.group || metadata.groupTotals)) {
				metadata = metadata.mergedCells || metadata.group || metadata.groupTotals;
			}
			if (metadata && metadata.cssClasses) {
				rowCss += ' ' + metadata.cssClasses;
			}

			var isRowReadonly = rowCss.indexOf('row-readonly-background') >= 0 ? true : false;

			if (d && options && options.idProperty && d[options.idProperty]) {
				rowCss += ' item-id_' + d[options.idProperty];
			}

			stringArrayL.push(buildRowHtml(rowCss, row, d, true));
			if (hasFrozenColumns()) {
				stringArrayR.push(buildRowHtml(rowCss, row, d));
			}

			var colspan, m;
			for (var i = 0, ii = columns.length; i < ii; i++) {
				m = columns[i];
				if (!columns[i].hidden) {
					colspan = 1;
					if (metadata && metadata.columns) {
						var columnData = metadata.columns[m.id] || metadata.columns[i];
						colspan = (columnData && columnData.colspan) || 1;
						if (colspan === '*') {
							colspan = ii - i;
						}
					}

					// Do not render cells outside of the viewport.
					if (columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
						if ((options.frozenColumn > -1) && (!columns[i].pinned)) {// && !d.__group) {
							appendCellHtml(stringArrayR, row, i, colspan, d, null, isRowReadonly);
						} else {
							appendCellHtml(stringArrayL, row, i, colspan, d, null, isRowReadonly);
						}
					} else if ((options.frozenColumn > -1) && (columns[i].pinned)) {
						appendCellHtml(stringArrayL, row, i, colspan, d, null, isRowReadonly);
					}

					if (colspan > 1) {
						i += (colspan - 1);
					}
				}
			}

			if (d.__group) {
				for (var i = 0, ii = columns.length; i < ii; i++) {
					if (i > 1) {
						buildGroupRowRight(stringArrayR, row, i, 1, d);
					}
				}
			}

			stringArrayL.push('</div>');

			if (hasFrozenColumns()) {
				stringArrayR.push('</div>');
			}
		}

		function buildGroupRowRight(stringArray, row, cell, colspan, d) {
			var m = columns[cell];
			let value;
			if (d.totals) {
				for (var p in d.totals.sum) {
					if (p === m.field) {
						value = d.sumCellFormatter(d.totals.sum[p], d.totals.precision[m.field]);
					}
				}
			}
			var cellCss = 'slick-cell l' + cell + ' r' + Math.min(columns.length - 1, cell + colspan - 1) + (value ? ' text-right' : '');
			var uniqueId = _.uniqueId('slickCell');
			stringArray.push('<div  id="' + uniqueId + '"  class="' + cellCss + '">');
			if (value) {
				stringArray.push('<span>' + value + '</span>');
			}
			stringArray.push('</div>');
		}

		function appendCellHtml(stringArray, row, cell, colspan, item, groupRow, isRowReadonly) {
			var m = columns[cell];
			m.gridUid = getUID();
			var cellCss;
			if (item.__group && cell > 0) {
				cellCss = 'slick-cell l' + cell + ' r' + Math.min(columns.length - 1, cell + colspan - 1) +
					(m.cssClass !== 'text-right' ? ' ' + m.cssClass : '');
			} else {
				cellCss = 'slick-cell l' + cell + ' r' + Math.min(columns.length - 1, cell + colspan - 1) +
					(m.cssClass ? ' ' + m.cssClass : '');
			}
			if (row === activeRow && cell === activeCell) {
				cellCss += (' active');
			}
			if (item.__rt$data && item.__rt$data.cellCss) {
				cellCss += item.__rt$data.cellCss[m.field];
			}

			if (!readOnly) {
				if (!_.isUndefined(m.editor) && m.editor === null) {
					if (!_.isUndefined(m.editorOptions) && m.editorOptions === null) {
						cellCss += (' column-readonly');
					} else if (_.isUndefined(m.editorOptions)) {
						cellCss += (' column-readonly');
					}
				} else if (!isRowReadonly && (_.get(item, '__rt$data.locked', false) || _.get(item, '__rt$data.entityReadonly', false) || _.get(_.find(_.get(item, '__rt$data.readonly', []), { field: m.field }), 'readonly', false))) {
					cellCss += (' cell-readonly');
				}
			}

			// TODO:  merge them together in the setter
			for (var key in cellCssClasses) {
				if (cellCssClasses[key][row] && cellCssClasses[key][row][m.id]) {
					cellCss += (' ' + cellCssClasses[key][row][m.id]);
				}
			}

			cellCss +=  ` item-field_${m.field} column-id_${m.id}`;

			var uniqueId = _.uniqueId('slickCell');
			if (m.id === 'indicator' && item.$$indColor) {
				stringArray.push('<div  id="' + uniqueId + '"  class="' + cellCss + '" style="background-color: ' + item.$$indColor + '">');
			} else {
				stringArray.push('<div  id="' + uniqueId + '"  class="' + cellCss + '">');
			}

			// if there is a corresponding row (if not, this is the Add New row or this data hasn't been loaded yet)
			if (item && !groupRow) {
				var value = getDataItemValueForColumn(item, m);

				if(item.__group) {
					item.title = options.sanitize(item.title);
				}

				// !!! DON'T TOUCH/CHANGE NEXT LINE !!!
				stringArray.push(getFormatter(row, m)(row, cell, value, m, item, false, uniqueId, { editable: options.editable }));
			}

			stringArray.push('</div>');

			rowsCache[row].cellRenderQueue.push(cell);
			rowsCache[row].cellColSpans[cell] = colspan;
		}

		function cleanupRows(rangeToKeep) {
			for (var i in rowsCache) {
				var removeFrozenRow = true;

				if (hasFrozenRows && ((options.frozenBottom && i >= actualFrozenRow) // Frozen bottom rows
					|| (!options.frozenBottom && i <= actualFrozenRow) // Frozen top rows
				)
				) {
					removeFrozenRow = false;
				}

				if (((i = parseInt(i, 10)) !== activeRow)
					&& (i < rangeToKeep.top || i > rangeToKeep.bottom)
					&& (removeFrozenRow)
				) {
					removeRowFromCache(i);
				}
			}
		}

		function invalidate() {
			var reopenEditor = currentEditor && currentEditor.grid && currentEditor.grid.domElem[0].contains(document.activeElement);

			makeActiveCellNormal();
			updateRowCount();
			invalidateAllRows();
			render();

			if (reopenEditor) {
				makeActiveCellEditable();
			}
		}

		function invalidateAllRows() {
			if (currentEditor) {
				makeActiveCellNormal();
			}
			for (var row in rowsCache) {
				removeRowFromCache(row);
			}
		}

		function removeRowFromCache(row) {
			var cacheEntry = rowsCache[row];
			if (!cacheEntry || cacheEntry.rowNode === null) {
				return;
			}

			$(cacheEntry.rowNode[0]).empty();
			cacheEntry.rowNode[0].parentElement.removeChild(cacheEntry.rowNode[0]);

			// Remove the row from the right viewport
			if (cacheEntry.rowNode[1]) {
				$(cacheEntry.rowNode[1]).empty();
				cacheEntry.rowNode[1].parentElement.removeChild(cacheEntry.rowNode[1]);
			}

			delete rowsCache[row];
			delete postProcessedRows[row];
			renderedRows--;
			counter_rows_removed++;
		}

		function invalidateRows(rows) {
			var i, rl;
			if (!rows || !rows.length) {
				return;
			}
			vScrollDir = 0;
			for (i = 0, rl = rows.length; i < rl; i++) {
				if (currentEditor && activeRow === rows[i]) {
					makeActiveCellNormal();
				}
				if (rowsCache[rows[i]]) {
					removeRowFromCache(rows[i]);
				}
			}
		}

		function invalidateRow(row) {
			invalidateRows([row]);
		}

		function isEditMode() {
			return _inEditMode;
		}

		function updateCell(row, cell) {
			var cellNode = getCellNode(row, cell);
			if (!cellNode) {
				return;
			}

			var m = columns[cell],
				d = getDataItem(row);
			if (currentEditor && activeRow === row && activeCell === cell) {
				currentEditor.loadValue(d);
			} else {
				cellNode.innerHTML = d ? getFormatter(row, m)(row, cell, getDataItemValueForColumn(d, m), m, d, null, $(cellNode).attr('id')) : '';
				invalidatePostProcessingResults(row);
			}
		}

		function updateRow(row) {
			var cacheEntry = rowsCache[row];
			if (!cacheEntry) {
				return;
			}

			ensureCellNodesInRowsCache(row);

			var d = getDataItem(row);

			for (var columnIdx in cacheEntry.cellNodesByColumnIdx) {
				if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
					continue;
				}

				columnIdx = columnIdx | 0;
				var m = columns[columnIdx],
					node = cacheEntry.cellNodesByColumnIdx[columnIdx][0];

				if (row === activeRow && columnIdx === activeCell && currentEditor) {
					if (!currentEditor.isValueChanged()) {
						currentEditor.loadValue(d, false);
					}
				} else if (d && m) {
					node.innerHTML = getFormatter(row, m)(row, columnIdx, getDataItemValueForColumn(d, m), m, d, null, $(node).attr('id'), { editable: options.editable});
					// Check field if the readonly status has changed.
					var readOnly = _.find(_.get(d, '__rt$data.readonly', []), { field: m.field });
					if (readOnly) {
						if (readOnly.readonly) {
							node.classList.add('cell-readonly');
						} else {
							node.classList.remove('cell-readonly');
						}
					}
				} else {
					node.innerHTML = '';
				}
			}

			invalidatePostProcessingResults(row);
		}

		function hasScrollbar() {

			var totalColWidth = columns.filter(({pinned}) => !pinned).reduce((n, {width}) => n + width, 0);
			var aw = $canvasTopR.width();
			var bw = $viewportTopR.width();
			var ah = $canvasTopR.height();
			var bh = $viewportTopR.height();
			var res = {
				scrollbarV: (ah >= bh),
				scrollbarH: (totalColWidth >= bw)
			};
			return res;
		}

		function getViewportDimensions() {
			return {
				height: viewportH,
				width: viewportW
			};
		}

		function getViewportHeight() {

			scrollBarH = 0;
			if (hasScrollbar().scrollbarH) {
				$gridContainerScroller.show();
				scrollBarH = measureScrollbar().height;
			} else {
				$gridContainerScroller.hide();
				scrollBarH = 0;
			}

			if (options.autoHeight) {
				topPanelH = (options.showTopPanel) ? options.topPanelHeight + getVBoxDelta($topPanelScroller) : 0;

				headerRowH = (options.showFilterRow) ? options.headerRowHeight + getVBoxDelta($headerRowScroller) + $headerHelpInfo.outerHeight() : 0;

				groupPanelH = ((options.showGroupingPanel) ? options.groupPanelheight + getVBoxDelta($headerDraggableGroupBy) : 0);

				searchPanelH = ((options.showMainTopPanel) ? options.mainTopPanelheight + getVBoxDelta($mainTopPanelScroller) : 0);

				footerH = ((options.showFooter) ? options.footerHeight + getVBoxDelta($footerR) : 0);

				var rowCnt = getDataLengthIncludingAddNew() > 0 ? getDataLengthIncludingAddNew() : 5;
				viewportH = options.rowHeight
							* (rowCnt + 2)
							+ ((options.frozenColumn === -1) ? $headers.outerHeight() : 0)
							- parseFloat($.css($container[0], 'paddingTop', true));
							- parseFloat($.css($container[0], 'paddingBottom', true))
							- parseFloat($.css($headerScroller[0], 'height'))
							- getVBoxDelta($headerScroller)
							- groupPanelH
							- searchPanelH
							- topPanelH
							- ((options.showFilterRow) ? headerRowH + getVBoxDelta($headerHelpInfo) : headerRowH)
							- scrollBarH;

				gridContainerH = options.rowHeight
					* (rowCnt + 2)
					- groupPanelH
					- searchPanelH
					- (options.showFilterRow ? $headerHelpInfo.outerHeight() : 0)
					- (options.showMainTopPanel ? scrollBarH : 0);

			} else {
				topPanelH = (options.showTopPanel)
					? options.topPanelHeight + getVBoxDelta($topPanelScroller)
					: 0;

				headerRowH = (options.showFilterRow)
					? options.headerRowHeight + getVBoxDelta($headerRowScroller) + $headerHelpInfo.outerHeight()
					: 0;

				groupPanelH = ((options.showGroupingPanel) ? options.groupPanelheight + getVBoxDelta($headerDraggableGroupBy) : 0);

				searchPanelH = ((options.showMainTopPanel) ? options.mainTopPanelheight + getVBoxDelta($mainTopPanelScroller) : 0);

				footerH = ((options.showFooter) ? options.footerHeight + getVBoxDelta($footerR) : 0);

				viewportH = parseFloat($.css($container[0], 'height', true))
					- parseFloat($.css($container[0], 'paddingTop', true))
					- parseFloat($.css($container[0], 'paddingBottom', true))
					- parseFloat($.css($headerScroller[0], 'height'))
					- getVBoxDelta($headerScroller)
					- groupPanelH
					- searchPanelH
					- topPanelH
					- ((options.showFilterRow) ? headerRowH + getVBoxDelta($headerHelpInfo) : headerRowH)
					- scrollBarH;

				gridContainerH = parseFloat($.css($container[0], 'height', true))
					- groupPanelH
					- searchPanelH
					- (options.showFilterRow ? $headerHelpInfo.outerHeight() : 0)
					- (options.showMainTopPanel ? scrollBarH : 0);

			}

			numVisibleRows = Math.ceil(viewportH / options.rowHeight);
		}

		function getViewportWidth() {
			viewportW = parseFloat($.css($container[0], 'width', true));
		}

		function resizeGrid() {
			if($container && $container.length > 0) {
				getViewportWidth();
				getViewportHeight();
				updateCanvasWidth();
				resizeCanvas();
				recalcMainScrollbar();
			}
		}

		function skeletonLoading(isDisplayed) {
			if (isDisplayed) {
				if ($viewportSkeletonL[0].style.display !== 'block') {
					$viewportSkeletonL[0].style.display = 'block';
					$viewportSkeletonR[0].style.display = 'block';
					recalcSkeletonLoading();
				}
			} else {
				$viewportSkeletonL[0].style.display = 'none';
				$viewportSkeletonR[0].style.display = 'none';
			}
		}

		function resizeCanvas() {
			if (!initialized) {
				return;
			}

			paneTopH = 0;
			paneBottomH = 0;
			viewportTopH = 0;
			viewportBottomH = 0;

			getViewportWidth();
			getViewportHeight();

			// Account for Frozen Rows
			if (hasFrozenRows) {
				if (options.frozenBottom) {
					paneTopH = viewportH - frozenRowsHeight - scrollbarDimensions.height;

					paneBottomH = frozenRowsHeight + scrollbarDimensions.height;
				} else {
					paneTopH = frozenRowsHeight;
					paneBottomH = viewportH - frozenRowsHeight;
				}
			} else {
				paneTopH = viewportH;
			}

			// The top pane includes the top panel and the header row
			paneTopH += topPanelH + headerRowH;

			if (hasFrozenColumns() && options.autoHeight) {
				paneTopH += scrollbarDimensions.height;
			}

			// The top viewport does not contain the top panel or header row
			viewportTopH = paneTopH - topPanelH - headerRowH - footerH - (options.showMainTopPanel ? scrollbarDimensions.height : 0);

			if (options.autoHeight) {
				if (hasFrozenColumns(true)) {
					$container.height(
						paneTopH
						+ parseFloat($.css($headerScrollerL[0], 'height'))
					);
				}

				$paneTopL.css('position', 'relative');
			}

			if (options.showMainTopPanel) {
				$paneTopL.css({
					'top': $paneHeaderL.height(), 'height': paneTopH - scrollBarH
				});
			} else if (options.showFilterRow){
				$paneTopL.css({
					'top': $paneHeaderL.height(), 'height': paneTopH + 10
				});
			} else {
				$paneTopL.css({
					'top': $paneHeaderL.height(), 'height': paneTopH
				});
			}
			var paneBottomTop = $paneTopL.position().top
				+ paneTopH;

			$viewportTopL.height(viewportTopH);

			if (hasFrozenColumns()) {
				if (options.showMainTopPanel) {
					$paneTopR.css({
						'top': $paneHeaderL.height(), 'height': paneTopH - scrollBarH
					});
				}else if(options.showFilterRow){
					$paneTopR.css({
						'top': $paneHeaderL.height(), 'height': paneTopH + 10
					});
				}
				else {
					$paneTopR.css({
						'top': $paneHeaderL.height(), 'height': paneTopH
					});
				}

				$viewportTopR.height(viewportTopH);

				if (hasFrozenRows) {
					$paneBottomL.css({
						'top': paneBottomTop, 'height': paneBottomH
					});

					$paneBottomR.css({
						'top': paneBottomTop, 'height': paneBottomH
					});

					$viewportBottomR.height(paneBottomH);
				}
			} else {
				if (hasFrozenRows) {
					$paneBottomL.css({
						'width': '100%', 'height': paneBottomH
					});

					$paneBottomL.css('top', paneBottomTop);
				}
			}

			if (hasFrozenRows) {
				$viewportBottomL.height(paneBottomH);

				if (options.frozenBottom) {
					$canvasBottomL.height(frozenRowsHeight);

					if (hasFrozenColumns()) {
						$canvasBottomR.height(frozenRowsHeight);
					}
				} else {
					$canvasTopL.height(frozenRowsHeight);

					if (hasFrozenColumns()) {
						$canvasTopR.height(frozenRowsHeight);
					}
				}
			} else {
				$viewportTopR.height(viewportTopH);
			}

			if (options.forceFitColumns) {
				autosizeColumns();
			}

			$gridContainer.height(gridContainerH);
			$overlayInner.height(gridContainerH);
			$overlayInner.width($gridContainer.width());

			updateRowCount();
			handleScroll();
			recalcMainScrollbar();
			// Since the width has changed, force the render() to reevaluate virtually rendered cells.
			lastRenderedScrollLeft = -1;
			render();
		}

		function updateRowCount() {
			if (!initialized) {
				return;
			}

			var dataLength = getDataLength();

			var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
			var numberOfRows = 0;
			var oldH = (hasFrozenRows && !options.frozenBottom) ? $canvasBottomL.height() : $canvasTopL.height();

			if (hasFrozenRows && options.frozenBottom) {
				var numberOfRows = getDataLength() - options.frozenRow;
			} else {
				var numberOfRows = dataLengthIncludingAddNew + (options.leaveSpaceForNewRows ? numVisibleRows - 1 : 0);
			}

			var tempViewportH = $viewportScrollContainerY.height();
			var oldViewportHasVScroll = viewportHasVScroll;
			// with autoHeight, we do not need to accommodate the vertical scroll bar
			viewportHasVScroll = !options.autoHeight && (numberOfRows * options.rowHeight > tempViewportH);

			// remove the rows that are now outside of the data range
			// this helps avoid redundant calls to .removeRow() when the size of
			// the data decreased by thousands of rows
			var rl = dataLength - 1;
			for (var i in rowsCache) {
				if (i > rl) {
					removeRowFromCache(i);
				}
			}

			if (activeCellNode && activeRow > rl) {
				resetActiveCell();
			}

			th = Math.max(options.rowHeight * numberOfRows, tempViewportH - scrollbarDimensions.height);

			if (th < maxSupportedCssHeight) {
				// just one page
				h = ph = th;
				n = 1;
				cj = 0;
			} else {
				// break into pages
				h = maxSupportedCssHeight;
				ph = h / 100;
				n = Math.floor(th / ph);
				cj = (th - h) / (n - 1);
			}

			if (h !== oldH) {
				if (hasFrozenRows && !options.frozenBottom) {
					$canvasBottomL.css('height', h);

					if (hasFrozenColumns()) {
						$canvasBottomR.css('height', h);
					}
				} else {
					$canvasTopL.css('height', h);
					$canvasTopR.css('height', h);
				}

				scrollTop = $viewportScrollContainerY[0].scrollTop;
			}

			var oldScrollTopInRange = (scrollTop + offset <= th - tempViewportH);

			if (th == 0 || scrollTop == 0) {
				page = offset = 0;
			} else if (oldScrollTopInRange) {
				// maintain virtual position
				scrollTo(scrollTop + offset);
			} else {
				// scroll to bottom
				scrollTo(th - tempViewportH);
			}

			if (h != oldH && options.autoHeight) {
				resizeCanvas();
			}

			if (options.forceFitColumns && oldViewportHasVScroll != viewportHasVScroll) {
				autosizeColumns();
			}
			updateCanvasWidth(false);
		}

		function getVisibleRange(viewportTop, viewportLeft) {
			if (viewportTop == null) {
				viewportTop = scrollTop;
			}
			if (viewportLeft == null) {
				viewportLeft = scrollLeft;
			}

			return {
				top: getRowFromPosition(viewportTop),
				bottom: getRowFromPosition(viewportTop + viewportH) + 1,
				leftPx: viewportLeft,
				rightPx: viewportLeft + viewportW
			};
		}

		function getRenderedRange(viewportTop, viewportLeft) {
			var range = getVisibleRange(viewportTop, viewportLeft);
			var buffer = Math.round(viewportH / options.rowHeight);
			var minBuffer = 3;

			if (vScrollDir === -1) {
				range.top -= buffer;
				range.bottom += minBuffer;
			} else if (vScrollDir === 1) {
				range.top -= minBuffer;
				range.bottom += buffer;
			} else {
				range.top -= minBuffer;
				range.bottom += minBuffer;
			}

			range.top = Math.max(0, range.top);
			range.bottom = Math.min(getDataLengthIncludingAddNew() - 1, range.bottom);

			range.leftPx -= viewportW;
			range.rightPx += viewportW;

			range.leftPx = Math.max(0, range.leftPx);
			range.rightPx = Math.min(canvasWidth, range.rightPx);

			return range;
		}

		function ensureCellNodesInRowsCache(row) {
			var cacheEntry = rowsCache[row];
			if (cacheEntry) {
				if (cacheEntry.cellRenderQueue.length) {
					var $lastNode = cacheEntry.rowNode.children().last();
					while (cacheEntry.cellRenderQueue.length) {
						var columnIdx = cacheEntry.cellRenderQueue.pop();
						if (cacheEntry.rowNode.hasClass('slick-group') && cacheEntry.cellColSpans[columnIdx] > 1) {
							var colSpan = cacheEntry.cellColSpans[columnIdx];
							var $node = $lastNode;
							while (colSpan > 1) {
								$lastNode = $lastNode.prev();
								$node = $node.add($lastNode);
								colSpan -= 1;
							}
							cacheEntry.cellNodesByColumnIdx[columnIdx] = $node;
						} else {
							cacheEntry.cellNodesByColumnIdx[columnIdx] = $lastNode;
							$lastNode = $lastNode.prev();
						}

						// Hack to retrieve the frozen columns because
						if ($lastNode.length == 0) {
							$lastNode = $(cacheEntry.rowNode[0]).children().last();
						}
					}
				}
			}
		}

		function cleanUpCells(range, row) {
			// Ignore frozen rows
			if (hasFrozenRows
				&& ((options.frozenBottom && row > actualFrozenRow) // Frozen bottom rows
					|| (row <= actualFrozenRow)                     // Frozen top rows
				)
			) {
				return;
			}

			var totalCellsRemoved = 0;
			var cacheEntry = rowsCache[row];

			// Remove cells outside the range.
			var cellsToRemove = [];
			for (var i in cacheEntry.cellNodesByColumnIdx) {
				if (columns[i].hidden === true) {
					continue;
				}
				// I really hate it when people mess with Array.prototype.
				if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(i)) {
					continue;
				}

				// This is a string, so it needs to be cast back to a number.
				i = i | 0;

				// Ignore frozen columns
				if (columns[i].pinned) {
					continue;
				}

				var colspan = cacheEntry.cellColSpans[i];
				if (columnPosLeft[i] > range.rightPx || columnPosRight[Math.min(columns.length - 1, i + colspan - 1)] < range.leftPx) {
					if (!(row == activeRow && i == activeCell)) {
						cellsToRemove.push(i);
					}
				}
			}

			var cellToRemove;
			while ((cellToRemove = cellsToRemove.pop()) != null) {
				$(cacheEntry.cellNodesByColumnIdx[cellToRemove][0]).empty();
				cacheEntry.cellNodesByColumnIdx[cellToRemove][0].parentElement.removeChild(cacheEntry.cellNodesByColumnIdx[cellToRemove][0]);
				delete cacheEntry.cellColSpans[cellToRemove];
				delete cacheEntry.cellNodesByColumnIdx[cellToRemove];
				if (postProcessedRows[row]) {
					delete postProcessedRows[row][cellToRemove];
				}
				totalCellsRemoved++;
			}
		}

		function cleanUpAndRenderCells(range) {
			var cacheEntry;
			var stringArray = [];
			var processedRows = [];
			var cellsAdded;
			var totalCellsAdded = 0;
			var colspan;

			for (var row = range.top, btm = range.bottom; row <= btm; row++) {
				cacheEntry = rowsCache[row];
				if (!cacheEntry) {
					continue;
				}

				// cellRenderQueue populated in renderRows() needs to be cleared first
				ensureCellNodesInRowsCache(row);

				cleanUpCells(range, row);

				// Render missing cells.
				cellsAdded = 0;

				var metadata = data.getItemMetadata && data.getItemMetadata(row);
				metadata = metadata && metadata.columns;

				var d = getDataItem(row);

				// TODO:  shorten this loop (index? heuristics? binary search?)
				for (var i = 0, ii = columns.length; i < ii; i++) {
					if (columns[i].hidden === true) {
						continue;
					}
					// Cells to the right are outside the range.
					if (columnPosLeft[i] > range.rightPx) {
						break;
					}

					// Already rendered.
					if ((colspan = cacheEntry.cellColSpans[i]) != null) {
						i += (colspan > 1 ? colspan - 1 : 0);
						continue;
					}

					colspan = 1;
					if (metadata) {
						var columnData = metadata[columns[i].id] || metadata[i];
						colspan = (columnData && columnData.colspan) || 1;
						if (colspan === '*') {
							colspan = ii - i;
						}
					}

					if (columnPosRight[Math.min(ii - 1, i + colspan - 1)] > range.leftPx) {
						appendCellHtml(stringArray, row, i, colspan, d);
						cellsAdded++;
					}

					i += (colspan > 1 ? colspan - 1 : 0);
				}

				if (cellsAdded) {
					totalCellsAdded += cellsAdded;
					processedRows.push(row);
				}
			}

			if (!stringArray.length) {
				return;
			}

			var x = document.createElement('div');
			x.innerHTML = stringArray.join('');

			var processedRow;
			var $node;
			while ((processedRow = processedRows.pop()) != null) {
				cacheEntry = rowsCache[processedRow];
				var columnIdx;
				while ((columnIdx = cacheEntry.cellRenderQueue.pop()) != null) {
					$node = $(x).children().last();

					if (hasFrozenColumns() && (columns[columnIdx].pinned === true)) {
						$(cacheEntry.rowNode[0]).append($node);
					} else {
						$(cacheEntry.rowNode[1]).append($node);
					}

					cacheEntry.cellNodesByColumnIdx[columnIdx] = $node;
				}
			}
		}

		function renderRows(range) {
			var stringArrayL = [],
				stringArrayR = [],
				rows = [],
				needToReselectCell = false,
				dataLength = getDataLength();

			for (var i = range.top, ii = range.bottom; i <= ii; i++) {
				if (rowsCache[i] || (hasFrozenRows && options.frozenBottom && i == getDataLength())) {
					continue;
				}
				renderedRows++;
				rows.push(i);

				// Create an entry right away so that appendRowHtml() can
				// start populatating it.
				rowsCache[i] = {
					'rowNode': null,

					// ColSpans of rendered cells (by column idx).
					// Can also be used for checking whether a cell has been rendered.
					'cellColSpans': [],

					// Cell nodes (by column idx).  Lazy-populated by ensureCellNodesInRowsCache().
					'cellNodesByColumnIdx': [],

					// Column indices of cell nodes that have been rendered, but not yet indexed in
					// cellNodesByColumnIdx.  These are in the same order as cell nodes added at the
					// end of the row.
					'cellRenderQueue': []
				};

				appendRowHtml(stringArrayL, stringArrayR, i, range, dataLength);
				if (activeCellNode && activeRow === i) {
					needToReselectCell = true;
				}
				counter_rows_rendered++;
			}

			if (!rows.length) {
				return;
			}

			var x = document.createElement('div'),
				xRight = document.createElement('div');

			x.innerHTML = stringArrayL.join('');
			xRight.innerHTML = stringArrayR.join('');

			for (var i = 0, ii = rows.length; i < ii; i++) {
				if ((hasFrozenRows) && (rows[i] >= actualFrozenRow)) {
					if (hasFrozenColumns()) {
						rowsCache[rows[i]].rowNode = $()
							.add($(x.firstChild).appendTo($canvasBottomL))
							.add($(xRight.firstChild).appendTo($canvasBottomR));
					} else {
						rowsCache[rows[i]].rowNode = $()
							.add($(x.firstChild).appendTo($canvasBottomL));
					}
				} else if (hasFrozenColumns()) {
					rowsCache[rows[i]].rowNode = $()
						.add($(x.firstChild).appendTo($canvasTopL))
						.add($(xRight.firstChild).appendTo($canvasTopR));
				} else {
					rowsCache[rows[i]].rowNode = $()
						.add($(x.firstChild).appendTo($canvasTopL));
				}
			}

			if (needToReselectCell) {
				activeCellNode = getCellNode(activeRow, activeCell);
			}

			// if(options.enableTextSelectionOnCells){
			//	$('.slick-cell').css('user-select', 'text');
			// }
		}

		function startPostProcessing() {
			if (!options.enableAsyncPostRender) {
				return;
			}
			clearTimeout(h_postrender);
			h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
		}

		function invalidatePostProcessingResults(row) {
			delete postProcessedRows[row];
			postProcessFromRow = Math.min(postProcessFromRow, row);
			postProcessToRow = Math.max(postProcessToRow, row);
			startPostProcessing();
		}

		function updateRowPositions() {
			for (var row in rowsCache) {
				rowsCache[row].rowNode.css('top', getRowTop(row) + 'px');
			}
		}

		function render() {
			if (!initialized) {
				return;
			}
			var visible = getVisibleRange();
			var rendered = getRenderedRange();

			// remove rows no longer in the viewport
			cleanupRows(rendered);

			// add new rows & missing cells in existing rows
			if (lastRenderedScrollLeft != scrollLeft) {
				cleanUpAndRenderCells(rendered);
			}

			// render missing rows
			renderRows(rendered);

			// Render frozen bottom rows
			if (options.frozenBottom) {
				renderRows({
					top: actualFrozenRow,
					bottom: getDataLength() - 1,
					leftPx: rendered.leftPx,
					rightPx: rendered.rightPx
				});
			}

			postProcessFromRow = visible.top;
			postProcessToRow = Math.min(getDataLengthIncludingAddNew() - 1, visible.bottom);
			startPostProcessing();

			lastRenderedScrollTop = scrollTop;
			lastRenderedScrollLeft = scrollLeft;
			h_render = null;

			if (options.showItemCount) {
				updateItemCount();
			}
			if (getDataLength() > 0) {
				trigger(self.onRenderCompleted);
			}
		}

		function handleHeaderRowScroll() {
			var scrollLeft = $headerRowScrollContainer[0].scrollLeft;
			if (scrollLeft != $gridContainerScroller[0].scrollLeft) {
				$gridContainerScroller[0].scrollLeft = scrollLeft;
			}
		}

		function handleMouseWheel(event, delta, deltaX, deltaY) {
			scrollTop = Math.max(0, $viewportScrollContainerY[0].scrollTop - (deltaY * options.rowHeight));
			scrollLeftV = $viewportScrollContainerX[0].scrollLeft + (deltaX * 10);
			scrollLeft = $gridContainerScroller[0].scrollLeft + (deltaX * 10);
			_handleScroll(true);
		}

		function handleScrollEnd(e) {
			trigger(self.onScrollEnd);
		}

		function handleScroll(e) {
			scrollTop = $viewportScrollContainerY[0].scrollTop;
			scrollLeft = $gridContainerScroller[0].scrollLeft;
			scrollLeftV = $viewportScrollContainerY[0].scrollLeft - $gridContainerScroller[0].scrollLeft;
			_handleScroll(false);
		}

		function handleContainerMouseEnter() {
			hasMouseFocus = true;
		}

		function handleContainerMouseLeave() {
			if ($('.modal-dialog').is(':visible')) {
				return;
			}

			if ($('.popup-container').is(':visible')) {
				return;
			}
			hasMouseFocus = false;
		}

		function handleContainerMouseMove(e) {
			trigger(self.onContainerMouseMove, {}, e);
		}

		function recalcMainScrollbar() {
			var maxScrollDistanceX = ($viewportScrollContainerY[0].scrollWidth - $viewportScrollContainerY[0].clientWidth) + 18;
			var child = $gridContainerScroller.children();
			var width = $gridContainerScroller.width();
			child.width(width + maxScrollDistanceX);
		}

		function recalcSkeletonLoading() {
			$viewportSkeletonL[0].innerHTML = '';
			$viewportSkeletonR[0].innerHTML = '';

			$viewportSkeletonR.width($headerR.width());
			$viewportSkeletonL.height($viewportTopL.height());
			$viewportSkeletonR.height($viewportTopL.height());

			let height = 0;

			while (height < $viewportSkeletonL[0].clientHeight) {
				height += options.rowHeight;

				let skeletonRowL = document.createElement('div');
				let skeletonRowR = document.createElement('div');

				columns.forEach(function(col) {
					let skeletonCell = document.createElement('div');
					let skeletonElement = document.createElement('div');

					skeletonCell.style.width = col.width + 'px';
					if (col.id !== 'indicator') {
						skeletonElement.className = 'skeleton';
						skeletonCell.appendChild(skeletonElement);
					}

					if (col.pinned) {
						skeletonRowL.style.height = options.rowHeight + 'px';
						skeletonRowL.className = 'skeleton-row';

						skeletonCell.className = 'skeleton-cell';
						skeletonRowL.appendChild(skeletonCell);
					} else {
						skeletonRowR.style.height = options.rowHeight + 'px';
						skeletonRowR.className = 'skeleton-row';

						skeletonCell.className = 'skeleton-cell';
						skeletonRowR.appendChild(skeletonCell);
					}
				});

				$viewportSkeletonL[0].appendChild(skeletonRowL);
				$viewportSkeletonR[0].appendChild(skeletonRowR);
			}
		}

		function _handleScroll(isMouseWheel) {
			var maxScrollDistanceY = $viewportScrollContainerY[0].scrollHeight - $viewportScrollContainerY[0].clientHeight;
			var maxScrollDistanceX = $viewportScrollContainerX[0].scrollWidth - $viewportScrollContainerX[0].clientWidth;

			// Ceiling the max scroll values
			if (scrollTop > maxScrollDistanceY) {
				scrollTop = maxScrollDistanceY;
			}
			if (scrollLeft > maxScrollDistanceX) {
				scrollLeft = maxScrollDistanceX;
			}

			var vScrollDist = Math.abs(scrollTop - prevScrollTop);
			var hScrollDist = Math.abs(scrollLeft - prevScrollLeft);

			if (hScrollDist) {
				prevScrollLeft = scrollLeft;
				$gridContainer[0].scrollLeft = 0;
				$viewportScrollContainerY[0].scrollLeft = scrollLeft;
				$topPanelScroller[0].scrollLeft = scrollLeft;
				$headerRowScrollContainer[0].scrollLeft = scrollLeft;
				$headerScrollContainer[0].scrollLeft = scrollLeft;

				if (hasFrozenColumns()) {
					if (hasFrozenRows) {
						$viewportTopR[0].scrollLeft = scrollLeft;
					}
				} else {
					if (hasFrozenRows) {
						$viewportTopL[0].scrollLeft = scrollLeft;
					}
				}
			}

			if (vScrollDist) {
				vScrollDir = prevScrollTop < scrollTop ? 1 : -1;
				prevScrollTop = scrollTop;
				if (isMouseWheel) {
					$viewportScrollContainerY[0].scrollTop = scrollTop;
				}

				if (hasFrozenColumns()) {
					if (hasFrozenRows && !options.frozenBottom) {
						$viewportBottomL[0].scrollTop = scrollTop;
					} else {
						$viewportTopL[0].scrollTop = scrollTop;
					}
				}

				// switch virtual pages if needed
				if (vScrollDist < viewportH) {
					scrollTo(scrollTop + offset);
				} else {
					var oldOffset = offset;
					if (h === viewportH) {
						page = 0;
					} else {
						page = Math.min(n - 1, Math.floor(scrollTop * ((th - viewportH) / (h - viewportH)) * (1 / ph)));
					}
					offset = Math.round(page * cj);
					if (oldOffset != offset) {
						invalidateAllRows();
					}
					if(data) {
						data.reSort();
					}
				}
			}

			if (hScrollDist || vScrollDist) {
				if (h_render) {
					clearTimeout(h_render);
				}

				if (Math.abs(lastRenderedScrollTop - scrollTop) > 20 ||
					Math.abs(lastRenderedScrollLeft - scrollLeft) > 20) {
					if (options.forceSyncScrolling || (
						Math.abs(lastRenderedScrollTop - scrollTop) < viewportH &&
						Math.abs(lastRenderedScrollLeft - scrollLeft) < viewportW)) {
						render();
					} else {
						h_render = setTimeout(render, 50);
					}

					trigger(self.onViewportChanged, {});
				}
			}

			trigger(self.onScroll, {
				scrollLeft: scrollLeft,
				scrollTop: scrollTop
			});

			if (scrollLeft !== scrollLeftV) {
				$viewportScrollContainerY[0].scrollLeft = scrollLeft;
			}
		}

		function asyncPostProcessRows() {
			var dataLength = getDataLength();
			while (postProcessFromRow <= postProcessToRow) {
				var row = (vScrollDir >= 0) ? postProcessFromRow++ : postProcessToRow--;
				var cacheEntry = rowsCache[row];
				if (!cacheEntry || row >= dataLength) {
					continue;
				}

				if (!postProcessedRows[row]) {
					postProcessedRows[row] = {};
				}

				ensureCellNodesInRowsCache(row);
				for (var columnIdx in cacheEntry.cellNodesByColumnIdx) {
					if (!cacheEntry.cellNodesByColumnIdx.hasOwnProperty(columnIdx)) {
						continue;
					}

					columnIdx = columnIdx | 0;

					var m = columns[columnIdx];
					if (m.asyncPostRender && !postProcessedRows[row][columnIdx]) {
						var node = cacheEntry.cellNodesByColumnIdx[columnIdx];
						if (node) {
							m.asyncPostRender(node, row, getDataItem(row), m);
						}
						postProcessedRows[row][columnIdx] = true;
					}
				}

				// h_postrender = setTimeout(asyncPostProcessRows, options.asyncPostRenderDelay);
				return;
			}
		}

		function updateCellCssStylesOnRenderedRows(addedHash, removedHash) {
			var node, columnId, addedRowHash, removedRowHash;
			for (var row in rowsCache) {
				removedRowHash = removedHash && removedHash[row];
				addedRowHash = addedHash && addedHash[row];

				if (removedRowHash) {
					for (columnId in removedRowHash) {
						if (!addedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) {
							node = getCellNode(row, getColumnIndex(columnId));
							if (node) {
								$(node).removeClass(removedRowHash[columnId]);
							}
						}
					}
				}
				if (addedRowHash) {
					for (columnId in addedRowHash) {
						// if (!removedRowHash || removedRowHash[columnId] != addedRowHash[columnId]) {
						node = getCellNode(row, getColumnIndex(columnId));
						if (node) {
							$(node).addClass(addedRowHash[columnId]);
						}
						// }
					}
				}
			}
		}

		function addCellCssStyles(key, hash) {
			if (cellCssClasses[key]) {
				throw 'addCellCssStyles: cell CSS hash with key "' + key + '" already exists.';
			}

			cellCssClasses[key] = hash;
			updateCellCssStylesOnRenderedRows(hash, null);

			trigger(self.onCellCssStylesChanged, {
				'key': key,
				'hash': hash
			});
		}

		function removeCellCssStyles(key) {
			if (!cellCssClasses[key]) {
				return;
			}

			updateCellCssStylesOnRenderedRows(null, cellCssClasses[key]);
			delete cellCssClasses[key];

			trigger(self.onCellCssStylesChanged, {
				'key': key,
				'hash': null
			});
		}

		function setCellCssStyles(key, hash) {
			var prevHash = cellCssClasses[key];

			cellCssClasses[key] = hash;
			updateCellCssStylesOnRenderedRows(hash, prevHash);

			trigger(self.onCellCssStylesChanged, {
				'key': key,
				'hash': hash
			});
		}

		function getCellCssStyles(key) {
			return cellCssClasses[key];
		}

		function flashCell(row, cell, speed) {
			speed = speed || 100;
			if (rowsCache[row]) {
				var $cell = $(getCellNode(row, cell));

				function toggleCellClass(times) {
					if (!times) {
						return;
					}
					setTimeout(function () {
						$cell.queue(function () {
							$cell.toggleClass(options.cellFlashingCssClass).dequeue();
							toggleCellClass(times - 1);
						});
					}, speed);
				}

				toggleCellClass(4);
			}
		}

		// ////////////////////////////////////////////////////////////////////////////////////////////
		// Interactivity

		function handleDragInit(e, dd) {
			var cell = getCellFromEvent(e);
			if (!cell || !cellExists(cell.row, cell.cell)) {
				return false;
			}

			var retval = trigger(self.onDragInit, dd, e);
			if (e.isImmediatePropagationStopped()) {
				return retval;
			}

			// if nobody claims to be handling drag'n'drop by stopping immediate
			// propagation, cancel out of it
			return false;
		}

		function handleDragStart(e, dd) {
			var cell = getCellFromEvent(e);
			if (!cell || !cellExists(cell.row, cell.cell)) {
				return false;
			}

			var retval = trigger(self.onDragStart, dd, e);
			if (e.isImmediatePropagationStopped()) {
				return retval;
			}
			return false;
		}

		function handleDrag(e, dd) {
			return trigger(self.onDrag, dd, e);
		}

		function handleDragEnd(e, dd) {
			trigger(self.onDragEnd, dd, e);
		}

		function handleKeyDown(e) {
			trigger(self.onKeyDown, { row: activeRow, cell: activeCell }, e);
			var handled = e.isImmediatePropagationStopped();
			_lastRow = activeRow === getDataLength() - 1;
			_lastCell = activeCell === columns.length - 1;
			if (!handled) {
				if (!e.shiftKey && !e.altKey && !e.ctrlKey) {
					if (e.which === 9) {
						if (_inEditMode) {
							handled = navigateNextEditable(false, true);
							if (options.editable && !handled) {
								getEditorLock().commitCurrentEdit();
							}
						} else {
							handled = navigateNextEditable(false, true);
						}
					} else if (e.which === 13) {
						if (!isGroupRow) {
							if (_inEditMode) {
								if (options.editable) {
									var next = findNextEditable();
									if (_lastRow && (_lastCell || next.addNew)) {
										getEditorLock().commitCurrentEdit();
										trigger(self.onAddNewRow, null);
									} else if (getEditorLock().commitCurrentEdit()) {
										handled = navigateNextEditable();
										if (handled) {
											_lastEditMode = false;
											makeActiveCellEditable();
										} else {
											handled = false;
											if (_lastRow) {
												_inEditMode = false;
											}
										}
									}
								}
							} else {
								if (!isCellReadonly(columns[activeCell]) && (columns[activeCell].editor && (!columns[activeCell].keyboard || columns[activeCell].keyboard && columns[activeCell].keyboard.enter))) {
									makeActiveCellEditable();
								} else {
									navigateNextEditable();
									if (getEditorLock().commitCurrentEdit()) {
										makeActiveCellEditable();
									}
								}
							}
						}
						handled = true;
					} else if (e.which === 114) {
						if (!_inEditMode && columns[activeCell].domain === 'lookup' && !isCellReadonly(columns[activeCell]) && (columns[activeCell].editor && (!columns[activeCell].keyboard || columns[activeCell].keyboard && columns[activeCell].keyboard.enter))) {
							e.preventDefault();
							e.stopPropagation();
							makeActiveCellEditable(null, { showDropdown: true });
						}
					} else if (e.which === 27) {
						if (!getEditorLock().isActive()) {
							return; // no editing mode to cancel, allow bubbling and default processing (exit without cancelling the event)
						}
						if (_inEditMode) {
							_inEditMode = !_inEditMode;
						}
						cancelEditAndSetFocus();
					} else if (e.which === 33) {
						navigatePageUp();
						handled = true;
					} else if (e.which === 34) {
						navigatePageDown();
						handled = true;
					} else if (e.which === 35) {
						gotoCell(activeRow, columns.length - 1, false);
					} else if (e.which === 36) {
						var cell = 0;
						if (columns[0].id === 'indicator' || columns[0].id === 'tree') {
							cell++;
						}
						if (columns[1].id === 'tree') {
							cell++;
						}
						gotoCell(activeRow, cell, false);
					} else if (e.which === 37) {
						if (_inEditMode) {
							navDir = 1;
						} else {
							handled = navigateLeft();
						}
					} else if (e.which === 38) {
						if (_inEditMode || _lastEditMode) {
							handled = navigate('up');
							if (options.editable && !isGroupRow) {
								editableJump();
							} else {
								handled = navigateNext();
							}
						} else {
							handled = navigateUp();
						}
						if (!handled && activeRow === 0) {
							getEditorLock().commitCurrentEdit();
							if (options.showFilterRow) {
								if (activeCell < getColumns().length) {
									let column = getColumns()[activeCell];
									let columnFilter = $headerRow.find('.slick-cell.item-field_' + column.id);
									if (columnFilter) {
										let children = columnFilter.find('.input-group-content,.domain-type-text');
										if (children) {
											if (children[0].style.display === 'block') {
												children[0].style.display = 'none';
												children[0].style.display = 'block';
											}
											children.trigger('focus');
										}
									}
								}
							}
							else if (options.showMainTopPanel) {
								$mainTopPanelScroller.find('.filterinput').trigger('focus');
							}
						}
					} else if (e.which === 39) {
						if (_inEditMode) {
							navDir = 2;
						} else {
							handled = navigateRight();
						}
					} else if (e.which === 40) {
						if (_inEditMode || _lastEditMode) {
							handled = navigate('down');
							if (options.editable && !isGroupRow) {
								_lastEditMode = true;
								editableJump();
							} else {
								handled = navigateNext();
							}
						} else {
							handled = navigateDown();
						}
					} else if (e.which === 113) {
						if (options.editable && !isGroupRow) {
							editableJump();
						}
						handled = true;
					}
				} else if (e.which === 9 && e.shiftKey && !e.ctrlKey && !e.altKey) {
					if (activeCell === (options.tree === true ? 2 : 1) && activeRow === 0) {
						handled = true;
					} else {
						if (_inEditMode) {
							handled = navigateNextEditable(true);
							if (handled) {
								if (options.editable) {
								} else {
									handled = navigateNextEditable(true);
								}
							}
						} else {
							handled = navigateNextEditable(true);
						}
					}
				} else if (e.which === 35 && !e.shiftKey && e.ctrlKey && !e.altKey) {
					gotoCell(getDataLength() - 1, columns.length - 1, false);
				} else if (e.which === 36 && !e.shiftKey && e.ctrlKey && !e.altKey) {
					var cell = 0;
					if (columns[0].id === 'indicator' || columns[0].id === 'tree') {
						cell++;
					}
					if (columns[1].id === 'tree') {
						cell++;
					}
					gotoCell(0, cell, false);
				}
			}
			if (handled) {
				// the event has been handled so don't let parent element (bubbling/propagation) or browser (default) handle it
				e.stopPropagation();
				e.preventDefault();
				try {
					e.originalEvent.keyCode = 0; // prevent default behaviour for special keys in IE browsers (F3, F5, etc.)
				}
				// ignore exceptions - setting the original event's keycode throws access denied exception for "Ctrl"
				// (hitting control key only, nothing else), "Shift" (maybe others)
				catch (error) {
				}
			}
		}

		function handleClick(e) {
			// reset isGroupRow variable
			isGroupRow = false;
			var $cell = $(e.target).closest('.slick-cell', $canvas);

			if (!$cell.length) {
				return null;
			}

			// TODO: This change eliminates the need for getCellFromEvent since
			//  we're ultimately calling getCellFromPoint.  Need to further analyze
			//  if getCellFromEvent can work with frozen columns

			var c = $cell.parents('.grid-canvas').offset();

			var rowOffset = 0;
			var isBottom = $cell.parents('.grid-canvas-bottom').length;

			if (hasFrozenRows && isBottom) {
				rowOffset = (options.frozenBottom) ? $canvasTopL.height() : frozenRowsHeight;
			}

			var row = getCellFromPoint(e.clientX - c.left, e.clientY - c.top + rowOffset + $(document).scrollTop()).row;
			var d = getDataItem(row);

			if (!currentEditor) {
				// if this click resulted in some cell child node getting focus,
				// don't steal it back - keyboard events will still bubble up
				// IE9+ seems to default DIVs to tabIndex=0 instead of -1, so check for cell clicks directly.
				if (e.target !== document.activeElement || $(e.target).hasClass('slick-cell')) {
					setFocus();
				}
			}

			if (!d && row < 0) {
				return;
			}

			var cell = getCellFromEvent(e);

			if (!cell || (currentEditor !== null && activeRow === cell.row && activeCell === cell.cell)) {
				return;
			}

			trigger(self.onClick, {
				row: cell.row,
				cell: cell.cell
			}, e);

			if (e.isImmediatePropagationStopped() || !$canvas) { // check as well if the $canvas object still exists before proceeding - fixes issue with lookup grids
				return;
			}

			if (!d.__group && columns[cell.cell].editor && options.editable && options.editOnClick) {
				if (!_inEditMode) {
					_inEditMode = !_inEditMode;
				}
				gotoCell(cell.row, cell.cell, true);
			} else {
				gotoCell(cell.row, cell.cell, false);
			}

			if ((activeCell !== cell.cell || activeRow !== cell.row) && canCellBeActive(cell.row, cell.cell)) {
				if (!getEditorLock().isActive() || getEditorLock().commitCurrentEdit()) {
					if (hasFrozenRows) {
						if ((!(options.frozenBottom) && (cell.row >= actualFrozenRow))
							|| (options.frozenBottom && (cell.row < actualFrozenRow))
						) {
							scrollRowIntoView(cell.row, false);
						}

						setActiveCellInternal(getCellNode(cell.row, cell.cell));
					}
				}
			}
		}

		function updateSelection() {
			var row = getSelectedRows()[0];
			scrollRowIntoView(row, false);
			var cell = getActiveCell();
			if (!cell) {
				return;
			}
			setActiveCellInternal(getCellNode(row, cell.cell));
		}

		function handleContextMenu(e) {
			var $cell = $(e.target).closest('.slick-cell', $canvas);
			if ($cell.length === 0) {
				return;
			}

			// are we editing this cell?
			if (activeCellNode === $cell[0] && currentEditor !== null) {
				return;
			}

			trigger(self.onContextMenu, {}, e);
		}

		function handleDblClick(e) {
			var cell = getCellFromEvent(e);
			if (!cell || (currentEditor !== null && activeRow == cell.row && activeCell == cell.cell)) {
				return;
			}

			trigger(self.onDblClick, {
				row: cell.row,
				cell: cell.cell
			}, e);
			if (e.isImmediatePropagationStopped()) {
				return;
			}

			if (options.editable) {
				gotoCell(cell.row, cell.cell, true);
			}
		}

		function handleHeaderMouseEnter(e) {
			let column = $(this).data('column');
			if(column) {
				// disable column reordering for indicator and structure columns
				if((options.enableColumnReorder && $.fn.sortable) && (systemColumns.includes(column.id) || column.isIndicator)) {
					$headers.sortable('disable');
				}
			}
			trigger(self.onHeaderMouseEnter, {
				'column': column
			}, e);
		}

		function handleHeaderMouseLeave(e) {
			if(options.enableColumnReorder && $.fn.sortable) {
				$headers.sortable('enable');
			}
			trigger(self.onHeaderMouseLeave, {
				'column': $(this).data('column')
			}, e);
		}

		function handleHeaderContextMenu(e) {
			var $header = $(e.target).closest('.slick-header-column', '.slick-header-columns');
			var column = $header && $header.data('column');
			trigger(self.onHeaderContextMenu, {
				column: column
			}, e);
		}

		function handleHeaderClick(e) {
			var $header = $(e.target).closest('.slick-header-column', '.slick-header-columns');
			var column = $header && $header.data('column');
			if (column) {
				trigger(self.onHeaderClick, {
					column: column
				}, e);
			}
		}

		function handleMouseEnter(e) {
			trigger(self.onMouseEnter, {}, e);
		}

		function handleMouseLeave(e) {
			trigger(self.onMouseLeave, {}, e);
		}

		function cellExists(row, cell) {
			return !(row < 0 || row >= getDataLength() || cell < 0 || cell >= columns.length);
		}

		function getCellFromPoint(x, y) {
			var row = getRowFromPosition(y);
			var cell = 0;

			var w = 0;
			for (var i = 0; i < columns.length && w < x; i++) {
				if (columns[i].hidden === true) {
					continue;
				}
				w += columns[i].width;
				cell++;
			}

			if (cell < 0) {
				cell = 0;
			}

			return {
				row: row,
				cell: cell - 1
			};
		}

		function getCellFromNode(cellNode) {
			// read column number from .l<columnNumber> CSS class
			var cls = /l\d+/.exec(cellNode.className);
			if (cls) {
				return parseInt(cls[0].substr(1, cls[0].length - 1), 10);
			}
		}

		function getRowFromNode(rowNode) {
			for (var row in rowsCache) {
				for (var i in rowsCache[row].rowNode) {
					if (rowsCache[row].rowNode[i] === rowNode)
						return (row ? parseInt(row) : 0);
				}
			}
			return null;
		}

		function getFrozenRowOffset(row) {
			var offset =
				(hasFrozenRows)
					? (options.frozenBottom)
						? (row >= actualFrozenRow)
							? (h < viewportTopH)
								? (actualFrozenRow * options.rowHeight)
								: h
							: 0
						: (row >= actualFrozenRow)
							? frozenRowsHeight
							: 0
					: 0;

			return offset;
		}

		function getCellFromEvent(e) {
			var row, cell;
			var $cell = $(e.target).closest('.slick-cell', $canvas);
			if (!$cell.length) {
				return null;
			}

			row = getRowFromNode($cell[0].parentNode);

			if (hasFrozenRows) {

				var c = $cell.parents('.grid-canvas').offset();

				var rowOffset = 0;
				var isBottom = $cell.parents('.grid-canvas-bottom').length;

				if (isBottom) {
					rowOffset = ( options.frozenBottom ) ? $canvasTopL.height() : frozenRowsHeight;
				}

				row = getCellFromPoint(e.clientX - c.left, e.clientY - c.top + rowOffset + $(document).scrollTop()).row;
			}

			cell = getCellFromNode($cell[0]);

			if (row == null || cell == null) {
				return null;
			} else {
				return {
					'row': row,
					'cell': cell
				};
			}
		}

		function getCellNodeBoxForCopy(row, cell) {
			if (!cellExists(row, cell)) {
				return null;
			}

			var frozenRowOffset = getFrozenRowOffset(row);

			var y1 = getRowTop(row) - frozenRowOffset;

			// Take into considering the column header row
			y1 = y1 + 27;
			var y2;

			if (getOptions().showFilterRow) {
				y1 = y1 + 33;
				y2 = y2 + 33;
			}

			y2 = y1 + options.rowHeight - 1;
			if (columns[0].id === 'indicator') {
				var x1 = columns[0].width;
			}

			for (var i = 1; i < cell; i++) {
				x1 += columns[i].width;
			}
			var x2 = x1 + columns[cell].width;

			return {
				top: y1 - scrollTop,
				left: x1 - scrollLeft,
				bottom: y2 - scrollTop,
				right: x2 - scrollLeft
			};
		}

		function getCellNodeBox(row, cell) {
			if (!cellExists(row, cell)) {
				return null;
			}

			var frozenRowOffset = getFrozenRowOffset(row);

			var y1 = getRowTop(row) - frozenRowOffset;
			var y2 = y1 + options.rowHeight - 1;
			var x1 = 0;
			for (var i = 0; i < cell; i++) {
				x1 += columns[i].width;

				if (options.frozenColumn === i) {
					x1 = 0;
				}
			}
			var x2 = x1 + columns[cell].width;

			return {
				top: y1,
				left: x1,
				bottom: y2,
				right: x2
			};
		}

		// ////////////////////////////////////////////////////////////////////////////////////////////
		// Cell switching

		function resetActiveCell() {
			setActiveCellInternal(null, false);
		}

		function setFocus() {
			if (tabbingDirection == -1) {
				$focusSink[0].focus();
			} else {
				$focusSink2[0].focus();
			}
		}

		function setCellFocus(row, cell, forceEdit) {
			var isEditable = forceEdit ? forceEdit : isCellPotentiallyEditable(row, cell);
			gotoCell(row, cell, isEditable);
			setFocus();
		}

		function scrollCellIntoView(row, cell, doPaging) {

			scrollRowIntoView(row, doPaging);

			// if (cell <= options.frozenColumn) {
			//	return;
			// }

			var colspan = getColspan(row, cell);
			var borderW = $('.slick-cell.active:not(.indicator)').css('border-left-width');
			var left = columnPosLeft[cell],// + 100,
				right = columnPosRight[cell + (colspan > 1 ? colspan - 1 : 0)] + (borderW ? parseInt(borderW) : 0),
				scrollRight = scrollLeft + $viewportScrollContainerX.width();

			if (left < scrollLeft) {
				$viewportScrollContainerX.scrollLeft(left);
				$gridContainerScroller.scrollLeft(left);
				handleScroll();
				render();
			} else if (right > scrollRight) {
				$gridContainerScroller.scrollLeft(Math.min(left, right - $viewportScrollContainerX[0].clientWidth));
				if (!columns[cell].pinned) {
					$viewportScrollContainerX.scrollLeft(Math.min(left, right - $viewportScrollContainerX[0].clientWidth));
				}
				handleScroll();
				render();
			}
		}

		function setActiveCellInternal(newCell, opt_editMode, wasAsync) {
			if (activeCellNode) {
				makeActiveCellNormal();
				$(activeCellNode).removeClass('active');
				if (rowsCache[activeRow]) {
					$(rowsCache[activeRow].rowNode).removeClass('active');
					$(rowsCache[activeRow].rowNode[0].childNodes[0]).removeClass('active');
				}
			}

			if(activeColumnHeader) {
				$(activeColumnHeader).removeClass('active');
			}

			var activeCellChanged = (activeCellNode !== newCell);
			activeCellNode = newCell;

			if (activeCellNode) {
				var $activeCellNode = $(activeCellNode);
				var $activeCellOffset = $activeCellNode.offset();

				var rowOffset = Math.floor($activeCellNode.parents('.grid-canvas').offset().top);
				var isBottom = $activeCellNode.parents('.grid-canvas-bottom').length;

				if (hasFrozenRows && isBottom) {
					rowOffset -= (options.frozenBottom)
						? $canvasTopL.height()
						: frozenRowsHeight;
				}

				var cell = getCellFromPoint($activeCellOffset.left, Math.ceil($activeCellOffset.top) - rowOffset);

				activeRow = cell.row;
				activeCell = activePosX = getCellFromNode(activeCellNode[0]);

				let columnId = columns[activeCell].id;
				activeColumnHeader = $('#' + uid + columnId);
				if(activeColumnHeader) {
					$(activeColumnHeader).addClass('active');
				}

				$activeCellNode.addClass('active');
				if (rowsCache[activeRow]) {
					$(rowsCache[activeRow].rowNode).addClass('active');
					$(rowsCache[activeRow].rowNode[0].childNodes[0]).addClass('active');

					if(rowsCache[activeRow].rowNode.hasClass('slick-group')){
						isGroupRow = true;
						$activeCellNode.removeClass('active');
					}
				}

				if (opt_editMode == null) {
					opt_editMode = (activeRow == getDataLength()) || options.autoEdit;
				}

				if (options.editable && opt_editMode && isCellPotentiallyEditable(activeRow, activeCell) && !wasAsync) {
					clearTimeout(h_editorLoader);

					if (options.asyncEditorLoading) {
						h_editorLoader = setTimeout(function () {
							makeActiveCellEditable();
						}, options.asyncEditorLoadDelay);
					} else {
						makeActiveCellEditable();
					}
				}
			} else {
				activeRow = activeCell = null;
			}

			if (activeCellChanged) {
				trigger(self.onActiveCellChanged, getActiveCell());
			}
		}

		function clearTextSelection() {
			if (document.selection && document.selection.empty) {
				try {
					// IE fails here if selected element is not in dom
					document.selection.empty();
				} catch (e) {
				}
			} else if (window.getSelection) {
				var sel = window.getSelection();
				if (sel && sel.removeAllRanges) {
					sel.removeAllRanges();
				}
			}
		}

		function isCellPotentiallyEditable(row, cell) {
			var dataLength = getDataLength();

			// is the data for this row loaded?
			if (row < dataLength && !getDataItem(row)) {
				return false;
			}

			if (isCellReadonly(columns[cell])) {
				return false;
			}

			// are we in the Add New row? can we create new from this cell?
			if (columns[cell].cannotTriggerInsert && row >= dataLength) {
				return false;
			}

			// does this cell have an editor?
			if (!getEditor(row, cell)) {
				return false;
			}

			return true;
		}

		function validatingFormatter(dataContext, columnDef, formatterMarkup) {
			var tmp;
			if ($(activeCellNode).hasClass('pending-validation')) {
				tmp = '<div class="spinner-sm"></div>' + '<div class="value-placeholder">' + formatterMarkup + '</div>';
			} else {
				tmp = formatterMarkup;
			}
			return tmp;
		}

		function makeActiveCellNormal(isAsync) {
			_inEditMode = false;
			if (!currentEditor) {
				return false;
			}
			trigger(self.onBeforeCellEditorDestroy, {
				editor: currentEditor
			});
			currentEditor.destroy();
			currentEditor = null;

			if (activeCellNode) {
				const d = getDataItem(activeRow);

				$(activeCellNode).removeClass('editable invalid');

				if (d) {
					const column = columns[activeCell];
					const formatter = getFormatter(activeRow, column);

					if (isAsync) {
						const row = activeRow;
						const cell = activeCell;

						activeCellNode[0].innerHTML = validatingFormatter(d, column, formatter(row, cell, getDataItemValueForColumn(d, column), column, d));
						isAsync.then(function (result) {
							const node = getCellNode(row, cell);

							if (node) {
								node.innerHTML = validatingFormatter(d, column, formatter(row, cell, getDataItemValueForColumn(d, column), column, d));
								updateRow(row);
								invalidatePostProcessingResults(row);
								trigger(self.onCellChange, {
									row: row,
									cell: cell,
									item: d
								});
								if(_lastEditMode) {
									makeActiveCellEditable();
								}
							}
						});
					} else {
						activeCellNode[0].innerHTML = formatter(activeRow, activeCell, getDataItemValueForColumn(d, column), column, d, null, $(activeCellNode).attr('id'));
						updateRow(activeRow);
					}
				}

				invalidatePostProcessingResults(activeRow);
			}

			// if there previously was text selected on a page (such as selected
			// text in the edit cell just removed),
			// IE can't set focus to anything else correctly
			if (navigator.userAgent.toLowerCase().match(/msie/)) {
				clearTextSelection();
			}

			getEditorLock().deactivate(editController);

			if (inputNav) {
				navDir = 0;
				inputNav = false;
				switch (navDir) {
					case 1:
						navigateLeft();
						break;
					case 2:
						navigateRight();
						break;
					default:
						break;
				}
			}

			return true;
		}

		function makeActiveCellEditable(editor, args) {
			if (!activeCellNode) {
				return;
			}

			if (!options.editable) {
				throw 'Grid : makeActiveCellEditable : should never get called when options.editable is false';
			}

			// cancel pending async call if there is one
			clearTimeout(h_editorLoader);

			if (!isCellPotentiallyEditable(activeRow, activeCell)) {
				return;
			}

			var columnDef = columns[activeCell];
			var item = getDataItem(activeRow);

			if (trigger(self.onBeforeEditCell, {
				row: activeRow,
				cell: activeCell,
				item: item,
				column: columnDef
			}) === false) {
				setFocus();
				return;
			}

			getEditorLock().activate(editController);
			getEditorLock().usedBy = self;

			if((columnDef.hasOwnProperty('bulkSupport') && !columnDef.bulkSupport) || (self.getOptions().hasOwnProperty('allowBatchCopy') && !self.getOptions().allowBatchCopy)) {
				$(activeCellNode).addClass('batch-none-allowed');
			}

			$(activeCellNode).addClass('editable');

			var useEditor = editor || getEditor(activeRow, activeCell);

			// don't clear the cell if a custom editor is passed through
			if (!editor) {
				activeCellNode[0].innerHTML = '';
			}

			currentEditor = new useEditor({
				grid: self,
				gridPosition: absBox($container[0]),
				position: absBox(activeCellNode[0]),
				container: activeCellNode,
				column: columnDef,
				item: item || {},
				showDropdown: args ? args.showDropdown : false,
				commitChanges: commitEditAndSetFocus,
				cancelChanges: cancelEditAndSetFocus
			});

			if (item) {
				currentEditor.loadValue(item);
			}

			if (!currentEditor) {
				console.warn('currentEditor was destroyed in currentEditor.loadValue() ...');
			} else {
				serializedEditorValue = currentEditor.serializeValue();

				if (currentEditor.position) {
					handleActiveCellPositionChange();
				}

				inputNav = true;
				_inEditMode = true;
				_lastEditMode = true;
			}
		}

		function commitEditAndSetFocus() {
			// if the commit fails, it would do so due to a validation error
			// if so, do not steal the focus from the editor
			_lastEditMode = false;
			if (getEditorLock().commitCurrentEdit()) {
				setFocus();
				if (options.autoEdit) {
					navigateDown();
				}
			}
		}

		function cancelEditAndSetFocus() {
			_lastEditMode = false;
			if (getEditorLock().cancelCurrentEdit()) {
				setFocus();
			}
		}

		function absBox(elem) {
			var box = {
				top: elem.offsetTop,
				left: elem.offsetLeft,
				bottom: 0,
				right: 0,
				width: $(elem).outerWidth(),
				height: $(elem).outerHeight(),
				visible: true
			};
			box.bottom = box.top + box.height;
			box.right = box.left + box.width;

			// walk up the tree
			var offsetParent = elem.offsetParent;
			while ((elem = elem.parentNode) && elem !== document.body) {
				if (box.visible && elem.scrollHeight != elem.offsetHeight && $(elem).css('overflowY') != 'visible') {
					box.visible = box.bottom > elem.scrollTop && box.top < elem.scrollTop + elem.clientHeight;
				}

				if (box.visible && elem.scrollWidth != elem.offsetWidth && $(elem).css('overflowX') != 'visible') {
					box.visible = box.right > elem.scrollLeft && box.left < elem.scrollLeft + elem.clientWidth;
				}

				box.left -= elem.scrollLeft;
				box.top -= elem.scrollTop;

				if (elem === offsetParent) {
					box.left += elem.offsetLeft;
					box.top += elem.offsetTop;
					offsetParent = elem.offsetParent;
				}

				box.bottom = box.top + box.height;
				box.right = box.left + box.width;
			}

			return box;
		}

		function getActiveCellPosition() {
			return absBox(activeCellNode[0]);
		}

		function getGridPosition() {
			return absBox($container[0]);
		}

		function handleActiveCellPositionChange() {
			if (!activeCellNode) {
				return;
			}

			trigger(self.onActiveCellPositionChanged, {});

			if (currentEditor) {
				var cellBox = getActiveCellPosition();
				if (currentEditor.show && currentEditor.hide) {
					if (!cellBox.visible) {
						currentEditor.hide();
					} else {
						currentEditor.show();
					}
				}

				if (currentEditor.position) {
					currentEditor.position(cellBox);
				}
			}
		}

		function getCellEditor() {
			return currentEditor;
		}

		function getActiveCell() {
			if (!activeCellNode) {
				return null;
			} else {
				return {
					row: activeRow,
					cell: activeCell
				};
			}
		}

		function getActiveCellNode() {
			return activeCellNode;
		}

		function scrollActiveCellIntoView() {
			if (activeRow !== null && activeCell !== null) {
				scrollCellIntoView(activeRow, activeCell);
			}
		}

		function scrollRowIntoView(row, doPaging) {
			if (hasFrozenRows && !options.frozenBottom) {
				row -= actualFrozenRow;
			}

			var viewportScrollH = $viewportScrollContainerY.height();

			var rowAtTop = row * options.rowHeight;
			var rowAtBottom = (row + 1) * options.rowHeight
				- viewportScrollH
				+ (viewportHasHScroll ? scrollbarDimensions.height : 0);

			// need to page down?
			if ((row + 1) * options.rowHeight > scrollTop + viewportScrollH + offset) {
				scrollTo(doPaging ? rowAtTop : rowAtBottom);
				render();
			}
			// or page up?
			else if (row * options.rowHeight < scrollTop + offset) {
				scrollTo(doPaging ? rowAtBottom : rowAtTop);
				render();
			}
		}

		function scrollRowToTop(row) {
			scrollTo(row * options.rowHeight);
			render();
		}

		function scrollPage(dir) {
			var deltaRows = dir * numVisibleRows;
			scrollTo((getRowFromPosition(scrollTop) + deltaRows) * options.rowHeight);
			render();

			if (options.enableCellNavigation && activeRow != null) {
				var row = activeRow + deltaRows;
				var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
				if (row >= dataLengthIncludingAddNew) {
					row = dataLengthIncludingAddNew - 1;
				}
				if (row < 0) {
					row = 0;
				}

				var cell = 0, prevCell = null;
				var prevActivePosX = activePosX;
				while (cell <= activePosX) {
					if (canCellBeActive(row, cell)) {
						prevCell = cell;
					}
					cell += getColspan(row, cell);
				}

				if (prevCell !== null) {
					setActiveCellInternal(getCellNode(row, prevCell));
					activePosX = prevActivePosX;
				} else {
					resetActiveCell();
				}
			}
		}

		function navigatePageDown() {
			scrollPage(1);
		}

		function navigatePageUp() {
			scrollPage(-1);
		}

		function getColspan(row, cell) {
			var metadata = data.getItemMetadata && data.getItemMetadata(row);
			if (!metadata || !metadata.columns) {
				return 1;
			}

			var columnData = metadata.columns[columns[cell].id] || metadata.columns[cell];
			var colspan = (columnData && columnData.colspan);
			if (colspan === '*') {
				colspan = columns.length - cell;
			} else {
				colspan = colspan || 1;
			}
			return (colspan || 1);
		}

		function findFirstFocusableCell(row) {
			var cell = 0;
			while (cell < columns.length) {
				if (canCellBeActive(row, cell)) {
					return cell;
				}
				cell += getColspan(row, cell);
			}
			return null;
		}

		function findLastFocusableCell(row) {
			var cell = 0;
			var lastFocusableCell = null;
			while (cell < columns.length) {
				if (canCellBeActive(row, cell)) {
					lastFocusableCell = cell;
				}
				cell += getColspan(row, cell);
			}
			return lastFocusableCell;
		}

		function gotoRight(row, cell, posX) {
			if (cell >= columns.length) {
				return null;
			}

			do {
				cell += getColspan(row, cell);
			} while (cell < columns.length && !canCellBeActive(row, cell));

			if (cell < columns.length) {
				return {
					'row': row,
					'cell': cell,
					'posX': cell
				};
			}
			return null;
		}

		function gotoLeft(row, cell, posX) {
			if (cell <= 0) {
				return null;
			}

			var firstFocusableCell = findFirstFocusableCell(row);
			if (firstFocusableCell === null || firstFocusableCell >= cell) {
				return null;
			}

			var prev = {
				'row': row,
				'cell': firstFocusableCell,
				'posX': firstFocusableCell
			};
			var pos;
			while (true) {
				pos = gotoRight(prev.row, prev.cell, prev.posX);
				if (!pos) {
					return null;
				}
				if (pos.cell >= cell) {
					return prev;
				}
				prev = pos;
			}
		}

		function gotoDown(row, cell, posX) {
			var prevCell;
			var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
			while (true) {
				if (++row >= dataLengthIncludingAddNew) {
					return null;
				}

				prevCell = cell = 0;
				while (cell <= posX) {
					prevCell = cell;
					cell += getColspan(row, cell);
				}

				if (canCellBeActive(row, prevCell)) {
					return {
						'row': row,
						'cell': prevCell,
						'posX': posX
					};
				}
			}
		}

		function gotoUp(row, cell, posX) {
			var prevCell;
			while (true) {
				if (--row < 0) {
					return null;
				}

				prevCell = cell = 0;
				while (cell <= posX) {
					prevCell = cell;
					cell += getColspan(row, cell);
				}

				if (canCellBeActive(row, prevCell)) {
					return {
						'row': row,
						'cell': prevCell,
						'posX': posX
					};
				}
			}
		}

		function gotoNext(row, cell, posX) {
			if (row == null && cell == null) {
				row = cell = posX = 0;
				if (canCellBeActive(row, cell)) {
					return {
						'row': row,
						'cell': cell,
						'posX': cell
					};
				}
			}

			var pos = gotoRight(row, cell, posX);
			if (pos) {
				return pos;
			}

			var firstFocusableCell = null;
			var dataLengthIncludingAddNew = getDataLengthIncludingAddNew();
			while (++row < dataLengthIncludingAddNew) {
				firstFocusableCell = findFirstFocusableCell(row);
				if (firstFocusableCell !== null) {
					return {
						'row': row,
						'cell': firstFocusableCell,
						'posX': firstFocusableCell
					};
				}
			}
			return null;
		}

		function gotoPrev(row, cell, posX) {
			if (row == null && cell == null) {
				row = getDataLengthIncludingAddNew() - 1;
				cell = posX = columns.length - 1;
				if (canCellBeActive(row, cell)) {
					return {
						'row': row,
						'cell': cell,
						'posX': cell
					};
				}
			}

			var pos;
			var lastSelectableCell;
			while (!pos) {
				pos = gotoLeft(row, cell, posX);
				if (pos) {
					break;
				}
				if (--row < 0) {
					return null;
				}

				cell = 0;
				lastSelectableCell = findLastFocusableCell(row);
				if (lastSelectableCell !== null) {
					pos = {
						'row': row,
						'cell': lastSelectableCell,
						'posX': lastSelectableCell
					};
				}
			}
			return pos;
		}

		function navigateRight() {
			return navigate('right');
		}

		function navigateLeft() {
			return navigate('left');
		}

		function navigateDown() {
			return navigate('down');
		}

		function navigateUp() {
			return navigate('up');
		}

		function navigateNext() {
			return navigate('next');
		}

		function navigatePrev() {
			return navigate('prev');
		}

		/**
		 * @param {string} dir Navigation direction.
		 * @return {boolean} Whether navigation resulted in a change of active cell.
		 */
		function navigate(dir) {
			// reset isGroupRow variable
			isGroupRow = false;
			if (!options.enableCellNavigation) {
				return false;
			}

			if (!activeCellNode && dir != 'prev' && dir != 'next') {
				return false;
			}

			if (!getEditorLock().commitCurrentEdit()) {
				return true;
			}

			setFocus();

			var tabbingDirections = {
				'up': -1,
				'down': 1,
				'left': -1,
				'right': 1,
				'prev': -1,
				'next': 1
			};
			tabbingDirection = tabbingDirections[dir];

			var stepFunctions = {
				'up': gotoUp,
				'down': gotoDown,
				'left': gotoLeft,
				'right': gotoRight,
				'prev': gotoPrev,
				'next': gotoNext
			};
			var stepFn = stepFunctions[dir];
			var pos = stepFn(activeRow, activeCell, activePosX);

			if (pos) {
				if (hasFrozenRows && options.frozenBottom & pos.row === getDataLength()) {
					return;
				}

				var isAddNewRow = (pos.row == getDataLength());

				scrollCellIntoView(pos.row, pos.cell, !isAddNewRow);
				setActiveCellInternal(getCellNode(pos.row, pos.cell));
				activePosX = pos.posX;
				return true;
			} else {
				setActiveCellInternal(getCellNode(activeRow, activeCell));
				return false;
			}
		}

		function findNextEditable(tabNav) {
			if (_lastCell && _lastRow) {
				return { jump: false };
			}
			var nextCell = activeCell + 1;
			var lastcell = columns.length - 1;
			var currentRow = activeRow;
			var jump = true, addNew = false;
			if (nextCell > lastcell) {
				nextCell = 0;
				currentRow++;
			}
			if (nextCell <= lastcell) {
				while (isCellReadonly(columns[nextCell], currentRow) || !columns[nextCell].editor || (!tabNav && columns[nextCell].keyboard && !columns[nextCell].keyboard.enter)) {
					if (nextCell === lastcell && currentRow >= getDataLength() - 1) {
						jump = false;
						addNew = true;
						break;
					}
					if (nextCell === lastcell) {
						nextCell = 0;
						currentRow++;
					} else {
						nextCell++;
					}
				}
			}
			return {
				cell: nextCell,
				row: currentRow,
				jump: currentRow >= 0 ? jump : false,
				addNew: addNew
			};
		}

		function findPrevEditable(tabNav) {
			var firstcell = options.tree === true ? 2 : 1;
			var lastcell = columns.length - 1;
			if (activeCell === firstcell && activeRow === 0) {
				return { jump: false };
			}
			var currentRow = (activeCell - 1) >= firstcell ? activeRow : activeRow - 1;
			var nextCell = (activeCell - 1) >= firstcell ? (activeCell - 1) : lastcell;
			var jump = true;
			if (nextCell >= firstcell && currentRow >= 0) {
				while (isCellReadonly(columns[nextCell]) || !columns[nextCell].editor || (!tabNav && columns[nextCell].keyboard && !columns[nextCell].keyboard.enter)) {
					if (nextCell === firstcell && currentRow === 0) {
						jump = false;
						break;
					}
					if (nextCell === firstcell) {
						nextCell = lastcell;
						currentRow--;
					} else {
						nextCell--;
					}
				}
			}
			return {
				cell: nextCell,
				row: currentRow,
				jump: currentRow >= 0 ? jump : false
			};
		}

		function navigateNextTab(reverse) {
			var firstcell = options.tree === true ? 2 : 1;
			var lastcell = columns.length - 1;

		}

		function navigateNextEditable(reverse) {
			var item = data.getItem(activeRow);
			var res = false, nextcell;
			if (item && item.__group) {
				expandGroupOnNavigation(item);
				if (reverse) {
					res = navigateUp();
				} else {
					res = navigateDown();
				}
			}
			if (reverse) {
				nextcell = findPrevEditable(arguments[1]);
				if (nextcell.jump) {

					gotoCell(nextcell.row, nextcell.cell, _inEditMode);
					res = true;
				}
			} else {
				nextcell = findNextEditable(arguments[1]);
				if (nextcell.jump) {
					gotoCell(nextcell.row, nextcell.cell, _inEditMode);
					res = true;
				}
			}
			setFocus();
			return res;
		}

		function editableJump() {
			if (currentEditor) {
				// adding new row
				if (activeRow === getDataLength() - 1) {
					navigateDown();
				} else {
					commitEditAndSetFocus();
				}
			} else if (getEditorLock().commitCurrentEdit()) {
				makeActiveCellEditable();
			}
		}

		function expandGroupOnNavigation(item) {
			if (item && item instanceof Slick.Group) {
				if (item.collapsed) {
					getData().expandGroup(item);
				}
			}
		}

		function getCellNode(row, cell) {
			if (rowsCache[row]) {
				ensureCellNodesInRowsCache(row);
				try {
					if (rowsCache[row].cellNodesByColumnIdx.length > cell) {
						return rowsCache[row].cellNodesByColumnIdx[cell];
					}
					else {
						return null;
					}
				} catch (e) {
					return rowsCache[row].cellNodesByColumnIdx[cell];
				}
			}
			return null;
		}

		function setActiveCell(row, cell) {
			var r = false;
			if (!initialized) {
				return;
			}
			if (row === true || cell === true) {
				r = (row === true) || (cell === true);
				row = row === true ? getDataLength() - 1 : row;
				for (var i = 0; i < columns.length; i++) {
					if (columns[i].keyboard && columns[i].keyboard.enter) {
						cell = i;
						break;
					}
				}
			} else if (row > getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
				return;
			}

			if (!options.enableCellNavigation) {
				return;
			}

			scrollCellIntoView(row, cell, false);
			setActiveCellInternal(getCellNode(row, cell), r);
		}

		function canCellBeActive(row, cell) {
			if (!options.enableCellNavigation || row >= getDataLengthIncludingAddNew() ||
				row < 0 || cell >= columns.length || cell < 0) {
				return false;
			}

			var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
			if (rowMetadata && typeof rowMetadata.focusable === 'boolean') {
				return rowMetadata.focusable;
			}

			var columnMetadata = rowMetadata && rowMetadata.columns;
			if (columnMetadata && columnMetadata[columns[cell].id] && typeof columnMetadata[columns[cell].id].focusable === 'boolean') {
				return columnMetadata[columns[cell].id].focusable;
			}
			if (columnMetadata && columnMetadata[cell] && typeof columnMetadata[cell].focusable === 'boolean') {
				return columnMetadata[cell].focusable;
			}

			return columns[cell].focusable;
		}

		function canCellBeSelected(row, cell) {
			if (row >= getDataLength() || row < 0 || cell >= columns.length || cell < 0) {
				return false;
			}
			var rowMetadata = data.getItemMetadata && data.getItemMetadata(row);
			if (rowMetadata && (rowMetadata.mergedCells || rowMetadata.group || rowMetadata.groupTotals)) {
				rowMetadata = rowMetadata.mergedCells || rowMetadata.group || rowMetadata.groupTotals;
			}
			if (rowMetadata && typeof rowMetadata.selectable === 'boolean') {
				return rowMetadata.selectable;
			}
			var columnMetadata = rowMetadata && rowMetadata.columns && (rowMetadata.columns[columns[cell].id] || rowMetadata.columns[cell]);
			if (columnMetadata && typeof columnMetadata.selectable === 'boolean') {
				return columnMetadata.selectable;
			}
			return columns[cell].hasOwnProperty('selectable') ? columns[cell].selectable : true;
		}

		function gotoCell(row, cell, forceEdit) {
			if (!initialized || _.isUndefined(row) || _.isNull(row)) {
				return;
			}

			if (!canCellBeActive(row, cell)) {
				return;
			}

			let result = true;

			if (isEditMode()) {
					result = getEditorLock().commitCurrentEdit();
			}

			let wasAsync = false;
			if (!result) {
				return;
			}
			else if (typeof result.then === 'function') {
				wasAsync = true;
			}

			scrollCellIntoView(row, cell, false);

			var newCell = getCellNode(row, cell);

			// if selecting the 'add new' row, start editing right away
			setActiveCellInternal(newCell, forceEdit || (row === getDataLength()) || options.autoEdit, wasAsync);

			// if no editor was created, set the focus back on the grid
			// if (!currentEditor) {
			// 	setFocus();
			// }
		}

		// ////////////////////////////////////////////////////////////////////////////////////////////
		// IEditor implementation for the editor lock

		function commitCurrentEdit() {
			var item = getDataItem(activeRow);
			var column = columns[activeCell];

			if (currentEditor) {
				if (currentEditor.isValueChanged()) {
					var validationResults = currentEditor.validate();
					var wasAsync = false;

					if (validationResults.valid) {
						if (activeRow < getDataLength()) {
							var editCommand = {
								row: activeRow,
								cell: activeCell,
								editor: currentEditor,
								serializedValue: currentEditor.serializeValue(),
								prevSerializedValue: serializedEditorValue,
								execute: function () {
									wasAsync = this.editor.applyValue(item, this.serializedValue);
									updateRow(this.row);
								},
								undo: function () {
									this.editor.applyValue(item, this.prevSerializedValue);
									updateRow(this.row);
								}
							};

							if (options.editCommandHandler) {
								makeActiveCellNormal(wasAsync);
								options.editCommandHandler(item, column, editCommand);
							} else {
								editCommand.execute();
								makeActiveCellNormal(wasAsync);
							}

							if (!wasAsync) {
								trigger(self.onCellChange, {
									row: activeRow,
									cell: activeCell,
									item: item
								});
							} else {
								return wasAsync;
							}
						} else {
							var newItem = {};
							currentEditor.applyValue(newItem, currentEditor.serializeValue());
							makeActiveCellNormal();
							trigger(self.onAddNewRow, {
								item: newItem,
								column: column
							});
						}

						// check whether the lock has been re-acquired by event handlers
						return !getEditorLock().isActive();
					} else {
						// Re-add the CSS class to trigger transitions, if any.
						$(activeCellNode).removeClass('invalid');
						$(activeCellNode).width();  // force layout
						$(activeCellNode).addClass('invalid');

						trigger(self.onValidationError, {
							editor: currentEditor,
							cellNode: activeCellNode,
							validationResults: validationResults,
							row: activeRow,
							cell: activeCell,
							column: column
						});

						currentEditor.focus();
						return false;
					}
				}

				makeActiveCellNormal();
			}
			return true;
		}

		function cancelCurrentEdit() {
			makeActiveCellNormal();
			return true;
		}

		function rowsToRanges(rows) {
			var ranges = [];
			var lastCell = columns.length - 1;
			for (var i = 0; i < rows.length; i++) {
				ranges.push(new Slick.Range(rows[i], 0, rows[i], lastCell));
			}
			return ranges;
		}

		function getSelectedRows() {
			if (!selectionModel) {
				throw 'Selection model is not set';
			}
			return selectedRows;
		}

		function setSelectedRows(rows, surpressNotification) {
			if (!selectionModel) {
				throw 'Selection model is not set';
			}
			selectionModel.setSelectedRanges(rowsToRanges(rows), surpressNotification);
		}

		// ////////////////////////////////////////////////////////////////////////////////////////////
		// Debug

		this.debug = function () {
			var s = '';

			s += ('\n' + 'counter_rows_rendered:  ' + counter_rows_rendered);
			s += ('\n' + 'counter_rows_removed:  ' + counter_rows_removed);
			s += ('\n' + 'renderedRows:  ' + renderedRows);
			s += ('\n' + 'numVisibleRows:  ' + numVisibleRows);
			s += ('\n' + 'maxSupportedCssHeight:  ' + maxSupportedCssHeight);
			s += ('\n' + 'n(umber of pages):  ' + n);
			s += ('\n' + '(current) page:  ' + page);
			s += ('\n' + 'page height (ph):  ' + ph);
			s += ('\n' + 'vScrollDir:  ' + vScrollDir);

			alert(s);
		};

		// a debug helper to be able to access private members
		this.eval = function (expr) {
			return eval(expr);
		};

		// ////////////////////////////////////////////////////////////////////////////////////////////
		// My modifications functions/methods.

		function setTopPanelVisibility(visible) {
			if (options.showTopPanel !== visible) {
				options.showTopPanel = visible;
				if (visible) {
					$topPanelScroller.slideDown('fast', resizeGrid);
				} else {
					$topPanelScroller.slideUp('fast', resizeGrid);
				}
			}
		}

		function headerRowVisibility(visible) {
			if (visible !== undefined) {
				if (options.showTopPanel !== visible) {
					options.showTopPanel = visible;
					if (visible) {
						$headerRowScroller.slideDown('fast', resizeGrid);
					} else {
						$headerRowScroller.slideUp('fast', resizeGrid);
					}
				}
			} else {
				return options.showHeaderRow;
			}
		}

		function mainTopPanelVisibility(visible, searchString) {
			if (visible !== undefined) {
				options.showMainTopPanel = visible;
				if (visible) {
					$mainTopPanelScroller.slideDown('fast', resizeGrid);
					setTimeout(function () {
						$mainTopPanelScroller.find('.filterinput').trigger('focus');
						if (searchString) {
							$mainTopPanelScroller.find('.filterinput').val(searchString);
						} else {
							$mainTopPanelScroller.find('.filterinput').val('');
						}
					}, 0);
				} else {
					$mainTopPanelScroller.slideUp('fast', resizeGrid);
				}
			} else {
				return options.showSearchPanel;
			}
		}

		function topPanelVisibility(visible) {
			if (visible !== undefined) {
				if (options.showTopPanel !== visible) {
					options.showTopPanel = visible;
					if (visible) {
						$topPanelScroller.slideDown('fast', resizeGrid);
						setTimeout(function () {
							$topPanelScroller.find('.filterinput').trigger('focus');
						}, 0);
					} else {
						$topPanelScroller.slideUp('fast', resizeGrid);
					}
				}
			} else {
				return options.showTopPanel;
			}
		}

		function groupPanelVisibility(visible) {
			if (visible !== undefined && options.enableDraggableGroupBy) {
				if (options.showGroupingPanel !== visible) {
					options.showGroupingPanel = visible;
					if (visible) {
						$headerHelpInfo.addClass('pad-top');
						$headerDraggableGroupBy.addClass('center');
						$headerDraggableGroupBy.slideDown('fast', resizeGrid);
					} else {
						$headerHelpInfo.removeClass('pad-top');
						$headerDraggableGroupBy.slideUp('fast', resizeGrid);
						$headerDraggableGroupBy.removeClass('center');
					}
				}
			} else {
				return options.showGroupingPanel;
			}
		}

		function filterRowVisibility(visible) {
			if (visible !== undefined) {
				options.showFilterRow = visible;
				if (visible) {
					$headerHelpInfo.show();
					$headerRowScroller.slideDown('fast', resizeGrid);
					$('.platformgrid.' + getUID() + ' .slick-headerrow-panel').show();
					let scrollLeft = $headerScrollContainer[0].scrollLeft;
					let columnid = '';
					if(scrollLeft > 0) {
						$headerRowScrollContainer[0].scrollLeft = scrollLeft;
						$headerRowScrollerL.scrollLeft = scrollLeft;

						let width = 0;
						$headers.find('.slick-header-column')
							.each(function () {
								let column = $(this).data('column');
								if(column.id !== 'indicator') {
									if (width < scrollLeft) {
										width += column.width;
									}
									else {
										columnid = '.item-field_' + column.id;
										return false;
									}
								}
							});
					}

					var inputs = $('.platformgrid.' + getUID() + ' .slick-headerrow-columns .slick-cell' + columnid +  ' input');
					if (inputs && inputs.length > 0) {
						inputs[0].focus();
					}
				} else {
					$headerHelpInfo.hide();
					$headerRowScroller.slideUp('fast', resizeGrid);
					$('.platformgrid.' + getUID() + ' .slick-headerrow-panel').hide();
				}
			} else {
				return options.showFilterRow;
			}
		}

		function getUID() {
			return uid;
		}

		function getColumnHeaders() {
			return $headers;
		}

		function getHeaderElements() {
			return headerElements;
		}

		function isCellReadonly(column, row) {
			if (_.isNil(column) || _.isNil(row || activeRow)) {
				// console.warn("unexpected - column and/or activeRow null or undefined");
				return true;
			}

			if (column.domain === 'history') {
				return false;
			}

			var item = data.getItem(row || activeRow);

			return _.get(item, '__rt$data.locked', false) || _.get(item, '__rt$data.entityReadonly', false) || _.get(_.find(_.get(item, '__rt$data.readonly', []), { field: column.field }), 'readonly', false);
		}

		function setColumnOptions() {
			var frozen = -1, mapCnt = -1;
			_columnOrder.clear();
			for (var i = 0; i < columns.length; i++) {
				if (columns[i].pinned) {
					++frozen;
					_columnOrder.set(i, frozen);
				}
				if (i - 1 >= 0 && columns[i].hidden) {
					_lastCell = i - 1;
				}
			}
			mapCnt = frozen;
			for (var i = 0; i < columns.length; i++) {
				if (!columns[i].pinned) {
					++mapCnt;
					_columnOrder.set(i, mapCnt);
				}
			}

			options.frozenColumn = (frozen >= 0
				&& frozen < columns.length
			)
				? parseInt(frozen)
				: -1;
		}

		function setGroupPanelText(text) {
			$headerDraggableGroupBy.find('slick-placeholder').innerText = text;
		}

		function getFooterNodes() {
			return $footer;
		}

		function hasFixedRows() {
			return hasFrozenRows;
		}

		function groupingWasSet() {
			if (arguments.length === 1) {
				_groupingWasSet = arguments[0];
			}
			return _groupingWasSet;
		}

		function toggleGroupIndicator(groupingInfos, columnWidth) {
			var cols = getColumns();

			if (!cols || !cols.length) {
				return;
			}

			// for (var i = 0; i < groupingInfos.length; i++) {
			// 	var previous = 100;
			// 	// var col = _.find(cols, {field: groupingInfos[i].getter});
			// 	var col = _.find(cols, {id: groupingInfos[i].columnId});
			//
			// 	previous = (!(_.isUndefined(col)) && col.width > previous) ? col.width : previous;
			// }

			var gIndicator = {
				id: 'group',
				name: '',
				name$tr$: '',
				toolTip: '',
				toolTip$tr$: '',
				field: 'group',
				width: columnWidth,
				minWidth: 100,
				resizable: true,
				sortable: false,
				pinned: true,
				formatter: function (row, cell, value) {
					return value || ' ';
				}
			};

			var index = cols[0].id === 'indicator' ? cols.length > 1 && cols[1].id === 'tree' ? 2 : 1 : 1;
			if (!cols[index]) {
				return;
			}
			if (!groupingInfos.length && cols[index].id === 'group') {
				cols.splice(index, 1);
			} else if (groupingInfos.length && cols[index].id !== 'group') {
				cols.splice(index, 0, gIndicator);
			} else {
				return;
			}
			setColumns(cols);
		}

		function toggleOverlay(show) {
			if (show) {
				// $overlay.show();
				$overlay.addClass('active');
			} else {
				$overlay.removeClass('active');
				// $overlay.hide();
			}
		}

		function beforeResize() {
			scrollBarVBeforeResize = scrollTop;
		}

		function afterResize() {
			if(scrollBarVBeforeResize > 0) {
				scrollTo(scrollBarVBeforeResize);
				scrollBarVBeforeResize = -1;
			}
		}

		/**
		 * @ngdoc function
		 * @name isInContainerView
		 * @function
		 * @description returns a boolean value indicating if the grid is within a container of a module, false if in lookup or popup
		 */
		function isInContainerView() {
			return $container[0].parentNode.getAttributeNames().includes('data-sub-container-view');
		}

		// ////////////////////////////////////////////////////////////////////////////////////////////
		// Public API
		var _groupingWasSet = false;

		$.extend(this, {
			'slickGridVersion': '2.1',

			// Events
			'onScroll': new Slick.Event(),
			'onSort': new Slick.Event(),
			'onHeaderMouseEnter': new Slick.Event(),
			'onHeaderMouseLeave': new Slick.Event(),
			'onHeaderContextMenu': new Slick.Event(),
			'onHeaderClick': new Slick.Event(),
			'onHeaderCellRendered': new Slick.Event(),
			'onBeforeHeaderCellDestroy': new Slick.Event(),
			'onHeaderRowCellRendered': new Slick.Event(),
			'onBeforeHeaderRowCellDestroy': new Slick.Event(),
			'onMouseEnter': new Slick.Event(),
			'onMouseLeave': new Slick.Event(),
			'onClick': new Slick.Event(),
			'onDblClick': new Slick.Event(),
			'onContextMenu': new Slick.Event(),
			'onKeyDown': new Slick.Event(),
			'onKeyUp': new Slick.Event(),
			'onAddNewRow': new Slick.Event(),
			'onValidationError': new Slick.Event(),
			'onViewportChanged': new Slick.Event(),
			'onColumnsReordered': new Slick.Event(),
			'onColumnsResized': new Slick.Event(),
			'onCellChange': new Slick.Event(),
			'onBeforeEditCell': new Slick.Event(),
			'onBeforeCellEditorDestroy': new Slick.Event(),
			'onBeforeDestroy': new Slick.Event(),
			'onActiveCellChanged': new Slick.Event(),
			'onActiveCellPositionChanged': new Slick.Event(),
			'onDragInit': new Slick.Event(),
			'onDragStart': new Slick.Event(),
			'onDrag': new Slick.Event(),
			'onDragEnd': new Slick.Event(),
			'onSelectedRowsChanged': new Slick.Event(),
			'onCellCssStylesChanged': new Slick.Event(),
			'onRenderCompleted': new Slick.Event(),
			'onHeaderCheckboxChanged': new Slick.Event(),
			'onContainerMouseMove': new Slick.Event(),

			// Methods
			'registerPlugin': registerPlugin,
			'unregisterPlugin': unregisterPlugin,
			'getPluginByName': getPluginByName,
			'hasPlugin': hasPlugin,
			'getColumns': getColumns,
			'setColumns': setColumns,
			'getColumnIndex': getColumnIndex,
			'updateColumnHeader': updateColumnHeader,
			'setSortColumn': setSortColumn,
			'setSortColumns': setSortColumns,
			'getSortColumns': getSortColumns,
			'autosizeColumns': autosizeColumns,
			'getOptions': getOptions,
			'setOptions': setOptions,
			'getData': getData,
			'getDataLength': getDataLength,
			'getDataItem': getDataItem,
			'setData': setData,
			'getSelectionModel': getSelectionModel,
			'setSelectionModel': setSelectionModel,
			'getSelectedRows': getSelectedRows,
			'setSelectedRows': setSelectedRows,
			'getContainerNode': getContainerNode,

			'render': render,
			'invalidate': invalidate,
			'invalidateRow': invalidateRow,
			'invalidateRows': invalidateRows,
			'invalidateAllRows': invalidateAllRows,
			'updateCell': updateCell,
			'updateRow': updateRow,
			'getViewport': getVisibleRange,
			'getRenderedRange': getRenderedRange,
			'resizeCanvas': resizeCanvas,
			'updateRowCount': updateRowCount,
			'scrollRowIntoView': scrollRowIntoView,
			'scrollRowToTop': scrollRowToTop,
			'scrollCellIntoView': scrollCellIntoView,
			'getCanvasNode': getCanvasNode,
			'getCanvases': getCanvases,
			'getActiveCanvasNode': getActiveCanvasNode,
			'setActiveCanvasNode': setActiveCanvasNode,
			'getViewportNode': getViewportNode,
			'getActiveViewportNode': getActiveViewportNode,
			'setActiveViewportNode': setActiveViewportNode,
			'focus': setFocus,
			'setCellFocus': setCellFocus,
			'getCellFromPoint': getCellFromPoint,
			'getCellFromEvent': getCellFromEvent,
			'getActiveCell': getActiveCell,
			'setActiveCell': setActiveCell,
			'getActiveCellNode': getActiveCellNode,
			'getActiveCellPosition': getActiveCellPosition,
			'resetActiveCell': resetActiveCell,
			'editActiveCell': makeActiveCellEditable,
			'getCellEditor': getCellEditor,
			'getCellNode': getCellNode,
			'getCellNodeBox': getCellNodeBox,
			'canCellBeSelected': canCellBeSelected,
			'canCellBeActive': canCellBeActive,
			'navigatePrev': navigatePrev,
			'navigateNext': navigateNext,
			'navigateUp': navigateUp,
			'navigateDown': navigateDown,
			'navigateLeft': navigateLeft,
			'navigateRight': navigateRight,
			'navigatePageUp': navigatePageUp,
			'navigatePageDown': navigatePageDown,
			'gotoCell': gotoCell,
			'getTopPanel': getTopPanel,
			'getHeaderRow': getHeaderRow,
			'getHelperInfoRow': getHelperInfoRow,
			'getDraggableGroupByPanel': getDraggableGroupByPanel,
			'getHeaderRowColumn': getHeaderRowColumn,
			'getGridPosition': getGridPosition,
			'flashCell': flashCell,
			'addCellCssStyles': addCellCssStyles,
			'setCellCssStyles': setCellCssStyles,
			'removeCellCssStyles': removeCellCssStyles,
			'getCellCssStyles': getCellCssStyles,
			'getFrozenRowOffset': getFrozenRowOffset,

			'init': finishInitialization,
			'destroy': destroy,

			// IEditor implementation
			'getEditorLock': getEditorLock,
			'getEditController': getEditController,

			// My Mods
			'getUID': getUID,
			'getMainTopPanel': getMainTopPanel,
			'getHeaderElements': getHeaderElements,
			'getColumnHeaders': getColumnHeaders,
			'setTopPanelVisibility': setTopPanelVisibility,
			'topPanelVisibility': topPanelVisibility,
			'mainTopPanelVisibility': mainTopPanelVisibility,
			'searchPanelVisibility': mainTopPanelVisibility,
			'filterRowVisibility': filterRowVisibility,
			'groupPanelVisibility': groupPanelVisibility,
			'setHeaderRowVisibility': setHeaderRowVisibility,
			'getViewportNodes': getViewportNodes,
			'getHeaders': getHeaders,
			'getHeaderLeft': getHeaderLeft,
			'getHeaderRight': getHeaderRight,
			'getHeadersWidth': getHeadersWidth,
			'getHeaderLeftWidth': getHeaderLeftWidth,
			'getHeaderRightWidth': getHeaderRightWidth,
			'getFooterNodes': getFooterNodes,
			'getContainer': getContainer,
			'hasFixedRows': hasFixedRows,
			'resizeGrid': resizeGrid,
			'setGroupPanelText': setGroupPanelText,
			'getViewportDimensions': getViewportDimensions,
			'groupingWasSet': groupingWasSet,
			'toggleGroupIndicator': toggleGroupIndicator,
			'highlightRows': highlightRows,
			'clearHighlightRows': clearHighlightRows,
			'clearSelectedRows': clearSelectedRows,
			'getCellNodeBoxForCopy': getCellNodeBoxForCopy,
			'hasFrozenColumns': hasFrozenColumns,
			'getContainerForCopy': getContainerForCopy,
			'isInContainerView' : isInContainerView,
			'beforeResize': beforeResize,
			'afterResize': afterResize,
			'isEditMode': isEditMode,
			'skeletonLoading': skeletonLoading,
			// Modifications: Events
			'onTreeNodeExpanding': new Slick.Event(),
			'onTreeNodeCollapsing': new Slick.Event(),
			'onTreeNodeExpanded': new Slick.Event(),
			'onTreeNodeCollapsed': new Slick.Event(),
			'onHeaderToggled': new Slick.Event(),
			'onFilterChanged': new Slick.Event(),
			'onItemCountChanged': new Slick.Event(),
			'onSearchPanelVisibilityChanged': new Slick.Event(),
			'onCopyComplete': new Slick.Event(),
			'onPasteComplete': new Slick.Event(),
			'onBatchCopyComplete': new Slick.Event(),
			'onInitialized': new Slick.Event(),
			'onGridConfigChanged': new Slick.Event(),
			'onMarkerSelectionChanged': new Slick.Event(),
			'onSelectionModeChanged': new Slick.Event(),
			'onScrollEnd': new Slick.Event(),
			// More bad mods:
			'getRenderedRowIds': function () {
				return Object.keys(rowsCache);
			},

			'initEvents': initEvents,
			'updateSelection': updateSelection,
			'getDataItemValueForColumn': getDataItemValueForColumn,
			'toggleOverlay': toggleOverlay
		});

		init();

	}
})(jQuery);
