/**
 * Created by zov on 3/30/2020.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.common';

    angular.module(moduleName).directive('ppsCommonExposeScope',

        [function () {
                return {
                    restrict: 'EA',
                    scope: {},
                    controller: ['$scope', 'ppsCommonExposeScopeCache', function ($scope, scopeCache) {
                        scopeCache.setScope($scope.$$prevSibling || $scope.$$nextSibling);
                    }]
                };
            }]);

    angular.module(moduleName).factory('ppsCommonExposeScopeCache', [
        function () {
            var cache = {};

            return {
                getScope: function () {
                    return cache.scope;
                },
                setScope: function (value) {
                    cache.scope = value;
                }
            };
        }
    ]);
})();