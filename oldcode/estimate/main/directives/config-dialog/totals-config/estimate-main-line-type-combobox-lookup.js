(function () {

	'use strict';
	angular.module('estimate.main').directive('estimateMainLineTypeComboboxLookup', ['$q', 'estimateMainLineTypeLookupDataService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, estimateMainLineTypeLookupDataService, BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				version:2,
				lookupType: 'EstimateLineType',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '9107CA2599E7403595B2E6B3DCE8EE5D',
				width: 500,
				columns:[
					{ id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
					{ id: 'RemarkText', field: 'RemarkText', name: 'RemarkText', name$tr$: 'estimate.main.remark',width: '100%'}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults,{
				dataProvider: {
					myUniqueIdentifier: 'EstimateLineType',

					getList: function getList() {
						return estimateMainLineTypeLookupDataService.getList();
					},

					getDefault: function getDefault() {
						return $q.when([]);
					},

					getItemByKey: function getItemByKey(value) {
						return estimateMainLineTypeLookupDataService.getItemByKey(value);
					},

					getSearchList: function getSearchList() {
						return estimateMainLineTypeLookupDataService.getSearchList();
					}
				}
			});
		}
	]);

})();
