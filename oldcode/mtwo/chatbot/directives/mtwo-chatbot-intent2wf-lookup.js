(function (angular, globals) {
	/* global globals */
	'use strict';

	globals.lookups.MtwoChatbotWf2intentView = function MtwoChatbotWf2intentView($injector) {
		var workflowLookupDataServiceTwo = $injector.get('workflowLookupDataServiceTwo');
		return {
			lookupOptions: {
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true
					},
					{
						id: 'Kind',
						field: 'Kind',
						name: 'Kind',
						name$tr$: 'cloud.common.entityKind',
						formatter: 'description',
						readonly: true
					}

				],
				valueMember: 'Id',
				displayMember: 'Description',
				buildSearchString:function(searchValue){
					if(!searchValue){
						return '';
					}
					return searchValue;
				},
				matchDisplayMembers:['Description'],
				lookupModuleQualifier: 'workflowLookupDataServiceTwo',
				uuid: 'f4341c6fa21b412587468fd0c14ca8ab',
			},
			dataProvider: {
				myUniqueIdentifier: 'mtwoChatbotWf2ViewLookupDataHandler',

				getList: function () {
					return workflowLookupDataServiceTwo.getListAsync();
				},

				getItemByKey: function (value) {
					return workflowLookupDataServiceTwo.getItemByIdAsync(value);
				},

				getDisplayItem: function (value) {
					return workflowLookupDataServiceTwo.getItemByIdAsync(value);
				},

				getSearchList: function (searchRequest) {
					return workflowLookupDataServiceTwo.getSearchList(searchRequest);
				}
			}
		};
	};

	globals.lookups.MtwoChatbotWf2intentNlpView = function MtwoChatbotWf2intentNlpView($injector) {
		var mtwoChatbotNlpIntentLookupDataService = $injector.get('mtwoChatbotNlpIntentLookupDataService');
		return {
			lookupOptions: {
				columns: [
					{
						id: 'Name',
						field: 'Name',
						name: 'Name',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true
					}
				],
				buildSearchString:function(searchValue){
					if(!searchValue){
						return '';
					}
					return searchValue;
				},
				matchDisplayMembers:['Name'],
				valueMember: 'Name',
				displayMember: 'Name',
				lookupModuleQualifier: 'mtwoChatbotNlpIntentLookupDataService',
				uuid: 'f4341c6fa21b412587468fd0c14ca8ab',
			},
			dataProvider: {
				myUniqueIdentifier: 'mtwoChatbotWf2intentNlpLookupDataHandler',

				getList: function () {
					return mtwoChatbotNlpIntentLookupDataService.getListAsync();
				},

				getItemByKey: function (value) {
					return mtwoChatbotNlpIntentLookupDataService.getItemByIdAsync(value);
				},

				getDisplayItem: function (value) {
					return mtwoChatbotNlpIntentLookupDataService.getItemByIdAsync(value);
				},

				getSearchList: function (searchRequest) {
					return mtwoChatbotNlpIntentLookupDataService.getSearchList(searchRequest);
				}
			}
		};
	};

	globals.lookups.MtwoChatbotWf2intentLanguageView = function mtwoChatbotWf2intentLanguageDialog($injector) {
		var languageLookupDataService = $injector.get('languageLookupDataService');
		return {
			lookupOptions: {
				columns: [
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'description',
						readonly: true
					}
				],
				buildSearchString:function(searchValue){
					if(!searchValue){
						return '';
					}
					return searchValue;
				},
				valueMember: 'Id',
				displayMember: 'Description',
				lookupModuleQualifier: 'languageLookupDataService',
				uuid: 'f4341c6fa21b412587468fd0c14ca8ab',
			},
			dataProvider: {
				myUniqueIdentifier: 'mtwoChatbotWf2intentViewLanguageLookupDataHandler',

				getList: function () {
					return languageLookupDataService.getListAsync();
				},

				getItemByKey: function (value) {
					return languageLookupDataService.getItemByIdAsync(value);
				},

				getDisplayItem: function (value) {
					return languageLookupDataService.getItemByIdAsync(value);
				},

				getSearchList: function (searchRequest) {
					return languageLookupDataService.getSearchList(searchRequest);
				}
			}
		};
	};

	angular.module('mtwo.chatbot').directive('mtwoChatbotWf2intentDialog', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			var defaults = globals.lookups.MtwoChatbotWf2intentView($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions, { // or use dialog-edit for the search dialog
				dataProvider: defaults.dataProvider
			});
		}]);

	angular.module('mtwo.chatbot').directive('mtwoChatbotWf2intentNlpDialog', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			var defaults = globals.lookups.MtwoChatbotWf2intentNlpView($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions, { // or use dialog-edit for the search dialog
				dataProvider: defaults.dataProvider
			});
		}]);
	angular.module('mtwo.chatbot').directive('mtwoChatbotWf2intentLanguageDialog', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			var defaults = globals.lookups.MtwoChatbotWf2intentLanguageView($injector);
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults.lookupOptions, { // or use dialog-edit for the search dialog
				dataProvider: defaults.dataProvider
			});
		}]);
})(angular, globals);

