(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).directive('constructionSystemMasterPrjBoqLookup',
		['BasicsLookupdataLookupDirectiveDefinition',
			function (BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'PrjBoqItem',
					valueMember: 'BoqHeaderFk',
					displayMember: 'Reference',
					uuid: 'a1cba7d0d41e45fa9c0ef5ae00e10ef5',
					columns: [
						{
							id: 'Reference',
							field: 'Reference',
							name: 'BoQ Reference',
							width: 150,
							name$tr$: 'procurement.common.boq.boqItemReference'
						},
						{
							id: 'Brief',
							field: 'BriefInfo.Translated',
							name: 'Outline Specification',
							width: 150,
							name$tr$: 'procurement.common.boq.boqItemBrief'
						}
					],
					width: 80,
					height: 200
				};

				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
					dataProvider: 'constructionSystemMasterPrjBoqDataProvider'
				});
			}]);

})(angular);
