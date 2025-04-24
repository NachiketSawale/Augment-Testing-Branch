/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).component('basicsMaterialFilterItem', {
		templateUrl: 'basics.material/templates/material-lookup/material-filter-item-component.html',
		bindings: {
			definition: '<',
			isOpenOptions: '<',
			search: '&',
			remove: '&'
		},
		controller: [
			'$scope',
			'$http',
			'$translate',
			'basicsLookupdataPopupService',
			'basicsMaterialFilterType',
			'basicsMaterialFilterOperator',
			'basicsMaterialFilterId',
			'cloudCommonGridService',
			'basicsMaterialFilterSource',
			'platformDomainList',
			'materialFilterEvent',
			function (
				$scope,
				$http,
				$translate,
				basicsLookupdataPopupService,
				basicsMaterialFilterType,
				basicsMaterialFilterOperator,
				basicsMaterialFilterId,
				cloudCommonGridService,
				basicsMaterialFilterSource,
				platformDomainList,
				materialFilterEvent
			) {
				const remove = this.remove;
				const search = this.search;
				const isOpenOptions = this.isOpenOptions;
				const popupHelper = basicsLookupdataPopupService.getToggleHelper();
				const operatorKeys = ['equals', 'lessThan', 'greaterThan', 'range', 'contains', 'startsWith', 'endsWith'];

				$scope.definition = this.definition;

				if (!$scope.definition.Factors) {
					$scope.definition.Factors = [];
				}

				$scope.getColumn = function () {
					return $scope.definition.Id;
				};

				$scope.getCondition = function () {
					let key = operatorKeys[this.definition.Operator - 1];

					if (!key) {
						return '';
					}

					if ([basicsMaterialFilterType.boolean, basicsMaterialFilterType.list].includes(this.definition.Type)) {
						key = 'is';
					} else if (this.definition.Type === basicsMaterialFilterType.date) {
						switch (this.definition.Operator) {
							case basicsMaterialFilterOperator.equals:
								key = 'on';
								break;
							case basicsMaterialFilterOperator.range:
								return ':';
							case basicsMaterialFilterOperator.lessThan:
								key = 'upTo';
								break;
							case basicsMaterialFilterOperator.greaterThan:
								key = 'from';
								break;
						}
					}

					return 'basics.material.lookup.condition.' + key;
				};

				const datePattern = platformDomainList.dateutc.format;

				function formatDate(value) {
					return moment.utc(value).format(datePattern);
				}

				$scope.hasFactors = function () {
					return $scope.definition.Factors?.length > 0;
				};

				$scope.getValue = function () {
					let value = '';

					if (!$scope.definition.Factors.length) {
						return value;
					}

					switch ($scope.definition.Type) {
						case basicsMaterialFilterType.numeric: {
							if ($scope.definition.Operator === basicsMaterialFilterOperator.range) {
								value = `${$scope.definition.Factors[0]} - ${$scope.definition.Factors[1]}`;
							} else {
								value = $scope.definition.Factors[0];
							}
						}
							break;
						case basicsMaterialFilterType.char: {
							value = $scope.definition.Factors[0];
						}
							break;
						case basicsMaterialFilterType.boolean: {
							value = $translate.instant('basics.material.lookup.condition.' + ($scope.definition.Factors[0] ? 'yes' : 'no'));
						}
							break;
						case basicsMaterialFilterType.list:
						case basicsMaterialFilterType.grid: {
							value = getListValue();
						}
							break;
						case basicsMaterialFilterType.date: {
							if ($scope.definition.Operator === basicsMaterialFilterOperator.range) {
								value = `${formatDate($scope.definition.Factors[0])} - ${formatDate($scope.definition.Factors[1])}`;
							} else {
								value = formatDate($scope.definition.Factors[0]);
							}
						}
							break;
					}

					return value;
				};

				function getListValue() {
					let descriptions = [];

					if ($scope.definition.Source === basicsMaterialFilterSource.attribute) {
						return $scope.definition.Factors?.join(', ');
					}

					if ($scope.definition.Descriptions) {
						descriptions = $scope.definition.Descriptions;
						return descriptions?.join(', ');
					}

					const list = getFlatList();

					if (list.length > 0) {
						descriptions = $scope.definition.Factors?.map(e => {
							return list.find(i => i.Id === e)?.Description;
						});

						return descriptions?.join(', ');
					}

					let missingFactors = [];
					const displayItems = getDisplayItems();

					descriptions = $scope.definition.Factors?.map(e => {
						const displayItem = displayItems.find(i => i.Id === e);

						if (displayItem) {
							return displayItem.Description;
						} else {
							missingFactors.push(e);
						}

						return e;
					});

					if (missingFactors.length > 0) {
						if (!$scope.definition.LoadingFactors) {
							$scope.definition.LoadingFactors = [];
						}

						missingFactors = _.differenceBy(missingFactors, $scope.definition.LoadingFactors);

						if (missingFactors.length > 0) {
							$scope.definition.LoadingFactors.push(...missingFactors);
							loadDisplayItems(missingFactors);
						}
					}

					return descriptions?.join(', ');
				}

				function loadDisplayItems(missingFactors) {
					return $http.post(globals.webApiBaseUrl + 'basics/material/filter/filterItems', {
						FilterId: $scope.definition.Id,
						FilterFactors: missingFactors,
						FilterTableName: $scope.definition.ListEndpoint?.Payload?.TableName
					}).then(res => {
						if (res.data.length > 0) {
							const displayItems = getDisplayItems();
							displayItems.push(...res.data);
						}
					});
				}

				function getDisplayItems() {
					if (!$scope.definition.DisplayItems) {
						$scope.definition.DisplayItems = [];
					}
					return $scope.definition.DisplayItems;
				}

				function getFlatList() {
					const flatResList = [];
					if ($scope.definition.List) {
						cloudCommonGridService.flatten($scope.definition.List, flatResList, 'ChildItems');
					}
					return flatResList;
				}

				$scope.getNumber = function () {
					if ($scope.definition.Type === basicsMaterialFilterType.list) {
						return $scope.definition.Factors.length;
					} else if ($scope.definition.Type === basicsMaterialFilterType.grid) {
						return getNumberForGrid();
					}
					return 0;
				}

				$scope.removeFilter = function () {
					remove();
				};

				$scope.$on(materialFilterEvent.filterOpen, (e, id) => {
					if ($scope.definition.Id === id) {
						openPopup();
					}
				});

				$scope.openFilter = function (e, element) {
					element = element ?? e.currentTarget;
					const popupOptions = {
						focusedElement: angular.element(element),
						scope: $scope.$new(true),
						plainMode: true,
						hasDefaultWidth: false,
						resolve: {
							definition: function () {
								return $scope.definition;
							}
						}
					};

					if ($scope.definition.Type === basicsMaterialFilterType.numeric) {
						popupOptions.templateUrl = globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-numeric-component.html';
						popupOptions.controller = 'basicsMaterialFilterNumericController';
					} else if ($scope.definition.Type === basicsMaterialFilterType.char) {
						popupOptions.templateUrl = globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-char-component.html';
						popupOptions.controller = 'basicsMaterialFilterCharController';
					} else if ($scope.definition.Type === basicsMaterialFilterType.boolean) {
						popupOptions.templateUrl = globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-boolean-component.html';
						popupOptions.controller = 'basicsMaterialFilterBooleanController';
					} else if ($scope.definition.Type === basicsMaterialFilterType.list) {
						popupOptions.templateUrl = globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-list-component.html';
						popupOptions.controller = 'basicsMaterialFilterListController';
					} else if ($scope.definition.Type === basicsMaterialFilterType.grid) {
						popupOptions.plainMode = false;
						popupOptions.width = 400;
						popupOptions.resizeable = true;
						popupOptions.templateUrl = globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-grid-component.html';
						popupOptions.controller = 'basicsMaterialFilterGridController';
					} else if ($scope.definition.Type === basicsMaterialFilterType.date) {
						popupOptions.templateUrl = globals.appBaseUrl + 'basics.material/templates/material-lookup/material-filter-date-component.html';
						popupOptions.controller = 'basicsMaterialFilterDateController';
					}

					const popup = popupHelper.toggle(popupOptions);

					if (popup) {
						popup.result.then(function (result) {
							if (result?.isOk) {
								$scope.definition.Operator = result.definition.Operator;
								$scope.definition.Factors = result.definition.Factors;
								$scope.definition.Descriptions = result.definition.Descriptions;
								search();
							}
						});
					}
				};

				function clearDefinitionValue() {
					$scope.definition.Operator = 0;
					$scope.definition.Factors = [];
					$scope.definition.Descriptions = null;
					getFlatList().forEach(function (i) {
						i.IsSelected = false;
					});
				}

				function getNumberForGrid() {
					let num = 0;
					if (basicsMaterialFilterType.grid === $scope.definition.Type) {
						let needToAccumulateItemIds = _.clone($scope.definition.Factors);
						const flatList = getFlatList();

						while (needToAccumulateItemIds.length > 0) {
							num++;
							const itemId = needToAccumulateItemIds.shift();
							const item = flatList.find(i => i.Id === itemId);
							if (item?.ChildItems?.length) {
								const childIds = getChildIds(item);
								const isAllChildSelected = childIds.every(element => $scope.definition.Factors.includes(element));
								if (isAllChildSelected) {
									needToAccumulateItemIds = needToAccumulateItemIds.filter(function (selectedItem) {
										return !childIds.includes(selectedItem);
									})
								}
							}
						}
					}
					return num;
				}

				function getChildIds(node) {
					return node.ChildItems ?
						node.ChildItems.reduce((acc, child) => acc.concat(getChildIds(child)),
							node.ChildItems.map(function (child) {
								return child.Id;
							})) :
						[];
				}

				function openPopup() {
					const className = 'material-filter-' + $scope.definition.Id;
					setTimeout(() => {
						const filterElement = document.getElementsByClassName(className)[0];
						if (filterElement) {
							$scope.openFilter(undefined, filterElement);
						}
					});
				}

				// $onInit hook
				this.$onInit = function () {
					console.log('Component initialized');
				};

				// $postLink hook
				this.$postLink = function () {
					if (isOpenOptions) {
						openPopup();
					}
				};

				// $onDestroy hook
				this.$onDestroy = function () {
					clearDefinitionValue();
					popupHelper.hide();
					console.log('Component is being destroyed');
				};
			}],
		controllerAs: 'basicsMaterialFilterItem'
	});

})(angular);