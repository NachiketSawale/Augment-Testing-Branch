(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_,jQuery */

	var moduleName = 'procurement.ticketsystem';

	angular.module(moduleName).run(['$templateCache', function ($templateCache) {
		$templateCache.loadTemplateFile('procurement.ticketsystem/templates/search-view-template.html');
	}]);

	/**
	 * @ngdoc controller
	 * @name commoditySearchController
	 * @description controller for ticket system
	 */
	// jshint -W072
	angular.module(moduleName).controller('procurementTicketsystemSearchController',
		['$scope', 'procurementTicketsystemSearchDataService',
			'procurementTicketsystemCartDataService', '$rootScope',
			'mainViewService', '$templateCache', 'platformDomainList', '$translate',
			function ($scope, searchService, cartService, $rootScope,
				mainViewService, $templateCache, platformDomainList, $translate) {

				var getTemplate = function (key) {
					var template = $templateCache.get(key + '.html');
					if (!template) {
						throw new Error('Template ' + key + ' not found');
					}
					return template;
				};

				$scope.options = {
					searchOptions: {
						FilterString: 'PrcStructuretypeFk=1 && Isticketsystem=true',
						Filter: {
							IsTicketSystem: true,
							IsFilterCompany: true
						},
						MaterialTypeFilter: {
							IsForProcurement: true
						},
						DisplayedPriceType: 1 // using cost price
					},
					pageSizeOptions:[25, 50, 100],
					defaultPageSize: 25,
					searchService: searchService,
					rowButtonPanelHtml: getTemplate('rowButtons'),
					searchBarExtend: getTemplate('cartCount'),
					more: $translate.instant('procurement.ticketsystem.htmlTranslate.more'),
					collapse: $translate.instant('procurement.ticketsystem.htmlTranslate.collapse')// ,
					// wui: disable add all feature.
					// searchTitleExtend: getTemplate('addAll')
				};
				$scope.cartCount = 0;
				// quantity reg
				$scope.quantityReg = platformDomainList.quantity.regex;

				$scope.addToCart = function (entity) {

					if (_.isNil(entity.InternetCatalogFk)) {
						cartService.add(entity.Id, entity.Requirequantity, entity.MaterialPriceListFk,entity.Co2Project,entity.Co2Source,entity.BasCo2SourceFk,entity.BasCo2SourceName);
					} else {
						// copy material from specified url.
						searchService.putInternetMaterial(entity).then(function (response) {
							// copy successfully, return new material id.
							if (response.data.Success) {
								var local = response.data.Materials[0];
								cartService.add(local.Id, entity.Requirequantity, entity.MaterialPriceListFk,entity.Co2Project,entity.Co2Source,entity.BasCo2SourceFk,entity.BasCo2SourceName);
							} else {
								searchService.showValidation(response.data.ValidationResults);
							}
						});
					}

					entity.IsAdded = true;
				};

				$scope.addAllToCart = function () {
					var dataItems = searchService.data.items;

					if (dataItems.length) {
						searchService.copy(dataItems).then(function (items) {
							cartService.addAll(items.map(function (item) {
								return {
									MdcMaterialFk: item.Id,
									Quantity: 1
								};
							}));
						});

						dataItems.forEach(function (item) {
							item.isAdded = true;
						});
					}
				};

				cartService.updateCarStatus(searchService.data.items, cartService.cartList);

				$scope.cartService = cartService;
				cartService.initialCart();
				$scope.gotoCart = function () {
					mainViewService.jumpToContainer('180c90d476894349b6f9c326c0dfd06d');
				};

			}]);
})(angular, jQuery);
