(function (angular) {
	'use strict';
	var moduleName = 'controlling.revrecognition';
	angular.module(moduleName).directive('controllingRevenueRecognitionCompanyYearCombobox', ['moment', 'BasicsLookupdataLookupDirectiveDefinition',
		function (moment, BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'companyyear',
				valueMember: 'Id',
				displayMember: 'TradingYear',
				uuid: 'da794b30be1548aebb157f8965f87022',
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
