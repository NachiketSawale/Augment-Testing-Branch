/**
 * Created shen on 13/01/2023.
 */
(function(angular){
	/* global globals, _ */
	'use strict';
	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).directive('basicsMaterialCatalogPriceVersionLookup2', ['_', 'BasicsLookupdataLookupDirectiveDefinition', '$http', '$q',
		function (_, BasicsLookupdataLookupDirectiveDefinition, $http, $q) {
			var defaults = {
				version: 2,
				lookupType: 'MaterialPriceVersion',
				valueMember: 'Id',
				displayMember: 'MaterialPriceVersionDescriptionInfo.Translated',
				dialogUuid: '4c2e7a70eb174e5d8620adeef4e5e7ac',
				uuid: '74bcdf9eb9ed43b0bce124d68260ea9f',
				columns: [
					{ id: 'priceverdesc', field: 'MaterialPriceVersionDescriptionInfo.Translated', name: 'Price Version Description', name$tr$: 'basics.materialcatalog.priceVersionDescription', width: 100 },
					{ id: 'pricelistdesc', field: 'PriceListDescriptionInfo.Translated', name: 'Price List Description', name$tr$: 'basics.materialcatalog.priceListDescription', width: 100 }
				],
				width: 500,
				height: 200
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				processData: function (itemList) {
					let deferred = $q.defer();
					if (itemList && itemList.length > 0) {
						$http.post(globals.webApiBaseUrl + 'logistic/pricecondition/materialcatalogprice/filteredpriceversion').then((function (result){
							let filteredItems = _.filter(itemList, function (item) {
								return _.includes(result.data, item.Id);
							});
							deferred.resolve(filteredItems);
						}));
					}
					else{
						deferred.resolve({});
					}
					return deferred.promise;
				}
			});
		}]);
})(angular);