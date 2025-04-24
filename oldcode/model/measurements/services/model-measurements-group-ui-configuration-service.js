/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	const moduleName = 'model.measurements';

	/**
	 * @ngdoc service
	 * @name modelMeasurementGroupUIConfigurationService
	 * @function
	 *
	 * @description
	 * modelMeasurementGroupUIConfigurationService is the data service for the UI configurations of the model measurement group entity.
	 */
	angular.module(moduleName).factory('modelMeasurementGroupUIConfigurationService', modelMeasurementGroupUIConfigurationService);

	modelMeasurementGroupUIConfigurationService.$inject = [];

	function modelMeasurementGroupUIConfigurationService() {
		const service = {};

		service.getModelMeasurementGroupLayout = function () {
			return {
				fid: 'model.measurements.modelMeasurementsGroupForm',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [{
					gid: 'contextGroup',
					attributes: ['projectfk']
				}, {
					gid: 'baseGroup',
					attributes: ['descriptioninfo']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}],
				overloads: {
					projectfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookup-data-project-project-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'project',
								displayMember: 'ProjectNo'
							}
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						readonly: true
					},
					'filter': {
						id: 'marker',
						formatter: 'marker',
						field: 'IsMarked',
						name: 'Filter',
						name$tr$: 'constructionsystem.master.filterColumn',
						editor: 'marker',
						editorOptions: {
							serviceName: 'modelMeasurementGroupDataService',
							serviceMethod: 'getList',
							multiSelect: false
						}
					},
				}
			};
		};
		return service;
	}
})(angular);

