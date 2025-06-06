/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function(angular) {
    'use strict';
    let moduleName = 'estimate.main';
    angular.module(moduleName).directive('estimateMdcAllowanceCompany', ['globals',
        function (globals) {
            return {
                scope:true,
                restrict: 'A',
                templateUrl: globals.appBaseUrl +'estimate.main/templates/estimate-allowance/estimate-mdc-allowance-company.html',
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
