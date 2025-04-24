/**
 * Created by zov on 8/1/2019.
 */
(function () {
    'use strict';
    /*global angular*/
    var moduleName = 'productionplanning.product';
    angular.module(moduleName).service('ppsProductTransactionReadonlyProcessor', PpsProductTransactionReadonlyProcessor);
	PpsProductTransactionReadonlyProcessor.$inject = ['platformRuntimeDataService',
    'basicsLookupdataLookupDescriptorService'];
    function PpsProductTransactionReadonlyProcessor(platformRuntimeDataService,
                                                    basicsLookupdataLookupDescriptorService) {

        this.processItem = function processItem(item) {
            var editable = item.Version === 0;
            if(!editable && item.PrcStocktransactiontypeFk > 0) {
                var transactionType=basicsLookupdataLookupDescriptorService.getData('StockTransactionType');
                var type=_.find(transactionType, {Id: item.PrcStocktransactiontypeFk});
                editable = type && type.IsAllowedManual;
            }

            if(!editable){
                var fileds = Object.getOwnPropertyNames(item).map(function (prop) {
                    return {field: prop, readonly: true};
                });
                platformRuntimeDataService.readonly(item, fileds);
            }
        };
    }
})();