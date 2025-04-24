/**
 * Created by joshi on 27.10.2015.
 */
(function (angular) {
	/* global _ */
	'use strict';

	var modulename = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainSurchargedConfigService
	 * @description
	 */
	angular.module(modulename).factory('boqMainSurchargedConfigService', ['basicsLookupdataConfigGenerator',
		'platformContextService',
		'platformLanguageService',
		'accounting',
		'boqMainCommonService',
		function (basicsLookupdataConfigGenerator,
			platformContextService,
			platformLanguageService,
			accounting,
			boqMainCommonService) {

			var service = {};

			service.getSurchargeConfig = function () {
				var surchargeConfig = {
					fid: 'boq.main.boqSurchargeOn',
					version: '0.1.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid: 'BasicData',
							attributes: ['selectmarkup', 'reference', 'briefinfo', 'basuomfk']
						},
						{
							gid: 'QuantityPrice',
							attributes: ['quantity', 'quantitysplit', 'quantitysplittotal']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					'overloads': {
						'reference': {
							editor: null
						},
						'briefinfo': {
							editor: null
						},
						'quantity': {
							editor: null
						},
						// 'basuomfk':basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.uom', 'Uom')
						'basuomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true,
							readonly: true
						}),
						'quantitysplittotal': {
							'editor': null,
							'readonly': true,
							'grid': {
								'formatter': function (row, cell, value, columnDef, entity) {
									var total = 0;
									if (boqMainCommonService.isDivisionOrRoot(entity)) {
										total = entity.SurchargeOnChildren ? _.sumBy(entity.SurchargeOnChildren, function (item) {
											return item.QuantitySplitTotal ? item.QuantitySplitTotal : 0;
										}) : 0;
									} else {
										total = entity.Finalprice * entity.QuantitySplit / entity.Quantity;
									}

									var culture = platformContextService.culture();
									var cultureInfo = platformLanguageService.getLanguageInfo(culture);
									return accounting.formatNumber(total, 2, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);

								}
							}
						}
					}
				};
				return surchargeConfig;
			};
			return service;
		}
	]);

})(angular);
