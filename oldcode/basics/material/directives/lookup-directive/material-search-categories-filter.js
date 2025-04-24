/**
 * Created by wwa on 5/17/2016.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	/**
	 * @ngdoc directive
	 * @name basicsMaterialSearchCategoriesFilter
	 * @element div
	 * @restrict  A
	 * @scope
	 * @description Category filter
	 *              List all the categories of the result material with check box in front of the category.
	 *
	 *
	 */
	angular.module(moduleName).directive('basicsMaterialSearchCategoriesFilter',
		['_', '$compile', '$q', '$translate', 'basicsLookupdataPopupService', function (_, $compile, $q, $translate, basicsLookupdataPopupService) {
			return {
				restrict: 'A',
				scope:{
					filterCategories: '=',
	                selectedCategories: '=',
					filterFn: '=',
	                idMember: '@'
				},
				link: function (scope, element) {

					var attrTemplate =
                        '<ul class="col-sm-offset-1">'+
                        '$valueNodes$'+
                        '</ul>';
					var valueNodeTemplate =
                        '<li class="relative-container">'+
                        '<span data-platform-checkbox  class="ms-icon-img attribute-icon" data-ng-change="onFilterChanged($value$)" data-ng-model="$value$.checked"></span>'+
                        '<span class="ms-commodity-attributes-checkbox-label">{{::$value$.description}}&nbsp;</span>'+
                        '<span style="position: absolute;right: 0;">' +
                        '<a href data-ng-show="$value$.data.IsFrameworkCatalog" title="{{ ::frameworkCatalogTitle }}" class="control-icons ico-framework-agreement block-image"></a>' +
                        '<a href data-ng-show="$value$.data.PriceVersions.length" title="{{ getPriceVersionTitle($value$) }}" data-ng-click="togglePriceVersion($event, $value$)" class="{{($value$.data.MaterialPriceVersionFk == null || $value$.data.MaterialPriceVersionFk <= 0)?\'ico-pricelist\':\'ico-pricelist-select\'}} control-icons block-image" style="margin-left: 4px;"></a>' +
                        '</span>'+
                        '</li>';

					scope.onFilterChanged = function(valueFilter){

						valueFilter.checked = !valueFilter.checked;

						var fitlerIds = [];

						scope.nodes.forEach(function(node){
							if(node.checked){
								fitlerIds.push(node.id);
							}
						});

						scope.filterFn(fitlerIds);
					};

					var priceVersionTitle = $translate.instant('basics.material.priceList.materialPriceVersion');

					scope.frameworkCatalogTitle = $translate.instant('basics.material.frameworkCatalog.title');

					scope.getPriceVersionTitle = function (item) {
						if(_.isNil(item ) || _.isNil(item.data.MaterialPriceVersionFk) || item.data.MaterialPriceVersionFk <= 0){
							return priceVersionTitle;
						}

						if(item.data.PriceVersions && item.data.PriceVersions.length){
							var priceVersion = _.find(item.data.PriceVersions, { Id: item.data.MaterialPriceVersionFk });
							return priceVersion.DescriptionInfo.Translated;
						}

						return priceVersionTitle;
					};

					var helper = basicsLookupdataPopupService.getToggleHelper();

					scope.togglePriceVersion = function (event, entity) {
						var priceVersionButton = angular.element(event.currentTarget);

						var options = basicsLookupdataPopupService.buildListPopupOptions({
							scope: scope,
							id: '0CE3F0CAB1164242AED14E5AAE47EA45',
							displayMember: 'DescriptionInfo.Translated',
							focusedElement: priceVersionButton,
							relatedTarget: priceVersionButton,
							dataProvider: {
								getList: function () {
									return $q.when(entity.data.PriceVersions.concat({
										Id: null,
										DescriptionInfo: {
											Translated: 'null'
										},
										MaterialCatalogFk: entity.data.Id
									}));
								}
							},
							afterDataRefreshed: function (scope, ctrl) {
								ctrl.selectById(entity.data.MaterialPriceVersionFk);
							}
						});

						var popup = helper.toggle(options);

						if (popup) { // open
							popup.result.then(function (result) {
								if (result && result.isOk && result.value !== entity.MaterialPriceVersionFk) {
									entity.data.MaterialPriceVersionFk = result.value.Id;
									scope.$parent.options.searchService.processPriceList(result.value.MaterialCatalogFk, result.value.Id, (result.value.Id === null));
								}
							});
						}
					};

					scope.$watch('filterCategories', function () {
						var idMember = scope.idMember || 'Id';

						element.empty();

						scope.nodes = _.map(scope.filterCategories, function (item) {
							// not select price version during initialization
							item.MaterialPriceVersionFk = -1;
							return {
			                    id: item[idMember],
			                    description: item.DescriptionInfo.Translated,
			                    checked: _.includes(scope.selectedCategories, item[idMember]),
								data: item
		                    };
	                    });

	                    var valuesHtml = '';
	                    scope.nodes.forEach(function (val, i) {
		                    valuesHtml += valueNodeTemplate.replace(/\$value\$/g, 'nodes[' + i + ']');
	                    });

	                    element.append($compile(attrTemplate.replace(/\$valueNodes\$/g, valuesHtml))(scope));
					});


				}
			};
		}]);
})(angular);