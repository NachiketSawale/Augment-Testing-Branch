/**
 * Created by jhe on 8/14/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.company';
	angular.module(moduleName).directive('basicsCompanyYearLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'companyyear',
				valueMember: 'Id',
				displayMember: 'TradingYear',
				uuid: 'da794b30be1548aebb157f8965f87071',
				columns: [
					{
						id: 'TradingYear',
						field: 'TradingYear',
						name: 'TradingYear',
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
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);
