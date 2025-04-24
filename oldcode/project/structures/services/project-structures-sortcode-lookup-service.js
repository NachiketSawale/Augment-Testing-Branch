/**
 * Created by wul on 10/18/2018.
 */

(function () {
	'use strict';
	var moduleName = 'project.structures';

	/**
	 * @ngdoc service
	 * @name projectStructuresSortCodeLookupService
	 * @function
	 *
	 */
	angular.module(moduleName).factory('projectStructuresSortCodeLookupService', ['_', '$q', '$translate',
		function (_, $q, $translate) {

			// Object presenting the service
			var service = {};

			service.getLookupItems = function getLookupItems() {
				return [
					// {Id:11,Select:false,Code:'SortDescription1', Description: $translate.instant('project.structures.sortDesc01')},
					// {Id:12,Select:false,Code:'SortDescription2', Description: $translate.instant('project.structures.sortDesc02')},
					// {Id:13,Select:false,Code:'SortDescription3', Description: $translate.instant('project.structures.sortDesc03')},
					// {Id:14,Select:false,Code:'SortDescription4', Description: $translate.instant('project.structures.sortDesc04')},
					// {Id:15,Select:false,Code:'SortDescription5', Description: $translate.instant('project.structures.sortDesc05')},
					// {Id:16,Select:false,Code:'SortDescription6', Description: $translate.instant('project.structures.sortDesc06')},
					// {Id:17,Select:false,Code:'SortDescription7', Description: $translate.instant('project.structures.sortDesc07')},
					// {Id:18,Select:false,Code:'SortDescription8', Description: $translate.instant('project.structures.sortDesc08')},
					// {Id:19,Select:false,Code:'SortDescription9', Description: $translate.instant('project.structures.sortDesc09')},
					// {Id:20,Select:false,Code:'SortDescription10', Description: $translate.instant('project.structures.sortDesc10')},
					{
						Id: 1,
						Select: false,
						Code: 'SortCode1',
						Description: $translate.instant('project.structures.sortCode01')
					},
					{
						Id: 2,
						Select: false,
						Code: 'SortCode2',
						Description: $translate.instant('project.structures.sortCode02')
					},
					{
						Id: 3,
						Select: false,
						Code: 'SortCode3',
						Description: $translate.instant('project.structures.sortCode03')
					},
					{
						Id: 4,
						Select: false,
						Code: 'SortCode4',
						Description: $translate.instant('project.structures.sortCode04')
					},
					{
						Id: 5,
						Select: false,
						Code: 'SortCode5',
						Description: $translate.instant('project.structures.sortCode05')
					},
					{
						Id: 6,
						Select: false,
						Code: 'SortCode6',
						Description: $translate.instant('project.structures.sortCode06')
					},
					{
						Id: 7,
						Select: false,
						Code: 'SortCode7',
						Description: $translate.instant('project.structures.sortCode07')
					},
					{
						Id: 8,
						Select: false,
						Code: 'SortCode8',
						Description: $translate.instant('project.structures.sortCode08')
					},
					{
						Id: 9,
						Select: false,
						Code: 'SortCode9',
						Description: $translate.instant('project.structures.sortCode09')
					},
					{
						Id: 10,
						Select: false,
						Code: 'SortCode10',
						Description: $translate.instant('project.structures.sortCode10')
					}

				];
			};

			service.getDefault = function (index){
				return service.getLookupItems()[index];
			};

			service.getCode = function (desc) {
				var code = desc;
				var list = service.getLookupItems();
				_.forEach(list, function (item) {
					if (item.Description === desc) {
						code = item.Code;
					}
				});
				return code;
			};

			return service;
		}]);
})();
