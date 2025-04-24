(function (angular, globals) {
	/* global globals */
	'use strict';

	globals.lookups.MtwoChatbotHeaderModuleView = function MtwoChatbotHeaderModuleView($injector) {
		var moduleLookupDataService = $injector.get('moduleLookupDataService');
		return {
			lookupOptions: {
				columns: [
					{
						id: 'description',
						field: 'Description.Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true
					}
				],
				valueMember: 'Id',
				buildSearchString:function(searchValue){
					if(!searchValue){
						return '';
					}
					return searchValue;
				},
				displayMember: 'Description.Description',
				lookupModuleQualifier: 'moduleLookupDataService',
				uuid: 'f4341c6fa21b412587468fd0c14ca8ab',
			},
			dataProvider: {
				myUniqueIdentifier: 'mtwoChatbotheaderViewLookupDataHandler',

				getList: function () {
					return moduleLookupDataService.getListAsync();
				},

				getItemByKey: function (value) {
					return moduleLookupDataService.getItemByIdAsync(value);
				},

				getDisplayItem: function (value) {
					return moduleLookupDataService.getItemByIdAsync(value);
				},

				getSearchList: function (searchRequest) {
					return moduleLookupDataService.getSearchList(searchRequest);
				}
			}
		};
	};

	angular.module('mtwo.chatbot').directive('mtwoChatbotHeaderDialog', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			var defaults = globals.lookups.MtwoChatbotHeaderModuleView($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions, { // or use dialog-edit for the search dialog
				dataProvider: defaults.dataProvider
			});
		}]);
})(angular, globals);
