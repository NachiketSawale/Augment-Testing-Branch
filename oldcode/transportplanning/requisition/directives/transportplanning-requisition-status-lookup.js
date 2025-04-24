/**
 * Created by waz on 8/22/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.requisition';
    angular.module(moduleName).directive('transportplanningRequisitionStatusLookup', transportplanningRequisitionStatusLookup);

    transportplanningRequisitionStatusLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

    function transportplanningRequisitionStatusLookup(BasicsLookupdataLookupDirectiveDefinition) {

        var defaults = {
            lookupType: 'TrsReqStatus',
            valueMember: 'Id',
                'displayMember': 'DescriptionInfo.Description',
                'imageSelector': 'platformStatusIconService'
            };

        return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
    }
})(angular);