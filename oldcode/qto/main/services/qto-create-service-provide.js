/**
 * Created by alm on 30.11.2017.
 */
(function () {
	'use strict';
	/* global  _ */
	var moduleName = 'qto.main';
	/**
     * @ngdoc service
     * @name estimateCommonCreationServiceProvider
     * @function
     *
     * @description
     * creates instances of creation services to:
     * - manages several processors which can be used to process an item.
     */
	angular.module(moduleName).factory('qtoCreationServiceProvider', [
		function () {

			var CreationServiceProvider = function () {
				var self = this;
				self.processors = {};

				this.addCreationProcessor = function addCreationProcessor(id, funcProcessor) {
					self.processors[id] = funcProcessor;

				};

				this.removeCreationProcessor = function removeCreationProcessor(id) {
					delete self.processors[id];
				};

				this.getCreationProcessors = function getCreationProcessors() {

					return self.processors;
				};

				this.processItem = function processItem(item) {
					_.each(self.processors, function (processor) {
						processor(item);
					});
				};

			};

			// service api
			return {
				getInstance: function () {
					return new CreationServiceProvider();
				}
			};

		}]);

})();