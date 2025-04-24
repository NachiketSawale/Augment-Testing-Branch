(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';

	//  EditModes Enumeration
	angular.module(moduleName).constant('basicsWorkflowEditModes', {
		expert: 2,
		default: 1
	});

	angular.module(moduleName).constant('basicsWorkflowtypeSelectedModes', {
		multi: 2,
		single: 1
	});

	angular.module(moduleName).factory('basicsWorkflowReportUtilsService', basicsWorkflowReportUtilsService);

	basicsWorkflowReportUtilsService.$inject = ['$http', '$log', '_', 'basicsWorkflowEditModes', 'platformModuleStateService', '$q'];

	function basicsWorkflowReportUtilsService($http, $log, _, basicsWorkflowEditModes, platformModuleStateService, $q) { // jshint ignore:line

		return {
			getReport: getReport,
			getParametersFromServer: getParametersFromServer,
			getParametersFromJson: getParametersFromJson,
			getParametersFromGrid: getParametersFromGrid,
			getEditMode: getEditMode
		};

		function getEditMode(value) {
			return isParameterDefaultMode(value.parameters) && isReportDefaultMode(value.report) ?
				basicsWorkflowEditModes.default : basicsWorkflowEditModes.expert;
		}

		function isParameterDefaultMode(parameters) {
			var parameterText;
			try {
				parameterText = angular.fromJson(parameters);
			} catch (e) {
				parameterText = parameters;
			}

			return _.isNull(parameterText) || angular.isUndefined(parameterText) || angular.isArray(parameterText);
		}

		function isReportDefaultMode(report) {
			var reportText;
			try {
				reportText = angular.fromJson(report);
			} catch (e) {
				reportText = report;
			}

			return _.isNull(reportText) || angular.isUndefined(reportText) || reportText.hasOwnProperty('Id');
		}

		/**
		 * @ngdoc function
		 * @name getParametersFromJson
		 * @methodOf basics.workflow.basicsWorkflowReportUtilsService
		 * @description Returns an array of the parameters of a report, which is present in the JSON format. This array can be used directly in the grid.
		 * @param {( string )} reportParameters The parameters from the report as JSON-string
		 * @returns { object } An array with parameters of the report for the grid
		 */
		function getParametersFromJson(reportParameters) {

			if (reportParameters) {
				try {
					var params = angular.fromJson(reportParameters);
					var newParams = [];

					if (angular.isArray(params)) {
						for (var i = 0; i < params.length; i++) {
							var item = params[i];
							newParams.push(getStructuredParametersItem(item, 'json'));
						}
					}
					return newParams;
				} catch (e) {
					$log.error(e);
				}
			}

			return null;
		}

		/**
		 * @ngdoc function
		 * @name getParametersFromGrid
		 * @methodOf basics.workflow.basicsWorkflowReportUtilsService
		 * @description Returns an JSON string which contains the edited parameters of a report from the grid. This string will be inserted into the options property of the action.
		 * @param {( object )} gridItems
		 * @returns { string } A JSON string with parameters of the report
		 */
		function getParametersFromGrid(gridItems) {

			if (gridItems) {

				try {
					// push only needed columns
					var items = [];
					_.forEach(gridItems, function (value) {
						var item = {
							Name: value.Name,
							ParamValue: value.ParamValue,
							ParamValueType: value.ParamValueType
						};
						items.push(item);
					});

					return angular.toJson(items);
				} catch (e) {
					$log.error(e);
				}
			}

			return null;
		}

		/**
		 * @ngdoc function
		 * @name getParametersFromServer
		 * @methodOf basics.workflow.basicsWorkflowReportUtilsService
		 * @description Returns an array of the parameters of a report from the server. This array can be used directly in the grid.
		 * @param {( int )} reportId The ID of the report
		 * @returns { object } An array with parameters of the report for the grid
		 */
		function getParametersFromServer(reportId) {

			var reporting = platformModuleStateService.state('basics.workflow');
			//cache the requests
			if (reporting.reportinCache) {
				//get entry from cache-object
				if (reporting.reportinCache[reportId]) {
					//extern call awaits a promise. Therefore this use case
					var deferred = $q.defer();
					deferred.resolve(reporting.reportinCache[reportId]);
					return deferred.promise;
				}
			} else {
				reporting.reportinCache = {};
			}

			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/reporting/sidebar/parametersbyid?id=' + reportId
			})
				.then(function (response) {
					var newParams = [];

					try {
						newParams = response.data.map(function (item) {
							return getStructuredParametersItem(item, 'server');
						});
						//add new entry in cache-object
						reporting.reportinCache[reportId] = newParams;
					} catch (e) {
						$log.error(e);
					}

					return newParams;
				}, function (error) {
					$log.error(error);
				});
		}

		/**
		 * @ngdoc function
		 * @name getReport
		 * @methodOf basics.workflow.basicsWorkflowReportUtilsService
		 * @description Returns an report object from the server.
		 * @param {( int )} reportId The ID of the report
		 * @returns { object } An report object
		 */
		function getReport(reportId) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/reporting/report/reportById?id=' + reportId
			})
				.then(function (response) {
					return response.data;
				}, function (error) {
					$log.error(error);
				});
		}

		function getStructuredParametersItem(item, source) {

			// The name of the property differs depending on the source of the item.
			// 1. server: from 'parameters' property of the report object
			// 2. json: from the 'options' property of the action
			return {
				Id: _.uniqueId(),
				Name: source === 'json' ? item.Name : item.parameterName,
				ParamValueType: source === 'json' ? item.ParamValueType : item.dataType,
				ParamValue: source === 'json' ? item.ParamValue : undefined
			};
		}

		// function loadTemplate() {
		// 	if ($templateCache.get('basics.reporting/sidebar-item.html')) {
		// 		return $q.when(0);
		// 	} else {
		// 		return $templateCache.loadTemplateFile('basics.reporting/templates/reporting-sidebar-templates.html');
		// 	}
		// }
	}
})(angular);
