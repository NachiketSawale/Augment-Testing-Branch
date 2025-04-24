/**
 * Created by joyzhu on 04.03.2022.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name mtwoChatbotModuleListCombobox
	 * @description Lookup for module list
	 */
	var moduleName = 'mtwo.chatbot';

	angular.module(moduleName).directive('mtwoChatbotModuleListCombobox', ['BasicsLookupdataLookupDirectiveDefinition', '$http', '_',
		function (BasicsLookupdataLookupDirectiveDefinition, $http, _) {
			var list = [];
			var defaults = {
				lookupType: 'module',
				valueMember: 'InternalName',
				displayMember: 'Description.Description'
			};

			function getList() {
				return $http.get(globals.webApiBaseUrl + 'mtwo/chatbot/header/module').then(function (response) {
					response.data.unshift({InternalName: null,Description: {Description: ' ', DescriptionTr: 2933}});
					return _.sortBy(response.data, defaults.displayMember);
				});
			}

			function getItemFromList(list, internalName) {
				return _.find(list, {InternalName: internalName});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: getList,

					getItemByKey: function (value) {
						if (list.length < 1) {
							return getList().then(function (response) {
								return getItemFromList(response, value);
							});
						} else {
							return getItemFromList(list, value);
						}
					}
				}
			});
		}
	]);
})(angular);
