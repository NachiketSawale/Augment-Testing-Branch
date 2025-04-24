/**
 * Created by jim on 1/29/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'documents.project';
	angular.module(moduleName).directive('documentsProjectHasDocumentRevisionCombobox',
		['$q', '$translate', 'BasicsLookupdataLookupDirectiveDefinition','_',
			function ($q, $translate, BasicsLookupdataLookupDirectiveDefinition,_) {
				var defaults = {
					lookupType: 'documentsProjectHasDocumentRevisionLookup',
					valueMember: 'Id',
					displayMember: 'Description',
					disableInput: true
				};

				var options = [
					{Id: 1, SortIndx: 1, Value: 1, Description: '', HasBeenTranslated: true},
					{Id: 0, SortIndx: 2, Value: 0, Description: 'project.main.entityNoDocumentRevision', HasBeenTranslated: false}
				];

				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
					dataProvider: {
						getList: function () {
							return $q.when(options);
						},
						getItemByKey: function (key) {
							var item = _.find(options, {Id: key});
							if (!!item && item.HasBeenTranslated === false) {
								item.Description = $translate.instant(item.Description);
								item.HasBeenTranslated = true;
							}
							return $q.when(item);
						}
					}
				});
			}]);

})(angular);
