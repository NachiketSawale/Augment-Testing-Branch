/**
 * Created by joshi on 18.11.2014.
 */
(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.currency';

	/**
	 * @ngdoc service
	 * @name basicsCurrencyUIConfigurationService
	 * @function
	 *
	 * @description
	 * basicsCurrencyUIConfigurationService is the config service for all currecncy views.
	 */
	angular.module(moduleName).factory('basicsCurrencyUIConfigurationService', ['$injector', 'basicsLookupdataConfigGenerator',
		function ($injector, basicsLookupdataConfigGenerator) {

			return {
				getBasicsCurrencyDetailLayout: function () {
					return {
						'fid': 'basics.currency.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': [ 'currency', 'descriptioninfo','sortby', 'isdefault', 'conversionprecision', 'displayprecision', 'roundlogictypefk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'isdefault': { change:'change' },
							'roundlogictypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.roundlogictype')
						}
					};
				},
				getBasicsCurrencyConversionDetailLayout: function () {
					return {
						fid: 'basics.currency.conversion.detailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'basicData',
								attributes: ['currencyforeignfk', 'basis', 'comment']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							currencyforeignfk: basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
								moduleQualifier: 'basicsCurrencyConversionFilteredLookupDataService',
								dataServiceName: 'basicsCurrencyConversionFilteredLookupDataService',
								valMember: 'Id',
								dispMember: 'Currency',
								columns:[
									{ id: 'currency', field: 'Currency', name: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode' },
									{ id: 'Description', field: 'DescriptionInfo', name: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription' }
								],
								filter: function () {
									var item = $injector.get('basicsCurrencyMainService').getSelected();
									return item && item.Id ? item.Id : 0;
								}
							})
						}
					};
				},
				getBasicsCurrencyRateDetailLayout: function () {
					return {
						'fid': 'basics.currency.rate.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': [ 'currencyratetypefk', 'ratedate', 'rate', 'commenttext']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'currencyratetypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.currency.rate.type', 'Description')
						}
					};
				}
			};
		}
	]);
})();

