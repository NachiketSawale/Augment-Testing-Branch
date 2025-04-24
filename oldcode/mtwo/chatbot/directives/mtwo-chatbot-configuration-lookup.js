(function (angular, globals) {
	/* global globals */
	'use strict';

	globals.lookups.MtwoChatbotConfigurationView = function MtwoChatbotConfigurationView($injector) {
		var nlpDataServicetwo = $injector.get('nlpDataServiceTwo');
		return {
			lookupOptions: {
				columns: [
					{
						field: 'Name',
						formatter: 'description',
						id: 'Name',
						name: 'Name',
						name$tr$: 'cloud.common.entityNlpModelName',
						readonly: true
					},
					{
						field: 'Culture',
						formatter: 'description',
						id: 'Culture',
						name: 'Culture',
						name$tr$: 'cloud.common.entityNlpCultrue',
						readonly: true
					},
					{
						field: 'ActiveVersion',
						formatter: 'description',
						id: 'ActiveVersion',
						name: 'ActiveVersion',
						name$tr$: 'cloud.common.entityNlpActiveVersion',
						readonly: true
					}
				],
				descriptionMember: 'Culture',
				valueMember: 'Id',
				buildSearchString:function(searchValue){
					if(!searchValue){
						return '';
					}
					return searchValue;
				},
				displayMember: 'Name',
				lookupModuleQualifier: 'nlpDataServiceTwo',
				uuid: 'f4341c6fa21b412587468fd0c14ca8ab',
			},
			dataProvider: {
				myUniqueIdentifier: 'mtwoChatbotConfigurationViewLookupDataHandler',

				getList: function () {
					return nlpDataServicetwo.getListAsync();
				},

				getItemByKey: function (value) {
					return nlpDataServicetwo.getItemByIdAsync(value);
				},

				getDisplayItem: function (value) {
					return nlpDataServicetwo.getItemByIdAsync(value);
				},

				getSearchList: function (searchRequest) {
					return nlpDataServicetwo.getSearchList(searchRequest);
				}
			}
		};
	};

	angular.module('mtwo.chatbot').directive('mtwoChatbotConfigurationDialog', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			var defaults = globals.lookups.MtwoChatbotConfigurationView($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults.lookupOptions, { // or use dialog-edit for the search dialog
				dataProvider: defaults.dataProvider
			});
		}]);

})(angular, globals);

