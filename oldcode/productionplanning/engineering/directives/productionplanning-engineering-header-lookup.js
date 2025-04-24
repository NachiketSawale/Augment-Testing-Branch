/**
 * Created by zwz on 3/1/2018.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.engineering';
    angular.module(moduleName).directive('productionplanningEngineeringHeaderLookup', Lookup);

    Lookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

    function Lookup(BasicsLookupdataLookupDirectiveDefinition) {
        var defaults = {
            version: 3,
            lookupType: 'EngHeader',
            valueMember: 'Id',
            displayMember: 'Code'
        };

        return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);

    }
})(angular);
