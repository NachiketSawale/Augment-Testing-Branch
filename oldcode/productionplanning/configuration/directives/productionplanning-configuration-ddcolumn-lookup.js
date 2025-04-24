/**
 * Created by zov on 11/18/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.configuration';
    angular.module(moduleName).directive('ppsDdcolumnLookup', ppsDdtableLookup);
    ppsDdtableLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];
    function ppsDdtableLookup(BasicsLookupdataLookupDirectiveDefinition) {
        var defaults = {
            lookupType: 'PpsDDColumn',
            valueMember: 'Id',
            displayMember: 'ColumnName',
            uuid: '287b43ca1d384a2d891e59526716ca91',
            version: 3,
            columns: [
                {
                    id: 'columnName',
                    field: 'ColumnName',
                    name: '*ColumnName',
                    width: 300,
                    name$tr$: 'productionplanning.configuration.columnName'
                }
            ]
        };

        return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
    }
})();