/**
 * Created by wui on 11/23/2016.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	const companyModule = 'basics.company';

	angular.module(moduleName).factory('basicsCommonCashFlowLayout', [
		function () {
			return {
				'fid': 'basics.common.cashflow',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['enddate', 'percentoftime', 'percentofcost', 'calccumcost', 'calcperiodcost', 'calccumcash',
							'calcperiodcash', 'cumcost', 'periodcost', 'cumcash', 'periodcash', 'actperiodcost', 'actperiodcash']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, companyModule],
					'extraWords': {
						EndDate: {location: companyModule, identifier: 'entityEndDate', initial: 'Period End Date'},
						PercentOfTime: {location: moduleName, identifier: 'percentOfTime', initial: 'Percent Of Time'},
						PercentOfCost: {location: moduleName, identifier: 'percentOfCost', initial: 'Percent Of Cost'},
						CalcCumCost: {location: moduleName, identifier: 'calcCumCost', initial: 'Calculated Cumulative Cost'},
						CalcPeriodCost: {location: moduleName, identifier: 'calcPeriodCost', initial: 'Calculated Period Cost'},
						CalcCumCash: {location: moduleName, identifier: 'calcCumCash', initial: 'Calculated Cumulative Cash'},
						CalcPeriodCash: {location: moduleName, identifier: 'calcPeriodCash', initial: 'Calculated Period Cash'},
						CumCost: {location: moduleName, identifier: 'cumCost', initial: 'Cumulative Cost'},
						PeriodCost: {location: moduleName, identifier: 'periodCost', initial: 'Period Cost'},
						CumCash: {location: moduleName, identifier: 'cumCash', initial: 'Cumulative Cash'},
						PeriodCash: {location: moduleName, identifier: 'periodCash', initial: 'Period Cash'},
						ActPeriodCost: {location: moduleName, identifier: 'actPeriodCost', initial: 'Actual Period Cost'},
						ActPeriodCash: {location: moduleName, identifier: 'actPeriodCash', initial: 'Actual Period Cash'}
					}
				},
				'overloads': {
					'enddate': {readonly: true},
					'percentoftime': {readonly: true},
					'percentofcost': {readonly: true},
					'calccumcost': {readonly: true},
					'calcperiodcost': {readonly: true},
					'calccumcash': {readonly: true},
					'calcperiodcash': {readonly: true},
					'actperiodcost': {readonly: true},
					'actperiodcash': {readonly: true}
				}
			};
		}]);

})(angular);