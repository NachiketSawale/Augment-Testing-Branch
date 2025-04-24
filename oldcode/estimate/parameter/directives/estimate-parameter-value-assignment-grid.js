
(function(angular) {
    /* global globals */
    'use strict';
    let moduleName = 'estimate.parameter';
    angular.module(moduleName).directive('estimateParameterValueAssignmentGrid', [
        function () {
            return {
                scope: true,
                restrict: 'A',
                templateUrl: globals.appBaseUrl +'estimate.parameter/templates/estimate-parameter-dialog/estimate-parameter-value-assignment-grid.html',
                compile: function(){
                    return {
                        pre : function(scope, iElem){
                            iElem.on('$destroy', function() {
                                scope.$destroy();
                            });
                        }
                    };
                }
            };
        }
    ]);

})(angular);
