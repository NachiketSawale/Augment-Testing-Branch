(function (angular) {
	'use strict';
	var moduleName = 'controlling.revrecognition';
	/**
	 * @ngdoc directive
	 * @name basics.company.directive:companyPeriodLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Structure lookup.
	 *
	 */
	angular.module(moduleName).directive('controllingRevenueRecognitionCompanyPeriodCombobox', ['moment', 'BasicsLookupdataLookupDirectiveDefinition',
		function (moment, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'companyperiod',
				valueMember: 'Id',
				displayMember: 'TradingPeriod',
				uuid: 'EEF6FE6563BF4FEC8246682C85F4B4155',
				columns: [
					{
						id: 'TradingPeriod',
						field: 'TradingPeriod',
						name: 'TradingPeriod',
						name$tr$: 'basics.company.entityTradingYear'
					},
					{
						id: 'StartDate',
						field: 'StartDate',
						name: 'StartDate',
						name$tr$: 'basics.company.entityStartDate',
						width: 80,
						formatter: 'dateutc'
					},
					{
						id: 'EndDate',
						field: 'EndDate',
						name: 'EndDate',
						name$tr$: 'basics.company.entityEndDate',
						width: 80,
						formatter: 'dateutc'
					}]
			};
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
				processData: function (dataList) {
					for (var i = 0; i < dataList.length; ++i) {
						var data = dataList[i];
						data.StartDate = moment.utc(data.StartDate);
						data.EndDate = moment.utc(data.EndDate);
					}
					return dataList;
				}
			});
		}]);

})(angular);
