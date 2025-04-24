/**
 * Created by lst on 11/20/2018.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc directive
     * @name basicsImportLanguageLookup
     * @element div
     * @restrict A
     * @description
     * Language lookup.
     *
     */
	angular.module('basics.import').directive('basicsImportLanguageLookup',
		['cloudCommonLanguageService','BasicsLookupdataLookupDirectiveDefinition','$q',
			function (cloudCommonLanguageService,BasicsLookupdataLookupDirectiveDefinition,$q) {
				var defaults = {
					lookupType: 'FileLanguage',
					valueMember: 'Culture',
					displayMember: 'Description'
				};

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {
						getList:
                        function () {return cloudCommonLanguageService.getLanguageItems();},
						getItemByKey:
                        function (value) {
                        	var deferred = $q.defer();
                        	cloudCommonLanguageService.getLanguageItems().then(function (data) {
                        		var selectedItem = _.find(data,{Culture:value});
                        		deferred.resolve(selectedItem);
                        	});

                        	return deferred.promise;
                        }
					}
				});

			}]);
})(angular);