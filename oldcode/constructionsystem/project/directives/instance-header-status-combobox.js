(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name constructionSystemProjectInstanceHeaderStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * constructionSystem Project InstanceHeader Status combobox.
	 *
	 */
	angular.module('constructionsystem.project').directive('constructionsystemProjectInstanceHeaderStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'InstanceHeaderStatus',
				valueMember: 'Id',
				displayMember: 'Description',
				imageSelector: 'platformStatusIconService'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}
	]);
})(angular);
