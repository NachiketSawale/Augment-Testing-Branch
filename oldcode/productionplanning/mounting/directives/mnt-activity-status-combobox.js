/**
 * Created by anl on 8/14/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).directive('productionplanningMountingActivityStatusLookup', ['BasicsLookupdataLookupDirectiveDefinition',
        function (BasicsLookupdataLookupDirectiveDefinition) {

            var defaults = {
                'lookupType': 'ActivityStatus',
                'valueMember': 'Id',
                'displayMember': 'DescriptionInfo.Translated',
                'imageSelector': 'platformStatusIconService'
            };

            return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
        }]);

})(angular);