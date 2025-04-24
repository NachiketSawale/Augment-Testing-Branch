/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceDataProcessorExtension
	 * @function
	 * @description
	 * platformDataServiceDataProcessorExtension adds data processor(s behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceDataProcessorExtension', PlatformDataServiceDataProcessorExtension);

	PlatformDataServiceDataProcessorExtension.$inject = ['platformDataProcessExtensionHistoryCreator', '_'];

	function PlatformDataServiceDataProcessorExtension(platformDataProcessExtensionHistoryCreator, _) {
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

		function addAddServiceToEntityProcessor(container) {
			container.data.processor.push( (function(service) {
				return {
					processItem: function(item) {
						if (!item.__rt$data) {
							item.__rt$data = {};
						}
						item.__rt$data.getDataService = function () {
							return service;
						};
					}
				};
			})(container.service));
		}

		this.addHistoryDataProcessor = function addHistoryDataProcessor(container) {
			self.addDataProcessor(container, [platformDataProcessExtensionHistoryCreator]);
		};

		this.addSpecifiedDataProcessor = function addSpecifiedDataProcessor(container, options) {
			if (options.dataProcessor) {
				self.addDataProcessor(container, options.dataProcessor);
			}

			container.service.getDataProcessor = function getDataProcessor() {
				return container.data.processor;
			};
		};

		this.addDataProcessor = function addDataProcessor(container, processorArray) {
			if (!container.data.processor) {
				container.data.processor = [];
				addAddServiceToEntityProcessor(container);
			}

			_.forEach(processorArray, function (proc) {
				container.data.processor.push(proc);
			});
		};

		this.revertProcessItem = function revertProcessItem(item, data) {
			_.forEach(data.processor, function (proc) {
				if (proc.revertProcessItem) {
					proc.revertProcessItem(item);
				}
			});
		};

		this.doProcessItem = function doProcessItem(item, data) {
			_.forEach(data.processor, function (proc) {
				proc.processItem(item, data);
			});
		};

		this.doProcessData = function doProcessData(items, data) {
			_.forEach(items, function (item) {
				self.doProcessItem(item, data);
			});
		};

		this.revertProcessItems = function doRevertProcessItems(items, data) {
			_.forEach(data.processor, function (proc) {
				if (proc.revertProcessItem) {
					_.forEach(items, function (item) {
						proc.revertProcessItem(item);
					});
				}
			});
		};

		this.revertProcessDeletedItems = function doRevertProcessDeletedItems(items, data) {
			_.forEach(data.processor, function (proc) {
				if (proc.revertProcessDeletedItem) {
					_.forEach(items, function (item) {
						proc.revertProcessDeletedItem(item);
					});
				}
				else if (proc.revertProcessItem) {
					_.forEach(items, function (item) {
						proc.revertProcessItem(item);
					});
				}
			});
		};
	}
})();