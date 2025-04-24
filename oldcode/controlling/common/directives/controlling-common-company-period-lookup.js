(function (angular) {
	'use strict';
	let defaults = {
		version:2,
		type:2,
		lookupType: 'CompanyPeriodCache',
		valueMember: 'Id',
		displayMember: 'TradingPeriod'
	};
	
	angular.module('controlling.common').directive('controllingCommonCompanyPeriodLookup', ['BasicsLookupdataLookupDirectiveDefinition','controllingCommonCompanyPeriodLookupDataService',
		function (BasicsLookupdataLookupDirectiveDefinition,controllingCommonCompanyPeriodLookupDataService) {
			
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit',defaults,{
				dataProvider: {
					myUniqueIdentifier: 'GccCommonCompanyPeriodHandler',
					getList: function (option,scope) {
						return controllingCommonCompanyPeriodLookupDataService.getListAsync(scope.entity);
					},
					getItemByKey:function getItemByKey(identification){
						return controllingCommonCompanyPeriodLookupDataService.getItemById(identification);
					}
				}
			});
		}
	]);
	
})(angular);
