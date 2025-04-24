/**
 * Created by chi on 4/26/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module(moduleName).factory('procurementCommonExchangeratePopupOption', procurementCommonExchangeratePopupOption);
	procurementCommonExchangeratePopupOption.$inject = ['$http', '$translate'/* , 'procurementContextService' */];

	function procurementCommonExchangeratePopupOption($http, $translate/* , procurementContextService */) {
		var options = {
			showPopup: true,
			popupOptions: {
				controller: 'procurementCommonGridPopupController'
			},
			popupLookupConfig: {
				version: 2,
				lookupType: 'exchangeratecomplex',
				// valueMember: 'Id',
				displayMember: 'Rate',
				uuid: '7f3f3fd519a24c73994223f45b6e90ba',
				title: {name: $translate.instant('cloud.common.entityRate')},
				columns: [
					{
						id: 'currencyForeignFk',
						field: 'CurrencyForeignFk',
						name: 'Foreign Currency',
						name$tr$: 'basics.currency.ForeignCurrency',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Currency',
							displayMember: 'Currency'
						}
					},
					{
						id: 'currencyRateTypeFk',
						field: 'CurrencyRateTypeFk',
						name: 'Rate Type',
						name$tr$: 'basics.currency.RateType',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.currency.rate.type',
							lookupSimpleLookup: true,
							valueMember: 'Id'
						}
					},
					{
						id: 'rate',
						field: 'Rate',
						name: 'Rate',
						name$tr$: 'cloud.common.entityRate',
						formatter: 'exchangerate'
					},
					{
						id: 'comment',
						field: 'CommentText',
						name: 'Comment',
						name$tr$: 'cloud.common.entityComment',
						formatter: 'description'
					},
					{
						id: 'rateDate',
						field: 'RateDate',
						name: 'Rate Date',
						name$tr$: 'basics.currency.RateDate',
						formatter: 'dateutc'
					},
					{
						id: 'projectNo',
						field: 'ProjectNo',
						name: 'Project No.',
						name$tr$: 'cloud.common.entityProjectNo',
						formatter: 'code'
					}
				],
				lookupRequest: function (filterValue) {
					if (filterValue && filterValue.currencyForeignFk) {

						var reqUrl = 'procurement/common/exchangerate/exchangeratelookup?projectFk=' + filterValue.projectFk + '&currencyForeignFk=' + filterValue.currencyForeignFk + '&companyFk=' + filterValue.companyFk;

						return $http.get(globals.webApiBaseUrl + reqUrl);
					}

					return null;
				},
				referencedForeignKey: 'Rate'
			}
		};

		return {
			getOptions: getOptions
		};

		// ///////////////////////
		function getOptions() {
			return angular.copy(options);
		}
	}
})(angular);