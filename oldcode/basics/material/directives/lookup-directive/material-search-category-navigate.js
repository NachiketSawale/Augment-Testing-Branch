/**
 * Created by lja on 2015/8/18.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	/**
	 * @ngdoc directive
	 * @name basics.material.directive:basicsMaterialSearchNavigateMap
	 * @element div
	 * @restrict A
	 * @description navigate map directive
	 *
	 */
	angular.module(moduleName).directive('basicsMaterialSearchCategoryNavigate',
		['$compile', '_', '$translate',
			function ($compile, _, $translate) {
				return {
					restrict: 'A',
					scope: {
						searchText: '=',
						structureId: '=',
						structures: '=',
						onNavigate: '=',
						idMember: '@'
					},
					link: function ($scope, ele) {
						var idMember = $scope.idMember || 'Id';
						var parentFkMember = 'PrcStructureFk';
						var navTemplate = '<div class="ms-sv-category-navigate-block"> $node$ </div>';
						var rootTemplate =
						'<div class="ms-sv-category-navigate-map $lassNodeClass$">' +
						'   <i class="block-image tlb-icons ico-search" style="margin: -5px 6px 0 0;"></i>' +
						'   <a href data-ng-click="onNavigate()"> $searchText$ </a>' +
						'</div>';
						var nodeTemplate =
						'<div class="ms-sv-category-navigate-map-point $lassPointClass$"></div>' +
						'<div class="ms-sv-category-navigate-map $lassNodeClass$">' +
						'   <a href data-ng-click="onNavigate($Id$)"> $name$ </a><button class="control-icons ico-close" style="width: 12px;height: 12px;" data-ng-click="onNavigate()"></button>' +
						'</div>';


						function buildNavigation(structures, structureId, nodes) {

							if(!structureId) {
								return;
							}

							if (angular.isArray(structures)) {
								for (var i = 0; i < structures.length; i++) {
									if (structures[i][idMember] === structureId) {
										nodes.push(structures[i]);
										return true;
									} else {
										if (buildNavigation(structures[i].ChildItems, structureId, nodes)) {
											nodes.push(structures[i]);
											return true;
										}
									}
								}
							}
							return false;
						}

						$scope.$watchGroup(['searchText', 'structureId', 'structures'], function () {

							ele.empty();
							var nodes = [];
							buildNavigation($scope.structures, $scope.structureId, nodes);
							nodes.reverse();

							var html = navTemplate.replace('$node$', rootTemplate)
								.replace('$searchText$', _.escape($scope.searchText) ||  $translate.instant('basics.material.materialSearchLookup.htmlTranslate.all'))
								.replace('$lassNodeClass$', nodes.length === 0 ? 'ms-sv-category-navigate-map-isLast' : '');

							_.forEach(nodes, function (node, i) {
								var id = node[idMember];
								var parentFk = node[parentFkMember];
								html += navTemplate.replace('$node$', nodeTemplate)
									.replace('$Id$', angular.isString(id) ? ('\'' + id + '\'') : id)
									.replace('$parentId$', angular.isString(parentFk) ? ('\'' + parentFk + '\'') : parentFk)
									.replace('$name$', node.Code)
									.replace('$lassPointClass$', i === nodes.length - 1 ? 'ms-sv-category-navigate-map-isLast-point' : '')
									.replace('$lassNodeClass$', i === nodes.length - 1 ? 'ms-sv-category-navigate-map-isLast' : '');
							});
							ele.append($compile(html)($scope));

						});
					}
				};
			}]);
})(angular);