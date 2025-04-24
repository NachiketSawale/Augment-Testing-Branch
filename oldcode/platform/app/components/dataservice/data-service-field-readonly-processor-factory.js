/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceFieldReadonlyProcessorFactory
	 * @function
	 * @description
	 * platformDataServiceFieldReadonlyProcessorFactory creates data processors for setting fields readonly by certain criteria
	 */
	angular.module('platform').service('platformDataServiceFieldReadonlyProcessorFactory', PlatformDataServiceFieldReadonlyProcessorFactory);

	PlatformDataServiceFieldReadonlyProcessorFactory.$inject = ['platformRuntimeDataService'];

	function PlatformDataServiceFieldReadonlyProcessorFactory(platformRuntimeDataService) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceRowReadonlyExtension
		 * @description adds selection behaviour to data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */
		var self = this;

		this.createProcessor = function createProcessor(fieldConfigurations) {
			return {
				processItem: function processItem(item, data) {
					var fields = [];
					_.forEach(fieldConfigurations, function (fieldConfiguration) {
						fields.push(self.createFieldReadOnlySpec(item, data, fieldConfiguration));
					});

					if (fields.length >= 1) {
						platformRuntimeDataService.readonly(item, fields);
					}
				}
			};
		};

		this.createFieldReadOnlySpec = function createFieldReadOnlySpec(item, data, fieldConfiguration) {
			return {field: fieldConfiguration.field, readonly: fieldConfiguration.evaluate(item, data)};
		};
	}
})();