(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name
	 * @requires
	 * @description
	 */

	var moduleName = 'boq.main';

	angular.module(moduleName).directive('boqMainGaebExportSelectionTypeCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		'boqMainGaebHelperService',
		function (BasicsLookupdataLookupDirectiveDefinition,
			dataService) {

			var defaults = {
				lookupType: 'boqMainGaebExportSelectionTypeLookup',
				valueMember: 'id',
				displayMember: 'description',
				uuid: 'a5b495c8788145e59d6f1a26300ad076'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: function () {

						return dataService.getGaebSelectionTypeAsync();
					},

					getItemByKey: function (value) {

						return dataService.getGaebSelectionTypeByKeyAsync(value);
					}
				}
			});
		}
	]);

})(angular);
