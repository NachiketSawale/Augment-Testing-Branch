( function (angular) {
	'use strict';
	angular.module('qto.main').filter('to_trusted',['$sce',function($sce){
		return function(text){
			return $sce.trustAsHtml(text);
		};
	}]);
})(angular);

