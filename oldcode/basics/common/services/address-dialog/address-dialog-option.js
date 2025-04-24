/**
 * Created by chi on 2018/4/3.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonAddressDialogOption', basicsCommonAddressDialogOption);

	basicsCommonAddressDialogOption.$inject = ['_'];

	function basicsCommonAddressDialogOption(_) {
		const options = {
			UUID: '0B02B050BEEE4BF1B368A471B401E79B',
			title: 'AddressDialog',
			title$tr$: 'cloud.common.addressDialogTitle',
			valueMember: 'Id',
			dialogWidth: '940px',
			resizeable: true,
			dialogTemplateId: 'address.template',
			cssClass: 'multiline',
			createOptions: {
				urlCreateGet: 'basics/common/address/create',
				succeedCreate: function (item, getLocalStorage, parentData) {
					const countryId = item.CountryFk;
					if (item && parentData) {
						let countryStr = _.toLower('CountryFk');
						_.forOwn(parentData, function (value, key) {
							if (_.toLower(key) === countryStr) {
								item.CountryFk = value;
							}
						});
					}
					if (!item.CountryFk || item.CountryFk <= 0) {
						item.CountryFk = countryId;
						item.StateFk = null;
					}
				}
			},
			formatterOptions: {
				displayMember: 'AddressLine'
			},
			readonlyFields: ['Latitude', 'Longitude'],
			rows: [
				{
					'label': 'Street',
					'label$tr$': 'cloud.common.AddressDialogStreet',
					'type': 'comment',
					'model': 'Street'
				},
				{
					'label': 'Zip Code',
					'label$tr$': 'cloud.common.AddressDialogZipCode',
					'type': 'description',
					'model': 'ZipCode',
					'maxLength': 20
				},
				{
					'label': 'City',
					'label$tr$': 'cloud.common.AddressDialogCity',
					'type': 'description',
					'model': 'City'
				},
				{
					'label': 'County',
					'label$tr$': 'cloud.common.AddressDialogCounty',
					'type': 'description',
					'model': 'County'
				},
				{
					'label': 'Country',
					'label$tr$': 'cloud.common.AddressDialogCountry',
					'type': 'directive',
					'directive': 'basics-lookupdata-country-combobox',
					'model': 'CountryFk'
				},
				{
					'label': 'State',
					'label$tr$': 'cloud.common.AddressDialogState',
					'type': 'directive',
					'directive': 'basics-lookupdata-state-combobox',
					'model': 'StateFk',
					'options': {
						filterKey: 'address-dialog-state-filter',
						showClearButton: true
					}
				},
				{
					label: 'Language',
					label$tr$: 'basics.company.entityLanguageFk',
					type: 'directive',
					directive: 'basics-lookupdata-simple',
					model: 'LanguageFk',
					options: {
						displayMember: 'Description',
						lookupModuleQualifier: 'basics.lookup.language',
						lookupType: 'basics.lookup.language',
						valueMember: 'Id',
						showClearButton: true
					}
				},
				{
					'label': 'Latitude',
					'label$tr$': 'cloud.common.AddressDialogLatitude',
					'type': 'description',
					'model': 'Latitude'
				},
				{
					'label': 'Longitude',
					'label$tr$': 'cloud.common.AddressDialogLongitude',
					'type': 'description',
					'model': 'Longitude'
				},
				{
					'label': 'Address Supplement',
					'label$tr$': 'cloud.common.entityAddressSupplement',
					'type': 'comment',
					'model': 'Supplement'
				},
				{
					'label': 'Manual Input',
					'label$tr$': 'cloud.common.AddressDialogManualInput',
					'type': 'boolean',
					'model': 'AddressModified'
				},
				{
					'label': 'Address',
					'label$tr$': 'cloud.common.AddressDialogAddress',
					'type': 'remark',
					'model': 'Address'
				}
			]
		};

		return {
			getOptions: getOptions
		};

		// ///////////////////////////////////////
		function getOptions() {
			return angular.copy(options);
		}
	}
})(angular);