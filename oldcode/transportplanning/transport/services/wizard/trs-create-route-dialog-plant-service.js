/**
 * Created by zov on 3/30/2020.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'transportplanning.transport';

    angular.module(moduleName).factory('trsCreateRouteDialogPlantService', [
        'transportplanningTransportCreateTransportRouteDialogServiceFactory',
        'packageTypes',
        '$compile',
        '$rootScope',
        '$injector',
        'ppsCommonOpenLookupDialogHelper',
        function (transportplanningTransportCreateTransportRouteDialogServiceFactory,
                  packageTypes,
                  $compile,
                  $rootScope,
                  $injector,
	               ppsCommonOpenLookupDialogHelper) {
            var service = transportplanningTransportCreateTransportRouteDialogServiceFactory.createInstance({
                pkgType: packageTypes.Plant,
                resultName: 'Plants',
                idProperty: 'Uuid'
            });

	        service.createItem = function () {
		        ppsCommonOpenLookupDialogHelper.openLookupDialog('resource-equipment-plant-lookup-dialog-new', service.createReferences);
	        };

            service.onAddNewItem = function (item) {
                item.PUomFk = item.UoMFk;
            };

            return service;
        }
    ]);
})();