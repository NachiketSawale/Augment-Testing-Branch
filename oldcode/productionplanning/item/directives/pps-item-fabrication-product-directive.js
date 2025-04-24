/**
 * Created by anl on 07/04/2022.
 */

(function () {
	'use strict';
	/* global angular */

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).directive('ppsItemFabricationProductDirective', [
		'$compile',
		'$translate',
		'$injector',
		'platformModalService',
		'$http',
		function ($compile,
			$translate,
			$injector,
			platformModalService,
			$http) {
			return {
				restrict: 'A',
				require: '^ngModel',
				scope: true,
				link: function (scope, element, attrs, ngModelCtrl) {
					var options = scope.$eval('$parent.' + attrs.options) || {};
					var entity = scope.$eval('$parent.' + attrs.entity) || {};

					scope.Disabled = entity.Products === null;
					scope.Quantity = scope.Disabled ? null : entity[options.property];

					scope.showDialog = () => {
						var modalCreateConfig = {
							width: '900px',
							resizeable: true,
							templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-item-fabrication-product-list-controller.html',
							controller: 'productionplanningItemFabricationProductListController',
							resolve: {
								'$options': function () {
									return {
										Products: entity.Products
									};
								}
							}
						};
						platformModalService.showDialog(modalCreateConfig);
					};

					var template =
						/*jshint multistr: true */
						'<div class="control-directive input-group form-control">\
							<input type="text" class="input-group-content" data-platform-control-validation data-platform-select-on-focus\
							data-ng-readonly="true" data-config="#config#" data-entity="#entity#" data-ng-value="Quantity"/>\
							<span class="input-group-btn">\
								<button class="btn btn-default input-sm" data-ng-click="showDialog()" title="#tooltip#" data-ng-disabled="Disabled">\
									<img class="block-image #image#">\
								</button>\
							</span>\
						</div>';

					template = template.replace('#config#', '$parent.' + attrs.config)
						.replace('#entity#', entity)
						.replace('#tooltip#', 'ShowAllProducts')
						.replace('#image#', 'tlb-icons ico-res-show-all');

					var templateEle = angular.element(template);

					$compile(templateEle.appendTo(element))(scope);

					scope.$on('$destroy', function () {
					});
				}
			};
		}]);
})();