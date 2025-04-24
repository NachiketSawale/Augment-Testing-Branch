/**
 * Created by zwz on 6/2/2017.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.ppsmaterial';
    angular.module(moduleName).factory('productionplanningPpsMaterialEventForDataService',productionplanningPpsMaterialEventForDataService);
    productionplanningPpsMaterialEventForDataService.$inject = ['$q','productionplanningPpsMaterialLookupItems'];
    function productionplanningPpsMaterialEventForDataService($q,lookupItems) {
        return{
            getList: function () {
                var deferred = $q.defer();
                deferred.resolve(lookupItems.eventFor);
                return deferred.promise;
            },
            getItemByKey:function () {
                var deferred = $q.defer();
                deferred.resolve(lookupItems.eventFor);
                return deferred.promise;

            }
        };
    }
})(angular);
