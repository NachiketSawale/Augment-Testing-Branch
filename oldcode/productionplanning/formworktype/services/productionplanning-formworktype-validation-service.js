/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'productionplanning.formworktype';

	/**
	 * @ngdoc service
	 * @name productionplanningFormworktypeValidationService
	 * @description provides validation methods for drawing type entities
	 */
	angular.module(moduleName).service('productionplanningFormworktypeValidationService', ValidationService);

	ValidationService.$inject = ['$q', '$translate', 'platformDataValidationService', 'platformValidationServiceFactory', 'productionplanningFormworktypeConstantValues', 'productionplanningFormworktypeDataService'];

	/* jshint -W040 */ // remove the warning that possible strict voilation
	function ValidationService($q, $translate, platformDataValidationService, platformValidationServiceFactory, constantValues, dataService) {
		let self = this;
		let schemeInfo = constantValues.schemes.formworktype;
		let specification = {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(schemeInfo)
		};

		platformValidationServiceFactory.addValidationServiceInterface(schemeInfo, specification, self, dataService);

	}

})(angular);
