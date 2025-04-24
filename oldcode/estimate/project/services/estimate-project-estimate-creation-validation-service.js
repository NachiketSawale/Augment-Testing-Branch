/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global _ */

	let moduleName = 'estimate.project';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateProjectEstimateCreationValidationService', [
		'platformRuntimeDataService','platformModalService',
		function (platformRuntimeDataService, platformModalService) {
			let service = {};
			let _checkSteps = [];

			service.showErrorMsg = function(data)
			{
				let msg = 'The following fields are required or have errors: <br>';
				angular.forEach(data, function (field){
					msg += field.rowLabel + '<br>';
				});
				platformModalService.showErrorBox( msg, 'estimate.project.estimateCreationWizard.error');
			};

			service.validateEstimateType = function(steps, data)
			{
				if(data === -1) {
					steps.push({
						rowLabel: 'Estimate Type',
					});
				}
				return steps;
			};

			service.validateDates = function(steps, data){
				if (data.CONST_DATE.Value > data.SRVCE_DATE.Value)
				{
					steps.push({
						rowLabel: 'In Service Date cannot occur before Construction Date',
					});
				}
				return steps;
			};

			service.validateRequiredCharacteristics = function(form, data) {
				let rowValue;
				let rowChar;
				let rowType;
				// clear list for page
				_checkSteps = [];

				// collect required and visible empty fields
				angular.forEach(form.configure.rows, function (row) {
					let group = _.find(form.configure.groups, {'gid': row.gid});
					let isGroupVisible = group !== 'undefined' ? group.visible : false;

					if (isGroupVisible === true) {
						if (row.visible === true && row.required === true &&
                        row.rid !== 'EstimateType' && row.rid !== 'Template') {
							rowChar = row.rid.split('.')[1];
							rowType = row.rid.split('.')[2];
							rowValue = _.find(data, {'Code': rowChar});

							if(rowType === 'ValueFk')
							{
								if (typeof rowValue === 'undefined') {
									_checkSteps.push({
										rowLabel: row.label
									});
								}
								else {
									if (rowValue.ValueFk === -1 || rowValue.ValueFk === null || rowValue.ValueFk === 0) {
										_checkSteps.push({
											rowLabel: row.label
										});
									}
								}
							}else if (rowValue.Value !== 'undefined') {
								if (rowValue.Value === null || rowValue.Value === '') {
									_checkSteps.push({
										rowLabel: row.label
									});
								}

							}
						}
					}
				});
				return _checkSteps;
			};
			return service;
		}
	]);
})(angular);
