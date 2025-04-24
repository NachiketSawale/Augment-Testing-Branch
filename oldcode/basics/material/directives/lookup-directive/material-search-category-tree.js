(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	/**
	 * @ngdoc directive
	 * @name basics.material.directive:basicsMaterialCommodityCategory
	 * @element div
	 * @restrict A
	 * @description search tree directive
	 * may remove this directive and put it into html
	 */
	angular.module(moduleName).directive('basicsMaterialSearchCategoryTree',
		['$compile', '$translate', function ($compile, $translate) {
			return {
				restrict: 'A',
				scope: {
					searchText: '=',
					structureId: '=',
					structures: '=',
					onNavigate: '=',
					idMember: '@'
				},
				link: function ($scope, element) {
					var idMember = $scope.idMember || 'Id';

					var template =
						'<div class="ms-sv-category-tree">' +
						' <div>'+
							'<a href=""> $parentCategoryInfo$ </a>'+
							'<a class="ms-sv-category-tree-back" href="" data-ng-click="treeOpen = !treeOpen">'+
								'<i class="block-image control-icons" ng-class="treeOpen?\'ico-minus\':\'ico-plus\'"></i>' +
							'</a>'+
						' </div>'+
							'<ul class="col-sm-offset-1" data-ng-show="treeOpen"> $items$ </ul>'+
						'</div>';
					var itemTemplate =
						'<li style="word-break: break-all;">'+
							' <a href="" data-ng-click="onNavigate($Id$)"> $childCategoryInfo$</a>' +
						'</li>';

					function findNode(structures, structureId) {

						if(!structureId) {
							return;
						}

						if (angular.isArray(structures)) {
							for (var i = 0; i < structures.length; i++) {
								if (structures[i][idMember] === structureId) {
									return structures[i];
								}
								else {
									var result = findNode(structures[i].ChildItems, structureId);
									if(result){
										return result;
									}
								}
							}
						}
						return null;
					}

					$scope.$watchGroup(['searchText', 'structureId', 'structures'], function () {

						$scope.treeOpen = true;
						element.empty();
						if(!$scope.structures || $scope.structures.length === 0){
							return;
						}

						var node = findNode($scope.structures, $scope.structureId);
						var childNodes;

						var html = '';
						if(_.isNil(node)){
							var allCount = _.sumBy($scope.structures, function(category){return category.MatrialCount;});
							html = template.replace('$parentCategoryInfo$',  (_.escape($scope.searchText) ||  $translate.instant('basics.material.materialSearchLookup.htmlTranslate.all')) + ' (' + allCount +')');
							childNodes = $scope.structures;
						}
						else{
							html = template.replace('$parentCategoryInfo$', node.Code + ' (' + node.MatrialCount + ')');
							childNodes = node.ChildItems;
						}

						var itemsHtml = '';
						if(childNodes && childNodes.length > 0){
							_.forEach(childNodes, function (node) {
								var id = node[idMember];
								itemsHtml += itemTemplate.replace('$Id$', angular.isString(id) ? ('\'' + id + '\'') : id).replace('$childCategoryInfo$', node.Code + ' (' + node.MatrialCount + ')');
							});
						}
						html = html.replace('$items$', itemsHtml);

						element.append($compile(html)($scope));

					});

				}
			};
		}]);


})(angular);