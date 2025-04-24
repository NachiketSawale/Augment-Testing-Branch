/**
 * Created by wui on 11/26/2018.
 */

(function (angular, global) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupDataLookupInputMultiple', [
		'_', '$q',
		'$templateCache',
		'basicsLookupdataLookupKeyService',
		function (_, $q,
			$templateCache,
			basicsLookupdataLookupKeyService) {
			return {
				restrict: 'A',
				template: $templateCache.get('input-multiple.html'),
				controller: ['$scope', '$element', controller],
				link: linker
			};

			function controller($scope, $element) {
				// keys, it is foreign keys by default.
				$scope.keys = [];
				// search text
				$scope.searchText = '';
				// selected lookup items.
				$scope.selectedItems = [];

				// initial selectedItems from model value.
				$scope.render = function (keys) {
					$scope.keys = [];
					$scope.selectedItems = [];

					if (keys.length === 0) {
						return;
					}

					$scope.keys = keys;

					var promises = $scope.keys.map(function (key) {
						var identification = basicsLookupdataLookupKeyService.getIdentification(key, $scope.entity, $scope.settings);
						return $scope.settings.dataView.getItemById(identification);
					});

					$q.all(promises).then(function (reses) {
						$scope.selectedItems = reses;
						$scope.onEditValueChanged.fire(global.event, {
							selectedItems: $scope.selectedItems
						}, $scope);
						if($scope.selectedItems.length){
							$scope.displayItem = $scope.selectedItems[$scope.selectedItems.length - 1];
						}
					});
				};

				// get label for each selected item
				$scope.getLabel = function (dataItem) {
					return $scope.ctrl.selectText(dataItem);
				};

				// on search text change.
				$scope.onChange = function (newValue) {
					if ($scope.settings.autoSearch) {
						$scope.searchString = newValue;
						$scope.defer($scope.search, $scope, [newValue]);
					}
				};

				// search data items.
				$scope.search = function (searchText, paging) {
					var popupReadyPromise = $q.when();
					if (!$scope.settings.disablePopupOnSearch) {
						popupReadyPromise = $scope.ctrl.openPopup();
					}

					popupReadyPromise.then(function popupReadyPromiseFn() {

						$scope.settings.dataView.search({
							searchFields: $scope.settings.inputSearchMembers,
							searchString: searchText,
							isCaseSensitive: $scope.settings.isCaseSensitiveSearch,
							paging: paging
						}).then(function (result) {
							if (result.searchString === searchText) {
								$scope.ctrl.onLookupSearch.fire(global.event, {result: result}, $scope);
							}
						});

					});
				};

				// clear selected items, override function defined in lookup-input-base.js
				$scope.clearValue = function () {
					$scope.keys.length = 0;
					$scope.selectedItems.length = 0;
					$scope.commitViewValue();
				};

				// select a item, override function defined in lookup-input-base.js
				var input = $element.find('input');
				$scope.ctrl.apply = function (dataItem, multiDelValue) {
					$scope.searchText = '';
					$scope.addItem(dataItem, multiDelValue);
					// prevent lost focus
					input.one('blur', function () {
						input.focus();
					});
				};

				// add a selected item
				$scope.addItem = function (dataItem, multiDelValue) {
					if (_.isArray(dataItem)){
						_.forEach(dataItem, function (item) {
							addKey(item);
						});

						_.forEach(multiDelValue, function(item){
							var delItem = _.find($scope.selectedItems, {Id: item.Id});
							$scope.deleteItem(delItem);
						});
					}
					else{
						addKey(dataItem);
					}
				};

				function addKey(dataItem){
					if (!$scope.keys.some(function (key) {
						return key === dataItem.Id;
					})) {
						$scope.selectedItems.push(dataItem);
						// make a copy to trigger platform validator
						$scope.keys = $scope.keys.map(function (key) {
							return key;
						});
						$scope.keys.push(dataItem.Id);
						$scope.commitViewValue();
					}
				}

				// delete a selected item
				$scope.deleteItem = function (dataItem) {
					$scope.selectedItems = $scope.selectedItems.filter(function (item) {
						return item !== dataItem;
					});
					$scope.keys = $scope.keys.filter(function (key) {
						return key !== dataItem.Id;
					});
					$scope.commitViewValue();
				};

				// commit view value to model
				$scope.commitViewValue = function () {
					$scope.onEditValueChanged.fire(global.event, {
						selectedItems: $scope.selectedItems
					}, $scope);
					$scope.ngModelCtrl.$setViewValue($scope.keys);
					$scope.ngModelCtrl.$commitViewValue();
					if($scope.selectedItems.length){
						$scope.displayItem = $scope.selectedItems[$scope.selectedItems.length - 1];
					}
				};
			}

			function linker(scope, element) {
				// override function defined in lookup-input-base.js
				scope.ngModelCtrl.$render = function () {
					var keys = scope.ngModelCtrl.$viewValue;

					if (!angular.isArray(keys)) {
						var oldValue = keys;
						keys = [];
						if (!_.isNil(oldValue)) {
							keys.push(oldValue);
						}
						scope.ngModelCtrl.$setViewValue(keys);
						scope.ngModelCtrl.$commitViewValue();
					}

					scope.render(keys);
				};

				var input = element.find('input');

				element.bind('focus', function () {
					input.focus();
				});

				input.bind('focus', function () {
					element.css({
						outline: '-webkit-focus-ring-color auto 5px'
					});
				});

				input.bind('blur', function () {
					element.css({
						outline: 'none'
					});
				});

				adjustStyle(scope, element);
			}

			function adjustStyle(scope, element) {
				var container = element.parent('.lookup-container');

				container.css({
					height: 'initial'
				});

				scope.$watch(function () {
					return container.find('.input-group-btn .btn').length;
				}, function () {
					container.find('.input-group-btn .btn').css({
						height: '100%'
					});
				});

				function adjust() {
					var searchBox = element.find('.search-box');

					if (searchBox.length) {
						var offsetTop = 0;
						var items = element.find('.multiple-item');
						var container = element.find('.multiple-container');
						var totalWidth = container.width(), occupiedWidth = 0, remainedWidth = 0, minWidth = 40;

						if (items.length) {
							offsetTop = items[items.length - 1].offsetTop;

							items.each(function (i, item) {
								if (offsetTop === item.offsetTop) {
									occupiedWidth += item.offsetWidth;
								}
							});

							var extra = searchBox.outerWidth(true) - searchBox.width();
							remainedWidth = totalWidth - occupiedWidth - extra;

							if (remainedWidth > minWidth) {
								searchBox.css({
									width: minWidth + 'px'
								});
								return;
							}
						}

						searchBox.css({
							width: '100%'
						});
					}
				}

				scope.$watch(function () {
					return element.find('.multiple-item').length;
				}, function () {
					setTimeout(adjust);
				});
			}
		}
	]);

})(angular, window);