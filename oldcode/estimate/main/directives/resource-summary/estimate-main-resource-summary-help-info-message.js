/**
 * Created by jack on 5.12.2024.
 */
(function (angular) {
    /* global angular */
    'use strict';

    /**
     * @ngdoc directive
     * @name estimate.main.ResourceSummary.directive:estimateMainResourceSummaryHelpInfoMessage
     * @restrict A
     * @priority default value
     * @scope isolate scope
     */
    angular.module('estimate.main').directive('estimateMainResourceSummaryHelpInfoMessage', ['_', '$translate', function (_, $translate) {

        return {
            restrict: 'A',
            template: '<div class="help-info" title="'+$translate.instant("estimate.main.resourceSummaryHelpInfo")+'"><svg style="width: 14px; height: 14px;">' +
                '<use href="cloud.style/content/images/tlb-icons.svg#ico-info2"></use>' +
                '</svg></div>'
        };    }]);
})(angular);







