/**
 * Created by wui on 9/21/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).constant('basicsLookupdataVirtualListOptions', {
		// id property
		idProperty: 'Id',
		// display property
		displayMember: 'Description',
		// data item count to render to canvas element
		renderCount: 50,
		// data item element height in px
		rowHeight: 20,
		// formatter
		formatItem: null,
		// callback on item click
		onItemClick: null,
		// call on list changed.
		afterDataRefreshed: null
	});

	angular.module(moduleName).directive('basicsLookupdataVirtualList', ['$sce', '$timeout', '$templateCache', 'platformObjectHelper', 'basicsLookupdataVirtualListOptions',
		function ($sce, $timeout, $templateCache, platformObjectHelper, defaults) {

			function controller($scope, $element) {
				var self = this;
				var settings = _.merge({}, defaults, $scope.options);
				var activeItem = null;
				var renderPromise = null;
				var autoScroll = false;
				var $viewPort = $element.parent();
				var $canvas = $element;

				/**
                 * @description: store data items which display in ui actually.
                 */
				$scope.renderList = [];

				/**
                 * @description get item html for each data item.
                 */
				$scope.getItemHtml = function(dataItem) {
					var html;

					if (angular.isFunction(settings.formatItem)) {
						html = settings.formatItem(dataItem);
					}
					else{
						html = platformObjectHelper.getValue(dataItem, settings.displayMember);
					}

					return $sce.trustAsHtml(html);
				};

				/**
                 * @description: event handler, it is triggered when clicking drop down item.
                 */
				$scope.onItemClick = function (item) {
					if (angular.isFunction(settings.onItemClick)) {
						settings.onItemClick(item);
					}
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
						height: settings.rowHeight + 'px',
						top: item.__index * settings.rowHeight + 'px'
					};
				};

				/**
                 * @description: return active item class.
                 */
				$scope.getSelectedClass = function (item) {
					return item === activeItem ? 'lookup-selected' : '';
				};

				/**
                 * update lookup data.
                 * @param data
                 */
				$scope.refreshData = function (data) {
					activeItem = null;
					$scope.list = angular.isArray(data) ? data : [];
					$scope.list.forEach(function (item, index) {
						item.__index = index;
					});
					updateCanvasHeight();
					updateRenderList();
				};

				$scope.$on('$destroy', function () {
					$viewPort.unbind('scroll', handleScroll);

					if (renderPromise) {
						$timeout.cancel(renderPromise);
						renderPromise = null;
					}
				});

				self.selectById = function (id) {
					var result = $scope.list.filter(function (dataItem) {
						return platformObjectHelper.getValue(dataItem, settings.idProperty) === id;
					});

					if(result.length){
						focusRow(result[0]);
					}
				};

				initialize();

				function initialize() {
					$viewPort.bind('scroll', handleScroll);

					$scope.$watch('list', function () {
						prepareList();
					});

					$scope.$watchCollection('list', function () {
						prepareList();
					});
				}

				function prepareList() {
					activeItem = null;

					if(!angular.isArray($scope.list)){
						$scope.list = [];
					}

					$scope.list.forEach(function (item, index) {
						item.__index = index;
					});

					updateCanvasHeight();
					updateRenderList();

					if(angular.isFunction(settings.afterDataRefreshed)){
						settings.afterDataRefreshed($scope, self);
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
					updateRenderList();
				}

				function updateCanvasHeight() {
					$canvas.height(settings.rowHeight * $scope.list.length);
				}

				function updateRenderList() {
					var totalCount = $scope.list.length;

					if (totalCount) {
						var scrollTop = $viewPort.scrollTop(),
							start = Math.floor(scrollTop / settings.rowHeight),
							end = start + settings.renderCount;

						if (end > totalCount) {
							end = totalCount;
							start = end - settings.renderCount;
						}
						if (start < 0) {
							start = 0;
						}
						$scope.renderList = $scope.list.slice(start, end);
					}
					else {
						$scope.renderList = [];
					}
				}

				function focusRow(dataItem) {
					if (!dataItem) {
						return;
					}

					var id = platformObjectHelper.getValue(dataItem, settings.idProperty),
						array = $scope.list.filter(function (item) {
							return platformObjectHelper.getValue(item, settings.idProperty) === id;
						});

					if (array.length > 0) {
						var focusedIndex = $scope.list.indexOf(array[0]);
						var viewScrollTop = settings.rowHeight * focusedIndex;

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
					var oldActiveIndex = $scope.list.indexOf(activeItem);
					var currentScrollTop = $viewPort.scrollTop();

					if (oldActiveIndex === -1 && $scope.list.length > 0) {
						newActiveIndex = 0;
					}
					else {
						newActiveIndex = oldActiveIndex + 1;
					}

					if (newActiveIndex >= $scope.list.length) {
						return;
					}

					var activeTop = settings.rowHeight * newActiveIndex;
					activeItem = $scope.list[newActiveIndex];

					if (activeTop > currentScrollTop + $viewPort.height() - settings.rowHeight) {
						scrollViewPort(currentScrollTop + settings.rowHeight);
					}
				}

				function prevRow() {
					var newActiveIndex = -1;
					var oldActiveIndex = $scope.list.indexOf(activeItem);
					var currentScrollTop = $viewPort.scrollTop();

					if (oldActiveIndex === -1 && $scope.list.length > 0) {
						newActiveIndex = 0;
					}
					else {
						newActiveIndex = oldActiveIndex - 1;
					}

					if (newActiveIndex < 0) {
						return;
					}

					var activeTop = settings.rowHeight * newActiveIndex;
					activeItem = $scope.list[newActiveIndex];

					if (activeTop < currentScrollTop) {
						scrollViewPort(currentScrollTop - settings.rowHeight);
					}
				}

				function scrollViewPort(top) {
					autoScroll = true;
					$viewPort.scrollTop(top);
				}
			}

			return {
				restrict: 'A',
				template: $templateCache.get('virtual-list.html'),
				scope: {
					list: '=',
					options: '='
				},
				controller: ['$scope', '$element', controller]
			};
		}
	]);

})(angular);