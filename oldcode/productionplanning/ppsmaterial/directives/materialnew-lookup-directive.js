(function(angular){
    'use strict';
    /* global globals, _, angular */
    var moduleName = 'productionplanning.ppsmaterial';

    globals.lookups.MaterialNew = function ($injector){
        var q = $injector.get('$q');
        var _ = $injector.get('_');
        var http = $injector.get('$http');
        var materialRecordMainService = $injector.get('productionplanningPpsMaterialRecordMainService');
        var lookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');

       return{
           lookupOptions:{
               lookupType: 'MaterialNew',
               valueMember: 'Id',
               displayMember: 'Code'
           },
           dataProvider:{
               getList: function () {
                   var deferred = q.defer();
                   deferred.resolve(materialRecordMainService.getList());
                   return deferred.promise;
               },
               getItemByKey : function (key, options, scope) {
                   var deferred = q.defer();
                   if(key <= 0){
                       deferred.resolve();
                   }
                   else{
                       var lookupItem = lookupDescriptorService.getLookupItem(options.lookupType, key);
                       if(_.isNil(lookupItem)){
                           http.get(globals.webApiBaseUrl + 'basics/material/material?id=' +key).then(function (result){
                               //return === mdcMaterial
                               lookupItem = result.data;
                               deferred.resolve(lookupItem);
                           });
                       }
                       else {
                           deferred.resolve(lookupItem);
                       }
                   }
                   return deferred.promise;
               }
           }
       };
    };

    angular.module(moduleName).directive('materialNewLookup',materialNewLookup);
    materialNewLookup.$inject = ['$injector','BasicsLookupdataLookupDirectiveDefinition'];

    function materialNewLookup($injector,BasicsLookupdataLookupDirectiveDefinition) {
        var defaults = globals.lookups.MaterialNew($injector);
        return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {
            dataProvider: defaults.dataProvider
        });
    }
})(angular);
