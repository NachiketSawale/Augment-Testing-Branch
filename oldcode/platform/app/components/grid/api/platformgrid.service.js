/**
 * platformGrid Service
 * @namespace services
 */

// eslint-disable-next-line func-names
(function (Slick, $, Ext) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platformGridAPI
	 * @description
	 * # platformGrid.service
	 * # Code smell.
	 */
	angular.module('platform').service('platformGridAPI', PlatformGridAPI);

	PlatformGridAPI.$inject = [
		'slick',
		'$log',
		'_',
		'queue',
		'platformTranslateService',
		'platformGridFilterService',
		'platformObjectHelper',
		'accounting',
		'$rootScope',
		'platformRuntimeDataService',
		'$injector',
		'$http',
		'$timeout',
		'moment',
		'mainViewService',
		'platformModalService',
		'platformDialogService',
		'$q',
		'platformDomainList',
		'$compile',
		'platformLanguageService',
		'platformContextService',
		'platformSanitizeService',
		'$sanitize',
		'keyCodes'
	];

	/*
	 * @namespace   platformGridAPI
	 * @description Provide a grid API
	 * @memberOf    Services
	 */
	function PlatformGridAPI(slick, $log, _, queue, platformTranslateService, platformGridFilterService, platformObjectHelper, accounting, $rootScope, platformRuntimeDataService,
		$injector, $http, $timeout, moment, mainViewService, platformModalService, platformDialogService, $q, platformDomainList, $compile, platformLanguageService,
		platformContextService, platformSanitizeService, $sanitize, keyCodes) { // jshint ignore:line
		var _grids = [];
		// noinspection JSUnresolvedFunction
		var _gridsExt = new Map();
		var _gridEvents = [
			'onScroll',
			'onScrollEnd',
			'onSort',
			'onHeaderMouseEnter',
			'onHeaderMouseLeave',
			'onHeaderContextMenu',
			'onHeaderClick',
			'onHeaderCellRendered',
			'onBeforeHeaderCellDestroy',
			'onHeaderRowCellRendered',
			'onBeforeHeaderRowCellDestroy',
			'onMouseEnter',
			'onMouseLeave',
			'onContainerMouseMove',
			'onClick',
			'onDblClick',
			'onContextMenu',
			'onKeyDown',
			'onAddNewRow',
			'onValidationError',
			'onViewportChanged',
			'onColumnsReordered',
			'onColumnsResized',
			'onCellChange',
			'onBeforeEditCell',
			'onBeforeCellEditorDestroy',
			'onBeforeDestroy',
			'onActiveCellChanged',
			'onActiveCellPositionChanged',
			'onDragInit',
			'onDragStart',
			'onDrag',
			'onDragEnd',
			'onSelectedRowsChanged',
			'onCellCssStylesChanged',
			'onTreeNodeExpanding',
			'onTreeNodeCollapsing',
			'onTreeNodeExpanded',
			'onTreeNodeCollapsed',
			'onInitialized',
			'onSearchPanelVisibilityChanged',
			'onFilterChanged',
			'onItemCountChanged',
			'onGridConfigChanged',
			// same as _dataViewEvents
			'onRowCountChanged',
			'onRowsChanged',
			'onPagingInfoChanged',
			'onHeaderCheckboxChanged',
			'onRenderCompleted',
			'onHeaderToggled',
			'onBatchCopyComplete',
			'onCopyComplete',
			'onPasteComplete',
			'onMarkerSelectionChanged',
			'onSelectionModeChanged'
		];

		var _dataViewEvents = [
			'onRowCountChanged',
			'onRowsChanged',
			'onPagingInfoChanged',
			'onGroupingChanged',
			'onGroupItemsChanged',
			'onGroupingStateChanged',
			'onTreeLevelChanged'
		];

		var _searchString = '';
		var _sortColumn;
		var _lateBindEvents = new Map();
		var _groupingQueue = [];
		var _forceEdit = true;
		var _groupAction = false;
		var _userTriggeredGroupAction = false;
		var _expandGroup = false;
		var _viewChange = false;
		var _gridConfigChanged = false;
		var _isInitialized = false;
		var _itemCountChangedTriggered = false;
		var _copyPastePlugin;
		var _batchCopyPlugin;
		var isGrouping = false;
		let dataViewTimer = new Map(); // map for dataView timeouts for each grid
		let timerMaps = [dataViewTimer]; // all timer maps, add new timermaps for correct unregister
		let unregisterEvents = new Map(); // map for list of events to unregiste when Grid is destroyed

		/**
		 * platformGrid API
		 */
		this.grids = {
			register: createGrid,
			unregister: destroyGrid,
			config: config,
			element: element,
			exist: exist,
			resize: resize,
			invalidate: invalidate,
			invalidateAll: invalidateAll,
			commitEdit: commitEdit,
			commitAllEdits: commitAllEdits,
			cancelEdit: commitCancel,
			refresh: refresh,
			lazyLoad: lazyLoad,
			exportGridData: exportGridData,
			getGridState: getGridState,
			canSaveConfig: canSaveConfig,
			getOptions: getOptions,
			setOptions: setOptions,
			columnGrouping: columnGrouping,
			onColumnStateChanged: onColumnStateChanged,
			itemCountChanged: itemCountChanged,
			renderHeaderRow: renderHeaderRow,
			markReadOnly: markReadOnly,
			setHorizontalLevelFormat: setHorizontalLevelFormat,
			setVerticalLevelFormat: setVerticalLevelFormat,
			getMarkReadonly: getMarkReadonly,
			copySelection: copySelection,
			pasteSelection: pasteSelection,
			setAllowCopySelection: setAllowCopySelection,
			setCopyWithHeader: setCopyWithHeader,
			getSaveConfiguration: getSaveConfiguration,
			setCellCssStyles: setCellCssStyles,
			setTreeGridLevel: setTreeGridLevel,
			skeletonLoading: skeletonLoading,
			setConditionalFormatting: setConditionalFormatting
		};

		this.filters = {
			showColumnSearch: showColumnSearch,
			showSearch: showSearch,
			searchString: searchString,
			updateFilter: updateFilter,
			updateHeaderFilter: updateHeaderFilter,
			updateHeaderRowIndicatorIcon: updateHeaderRowIndicatorIcon,
			generateFilterRow: generateFilterRow,
			getFilterOptions: getFilterOptions,
			items: getFilteredItems,
			getFilterRowProperties: getFilterRowProperties,
			extendFilterFunction: extendFilterFunction
		};

		this.rows = {
			add: addRow,
			append: appendRows,
			delete: deleteRow,
			selection: selectionRows,
			editable: editableRows,
			invalidate: invalidateRows,
			scroll: scrollRows,
			scrollIntoViewByItem: scrollRowIntoViewByItem,
			collapseAllNodes: collapseAllNodes,
			expandAllNodes: expandAllNodes,
			expandNextNode: expandNextNode,
			collapseNextNode: collapseNextNode,
			collapseAllSubNodes: collapseAllSubNodes,
			expandAllSubNodes: expandAllSubNodes,
			expandNode: expandNode,
			collapseNode: collapseNode,
			refreshRow: refreshRow,
			refresh: refreshRow,
			addCssClass: addCssClass,
			getRows: getRows
		};

		this.columns = {
			editable: editableCol,
			configuration: configuration,
			resetColumns: resetColumns,
			setGrouping: setGrouping,
			getGrouping: getGrouping,
			getSortColumn: getSortColumn,
			getColumns: getCurrentColumns,
			autofitColumnsToContent: autofitColumnsToContent
		};

		this.items = {
			selection: selectionItems,
			invalidate: invalidateItems,
			data: dataView,
			sort: sort,
			filtered: getFilteredItems
		};

		this.cells = {
			selection: selectionCells,
			readonly: editableCells,
			mergeCells: mergeCells,
			getDataitemForCell: getDataitemForCell
		};

		this.events = {
			register: registerEvent,
			unregister: unregisterEvent
		};

		this.grouping = {
			toggleGroupPanel: toggleGroupPanel,
			collapseAllGroups: collapseAllGroups,
			expandAllGroups: expandAllGroups,
			collapseGroup: collapseGroup,
			expandGroup: expandGroup,
			assignSelectedItems: assignSelectedItemstoGroups
		};

		this.configuration = {
			getPropConfig: getPropertyConfig,
			openConfigDialog: openConfigDialog,
			refresh: refreshConfiguration,
			isGrpContainer: isGrpContainer,
			getGID: getGID
		};

		this.plugins = {
			register: registerPlugin,
			unregister: unregisterPlugin
		};

		this.status = {
			getFilterInfo: getFilterInfo,
			saveStatusBarState: saveStatusBarState
		};

		this.autoRefresh = {
			updateAutoRefreshStatus: updateAutoRefreshStatus
		};

		this.$$containerType = {
			subview: 0,
			configurator: 1,
			other: 2
		};

		let _containerType = this.$$containerType;

		Object.defineProperty(this.configuration, '$$configId', {
			writable: false,
			value: 'gridConfigurator'
		});

		let _configId = this.configuration.$$configId;

		$rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParam) {
			if(fromState.isDesktop || toState.isDesktop || toState.name !== fromState.name || toParams.tab !== fromParam.tab) {
				_viewChange = false;
			}
		});

		platformTranslateService.translationChanged.register(function () {
			_grids.forEach((grid) => {
				if(grid) {
					platformTranslateService.translateGridConfig(grid.columns.current);

					if (grid.instance) {
						const translated = platformTranslateService.translateGridConfig(grid.instance.getColumns());
						const difference = _.differenceWith(origin, translated, (first, second) => first.id === second.id && first.name === second.name && first.tooltip);

						// only force update when name/tooltip has been changed
						if(difference.length) {
							grid.instance.setColumns(translated);
						}
					}
				}
			});
		});

		/**
		 * @ngdoc function
		 * @name gridById
		 * @function
		 * @methodOf PlatformGridAPI
		 * @description returns grid for given gridId or throws exception
		 * @param gridId {string} grid id
		 * @param ensure {boolean} ensures grid exist, otherwise throws error
		 * @returns {object} grid or undefined
		 */
		function gridById(gridId, ensure) {
			if (!gridId) {
				throw new Error('Missing argument');
			}

			const grid = element('id', gridId);

			if (ensure && !grid) {
				throw new Error('gridById: grid instance ' + gridId + ' not found!');
			}

			return grid;
		}

		function lazyLoad(gridId) {
			const grid = gridById(gridId, false);

			if (grid) {
				return grid.lazyInit;
			} else {
				return false;
			}
		}

		function onTabChanged() {
			_groupingQueue = [];
		}

		mainViewService.registerListener('onTabChanged', onTabChanged);
		mainViewService.registerListener('onViewChanged', onViewChanged);

		// I also need to bind to Dataview.refresh, onRowCountChanged and onRowsChanged;

		// The parameter virtualized will use the grid's currently rendered rows
		// If not set we will use the filtered data view
		function getGridState(gridId, virtualized) {
			var options, groupmap = new Map(),
				grouped = false;
			// noinspection JSUnresolvedFunction
			var returnObj = {
				filteredItems: new Map(),
				groups: groupmap,
				canvasHeight: 0,
				viewportHeight: 0,
				grouped: grouped,
				rowHeight: 25,
				sortColumn: {
					sort: 'Code',
					sortAsc: true
				},
				showFilterRow: false,
				showFooter: false,
				showGroupingPanel: false,
				showHeaderRow: false,
				showMainTopPanel: false,
				showTopPanel: false
			};
			let grid = gridById(gridId, false);
			var filteredItems;

			if (!!grid && grid.instance) {
				options = grid.instance.getOptions();
				var rowHeight = options ? options.headerRowHeight : 25;
				filteredItems = getVisibleItems(virtualized);
				returnObj = {
					filteredItems: filteredItems,
					groups: groupmap,
					canvasHeight: grid.instance.getCanvasNode().clientHeight,
					viewportHeight: _.clone(grid.instance.getViewportDimensions()), // return clone to prevent publishing internals
					rowHeight: rowHeight,
					grouped: grid.dataView.getGrouping().length > 0,
					sortColumn: getSortColumn(),
					showFilterRow: options.showFilterRow,
					showFooter: options.showFooter,
					showGroupingPanel: options.showGroupingPanel,
					showHeaderRow: options.showHeaderRow,
					showMainTopPanel: options.showMainTopPanel,
					showTopPanel: options.showTopPanel
				};
			}

			return returnObj;

			function getVisibleItems(virtualized) {
				// noinspection JSUnresolvedFunction
				// eslint-disable-next-line no-undef
				var itemsmap = new Map();

				if (grid && grid.instance) { // the grid is not there when you need it
					var id = angular.isDefined(grid.options.idProperty) ? grid.options.idProperty : 'Id';

					if (virtualized) { // using the grid's currently visible items
						var renderedRowIds = grid.instance.getRenderedRowIds();
						// eslint-disable-next-line func-names
						_.forEach(renderedRowIds, function (rowIndex) {
							var element = grid.dataView.getItem(rowIndex);
							var visualIndex = rowIndex * rowHeight + (grid.instance.filterRowVisibility() ? getFilterRowProperties().height : 0);
							// noinspection TypeScriptValidateTypes
							if (!_.isUndefined(element[id])) { // a normal data element. id can be of any type.
								// noinspection TypeScriptValidateTypes
								itemsmap.set(element[id], visualIndex);
								// noinspection TypeScriptValidateTypes
								groupmap.set(rowIndex, element[id]);
							} else if (_.isString(element.groupingKey)) { // We deduce this is a grouping header
								groupmap.set(rowIndex, {
									title: element.printTitle,
									visualIndex: visualIndex,
									groupingKey: element.groupingKey
								});
							}
						});
					} else { // not virtualized
						// eslint-disable-next-line func-names
						_.forEach(grid.dataView.getRows(), function (element, rowIndex) {
							var visualIndex = rowIndex * rowHeight;
							if (!_.isUndefined(element[id])) { // a normal data element. id can be of any type.
								itemsmap.set(element[id], visualIndex);
								groupmap.set(rowIndex, element[id]);
							} else if (_.isString(element.groupingKey)) { // We deduce this is a grouping header
								groupmap.set(rowIndex, {
									title: element.printTitle,
									visualIndex: visualIndex,
									groupingKey: element.groupingKey
								});
							}
						});
					}
				}

				return itemsmap;
			}

			function getSortColumn() {
				var sortColumn = {
					sort: 'Code',
					sortAsc: true
				};
				var sortColumns = grid.instance.getSortColumns(gridId);
				if (sortColumns.length > 0) {
					// now try to find the corresponding field
					var columnid = sortColumns[0].columnId;
					// eslint-disable-next-line func-names
					var foundcolumn = grid.columns.visible.filter(function (col) {
						return col.id === columnid;
					});
					if (foundcolumn.length > 0) {
						sortColumn.sort = foundcolumn[0].field;
						sortColumn.sortAsc = sortColumns[0].sortAsc;
					}
				}
				return sortColumn;
			}
		}

		function getOptions(gridId) {
			return gridById(gridId).options;
		}

		function setOptions(gridId, options) {
			let grid = gridById(gridId);
			grid.options = $.extend({}, grid.options, options);
			if(grid.instance) {
				grid.instance.setOptions(options);
			}
		}

		/**
		 * @name setCellCssStyles
		 * @see https://github.com/mleibman/SlickGrid/wiki/Slick.Grid#setCellCssStyles
		 * @param gridId
		 * @param {string} key A string key. Will overwrite any data already associated with this key.
		 * @param {object} hash A hash of additional cell CSS classes keyed by row number and then by column id. Multiple CSS classes can be specified and separated by space.
		 */
		function setCellCssStyles(gridId, key, hash) {
			var grid = gridById(gridId, true);
			if (!grid || !grid.instance || key === '') {
				return;
			}

			grid.instance.setCellCssStyles(key, hash);
		}

		/**
		 * tests a set of conditions to implement formatting in grid
		 * @param conditions - array of objects in the following format { value1, value2, op, formatting (class)}
		 * assumption here is that value1 is always a field
		 * example: setConditionalFormatting(gridId, [{value1: 'companyfk', value2: '901', op: ops.EQUAL.value, class: 'testFormat'}, {value1: 'businesspartnername1', value2: '01', op: ops.EQUAL.value, class: 'testFormat'}]);
		 */
		function setConditionalFormatting(gridId, conditions) {
			var grid = gridById(gridId, true);
			if (grid && grid.instance) {
				grid.instance.removeCellCssStyles(gridId);
				const data = grid.instance.getData();
				if (data) {
					let rows = data.getRows();
					let formatObject = {};
					rows.forEach(function (row, i)  {
						let formats = undefined;
						_.forEach(conditions, function (condition) {
							let colIndex = grid.columns.current.findIndex(col => col.id === condition.value1);
							if (colIndex > 0) {
								let col = grid.columns.current[colIndex];
								const domainType = col.domain ? col.domain : col.editor$name;

								let value = row[col.field];
								if (col.formatter) {
									value = col.formatter(0, 0, row[col.field], col, row, true, null, {filter: true});
								}

								let value2 = condition.value2;

								if (platformGridFilterService.testCondition(value, value2, condition.op, domainType, condition.value1)) {
									if (!formats) {
										formats = {};
									}
									formats[condition.value1] = condition.class;
								}
							}
						});
						if (formats) {
							formatObject[i] = formats;
						}
					});
					setCellCssStyles(gridId, gridId, formatObject);
				}
			}
		}

		/**
		 * @name config
		 * @param  {object} options Set columns definition and grid data
		 */
		function config(options) {
			if (arguments.length < 1) {
				throw new Error('Missing argument');
			}

			// noinspection JSUnresolvedFunction
			options.events = new Map();

			_grids.push(options);
		}

		function defaultGroupingFormatter(g, gi) {
			var title = gi.title || gi.getter;
			return title + ': ' + g.groupingKey + '  <span style="color:green">(' + g.count + ' items)</span>';
		}

		function setupGrouping(columns) {
			for (var i = 0; i < columns.length; i++) {
				if (columns[i].grouping) {
					columns[i].grouping.formatter = defaultGroupingFormatter;
				}
			}
		}

		/* Grid methods */

		function canSaveConfig(gridId) {
			return gridById(gridId, true).enableConfigSave;
		}

		function createGrid(options) {
			if (arguments.length < 1) {
				throw new Error('Missing argument');
			}

			if (typeof options !== 'object') {
				throw new Error('Argument is not a object');
			}

			if (options.id === configuration.$$configId) {
				throw new Error('The id: ' + options.id + ' is a reserved name for internal use only. Please give the grid an alternativ id.');
			}

			// eslint-disable-next-line func-names
			var i = _grids.map(function (e) {
				return e.id;
			}).indexOf(options.id);

			var obj = _grids[i];

			if (!obj) {
				throw new Error('The requested grid does not exist');
			}

			/**
			 * @name gridOpt
			 * @see https://github.com/mleibman/SlickGrid/wiki/Grid-Options
			 * @type {Object}
			 */
			var gridOpt = {
				// explicitInitialization: true,
				enableHierarchicalCustomFeatures: obj.$$containerType === _containerType.subview,
				enableCellNavigation: true,
				multiColumnSort: false,
				enableAsyncPostRender: true,
				editable: true,
				rowReordering: true,
				autoEdit: false,
				showFilterRow: false,
				enableSkeletonLoading: true,
				propagateCheckboxSelection: false,
				sanitize: $sanitize
			};

			obj.options = $.extend({}, gridOpt, options.options);

			/**
			 * @name obj.config
			 * @type {Object} Hold data for the indicator column and
			 *                the readOnly cell data
			 */
			obj.config = {
				oldRow: null,
				readOnly: [],
				selected: []
			};

			// Create grid
			options.options.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider({context: platformContextService, language: platformLanguageService, accounting: accounting});
			options.options.$q = $q;
			obj.dataView = new Slick.Data.DataView(options.options);
			obj.dataView.setItems(obj.data || []);
			if (obj.options.enableDraggableGroupBy && !obj.options.tree) {
				setupGrouping(obj.columns.visible);
			}

			obj.enableConfigSave = angular.isDefined(obj.options.enableConfigSave) ? obj.options.enableConfigSave : obj.$$containerType === _containerType.subview;

			if (options.isStaticGrid) {
				initializeGrid({options: options, grid: obj})
					.then(function () {
						trigger(obj.instance, obj.instance.onInitialized);
					});
			} else {
				loadConfiguration(obj, options)
					.then(applyConfiguration)
					.then(initializeGrid)
					.then(setInitialGrouping)
					.then(function () {
						let timerSet = $timeout(function () {
							if(_viewChange && !obj.options.isUserContainer) {
								let currentView = mainViewService.getCurrentView();
								if(currentView) {
									if(currentView.ModuleTabViewConfigEntities.some(e => e.Guid === obj.id))
									{
										onColumnStateChanged(obj.id);
									}
								}
							}
							timerSet = null;
						}, 500);

						trigger(obj.instance, obj.instance.onInitialized);
					});
			}
		}

		let elementMousePosition = function(e) {
			let element = $(e.target);
			let offset = element.offset();
			let positions = {
				'right': offset.left + element.outerWidth(),
				'bottom': offset.top + element.outerHeight(),
				'pageX': e.pageX,
				'pageY': e.pageY
			};

			let bottomMin = positions.bottom - 15;
			let bottomMax = positions.bottom + 4;
			let rightMin = positions.right - 15;
			let rightMax = positions.right + 4;

			if (checkMousePosition(positions.pageX, rightMin, rightMax) && checkMousePosition(positions.pageY, bottomMin, bottomMax)) {
				return true;
			} else {
				return false;
			}
		};

		function checkMousePosition (mousePos, min, max) {
			return mousePos >= min && mousePos <= max;
		}

		function getSlickgridContainer(e) {
			return $(e.target).hasClass('slick-cell') ? $(e.target) : $(e.target).parents('.slick-cell');
		}

		function checkCSSClassEditable(e) {
			let element = getSlickgridContainer(e);
			if(element.parents('.modal-body').length < 1 && element.hasClass('editable') && !element.hasClass('column-readonly') && !element.hasClass('cell-readonly') && !element.hasClass('batch-none-allowed')) {
				return true;
			} else {
				return false;
			}
		}

		function checkOptionsAllowBatchCopy(options, e) {
			let element = getSlickgridContainer(e);
			let checkCSS = element.hasClass('editable');

			return (checkCSS && !options.allowBatchCopy) ? true : false;
		}

		function disableBatchCopyPlugin(args) {
			_batchCopyPlugin.disableSelection(args.grid);
			args.grid.unregisterPlugin(_batchCopyPlugin);
		}

		function onMouseEnter(e, args) {
			if(checkCSSClassEditable(e) && elementMousePosition(e) && !args.grid.hasPlugin(_batchCopyPlugin)) {
				console.log('in batchCopyPlugin');
				args.grid.registerPlugin(_batchCopyPlugin);
				_batchCopyPlugin.enableSelection(args.grid);

				e.preventDefault();
				e.stopPropagation();
				e.stopImmediatePropagation();
			} else if(checkOptionsAllowBatchCopy(args.grid.getOptions(), e)) {
				disableBatchCopyPlugin(args);
			}
		}

		function checkIsCellReadOnly(args, i, fieldName) {
			let item = args.grid.getData().getItem(i).__rt$data;
			if(!item.hasOwnProperty('readonly')) {
				return false;
			}
			let isReadOnly = item.readonly.find(o => o.field === fieldName);
			return isReadOnly && isReadOnly.readonly;
		}

		function getRangeInfos(args) {
			let range = args.grid.selectedRange;
			let rowIndex = args.grid.getActiveCell() ? args.grid.getActiveCell().row : range.fromRow;
			let colIndex = args.grid.getActiveCell() ? args.grid.getActiveCell().cell : range.fromCell;
			let selectedColumn = args.grid.getColumns()[colIndex];
			let fieldName = args.grid.getColumns()[colIndex].field;
			return {range, rowIndex, selectedColumn, fieldName};
		}

		function getBatchCopyData(args) {
			let {range, rowIndex, selectedColumn, fieldName} = getRangeInfos(args);
			let batchCopyEntities = [];

			// save the selected grid-rows in an array
			for (let i = range.fromRow; i <= range.toRow; i++) {
				// selected over the grid-content --> fromRow < 0
				if(i > -1 && i !== rowIndex && !checkIsCellReadOnly(args, i, fieldName)) {
					batchCopyEntities.push(args.grid.getData().getItem(i));
				}
			}

			/*
				selectedColumn --> column propertied
				copyValue --> the value of the cell
			 */
			let batchCopyData = {
				selectedColumn: selectedColumn,
				copyValue: args.grid.getData().getItem(rowIndex)[fieldName],
				entities: batchCopyEntities, // For Bulk Editor Enhancement
				gridId: args.grid.id, // For Bulk Editor Enhancement
				type:'copyValue' // For Bulk Editor Enhancement
			};

			return batchCopyData;
		}

		function checkIsBatchCopyValid(args) {
			return args.grid.selectedRange && (args.grid.selectedRange.fromRow !== args.grid.selectedRange.toRow);
		}

		function onBatchCopyComplete(e, args) {
			if(checkIsBatchCopyValid(args)) {
				//DEV-778
				let platformChangeSelectionDialogService = $injector.get ('platformChangeSelectionDialogService');
				platformChangeSelectionDialogService.showDialog ({
					dontShowAgain: true,
					id: '56a6a312879411eeb9d10242ac120002'
				}).then (result => {
					if (result.yes || result.ok) {
						$rootScope.$emit('onBatchCopy', getBatchCopyData(args)); // For Bulk Editor Enhancement

						_batchCopyPlugin.disableSelection(args.grid);
						args.grid.unregisterPlugin(_batchCopyPlugin);
					}
				});
			}
		}

		function onHeaderClick(e, args) {
			var _grid = args.grid;
			if (e.target.id.indexOf('indicator') > -1) {
				if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
					e.preventDefault();
					e.stopImmediatePropagation();
					return;
				}
				var selections = _grid.getSelectedRows();
				var len = _grid.getDataLength();
				if (selections.length > 0 && selections.length !== len) {
					_grid.allSelected = false;
				}
				if (_grid.allSelected) {
					_grid.setSelectedRows([]);
					_grid.allSelected = false;
				} else {
					var rows = [];
					for (var i = 0; i < len; i++) {
						rows.push(i);
					}
					_grid.resetActiveCell();
					_grid.setSelectedRows(rows);
					_grid.allSelected = true;
				}
			}
		}

		function onDragInit(e, args) {
			var isDragDropAllowed = args.grid.getOptions().dragDropAllowed;
			if (isDragDropAllowed || e.shiftKey || e.ctrlKey) {
				// prevent the grid from cancelling drag'n'drop by default
				e.stopImmediatePropagation();
			}
		}

		function onColumnsReordered(e, args) {
			if (isGrouping) {
				isGrouping = false;
				return;
			}
			onColumnStateChanged(args.grid.id);
		}

		function onColumnsResized(e, args) {
			onColumnStateChanged(args.grid.id);
		}

		function onHeaderRowCellRendered(e, args) {
			var grid = gridById(args.grid.id, true);
			if (grid) {
				var func = args.grid.getOptions().renderHeaderRow;
				if (!angular.isUndefined(func)) {
					if (args.column.id === 'indicator') {
						args.node.removeClass('control-icons ico-indicator-search');
					} else {
						func(args);
					}
				} else if (args.grid.getOptions().showFilterRow) {
					platformGridFilterService.initFilterService(grid.scope);
					if (args.node.length > 0) {
						generateFilterRowInternal(grid, args.node[0], args.column);
						if (args.column.id === 'indicator') {
							updateHeaderRowIndicatorIcon(args.grid.id);
						} else {
							if (args.node[0].children.length > 1) {
								bindEventsToColumnFilterInput(grid, args.node[0].children[0], args.node[0].children[1], args.column);
							}
						}
					}
				}
			}
		}

		function onBeforeCellEditorDestroy() {
			$('div > .edit').removeClass('edit');
		}

		function onClick(e, args) {
			if (angular.element(e.target).hasClass('toggle')) {
				var item = args.grid.getData().getItem(args.row);
				if (item) {
					var selected = args.grid.getSelectedRows();
					var selRows = [];

					// Trigger Expanding/Collapsing event
					if (!item.nodeInfo.collapsed) {
						trigger(args.grid, args.grid.onTreeNodeCollapsing, {
							item: item
						});
					} else {
						trigger(args.gride, args.grid.onTreeNodeExpanding, {
							item: item
						});
					}

					args.grid.getData().toggleNode(item);

					// Trigger Expanded/Collapsed event
					if (item.nodeInfo.collapsed) {
						trigger(args.grid, args.grid.onTreeNodeCollapsed, {
							item: item
						});
					} else {
						trigger(args.grid, args.grid.onTreeNodeExpanded, {
							item: item
						});
					}

					if (selected && selected.length > 0) {
						selRows.push(args.row);
					}
					args.grid.resetActiveCell();
					args.grid.setSelectedRows(selRows);
				}
				e.stopImmediatePropagation();
			}
		}

		function processSetBatchCopyAllowed(value) {
			if (_.isNil(value) || (_.isObject(value) && value.hasOwnProperty('Description') && (_.isNil(value.Description) || value.Description === ''))) {
				return false;
			} else {
				return true;
			}
		}

		function isBatchCopyAllowed(args) {
			let {range, rowIndex, selectedColumn, fieldName} = getRangeInfos(args);

			let value = args.grid.getData().getItem(rowIndex)[fieldName];

			$.extend(args.grid.getOptions, {'allowBatchCopy': processSetBatchCopyAllowed(value)});
		}

		function onBeforeEditCell(e, args) {

			isBatchCopyAllowed(args);

			$('div > .edit').removeClass('edit');
			if (!args.column.editor) {
				return false;
			}

			if (args.item && args.item.__rt$data && args.item.__rt$data.readonly) {
				var metadata = args.item.__rt$data.readonly;
				var node = args.grid.getActiveCellNode();

				if ((_.findIndex(metadata, {
					'field': args.column.field,
					'readonly': true
				}) > -1) || $(node).hasClass('pending-validation')) {
					e.stopPropagation();

					return false;
				}
			}

			var indicatorNode = args.grid.getCellNode(args.row, 0);
			if (indicatorNode) {
				indicatorNode.addClass('edit');
			}

			return true;
		}

		/**
		 * @name createGrid
		 * @description Creates grid
		 * @param {object} result Options for grid and dataView
		 */
		function initializeGrid(result) {
			var deferred = $q.defer();
			var obj = result.grid,
				options = result.options.options;

			obj.instance = new slick.Grid(
				obj.domElem,
				obj.dataView,
				obj.columns.visible,
				obj.options
			);

			obj.dataView.setGrid(obj.instance);

			obj.instance.options = options;
			obj.instance._lastSelection = {
				rootNode: null,
				selected: null
			};

			obj.instance.id = obj.id;

			let translate = platformTranslateService.instant('cloud.common.taskBarColumnFilter');

			let infoColHeader = $('<div class="flex-box flex-row"><h4 style="align-content: end;">' + translate.cloud.common.taskBarColumnFilter + '</h4><div data-platform-help-info data-link="cloud.generalfunction" data-section="column-filter"/></div>');
			infoColHeader.appendTo(obj.instance.getHelperInfoRow());
			$compile(infoColHeader)(obj.scope);

			if (obj.options.enableDraggableGroupBy && !obj.options.tree) {
				let gridDropPanelTranslate = platformTranslateService.instant('platform.gridDropPanel');
				obj.options.groupPanelText = gridDropPanelTranslate.platform.gridDropPanel;

				let groupByHeader = $('<div data-platform-help-info data-link="cloud.generalfunction" data-section="grouping"></div><div class="slick-placeholder">' + obj.options.groupPanelText + '</div>');
				groupByHeader.appendTo(obj.instance.getDraggableGroupByPanel());
				$compile(groupByHeader)(obj.scope);

			}


			if (obj.options.showFooter) {
				new Slick.Controls.ExtFooter(obj.dataView, obj.instance, { // jshint ignore:line
					scrollable: true,
					type: 'column',
					template: null
				});
				obj.instance.resizeCanvas();
			}

			if (obj.scope.showFilterRow || obj.options.renderHeaderRow) {
				obj.scope.showMainTopPanel = obj.options.showMainTopPanel = false;
				obj.instance.filterRowVisibility(true);
			} else {
				obj.instance.filterRowVisibility(false);
			}

			if (obj.scope.showMainTopPanel || obj.options.showMainTopPanel) {
				obj.instance.mainTopPanelVisibility(true, obj.scope.searchString);
			} else {
				obj.instance.mainTopPanelVisibility(false, obj.scope.searchString);
			}

			if (obj.scope.markReadonlyCells) {
				$('#' + obj.id).addClass('show-readonly');
			} else {
				$('#' + obj.id).removeClass('show-readonly');
			}

			obj.instance.setSelectionModel(new slick.RowSelectionModel());

			obj.instance.registerPlugin(obj.options.groupItemMetadataProvider);

			obj.instance.registerPlugin(new Slick.AutoColumnSize());

			/* Start Slickgrid Plugins */
			var moveRowsPlugin = new slick.RowMoveManager({
				cancelEditOnDrag: true
			});

			moveRowsPlugin.onBeforeMoveRows.subscribe(function onBeforeMoveRows(e, ddata) {
				for (var i = 0; i < ddata.rows.length; i++) {
					// no point in moving before or after itself
					if (ddata.rows[i] === ddata.insertBefore || ddata.rows[i] === ddata.insertBefore - 1) {
						e.stopPropagation();
						return false;
					}
				}
				return true;
			});

			moveRowsPlugin.onMoveRows.subscribe(function onMoveRows(e, args) {
				var ddata = obj.dataView.getItems();
				var extractedRows = [], left, right, i;
				var rows = args.rows, row;
				var insertBefore = args.insertBefore;
				var selectedRows = [];

				left = ddata.slice(0, insertBefore);
				right = ddata.slice(insertBefore, ddata.length);
				// eslint-disable-next-line func-names
				rows.sort(function (a, b) {
					return a - b;
				});
				for (i = 0; i < rows.length; i++) {
					extractedRows.push(ddata[rows[i]]);
				}
				rows.reverse();
				for (i = 0; i < rows.length; i++) {
					row = rows[i];
					if (row < insertBefore) {
						left.splice(row, 1);
					} else {
						right.splice(row - insertBefore, 1);
					}
				}
				ddata = left.concat(extractedRows.concat(right));
				for (i = 0; i < rows.length; i++) {
					selectedRows.push(left.length + i);
				}
				obj.instance.resetActiveCell();
				obj.instance.setData(ddata);
				obj.instance.setSelectedRows(selectedRows);
				obj.instance.render();
			});

			if (obj.options.allowRowDrag) {
				obj.instance.registerPlugin(moveRowsPlugin);
			}

			obj.instance.registerPlugin(new Slick.CheckboxColumn({
				objectHelper: platformObjectHelper,
				runtimeDataService: platformRuntimeDataService,
				$rootScope: $rootScope,
				$injector: $injector,
				childProp: obj.options.childProp,
				parentProp: obj.options.parentProp,
				propagateCheckboxSelection: obj.options.propagateCheckboxSelection
			}));

			var filterPlugin = new Ext.Plugins.HeaderFilter({}); // jshint ignore:line

			filterPlugin.onCommand.subscribe(function onCommand(e, args) {
				_sortColumn = args.column;
				if (args.command && _sortColumn) {
					obj.instance.sortColumn = _sortColumn;
					obj.instance.sortColumn.ascending = args.command === 'sort-asc';

					switch (args.command) {
						case 'sort-asc':
							if (obj.options.tree) {
								obj.dataView.sortTree(comparer, true, obj.options.childProp);
							} else {
								obj.dataView.sort(comparer, obj.instance.sortColumn);
							}
							break;

						case 'sort-desc':
							if (obj.options.tree) {
								obj.dataView.sortTree(comparer, false, obj.options.childProp);
							} else {
								obj.dataView.sort(comparer, obj.instance.sortColumn);
							}
							break;
					}
				} else {
					if (obj.options.defaultSortColumn) {
						_sortColumn = obj.columns.current.find(x => x.field === obj.options.defaultSortColumn);
						if (_sortColumn) {
							obj.instance.sortColumn = _sortColumn;
							obj.instance.sortColumn.ascending = true;
							if (obj.options.tree) {
								obj.dataView.sortTree(comparer, true, obj.options.childProp);
							} else {
								obj.dataView.sort(comparer, obj.instance.sortColumn);
							}
						}
					}
					else if(obj.options.defaultSortComparer) {
						obj.instance.sortColumn = null;
						// obj.instance.sortColumn.ascending = true;
						if (obj.options.tree) {
							obj.dataView.sortTree(obj.options.defaultSortComparer, true, obj.options.childProp);
						} else {
							obj.dataView.sort(obj.options.defaultSortComparer, obj.instance.sortColumn);
						}
					}
					else {
						obj.instance.sortColumn = null;
					}
				}
				obj.dataView.syncGridSelection(obj.instance, true);
				obj.instance.updateSelection();

				onColumnStateChanged(obj.id);
			});
			obj.instance.registerPlugin(filterPlugin);

			if (obj.instance.getOptions().enableCopyPasteExcel) {
				_copyPastePlugin = new Slick.CopyPasteManager({
					runtimeDataService: platformRuntimeDataService,
					$injector: $injector,
					accounting: accounting,
					contextService: platformContextService,
					languageService: platformLanguageService
				});
				_copyPastePlugin.init(obj.instance);
				if (obj.scope.allowCopySelection) {
					obj.instance.registerPlugin(_copyPastePlugin);
					_copyPastePlugin.enableSelection(obj.instance);
				}
			}

			_batchCopyPlugin = new Slick.BatchCopyManager({});

			obj.instance.registerPlugin(new Slick.AutoTooltips({maxToolTipLength: 800}));

			var columnGroupPlugin = obj.instance.columnGroupPlugin = new Slick.ColumnGroup();

			obj.instance.registerPlugin(columnGroupPlugin);

			columnGroupPlugin.init(obj.instance);
			/* End Slickgrid Plugins */

			/* Start Slickgrid DataView Events */
			obj.dataView.onRowCountChanged.subscribe(function onRowCountChanged() {
				obj.instance.updateRowCount();
				obj.instance.render();

				if (!_groupAction) {
					itemCountChanged(obj.id);
					_itemCountChangedTriggered = true;
				}
			});

			obj.dataView.onRowsChanged.subscribe(function onRowsChanged(e, args) {
				obj.instance.invalidateRows(args.rows);
				obj.instance.render();

				if (_groupAction) {
					_groupAction = false;
					performSelectionAfterGrouping(obj);
					e.stopPropagation();
				} else if (!_groupAction && !_itemCountChangedTriggered) {
					itemCountChanged(obj.id);
				}
				_itemCountChangedTriggered = false;
				_userTriggeredGroupAction = false;

				if(obj.options.cellCssStyleCallBack) {
					var param = {};
					let items = obj.dataView.getRows();
					for (let rowNumber = 0; rowNumber < items.length; rowNumber++) {
						let result = obj.options.cellCssStyleCallBack(items[rowNumber]);
						if (result) {
							param[rowNumber] = result;
						}
					}
					if(!_.isEmpty(param)) {
						setCellCssStyles(obj.id, 'customCss', param);
					}
				}

				if(obj.options.autoHeight) {
						obj.instance.resizeGrid();
				}
			});

			obj.dataView.onGroupItemsChanged.subscribe(function (e, args) {
				if (!_gridConfigChanged) {
					isGrouping = true;
					_groupAction = true;
				} else {
					_gridConfigChanged = false;
				}
				_expandGroup = args.expand;
			});

			obj.dataView.onBeforeGroupingChanged.subscribe(function (e, args) {
				let config = mainViewService.getViewConfig(obj.id);
				if(config && config.Gridconfig) {
					args.columnWidth = config.Gridconfig.groupColumnWidth;
				}
			});

			obj.dataView.onGroupingChanged.subscribe(function onGroupingChanged() {
				if (!_gridConfigChanged) {
					isGrouping = true;
					_groupAction = true;
				} else {
					_gridConfigChanged = false;
				}

				// eslint-disable-next-line func-names
				$timeout(function () {
					onColumnStateChanged(obj.id);
					_groupAction = false;
				}, 0, false);
			});

			obj.dataView.onGroupingStateChanged.subscribe(function onGroupingStateChanged(e, args) {
				if(_isInitialized) {
					if (args.userTriggered && ((args.groupkey  !== null && args.groupkey  !== undefined) || args.sortDirectionChange)) {
						onColumnStateChanged(obj.id);
					}
				}

				_userTriggeredGroupAction = args.userTriggered;
				_groupAction = true;
			});

			/* End Slickgrid DataView Events */

			registerEvent(obj.id, 'onHeaderClick', onHeaderClick);
			registerEvent(obj.id, 'onDragInit', onDragInit);
			registerEvent(obj.id, 'onColumnsReordered', onColumnsReordered);
			registerEvent(obj.id, 'onColumnsResized', onColumnsResized);
			registerEvent(obj.id, 'onHeaderRowCellRendered', onHeaderRowCellRendered);
			registerEvent(obj.id, 'onBeforeCellEditorDestroy', onBeforeCellEditorDestroy);
			registerEvent(obj.id, 'onClick', onClick);
			registerEvent(obj.id, 'onBeforeEditCell', onBeforeEditCell);
			registerEvent(obj.id, 'onBatchCopyComplete', onBatchCopyComplete);
			registerEvent(obj.id, 'onMouseEnter', onMouseEnter);

			function filterTree(nodes, args) {
				for (var i = 0; i < nodes.length; i++) {
					var item = nodes[i];
					result = args.filter(item, args);
					if (args.options.tree && !result) {
						if (item[args.options.childProp] && item[args.options.childProp].length > 0) {
							result = filterTree(item[args.options.childProp], args);
						}
					}
					if (result) {
						break;
					}
				}
				return result;
			}

			function filterTreeColumn(nodes, args, lookupCache) {
				for (var i = 0; i < nodes.length; i++) {
					var item = nodes[i];
					result = filterColumn(item, args, lookupCache);
					if (args.options.tree && !result) {
						if (item[args.options.childProp] && item[args.options.childProp].length > 0) {
							result = filterTreeColumn(item[args.options.childProp], args, lookupCache);
						}
					}
					if (result) {
						break;
					}
				}
				return result;
			}

			function filterColumn(item, args, lookupCache) {
				var value, col, result = false;
				if ((!args.columnFilters || args.columnFilters.length === 0)|| item.Version <= 0) {
					if (args.customFilter) {
						return args.customFilter(item);
					}
					return true;
				} else if (args.columnFilters && args.columnFilters.length > 0) {// For column filter
					var columnFilters = _.get(args, 'columnFilters');

					for (var i = 0; i < columnFilters.length; i++) {
						var columnFilterModel = columnFilters[i];

						if (columnFilterModel.filterString !== '') {
							col = _.find(obj.columns.visible, {id: columnFilterModel.colId});
							if (col) {
								if (col.formatter) {
									value = col.formatter(0, 0, item[col.field], col, item, true, null, {promise: true, filter: true});

									if (platformObjectHelper.isPromise(value)) {
										if (lookupCache && lookupCache[col.id]) {
											var cachedVal = lookupCache[col.id].find(function (o) {
												return o.id === item[col.field];
											});
											if (cachedVal) {
												value = cachedVal.val;
											} else {
												args.promises.push(value);
											}
										} else {
											args.promises.push(value);
										}
									}
								} else {
									value = item[col.field];
								}
								if (col.domain === 'boolean') {
									result = platformGridFilterService.filter(value, columnFilterModel.filterString, col.domain);
								} else {
									let domainType = col.domain ? col.domain : col.editor$name;
									if (!_.isUndefined(columnFilterModel.filters)) {
										result = platformGridFilterService.filter(value, columnFilterModel.filters, domainType);
									} else {
										columnFilterModel.filters = platformGridFilterService.parseQuery(columnFilterModel.filterString, col.field);
										result = platformGridFilterService.filter(value, columnFilterModel.filters, domainType);
									}
								}

								if (!result) {
									break;
								}
							}
						} else {
							result = true;
						}
					}
					if (args.customFilter && result) {
						result = args.customFilter(item);
					}
					if (obj.options.tree && !result) {
						if (item[obj.options.childProp] && item[obj.options.childProp].length > 0) {
							return filterTreeColumn(item[obj.options.childProp], args);
						}
					}
				}
				else {
					result = true;
				}
				return result;
			}

			function filter(item, args) {
				var value, col, result = false;
				if (((!args.columnFilters || args.columnFilters.length === 0) && !args.filterRegex && !args.searchString) || item.Version <= 0) {
					if (args.customFilter) {
						return args.customFilter(item);
					}
					return true;
				} else {
					let filterRegex;

					if (args.searchString) {
						filterRegex = new RegExp(args.searchString, 'i');
					}
					// For search panel filter
					for (var a = 0; a < args.columns.visible.length; a++) {
						col = args.columns.visible[a];
						if (col.id === 'indicator' || !col.searchable) {
							continue;
						}
						if (col.formatter) {
							value = col.formatter(0, 0, item[col.field], col, item, true);
						} else {
							value = item[col.field];
						}
						if (!_.isUndefined(value) && _.isString(value) && args.sanitize(value).search(filterRegex) !== -1) {
							result = true;
							break;
						}
					}
					if (args.customFilter && result) {
						result = args.customFilter(item);
					}
				}

				return result;
			}

			// Process job queue when grid have events
			if (options.events && options.events.size === 0) {
				// noinspection JSUnresolvedFunction
				options.events = new Map();
				_lateBindEvents.forEach(function (item, key) {
					var list = null, eKey = 0;
					_lateBindEvents.get(key).forEach(function (val, eventKey) {
						list = val;
						eKey = eventKey;
					});
					var func;
					var el = {
						list: list,
						func: new Function(['e', 'args'], 'if(args.grid){ delete args.grid; } for(var i = 0; i < this.list.length; i++){ var fn = this.list[i]; if(typeof fn === "function")fn(e,args); } return true;') // jshint ignore:line
					};
					func = el.func;
					func = func.bind(el);
					queue.add({
						id: obj.id,
						key: eKey,
						fn: func,
						type: 'subscribe',
						eventObject: 'instance'
					});
				});
			}

			queue.process(obj);

			obj.dataView.beginUpdate();
			obj.dataView.setItems(options.data || []);
			obj.dataView.setFilterArgs({
				searchString: obj.scope.searchString,
				columnFilters: obj.scope.columnFilters,
				columns: obj.columns,
				filterTree: filterTree,
				filter: filter,
				sanitize: $sanitize,
				options: obj.options,
				_data: obj.dataView.getItems()
			});
			obj.dataView.setColumnFilter(filterColumn);
			obj.dataView.setFilter(filter);
			obj.dataView.endUpdate();
			obj.instance.resizeCanvas();

			deferred.resolve(true);
			return deferred.promise;
		}

		function comparer(a, b) { // jshint ignore:line
			var x, y;
			var result = 0;
			var domain = 'string'; // default
			if (_sortColumn) {
				if (_sortColumn.domain && !_.isFunction(_sortColumn.domain)) { // rei@2.7.18 in some case there is now domain defined, so we take string as default.
					domain = platformDomainList[_sortColumn.domain].datatype;
				}
				var isNumber = _sortColumn.domain ? domain === 'numeric' || domain === 'integer' : false;

				if (_sortColumn.formatter && !isNumber) {
					x = _sortColumn.formatter(0, 0, _.get(a, _sortColumn.field), _sortColumn, a, true, null, {grouping: true});
					y = _sortColumn.formatter(0, 0, _.get(b, _sortColumn.field), _sortColumn, b, true, null, {grouping: true});
				} else {
					x = _.get(a, _sortColumn.field);
					y = _.get(b, _sortColumn.field);
				}

				if (isNumber) {
					result = x - y;
				} else if (!x || x === '') {
					result = 1;
				} else if (!y || y === '') {
					result = -1;
				} else {
					if (_.isString(x) && _.isString(y)) {
						let commonLanguage = platformContextService.getLanguage();
						if(_sortColumn.sortOptions && _sortColumn.sortOptions.numeric) {
							result = x.toLowerCase().localeCompare(y.toLowerCase(), commonLanguage, {numeric: true});
						}
						else
						{
							result = x.toLowerCase().localeCompare(y.toLowerCase(), commonLanguage);
						}
					} else {
						result = (x === y ? 0 : (x > y ? 1 : -1));
					}
				}
			}
			return result;
		}

		function sort(gridId, columnId, direction) {
			let grid = gridById(gridId, false);

			if (!grid || !grid.instance) {
				return;
			}
			_sortColumn = _.find(grid.columns.visible, function (col) {
				return col.id === columnId;
			});

			if (_sortColumn) {
				grid.instance.sortColumn = _sortColumn;
				grid.instance.sortColumn.ascending = direction === 'sort-asc';
				switch (direction) {
					case 'sort-asc':
						if (grid.options.tree) {
							grid.dataView.sortTree(comparer, true, grid.options.childProp);
						} else {
							grid.dataView.sort(comparer, grid.instance.sortColumn);
						}
						break;
					case 'sort-desc':
						if (grid.options.tree) {
							grid.dataView.sortTree(comparer, false, grid.options.childProp);
						} else {
							grid.dataView.sort(comparer, grid.instance.sortColumn);
						}
						break;
				}
				// grid.instance.sortColumn = _sortColumn;
				grid.dataView.syncGridSelection(grid.instance, true);
			}
		}

		/**
		 * @name getFilterOptions
		 * @description Returns the options for filter
		 * @param {string} gridId
		 */
		function getFilterOptions(gridId) {
			let grid = gridById(gridId, false);

			if (!grid || !grid.instance) {
				return;
			}

			var filterOptions = {};
			filterOptions.showFilterRow = grid.scope.showFilterRow;
			filterOptions.showMainTopPanel = grid.scope.showMainTopPanel;

			return filterOptions;
		}

		function getFilterRowProperties() {
			var properties = {};
			properties.height = 33;
			return properties;
		}

		function extendFilterFunction(gridId, func) {
			var grid = gridById(gridId);
			if (grid && grid.dataView) {
				grid.dataView.setFilterExtension(func);
			}
		}

		// Copy of SlickGrid's internal event trigger methodm
		function trigger(gridInstance, evt, args, e) {
			e = e || new Slick.EventData();
			args = args || {};
			args.grid = gridInstance;
			return evt.notify(args, e, gridInstance);
		}

		/**
		 * @name destroyGrid
		 * @param {string} gridId value contains grid id
		 */
		function destroyGrid(gridId) {
			var grid = gridById(gridId);

			if (grid) {
				unregisterEvent(gridId, 'onHeaderClick', onHeaderClick);
				unregisterEvent(gridId, 'onDragInit', onDragInit);
				unregisterEvent(gridId, 'onColumnsReordered', onColumnsReordered);
				unregisterEvent(gridId, 'onColumnsResized', onColumnsResized);
				unregisterEvent(gridId, 'onHeaderRowCellRendered', onHeaderRowCellRendered);
				unregisterEvent(gridId, 'onBeforeCellEditorDestroy', onBeforeCellEditorDestroy);
				unregisterEvent(gridId, 'onClick', onClick);
				unregisterEvent(gridId, 'onBeforeEditCell', onBeforeEditCell);
				unregisterEvent(gridId, 'onMouseEnter', onMouseEnter);

				if (unregisterEvents.get(gridId)) {
					_.over(unregisterEvents.get(gridId))();
					unregisterEvents.delete(gridId);
				}

				if (grid.instance) {
					grid.instance.destroy(true);
				}

				if (grid.scope) {
					platformObjectHelper.cleanupScope(grid.scope);
					grid.scope = null;
				}

				_grids.splice(_.indexOf(_grids, _.find(_grids, function (item) {
					return item.id === gridId;
				})), 1);
			}

			if (timerMaps.length > 0) {
				clearTimeoutMaps(gridId);
			}
		}

		/**
		 * @name clearTimeoutMaps
		 * @description Clear all timeouts and maps.
		 * @param gridId - if provided only clear out timouts for that particular gridId
		 */
		function clearTimeoutMaps(gridId) {
			if(gridId) {
				let timeouts = dataViewTimer.get(gridId);
				if(timeouts) {
					$timeout.cancel(timeouts);
					dataViewTimer.delete(gridId);
				}
			}
			else {
				timerMaps.forEach((map) => {
					if (map.size > 0) {
						map.forEach((mapTimeout) => {
							$timeout.cancel(mapTimeout);
						});
						map.clear();
					}
				});
			}
		}

		/**
		 * @name element
		 * @description Find any element in the _grids Array via an attribute (key) and content (value)
		 * @param  {string} key   Eg. 'id'
		 * @param  {*} [value] Eg. uuid
		 * @return {object}
		 */
		function element(key, value) {
			if (!key || !value) {
				throw new Error('Missing argument');
			}
			return _.find(_grids, [key, value]);
		}

		function registerPlugin(gridId, plugin) {
			var grid = gridById(gridId);

			if (!grid.instance) {
				$timeout(function () {
					// grid.instance.registerPlugin(plugin);
					registerPlugin(gridId, plugin);
				}, 10, true);
			} else {
				grid.instance.registerPlugin(plugin);
			}
		}

		function unregisterPlugin(gridId, plugin) {
			var grid = gridById(gridId);

			if (!grid.instance) {
				$timeout(function () {
					grid.instance.unregisterPlugin(plugin);
				}, 10, true);
			} else {
				grid.instance.unregisterPlugin(plugin);
			}
		}

		/**
		 * @name exist
		 * @param  {value} gridId
		 * @return {boolean}
		 */
		function exist(gridId) {
			return !!gridById(gridId, false);
		}

		function resize(gridId) {
			function operation(grid) {
				if (grid) {
					if (grid.instance) {
						grid.instance.resizeGrid();
					}
				}
			}

			operation(gridById(gridId, false));
		}

		function invalidate(gridId) {
			function operation(grid) {
				if (grid) {
					if (grid.instance) {
						grid.instance.invalidate();
					}
				}
			}

			operation(gridById(gridId, false));
		}

		function invalidateAll() {
			function operation(grid) {
				if (grid) {
					if (grid.instance) {
						grid.instance.invalidate();
					}
				}
			}

			// eslint-disable-next-line func-names
			_.each(_grids, function (grid) {
				operation(grid);
			});
		}

		function commitEdit(gridId) {
			function operation(grid) {
				if (grid) {
					if (grid.instance) {
						grid.instance.getEditorLock().commitCurrentEdit();
					}
				}
			}

			operation(gridById(gridId, false));
		}

		function commitAllEdits() {
			// eslint-disable-next-line func-names
			_.each(_grids, function (grid) {
				if (grid && grid.scope) {
					commitEdit(grid.id);
				}
			});
		}

		function commitCancel(gridId) {
			function operation(grid) {
				if (grid) {
					if (grid.instance) {
						grid.instance.getEditorLock().cancelCurrentEdit();
					}
				}
			}

			operation(gridById(gridId, false));
		}

		function refresh(gridId, invalidate) {
			function operation(grid, invalidate) {
				if (grid) {
					if (grid.instance && grid.dataView) {
						grid.dataView.refresh();
						(invalidate ? grid.instance.invalidate : _.noop)();
					}
				}
			}

			operation(gridById(gridId, false), invalidate);
		}

		function columnGrouping(gridId, enable) {
			function operation(grid, enable) {
				if (grid) {
					if (grid.instance && grid.dataView) {
						grid.instance.columnGroupPlugin[enable ? 'enableColumnGrouping' : 'removeColumnGrouping']();
					}
				}
			}

			operation(gridById(gridId, false), enable);
		}

		function getRows(gridId) {
			let grid = gridById(gridId, false);

			if (grid) {
				return grid.dataView.getRows();
			}
			return null;
		}

		/**
		 * @name addRow
		 * @param {object} options
		 *
		 * @description options = { item: obj, index: row index, gridId: number}
		 */
		function addRow(options) {
			if (!options.gridId || !options.item) {
				throw new Error('Missing arguments');
			}

			function operation(grid, options) {
				if (grid) {
					if (grid.instance && grid.dataView) {
						//commit edit before continuing with adding row
						grid.instance.getEditorLock().commitCurrentEdit();
						var id = angular.isDefined(grid.options.idProperty) ? grid.options.idProperty : 'Id';
						if (!options.index) {
							grid.dataView.addItem(options.item);
							var index = grid.dataView.getIdxById(options.item[id]);
							var groups = grid.dataView.getGroups();
							if (groups.length === 0) {
								grid.instance.setSelectedRows([index]);
								scrollRowIntoViewByItem (options.gridId, options.item, true);
							} else {
								// Expand group with the new item selected
								groups.forEach(function (group) {
									var index = _.findIndex(group.rows, [id, options.item[id]]);
									if (index >= 0) {
										grid.dataView.expandGroup(group);
										if (group.groups && group.groups.length > 0) {
											expandGroupWithSelectedElement(grid, group.groups, options.item, id);
										}
										var currentCell = grid.instance.getActiveCell();
										if (currentCell) {
											grid.instance.setCellFocus(currentCell.row, currentCell.cell, true);
										}
									}
								});
							}
						} else {
							grid.dataView.insertItem(options.index, options.item);
							grid.instance.setSelectedRows([options.index]);
						}
					}
				}
			}

			operation(gridById(options.gridId, false), options);
		}

		/**
		 * @name addRow
		 * @param {object} options
		 *
		 * @description options = { item: obj, index: row index, gridId: number}
		 */
		function appendRows(options) {
			if (!options.gridId || !options.items) {
				throw new Error('Missing arguments');
			}

			function operation(grid, options) {
				if (grid) {
					if (grid.instance && grid.dataView) {
						//commit edit before continuing with adding row
						grid.instance.getEditorLock().commitCurrentEdit();
						var id = angular.isDefined(grid.options.idProperty) ? grid.options.idProperty : 'Id';
						if (!options.index) {
							for (var i = 0; i < options.items.length; i++) {
								grid.dataView.addItem(options.items[i]);
							}
						} else {
							for (var i = 0; i < options.items.length; i++) {
								grid.dataView.insertItem(options.index + i, options.items[i]);
							}
						}
					}
				}
			}

			operation(gridById(options.gridId, false), options);
		}

		function expandGroupWithSelectedElement(grid, groups, item, idProperty) {
			for (var g = 0; g < groups.length; g++) {
				var index = _.findIndex(groups[g].rows, [idProperty, item[idProperty]]);
				if (index >= 0) {
					grid.dataView.expandGroup(groups[g]);
					if (groups[g].groups) {
						expandGroupWithSelectedElement(groups[g].groups, item, idProperty);
					}
				}
			}
		}

		/**
		 * @name refreshRow
		 * @param {object} options
		 *
		 * @description options = { item: obj, index: row index, gridId: number}
		 */
		function refreshRow(options) {
			var grid = gridById(options.gridId, false);

			if (!grid || !grid.instance) {
				return;
			}

			var id = angular.isDefined(grid.options.idProperty) ? grid.options.idProperty : 'Id';

			if (angular.isDefined(options.index)) {
				grid.instance.updateRow(options.index);
			} else {
				grid.instance.updateRow(grid.dataView.getRowById(options.item[id]));
			}
		}

		/**
		 * @name deleteRow
		 * @param  {object} options
		 * options.gridId - grid to delete rows from
		 * options.idProperty
		 * options.rows - rows to be deleted, otherwise selected rows will be deleted
		 * @description Delete rows
		 * @memberOf platformGridAPI.rows
		 */
		function deleteRow(options) {
			var grid = gridById(options.gridId, false);

			if (!grid || !grid.instance) {
				return;
			}

			if (options.rows) {
				if (_.isArray(options.rows)) {
					grid.dataView.beginUpdate();
					_.each(options.rows, function (item) {
						grid.dataView.deleteItem(item[grid.options.idProperty]);
					});
					grid.dataView.endUpdate();
				} else {
					grid.dataView.deleteItem(options.rows[grid.options.idProperty]);
				}
			} else {
				var rows = grid.instance.getSelectedRows();
				var items;
				if (!rows) {
					items = grid.dataView.getItems();
					grid.dataView.deleteItem(items[items.length - 1][grid.options.idProperty]);
				} else {
					grid.dataView.beginUpdate();
					_.each(rows, function (item) {
						items = grid.dataView.getItem(item);
						grid.dataView.deleteItem(items[grid.options.idProperty]);
					});
					grid.dataView.endUpdate();
				}
			}

			grid.instance.setSelectedRows([]);
			grid.instance.invalidate();
		}

		/**
		 * @name selectionRows
		 * @description Select Rows
		 * @param {object} options gridId and rows
		 * @return {object} item
		 */
		function selectionRows(options) {
			let grid = gridById(options.gridId, false);

			if (!grid || !grid.instance) {
				return;
			}
			if (!options.rows) {
				let result;
				let row = grid.instance.getSelectedRows();

				if(row.length > 0) {
					if (options.wantsArray) {
						result = [];
						// eslint-disable-next-line func-names
						_.forEach(row, function (r) {
							result.push(grid.dataView.getItem(r));
						});
					}
					else {
						result = grid.dataView.getItem(row[0]);
					}
				}

				return result;
			} else {
				let selectRows = [];
				let rowIndex;
				let rows = grid.dataView.getRows();
				// eslint-disable-next-line func-names
				_.each(options.rows, function (item) {
					if (_.isNumber(item)) {
						selectRows.push(item);
					} else if (grid.options.idProperty) {
						// eslint-disable-next-line func-names
						rowIndex = _.findIndex(rows, function (row) {
							return row[grid.options.idProperty] === item[grid.options.idProperty];
						});
						if (rowIndex >= 0) {
							selectRows.push(rowIndex);
						}
					} else {
						// eslint-disable-next-line func-names
						rowIndex = _.findIndex(rows, function (row) {
							return row.Id === item.Id;
						});
						if (rowIndex >= 0) {
							selectRows.push(rowIndex);
						}
					}
				});
				if (selectRows.length > 0) {
					grid.instance.setSelectedRows(selectRows);
				}
				if (selectRows.length) {
					grid.instance.scrollRowIntoView(selectRows[0]);
				}
				if (options.nextEnter && selectRows.length === 1) {
					grid.instance.setActiveCell(selectRows[0], options.nextEnter);
				} else if (options.nextEnter) {
					grid.instance.setActiveCell(options.nextEnter);
				} else if (options.activeCell) {
					grid.instance.setActiveCell(options.activeCell);
				}

				selectRows.length = 0;
			}
		}

		/**
		 * @name addCssClass
		 * @param {object} options
		 * @description options = { items: array, gridId: string, cssClass: string}
		 */
		function addCssClass(options) {
			var grid = gridById(options.gridId, false);

			if (options.items.length > 0) {
				// eslint-disable-next-line func-names
				angular.forEach(options.items, function (item) {
					grid.dataView.setItemMetaData(item, options);
				});
			}
			grid.instance.invalidate();
		}

		function setGrouping(gridId, columnName, initial, ignoreToggle, columnWidth) {
			let grid = gridById(gridId, false);

			if (initial && grid && grid.dataView) {
				_isInitialized = false;
				grid.dataView.setInitialGrouping(columnName, columnWidth);
			} else if (grid && grid.dataView) {
				grid.dataView.setGrouping(columnName, columnWidth);
			}
			if (!ignoreToggle && grid.instance) {
				if (!columnName.length && grid.instance.groupPanelVisibility(false)) {
					toggleGroupPanel(gridId, false);
				} else if (columnName.length && !grid.instance.groupPanelVisibility(true)) {
					toggleGroupPanel(gridId, true);
				}
			}
		}

		function getGrouping(gridId) {
			let grid = gridById(gridId, false);

			return grid.dataView.getGrouping();
		}

		/**
		 * @name editableRows
		 * @description Set rows readonly and vice versa
		 * @param  {object} options  {gridId: uuid, readOnly: true/false}
		 */
		function editableRows(options) {
			var grid = gridById(options.gridId, false);

			if (options.readOnly) {
				grid.cell.cell = false;
				if (!contains(
					grid.config.readOnly,
					{row: grid.cell.row, cell: false}
				)) {
					grid.config.readOnly.push(grid.cell);
				}
			} else {
				grid.config.readOnly.splice(
					_.indexOf(grid.config.readOnly, _.find(
						grid.config.readOnly,
						// eslint-disable-next-line func-names
						function (item) {
							return item.cell === false && item.row === grid.cell.row;
						})), 1);
			}
			grid.instance.invalidate();
		}

		/**
		 * @name invalidateRows
		 * @param  {uuid} gridId
		 * @param  {array} items
		 */
		function invalidateRows(gridId, items) {
			function operation(grid, items) {
				if (grid) {
					if (grid.instance) {
						if (!items) {
							grid.instance.invalidate();
						} else {
							if (_.isArray(items)) {
								grid.instance.invalidateRows(items);
							} else {
								if (!isNaN(items)) {
									grid.instance.invalidateRow(items);
								}
							}
							grid.instance.render();
						}
					}
				}
			}

			operation(gridById(gridId, false), items);
		}

		/**
		 * Grid scroll method
		 * @param  {string} gridId Grid unique uuid
		 * @param  {string} key Flag for 'top'. scrollToView is the default
		 * @param  {*} value Row id
		 */
		function scrollRows(gridId, key, value) {
			function operation(grid, key, value) {
				if (grid) {
					if (grid.instance) {
						if (key === 'top') {
							grid.instance.scrollRowToTop(value);
						} else {
							grid.instance.scrollRowIntoView(value);
						}
					}
				}
			}

			operation(gridById(gridId, false), key, value);
		}

		/**
		 *
		 * @param parentId
		 * @param items
		 * @param grid
		 * @returns {*}
		 */
		function findParent(parentId, items, grid) {
			var id = angular.isDefined(grid.options.idProperty) ? grid.options.idProperty : 'Id';
			var parent;
			for (var i = 0; i < items.length; i++) {
				if (items[i][id] === parentId) {
					parent = items[i];
				} else if (items[i][grid.options.childProp]) {
					parent = findParent(parentId, items[i][grid.options.childProp], grid);
				}
				if (parent) {
					break;
				}
			}
			return parent;
		}

		function scrollRowIntoViewByItem(gridId, item, forceEdit) {
			if (_.isUndefined(forceEdit)) {
				forceEdit = _forceEdit;
			}
			if (!item) {
				console.warn('platformgrid.service function scrollRowIntoViewByItem needs an item to work otherwise nothing will happen.');
				return;//
			}
			let grid = gridById(gridId, false);

			if (!grid || !grid.instance) {
				return;
			}
			let id = angular.isDefined(grid.options.idProperty) ? grid.options.idProperty : 'Id';
			let row = grid.dataView.getRowById(item[id]);
			if (!row && grid.options.tree) {
				let items = grid.dataView.getItems();
				let parent = findParent(item[grid.options.parentProp], items, grid);
				while (parent) {
					parent.nodeInfo.collapsed = true;
					expandNode(gridId, parent);
					parent = findParent(parent[grid.options.parentProp], items, grid);
				}
				row = grid.dataView.getRowById(item[id]);
			}
			let cell = 0;
			for (let i = 0; i < grid.columns.visible.length; i++) {
				if (grid.columns.visible[i].editor && (grid.columns.visible[i].keyboard && grid.columns.visible[i].keyboard.enter)) {
					cell = i;
					break;
				}
			}
			grid.instance.gotoCell(row, cell, forceEdit);
		}

		/**
		 *
		 * @param gridId
		 * @param node
		 */
		function expandNode(gridId, node) {
			let grid = gridById(gridId, false);

			if (!grid || !grid.instance) {
				return;
			}
			if (node) {
				grid.dataView.expandNode(node);
			} else {
				let rows = grid.instance.getSelectedRows();
				if (rows.length) {
					grid.dataView.expandNode(grid.dataView.getItem(rows[0]));
				}
			}
		}

		/**
		 *
		 * @param gridId
		 * @param node
		 */
		function collapseNode(gridId, node) {
			let grid = gridById(gridId, false);

			if (!grid || !grid.instance) {
				return;
			}

			if (node) {
				grid.dataView.collapseNode(node);
			} else {
				let rows = grid.instance.getSelectedRows();
				if (rows.length) {
					grid.dataView.collapseNode(grid.dataView.getItem(rows[0]));
				}
			}
		}

		function expandNextNode(gridId, node) {
			let grid = gridById(gridId, false);
			let idProperty = grid.options.idProperty ? grid.options.idProperty : 'Id';

			if (!grid || !grid.instance) {
				return;
			}
			if (node) {
				grid.dataView.expandNextLevel(node);
			} else {
				let rows = grid.instance.getSelectedRows();
				let selectedRows = [];
				let selectedIndexes = [];
				rows.forEach(function(selectedIndex) {
					selectedRows.push(grid.dataView.getItem(selectedIndex));
				});
				selectedRows.forEach(function(item) {
					grid.dataView.expandNextLevel(item);
				});
				selectedRows.forEach(function(item) {
					selectedIndexes.push(grid.dataView.getIdxById(item[idProperty]));
				});
				grid.instance.setSelectedRows(selectedIndexes, true);
			}
		}

		function collapseNextNode(gridId, node) {
			let grid = gridById(gridId, false);
			let idProperty = grid.options.idProperty ? grid.options.idProperty : 'Id';

			if (!grid || !grid.instance) {
				return;
			}

			if (node) {
				grid.dataView.collapseNextLevel(node, true);
			} else {
				let rows = grid.instance.getSelectedRows();
				let selectedRows = [];
				let selectedIndexes = [];
				rows.forEach(function(selectedIndex) {
					selectedRows.push(grid.dataView.getItem(selectedIndex));
				});
				selectedRows.forEach(function(item) {
					grid.dataView.collapseNextLevel(item, true);
				});
				selectedRows.forEach(function(item) {
					selectedIndexes.push(grid.dataView.getIdxById(item[idProperty]));
				});
				grid.instance.setSelectedRows(selectedIndexes, true);
			}
		}

		function collapseAllNodes(gridId) {
			let grid = gridById(gridId, false);

			grid.dataView.collapseAllNodes();
		}

		/**
		 *
		 * @param gridId
		 */
		function expandAllNodes(gridId) {
			function operation(grid) {
				if (grid) {
					if (grid.dataView) {
						grid.dataView.expandAllNodes();
					}
				}
			}

			operation(gridById(gridId, false));
		}

		/**
		 *
		 * @param gridId
		 * @param node
		 */
		function collapseAllSubNodes(gridId, node) {
			let grid = gridById(gridId, false);

			if (!grid || !grid.instance) {
				return;
			}

			if (!node) {
				let rows = grid.instance.getSelectedRows();
				if (rows.length > 0) {
					let selectedRows = [];
					rows.forEach(function(selectedIndex) {
						selectedRows.push(grid.dataView.getItem(selectedIndex));
					});
					if(selectedRows.length === grid.dataView.getRows().length){
						grid.dataView.collapseAllNodes();
					}
					else {
						selectedRows.forEach(function(item) {
							grid.dataView.collapseAllSubNodes(item);
						});
					}
					selectionRows({gridId: gridId, rows: selectedRows});
				}
				else {
					grid.dataView.collapseAllNodes();
				}
			} else {
				grid.dataView.collapseAllSubNodes(node);
			}
		}

		/**
		 *
		 * @param gridId
		 * @param node
		 */
		function expandAllSubNodes(gridId, node) {
			let grid = gridById(gridId, false);

			if (!grid || !grid.instance) {
				return;
			}

			if (!node) {
				let rows = grid.instance.getSelectedRows();
				if (rows.length > 0) {
					let selectedRows = [];
					rows.forEach(function(selectedIndex) {
						selectedRows.push(grid.dataView.getItem(selectedIndex));
					});
					selectedRows.forEach(function(item) {
						grid.dataView.expandAllSubNodes(item);
					});
					selectionRows({gridId: gridId, rows: selectedRows});
				}
				else {
					grid.dataView.expandAllNodes();
				}
			} else {
				grid.dataView.expandAllSubNodes(node);
			}
		}

		/**
		 * Collapse all groups in the grid
		 * @param gridId
		 */
		function collapseAllGroups(gridId) {
			let grid = gridById(gridId, false);

			if (!grid || !grid.instance) {
				return;
			}

			grid.dataView.collapseAllGroups();
		}

		/**
		 * Expand all groups in the grid
		 * @param gridId
		 */
		function expandAllGroups(gridId) {
			let grid = gridById(gridId, false);

			if (!grid || !grid.instance) {
				return;
			}

			grid.dataView.expandAllGroups();
		}

		/**
		 * Collapse specific group in the grid
		 * @param gridId
		 */
		function collapseGroup(gridId) {
			let grid = gridById(gridId, false);

			if (!grid || !grid.instance) {
				return;
			}

			var groups = getGrouping(gridId);
			var groupItems = grid.dataView.getGroups();

			for (var i = groups.length - 1; i >= 0; i--) {
				if (!isGroupCollapsedAll(groupItems, i)) {
					grid.dataView.collapseAllGroups(i);
					break;
				}
			}
		}

		/**
		 * Expand specific group in the grid
		 * @param gridId
		 */
		function expandGroup(gridId) {
			let grid = gridById(gridId, false);

			if (!grid || !grid.instance) {
				return;
			}

			var groups = getGrouping(gridId);
			var groupItems = grid.dataView.getGroups();

			for (var i = 0; i < groups.length; i++) {
				if (!isGroupExpandedAll(groupItems, i)) {
					grid.dataView.expandAllGroups(i);
					break;
				}
			}
		}

		function isGroupExpandedAll(groups, level) {
			var result = true;
			for (var i = 0; i < groups.length; i++) {
				if (groups[i].level === level) {
					if (groups[i].collapsed) {
						result = false;
						break;
					}
				} else if (!isGroupExpandedAll(groups[i].groups, level)) {
					result = false;
					break;
				}
			}
			return result;
		}

		function isGroupCollapsedAll(groups, level) {
			var result = true;
			for (var i = 0; i < groups.length; i++) {
				if (groups[i].level === level) {
					if (!groups[i].collapsed) {
						result = false;
						break;
					}
				} else if (!isGroupCollapsedAll(groups[i].groups, level)) {
					result = false;
					break;
				}
			}
			return result;
		}

		/**
		 *
		 * @returns {boolean}
		 */
		function editableCol() {
			$log.info('PlatformGridAPI : Method editable not implemented. Use the grid configuration');
			return false;
		}

		function getCurrentColumns(gridId) {
			var grid = gridById(gridId, true);

			if (grid && grid.instance) {
				return grid.instance.getColumns();
			}
		}

		function autofitColumnsToContent(gridId) {
			let grid = gridById(gridId, false);
			if (grid && grid.instance) {
				grid.instance.getPluginByName('AutoColumnSize').resizeAllColumns();
			}
		}

		/**
		 * @name processCurrentColumns
		 * @description Insert the hidden columns into the current column order.
		 *
		 * @param  {object} grid
		 * @return {array}  The current columns with the hidden columns
		 */
		function processCurrentColumns(grid) {
			var origin = angular.copy(grid.columns.current);
			var visible = grid.columns.visible;// angular.copy causes error...cannot copy windows or scope
			var statusCols = _.filter(origin, function (col) {
				return col.id === 'indicator' || col.id === 'tree' || col.id === 'marker' || col.id === 'group';
			});
			visible = _.filter(visible, function (col) {
				return col.id !== 'indicator' && col.id !== 'tree' && col.id !== 'marker' && col.id !== 'group';
			});
			origin = _.filter(origin, function (col) {
				return col.id !== 'indicator' && col.id !== 'tree' && col.id !== 'marker' && col.id !== 'group';
			});
			var last = visible.length - 1;
			for (var i = 0; i < visible.length; i++) {

				if (visible[i].id === 'indicator') {
					continue;
				}
				var idx = _.findIndex(origin, {id: visible[i].id});
				var pidx = i > 0 ? _.findIndex(origin, {id: visible[i - 1].id}) : -1;
				var nidx = i < visible.length - 1 ? _.findIndex(origin, {id: visible[i + 1].id}) : -1;
				if (idx > nidx && nidx !== -1 && pidx !== -1) {
					origin.move(idx, pidx + 1);
				} else if (pidx === -1 && idx > nidx) {
					origin.move(idx, nidx);
				} else if (pidx < nidx && idx < pidx) {
					origin.move(idx, pidx);
				} else if (nidx === -1 && idx < pidx) {
					origin.move(idx, last);
				}
			}
			for (i = statusCols.length - 1; i > -1; i--) {
				origin.unshift(statusCols[i]);
			}
			return origin;
		}

		/**
		 * @name configuration
		 * @description Sets the columns definition or get the current columns object
		 * @param  {string} gridId
		 * @param  {array} [columns]
		 * @return {object} { origin, current, visible, hidden }
		 */
		function configuration(gridId, columns) { // jshint ignore:line
			function operation(grid, columns) {
				if (grid) {
					if (grid.instance) {
						if (columns && columns.length > 0) {

							if (grid.processColumns) {
								grid.columns = columns;
								grid.columns = grid.processColumns(grid);
							}
							grid.instance.setColumns(grid.columns.visible);
							updateHeaderRowIndicatorIcon(gridId);
						} else {
							grid.columns.visible = grid.instance.getColumns();
							grid.columns.current = processCurrentColumns(grid);
							return grid.columns;
						}
					}
				}
			}

			return operation(gridById(gridId, false), columns);
		}

		/**
		 *
		 * @param gridId
		 */
		function resetColumns(gridId) {
			var grid = gridById(gridId, true);
			var cols = _.filter(grid.columns.current, function (col) {
				return col.hidden === true;
			});
			if (cols) {
				_.forEach(cols, function (col) {
					col.hidden = false;
				});
			}
			grid.instance.setColumns(grid.columns.current);
		}

		/**
		 *
		 * @returns {boolean}
		 */
		function selectionItems() {
			$log.info('PlatformGridAPI : Method selectionItems not implemented. Use the grid configuration');
			return false;
		}

		/**
		 * @ngdoc function
		 * @name items.invalidateItems
		 * @function
		 * @methodOf PlatformGridAPI
		 * @description
		 * @param gridId {uuid} grid's uuid
		 * @param  items {object|array} items to be invalidated
		 */
		function invalidateItems(gridId, items) {
			var grid = gridById(gridId, true);
			var rows;
			var id = grid.options.idProperty || 'Id';
			if (_.isArray(items)) {
				rows = _.map(items, function (item) {
					return grid.dataView.getRowById(item[id]);
				});
			} else {
				rows = [grid.dataView.getRowById(items[id])];
			}
			invalidateRows(gridId, rows);
		}

		/**
		 * @name dataView
		 * @description Getter/Setter of the data in the grid
		 *
		 * @param  {string} gridId
		 * @param data
		 * @return {array}         Items from the dataView
		 */
		function dataView(gridId, data) {
			function operation(grid, data) {
				if (grid) {
					if (grid.instance) {
						if (!data) {
							return grid.dataView.getItems();
						} else if (grid.lazyInit && !grid.instance) {
							setTimeout(function () {
								grid.instance.resetActiveCell();
								grid.instance.setSelectedRows([]);
								grid.dataView.setItems(data, grid.options.idProperty);
								grid.instance.invalidate();
							}, 52);
						} else if (grid.instance) {
							grid.instance.resetActiveCell();
							grid.instance.setSelectedRows([]);
							grid.dataView.setItems(data, grid.options.idProperty);
							grid.instance.invalidate();
						}
						if (grid.instance) {
							if (grid.options.enableColumnSort && grid.scope.sortColumn) {
								_sortColumn = grid.scope.sortColumn;
								grid.instance.setSortColumn(grid.scope.sortColumn.id, grid.scope.sortColumn.ascending);
								sort(gridId, _sortColumn.id, grid.scope.sortColumn.ascending ? 'sort-asc' : 'sort-desc');
							}
						}
					} else {
						if (!data) {
							// ALM 125662
							return null;
						}

						if (dataViewTimer.get(gridId)) {
							$timeout.cancel(dataViewTimer.get(gridId));
						}
						let gridTimeout = $timeout(function () {
							operation(grid, data);
							grid = null;
						}, 0);
						dataViewTimer.set(gridId, gridTimeout);
					}
				}
			}

			return operation(gridById(gridId, false), data);
		}

		/**
		 *
		 */
		function getDataitemForCell(gridId, item, columnDef) {
			let grid = gridById(gridId, false);

			if (!grid && !grid.instance) {
				return;
			}
			return grid.instance.getDataItemValueForColumn(item, columnDef);
		}

		/**
		 * Return list of filtered items from grid
		 * @param gridId
		 */
		function getFilteredItems(gridId) {
			let grid = gridById(gridId, false);

			if (!grid && !grid.dataView) {
				return;
			}
			return grid.dataView.getRows();
		}

		/**
		 *
		 * @param options
		 */
		function selectionCells(options) {
			var grid = gridById(options.gridId, false);

			if (!grid && !grid.instance) {
				return;
			}
			if (!options.rows) {
				var row = grid.instance.getSelectedRows();
				options.rows = [grid.dataView.getItem(row)];
			}
			var selectRows = [];
			// eslint-disable-next-line func-names
			_.each(options.rows, function (item) {
				if (item) {
					if (_.isNumber(item)) {
						selectRows.push(item);
					} else if (grid.options.idProperty) {
						selectRows.push(grid.dataView.getIdxById(item[grid.options.idProperty]));
					} else {
						selectRows.push(grid.dataView.getIdxById(item.Id));
					}
				}
			});
			if (!selectRows.length) {
				selectRows.push(0);
			}
			grid.instance.setSelectedRows(selectRows);
			if (options.cell === null || angular.isUndefined(options.cell)) {
				var activeCell = grid.instance.getActiveCell() ? grid.instance.getActiveCell().cell : null;
				if (!activeCell) {
					options.cell = 0;
					for (var i = 0; i < grid.columns.visible.length; i++) {
						if (grid.columns.visible[i].editor) {
							options.cell = i;
							break;
						}
					}
				} else {
					options.cell = activeCell;
				}
			}
			grid.instance.setCellFocus(selectRows, options.cell, options.forceEdit);
		}

		/**
		 *
		 * @param options
		 */
		function editableCells(options) {
			if (!options.item.__rt$data.readonly) {
				options.item.__rt$data.readonly = [];
			}
			var readonlyObj = {
				'field': options.field,
				'readonly': true
			};
			var idx = _.findIndex(options.item.__rt$data.readonly, {
				'field': options.field,
				'readonly': true
			});
			if (idx > -1) {
				options.item.__rt$data.readonly.splice(idx, 1);
			} else {
				options.item.__rt$data.readonly.push(readonlyObj);
			}
		}

		/**
		 *
		 * @param gridId
		 * @param cells2Merge
		 * @param item
		 */
		function mergeCells(gridId, cells2Merge, item, mergeCellResult) {
			var grid = gridById(gridId, true);
			if (!item.__rt$data.grid || _.isNull(item.__rt$data.grid)) {
				item.__rt$data.grid = {};
			}
			if (mergeCellResult && mergeCellResult.resultField && cells2Merge.length > 0) {
				var resultCol = grid.columns.current.find(col => col.id === mergeCellResult.resultField);
				if (resultCol.hidden && mergeCellResult.makeVisible) {
					resultCol.hidden = false;
					if (grid.processColumns) {
						grid.columns = grid.columns.current;
						grid.columns = grid.processColumns(grid);
					}
				}

				var resultIndex = grid.columns.visible.findIndex(col => col.id === mergeCellResult.resultField);
				var colToMove = grid.columns.visible[resultIndex];
				if(resultIndex > 0) {
					grid.columns.visible.splice(resultIndex, 1);
					var startIndex = grid.columns.visible.findIndex(col => col.id === cells2Merge[0].colid);
					if (startIndex + cells2Merge[0].colspan >= grid.columns.visible.length) {
						cells2Merge[0].colspan = grid.columns.visible.length - startIndex;
					}

					grid.columns.visible.splice(startIndex + cells2Merge[0].colspan, 0, colToMove);
					grid.instance.setColumns(grid.columns.visible);
				}
			}

			var options = {
				mergedCells: cells2Merge
			};

			grid.dataView.setItemMetaData(item, options);
		}

		/**
		 * @callback eventCallback
		 * @param  {object} element - Value of array element
		 * @param  {number} index   - Index of array element
		 * @param  {Array}  array   - Array itself
		 */

		var regGridEvents = registerGridEvents;
		var unregGridEvents = unregisterGridEvents;

		// Events
		/**
		 * Register Event
		 * @param  {string}   gridId  Grid uuid
		 * @param  {string}   key     Event
		 * @param  {eventCallback} fn Event function
		 **/
		function registerEvent(gridId, key, fn) {
			// eslint-disable-next-line func-names
			if (!_.find(_dataViewEvents, function (item) {
				return item === key;
			})) {
				regGridEvents(key, fn, gridId);
			} else {
				registerDataViewEvent(key, fn, gridId);
			}
		}

		/**
		 * Unregister Event
		 * @param  {string}   gridId  Grid uuid
		 * @param  {string}   key     Event
		 * @param  {function} fn      Event function
		 **/
		function unregisterEvent(gridId, key, fn) {
			// eslint-disable-next-line func-names
			if (!_.find(_dataViewEvents, function (item) {
				return item === key;
			})) {
				unregGridEvents(key, fn, gridId);
			} else {
				unregisterDataViewEvent(key, fn, gridId);
			}
		}

		/**
		 * Register Grid Events
		 * @param  {string}   key     Event
		 * @param  {function} fn      Event function
		 * @param  {string}   gridId  Grid uuid
		 **/
		function registerGridEvents(key, fn, gridId) {
			if (!key || !fn || !gridId) {
				throw new Error('registerGridEvent: Missing argument');
			}
			if (typeof fn !== 'function' && typeof key !== 'string') {
				throw new Error('registerGridEvent: Method need a string and function.');
			}
			if (!_.includes(_gridEvents, key)) {
				throw new Error('registerGridEvent: ' + key + ' Event do not exist');
			}
			let grid = gridById(gridId, false);
			if (!grid || !grid.instance) {
				queue.add({
					id: gridId,
					key: key,
					fn: fn,
					type: 'subscribe',
					eventObject: 'instance'
				});
			} else {
				grid.instance[key].subscribe(fn);
			}
		}

		/**
		 * Unregister Grid Events
		 * @param  {'string'} key     Event
		 * @param  {Function} fn      Event function
		 * @param  {Number}   gridId  Grid uuid
		 **/
		function unregisterGridEvents(key, fn, gridId) {
			let grid = gridById(gridId, false);

			if (grid && grid.instance) {
				grid.instance[key].unsubscribe(fn);
			} else {
				queue.remove(gridId, key);
			}
		}

		/**
		 * Register DataView Event
		 * @param  {string} key     Event
		 * @param  {Function} fn      Event function
		 * @param  {string}   gridId  Grid uuid
		 */
		function registerDataViewEvent(key, fn, gridId) {
			if (!key || !fn) {
				throw new Error('registerGridEvent: Missing argument');
			}
			if (typeof fn !== 'function' && typeof key !== 'string') {
				throw new Error('registerGridEvent: Method need a string and function.');
			}
			if (!_.includes(_dataViewEvents, key)) {
				throw new Error('registerGridEvent: ' + key + ' Event do not exist');
			}
			var grid = gridById(gridId, true);

			if (!grid.instance) {
				queue.add({
					id: gridId,
					key: key,
					fn: fn,
					type: 'subscribe',
					eventObject: 'dataView'
				});
			} else {
				// noinspection TypeScriptValidateTypes
				grid.dataView[key].subscribe(fn);
			}
		}

		/**
		 * Unregister DataView Events
		 * @param  {string} key Event name
		 * @param  {Function} fn Event function
		 * @param  {string} gridId Grid's uuid
		 *
		 **/
		function unregisterDataViewEvent(key, fn, gridId) {
			let grid = gridById(gridId, false);

			if (grid && grid.dataView && key) {
				// noinspection TypeScriptValidateTypes
				grid.dataView[key].unsubscribe(fn);
			} else {
				queue.remove(gridId, key);
			}
		}

		/**
		 * @name contains
		 * @description Search for a object in an array
		 *
		 * @param  {array} array
		 * @param  {object} obj
		 * @return {boolean}
		 */
		function contains(array, obj) {
			return !!_.find(array, obj);
		}

		function getFilterInfo(gridID) {
			var filterInfo = {};
			var grid = gridById(gridID, true);

			if (grid.instance) {
				var rowCount = grid.instance.getDataLength();
				var rowCountMax = grid.dataView.getItems().length;

				var currentColumnFilter = grid.scope.columnFilters.filter(function (e) {
					return e.filterString !== '';
				});

				if (currentColumnFilter.length > 0) {
					filterInfo = {
						hasFilter: true,
						filterInfo: currentColumnFilter,
						rowCount: rowCount,
						rowCountMax: rowCountMax,
						rowCountText: rowCount + '/' + rowCountMax
					};
				} else if (!angular.isUndefined(grid.scope.searchString) && grid.scope.searchString !== '') {
					filterInfo = {
						hasFilter: true,
						filterInfo: grid.scope.searchString,
						rowCount: rowCount,
						rowCountMax: rowCountMax,
						rowCountText: rowCount + '/' + rowCountMax
					};
				} else {
					filterInfo = {
						hasFilter: false,
						rowCount: rowCount,
						rowCountMax: rowCountMax,
						rowCountText: rowCount + '/' + rowCountMax
					};
				}
			}

			return filterInfo;
		}

		function updateFilter(gridID, filterString, $element) {
			var grid = gridById(gridID, true);

			grid.scope.searchString = filterString;

			var selection = _.map(grid.instance.getSelectedRows() || [], function (row) {
				return grid.dataView.getItem(row);
			}, []);
			grid.instance.toggleOverlay(true);

			if (!_.isUndefined(filterString) && filterString.length) {
				grid.instance.getEditorLock().commitCurrentEdit();
				grid.instance.resetActiveCell();

				// Fix for defect 88062 - Container-Search with starting '*'
				filterString = filterString.replace('*', '');
			}

			grid.dataView.setFilterArgs({
				searchString: filterString,
			});

			//grid.filterRegex = new RegExp(filterString, 'i');
			grid.columnFilters = undefined;

			setTimeout(function () {
				_forceEdit = false;

				performSelectionAfterFilter(grid, selection);
				grid.instance.toggleOverlay(false);

				$timeout(function () {
					if ($element) {
						$($element).focus();
					}
				}, 0);

			}, 0);
			updateHeaderRowIndicatorIcon(gridID);
		}

		/**
		 * Filter method for column header filter
		 * @param gridId
		 * @columnFilters
		 */
		function updateHeaderFilter(gridID, columnFilters, $element) {
			let grid = gridById(gridID, false);
			if (grid) {

				var selection = _.map(grid.instance.getSelectedRows() || [], function (row) {
					return grid.dataView.getItem(row);
				}, []);

				grid.instance.toggleOverlay(true);

				grid.dataView.setFilterArgs({
					columnFilters: columnFilters
				});

				grid.columnFilters = columnFilters;

				$timeout(function () {

					_forceEdit = false;

					performSelectionAfterFilter(grid, selection);

					grid.instance.toggleOverlay(false);

					if ($element) {
						$timeout(function () {
							$element.focus();
							if ($element.nodeName.toLowerCase() === 'input') {
								var strLength = $element.value.length * 2;
								$element.setSelectionRange(strLength, strLength);
							}
						}, 0);
					}

				}, 0);
				updateHeaderRowIndicatorIcon(gridID);
			}
		}

		function assignSelectedItemstoGroups(grid, selectedItems) {
			let groups = grid.dataView.getGroups();

			if (selectedItems && selectedItems.length > 0) {
				if (groups && groups.length > 0) {
					for (var i = 0; i < groups.length; i++) {
						groups[i].selectedRows = [];
						var rows = _.intersectionBy(groups[i].rows, selectedItems, grid.options.idProperty);

						if (rows) {
							groups[i].selectedRows = rows;
							if (!_isInitialized && rows.length > 0) {
								_isInitialized = true;
							}
						}
					}
				}
				else {
					let selectedIndexes = [];
					selectedItems.forEach( function (item) {
						let index = grid.dataView.getRows().indexOf(item);
						if(index > -1) {
							selectedIndexes.push(index);
						}
					});
					grid.instance.setSelectedRows(selectedIndexes, true);
				}
			}
		}

		function performSelectionAfterGrouping(grid) {
			$rootScope.$broadcast('getSelectedItems', grid.id);

			let groups = grid.dataView.getGroups();
			if (groups && groups.length > 0) {
				let rows = grid.dataView.getRows();
				let selectedItems = [];
				let selectedIndex = [];
				grid.instance.resetActiveCell();
				// performance
				// grid.instance.clearSelectedRows();
				for (let g = 0; g < groups.length; g++) {
					if (groups[g].selectedRows.length > 0) {
						if (groups[g].collapsed === 1) {
							if (_expandGroup) {
								grid.dataView.expandGroup(groups[g]);
								_expandGroup = false;
								return;
							} else {
								selectedItems.push(groups[g]);
							}
						} else if (groups[g].groups) {
							iterateThroughGroups(groups[g].groups, selectedItems, groups[g].selectedRows, grid.options.idProperty);
						}
						for (let s = 0; s < groups[g].selectedRows.length; s++) {
							selectedItems.push(groups[g].selectedRows[s]);
						}
					}
				}

				_.forEach(selectedItems, function (item) {
					var index = -1;
					if (item instanceof Slick.Group) {
						index = _.findIndex(rows, {'value': item.value, 'count': item.count, 'title': item.title});
					} else {
						index = _.findIndex(rows, [grid.options.idProperty, item[grid.options.idProperty]]);
					}
					if (index >= 0) {
						selectedIndex.push(index);
					}
				});
				grid.instance.setSelectedRows(selectedIndex, true);
			}
			else {

			}
			if(!_userTriggeredGroupAction) {
				grid.instance.updateSelection();
			}
		}

		function iterateThroughGroups(groups, selectedItems, selectedRows, idProperty) {
			for (var g = 0; g < groups.length; g++) {
				var hasSelected = _.intersectionBy(groups[g].rows, selectedRows, idProperty);
				if (hasSelected && hasSelected.length > 0) {
					if (groups[g].collapsed === 1) {
						selectedItems.push(groups[g]);
					} else if (groups[g].groups) {
						iterateThroughGroups(groups[g].groups, selectedItems, selectedRows, idProperty);
					}
				}
			}
		}

		function performSelectionAfterFilter(grid, selection) {

			grid.dataView.refresh();

			var results = grid.dataView.getRows();

			if (results.length > 0) {
				if (selection.length) {
					var newSelection = _.map(_.intersection(results, selection), function (item) {
						return _.findIndex(results, [grid.options.idProperty, item[grid.options.idProperty]]);
					});

					if (newSelection.length) {
						grid.instance.setSelectedRows(newSelection);
						grid.instance.scrollRowIntoView(newSelection[0]);
					} else {
						grid.instance.setSelectedRows([]);
						grid.instance.setSelectedRows([0]);
					}
				} else {
					grid.instance.setSelectedRows([]);
					grid.instance.setSelectedRows([0]);
				}
				var selectedRows = grid.instance.getSelectedRows();
				if (selectedRows.length > 0) {
					grid.instance.setActiveCell(selectedRows[0], 0);
				}
			} else {
				grid.instance.setSelectedRows([]);
			}
		}

		/**
		 *
		 * @param gridId
		 * @returns {string|{column: *, ascending: boolean}|*|{column: *, ascending: boolean}}
		 */
		function getSortColumn(gridId) {
			var grid = gridById(gridId, true);

			return grid.sortColumn;
		}

		function getDataItemValueForColumn(item, columnDef, _grid) {
			var retVal = '';

			// if a custom getter is not defined, we call serializeValue of the editor to serialize
			if (columnDef.editor) {
				var editorArgs = {
					'container': $('<p>'),  // a dummy container
					'column': columnDef,
					'position': {'top': 0, 'left': 0},  // a dummy position required by some editors
					'grid': _grid,
					'item': item
				};
				var editor = new columnDef.editor(editorArgs);
				editor.loadValue(item);
				retVal = editor.serializeValue();
				editor.destroy();
			} else {
				retVal = item[columnDef.field];
			}
			return retVal;
		}

		/**
		 *
		 * @param gridId
		 * @param exportHeaders
		 */
		function exportGridData(gridId, exportHeaders) {
			var grid = gridById(gridId, true);
			var data = grid.dataView.getItems();
			var columns = grid.instance.getColumns();
			var clipTextRows = [];
			var j;

			if (exportHeaders) {
				var clipTextHeaders = [];
				for (j = 0; j < columns.length; j++) {
					// noinspection TypeScriptValidateTypes
					if (columns[j].id !== 'indicator' && columns[j].name.length > 0) {
						// noinspection TypeScriptValidateTypes
						clipTextHeaders.push(columns[j].name);
					}
				}
				clipTextRows.push(clipTextHeaders.join('\t'));
			}

			for (var i = 0; i < data.length; i++) {
				var dt = grid.instance.getDataItem(i);
				var clipTextCells = [];

				for (j = 0; j < columns.length; j++) {
					if (columns[j].id !== 'indicator') {
						var value = getDataItemValueForColumn(dt, columns[j], grid.instance);
						clipTextCells.push(value);
					}
				}
				clipTextRows.push(clipTextCells.join('\t'));
			}

			var clipText = clipTextRows.join('\r\n') + '\r\n';
			var ta = document.createElement('textarea');

			document.designMode = 'off';
			ta.style.position = 'absolute';
			ta.style.left = '-1000px';
			ta.style.top = document.body.scrollTop + 'px';
			ta.value = clipText;
			document.body.appendChild(ta);
			ta.focus();
			ta.select();
			document.execCommand('Copy');
			ta.remove();
		}

		// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// /     Grid Configuration API
		// //////////////////////////////////////////////////////////////////////////////////////////////////////////////

		// /Confgiuration variables
		var _propertyconfig = [],
			_gridconfig,
			_showStatusBar = true,
			_columns,
			_visibleCols,
			_currentGID,
			_pinOrder = 0,
			_statusCols = [],
			_editing = false,
			_currentOptions,
			_grid2ConfigId,
			_applyQueue = [],
			_isGrpContainer = false;

		// /Private API Functions
		function reset() {
			_propertyconfig = [];
			_gridconfig = null;
			_showStatusBar = true;
			_columns = null;
			_currentGID = null;
			_pinOrder = 0;
			_statusCols.length = 0;
			_editing = false;
			_currentOptions = null;
			_grid2ConfigId = null;
			_isGrpContainer = false;
		}

		function parseConfiguration() {
			_propertyconfig = angular.isString(_propertyconfig) ? JSON.parse(_propertyconfig) : angular.isArray(_propertyconfig) ? _propertyconfig : [];
			_gridconfig = angular.isString(_gridconfig) ? JSON.parse(_gridconfig) : angular.isObject(_gridconfig) ? _gridconfig : {};

			_.each(_propertyconfig, function (config) {
				if(config.columnFilterString && config.columnFilterString.length) {
					config.columnFilterString = checkString(config.columnFilterString); // clear all img tags to blank and further sanitizing
				}

				if(!_.has(config, 'labelCode')){
					config.labelCode = '';
				}

				if (_.has(config, 'name')) {
					_.unset(config, 'name');
					_.unset(config, 'name$tr$');
					_.unset(config, 'name$tr$param$');
				}
			});
		}

		function saveStatusBarState(gridID, showStatusBar) {
			let grid = gridById(gridID, true);

			_currentGID = gridID;
			if (grid.instance) {
				grid.scope.statusBar = showStatusBar;
				saveConfiguration();
			}
		}

		function getSaveConfiguration(gridId) {
			let grid = gridById(gridId, true);
			if (grid.scope) {
				return {
					statusBar: !_.isUndefined(grid.scope.statusBar) ? grid.scope.statusBar : true,
					allowCopySelection: !_.isUndefined(grid.scope.allowCopySelection) ? grid.scope.allowCopySelection : false,
					copyWithHeader: grid.options.includeHeaderWhenCopyingToExcel,
					treeGridLevel: grid.options.treeGridLevel,
					showHLevelFormatting: grid.options.showHLevelFormatting,
					showVLevelFormatting: grid.options.showVLevelFormatting
				};
			}
			return;
		}

		function checkConfiguration(props, columns, addNewColumns) {
			addNewColumns = _.isUndefined(addNewColumns) ? true : addNewColumns;
			_.remove(props, _.isUndefined);

			var existing = _.intersectionBy(props, columns, 'id');
			var added = _.differenceBy(columns, existing, 'id');

			_propertyconfig = _.reduce(existing, function (config, column) {
				if (column.id === 'tree') {
					config.unshift(column);
				} else {
					config.push(column);
				}
				return config;
			}, []);

			if (addNewColumns && added.length) {
				_propertyconfig = _.reduce(added, function (config, column) {
					if (column.id === 'tree') {
						config.unshift(makeConfigFromColumn(column, true));
					} else {
						config.push(makeConfigFromColumn(column, true));
					}
					return config;
				}, _propertyconfig);
			}
		}

		function onColumnStateChanged(gridId) {
			reset();
			_currentGID = gridId;
			getCols();
			updateConfig();
			saveConfiguration();
		}

		function renderHeaderRow(gridId) {
			let grid = gridById(gridId, true);

			if (!grid.scope) {
				return true;
			}

			if (angular.isUndefined(_.get(grid, 'scope.data.config.options.renderHeaderRow'))) {
				return true;
			} else {
				return false;
			}
		}

		function copySelection(gridId) {
			let grid = gridById(gridId, false);
			if (grid && grid.instance) {
				_copyPastePlugin.copySelection(grid.instance);
			}
		}

		function pasteSelection(gridId) {
			let grid = gridById(gridId, false);
			if (grid && grid.instance) {
				_copyPastePlugin.pasteSelection(grid.instance);
			}
		}

		function getMarkReadonly(gridId) {
			let grid = gridById(gridId, false);

			if (grid && grid.scope && !_.isUndefined(grid.scope.markReadonlyCells)) {
				// performance
				if (grid.scope.markReadonlyCells) {
					$('#' + gridId).addClass('show-readonly');
					// $('.platformgrid.grid-container.' + gridId).addClass('show-readonly');
				} else {
					$('#' + gridId).removeClass('show-readonly');
					// $('.platformgrid.grid-container.' + gridId).removeClass('show-readonly');
				}
				return grid.scope.markReadonlyCells;
			}
			return false;
		}

		function markReadOnly(gridId, mark) {
			let grid = gridById(gridId, false);

			if (grid && grid.instance) {
				_currentGID = gridId;
				// performance
				if (mark) {
					$('#' + gridId).addClass('show-readonly');
				} else {
					$('#' + gridId).removeClass('show-readonly');
				}

				grid.scope.markReadonlyCells = mark;
				onColumnStateChanged(grid.id);
			}
		}

		function setHorizontalLevelFormat(gridId, enable) {
			let grid = gridById(gridId, false);
			if(angular.isUndefined(enable)) {
				enable = true;
			}
			if (grid) {
				grid.options.showHLevelFormatting = enable;
				_currentGID = gridId;
				if (enable) {
					$('#' + gridId).addClass('show-horizontallevelformat');
				} else {
					$('#' + gridId).removeClass('show-horizontallevelformat');
				}
			}
		}

		function setVerticalLevelFormat(gridId, enable) {
			let grid = gridById(gridId, false);
			if(angular.isUndefined(enable)) {
				enable = true;
			}
			if (grid) {
				grid.options.showVLevelFormatting = enable;
				_currentGID = gridId;
				if (enable) {
					$('#' + gridId).addClass('show-verticallevelformat');
				} else {
					$('#' + gridId).removeClass('show-verticallevelformat');
				}
			}
		}

		function setAllowCopySelection(gridId, allow) {
			let grid = gridById(gridId, false);

			if (grid && grid.instance && grid.dataView.getLength() > 0) {

				_currentGID = gridId;

				if (allow) {
					grid.instance.getEditorLock().cancelCurrentEdit();
					grid.instance.getContainer().css('cursor','crosshair');
					grid.instance.registerPlugin(_copyPastePlugin);
					_copyPastePlugin.enableSelection(grid.instance);
				} else {
					grid.instance.getContainer().css('cursor','default');
					_copyPastePlugin.disableSelection(grid.instance);
					grid.instance.unregisterPlugin(_copyPastePlugin);
				}

				return true;
			}
			return false;
		}

		function skeletonLoading(gridId, isDisplayed) {
			let grid = gridById(gridId, false);
			if (grid && grid.instance && grid.options.enableSkeletonLoading) {
				grid.instance.skeletonLoading(isDisplayed);
			}
		}

		function setTreeGridLevel(gridId, level) {
			let grid = gridById(gridId, false);

			let previous = grid.options.treeGridLevel;

			if (grid && grid.instance) {
				_currentGID = gridId;

				grid.options.treeGridLevel = level;
				grid.instance.getOptions().treeGridLevel = level;
				onColumnStateChanged(grid.id);

				if(level === 0) {
					grid.dataView.collapseAllNodes();
				}
				else {
					if (previous && (parseInt(previous) > level))
					{
						grid.dataView.collapseAllNodes();
					}

					grid.dataView.expandAllNodes(parseInt(level));
				}
			}
		}

		function setCopyWithHeader(gridId, copyWithHeader, refreshToolbar = false) {
			let grid = gridById(gridId, false);

			if (grid && grid.instance) {
				_currentGID = gridId;

				grid.options.includeHeaderWhenCopyingToExcel = copyWithHeader;
				grid.instance.getOptions().includeHeaderWhenCopyingToExcel = copyWithHeader;
				onColumnStateChanged(grid.id);
				if (refreshToolbar) {
					$rootScope.$emit('refreshToolbar');
				}
			}
		}

		function itemCountChanged(gridId) {
			let grid = gridById(gridId, false);

			if (grid && grid.instance) {
				var rowCount = grid.instance.getData().getPagingInfo().totalRows;
				var rowCountMax;
				if (grid.options.tree && typeof grid.dataView.getTreeLength === 'function') {
					rowCountMax = grid.dataView.getTreeLength();
				} else {
					rowCountMax = grid.dataView.getItems().length;
				}
				if (!angular.isUndefined(grid.scope.searchString) && grid.scope.searchString !== '') {
					trigger(grid.instance, grid.instance.onItemCountChanged, {
						hasFilter: true,
						filterInfo: grid.scope.searchString,
						rowCount: rowCount,
						rowCountMax: rowCountMax,
						rowCountText: rowCount + '/' + rowCountMax
					});
				} else {
					var currentColumnFilter;

					if (!angular.isUndefined(grid.scope.columnFilters)) {
						currentColumnFilter = grid.scope.columnFilters.filter(function (e) {
							return e.filterString !== '';
						});
					}
					if (!angular.isUndefined(currentColumnFilter) && currentColumnFilter.length > 0) {
						trigger(grid.instance, grid.instance.onItemCountChanged, {
							hasFilter: true,
							filterInfo: currentColumnFilter,
							rowCount: rowCount,
							rowCountMax: rowCountMax,
							rowCountText: rowCount + '/' + rowCountMax
						});
					} else {
						trigger(grid.instance, grid.instance.onItemCountChanged, {
							hasFilter: false,
							rowCount: rowCount,
							rowCountMax: rowCountMax,
							rowCountText: rowCount + '/' + rowCountMax
						});
					}
				}
			}
		}

		/***
		 *
		 */
		function updateConfig() {
			var grid = gridById(_currentGID, true);

			_visibleCols.forEach(function (vcol) {
				var column = _.find(_columns, function (col) {
					return col.id === vcol.id;
				});
				if (column) {
					column.width = vcol.width;
					if (grid.instance && grid.instance.sortColumn && grid.instance.sortColumn.name === column.name) {
						column.sort = true;
						column.ascending = grid.instance.sortColumn.ascending;
						grid.scope.sortColumn = grid.instance.sortColumn;
					} else {
						column.sort = false;
					}
				}
			});

			var sortColumns = grid.instance.getSortColumns();
			if (sortColumns && sortColumns.length === 0) {
				grid.scope.sortColumn = null;
			}

			updatePropertyConfig(grid);
		}

		function updatePropertyConfig(grid){
			_.forEach(_columns, function (col) {
				var columnFilterString;
				if (col.hidden) {
					_.each(grid.scope.columnFilters, function (key, value) {
						if (value.colId === col.id) {
							grid.scope.columnFilters[key].filterString = '';
							updateHeaderRowIndicatorIcon(_currentGID);
							return false; // breaks
						}
					});
				} else {
					columnFilterString = _.find(grid.scope.columnFilters, function (value) {
						return value.colId === col.id;
					});
				}

				const isVisible = _visibleCols && Array.isArray(_visibleCols) && _visibleCols.some(vcol => vcol.id === col.id);
				if (!isVisible) {
					col.aggregates = col.defaultAggregates;
				}

				_propertyconfig.push({
					id: col.id,
					userLabelName: col.userLabelName,
					labelCode: col.labelCode || '',
					keyboard: col.keyboard || {enter: true, tab: true},
					hidden: !col.hidden || false,
					width: col.width,
					pinned: (col.isIndicator || col.pinned) || false,
					pinOrder: col.pinned === true ? col.pinOrder : undefined,
					defaultAggregates: col.defaultAggregates,
					aggregates: col.aggregates || col.defaultAggregates,
					uom: col.uom,
					fraction: col.fraction,
					sort: col.sort,
					ascending: col.ascending,
					columnFilterString: !angular.isUndefined(columnFilterString) ? columnFilterString.filterString : ''
				});
			});
		}

		function getCols() {
			var grid = gridById(_currentGID, true);

			_isGrpContainer = grid.grpContainer === true;
			_columns = grid.instance ? _.cloneDeep(configuration(_currentGID).current) : _.cloneDeep(grid.columns.current);
			_visibleCols = grid.instance ? _.cloneDeep(configuration(_currentGID).visible) : _.cloneDeep(grid.columns.visible);
			_statusCols = _.filter(_columns, function (col) {
				return col.id === 'indicator' || col.id === 'marker' || col.id === 'group';
			});
			_columns = _.filter(_columns, function (col) {
				return col.id !== 'indicator' && col.id !== 'marker' && col.id !== 'group';
			});
		}

		function loadViewConfig() {
			var grid = gridById(_currentGID, true);
			var options = grid.instance ? grid.instance.getOptions() : null;
			var config = options.enableModuleConfig ? mainViewService.getModuleConfig(_currentGID) : mainViewService.getViewConfig(_currentGID);

			if (config) {
				_propertyconfig = config.Propertyconfig || [];
				_gridconfig = config.Gridconfig || {};
				parseConfiguration();
				if (!_propertyconfig.length) {
					_gridconfig.version = 1;
				} else {
					_gridconfig.version = 1;
				}
			} else {
				_propertyconfig = [];
				_gridconfig = {};
				generateConfig(false);
			}
		}

		function makeConfigFromColumn(col, gene) {
			var kb = col.keyboard ? col.keyboard : {enter: true, tab: true};

			col.hidden = col.hidden ? col.hidden : !(gene && col.domain !== 'history');

			return {
				id: col.id,
				labelCode: col.labelCode || '',
				userLabelName: col.userLabelName,
				keyboard: kb,
				hidden: !col.hidden,
				width: col.width,
				pinned: (col.isIndicator || col.pinned) || false,
				aggregates: col.aggregates,
				isIndicator: col.isIndicator
			};
		}

		function generateConfig(save) {
			if (!_columns) {
				getCols();
			}
			_propertyconfig.length = 0;
			for (var i = 0; i < _columns.length; i++) {
				_propertyconfig.push(makeConfigFromColumn(_columns[i], true));
			}
			_gridconfig = {
				version: 1
			};

			var grid = gridById(_currentGID, true);
			var options = grid.instance ? grid.instance.getOptions() : grid.options;
			if (options && _.has(options, 'markReadonlyCells')) {
				grid.scope.markReadonlyCells = options.markReadonlyCells;

			}
			var gridInfo = {
				searchString: options && options.saveSearch ? grid.scope.searchString : '',
				showFilterRow: options ? options.showFilterRow : false,
				showMainTopPanel: options ? options.showMainTopPanel : false,
				statusBar: _.get(grid, 'scope.statusBar', false),
				markReadonlyCells: _.get(grid, 'scope.markReadonlyCells', false),
				allowCopySelection: _.get(grid, 'scope.allowCopySelection', false),
				includeHeaderWhenCopyingToExcel: options ? options.includeHeaderWhenCopyingToExcel : false,
				showHLevelFormatting: options ? options.showHLevelFormatting : true,
				showVLevelFormatting: options ? options.showVLevelFormatting : true
			};

			if (save) {
				if (grid.$$containerType === _containerType.subview) {
					var groups = {
						groups: getGrouping(_currentGID),
						sortColumn: 'null'
					};
					mainViewService.setViewConfig(_currentGID, _propertyconfig, groups, grid.enableConfigSave, false, gridInfo);
				} else if (grid.$$containerType !== _containerType.subview && grid.enableConfigSave) {
					saveConfiguration();
				}
			} else {
				_.assign(_gridconfig, gridInfo);
			}

			return {
				Propertyconfig: _propertyconfig,
				Gridconfig: _gridconfig,
				Guid: _currentGID.replace(' ', ''),
				$$options: _currentOptions
			};
		}

		function setColumnProperties() {
			var grid = gridById(_currentGID, true);
			if (!grid.scope.columnFilters) {
				grid.scope.columnFilters = [];
			}
			if (!grid.scope.searchString) {
				grid.scope.searchString = '';
			}

			if (_propertyconfig && _propertyconfig.length > 0) {
				_.forEach(_columns, function (column) {
					switch (column.id) {
						case 'indicator':
						case 'tree':
						case 'marker':
						case 'group':
							column.hidden = false;
							break;

						default:
							column.hidden = true;
					}
				});

				_.forEach(_propertyconfig, function (property, index) {
					var idx = _.findIndex(_columns, {id: property.id});

					if (_.has(property, 'name')) {
						_.unset(property, 'name');
						_.unset(property, 'name$tr$');
						_.unset(property, 'name$tr$param$');
					}

					if (_columns[idx]) {
						_columns[idx] = angular.extend({}, _columns[idx], property);
						_columns[idx].hidden = !_columns[idx].hidden;
						_columns[idx].width = _columns[idx].width ? parseInt(_columns[idx].width) : 70;
						property.domain = _columns[idx].domain;
						property.isIndicator = _columns[idx].isIndicator;

						if (property.sort || (angular.isUndefined(property.sort) && !angular.isUndefined(property.ascending))) {
							// var sortedColumn = {column: _columns[idx], ascending: property.ascending};
							grid.scope.sortColumn = _columns[idx];
						}

						_columns.move(idx, index);
					}

					var foundIndex = $.map(grid.scope.columnFilters, function (val, key) {
						if (val.colId === property.id) {
							return key;
						}
					});

					if (property.columnFilterString) {
						var columnFilterModel = {colId: property.id, filterString: property.columnFilterString};
						if (foundIndex.length === 0) {
							grid.scope.columnFilters.push(columnFilterModel);
						} else if (foundIndex.length === 1) {
							grid.scope.columnFilters[foundIndex[0]] = columnFilterModel;
						}
					} else {
						if (foundIndex.length === 1) {
							grid.scope.columnFilters[foundIndex[0]].filterString = '';
						}
					}
				});
			} else {
				generateConfig(false);
			}

			var cols = angular.copy(_columns);

			_.remove(cols, _.isUndefined);
			for (var i = 0; i < _statusCols.length; i++) {
				cols.unshift(_statusCols.pop());
			}
			platformTranslateService.translateGridConfig(cols);
			grid.columns = cols;
			grid.columns = grid.processColumns(grid);
			if (_gridconfig && _gridconfig.groups && _gridconfig.groups.length && !_editing) {
				_groupingQueue.push({
					gridId: _currentGID,
					groups: _gridconfig.groups,
					groupColumnWidth: _gridconfig.groupColumnWidth
				});
			}

			if (grid.instance) {
				grid.instance.setColumns(grid.columns.visible);
				if(grid.scope.showFilterRow) {
					showColumnSearch(grid.id,true, false);
					showSearch(grid.id, false, false);
					updateHeaderFilter(grid.id, grid.scope.columnFilters);
				} else if (grid.scope.showMainTopPanel) {
					showSearch(grid.id, true, false);
					showColumnSearch(grid.id,false, false);
					updateFilter(grid.id, grid.scope.searchString);
				}
			}
			return {
				grid: grid,
				options: _currentOptions
			};
		}

		function onViewChanged() {
			_viewChange = true;
		}

		function saveConfiguration() {
			var grid = gridById(_currentGID, true);
			var options = grid.instance ? grid.instance.getOptions() : null;
			var groupColumn = _.find(grid.columns.visible, {id: 'group'});
			var groups;
			if(groupColumn) {
				groups = {
					groups: getGrouping(_currentGID),
					sortColumn: 'null',
					groupColumnWidth: groupColumn.width
				};
			}
			else
			{
				let config = mainViewService.getViewConfig(_currentGID);
				groups = {
					groups: getGrouping(_currentGID),
					sortColumn: 'null',
					groupColumnWidth: config && config.Gridconfig ? config.Gridconfig.groupColumnWidth : 250
				};
			}
			var gridInfo = {
				searchString: options && options.saveSearch ? grid.scope.searchString : '',
				showFilterRow: options ? options.showFilterRow : false,
				showMainTopPanel: options ? options.showMainTopPanel : false,
				statusBar: grid.scope.statusBar,
				markReadonlyCells: grid.scope.markReadonlyCells,
				allowCopySelection: grid.scope.allowCopySelection,
				includeHeaderWhenCopyingToExcel: grid.options.includeHeaderWhenCopyingToExcel,
				treeGridLevel: grid.options.treeGridLevel,
				showHLevelFormatting: grid.options.showHLevelFormatting,
				showVLevelFormatting: grid.options.showVLevelFormatting,
				isAutoRefreshEnabled: grid.scope.isAutoRefresh
			};

			if (grid.$$containerType === _containerType.subview) {
				if (options.enableModuleConfig) {
					mainViewService.setModuleConfig(_currentGID, _propertyconfig, groups, gridInfo, {disableConfigSave: !grid.enableConfigSave});
				} else {
					mainViewService.setViewConfig(_currentGID, _propertyconfig, groups, grid.enableConfigSave, false, gridInfo);
				}
			} else if (grid.enableConfigSave) {
				if (options.enableModuleConfig) {
					mainViewService.setModuleConfig(_currentGID, _propertyconfig, groups, gridInfo);
				} else {
					var dto = {
						Guid: _currentGID,
						Propertyconfig: angular.isArray(_propertyconfig) ? JSON.stringify(_propertyconfig) : _propertyconfig,
						Gridconfig: angular.isArray(_gridconfig) ? JSON.stringify(_gridconfig) : _gridconfig
					};
					$http.post(globals.webApiBaseUrl + 'basics/layout/saveuiconfig', dto)
						.then(function (response) {
							var config = response.data;

							if (!config) {
								config = generateConfig(false);
							}
							_gridsExt.set(dto.Guid, config);
						}, function () {
						});
				}
			}
			reset();
		}

		function loadConfiguration(gridObj, options) {
			reset();

			var deferred = $q.defer();
			var grid = gridById(gridObj.id, true);
			var config = {};
			var queueObj = {
				grid: gridObj,
				options: options,
				config: null
			};

			_currentGID = gridObj.id;
			_currentOptions = options;
			try {
				switch (grid.$$containerType) {
					case _containerType.subview:
						config = options.options.enableModuleConfig ? mainViewService.getModuleConfig(_currentGID) : mainViewService.getViewConfig(_currentGID);
						break;
					case _containerType.configurator:
						config = options.options.enableModuleConfig ? mainViewService.getModuleConfig(_currentGID) : _gridsExt.get(_currentGID);
						break;
					case _containerType.other:
						config = options.options.enableModuleConfig ? mainViewService.getModuleConfig(_currentGID) : _gridsExt.get(_currentGID);
						break;
				}
				if (config === '') {
					config = null;
				}

				if (!config && (grid.$$containerType === _containerType.other || grid.$$containerType === _containerType.configurator)) {
					return $http.get(globals.webApiBaseUrl + 'basics/layout/getuiconfig?uuid=' + _currentGID)
						.then(function (response) {
							config = response.data;
							if (config === '') {
								config = null;
							}
							if (!config) {
								config = generateConfig(false);
							}
							_gridsExt.set(_currentGID, config);
							queueObj.config = config;
							_applyQueue.push(queueObj);
						}, function () {
						});
				} else if (!config) {
					config = generateConfig(false);
				}
				queueObj.config = config;
				_applyQueue.push(queueObj);
				deferred.resolve();
			} catch (ex) {
				deferred.reject(ex);
			}

			return deferred.promise;
		}

		function applyConfiguration(config) {
			var options = _applyQueue.pop();
			if (options) {
				_currentGID = options.grid.id;
				_currentOptions = options;
			}

			var grid = gridById(_currentGID, true);

			config = config || options.config;
			var deferred = $q.defer();

			getCols();
			if (config) {
				if (config && config.Gridconfig) {
					var loadSaveSearch = !_.isUndefined(grid.options.saveSearch) ? grid.options.saveSearch : true;
					if (loadSaveSearch) {
						grid.scope.searchString = config.Gridconfig.searchString;
					}
					grid.options.showHLevelFormatting = !angular.isUndefined(config.Gridconfig.showHLevelFormatting) ? config.Gridconfig.showHLevelFormatting : true;
					grid.options.showVLevelFormatting = !angular.isUndefined(config.Gridconfig.showVLevelFormatting) ? config.Gridconfig.showVLevelFormatting : true;
					if (!angular.isUndefined(config.Gridconfig.enableHierarchicalCustomFeatures)) {
						grid.options.enableHierarchicalCustomFeatures = config.Gridconfig.enableHierarchicalCustomFeatures;
					}
					grid.scope.showFilterRow = config.Gridconfig.showFilterRow;
					grid.scope.showMainTopPanel = grid.scope.showFilterRow ? false : config.Gridconfig.showMainTopPanel;
					grid.scope.statusBar = config.Gridconfig.statusBar;
					grid.scope.markReadonlyCells = config.Gridconfig.markReadonlyCells;
					grid.scope.allowCopySelection = config.Gridconfig.allowCopySelection;
					grid.scope.isAutoRefresh = config.Gridconfig.isAutoRefreshEnabled || false;
					if (_currentOptions) {
						Object.assign(_currentOptions.grid.options, config.Gridconfig);
					}

					if(grid.options.tree) {
						setHorizontalLevelFormat(_currentGID, grid.options.showHLevelFormatting);
						setVerticalLevelFormat(_currentGID, grid.options.showVLevelFormatting);
						if (!grid.options.enableHierarchicalCustomFeatures) {
							$('#' + _currentGID).addClass('disable-hierarchical-formatting');
						} else {
							$('#' + _currentGID).removeClass('disable-hierarchical-formatting');
						}
					}

					$rootScope.$emit('gridConfigurationAutoRefreshApplied', {
						gridId: _currentGID,
						config: config.Gridconfig
					});
				}
				var enableSave = canSaveConfig(_currentGID);

				_propertyconfig = enableSave ? config.Propertyconfig : [];
				_gridconfig = config.Gridconfig;
				parseConfiguration();

				if (Array.isArray(_propertyconfig)) {
					_propertyconfig.forEach(prop => {
						var col = _.find(_columns, c => c.id === prop.id);
						if (col) {
							prop.defaultAggregates = col.defaultAggregates;
						}
					});
				}

				if (!_editing) {
					checkConfiguration(_propertyconfig, _columns, enableSave ? !_.has(config, 'BasModuletabviewFk', false) : true);
				}
			}
			deferred.resolve(setColumnProperties());

			return deferred.promise;
		}

		var timerSet;

		function setInitialGrouping() {
			if (_groupingQueue.length) {
				if (!timerSet) {
					timerSet = $timeout(function () {
						while (_groupingQueue.length) {
							var gridOpt = _groupingQueue.pop();
							if (gridOpt) {
								setGrouping(gridOpt.gridId, [], true, true, gridOpt.groupColumnWidth);
								if (angular.isDefined(gridOpt.groups) && gridOpt.groups.length !== 0) {
									setGrouping(gridOpt.gridId, gridOpt.groups, true, false, gridOpt.groupColumnWidth);
								} else {
									toggleGroupPanel(gridOpt.gridId, false);
								}
							}
						}
						_groupingQueue = [];
						timerSet = null;
					}, 50);
				}
			}
		}

		/***
		 *
		 * @returns {*}
		 */
		function getPropertyConfig(includeName) {
			if (angular.isString(_propertyconfig)) {
				parseConfiguration();
			}

			var config = _.filter(_propertyconfig, function (conf) {
				return conf.id !== 'tree';
			});

			if (includeName) {
				return _.reduce(config, function (result, value) {
					var column = _.find(_columns, {id: value.id});

					if (column !== null) {
						var property = _.clone(value);

						result.push(property);

						property.name = column.name;
					}

					return result;
				}, []);
			}

			return _.clone(config);
		}

		function getGID() {
			return _currentGID;
		}

		function checkGrouping(groups) {
			var toRemove = [];
			groups.forEach(function (grp, idx) {
				var isPresent = _.find(_visibleCols, function (val) {
					return grp.columnId === val.id;
				});
				if (!isPresent) {
					toRemove.push(idx);
				}
			});
			for (var i = 0; i < toRemove.length; i++) {
				groups.splice(toRemove[i], 1);
			}
			return groups;
		}

		function isGrpContainer() {
			return _isGrpContainer;
		}

		/***
		 *
		 * @param gridId
		 */
		function openConfigDialog(gridId) {
			_editing = true;
			_grid2ConfigId = gridId;
			_currentGID = gridId.replace(/ /g, '');
			getCols();
			loadViewConfig();
			checkConfiguration(_propertyconfig, _columns);

			_propertyconfig = [];
			var grid = gridById(_currentGID, true);
			updatePropertyConfig(grid);

			var width = '70%';
			var modalOptions = {
				headerText: 'Grid layout',
				id: 'b5d9f7c389c140ea8aaaff79dd035b54',
				templateUrl: globals.appBaseUrl + 'app/components/gridconfig/templates/gridconfig-template.html',
				controller: 'gridConfigController',
				width: width,
				minWidth: '600px',
				maxWidth: '90%',
				resizeable: true
			};
			return platformDialogService.showDialog(modalOptions)
				.then(function (result) {
					if (result === 'ok') {
						var grid = gridById(gridId, true);

						// Apply modified grid configuration.
						var options = grid.instance ? grid.instance.getOptions() : null;
						var config = {
							Propertyconfig: dataView(_configId),
							Gridconfig: {},
							Guid: gridId
						};
						_currentGID = gridId;
						applyConfiguration(config);
						var groups = {
							groups: getGrouping(_currentGID),
							sortColumn: 'null'
						};

						_editing = false;
						_visibleCols = grid.instance ? angular.copy(configuration(gridId).visible) : angular.copy(grid.columns.visible);
						groups.groups = checkGrouping(groups.groups);
						if (options.enableModuleConfig) {
							mainViewService.setModuleConfig(_currentGID, config.Propertyconfig, groups);
						} else {
							mainViewService.setViewConfig(_currentGID, config.Propertyconfig, groups, true);
						}
						grid.instance.resizeGrid();
						_gridConfigChanged = true;
						setGrouping(gridId, groups.groups);
						reset();
						trigger(grid.instance, grid.instance.onGridConfigChanged);
					} else {
						// Revert modifications.
						reset();
						_editing = false;
					}
				});
		}

		/**
		 * @name showSearch
		 * @description Show filter panel
		 * @param {string} gridId
		 * @param {boolean} active
		 * @param {boolean} clearFilter
		 */
		function showSearch(gridId, active, clearFilter) {
			var grid = gridById(gridId, true);
			_currentGID = gridId;

			if (grid.instance) {
				grid.scope.showMainTopPanel = active;
				// throw grid event
				var openPanels = 0;
				var findPanel = false;
				var groupPanel = grid.instance.groupPanelVisibility();

				if (active) {
					openPanels = 1;
					findPanel = true;
				}
				if (groupPanel) {
					openPanels++;
				}
				trigger(grid.instance, grid.instance.onHeaderToggled, {
					openPanels: openPanels,
					grouppanel: groupPanel,
					findpanel: findPanel
				});

				if (clearFilter) {
					if (grid.scope.searchString && grid.scope.searchString !== '') {
						grid.scope.searchString = '';
						searchString('', gridId);
					}
				}

				grid.instance.searchPanelVisibility(active, grid.scope.searchString);

				if (grid.instance.getOptions().saveSearch) {
					onColumnStateChanged(gridId);
				} else {
					return true;
				}

			} else {
				return undefined;
			}
		}

		/**
		 * @name showSearch
		 * @description Show column filter row
		 * @param {string} gridId
		 * @param {boolean} active
		 * @param {boolean} clearFilter
		 */
		function showColumnSearch(gridId, active, clearFilter) {
			var grid = gridById(gridId, true);
			_currentGID = gridId;

			if (grid.instance) {
				grid.scope.showFilterRow = active;
				// throw grid event
				// throw grid event
				var openPanels = 0;
				var findPanel = false;
				var groupPanel = grid.instance.groupPanelVisibility();

				if (active) {
					openPanels = 1;
					findPanel = true;
				}
				if (groupPanel) {
					openPanels++;
				}
				trigger(grid.instance, grid.instance.onHeaderToggled, {
					openPanels: openPanels,
					grouppanel: groupPanel,
					findpanel: findPanel
				});

				if (clearFilter) {
					if (grid.scope.columnFilters) {
						var count = 0;
						grid.scope.columnFilters.forEach(function (e) {
							if (e.filterString !== '') {
								e.filterString = '';
								count += 1;
							}
						});
						if (count > 0) {
							updateHeaderFilter(gridId, grid.scope.columnFilters);
						}
					}
				}

				if (active && !isFilterRowGenerated(grid.id)) {
					generateFilterRow(grid);
				}

				// Show header row filter
				grid.instance.filterRowVisibility(active);

				if (grid.instance.getOptions().saveSearch) {
					onColumnStateChanged(gridId);
				} else {
					return true;
				}

			} else {
				return undefined;
			}
		}

		/**
		 * @name isFilterRowGenerated
		 * @description
		 * Method to return a boolean value indicating if the column filter row has already been generated
		 */
		function isFilterRowGenerated(gridId) {
			var inputs = $('.slick-headerrow-columns > .slick-cell > input', '#' + gridId);
			if (inputs && inputs.length > 0) {
				return true;
			}
			return false;
		}

		/**
		 * @name updateHeaderRowIndicatorIcon
		 * @description
		 * This function loops through the column filters to check if there is a active filter string
		 * if yes, switch indicator icon to 'X'
		 * if no, switch indicator icon back to default search icon
		 * @param gridId
		 *
		 */
		function updateHeaderRowIndicatorIcon(gridId) {
			var grid = gridById(gridId, true);
			var gridUID = grid.instance.getUID();

			var columnHeaderIndicator = $('#' + gridUID + 'indicator');

			if (grid.scope.searchString && grid.scope.searchString !== '') {
				columnHeaderIndicator.addClass('filtered');
			} else {
				// #113964 class selector - slow performance (saa.mik 04.06.2021)
				var headerRowIndicator = $('.slick-cell.' + gridUID + '.indicator');
				var hasColumnFilter = false;
				var currentColumnFilter = [];
				if (grid.scope.columnFilters) {
					currentColumnFilter = grid.scope.columnFilters.filter(function (e) {
						return e.filterString !== '';
					});
				}
				if (currentColumnFilter.length > 0) {
					hasColumnFilter = true;
				}

				if (hasColumnFilter) {
					headerRowIndicator.addClass('filtered');
					headerRowIndicator.removeClass('control-icons ico-indicator-search');
					headerRowIndicator.addClass('control-icons ico-input-delete');
					columnHeaderIndicator.addClass('filtered');
				} else {
					headerRowIndicator.removeClass('filtered');
					headerRowIndicator.removeClass('control-icons ico-input-delete');
					columnHeaderIndicator.removeClass('filtered');
					// clear all formatted divs
					$('.formatted-filter-input', '.slick-cell.' + gridUID).each(function (i, obj) {
						obj.innerHTML = '';
					});
					if (renderHeaderRow(gridId)) {
						headerRowIndicator.addClass('control-icons ico-indicator-search');
					}
				}
			}

			trigger(grid.instance, grid.instance.onFilterChanged);
		}

		/**
		 * @name generateFilterRow
		 * @description
		 * Method to generate the Column Filter row for the grid
		 * @param elem, if provided, is the element to append the filter input control to
		 * @param colId, if provided, is the Id of the column
		 */
		function generateFilterRow(grid) {

			platformGridFilterService.initFilterService(grid.scope);
			// #113964 class selector - slow performance (saa.mik 04.06.2021)
			$('.slick-headerrow-columns').find('.slick-cell.' + grid.instance.getUID()).each(function (i, obj) {
				var elClasses = $(this).attr('class').split(' ');
				var columnId;
				for (var index in elClasses) {
					if (elClasses[index].startsWith('item-field_')) {
						columnId = elClasses[index].replace('item-field_', '');
						break;
					}
				}

				grid.scope.onFilterChanged = function () {
					var filterInput = document.activeElement;

					updateHeaderFilter(grid.scope.data.state, grid.scope.columnFilters, filterInput);
					onColumnStateChanged(grid.scope.data.state);
				};

				var columns = grid.columns.visible.filter(function (x) {
					return x.id === columnId;
				});

				if (columns && columns.length > 0) {
					var input = generateFilterRowInternal(grid, obj, columns[0]);
					if (input) {
						bindEventsToColumnFilterInput(grid, input, obj.children[1], columns[0]);
					}
				}

				if (columnId === 'indicator') {
					updateHeaderRowIndicatorIcon(grid.scope.data.state);
				}
			});

			$(grid.instance.getHeaderRow()).mousedown(function (e) {
				if (angular.element(e.target).hasClass('ico-input-delete')) {
					clearColumnFilter(grid);
				}
			});
		}

		function generateFilterRowInternal(grid, elem, column) {
			if (elem && !elem.hasChildNodes() && column) {
				if (column.id !== 'indicator' && column.id !== 'tree' && column.id !== 'marker' && column.id !== 'group' && !column.isIndicator) {
					var foundIndex = $.map(grid.scope.columnFilters, function (val, key) {
						if (val.colId === column.id) {
							return key;
						}
					});

					if (foundIndex) {
						var headerRowInput;
						if (foundIndex.length === 0) {
							var columnFilterModel = {colId: column.id, filterString: ''};
							var index = grid.scope.columnFilters.push(columnFilterModel) - 1; // push returns length
							headerRowInput = platformGridFilterService.formatFilter(column.domain, 'columnFilters[' + index + '].filterString');
						} else {
							headerRowInput = platformGridFilterService.formatFilter(column.domain, 'columnFilters[' + foundIndex[0] + '].filterString');
						}
						if (headerRowInput) {
							headerRowInput.appendTo(elem);
							$compile(headerRowInput)(grid.scope);
							if (elem.firstElementChild && elem.firstElementChild.children.length > 0) {
								_.forEach(elem.firstElementChild.children, function (child) {
									child.tabIndex = 0;
								});
							}
							$('<div class="formatted-filter-input ' + column.id + '" contenteditable style="display: none;"></div>').appendTo(elem);
							if (elem.hasChildNodes) {
								return elem.hasChildNodes() ? elem.childNodes[0] : null;
							}
						}
					}
				} else {
					// Add inactive to class name for columns which don't have the column filter
					elem.className += ' inactive';
				}
			}
			return null;
		}

		/**
		 * @name clearColumnFilter
		 * @description Clears all filter input in column filter
		 */
		function clearColumnFilter(grid) {

			$.each(grid.scope.columnFilters, function () {
				this.filterString = '';
			});

			grid.scope.$apply();

			updateHeaderFilter(grid.id, grid.scope.columnFilters);
			onColumnStateChanged(grid.id);
		}

		/**
		 * @name bindEventsToColumnFilterInput
		 * @description Bind focus events to the column filter inputs
		 */
		function bindEventsToColumnFilterInput(grid, input, div, column) {
			// performance
			if (column.domain !== 'boolean') {

				// For initialisation
				var currentColumnFilter = grid.scope.columnFilters.filter(function (e) {
					return e.colId === column.id && e.filterString !== '';
				});

				if (!unregisterEvents.get(grid.id)) {
					unregisterEvents.set(grid.id, []);
				}

				$.each(currentColumnFilter, function (key, value) {
					$(div).ready(function () {
						div.innerHTML = platformGridFilterService.formatFilterInput(value.filterString);
						input.style.display = 'none';
						div.style.display = 'block';
					});
				});

				var _focusout = function () {
					input.value = checkString(input.value);
					if (input.value) {
						triggerFilter(grid, input, column);
						div.innerHTML = platformGridFilterService.formatFilterInput(input.value);
						input.style.display = 'none';
						div.style.display = 'block';
					}
				};

				input.addEventListener('focusout', _focusout, false);

				var _focusin = function () {
					input.style.display = 'block';
					div.style.display = 'none';
					input.focus();
				};

				div.addEventListener('focusin', _focusin, false);

				var _keydown = function (e) {
					let keysPressed = {};
					keysPressed[e.key] = true;
					if (e.which === keyCodes.ENTER) {
						e.stopPropagation();
						e.preventDefault();
					}// this is to prevent propagation of the ENTER button click which closes a dialog.
					else if (e.which === keyCodes.TAB) // Tab key
					{
						input.value = checkString(input.value);
						if (input.value) {
							triggerFilter(grid, input, column);
						}

						var index = grid.instance.getColumns().findIndex(function (col) {
							return col.id === column.id;
						});

						if (e.shiftKey) {
							if (index !== 0) {
								var prevCol = grid.instance.getColumns()[index - 1];
								if (prevCol.pinned) {
									var pinnedInputFields = $('div.slick-headerrow-columns-left > div.item-field_' + prevCol.id + ' > input');
									if (pinnedInputFields.length > 0) {
										var nextFocusablePinnedInput = pinnedInputFields[pinnedInputFields.length - 1];
										if (nextFocusablePinnedInput.style.display === 'none') {
											nextFocusablePinnedInput.nextElementSibling.style.display = 'none';
											nextFocusablePinnedInput.style.display = 'block';
										}
										nextFocusablePinnedInput.focus();
										e.stopPropagation();
										e.preventDefault();
									}
								}
							}
						} else {
							if (column.pinned) {
								if (index && index < grid.instance.getColumns().length) {
									var nextCol = grid.instance.getColumns()[index + 1];
									if (!nextCol.pinned) {
										var nextFocusableInput = $('div.slick-headerrow-columns-right > div.item-field_' + nextCol.id + ' > input');
										if (nextFocusableInput.length > 0 && nextFocusableInput[0].style.display === 'none') {
											nextFocusableInput[0].nextElementSibling.style.display = 'none';
											nextFocusableInput[0].style.display = 'block';
										}
										nextFocusableInput[0].focus();
										e.stopPropagation();
										e.preventDefault();
									}
								}
							}

						}
					}
				};

				input.addEventListener('keydown', _keydown);

				var _keyup = function (e) {
					if (e.which === keyCodes.ENTER) { // Enter
						input.value = checkString(input.value);
						if (input.value) {
							triggerFilter(grid, input, column);
						}
					} else if ((e.which !== keyCodes.TAB && e.which !== keyCodes.DOWN) && input.value === '') {
						$timeout(function () {
							triggerFilter(grid, input, column);
						}, 500);
					} else if (e.which === keyCodes.DOWN) {
						if (grid.dataView.getRows().length > 0) {
							const cellIndex = grid.columns.visible.findIndex(function(col) {
								return col.field === column.field;
							});
							grid.instance.setCellFocus(0, cellIndex, false);
						}
					}
				};

				input.addEventListener('keyup', _keyup);

				unregisterEvents.get(grid.id).push(function () {
					input.removeEventListener('focusout', _focusout, true);
					div.removeEventListener('focusin', _focusin, true);
					input.removeEventListener('keydown', _keydown);
					input.removeEventListener('keyup', _keyup);
				});

			}
		}

		function triggerFilter(grid, input, column) {
			let currentColumnFilterObj = grid.scope.columnFilters.filter(function (x) {
				return x.colId === column.id;
			});

			let performFilter = true;

			if (currentColumnFilterObj && currentColumnFilterObj.length > 0) {
				if (!_.isUndefined(input.value)) {
					if (currentColumnFilterObj[0].previousInput !== currentColumnFilterObj[0].filterString)
					{
						currentColumnFilterObj[0].filters = platformGridFilterService.parseQuery(input.value, column.field);
						currentColumnFilterObj[0].previousInput = currentColumnFilterObj[0].filterString;
					} else {
						performFilter = false;
					}
				} else {
					currentColumnFilterObj[0].filters = {};
					currentColumnFilterObj[0].previousInput = '';
				}
			}

			if (performFilter) {
				updateHeaderFilter(grid.scope.data.state, grid.scope.columnFilters, input);
				onColumnStateChanged(grid.scope.data.state);
			}
			return performFilter;
		}

		function checkString(value) {
			var checkVal = platformSanitizeService.cleanHTML(value);
			if (checkVal) {
				checkVal = checkVal.replace('&gt;', '>');
				checkVal = checkVal.replace('&lt;', '<');
				checkVal = checkVal.replace('&amp;', '&');
				// remove img tags - not required in filter fields and pose security risk
				checkVal = checkVal.replace(/<img[^>]*>/g, '');

			}
			return checkVal;
		}

		function searchString(value, gridId) {
			_searchString = value;
			updateFilter(gridId);
		}

		function toggleGroupPanel(gridId, active) {
			let grid = gridById(gridId, false);
			if (grid && !!grid.instance) {
				// throw grid event
				var openpanels = 0;
				var grouppanel = false;

				if (active) {
					openpanels = 1;
					grouppanel = true;
				}

				var findpanel = grid.instance.getOptions().showMainTopPanel;
				if (findpanel) {
					openpanels++;
				}
				trigger(grid.instance, grid.instance.onHeaderToggled, {
					openPanels: openpanels,
					grouppanel: grouppanel,
					findpanel: findpanel
				});
				return grid.instance.groupPanelVisibility(active);
			} else {
				return undefined;
			}
		}

		function refreshConfiguration(gridId, setGrouping) {
			setGrouping = setGrouping || false;
			var grid = gridById(gridId, true);
			if (grid.instance) {
				if (setGrouping) {
					if (grid.options.enableDraggableGroupBy && !grid.options.tree) {
						setupGrouping(grid.columns.visible);
						grid.dataView.setGrid(grid.instance);
					}
					loadConfiguration(grid, grid)
						.then(applyConfiguration)
						.then(setInitialGrouping)
						.then(function () {
							let timerSet = $timeout(function () {
								if(_viewChange && grid.options.isUserContainer) {
									let currentView = mainViewService.getCurrentView();
									if(currentView) {
										if(currentView.ModuleTabViewConfigEntities.some(e => e.Guid === grid.id))
										{
											onColumnStateChanged(grid.id);
										}
									}
								}
								timerSet = null;
							}, 500);
						});
				} else {
					loadConfiguration(grid, grid)
						.then(applyConfiguration)
						.then(function () {
							let timerSet = $timeout(function () {
								if (_viewChange && grid.options.isUserContainer) {
									let currentView = mainViewService.getCurrentView();
									if(currentView) {
										if(currentView.ModuleTabViewConfigEntities.some(e => e.Guid === grid.id))
										{
											onColumnStateChanged(grid.id);
										}
									}
								}
								timerSet = null;
							}, 500);
						});
				}
			}
		}

		/**
		 * @name updateAutoRefreshStatus
		 * @description Show or hide the auto-refresh functionality
		 * @param {string} gridId
		 * @param {boolean} active
		 */
		function updateAutoRefreshStatus(gridId, active) {
			var grid = gridById(gridId, true);
			if (typeof grid.scope.isAutoRefresh === 'undefined') {
				grid.scope.isAutoRefresh = false;  // Default to false if not set
			}
			grid.scope.isAutoRefresh = active;

			onColumnStateChanged(gridId);
		}
	}
})(Slick, $, Ext);
