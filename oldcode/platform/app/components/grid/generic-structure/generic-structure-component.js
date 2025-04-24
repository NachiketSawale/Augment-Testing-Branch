/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

((ng) => {
	'use strict';

	function PlatformGenericStructureController($element, $compile, $scope, $injector, $rootScope, $timeout, platformGridAPI, mainViewService, cloudDesktopSidebarService, platformGenericStructureService, _, $, $translate) {

		/*****************************************************************************************
		 *      Controller private variables
		 *****************************************************************************************/

		const ctrl = this;
		const _grouped = [];
		const _columns = [
			{
				id: 'marker',
				name: 'Filter',
				name$tr$: 'platform.gridMarkerHeader',
				toolTip: 'Filter',
				toolTip$tr$: 'platform.gridMarkerHeader',
				field: 'IsMarked',
				width: 40,
				minWidth: 40,
				resizable: true,
				sortable: false,
				formatter: 'marker',
				pinned: true,
				editor: 'marker',
				editorOptions: {
					serviceName: 'platformGenericStructureService',
					serviceMethod: 'getGroupItems',
					multiSelect: false
				},
				onChange: markerChanged,
				printable: false,
				aggregation: false
			},
			{
				id: 'itemCount',
				formatter: 'integer',
				field: 'count',
				name: 'Count',
				name$tr$: 'platform.gridCountHeader',
				width: 120,
				readonly: true,
				aggregation: false,
				sortable: true
			}
		];
		const _gridConfig = {};

		const _filterList = [];
		let _placeholder;
		const _filteredItems = [];
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
			for (let i = 0; i < ctrl.groupable.length; i++) {
				const col = ctrl.groupable[i];
				let displayName = col.name;
				if(col.id in _gridConfig) {
					if (_gridConfig[col.id].userLabelName || _gridConfig[col.id].labelCode) {
						displayName = _gridConfig[col.id].labelCode ? $translate.instant('$userLabel.labelId_' + _gridConfig[col.id].labelCode) : _gridConfig[col.id].userLabelName;
						col.name = displayName;
						col.label = displayName;
					}
				}

				ctrl.grpColumns.items.push({
					'label': displayName,
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
			ctrl.groupable = _.sortBy(_.filter(ctrl.options.columns, (item) => {
				return item.grouping !== undefined && item.grouping.generic === true;
			}), 'name');
			const _aggregateColumns = _.filter(ctrl.options.columns, (col) => {
				if (col.domain) {
					return (col.domain === 'quantity' || col.domain === 'integer' || col.domain === 'money') && (col.field !== 'Id' || col.id !== 'id');
				} else {
					return (col.formatter === 'quantity' || col.formatter === 'integer' || col.formatter === 'money') && (col.field !== 'Id' || col.id !== 'id');
				}
			});

			_aggregateColumns.forEach((col) => {
				if(col.id in _gridConfig) {
					col.userLabelName = _gridConfig[col.id].userLabelName;
					col.labelCode = _gridConfig[col.id].labelCode;
				}
				_columns.push({
					id: col.id,
					name: col.name,
					name$tr$: col.name$tr$,
					labelCode: col.labelCode,
					userLabelName: col.userLabelName,
					toolTip: col.toolTip,
					toolTip$tr$: col.toolTip$tr$,
					field: col.field,
					width: col.width || 80,
					resizable: true,
					sortable: true,
					formatter: col.formatter,
					formatterOptions: col.formatterOptions,
					searchable: true,
					hidden: true,
					readonly: _.get(col, 'grouping.aggregateForce', false),
					aggregation: !_.get(col, 'grouping.aggregateForce', false),
					defaultAggregates: col.defaultAggregates,
				});
			});
		}

		function selectionChangedHandler(e, args) {
			var argsInt = {
				'rows': args.rows,
				'item': platformGridAPI.rows.selection({'gridId': ctrl.options.gridData.state})
			};
			ctrl.onSelectionChanged({'evt': e, 'args': argsInt});
		}

		function recoverParent(item) {
			return _.find(platformGridAPI.rows.getRows(ctrl.options.gridData.state), function (parent) {
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

		function markerChanged(markedItem) {
			var isPresent = false;

			if (markedItem.id) {
				isPresent = _.find(_filterList, function (item) {
					return item[item.length - 1].id === markedItem.id;
				});
			} else {
				var cols = platformGridAPI.columns.configuration(ctrl.options.gridData.state);
				var filterCol = _.find(cols.current, {id: 'marker'});
				if (filterCol && filterCol.editorOptions) {
					filterCol.editorOptions.multiSelect = ctrl.options.marker.multiSelect;
					platformGridAPI.columns.configuration(ctrl.options.gridData.state, cols.current);
				}
			}

			if (!ctrl.options.marker.multiSelect) {
				_filterList.length = 0;
				_filterList.push(recoverParents(markedItem));
				platformGridAPI.rows.scrollIntoViewByItem(ctrl.options.gridData.state, markedItem);
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
					platformGridAPI.rows.scrollIntoViewByItem(ctrl.options.gridData.state, _filterList[0][1]);
				} else {
					_filterList.push(recoverParents(markedItem));
				}
			}

			if (ctrl.containerConfig.enableCaching) {
				setTimeout(function () {
					setSessionStorage(platformGridAPI.items.data(ctrl.options.gridData.state));
				}, 100);
			}
		}

		platformGridAPI.events.register(ctrl.options.gridData.state, 'onMarkerSelectionChanged', function markerSelChanged (evt, info) {
			const selected = info.items.map(item => recoverParents(item));
			ctrl.onFilterChanged({filterItems: selected});
		});

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
			const filterParams = cloudDesktopSidebarService.getFilterRequestParams();
			const lastFilterOptions = getSessionStorageFilterOptions();

			if (lastFilterOptions !== null &&
				!_.isEqual(JSON.stringify(filterParams.PinningContext), JSON.stringify(lastFilterOptions.PinningContext) ||
				filterParams.Pattern !== lastFilterOptions.Pattern)) {
				clearSessionStorage();
				platformGridAPI.items.data(ctrl.options.gridData.state, []);
				ctrl.items = [];
			}
		}

		function getPropertyConfig(uuid) {
			const moduleConfig = mainViewService.getViewConfig(uuid);
			return parseConfiguration(moduleConfig ? moduleConfig.Propertyconfig : null);
		}

		function cleanHTML (str, nodes) {
			/**
			 * Convert the string to an HTML document
			 * @return {Node} An HTML document
			 */
			function stringToHTML () {
				let parser = new DOMParser();
				let doc = parser.parseFromString(str, 'text/html');
				return doc.body || document.createElement('body');
			}

			/**
			 * Remove <script> elements
			 * @param  {Node} html The HTML
			 */
			function removeScripts (html) {
				let scripts = html.querySelectorAll('script');
				for (let script of scripts) {
					script.remove();
				}
			}

			/**
			 * Check if the attribute is potentially dangerous
			 * @param  {String}  name  The attribute name
			 * @param  {String}  value The attribute value
			 * @return {Boolean}       If true, the attribute is potentially dangerous
			 */
			function isPossiblyDangerous (name, value) {
				let val = value.replace(/\s+/g, '').toLowerCase();
				if (['src', 'href', 'xlink:href'].includes(name)) {
					if (val.includes('javascript:') || val.includes('data:text/html')) {
						return true;
					}
				}
				if (name.startsWith('on')) {
					return true;
				}
			}

			/**
			 * Remove potentially dangerous attributes from an element
			 * @param  {Node} elem The element
			 */
			function removeAttributes (elem) {

				// Loop through each attribute
				// If it's dangerous, remove it
				let atts = elem.attributes;
				for (let {name, value} of atts) {
					if (!isPossiblyDangerous(name, value)) continue;
					elem.removeAttribute(name);
				}

			}

			/**
			 * Remove dangerous stuff from the HTML document's nodes
			 * @param  {Node} html The HTML document
			 */
			function clean (html) {
				let nodes = html.children;
				for (let node of nodes) {
					removeAttributes(node);
					clean(node);
				}
			}

			// Convert the string to HTML
			let html = stringToHTML();

			// Sanitize it
			removeScripts(html);
			clean(html);

			// If the user wants HTML nodes back, return them
			// Otherwise, pass a sanitized string back
			return nodes ? html.childNodes : html.innerHTML;

		}

		function checkString(value) {
			var checkVal = cleanHTML(value);
			if (checkVal) {
				checkVal = checkVal.replace('&gt;', '>');
				checkVal = checkVal.replace('&lt;', '<');
				checkVal = checkVal.replace('&amp;', '&');
				// remove img tags - not required in filter fields and pose security risk
				checkVal = checkVal.replace(/<img[^>]*>/g, '');

			}
			return checkVal;
		}

		function parseConfiguration(config) {
			let propertyConfig = angular.isString(config) ? JSON.parse(config) : angular.isArray(config) ? config : [];


			_.each(propertyConfig, function (config) {
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

			return propertyConfig;
		}

		/*****************************************************************************************
		 *      Controller public methods
		 *****************************************************************************************/

		ctrl.onAction = function (result) {
			const idx = result.idx;
			const isGeneric = ctrl.options.isGenericGroup(ctrl.groupable[idx]);
			const metadata = platformGenericStructureService.getMetadataByColumn(ctrl.groupable[idx]);
			const maxLevels = isGeneric ? metadata.maxLevels : '0';
			const groupElement = $('<platform-generic-groupitem data-max-levels="' + maxLevels + '" data-is-generic="' + isGeneric + '" data-index="' + idx + '" data-colinfo="$ctrl.groupable[' + idx + ']" on-state-change="$ctrl.onChange(cid,state)" on-close="$ctrl.removeGroup(cid)"></platform-generic-groupitem>');

			ctrl.grpColumns.items[idx].isVisible = false;
			_placeholder.append(groupElement);
			$compile(groupElement)($scope);
			_grouped.push({'cid': ctrl.groupable[idx].id, 'state': ctrl.groupable[idx].state || {}});
			ctrl.onGroupingChange({'cid': ctrl.groupable[idx].id, 'type': 'ADDED'});
			ctrl.grouped = true;
			ctrl.onGroupstateChange({'cid': ctrl.groupable[idx].id, 'state': ctrl.groupable[idx].state});

			if (!ignoreSave) {
				mainViewService.customData(ctrl.options.gridData.state, 'grpInfo', _grouped);
			}

			if (result.value) {
				clearSessionStorage();
				platformGridAPI.items.data(ctrl.options.gridData.state, []);
				ctrl.items = [];
			}
		};

		ctrl.removeGroup = function removeGroup(cid) {
			const idx = _.findIndex(_grouped, {'cid': cid});
			const colIdx = _.findIndex(ctrl.groupable, {'id': cid});

			_grouped.splice(idx, 1);
			ctrl.grpColumns.items[colIdx].isVisible = true;
			ctrl.onGroupingChange({'cid': cid, 'type': 'REMOVED'});
			if (!_grouped.length) {
				ctrl.grouped = false;
				_filteredItems.length = 0;
			}
			mainViewService.customData(ctrl.options.gridData.state, 'grpInfo', _grouped);
			platformGridAPI.items.data(ctrl.options.gridData.state, []);
			ctrl.items = [];
			clearSessionStorage();
		};

		ctrl.onChange = function onChange(cid, state, ignoreSave) {
			const idx = _.findIndex(_grouped, {'cid': cid});

			_grouped[idx].state = state;
			ctrl.onGroupstateChange({'cid': cid, 'state': state});
			if (!ignoreSave) {
				mainViewService.customData(ctrl.options.gridData.state, 'grpInfo', _grouped);
			}
		};

		/*****************************************************************************************
		 *      Lifecycle hooks
		 *****************************************************************************************/

		ctrl.$onInit = function onInit() {
			mainService = $injector.get(mainViewService.getContainerByUuid(ctrl.options.gridData.state).mainService);
			mainService.registerListLoaded(onListLoaded);
			checkSidebarFilter();
			ctrl.containerConfig = mainViewService.getContainerByUuid(ctrl.options.gridData.state);

			// css - 24/10/2019 - Grouping Generic would not work from the Estimate Main UI Configuration Overloads or the Estimate Main Standard Configuration Overloads
			// Workaround for Furkat (ALM# 102246)
			_.each(ctrl.options.columns, function (col) {
				if (col.id === 'estcostriskfk') {
					col.grouping.generic = true;
				}
			});

			if (!ctrl.containerConfig.enableCaching) {
				clearSessionStorage();
			}
			if (!ctrl.options.columns) {
				throw new Error('Groupable columns in options not set.');
			}
			var gridInstance = platformGridAPI.grids.element('id', ctrl.options.gridData.state);

			$scope.$parent.onContentResized(function () {
				platformGridAPI.grids.resize(ctrl.options.gridData.state);
			});

			if (!gridInstance) {
				var gridData = getSessionStorage();

				var grid = {
					data: gridData,
					columns: _columns,
					id: ctrl.options.gridData.state,
					grpContainer: true,
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
				platformGridAPI.items.data(ctrl.options.gridData.state, []);
				ctrl.items = [];
			}

			const propertyConfigs = getPropertyConfig(ctrl.options.gridData.state);
			propertyConfigs.forEach(function (config) {
				_gridConfig[config.id] = config;
			});

			var grouped = mainViewService.customData(ctrl.options.gridData.state, 'grpInfo') || [];

			_placeholder = $element.find('.group-placeholder');

			processColumns();
			prepareGrpItems();

			ignoreSave = true;
			_.each(grouped, function (item) {
				var idx = _.findIndex(ctrl.groupable, {'id': item.cid});
				if (idx > -1) {
					ctrl.groupable[idx].state = item.state;
					ctrl.onAction({idx: idx});
					ctrl.onChange(ctrl.groupable[idx].id, ctrl.groupable[idx].state, true);
				} else {
					console.log('Groupable field no longer groupable. ColumnId=' + item.cid + ' removed');
				}
			});
			ignoreSave = false;
			$scope.$parent['#advconfig'] = true;


			platformGridAPI.events.register(ctrl.options.gridData.state, 'onSelectedRowsChanged', selectionChangedHandler);
		};

		ctrl.$onChanges = function onChanges(changes) {
			if (changes.context) {
				platformGridAPI.items.data(ctrl.options.gridData.state, []);
				ctrl.items = [];

				if (changes.context.currentValue) {
					ctrl.context = _.cloneDeep(changes.context.currentValue);
				} else {
					ctrl.context = false;
				}
			}

			if (changes.items && changes.items.currentValue) {
				let items = _.cloneDeep(changes.items.currentValue);

				platformGridAPI.items.data(ctrl.options.gridData.state, items);

				if (ctrl.containerConfig.enableCaching) {
					setSessionStorage(items);
				}

				if (ctrl.onItemsProcessed) {
					$timeout(()=> {
						const data = platformGridAPI.rows.getRows(ctrl.options.gridData.state);

						ctrl.onItemsProcessed({'data': data});

						const markedObj = _.pickBy(data, function (val) {
							return !!(val.IsMarked);
						});

						if (_.isObject(markedObj) && !_.isEmpty(markedObj)) {
							_.forEach(markedObj, function (val) {
								platformGridAPI.cells.selection({
									gridId: ctrl.options.gridData.state,
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
					}, 100);
				}
			} else {
				platformGridAPI.items.data(ctrl.options.gridData.state, []);
				ctrl.items = [];
			}
		};

		ctrl.$onDestroy = function onDestroy() {
			platformGridAPI.events.unregister(ctrl.options.gridData.state, 'onSelectedRowsChanged', selectionChangedHandler);
			mainService.unregisterListLoaded(onListLoaded);
		};
	}

	PlatformGenericStructureController.$inject = ['$element', '$compile', '$scope', '$injector', '$rootScope', '$timeout', 'platformGridAPI', 'mainViewService', 'cloudDesktopSidebarService', 'platformGenericStructureService', '_', '$', '$translate'];

	const genericStructConfig = {
		bindings: {
			options: '<',
			items: '<',
			context: '<',
			onGroupingChange: '&',
			onGroupstateChange: '&',
			onSelectionChanged: '&',
			onFilterChanged: '&',
			onItemsProcessed: '&'
		},
		'template': ['$templateCache', function ($templateCache) {
			return $templateCache.get('platform/generic-structure.html');
		}],
		'controller': PlatformGenericStructureController
	};

	ng.module('platform').component('platformGenericStructure', genericStructConfig);

})(angular);
