

(function (angular) {
    'use strict';
    /* global globals, angular, _ */
    var moduleName = 'productionplanning.common';

    /**
     * @ngdoc service
     * @name ppsMountingConstantValues
     * @function
     *
     * @description
     * ppsCommonCodGeneratorConstantValue provides definitions and constants frequently used in code generation function in PPS module and Transport module
     */
    angular.module(moduleName).factory('ppsCommonCodGeneratorConstantValue', [ '$http', '$q', 'basicsLookupdataLookupDescriptorService', function ($http, $q, basicsLookupdataLookupDescriptorService) {
        var server = {};

	    server.eventTypes = [];
	    server.PpsEntityConstant = {
            MountingActivity: 1,
            TransportRoute: 2,
            MountingRequisition: 3,
            EngineeringTask: 5,
            TransportRequisition: 6,
            TransportBundle : 7,
            TransportPackage : 8,
            PPSHeader: 11,
            PPSProductionSet: 15,
            FabricationUnit: 17

        };
	    server.RubricConstant = {
            Mounting: 74,
            ProductionPlanning: 75,
            TransportPlanning: 76,
            Engineering: 77,
            ProductionUnit : 84
        };
	    server.CategoryConstant = {
            MountingActivityCat : -1,
            PpsHeaderCat : -1,
            TrsBundleCat : -1,
            TrsPackageCat : -1

        };

	    server.getCategoryFkviaEventType = function (eventTypeFk, ppsEntityId){
            if(server.eventTypes.length > 0){
                if(eventTypeFk > 0){
                    var type = _.find(server.eventTypes, {Id: eventTypeFk});
                    return type !== null? type.RubricCategoryFk: null;
                }
                else if(ppsEntityId > 0){
                    var defaultType = _.find(server.eventTypes, function (type){
                        return  type.PpsEntityFk === ppsEntityId && type.IsDefault === true;
                    });
                    return !_.isNil(defaultType) ? defaultType.RubricCategoryFk : null;
                }
               return  null;
            }
            return null;
        };

	    server.loadEventType = function ()
        {
            $http.get(globals.webApiBaseUrl + 'productionplanning/configuration/eventtype/getall').then(function (response) {
	            server.eventTypes  = response.data;
	            basicsLookupdataLookupDescriptorService.updateData('EventType', response.data);
            });
        };

	    server.synLoadEventType = function ()
	    {
		    var defer = $q.defer();
		    if(server.eventTypes.length > 0){
			    defer.resolve(server.eventTypes);
		    }
		    else{
			    $http.get(globals.webApiBaseUrl + 'productionplanning/configuration/eventtype/getall').then(function (response) {
				    server.eventTypes  = response.data;
				    basicsLookupdataLookupDescriptorService.updateData('EventType', response.data);
				    defer.resolve(server.eventTypes);
			    });
		    }
		    return defer.promise;
	    };

        return server;
    }]);
})(angular);