/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceInitialValidationDataProcessorFactory
	 * @function
	 * @requires
	 * @description
	 * platformDataServiceInitialValidationDataProcessorFactory adds data processor(s behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceInitialValidationDataProcessorFactory', PlatformDataServiceInitialValidationDataProcessorFactory);

	PlatformDataServiceInitialValidationDataProcessorFactory.$inject = ['platformSchemaService', '$injector'];

	function PlatformDataServiceInitialValidationDataProcessorFactory(platformSchemaService, $injector) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.PlatformDataServiceDataProcessorExtension
		 * @description adds data processor(s) to data services
		 * @param container {object} contains entire service and its data to be created
		 * @param dataProcessorOptions {object} contains options about used data processors
		 * @returns state
		 */
		var self = this;

		this.createProcessor = function createProcessor(schemeObject, validatorName) {

			var proc = {
				config: []
			};

			var validator = $injector.get(validatorName);

			platformSchemaService.getSchema(schemeObject).then(function (scheme) {
				var objProperties = scheme.properties;
				for (var propName in objProperties) {
					if (objProperties.hasOwnProperty(propName)) {
						var prop = objProperties[propName];
						if (prop.mandatory && prop.domain !== 'boolean' && validator['validate' + propName]) {
							proc.config.push({
								field: propName,
								func: 'validate' + propName
							});
						}
					}
				}
			});

			proc.processItem = function processInitialItemValidation(item, data) {
				if (item.Version === 0) {
					return self.doProcessItem(item, data, proc.config, validator);
				}
				return true;
			};

			return proc;
		};

		this.doProcessItem = function doProcessItem(item, data, config, validator) {
			_.forEach(config, function (prop) {
				validator[prop.func](item, item[prop.field], prop.field);
			});
		};
	}
})(angular);