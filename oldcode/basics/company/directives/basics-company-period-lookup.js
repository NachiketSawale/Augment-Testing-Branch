(function (angular) {
	'use strict';
	var moduleName = 'basics.company';
	/**
	 * @ngdoc directive
	 * @name basics.company.directive:companyPeriodLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Structure lookup.
	 *
	 */
	angular.module(moduleName).directive('basicsCompanyCompanyPeriodLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'companyperiod',
				valueMember: 'Id',
				displayMember: 'TradingPeriod',
				dialogUuid: '9ab535de5fe14b28a4a9cd4a0c882bbb',
				uuid: 'EEF6FE6563BF4FEC8246682C85F4B411',
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

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);
