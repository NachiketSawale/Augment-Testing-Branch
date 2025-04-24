/**
 * Created by reimer on 18.11.2014.
 */

(function (angular) {
	'use strict';

	var modulename = 'basics.userform';

	/**
	 * @ngdoc service
	 * @name
	 * @description
	 */
	angular.module(modulename).factory('basicUserformFormDataGridColumnsService', [

		function () {

			var service = {};

			var gridcols =  [
				{ id: 'id', field: 'Id', name: 'ID', width: 60 },
				{ id: 'rubricFk', field: 'RubricFk', name: 'RubricFk', width: 65, formatter: 'integer' },
				{ id: 'contextFk', field: 'FormDataIntersection.ContextFk', name: 'ContextFk', width: 65, formatter: 'integer' },
				// { id: 'description', field: 'FormDataIntersection.Description', name: 'Description', width: 180, formatter: 'description', editor: 'description' },
				{ id: 'description', field: 'FormDataIntersection.DescriptionInfo', name: 'Description', width: 180, formatter: 'translation', editor: 'translation' },
				{ id: 'insertedAt', field: 'InsertedAt', name: 'Inserted At', formatter: 'date' },
				{ id: 'insertedBy', field: 'InsertedBy', name: 'Inserted By', width: 60 },
				{ id: 'updatedAt', field: 'UpdatedAt', name: 'Updated At', formatter: 'date' },
				{ id: 'updateddBy', field: 'UpdatedBy', name: 'Updated By', width: 60 }
			];

			var init = function() {

				// add translation is's to the column name
				angular.forEach(gridcols, function(value) {
					if (angular.isUndefined(value.name$tr$)) {
						value.name$tr$ = modulename + '.entity.' + value.field;
					}
				});
			};

			service.getStandardConfigForListView = function() {

				return { columns: gridcols };

			};

			init();

			return service;
		}

	]);

})(angular);

