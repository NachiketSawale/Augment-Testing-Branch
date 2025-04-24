/**
 * Created by chm on 6/4/2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.billingschema';
	angular.module(moduleName).controller('basicsBillingSchemaRemarkController', ['$scope', 'platformLongtextFormControllerFactory', 'basicsBillingschemaTranslationService',

		function ($scope, longTextControllerFactory, basicsBillingschemaTranslationService) {

			longTextControllerFactory.initTextController($scope, basicsBillingschemaTranslationService, moduleName);
		}
	]);
})(angular);