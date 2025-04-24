/**
 * Created by wui on 7/31/2015.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).controller('basicsLookupdataTreeControlController',['$scope', '$popupContext', 'platformObjectHelper', 'keyCodes',
		'basicsLookupdataTreeHelper',
		function ($scope, $popupContext, platformObjectHelper, keyCodes, basicsLookupdataTreeHelper) {
			$scope.treeOptions = {
				nodeChildren: 'children',
				dirSelectable: true,
				expandedNodes: true,
				orderBy: 'Id'
			};

			$scope.classByType = function () {
				return 'ico-comp-root';
			};

			$scope.getDisplayText = function (node) {
				return platformObjectHelper.getValue(node, $scope.settings.displayMember);
			};

			$scope.onFocus = function (node) {
				$scope.selectedNode = node;
			};

			/*jshint -W121*/
			$scope.onSelection = function () {
				$scope.$close({
					isOk: true,
					//value: node todo: can't get node data if set $scope.selectedNode outside, maybe tree control problem.
					value: $scope.selectedNode
				});
			};

			$scope.$on('$destroy', function () {
				$popupContext.onInputChange.unregister(onInputChange);
				$popupContext.onInputKeyDown.unregister(onInputKeyDown);
			});

			init();

			function init() {
				$popupContext.onInputChange.register(onInputChange);
				$popupContext.onInputKeyDown.register(onInputKeyDown);
				refresh($scope.searchString);
			}

			function refresh(searchString) {
				if (searchString) {
					$scope.settings.dataView.search({
						searchString: searchString,
						searchField: $scope.settings.displayMember,
						isCaseSensitive: $scope.settings.isCaseSensitiveSearch
					}).then(function (result) {
						$scope.dataForTheTree = result.matchedTree;
						$scope.selectedNode = result.similarItem;
					});
				}
				else {
					$scope.settings.dataView.loadData().then(function (data) {
						$scope.dataForTheTree = data;
						setFocusedNode();
					});
				}
			}

			function setFocusedNode() {
				if (!$scope.ngModel) {
					return;
				}

				var context = {
					treeOptions: {childProp: 'ChildItems'},
					judgeFn: function (node) {
						return platformObjectHelper.getValue(node, $scope.settings.valueMember) === $scope.ngModel;
					}
				};
				$scope.selectedNode = basicsLookupdataTreeHelper.findNode($scope.dataForTheTree, context);
			}

			function onInputChange(e, args) {
				refresh(args.newValue);
			}

			function onInputKeyDown(e, args) {
				var event = args.event;

				switch (event.keyCode) {
					case keyCodes.ENTER:
					case keyCodes.TAB:
						{
							event.stopPropagation();
							$scope.$close({
								isOk: true,
								value: $scope.selectedNode
							});
						}
						break;
				}
			}

		}
	]);

})(angular);