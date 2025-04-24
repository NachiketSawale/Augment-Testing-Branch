/**
 * Created by pet on 7/18/2018.
 */
/* global  */
(function (angular) {
	'use strict';
	var moduleName = 'defect.main';
	angular.module(moduleName).factory('defectQuestionLookupItems',
		['platformTranslateService', 'basicsLookupdataLookupDescriptorService',
			function (platformTranslateService, lookupDescriptorService) {
				var questionStatusItems = [
					{Id: 0, Description: 'NotCheck', Description$tr$: 'defect.main.NotCheck'},
					{Id: 1, Description: 'Checked', Description$tr$: 'defect.main.Checked'},
					{Id: 2, Description: 'NotApplicable', Description$tr$: 'defect.main.NotApplicable'},
					{Id: 3, Description: 'DefectAdded', Description$tr$: 'defect.main.DefectAdded'}
				];

				var lookUpItems = {
					'questionStatusItems': questionStatusItems
				};

				// reloading translation tables
				platformTranslateService.translationChanged.register(function () {
					platformTranslateService.translateObject(questionStatusItems);
				});

				lookupDescriptorService.attachData(lookUpItems);

				return lookUpItems;
			}]);
})(angular);
