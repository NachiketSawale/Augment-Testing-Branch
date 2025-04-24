/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainPropkeysBulkAssigbasicsLookupdataConfigGeneratornmentWizardService
	 * @function
	 * @requires _, $http, modelViewerModelSelectionService, platformGridDialogService, platformGridAPI,
	 *           basicsLookupdataConfigGenerator, modelMainPropertyDataService
	 *
	 * @description Provides a wizard for creating a hierarchy of locations based on model object properties.
	 */
	angular.module('model.main').factory('modelMainPropkeysBulkAssignmentWizardService', ['_', '$http',
		'modelViewerModelSelectionService', 'platformGridDialogService', 'platformGridAPI',
		'basicsLookupdataConfigGenerator', 'platformDialogService', 'modelMainPropertyDataService',
		function (_, $http, modelViewerModelSelectionService,
		          platformGridDialogService, platformGridAPI,
		          basicsLookupdataConfigGenerator, platformDialogService, modelMainPropertyDataService) {
			var service = {};

			service.runWizard = function () {
				var selModelId = modelViewerModelSelectionService.getSelectedModelId();
				if (selModelId) {
					var settings = {
						Values: [],
						OverwriteValues: true
					};

					var dlgCfg = {
						headerText$tr$: 'model.main.propKeysBulkAssignment.title',
						showOkButton: true,
						showCancelButton: true,
						dataItem: settings,
						bodyTemplateUrl: 'model.main/templates/model-main-propkeys-bulk-assignment-dialog.html',
						width: '60%'
					};

					return platformDialogService.showDialog(dlgCfg).then(function (result) {
						if (result.ok) {
							settings.Values.forEach(function (v) {
								modelMainPropertyDataService.getAllValueTypes().forEach(function (vt) {
									if (v.valueType !== vt) {
										delete v[modelMainPropertyDataService.valueTypeToPropName(vt)];
									}
								});

								delete v.id;
								delete v.Value;
								//delete v.valueType;
								delete v.__rt$data;
							});
							settings.Values = _.filter(settings.Values, function (v) {
								return _.some(modelMainPropertyDataService.getAllValueTypes(), function (vt) {
									if (v.valueType === vt){
										return true;
									}
								});
							});

							if (_.isEmpty(settings.Values)) {
								return platformDialogService.showErrorBox('model.main.propKeysBulkAssignment.noPropsDesc', 'model.main.propKeysBulkAssignment.noProps').then(function () {
									return {
										success: false
									};
								});
							}

							settings.ObjectIds = settings.ObjectIds.useGlobalModelIds().toCompressedString();

							return $http.post(globals.webApiBaseUrl + 'model/main/object/assignpropvalues', settings).then(function (response) {
								var results = _.isArray(response.data) ? response.data : [];
								results.forEach(function (r, index) {
									r.id = index;
								});

								var cols = [{
									id: 'operation',
									name$tr$: 'model.main.propKeysBulkAssignment.operation',
									formatter: 'description',
									field: 'Operation',
									width: 260
								}, {
									id: 'count',
									name$tr$: 'model.main.propKeysBulkAssignment.objectCount',
									formatter: 'integer',
									field: 'ObjectCount',
									width: 150
								}];
								if (_.some(results, function (r) {
									return !_.isEmpty(r.Problem);
								})) {
									cols.push({
										id: 'problems',
										name$tr$: 'model.main.propKeysBulkAssignment.problems',
										formatter: 'description',
										field: 'Problem',
										width: 400
									});
								}

								return platformGridDialogService.showDialog({
									columns: cols,
									items: results,
									idProperty: 'id',
									tree: false,
									headerText$tr$: 'model.main.propKeysBulkAssignment.summaryTitle',
									topDescription$tr$: 'model.main.propKeysBulkAssignment.summaryDesc',
									isReadOnly: true
								}).then(function () {
									return {
										success: true
									};
								});
							});
						}

						return {
							success: false
						};
					});
				} else {
					return platformDialogService.showErrorBox('model.main.noModelSelected', 'model.main.propKeysBulkAssignment.cannotAssign').then(function () {
						return {
							success: false
						};
					});
				}
			};

			return service;
		}]);
})(angular);
