// eslint-disable-next-line no-redeclare
/* global angular */

(function () {
	'use strict';
	var modName = 'procurement.stock';
	var pesModule  = 'procurement.pes';
	var cloudCommonModule = 'cloud.common';

	angular.module(modName).factory('procurementStockAccrualDetailLayout', ['procurementCommonAccrualLayoutService',
		function (procurementCommonAccrualLayoutService) {
			return {
				'fid': 'procurement.stock.accrual.detailform',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['dateeffective', 'bascompanytransactionfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [modName,pesModule,cloudCommonModule],
					'extraWords': {
						DateEffective: {
							location: pesModule,
							identifier: 'entityDateEffective',
							initial: 'Date Effective'
						},
						BasCompanyTransactionFk: {
							location: pesModule,
							identifier: 'entityCompanyTransactionFk',
							initial: 'Company Transaction'
						}
					}
				},
				'overloads': {
					'dateeffective': {
						'readonly': true,
						'detail':{
							'type': 'dateutc',
							'formatter': 'dateutc'
						},
						'grid':{
							'editor': 'dateutc',
							'formatter': 'dateutc'
						}
					},
					'bascompanytransactionfk': {
						readonly: true,
						width: 120
					}
				},
				'addition': procurementCommonAccrualLayoutService.addition()
			};
		}]);
})();
