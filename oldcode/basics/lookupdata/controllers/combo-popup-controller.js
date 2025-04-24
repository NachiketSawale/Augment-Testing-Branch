/**
 * Created by wui on 7/31/2015.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.lookupdata';

	/* jshint -W072 */ // has too many parameters.
	angular.module(moduleName).controller('basicsLookupdataComboPopupController',[
		'_',
		'$scope',
		'$element',
		'$popupContext',
		'platformObjectHelper',
		'$timeout',
		'keyCodes',
		'$sce',
		function (_,
			$scope,
			$element,
			$popupContext,
			platformObjectHelper,
			$timeout,
			keyCodes,
			$sce) {
			var canvasCount = 50;
			var activeItem = null;
			var rowHeight = 20;
			var renderPromise = null;
			var autoScroll = false;
			var $viewPort = $element.parent();
			var $canvas = $element;
			var dataSource = [];
			var isMultiSelected = false;
			var multiDataItems = [];
			var multiDelItems = [];
			/**
			 * @description: store data items which display in ui actually.
			 */
			$scope.canvasData = [];

			/**
			 * @description get item html for each data item.
			 */
			$scope.getItemHtml = function(lookupItem) {
				var id, snippet = $scope.extractValue(lookupItem, $scope.settings.displayMember);

				snippet = _.escape(snippet);

				if (angular.isFunction($scope.settings.formatter)) {
					id = platformObjectHelper.getValue(lookupItem, $scope.settings.idProperty);
					snippet = $scope.settings.formatter(id, lookupItem, snippet, $scope.settings, $scope.entity);
				}

				if(!_.isNil(snippet) && !angular.isString(snippet)){
					snippet = snippet.toString();
				}

				return $sce.trustAsHtml(snippet);
			};

			/**
			 * @description: event handler, it is triggered when clicking drop down item.
			 */
			$scope.onItemClick = function (item) {
				applySelection(item);
			};

			/**
			 * @description: event handler, it is triggered when mouse enter drop down item.
			 */
			$scope.onMouseEnter = function (item) {
				activeItem = item;
			};

			/**
			 * @description: event handler, it is triggered when mouse down drop down content.
			 */
			$scope.onMouseDown = function (e) {
				// prevent getting focus
				e.preventDefault();
				e.stopPropagation();

				// preventDefault don't work for IE, using "unselectable" solution
				if (e.target.hasAttribute('unselectable')) {
					var unselectable = e.target.getAttribute('unselectable');
					if (unselectable !== 'on') {
						e.target.setAttribute('unselectable', 'on');
						setTimeout(function () {
							e.target.setAttribute('unselectable', unselectable);
						});
					}
				}
				else {
					e.target.setAttribute('unselectable', 'on');
					setTimeout(function () {
						e.target.removeAttribute('unselectable');
					});
				}
			};

			/**
			 * @description: return item element style.
			 */
			$scope.getStyle = function (item) {
				return {
					height: rowHeight + 'px',
					top: item.__index * rowHeight + 'px'
				};
			};

			/**
			 * @description: return active item class.
			 */
			$scope.getSelectedClass = function (item) {
				if (multiDataItems.length > 0) {
					var findItem = _.find(multiDataItems, function (multiDataitem) {
						return multiDataitem.Id === item.Id;
					});

					return findItem ? 'lookup-selected' : '';
				}
				return item === activeItem ? 'lookup-selected' : '';
			};

			/**
			 * @description reload lookup data.
			 */
			$scope.refresh = function () {
				if ($scope.settings.onDataRefresh) { // exists external data refresh callback.
					$scope.settings.onDataRefresh($scope);
				}
				else {
					$scope.settings.dataView.invalidateData();
					refresh('', true);
				}
			};

			/**
			 * update lookup data.
			 * @param data
			 */
			$scope.refreshData = function (data) {
				activeItem = null;
				dataSource = angular.isArray(data) ? data : [];
				dataSource.forEach(function (item, index) {
					item.__index = index;
				});
				updateCanvasHeight();
				updateCanvasData();
			};

			/**
			 * update data source outside.
			 * @param data data array
			 */
			$scope.updateData = function(data) {
				// apply filter, tree building and cache.
				data = $scope.settings.dataView.processData(data);
				$scope.refreshData(data);
				$scope.updateDisplayData();
			};

			$scope.$on('$destroy', function () {
				$viewPort.unbind('scroll', handleScroll);

				if (renderPromise) {
					$timeout.cancel(renderPromise);
					renderPromise = null;
				}
				if ($scope.$close) {
					$scope.$close();
				}

				$popupContext.onLookupSearch.unregister(onLookupSearch);
				$popupContext.onInputKeyDown.unregister(onInputKeyDown);
				$popupContext.onInputKeyUp.unregister(onInputKeyUp);
			});

			initialize();

			function initialize() {
				$viewPort.bind('scroll', handleScroll);
				$popupContext.onLookupSearch.register(onLookupSearch);
				$popupContext.onInputKeyDown.register(onInputKeyDown);
				$popupContext.onInputKeyUp.register(onInputKeyUp);
				refresh($scope.searchString);
			}

			function onLookupSearch(e, args) {
				$scope.refreshData(args.result.matchedList);
				focusRow(args.result.similarItem);
			}

			function onInputKeyDown(e, args) {
				var prevent = function () {
					args.event.preventDefault();
					args.event.stopPropagation();
					args.defaultPrevented = true;
				};

				switch (args.event.keyCode) {
					case keyCodes.ENTER:
					case keyCodes.TAB:
						{
							args.defaultPrevented = true;
							applySelection(activeItem);
						}
						break;
					case keyCodes.DOWN:
						{
							prevent();
							nextRow();
						}
						break;
					case keyCodes.UP:
						{
							prevent();
							prevRow();
						}
						break;
					case keyCodes.CTRL: {
						isMultiSelected = true;
					}
						break;
				}
			}

			function onInputKeyUp(e,args){
				var prevent = function () {
					args.event.preventDefault();
					args.event.stopPropagation();
					args.defaultPrevented = true;
				};

				switch (args.event.keyCode) {
					case keyCodes.CTRL: {
						isMultiSelected = false;
						$scope.$close({
							isOk: true,
							value: multiDataItems,
							delValue: multiDelItems
						});
					}
						break;
				}
			}

			function refresh(searchString, updateInputText) {
				if (searchString) {
					var lastSearchResult = $scope.settings.dataView.searchResult;
					if (lastSearchResult.searchString === searchString) {
						$scope.refreshData(lastSearchResult.matchedList);
						focusRow(lastSearchResult.similarItem);
					}
				}
				else {
					$scope.isLoading = true;
					$scope.settings.dataView.loadData().then(function (data) {
						$scope.isLoading = false;
						$scope.refreshData(data);
						if ($scope.settings && $scope.settings.lookupType === 'multiSelect'){
							multiDelItems.length = 0;
							var keys = $scope.keys;
							_.forEach(keys, function(item){
								var ddItem = _.find(data, {Id: item});
								var mulItem = _.find(multiDataItems, {Id : item});
								if (ddItem && !mulItem){
									// delete ddItem['__index'];
									multiDataItems.push(ddItem);
								}
							});
						}

						focusRow($scope.displayItem);
						if (updateInputText) {
							$scope.updateDisplayData();
						}
					});
				}
			}

			function handleScroll() {
				if (renderPromise) {
					$timeout.cancel(renderPromise);
				}

				if (autoScroll) {
					$scope.$apply(renderCanvas);
				}
				else {
					renderPromise = $timeout(renderCanvas, 50);
				}
			}

			function renderCanvas() {
				autoScroll = false;
				renderPromise = null;
				updateCanvasData();
			}

			function updateCanvasHeight() {
				$canvas.height(rowHeight * dataSource.length);
			}

			function updateCanvasData() {
				const totalCount = dataSource.length;

				if (totalCount) {
					var scrollTop = $viewPort.scrollTop(),
						start = Math.floor(scrollTop / rowHeight),
						end = start + canvasCount;

					if (end > totalCount) {
						end = totalCount;
						start = end - canvasCount;
					}
					if (start < 0) {
						start = 0;
					}

					$scope.canvasData = dataSource.slice(start, end);
				}
				else {
					$scope.canvasData = [];
				}
			}

			function focusRow(dataItem) {
				if (!dataItem) {
					return;
				}

				var id = platformObjectHelper.getValue(dataItem, $scope.settings.idProperty),
					array = dataSource.filter(function (item) {
						return platformObjectHelper.getValue(item, $scope.settings.idProperty) === id;
					});

				if (array.length > 0) {
					var focusedIndex = dataSource.indexOf(array[0]);
					var viewScrollTop = rowHeight * focusedIndex;

					activeItem = array[0];
					$timeout(function () {
						if ($viewPort && viewScrollTop > 0) {
							scrollViewPort(viewScrollTop);
						}
					});
				} else {
					activeItem = null;
				}
			}

			function nextRow() {
				var newActiveIndex = -1;
				var oldActiveIndex = dataSource.indexOf(activeItem);
				var currentScrollTop = $viewPort.scrollTop();

				if (oldActiveIndex === -1 && dataSource.length > 0) {
					newActiveIndex = 0;
				}
				else {
					newActiveIndex = oldActiveIndex + 1;
				}

				if (newActiveIndex >= dataSource.length) {
					return;
				}

				var activeTop = rowHeight * newActiveIndex;
				activeItem = dataSource[newActiveIndex];

				if (activeTop > currentScrollTop + $viewPort.height() - rowHeight) {
					scrollViewPort(currentScrollTop + rowHeight);
				}
			}

			function prevRow() {
				var newActiveIndex = -1;
				var oldActiveIndex = dataSource.indexOf(activeItem);
				var currentScrollTop = $viewPort.scrollTop();

				if (oldActiveIndex === -1 && dataSource.length > 0) {
					newActiveIndex = 0;
				}
				else {
					newActiveIndex = oldActiveIndex - 1;
				}

				if (newActiveIndex < 0) {
					return;
				}

				var activeTop = rowHeight * newActiveIndex;
				activeItem = dataSource[newActiveIndex];

				if (activeTop < currentScrollTop) {
					scrollViewPort(currentScrollTop - rowHeight);
				}
			}

			function scrollViewPort(top) {
				autoScroll = true;
				$viewPort.scrollTop(top);
			}

			function applySelection(dataItem) {
				if ($scope.canSelect(dataItem)) {
					if (isMultiSelected) {
						var index = -1;
						var delIndex = -1;
						for(var i = 0; i < multiDataItems.length; i++){
							if (multiDataItems[i].Id === dataItem.Id){
								index = i;
								break;
							}
						}

						for(var i = 0; i < multiDelItems.length; i++){
							if (multiDelItems[i].Id === dataItem.Id){
								delIndex = i;
								break;
							}
						}

						// delete dataItem['__index'];
						if (index === -1){
							multiDataItems.push(dataItem);
							multiDelItems.splice(delIndex, 1);
						}
						else{
							multiDataItems.splice(index,1);
							multiDelItems.push(dataItem);
						}
					} else {
						$scope.$close({
							isOk: true,
							value: dataItem
						});
					}
				}
			}
		}
	]);

})(angular);