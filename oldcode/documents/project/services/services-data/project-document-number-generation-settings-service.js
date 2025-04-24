/**
 * Created by pel on 10/19/2021.
 */
/* global  */
(function () {
	/* global  */
	'use strict';

	var moduleName = 'documents.project';
	var procurementInvoiceModule = angular.module(moduleName);
	var serviceName = 'projectDocumentNumberGenerationSettingsService';

	/**
	 * @ngdoc service
	 * @name projectDocumentNumberGenerationSettingsService
	 * @function
	 *
	 * @description
	 * projectDocumentNumberGenerationSettingsService is the data service for number genereation related functionality.
	 */
	procurementInvoiceModule.factory(serviceName, ['projectDocumentNumberGenerationServiceProvider',
		function (projectDocumentNumberGenerationServiceProvider) {
			return projectDocumentNumberGenerationServiceProvider.getInstance(serviceName);
		}]);
})();