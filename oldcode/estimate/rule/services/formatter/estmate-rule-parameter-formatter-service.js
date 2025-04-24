(function () {
	'use strict';
	let moduleName = 'estimate.rule';

	angular.module(moduleName).factory('estimateRuleParameterFormatterService', [
		function () {

			let service = {};

			service.isCss = function(){return true;};

			service.getItemById = function getItemById(entity) {
				let iconItem = {};
				if (!entity.IsUnique) {
					iconItem = {css: true, res: 'status-icons ico-status117', text: ''};
				}
				return iconItem;
			};
			return service;
		}]);
})();
