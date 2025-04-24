((ng) => {
	'use strict';

	function ProjectcontrolsDashboardStructureController($element, $compile, $scope, $injector, $rootScope, platformGridAPI,
		mainViewService, cloudDesktopSidebarService, platformGenericStructureService, _, $, projectControlsGroupingType) {

		/*****************************************************************************************
		 *      Controller private variables
		 *****************************************************************************************/

		const ctrl = this;
		let _grouped = [];
		let _columns = [];

		const _defaultColumns = ['ec_total', 'b_total', 'ws_to_rp', 'wp_to_rp', 'tac_to_rp'];

		const _filterList = [];
		let _placeholder;
		// const _filteredItems = [];
		let ignoreSave = false;
		let mainService;

		/*****************************************************************************************
		 *      Controller public properties
		 *****************************************************************************************/

		ctrl.open = false;
		ctrl.groupable = [];
		ctrl.grpColumns = {
			items: [],
			btnIconCSS: 'control-icons ico-input-add',
			filter: true
		};
		ctrl.containerConfig = false;

		/*****************************************************************************************
		 *      Controller private functions
		 *****************************************************************************************/

		function prepareGrpItems() {
			ctrl.grpColumns.items = [];
			for (let i = 0; i < ctrl.groupable.length; i++) {
				const col = ctrl.groupable[i];
				ctrl.grpColumns.items.push({
					'label': col.name,
					'type': 'button',
					'border': '',
					'borderCss': '',
					'itemCss': '',
					'value': col.id,
					'initialState': '',
					'children': [],
					'isVisible': true
				});
			}
		}

		function processColumns() {
			ctrl.groupable = _.sortBy(_.filter(ctrl.groupingColumns, (item) => {
				return item.grouping !== undefined && item.grouping.generic === true;
			}), 'name');
			const _aggregateColumns = _.filter(ctrl.options.columns, (col) => {
				if (col.domain) {
					return (col.domain === 'quantity' || col.domain === 'integer' || col.domain === 'money') && (col.field !== 'Id' || col.id !== 'id');
				} else {
					return (col.formatter === 'quantity' || col.formatter === 'integer' || col.formatter === 'money') && (col.field !== 'Id' || col.id !== 'id');
				}
			});

			_columns = [];

			_aggregateColumns.forEach((col) => {
				_columns.push({
					id: col.id,
					name: col.name,
					name$tr$: col.name$tr$,
					toolTip: col.toolTip,
					toolTip$tr$: col.toolTip$tr$,
					field: col.field,
					width: col.width || 80,
					resizable: true,
					sortable: false,
					formatter: col.formatter,
					formatterOptions: col.formatterOptions,
					searchable: true,
					hidden: _defaultColumns.indexOf(col.id) > -1 ? false : true,
					readonly: _.get(col, 'grouping.aggregateForce', false),
					aggregation: !_.get(col, 'grouping.aggregateForce', false),
				});
			});
		}

		function selectionChangedHandler(e, args) {
			var argsInt = {
				'rows': args.rows,
				'item': platformGridAPI.rows.selection({'gridId': ctrl.gridData.state})
			};
			ctrl.onSelectionChanged({'evt': e, 'args': argsInt});
		}

		function recoverParent(item) {
			return _.find(platformGridAPI.rows.getRows(ctrl.gridData.state), function (parent) {
				return parent.id === item.parentId;
			});
		}

		function recoverParents(item) {
			var parent, arr = [item], prev = item;
			while ((parent = recoverParent(prev))) {
				arr.unshift(parent);
				prev = parent;
			}
			return arr;
		}

		function markerChanged(markedItem, reloadMainService) {
			var isPresent = false;

			if (markedItem.id) {
				isPresent = _.find(_filterList, function (item) {
					return item[item.length - 1].id === markedItem.id;
				});
			} else {
				var cols = platformGridAPI.columns.configuration(ctrl.gridData.state);
				var filterCol = _.find(cols.current, {id: 'marker'});
				if (filterCol && filterCol.editorOptions) {
					filterCol.editorOptions.multiSelect = ctrl.options.marker.multiSelect;
					platformGridAPI.columns.configuration(ctrl.gridData.state, cols.current);
				}
			}

			if (!ctrl.options.marker.multiSelect) {
				_filterList.length = 0;
				_filterList.push(recoverParents(markedItem));
				platformGridAPI.rows.scrollIntoViewByItem(ctrl.gridData.state, markedItem);
			} else if (isPresent) {
				_filterList.forEach(function (item, idx, obj) {
					if (item[item.length - 1].id === markedItem.id) {
						obj.splice(idx, 1);
					}
				});
			} else {
				if (!markedItem.id) {
					_.forEach(markedItem, function (val) {
						_filterList.push(recoverParents(val));
					});
					platformGridAPI.rows.scrollIntoViewByItem(ctrl.gridData.state, _filterList[0][1]);
				} else {
					_filterList.push(recoverParents(markedItem));
				}
			}

			if (reloadMainService !== false) {
				ctrl.onFilterChanged({'filterItems': _filterList});
			}

			if (ctrl.containerConfig.enableCaching) {
				setTimeout(function () {
					setSessionStorage(platformGridAPI.items.data(ctrl.gridData.state));
				}, 100);
			}
		}

		function checkSidebarFilter() {
			checkFilterChanges();
		}

		function onListLoaded() {
			checkFilterChanges();
		}

		function clearSessionStorage() {
			const id = mainViewService.getCurrentView().Id;
			const state = platformGenericStructureService.cachedState(id);

			_.set(state, 'filterEnabled', false);
			_.set(state, 'gridData', null);
			_.set(state, 'filterOptions', null);

			window.sessionStorage.removeItem(id);
		}

		function setSessionStorage(data) {
			const filterParams = cloudDesktopSidebarService.getFilterRequestParams();
			const filterOptions = {
				PinningContext: filterParams.PinningContext,
				Pattern: filterParams.Pattern
			};
			const id = mainViewService.getCurrentView().Id;
			const state = platformGenericStructureService.cachedState(id);

			_.set(state, 'filterOptions', filterOptions);
			_.set(state, 'gridData', data);
		}

		function getSessionStorage() {
			if (!ctrl.containerConfig.enableCaching) {
				return [];
			}

			return _.get(platformGenericStructureService.cachedState(mainViewService.getCurrentView().Id), 'gridData', []);
		}

		function getSessionStorageFilterOptions() {
			return _.get(platformGenericStructureService.cachedState(mainViewService.getCurrentView().Id), 'filterOptions', null);
		}

		function checkFilterChanges() {
			var filterParams = cloudDesktopSidebarService.getFilterRequestParams();
			var lastFilterOptions = getSessionStorageFilterOptions();
			if (lastFilterOptions !== null &&
				(!_.isEqual(JSON.stringify(filterParams.PinningContext), JSON.stringify(lastFilterOptions.PinningContext)) ||
					filterParams.Pattern !== lastFilterOptions.Pattern)) {
				clearSessionStorage();
				platformGridAPI.items.data(ctrl.gridData.state, []);
			}
		}

		function getDefaultGrouped(){
			let defaultGrpTypes = _.filter(projectControlsGroupingType, function (item){
				return item.isDefault;
			});

			return _.map(defaultGrpTypes, function(item){
				return {
					cid : item.id,
					state:{}
				};
			});
		}

		function refreshGrpColumns(){
			let grouped = mainViewService.customData(ctrl.gridData.state, 'grpInfo') || [];
			_grouped = [];
			_placeholder = $element.find('.group-placeholder');
			_placeholder.empty();

			processColumns();
			prepareGrpItems();

			ignoreSave = true;

			let groupedToDisplay = _.isArray(grouped) && grouped.length > 0 ? grouped : getDefaultGrouped();

			var dataService = $injector.get(mainViewService.getContainerByUuid(ctrl.gridData.state).mainService);// $injector.get('controllingProjectcontrolsDashboardService');
			if(dataService && _.isFunction(dataService.cleanGroupingstate)){
				dataService.cleanGroupingstate();
			}

			_.each(groupedToDisplay, function (item) {
				let idx = _.findIndex(ctrl.groupable, {'id': item.cid});
				if (idx > -1) {
					ctrl.groupable[idx].state = item.state;
					ctrl.onAction({idx: idx});
					ctrl.onChange(ctrl.groupable[idx].id, ctrl.groupable[idx].state, true);
				} else {
					console.log('Groupable field no longer groupable. ColumnId=' + item.cid + ' removed');
				}
			});
			ignoreSave = false;
		}

		/*****************************************************************************************
		 *      Controller public methods
		 *****************************************************************************************/

		ctrl.onAction = function (result) {
			var idx = result.idx;
			ctrl.grpColumns.items[idx].isVisible = false;
			var isGeneric = ctrl.options.isGenericGroup(ctrl.groupable[idx]);
			const metadata = ctrl.groupable[idx].metadata;
			if(metadata && metadata.priority){
				ctrl.makeItemsInvisible(idx)
			}
			const maxLevels = isGeneric ? metadata.maxLevels : '0';
			var groupElement = $('<controlling-Projectcontrols-Generic-Groupitem data-max-levels="' + maxLevels + '"  data-is-generic="' + isGeneric + '" data-index="' + idx + '" data-colinfo="$ctrl.groupable[' + idx + ']" on-state-change="$ctrl.onChange(cid,state)" on-close="$ctrl.removeGroup(cid)"></controlling-Projectcontrols-Generic-Groupitem>');
			_placeholder.append(groupElement);
			$compile(groupElement)($scope);
			_grouped.push({'cid': ctrl.groupable[idx].id, 'state': ctrl.groupable[idx].state || {}});
			ctrl.onGroupingChange({'cid': ctrl.groupable[idx].id, 'type': 'ADDED'});
			ctrl.grouped = true;
			ctrl.onGroupstateChange({'cid': ctrl.groupable[idx].id, 'state': ctrl.groupable[idx].state});
			if (!ignoreSave) {
				mainViewService.customData(ctrl.gridData.state, 'grpInfo', _grouped);
			}
			if (result.value) {
				clearSessionStorage();
				platformGridAPI.items.data(ctrl.gridData.state, []);
			}
		};

		ctrl.makeItemsInvisible = function makeItemsInvisible(idx){
			if(ctrl.groupable[idx] && ctrl.groupable[idx].metadata && ctrl.groupable[idx].metadata.priority){
				const currentPriority = ctrl.groupable[idx].metadata.priority;
				ctrl.groupable.map(function(item, index){
					if(item.metadata && item.metadata.priority && item.metadata.priority >= currentPriority){
						ctrl.grpColumns.items[index].isVisible = false;
					}
				});
			}
		};

		ctrl.makeItemsVisible = function makeItemsVisible(){
			if(_grouped.length === 0){
				ctrl.grpColumns.items.map(function(item){
					item.isVisible = true;
				});
			}else{
				const lastGrouped = _grouped[_grouped.length - 1];
				if(lastGrouped){
					const idx = _.findIndex(ctrl.groupable, {'id': lastGrouped.cid});
					if(ctrl.groupable[idx] && ctrl.groupable[idx].metadata && ctrl.groupable[idx].metadata.priority){
						const currentPriority = ctrl.groupable[idx].metadata.priority;
						ctrl.groupable.map(function(item, index){
							if(item.metadata && item.metadata.priority && item.metadata.priority < currentPriority){
								ctrl.grpColumns.items[index].isVisible = true;
							}
						});
					}
				}
			}
		};

		ctrl.removeGroup = function removeGroup(cid) {
			var idx = _.findIndex(_grouped, {'cid': cid});
			_grouped.splice(idx, 1);
			var colIdx = _.findIndex(ctrl.groupable, {'id': cid});
			const metadata = ctrl.groupable[idx].metadata;
			if(metadata && metadata.priority){
				ctrl.makeItemsVisible();
			}else{
				ctrl.grpColumns.items[colIdx].isVisible = true;
			}
			ctrl.onGroupingChange({'cid': cid, 'type': 'REMOVED'});
			if (!_grouped.length) {
				ctrl.grouped = false;
				// _filteredItems.length = 0;
			}
			mainViewService.customData(ctrl.gridData.state, 'grpInfo', _grouped);
			platformGridAPI.items.data(ctrl.gridData.state, []);
			clearSessionStorage();
		};

		ctrl.onChange = function onChange(cid, state, ignoreSave) {
			var idx = _.findIndex(_grouped, {'cid': cid});
			_grouped[idx].state = state;
			ctrl.onGroupstateChange({'cid': cid, 'state': state});
			if (!ignoreSave) {
				// var data = platformGridAPI.rows.getRows(ctrl.options.gridData.state);
				// ctrl.onItemsProcessed({'data': data});
				mainViewService.customData(ctrl.gridData.state, 'grpInfo', _grouped);
			}
		};

		/*****************************************************************************************
		 *      Lifecycle hooks
		 *****************************************************************************************/

		ctrl.$onInit = function onInit() {
			mainService = $injector.get(mainViewService.getContainerByUuid(ctrl.gridData.state).mainService);
			mainService.registerListLoaded(onListLoaded);
			checkSidebarFilter();
			ctrl.containerConfig = mainViewService.getContainerByUuid(ctrl.gridData.state);

			if (!ctrl.containerConfig.enableCaching) {
				clearSessionStorage();
			}
			if (!ctrl.options.columns) {
				throw new Error('Groupable columns in options not set.');
			}
			var gridInstance = platformGridAPI.grids.element('id', ctrl.gridData.state);

			$scope.$parent.onContentResized(function () {
				platformGridAPI.grids.resize(ctrl.gridData.state);
			});

			if (!gridInstance) {
				var gridData = getSessionStorage();

				var grid = {
					data: gridData,
					columns: _columns,
					id: ctrl.gridData.state,
					grpContainer: false,
					options: {
						tree: true,
						treePrintable: true,
						showDescription: true,
						childProp: 'children',
						indicator: true,
						idProperty: 'id'
					}
				};
				platformGridAPI.grids.config(grid);
			} else {
				platformGridAPI.items.data(ctrl.gridData.state, []);
			}

			refreshGrpColumns();

			$scope.$parent['#advconfig'] = true;

			platformGridAPI.events.register(ctrl.gridData.state, 'onSelectedRowsChanged', selectionChangedHandler);
		};

		ctrl.$onChanges = function onChanges(changes) {
			if(changes.items){
				if (changes.items.currentValue) {
					if (changes.context) {
						platformGridAPI.items.data(ctrl.gridData.state, []);
					} else {
						ctrl.items = angular.copy(changes.items.currentValue);
						platformGridAPI.items.data(ctrl.gridData.state, ctrl.items);
						if (ctrl.containerConfig.enableCaching) {
							setSessionStorage(ctrl.items);
						}
					}

					if (ctrl.onItemsProcessed) {
						setTimeout(function () {
							var data = platformGridAPI.rows.getRows(ctrl.gridData.state);
							ctrl.onItemsProcessed({'data': data});

							var markedObj = _.pickBy(data, function (val) {
								return !!(val.IsMarked);
							});

							if (_.isObject(markedObj) && !_.isEmpty(markedObj)) {
								_.forEach(markedObj, function (val) {
									platformGridAPI.cells.selection({
										gridId: ctrl.gridData.state,
										rows: [val]
									});
								});
								if (Object.keys(markedObj).length < 2) {
									ctrl.options.marker.multiSelect = false;
									markerChanged(markedObj[Object.keys(markedObj)[0]], false);
								} else {
									ctrl.options.marker.multiSelect = true;
									markerChanged(markedObj, false);
								}
							}
						}, 1000);
					}
				} else {
					ctrl.items = angular.copy(changes.items.currentValue);
					platformGridAPI.items.data(ctrl.options.gridData.state, []);
				}
			}

			if (changes.context && changes.context.currentValue) {
				ctrl.context = angular.copy(changes.context.currentValue);
			} else {
				ctrl.context = false;
			}

			if(changes.groupingColumns && changes.groupingColumns.currentValue){
				refreshGrpColumns();
			}
		};

		ctrl.$onDestroy = function onDestroy() {
			platformGridAPI.events.unregister(ctrl.gridData.state, 'onSelectedRowsChanged', selectionChangedHandler);
			mainService.unregisterListLoaded(onListLoaded);
		};
	}

	ProjectcontrolsDashboardStructureController.$inject = ['$element', '$compile', '$scope', '$injector', '$rootScope', 'platformGridAPI',
		'mainViewService', 'cloudDesktopSidebarService', 'platformGenericStructureService', '_', '$', 'projectControlsGroupingType'];

	let genericStructConfig = {
		bindings: {
			options: '<',
			items: '<',
			context: '<',
			gridData: '<',
			groupingColumns:'<',
			onGroupingChange: '&',
			onGroupstateChange: '&',
			onSelectionChanged: '&',
			onFilterChanged: '&',
			onItemsProcessed: '&',
		},
		'template': ['$templateCache', function ($templateCache) {
			return $templateCache.get('projectcontrols/dashboar-structure.html');
		}],
		'controller': ProjectcontrolsDashboardStructureController
	};

	ng.module('controlling.projectcontrols').component('projectcontrolsDashboardStructure', genericStructConfig);

})(angular);
