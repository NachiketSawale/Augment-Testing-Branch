/**
 * Created by chk on 6/8/2017.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).directive('materialImportFormatterCombobox', ['$q', 'BasicsLookupdataLookupDirectiveDefinition','basicsMaterialLookUpItems',

		function ($q, BasicsLookupdataLookupDirectiveDefinition,lookUpItems) {
			var defaults = {
				lookupType: 'MaterialImportFormats',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: function () {

						var deferred = $q.defer();
						deferred.resolve(lookUpItems.importFormatter);
						return deferred.promise;
					},

					getItemByKey: function (value) {

						var item = _.find(lookUpItems.importFormatter, {Id: value});
						var deferred = $q.defer();
						deferred.resolve(item);
						return deferred.promise;
					}
				}
			});

		}
	]);

})(angular);