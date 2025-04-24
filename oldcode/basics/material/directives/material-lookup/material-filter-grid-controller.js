(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterGridController', [
		'$scope', '$translate', '$http', '$timeout', 'platformGridAPI', 'definition', 'basicsMaterialFilterOperator', 'cloudCommonGridService',
		function ($scope, $translate, $http, $timeout, platformGridAPI, definition, basicsMaterialFilterOperator, cloudCommonGridService) {
			$scope.definition = angular.copy(definition);

			$scope.definition.Operator = basicsMaterialFilterOperator.equals;

			$scope.apply = function () {
				const flatList = getFlatList();

				if (flatList.length) {
					const selectedItems = flatList.filter(e => e.IsSelected);
					$scope.definition.Factors = selectedItems.map(e => e.Id);
					$scope.definition.Descriptions = selectedItems.map(e => e.Description);
				} else {
					$scope.definition.Factors = [];
					$scope.definition.Descriptions = [];
				}

				$scope.$close({
					isOk: true,
					definition: $scope.definition
				});
			};

			$scope.getSelectedCount = function () {
				return getFlatList().filter(e => e.IsSelected).length;
			};

			$scope.getTotalCount = function () {
				return getFlatList().length;
			};

			$scope.clear = function () {
				getFlatList().forEach(e => e.IsSelected = false);
				$scope.apply();
			};

			$scope.isLoading = false;
			$scope.gridId = 'bfe51b8bc6227cb2a54f4fb9b7a027a9';

			const endpoint = $scope.definition.ListEndpoint;

			function setupGrid() {
				$scope.gridData = {
					state: $scope.gridId
				};

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					const resultGridConfig = {
						columns: [
							{
								id: 'IsSelected',
								field: 'IsSelected',
								name: '',
								formatter: 'boolean',
								editor: 'boolean',
								width: 40,
								validator: validateIsSelected
							}
						],
						data: [],
						id: $scope.gridId,
						options: {
							tree: true,
							indicator: false,
							parentProp: 'ParentFk',
							childProp: 'ChildItems',
							idProperty: 'Id',
							hierarchyEnabled: true,
							editorLock: new Slick.EditorLock(),
							initialState: 'collapsed',
							treeColumnDescription: ['Description'],
							treeWidth: 360,
							treeHeaderCaption: $translate.instant('cloud.common.entityStructure'),
							showDescription: true
						}
					};
					platformGridAPI.grids.config(resultGridConfig);
				}
			}

			function loadList() {
				$scope.isLoading = true;

				if (definition.List) {
					$timeout(() => {
						setGridData($scope.definition.List);
						$scope.isLoading = false;
					}, 200);
					return;
				}

				$http[endpoint.UsePost ? 'post' : 'get'](globals.webApiBaseUrl + endpoint.Url, endpoint.Payload).then(r => {
					definition.List = r.data;
					$scope.definition.List = angular.copy(r.data);
					setGridData($scope.definition.List);
					$scope.isLoading = false;
				});
			}

			function setGridData(items) {
				const flatList = getFlatList();

				if (flatList?.length && $scope.definition.Factors?.length) {
					flatList.forEach(e => {
						e.IsSelected = $scope.definition.Factors.includes(e.Id);
					});
				}

				platformGridAPI.grids.invalidate($scope.gridId);
				platformGridAPI.items.data($scope.gridId, items);
				platformGridAPI.filters.showSearch($scope.gridId, true, true);
			}

			function getFlatList() {
				const flatResList = [];
				if ($scope.definition.List) {
					cloudCommonGridService.flatten($scope.definition.List, flatResList, 'ChildItems');
				}
				return flatResList;
			}

			function validateIsSelected(entity, value, model) {
				updateValueToChildren(entity, value, model);
				platformGridAPI.grids.refresh($scope.gridId, true);
				return true;
			}

			function updateValueToChildren(item, val, model) {
				item[model] = val;
				if (_.isArray(item.ChildItems)) {
					item.ChildItems.forEach(function(child) {
						updateValueToChildren(child, val, model);
					});
				}
			}

			setupGrid();
			loadList();

		}
	]);

})(angular);