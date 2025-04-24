(function (angular) {
	'use strict';
	// jshint -W109
	// jshint -W116
	angular.module('platform')
		.directive('treecontrol', ['$window', '$rootScope', '$compile', 'platformModalService', 'cloudDesktopEnhancedFilterService',
			function ($window, $rootScope, $compile, platformModalService, cloudDesktopEnhancedFilterService) {

				function ensureDefault(obj, prop, value) {
					if (!obj.hasOwnProperty(prop))
						obj[prop] = value;
				}

				return {
					restrict: 'EA',
					require: 'treecontrol',
					transclude: true,
					scope: {
						treeModel: '=',
						selectedNode: '=?',
						expandedNodes: '=?',
						onSelection: '&',
						onNodeDblClick: '&',
						onNodeToggle: '&',
						nodeIcoClass: '&',
						options: '=?',
						orderBy: '@',
						reverseOrder: '@',
						filterExpression: '=?',
						filterComparator: '=?',
						itemName: '@'
					},
					controller: ['$scope', function ($scope) {

						function defaultIsLeaf(node) {
							return !node[$scope.options.nodeChildren] || node[$scope.options.nodeChildren].length === 0;
						}

						function defaultEquality(a, b) {
							if (a === undefined || b === undefined)
								return false;
							a = angular.copy(a);
							a[$scope.options.nodeChildren] = [];
							b = angular.copy(b);
							b[$scope.options.nodeChildren] = [];
							return angular.equals(a, b);
						}

						$scope.options = $scope.options || {};
						ensureDefault($scope.options, 'nodeChildren', 'children');
						ensureDefault($scope.options, 'dirSelectable', 'true');
						ensureDefault($scope.options, 'equality', defaultEquality);
						ensureDefault($scope.options, 'isLeaf', defaultIsLeaf);

						$scope.expandedNodes = $scope.expandedNodes || [];
						$scope.expandedNodesMap = {};
						for (var i = 0; i < $scope.expandedNodes.length; i++) {
							$scope.expandedNodesMap['' + i] = $scope.expandedNodes[i];
						}
						$scope.parentScopeOfTree = $scope.$parent;

						$scope.headClass = function (node) {
							var resultingClass = '';

							if ($scope.options.isLeaf(node)) {
								resultingClass = 'tree-leaf';
							} else {
								if ($scope.expandedNodesMap[this.$id]) {
									resultingClass = 'tree-expanded';
								} else {
									resultingClass = 'tree-collapsed';
								}
							}

							return resultingClass + ' ' + $scope.itemName + '_' + node.id;
						};

						$scope.iIcoByNodeClass = function (node) {
							if ($scope.nodeIcoClass)
								return $scope.nodeIcoClass({node: node});

							return '';
						};

						$scope.nodeExpanded = function () {
							return !!$scope.expandedNodesMap[this.$id];
						};

						$scope.nodeDblClick = function (currentNode) { // jshint ignore:line
							// console.log('double click .....');
							if ($scope.onNodeDblClick)
								$scope.onNodeDblClick({node: $scope.selectedNode});

						};

						$scope.selectNodeHead = function (selectedNode, event) { // jshint ignore:line
							var expanding = $scope.expandedNodesMap[this.$id] === undefined;
							$scope.expandedNodesMap[this.$id] = (expanding ? this.node : undefined);
							if (expanding) {
								$scope.expandedNodes.push(this.node);
							} else {
								var index;
								for (var i = 0; (i < $scope.expandedNodes.length) && !index; i++) {
									if ($scope.options.equality($scope.expandedNodes[i], this.node)) {
										index = i;
									}
								}
								if (index !== undefined)
									$scope.expandedNodes.splice(index, 1);
							}
							if ($scope.onNodeToggle)
								$scope.onNodeToggle({node: this.node, expanded: expanding});
						};

						$scope.selectNodeLabel = function (selectedNode, event) {
							if (selectedNode[$scope.options.nodeChildren] && selectedNode[$scope.options.nodeChildren].length > 0 && !$scope.options.dirSelectable) {
								this.selectNodeHead();
							} else {
								if ($scope.selectedNode !== selectedNode) {
									$scope.selectedNode = selectedNode;
								} else {
									$scope.selectedNode = undefined;
								}
								if ($scope.onSelection)
									$scope.onSelection({node: $scope.selectedNode});
							}
						};

						$scope.selectedClass = function () {
							return isEqualsNodes(this.node) ? 'tree-selected' /* + injectSelectionClass */ : '';
						};

						function isEqualsNodes(node) {
							/*
							In Estimate WIC BoQs Container has problems with compare with objects.
							Therefore there is the possibility to add a key called 'valueMember'(as in domain-controls).
							The content decides which key is compared to each other.
							There isn't existing valueMember, then compare as usual.
						 */

							var isEqualNodes = false;
							// selectedNode is sometimes NULL
							if ($scope.selectedNode && $scope.selectedNode.hasOwnProperty($scope.options.valueMember) && node.hasOwnProperty($scope.options.valueMember)) {
								isEqualNodes = angular.equals(node[$scope.options.valueMember], $scope.selectedNode[$scope.options.valueMember]);
							} else {
								isEqualNodes = angular.equals(node, $scope.selectedNode);
							}

							return isEqualNodes;
						}

						var template =
							'<ul><li ng-repeat="node in node.' + $scope.options.nodeChildren + ' | filter:filterExpression:filterComparator | orderBy:orderBy:reverseOrder" ng-class="headClass(node)" >' +
							'<div class="flex-box" style="padding: 0px;">' +
							'<i class="tree-branch-head" ng-click="selectNodeHead(node,$event)" ></i>' +
							'<i class="tree-leaf-head"></i>' +
							'<div class="tree-label flex-element" ng-class="selectedClass()" ng-click="selectNodeLabel(node,$event)" ng-dblclick="nodeDblClick(node)" tree-transclude></div>' +
							'</div>' +
							'<treeitem ng-if="nodeExpanded()"></treeitem>' +
							'</li></ul>';

						this.template = $compile(template);
					}],
					compile: function (element, attrs, childTranscludeFn) {

						return function (scope, element, attrs, treemodelCntr) {

							var watchTreeModel = scope.$watch('treeModel', function updateNodeOnRootScope(newValue) {

								if (angular.isArray(newValue)) {
									if (angular.isDefined(scope.node) && angular.equals(scope.node[scope.options.nodeChildren], newValue))
										return;
									scope.node = {};
									scope.synteticRoot = scope.node;
									scope.node[scope.options.nodeChildren] = newValue;
								} else {
									if (angular.equals(scope.node, newValue))
										return;
									scope.node = newValue;
								}
							});

							var watchExpandedNodes = scope.$watchCollection('expandedNodes', function (newValue) {

								var notFoundIds = 0;
								var newExpandedNodesMap = {};
								var $liElements = element.find('li');
								var existingScopes = [];
								// find all nodes visible on the tree and the scope $id of the scopes including them
								angular.forEach($liElements, function (liElement) {
									var $liElement = angular.element(liElement);
									var liScope = $liElement.scope();  // issue when running in none debug mode: see issue 101
									existingScopes.push(liScope);
								});
								// iterate over the newValue, the new expanded nodes, and for each find it in the existingNodesAndScopes
								// if found, add the mapping $id -> node into newExpandedNodesMap
								// if not found, add the mapping num -> node into newExpandedNodesMap
								angular.forEach(newValue, function (newExNode) {
									var found = false;
									for (var i = 0; (i < existingScopes.length) && !found; i++) {
										var existingScope = existingScopes[i];
										if (scope.options.equality(newExNode, existingScope.node)) {
											newExpandedNodesMap[existingScope.$id] = existingScope.node;
											found = true;
										}
									}
									if (!found)
										newExpandedNodesMap[notFoundIds++] = newExNode;
								});
								scope.expandedNodesMap = newExpandedNodesMap;
							});

							// Rendering template for a root node
							treemodelCntr.template(scope, function (clone) {
								element.html('').append(clone);
							});
							// save the transclude function from compile (which is not bound to a scope as apposed to the one from link)
							// we can fix this to work with the link transclude function with angular 1.2.6. as for angular 1.2.0 we need
							// to keep using the compile function
							scope.$treeTransclude = childTranscludeFn;

							// unregister
							element.on('$destroy', function () {
									watchTreeModel();
									watchExpandedNodes();
								}
							);

						};
					}
				};
			}])
		.directive('treeitem', function () {
			return {
				restrict: 'E',
				require: '^treecontrol',
				link: function (scope, element, attrs, treemodelCntr) {
					// Rendering template for the current node
					treemodelCntr.template(scope, function (clone) {
						element.html('').append(clone);
					});
				}
			};
		})
		.directive('treeTransclude', function () {
			return {
				link: function (scope, element /* , attrs, controller */) {
					if (!scope.options.isLeaf(scope.node)) {
						angular.forEach(scope.expandedNodesMap, function (node, id) {
							if (scope.options.equality(node, scope.node)) {
								scope.expandedNodesMap[scope.$id] = scope.node;
								scope.expandedNodesMap[id] = undefined;
							}
						});
					}
					if (scope.options.equality(scope.node, scope.selectedNode)) {
						scope.selectedNode = scope.node;
					}

					// create a scope for the transclusion, whos parent is the parent of the tree control
					scope.transcludeScope = scope.parentScopeOfTree.$new();
					scope.transcludeScope.node = scope.node;
					scope.transcludeScope.$parentNode = (scope.$parent.node === scope.synteticRoot) ? null : scope.$parent.node;
					scope.transcludeScope.$index = scope.$index;
					scope.transcludeScope.$first = scope.$first;
					scope.transcludeScope.$middle = scope.$middle;
					scope.transcludeScope.$last = scope.$last;
					scope.transcludeScope.$odd = scope.$odd;
					scope.transcludeScope.$even = scope.$even;
					scope.$on('$destroy', function () {
						scope.transcludeScope.$destroy();
					});

					scope.$treeTransclude(scope.transcludeScope, function (clone) {
						element.empty();
						element.append(clone);
					});
				}
			};
		});
})(angular);
