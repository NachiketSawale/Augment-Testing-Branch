(function () {
	'use strict';
	var moduleName = 'services.schedulerui';

	/**
	 * @ngdoc service
	 * @name servicesSchedulerUIJobTypeIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('servicesSchedulerUIJobTypeIconService', servicesSchedulerUIJobTypeIconService);

	servicesSchedulerUIJobTypeIconService.$inject = ['platformIconBasisService'];

	function servicesSchedulerUIJobTypeIconService(platformIconBasisService) {
		var self = {};
		var icons = [];

		platformIconBasisService.extend(icons, self, 'icon');

		self.processItem = function processItem(lineItem) {
			// insert Images to resource Item according to status
			if (lineItem) {
				lineItem.statusImage = 'ico-object-restrictions-1';
			}
		};

		self.select = function (lineItem) {
			if (lineItem) {
				var image = 'tlb-icons ico-object-restrictions-1';
				return image;
			}
		};

		self.isCss = function () {
			return true;
		};


		return self;
	}
})();
