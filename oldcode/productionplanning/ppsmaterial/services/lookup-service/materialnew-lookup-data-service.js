(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.ppsmaterial';
    angular.module(moduleName).factory('productionplanningPpsMaterialDataService',productionplanningPpsMaterialDataService);
    productionplanningPpsMaterialDataService.$inject = ['$q', '$http','productionplanningPpsMaterialRecordMainService', 'basicsLookupdataLookupDescriptorService'];
    function productionplanningPpsMaterialDataService($q, $http, materialRecordMainService, lookupDescriptorService) {
        return{
            getList: function () {
                var deferred = $q.defer();
                deferred.resolve(materialRecordMainService.getList());
                return deferred.promise;
            },
            getItemByKey : function (key, options, scope) {
                var deferred = $q.defer();
                if(key <= 0){
                    deferred.resolve();
                }
                else{
                    var lookupItem = lookupDescriptorService.getLookupItem(options.lookupType, key);
                    if(_.isNil(lookupItem)){
                        $http.get(globals.webApiBaseUrl + 'basics/material/material?id=' +key).then(function (result){
                            //return === mdcMaterial
                            lookupItem = result;
                            deferred.resolve(lookupItem);
                        });
                    }
                    else {
                        deferred.resolve(lookupItem);
                    }
                }
                return deferred.promise;
            }
        };
    }
})(angular);
