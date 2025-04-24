/**
 * Created by chm on 6/3/2015.
 */
(function (angular) {

	'use strict';
	/**
	 * @ngdoc controller
	 * @name basicsBillingSchemaDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of billing schema entity.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.billingschema').controller('basicsBillingSchemaDetailController', ['$scope', 'basicsBillingSchemaService', 'platformDetailControllerService', 'basicsBillingSchemaValidationService', 'basicsBillingSchemaStandardConfigurationService', 'basicsBillingschemaTranslationService',

		function ($scope, basicsBillingSchemaService, platformDetailControllerService, basicsBillingSchemaValidationService, basicsBillingSchemaStandardConfigurationService, basicsBillingschemaTranslationService) {

			platformDetailControllerService.initDetailController($scope, basicsBillingSchemaService, basicsBillingSchemaValidationService, basicsBillingSchemaStandardConfigurationService, basicsBillingschemaTranslationService);
		}
	]);
})(angular);