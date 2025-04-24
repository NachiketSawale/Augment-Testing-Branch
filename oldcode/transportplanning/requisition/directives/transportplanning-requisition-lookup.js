/**
 * Created by waz on 8/23/2017.
 */
(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.requisition';
    angular.module(moduleName).directive('transportplanningRequisitionLookup', TransportplanningRequisitionLookup);

    TransportplanningRequisitionLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

    function TransportplanningRequisitionLookup(BasicsLookupdataLookupDirectiveDefinition) {

        var defaults = {
            lookupType: 'TrsRequisition',
            valueMember: 'Id',
            displayMember: 'Code',
            editable: 'false',
            columns: [
                {id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
                {
                    id: 'Description',
                    field: 'DescriptionInfo.Description',
                    name: 'Description',
                    name$tr$: 'cloud.common.entityDescription'
                },
                {
                    id: 'Date',
                    field: 'Date',
                    name: 'Date',
                    name$tr$: 'cloud.common.entityDate',
                    formatter: 'datetime'
                }
            ],
            version: 3
        };

        return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
    }
})(angular);