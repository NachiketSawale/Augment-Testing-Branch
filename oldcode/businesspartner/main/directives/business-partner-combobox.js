/**
 * Created by alm on 2017/4/5.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'businesspartner.main';
	globals.lookups['businesspartner.evluation'] = function () {
		return {
			lookupOptions: {
				lookupType: 'businesspartner.evluation',
				valueMember: 'Id',
				displayMember: 'BusinessPartnerName1'
			}
		};
	};

	angular.module(moduleName).directive('businessPartnerCombobox', ['basicsLookupdataLookupDescriptorService', 'BasicsLookupdataLookupDirectiveDefinition', '$q',
		function (basicsLookupdataLookupDescriptorService, BasicsLookupdataLookupDirectiveDefinition, $q) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups['businesspartner.evluation']().lookupOptions, {
				dataProvider: {
					getList: function () {
						var deferred = $q.defer();
						var businesspartners = basicsLookupdataLookupDescriptorService.getData('businesspartner.evluation');
						deferred.resolve(_.values(businesspartners));
						return deferred.promise;
					},
					getItemByKey: function (key) {
						var businesspartners = basicsLookupdataLookupDescriptorService.getData('businesspartner.evluation');
						return businesspartners[key];
					}
				}
			});

		}]);

})(angular);
