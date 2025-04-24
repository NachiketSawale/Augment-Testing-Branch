/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.measurements').directive('modelMeasurementLookupDialog',
		modelMeasurementLookupDialog);

	modelMeasurementLookupDialog.$inject = ['BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataConfigGenerator'];

	function modelMeasurementLookupDialog(BasicsLookupdataLookupDirectiveDefinition,
		basicsLookupdataConfigGenerator) {

		const defaults = {
			version: 3,
			lookupType: 'ModelMeasurement',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			columns: [{
				id: 'description',
				field: 'DescriptionInfo.Translated',
				name$tr$: 'cloud.common.entityDescription',
				width: 300
			}, (function generateModelColumn () {
				const lookupCfg = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
					dataServiceName: 'modelProjectModelTreeLookupDataService',
					enableCache: true,
					filter: item => item.ProjectFk,
					additionalColumns: true
				}, {
					id: 'modelfk',
					field: 'ModelFk',
					name$tr$: 'model.project.model',
					width: 200
				});
				delete lookupCfg.editor;
				return lookupCfg;
			})(), {
				id: 'projectfk',
				field: 'ProjectFk',
				name$tr$: 'cloud.common.entityProject',
				width: 200,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'project',
					displayMember: 'ProjectNo'
				}
			}, {
				id: 'value',
				field: 'Value',
				name$tr$: 'model.measurements.value',
				width: 100
			}],
			title: {
				name$tr$: 'model.measurements.measurementLookupTitle'
			},
			uuid: 'abeda0934ed146e2a5eacf6ad1cabd41',
			pageOptions: {
				enabled: true
			}
		};

		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}
})(angular);
