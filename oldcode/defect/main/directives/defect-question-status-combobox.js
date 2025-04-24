/**
 * Created by pet on 7/18/2018.
 */
/* global  */
(function (angular) {

	'use strict';

	var moduleName = 'defect.main';

	angular.module(moduleName).directive('defectQuestionStatusCombobox', ['$q','BasicsLookupdataLookupDirectiveDefinition','defectQuestionStatusDataService',

		function ($q,BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'DefectQuestionStatus',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: 'defectQuestionStatusDataService'// {

				//    getList: function () {
				//
				//        return $q.when(lookUpItems.questionStatusItems);
				//    },
				//
				//    getItemByKey: function (value) {
				//        var res = _.find(lookUpItems.questionStatusItems,function(item){
				//            return item.Id === value;
				//        });
				//        return $q.when(res);
				//    }
				// }
			});

		}
	]);

})(angular);