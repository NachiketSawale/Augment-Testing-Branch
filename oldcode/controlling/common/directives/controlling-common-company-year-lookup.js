(function (angular) {
	'use strict';
	let defaults = {
		version:2,
		type:2,
		lookupType: 'CompanyYearCache',
		valueMember: 'Id',
		displayMember: 'TradingYear'
	};
	
	angular.module('controlling.common').directive('controllingCommonCompanyYearLookup', ['BasicsLookupdataLookupDirectiveDefinition','controllingCommonCompanyYearLookupDataService',
		function (BasicsLookupdataLookupDirectiveDefinition,controllingCommonCompanyYearLookupDataService) {
			
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit',defaults,{
				dataProvider: {
					myUniqueIdentifier: 'GccCommonCompanyYearHandler',
					getList: function (option,scope) {
						return controllingCommonCompanyYearLookupDataService.getListAsync(scope.entity);
					},
					getItemByKey:function getItemByKey(identification){
						return controllingCommonCompanyYearLookupDataService.getItemById(identification);
					}
				}
			});
		}
	]);
	
})(angular);
