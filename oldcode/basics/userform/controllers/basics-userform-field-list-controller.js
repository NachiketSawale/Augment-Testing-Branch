(function () {

	'use strict';
	var moduleName = 'basics.userform';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsUserformFieldListController
	 * @function
	 *
	 * @description
	 * Controller for the  field list view
	 **/
	angModule.controller('basicsUserformFieldListController',
		['$scope', 'basicsUserformFieldService', 'basicsUserformFieldUIService', 'platformGridControllerService',
			function ($scope, basicsUserformFieldService, basicsUserformFieldUIService, platformGridControllerService) {

				var myGridConfig = {initCalled: false, columns: []};
				platformGridControllerService.initListController($scope, basicsUserformFieldUIService, basicsUserformFieldService, null, myGridConfig);

				var toolbarItems = [
					{
						id: 't6',
						caption: 'Generate',
						type: 'item',
						iconClass: 'tlb-icons ico-generate-fields',
						fn: function () {
							generateFields();
						}
					}
				];

				platformGridControllerService.addTools(toolbarItems);

				function generateFields() {

					basicsUserformFieldService.parseHtmlTemplate().then(
						function (data) {
							basicsUserformFieldService.setList(data);
						}
					);
				}

				$scope.sqlQueryValidator = function (entity, newVal) {
					// var patt = /^$|^SELECT\s(?!.*--).*FROM\s.*WHERE\s.*=\s*@id(\)?)/i;  // reject comment indicator --

					var patt, errStr;
					if (entity.LookupQualifier === '[SQL Query]') {
						// patt = /^$|^SELECT\s(?!.*--).*FROM\s.*/i;  // reject comment indicator --
						// patt = /^$|^SELECT\s(\[*\w+\]* AS \[*ID\]*),.*(\[*\w+\]* AS \[*DESCRIPTION\]*)\sFROM\s(\[*\w+\]*)/i;
						patt = /^$|^SELECT\s.* AS \[ID\],.* AS \[DESCRIPTION\].* FROM\s.*/i;
						errStr = 'basics.userform.Error_SqlQueryDoesNotFulfillLookupSpecifications';
					} else {
						// patt = /^$|^SELECT\s(?!.*--).*\sFROM\s.*\sWHERE\s.*=\s*(@id)$/i;  // -- reject comment indicator --
						patt = /^$|^SELECT\s.* FROM\s.* WHERE\s.*=\s*@id$/i;
						errStr = 'basics.userform.Error_SqlQueryDoesNotFulfillAllSpecifications';
					}

					var result = patt.test(newVal);
					return {apply: true, valid: result, error$tr$: errStr};
				};

			}
		]);
})();
