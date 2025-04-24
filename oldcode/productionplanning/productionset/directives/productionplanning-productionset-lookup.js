/**
 * Created by las on 6/6/2017.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.productionset';
    angular.module(moduleName).directive('productionplanningProductionsetLookup', productionsetLookup);

    productionsetLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

    function productionsetLookup(BasicsLookupdataLookupDirectiveDefinition) {

        var defaults = {
            lookupType: 'ProductionsetLookup',
            valueMember: 'Id',
            displayMember: 'Code',
            uuid: 'b6f99b16e88645f3a00298dd55c50eb9',
            columns: [
                { id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
                { id: 'Description', field: 'DescriptionInfo.Description', name: 'Description', name$tr$: 'cloud.common.entityDescription' }
            ],
            width: 500,
            height: 200,
            version: 3
        };

        return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
      }
})(angular);