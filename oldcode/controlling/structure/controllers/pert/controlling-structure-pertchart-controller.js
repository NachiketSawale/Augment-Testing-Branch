/**
 * Created by janas on 12.01.2015.
 */

/* jslint nomen:true */
/* jslint unparam: true */

(function () {

	'use strict';
	var moduleName = 'controlling.structure',
		angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name controllingStructurePertChartController
	 * @function
	 *
	 * @description
	 * Controller for the pert chart view of controlling units.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('controllingStructurePertchartController',
		['globals', '_', '$scope', '$log', 'platformModalService', 'controllingStructureMainService', 'projectMainForCOStructureService', 'controllingStructurePertSettingsController', 'pertConfig',
			function (globals, _, $scope, $log, platformModalService, controllingStructureMainService, projectMainForCOStructureService, controllingStructurePertSettingsController, pertConfig) {

				// pert svg properties
				var opt = {propChildren: 'ControllingUnits', dispSubTree: false};

				$scope.pertChartWidth = 0;
				$scope.pertChartHeight = 0;
				$scope.setChartSize = function (width, height) {
					$scope.pertChartWidth = width;
					$scope.pertChartHeight = height;
				};

				// input structure
				$scope.data = [];

				// additional output structures
				$scope.nodes = [];
				$scope.paths = [];

				$scope.reset = function () {
					$scope.data.length = 0;
					$scope.nodes.length = 0;
					$scope.paths.length = 0;
				};

				// ----------------------------------------------------------------------------------------------------
				// extend nodes with information

				$scope.addNodeInfo = function (rootNode) {
					$scope.traverseTree(null, rootNode, function (parent, node) {
						// add size
						node.width = $scope.pertNodeSize.width;
						node.height = $scope.pertNodeSize.height;

						// add parent info to children
						node.parent = parent;

						// add level information (0-based)
						node.level = (parent !== null && parent.level !== undefined) ? parent.level + 1 : 0;

						// "h" for horizontal or "v" for vertical
						if (node.childOrientation === undefined) {
							node.childOrientation = (node.level > 0) ? 'v' : 'h';
						}

						node.childOffset = (node.childOrientation === 'v') ? {x: 30, y: 30} : {x: 0, y: 30};

						// if not set, use default:
						node.elapsed = (node.elapsed !== undefined) ? node.elapsed : true;

						// long text will be cut ("very long tex ...")
						node.overflowTextEnabled = true;
					});
				};

				$scope.addRootNodeInfo = function (rootNode) {
					// fill in planned start
					rootNode.PlannedStart = '';
					$scope.traverseTree(null, rootNode, function (parent, node) {
						if (node.PlannedStart !== '') {
							rootNode.PlannedStart = (rootNode.PlannedStart === '' || node.PlannedStart < rootNode.PlannedStart) ? node.PlannedStart : rootNode.PlannedStart;
						}
					});

					// fill in planned end
					rootNode.PlannedEnd = '';
					$scope.traverseTree(null, rootNode, function (parent, node) {
						if (node.PlannedEnd !== '') {
							rootNode.PlannedEnd = (rootNode.PlannedEnd === '' || node.PlannedEnd > rootNode.PlannedEnd) ? node.PlannedEnd : rootNode.PlannedEnd;
						}
					});

					// sum up only durations of leafs
					rootNode.PlannedDuration = 0;
					$scope.traverseTree(null, rootNode, function (parent, node) {
						if (!$scope.hasChildren(node) && angular.isNumber(node.PlannedDuration)) {
							rootNode.PlannedDuration += node.PlannedDuration;
						}
					});
				};

				$scope.traverseTree = function (parent, node, onNodeFunc) {
					onNodeFunc(parent, node);
					if ($scope.hasChildren(node)) {
						angular.forEach(node[opt.propChildren], function (child) {
							$scope.traverseTree(node, child, onNodeFunc);
						});
					}
				};

				$scope.updateNodesList = function (rootNode) {
					$scope.nodes.length = 0;
					$scope.traverseTree(null, rootNode, function (parent, node) {
						$scope.nodes.push(node);
					});
				};

				// ----------------------------------------------------------------------------------------------------
				// layouting / positioning

				// calculate bounding boxes and extend json tree
				$scope.calcBoundingBoxes = function (parent) {
					if ($scope.hasChildren(parent)) {
						var fullWidth = 0,
							fullHeight = 0,
							space = {width: 20, height: 20},
							spaceCount = parent[opt.propChildren].length - 1,
							allSpace = {
								width: (parent.childOrientation === 'v') ? 0 : spaceCount * space.width,
								height: (parent.childOrientation === 'v') ? spaceCount * space.height : 0
							};

						angular.forEach(parent[opt.propChildren], function (child) {
							var childBox = $scope.calcBoundingBoxes(child);

							if (parent.childOrientation === 'v') {
								fullWidth = Math.max(fullWidth, childBox.width);
								fullHeight += childBox.height;
							} else {
								fullWidth += childBox.width;
								fullHeight = Math.max(fullHeight, childBox.height);
							}
						});

						parent.box = {
							width: parent.childOffset.x + fullWidth + allSpace.width,
							height: parent.height + parent.childOffset.y + fullHeight + allSpace.height
						};
					} else {
						parent.box = {width: parent.width, height: parent.height};
					}

					// for horizontal layout, box needs a offset
					parent.box.offsetX = (parent.childOrientation === 'h') ? parent.width / 2 - parent.box.width / 2 : 0;
					parent.box.offsetY = 0;

					// not elapsed? So children are not visible
					// and bounding box is size of node
					if (!parent.elapsed) {
						parent.box = {width: parent.width, height: parent.height};
					}

					return parent.box;
				};

				$scope.positioningChildren = function (parent) {
					// add b-box position
					parent.box.x = parent.position.x;
					parent.box.y = parent.position.y;

					// on h-orientation change position
					if (parent.childOrientation === 'h') {
						parent.position.x += parent.box.width / 2 - parent.width / 2;
					}

					// add position info to each node
					var nextPosX = parent.position.x + ((parent.childOrientation === 'v') ? parent.childOffset.x : parent.box.offsetX),
						nextPosY = parent.position.y + parent.height + parent.childOffset.y,
						space = 20;

					angular.forEach(parent[opt.propChildren], function (child) {
						child.position = {x: nextPosX, y: nextPosY};
						if (parent.childOrientation === 'v') {
							nextPosY += child.box.height + space;
						} else {
							nextPosX += child.box.width + space;
						}
					});
				};

				$scope.calcPositions = function (rootNode, startPosX, startPosY) {
					// root node handling
					rootNode.position = {x: startPosX, y: startPosY};

					$scope.traverseTree(null, rootNode, function (parent, node) {
						$scope.positioningChildren(node);
					});
				};

				// ----------------------------------------------------------------------------------------------------
				// connectors

				// return string for polyline between a and b from a given type
				$scope.connect = function (parent, child, type) {
					var dy = Math.abs(child.position.y - (parent.position.y + parent.height)),
						p1, p2, p3, p4;

					// A: horizontal child orientation
					// B: vertical child orientation
					if (type === 'A') {
						p1 = {x: parent.position.x + parent.width / 2, y: parent.position.y + parent.height};
						p2 = {x: p1.x, y: p1.y + dy / 2};
						p4 = {x: child.position.x + child.width / 2, y: child.position.y};
						p3 = {x: p4.x, y: p4.y - dy / 2};

					} else { // if(type === 'B') {
						p1 = {x: parent.position.x + parent.childOffset.x / 2, y: parent.position.y + parent.height};
						p3 = {x: child.position.x, y: child.position.y + child.height / 2};
						p2 = {x: p1.x, y: p3.y};
					}

					return p1.x + ',' + p1.y + ' ' + p2.x + ',' + p2.y + ' ' + p3.x + ',' + p3.y + (p4 ? ' ' + p4.x + ',' + p4.y : '');
				};

				// creates all connections in tree
				$scope.generateConnections = function (rootNode, pathList) {
					pathList.length = 0;
					$scope.traverseTree(null, rootNode, function (parent, node) {
						if (parent !== null && $scope.isVisible(node)) {
							var type = (parent.childOrientation === 'h') ? 'A' : 'B';
							pathList.push($scope.connect(parent, node, type));
						}
					});
					return pathList;
				};

				// --------------------------------------------------------------------------------------------
				// interaction

				var ui = {
					// actions on nodes
					toogleElapsed: function (node) {
						node.elapsed = !node.elapsed;
					},
					toogleOrientation: function (node) {
						node.childOrientation = (node.childOrientation === 'h') ? 'v' : 'h';
					},

					// zooming
					zoomIn: function () {
						$scope.scaleFac = Math.min(2, $scope.scaleFac + 0.05);
						$scope.scaleFac += 0.05;
					},
					zoomOut: function () {
						$scope.scaleFac = Math.max(0.1, $scope.scaleFac - 0.05);
					},
					zoomToFit: function () {
						if ($scope.pertChartWidth > 0 && $scope.pertChartHeight > 0) {
							var curDim = $scope.getCurrentDimensions();
							var scaleFacWidth = curDim.width / $scope.pertChartWidth;
							var scaleFacHeight = curDim.height / $scope.pertChartHeight;

							$scope.scaleFac = Math.min(scaleFacWidth, scaleFacHeight);
						} else {
							$log.debug('pertsize 0 or negative');
						}
					},
					zoomReset: function () {
						$scope.scaleFac = 1.0;
					},

					// printing
					printPert: function () {
						// TODO: implement me
					},

					// settings
					showSettings: function () {
						pertConfig.pertNodeWidth = $scope.pertNodeSize.width;
						pertConfig.pertNodeHeight = $scope.pertNodeSize.height;

						var modalOptions = {
							headerText: 'Input Pert Size',
							templateUrl: globals.appBaseUrl + 'controlling.structure/templates/pert-settings-modal.html',
							controller: ['$scope', '$translate', '$modalInstance', 'pertConfig', controllingStructurePertSettingsController],
							width: 'max',
							maxWidth: '350px'
						};

						platformModalService.showDialog(modalOptions).then(
							function (result) {
								$scope.pertNodeSize.width = parseInt(result.size.width, 10);
								$scope.pertNodeSize.height = parseInt(result.size.height, 10);
								$scope.updatePertChart();
							}
						);
					},
					toogleDispSubtree: function () {
						opt.dispSubTree = !opt.dispSubTree;
						$scope.updatePertChart();
					}
				};

				$scope.nodeClick = function (node, event) {
					if (event.altKey) {
						ui.toogleOrientation(node);
					} else {
						ui.toogleElapsed(node);
					}
					// update chart
					$scope.initChart();
				};

				// node functions
				$scope.isVisible = function (node) {
					// check if any parent (on way to root) is collapsed
					var curNode = node;
					while (curNode.parent !== undefined && curNode.parent !== null) {
						if (curNode.parent.elapsed === false) {
							return false;
						}
						curNode = curNode.parent;
					}
					return true;
				};

				$scope.hasChildren = function (node) {
					return node[opt.propChildren] !== undefined && node[opt.propChildren].length > 0;
				};

				// init structure
				$scope.initChart = function () {
					var rootNode = $scope.data[0];

					$scope.addNodeInfo(rootNode);

					$scope.calcBoundingBoxes(rootNode);
					$scope.setChartSize(rootNode.box.width + 4, rootNode.box.height + 4);
					$scope.calcPositions(rootNode, 2, 2);

					$scope.updateNodesList(rootNode);
					$scope.generateConnections(rootNode, $scope.paths);
				};

				$scope.updatePertChart = function () {
					$scope.reset();
					$scope.setChartSize(0, 0);

					// data available?
					var itemTree = controllingStructureMainService.getTree();
					var selectedNode = controllingStructureMainService.getSelected();
					$scope.curProject = projectMainForCOStructureService.getSelected();
					if (itemTree.length > 0 && projectMainForCOStructureService.isSelection($scope.curProject)) {
						// only sub tree
						if (opt.dispSubTree && !_.isEmpty(selectedNode)) {
							$scope.addRootNodeInfo(selectedNode);
							$scope.data.push(selectedNode);
						}
						// or whole tree
						else {
							var rootNode = {
								DescriptionInfo: {Description: $scope.curProject.ProjectName},
								Code: $scope.curProject.ProjectNo,
								ControllingUnits: angular.copy(itemTree)
							};
							$scope.addRootNodeInfo(rootNode);
							$scope.data.push(rootNode);
						}

						$scope.initChart();
					}

					// enable/disable toolbar
					var oldValue = $scope.toolbarEnabled;
					$scope.toolbarEnabled = _.isEmpty($scope.curProject) === false && itemTree.length > 0;
					if (oldValue !== $scope.toolbarEnabled) {
						$scope.tools.update();
					}
				};

				// view model
				$scope.scaleFac = 1.0;
				$scope.pertNodeSize = {width: 140, height: 50};

				// user interface functions


				// toolbar
				var createToolBarItem = function createToolBarItem(id, caption, iconClass, fn, disabled) {
					return {
						id: id,
						caption: 'controlling.structure.' + caption,
						type: 'item',
						iconClass: 'tlb-icons ' + iconClass,
						fn: fn,
						disabled: disabled
					};
				};
				var toolbarDisabled = function toolbarDisabled() {
					return !$scope.toolbarEnabled;
				};

				$scope.toolbarEnabled = _.isEmpty(projectMainForCOStructureService.getSelected()) === false;
				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						createToolBarItem('t1', 'pertDispSubtree', 'ico-dispsubtree', ui.toogleDispSubtree, toolbarDisabled),
						{type: 'divider'},
						createToolBarItem('t2', 'pertZoomIn', 'ico-zoom-in', ui.zoomIn, toolbarDisabled),
						createToolBarItem('t3', 'pertZoomOut', 'ico-zoom-out', ui.zoomOut, toolbarDisabled),
						createToolBarItem('t4', 'pertZoomToFit', 'ico-zoom-fit', ui.zoomToFit, toolbarDisabled),
						createToolBarItem('t5', 'pertZoomReset', 'ico-zoom-100', ui.zoomReset, toolbarDisabled),
						{type: 'divider'},
						createToolBarItem('t6', 'pertPrint', 'ico-print', ui.printPert, true),
						createToolBarItem('t7', 'pertSettings', 'ico-settings', ui.showSettings, toolbarDisabled)
					]
				});

				var onSelectionChanged = function () {
					var selectedUnit = controllingStructureMainService.getSelected();
					var selectedProject = projectMainForCOStructureService.getSelected();

					if (opt.dispSubTree && selectedProject && selectedUnit !== null) {
						$scope.updatePertChart();
					}
				};

				// (un-)register event handlers
				controllingStructureMainService.registerListLoaded($scope.updatePertChart);
				controllingStructureMainService.registerSelectionChanged(onSelectionChanged);

				// Register to data service for getting data
				if(controllingStructureMainService.addUsingContainer) {
					controllingStructureMainService.addUsingContainer('41C98D824FF347D09F4DC697FDF9EE80');
				}

				$scope.$on('$destroy', function () {
					controllingStructureMainService.unregisterListLoaded($scope.updatePertChart);
					controllingStructureMainService.unregisterSelectionChanged(onSelectionChanged);

					if(controllingStructureMainService.removeUsingContainer) {
						controllingStructureMainService.removeUsingContainer('41C98D824FF347D09F4DC697FDF9EE80');
					}
				});

				// initial update
				$scope.updatePertChart();


			}]);
})();
