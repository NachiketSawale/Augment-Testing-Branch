(function (angular) {
    'use strict';
    /* global angular */
    angular.module('basics.material').directive('materialInLineInput', ['$translate',
        function ($translate) {
            return {
                restrict: 'AE',
                scope: false,
                link: function (scope, elem, attrs) {
                    var config = !attrs.config || scope.$eval(attrs.config);
                    elem.append('<label style="padding: 5px 0 0;">' + $translate.instant(config.options.label) + '</label>');
            
                }
            };
        }
    ]);


})(angular);