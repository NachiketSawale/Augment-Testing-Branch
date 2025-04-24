/* global angular */
(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.requisition';
    angular.module(moduleName).directive('transportplanningRequisitionMatRequisitionLookup', lookup);

    lookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

    function lookup(BasicsLookupdataLookupDirectiveDefinition) {

        var defaults = {
            lookupType: 'TrsMaterialRequisition',
            version: 3,//for new lookup master api, the value of version should be greater than 2
            valueMember: 'Id',
            displayMember: 'Id',
            editable: 'false',
            columns: [
				{id: 'id', field: 'Id', name: 'Code', name$tr$: 'cloud.common.entityCode'},
                {
                    id: 'mdcmaterialfk', field: 'MdcMaterialFk', name: 'MdcMaterialFk', name$tr$: 'basics.material.import.materialCode',
                    formatter: 'lookup',
                    formatterOptions: {
                        lookupType: 'MaterialCommodity',
                        displayMember: 'Code'
                    }
                },
            ]
        };

        return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
    }
})(angular);