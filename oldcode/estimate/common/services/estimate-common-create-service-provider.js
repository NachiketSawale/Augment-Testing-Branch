/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global _ */
	let moduleName = 'estimate.common';
	/**
	 * @ngdoc service
	 * @name estimateCommonCreationServiceProvider
	 * @function
	 *
	 * @description
	 * creates instances of creation services to:
	 * - manages several processors which can be used to process an item.
	 */
	angular.module(moduleName).factory('estimateCommonCreationServiceProvider', [
		function () {

			let CreationServiceProvider = function () {
				let self = this;
				self.processors = [];
				self.latestSelection = null;

				this.addCreationProcessor = function addCreationProcessor(id, funcProcessor) {
					this.removeCreationProcessor(id);
					self.processors.push({Id: id, func: funcProcessor});
					self.latestSelection = id;
				};

				this.removeCreationProcessor = function removeCreationProcessor(id) {
					self.processors = _.filter(self.processors, function (item) { return item.Id !== id;});
				};

				this.getCreationProcessors = function getCreationProcessors() {
					let res = {};
					_.forEach(self.processors, function (item){
						res[item.Id] = item.func;
					});
					return res;
				};

				this.processItem = function processItem(item) {
					_.each(_.filter(self.processors, function (item) { return item.Id !== self.latestSelection;}), function (processor) {
						processor.func(item);
					});
					var latestItem = _.find(self.processors, function (item) { return item.Id === self.latestSelection;});
					if(latestItem){
						latestItem.func(item);
					}
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
