(function (angular) {
    'use strict';
    angular.module('procurement.common').controller('procurementCommonSplitTextPanelController',
        ['$scope',
            function ($scope) {
                $scope.setTools({items:[]});
                $scope.$parent.hideHeader = function (){
                    return true;
                };
            }
        ]);
})(angular);
