/**
 * Created by reimer on 28.06.2017.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name
	 * @requires
	 * @description
	 */

	var moduleName = 'boq.main';

	angular.module(moduleName).directive('boqMainGaebExportFormatCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		'boqMainGaebHelperService',
		function (BasicsLookupdataLookupDirectiveDefinition,
			dataService) {

			var defaults = {
				lookupType: 'boqMainGaebExportFormatLookup',
				valueMember: 'id',
				displayMember: 'description',
				uuid: 'a5b495c8788145e59d6f1a26300ad076'
				// onDataRefresh: function () {
				// dataService.refresh();
				// }
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: function () {

						return dataService.getGaebFormatsAsync();
					},

					getItemByKey: function (value) {

						return dataService.getGaebFormatByKeyAsync(value);
					}
				}
			});
		}
	]);

})(angular);

