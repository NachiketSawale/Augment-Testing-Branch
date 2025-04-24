/**
 * Created by chk on 6/8/2017.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).directive('materialImportPriceVersionCheckbox', [
		function(){
			return {
				restrict: 'AE',
				scope: {
					entity: '='
				},

				templateUrl: globals.appBaseUrl + 'Basics.Material/templates/lookup/material-price-list-version-checkbox.html',
				link:{
					pre:function (scope){
						scope.onChange = function(){
							scope.$emit('customSettingChanged','IsSpecifiedPriceVersion');
						};
					}
				}
			};
		}
	]);

})(angular);