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

	angular.module(moduleName).directive('boqMainGaebExportTypeCombobox', [
		'$q',
		'BasicsLookupdataLookupDirectiveDefinition',
		'boqMainGaebHelperService',
		function ($q,
			BasicsLookupdataLookupDirectiveDefinition,
			dataService) {

			var defaults = {
				lookupType: 'boqMainGaebExportTypeLookup',
				valueMember: 'id',
				displayMember: 'description',
				uuid: 'a9c0074772ba458096751bdda7b16bb1'
				// filterKey: 'boqMainGaebExtensionsByFormat'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: function () {

						return dataService.getGaebExtensionsAsync();
					},

					getItemByKey: function (value) {

						return dataService.getGaebExtensionsAsync().then(function (data) {
							var item = {};
							for (var i = 0; i < data.length; i++) {
								if (data[i].id === value) {
									item = data[i];
									break;
								}
							}
							return item;
						});
					}
				}
			});
		}
	]);

})(angular);

