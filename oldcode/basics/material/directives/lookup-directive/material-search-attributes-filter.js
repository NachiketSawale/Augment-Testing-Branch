/**
 * Created by lja on 2015/8/18.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';
	/**
	 * @ngdoc directive
	 * @name basics.material.directive:basicsMaterialCommodityAttributes
	 * @element div
	 * @restrict A
	 * @description Material attribute filter
	 *              It is a two level tree structure. The property will be the first level
	 *              The second level is the value of the property with check box.
	 *
	 */
	angular.module(moduleName).directive('basicsMaterialSearchAttributesFilter',
		['$compile', function ($compile) {
			return {
				restrict: 'A',
				scope:{
					filterAttributes: '=',
					selectedAttributes: '=',
					filterFn: '=',
					moreAttr:'=',
					collapseAttr:'=',
					loadMoreFn: '=',
					context: '='
				},
				link: function (scope, element) {
					var content = '';

					var attrTemplate =
						'<div class="ms-commodity-attributes-item">'+
							'<div class="flex-box">'+
								'<a href="" class="ms-commodity-attributes-title flex-element">{{::$node$.property}}</a>'+
								'<a class="ms-commodity-attributes-expend" href="" data-ng-click="$node$.expend = !$node$.expend ">'+
									'<i class="block-image control-icons" ng-class="$node$.expend?\'ico-minus\':\'ico-plus\'"></i>'+
								'</a>'+
							'</div>'+

							'<div data-ng-show="$node$.expend">'+
								'<ul class="col-sm-offset-1" >'+
									'$valueNodes$'+
								'</ul>'+
								'<ul class="col-sm-offset-1"  data-ng-show="$node$.expand">'+
									'$valueNodesHide$'+
								'</ul>'+
								'<div class="col-sm-offset-1" data-ng-click="toggle($node$)" data-ng-if="$bottomCount$" style="cursor:pointer;color:#0067b1" data-ng-bind="$node$.expand?collapseAttr:moreAttr"></div>'+
								'$loadmoreholder$' +
							'</div>'+
						'</div>';
					var valueNodeTemplate =
						'<li >'+
							'<span data-platform-checkbox  class="ms-icon-img attribute-icon" data-ng-change="onFilterChanged($value$)" data-ng-model="$value$.checked"></span>'+
							'<span class="ms-commodity-attributes-checkbox-label">{{::$value$.value}}</span>'+
						'</li>';
					var loadMoreTemplate =  '<div class="ms-commodity-attributes-item flex-box" style="justify-content: center;border-bottom: none;" data-ng-hide="context.__end">' +
												'<div data-basics-material-load-more data-load="loadMoreFn($morecontextholder$)"></div>' +
											'</div>';

					scope.bottomCount=0;

					scope.toggle=function(node) {
						node.expand = !node.expand;

						if (_.isNil(scope.context[node.property])) {
							scope.context[node.property] = {};
						}

						scope.context[node.property].expand = node.expand;
					};

					function buildValueNode(prop){

						var isChecked = false;

						//Set the checked according to current attribute filter setting
						_.forEach(scope.selectedAttributes, function(attr){
							if(prop.Property === attr.Property && prop.Value === attr.Value) {
								isChecked = true;
							}
						});

						return {
							value: prop.Value,
							checked: isChecked
						};
					}

					function buildTree(){
						var attrubteGroups = _.groupBy(scope.filterAttributes, function (item) {
							return item.Property.toLowerCase();
						});

						var expendedNode = _.map(_.filter(scope.nodes, function (node) {
							return node.expend === true;
						}), 'property');

						var roots = [];
						for(var property in attrubteGroups){ // jshint ignore:line

							var properties = _.sortBy(_.uniqBy(attrubteGroups[property], 'Value'), 'Value');

							roots.push({
								property: property,
								expend: _.includes(expendedNode, property),
								values: _.map(properties, buildValueNode),
								expand: scope.context[property] && scope.context[property].expand
							});
						}

						roots = _.sortBy(roots, 'property');
						return roots;
					}

					scope.onFilterChanged = function(valueFilter){

						valueFilter.checked = !valueFilter.checked;

						var fitlers = [];
						scope.nodes.forEach(function(node){
							node.values.forEach(function(val){
								if(val.checked){
									fitlers.push(
										{
											Property: node.property,
											Value: val.value
										}
									);
								}
							});
						});

						scope.filterFn(fitlers);
					};

					scope.$watch('filterAttributes', function () {
						element.empty();
						content = '';

						scope.nodes = buildTree();
						angular.forEach(scope.nodes, function (node, index) {
							var showLoadMoreButton = !scope.context.__end && (!scope.context[node.property] || !scope.context[node.property].__end);
							var moreTpl = loadMoreTemplate.replace(/\$morecontextholder\$/g, 'nodes[' + index + ']');

							var attrHtml = attrTemplate.replace(/\$node\$/g, 'nodes[' + index + ']').replace(/\$loadmoreholder\$/g, showLoadMoreButton? moreTpl: '');
							var topValues =node.values.slice(0,8);
							var bottomValues =node.values.slice(8, node.values.length);

							var topValuesHtml = '';
							var bottomValuesHtml='';
							var counter = 0;
							topValues.forEach(function(val, i){
								counter = i;
								topValuesHtml += valueNodeTemplate.replace(/\$value\$/g, 'nodes[' + index + '].values[' + counter + ']');
							});
							/* jshint -W098*/
							bottomValues.forEach(function(val, j){
								counter++;
								bottomValuesHtml += valueNodeTemplate.replace(/\$value\$/g, 'nodes[' + index + '].values[' + counter + ']');
							});
							attrHtml = attrHtml.replace(/\$valueNodes\$/g, topValuesHtml).replace(/\$valueNodesHide\$/g, bottomValuesHtml)
								.replace(/\$bottomCount\$/g,bottomValues.length>0);
							content += attrHtml;
						});
						if(!scope.context.__end){
							content += loadMoreTemplate.replace(/\$morecontextholder\$/g, '');
						}
						element.append($compile(content)(scope));
					});
				}
			};
		}]);
})(angular);