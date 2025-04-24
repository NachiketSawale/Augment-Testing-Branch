(function () {
	'use strict';

	angular.module('platform').factory('platformActionItemListService', platformActionItemListService);

	platformActionItemListService.$inject = ['_'];

	function platformActionItemListService(_) {
		return {
			addDefaultSettings: addDefaultSettings,
			processForNormalizedFields: processForNormalizedFields
		};

		function processForNormalizedFields(newFields) {
			return _.map(_.filter(newFields.items, function (f) {
				return f.hasOwnProperty('visible') && f.visible === true || !f.visible;
			}), addDefaultSettings);
		}

		function addDefaultSettings(field) {
			return _.assign({
				visible: true,
				disabled: false,
				toolTip: '',
				align: 'right',
				ellipsis: false
			}, field);
		}
	}
})();