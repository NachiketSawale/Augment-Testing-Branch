(function () {

	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).value('projectMainProjectLocationColumns', [
		{ id: 'Code', field: 'Code', name: 'Code', editor: Slick.Editors.InputString, sortable: true, width: 50 }
	]);


	/**
	 * @ngdoc controller
	 * @name projectLocationReadonlyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project locations
	 **/
	angular.module(moduleName).controller('projectLocationReadonlyListController',
		['$scope', 'projectMainService', 'projectMainProjectLocationColumns',
			function ($scope, projectMainService, projectMainProjectLocationColumns) {

				$scope.path = globals.appBaseUrl;
				$scope.error = {};
				$scope.data = [];
				$scope.filterOptions = { showTopPanel: false, sortColumns: [], multiColumnSort: false  };
				var events = [];

				$scope.gridOptions = {
					columns: projectMainProjectLocationColumns,
					events: events,
					selectionModel: new Slick.RowSelectionModel() /*was RowSelectionModel*/
				};
			}

		]);
})();