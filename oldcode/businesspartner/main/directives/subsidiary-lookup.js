(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,Slick,$ */

	globals.lookups.subsidiary = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'Subsidiary',
				valueMember: 'Id',
				displayMember: 'AddressLine',
				uuid: '7ad57f370fb745e2b518de209bce604c',
				columns: [
					{id: 'addrType', field: 'AddressTypeInfo.Translated', name: 'Address Type', name$tr$: 'businesspartner.main.addressType', width: 100},
					{id: 'isMainAddr', field: 'IsMainAddress', name: 'Is Main Address', name$tr$: 'businesspartner.main.isMainAddress', formatter: Slick.Formatters.CheckmarkFormatter, width: 80},
					{id: 'subDes', field: 'SubsidiaryDescription', name: 'Description', name$tr$: 'cloud.common.entityDescription', width: 120},
					{id: 'street', field: 'Street', name: 'Street', name$tr$: 'cloud.common.entityStreet', width: 150},
					{id: 'zipCode', field: 'ZipCode', name: 'ZipCode', name$tr$: 'cloud.common.entityZipCode', width: 100},
					{id: 'city', field: 'City', name: 'City', name$tr$: 'cloud.common.entityCity', width: 100},
					{id: 'iso2', field: 'Iso2', name: 'Iso2', name$tr$: 'cloud.common.entityISO2', width: 100},
					{id: 'addressLine', field: 'AddressLine', name: 'Address', name$tr$: 'cloud.common.entityAddress', width: 150}
				],
				width: 500,
				height: 200
			}
		};
	};

	angular.module('businesspartner.main').directive('businessPartnerMainSubsidiaryLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'platformDomainService',
		function (BasicsLookupdataLookupDirectiveDefinition, platformDomainService) {

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.subsidiary().lookupOptions, {
				controller: ['$scope', '$window',
					function ($scope, $window) {

						let executeEmail = function (/* event, editValue */) {
							let contactEntity = $scope.$$childTail.displayItem;
							if (contactEntity?.Email) {
								$window.location.href = 'mailto:' + contactEntity.Email;
							}
						};

						if ($scope.options.displayMember === 'Email') {
							$.extend($scope.lookupOptions, {
								extButtons: [
									{
										class: 'btn btn-default ' + platformDomainService.loadDomain('email').image,
										execute: executeEmail,
										canExecute: function () {
											return true;
										}
									}
								]
							});
						}
					}]
			});
		}
	]);
})(angular, globals);