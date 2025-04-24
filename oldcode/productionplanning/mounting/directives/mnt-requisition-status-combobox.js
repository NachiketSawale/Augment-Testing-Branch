/**
 * Created by anl on 11/22/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).directive('productionplanningMountingRequisitionStatusLookup', ['BasicsLookupdataLookupDirectiveDefinition',
        function (BasicsLookupdataLookupDirectiveDefinition) {

            var defaults = {
                'lookupType': 'RequisitionStatus',
                'valueMember': 'Id',
                'displayMember': 'DescriptionInfo.Translated',
                'imageSelector': 'platformStatusIconService'
            };

            return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
        }]);

})(angular);