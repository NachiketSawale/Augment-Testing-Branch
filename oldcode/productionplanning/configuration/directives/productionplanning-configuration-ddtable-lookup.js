/**
 * Created by zov on 11/18/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.configuration';
    angular.module(moduleName).directive('ppsDdtableLookup', ppsDdtableLookup);
    ppsDdtableLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];
    function ppsDdtableLookup(BasicsLookupdataLookupDirectiveDefinition) {
        var defaults = {
            lookupType: 'PpsDDTable',
            valueMember: 'Id',
            displayMember: 'TableName',
            uuid: 'a810baa62eb14be6bb8c37831466d178',
            version: 3,
            columns: [
                {
                    id: 'tableName',
                    field: 'TableName',
                    name: '*TableName',
                    width: 300,
                    name$tr$: 'productionplanning.configuration.tableName'
                }
            ]
        };

        return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
    }
})();