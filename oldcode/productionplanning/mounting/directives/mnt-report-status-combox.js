/**
 * Created by lid on 8/22/2017.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).directive('productionplanningMountingReportStatusLookup', ['BasicsLookupdataLookupDirectiveDefinition',
        function (BasicsLookupdataLookupDirectiveDefinition) {

            var defaults = {
                'lookupType': 'ReportStatus',
                'valueMember': 'Id',
                'displayMember': 'DescriptionInfo.Translated',
                'imageSelector': 'platformStatusIconService'
            };

            return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
        }]);

})(angular);