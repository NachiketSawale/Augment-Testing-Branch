/**
 * Created by reimer on 02.11.2016.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.userform';

	angular.module(moduleName).directive('basicsUserformWorkflowTemplateCombobox', [
		'$q',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsUserformWorkflowTemplateLookupService',
		function ($q,
			BasicsLookupdataLookupDirectiveDefinition,
			dataService
		) {

			var defaults = {
				lookupType: dataService.getlookupType(),
				valueMember: 'Id',
				displayMember: 'Description',
				uuid: '1359106bb7304855a0ffc10428e3f7a6',
				onDataRefresh: function () {
					dataService.refresh();
				}
			};

			function getList() {

				var deferred = $q.defer();
				dataService.loadData().then(
					function () {
						deferred.resolve(dataService.getList());
					}
				);
				return deferred.promise;
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {

					getList: getList,

					getItemByKey: function (value) {

						var deferred = $q.defer();
						dataService.loadData().then(
							function () {
								deferred.resolve(dataService.getItemByKey(value));
							}
						);
						return deferred.promise;
					},

					getSearchList: getList

				}

			});
		}
	]);

})(angular);

