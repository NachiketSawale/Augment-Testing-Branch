/**
 * Created by reimer on 16.03.2015.
 */



(function (angular) {
	'use strict';

	angular.module('basics.characteristic').directive('basicsCharacteristicDataDiscreteValueCombobox', ['$q', 'basicsCharacteristicDataDiscreteValueLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, lookupService, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: lookupService.getlookupType(),
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: function () {

						var deferred = $q.defer();
						deferred.resolve(lookupService.getList({lookupType: defaults.lookupType}));
						return deferred.promise;
					},
					getItemByKey: function (value) {

						return lookupService.getItemById(value, {lookupType: defaults.lookupType});

					}
				}
			});
		}
	]);
})(angular);
