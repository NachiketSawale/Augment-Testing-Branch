/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainScopeSelectionService',
		['$q', '$injector', function ($q, $injector) {

			let service = {};

			let ESTIMATE_SCOPE = {
				ALL_ESTIMATE: {
					value: 0,
					label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.allEstimate'
				},
				RESULT_SET: {
					value: 1,
					label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.resultSet'
				},
				RESULT_HIGHLIGHTED: {
					value: 2,
					label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.Highlighted'
				}
			};

			/**
				 * @ngdoc function
				 * @name getScopeFormRow
				 * @function
				 * @methodOf estimateMainScopeSelectionService
				 * @description this row used to select estimate scope, gid : 'default' ; model: 'estimateScope'
				 */
			service.getScopeFormRow = function getScopeFormRow(visable) {
				return {
					gid: 'default',
					rid: 'scope',
					model: 'estimateScope',
					type: 'radio',
					visible: visable,
					label: 'Select Estimate Scope',
					label$tr$: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.label',
					options: {
						valueMember: 'value',
						labelMember: 'label',
						items: [
							{
								value: ESTIMATE_SCOPE.RESULT_SET.value,
								label: 'Current Result set',
								label$tr$: ESTIMATE_SCOPE.RESULT_SET.label
							},
							{
								value: ESTIMATE_SCOPE.ALL_ESTIMATE.value,
								label: 'All Estimate',
								label$tr$: ESTIMATE_SCOPE.ALL_ESTIMATE.label
							}
						]
					}
				};
			};

			service.getAllScopeFormRow = function getAllScopeFormRow() {
				let rowItems = angular.copy(service.getScopeFormRow());
				let selectedItems = {
					value: ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.value,
					label: 'Highlighted Line Item',
					label$tr$: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.Highlighted'
				};
				rowItems.options.items.push(selectedItems);
				rowItems.options.items = _.orderBy(rowItems.options.items,'value','desc');
				return rowItems;
			};

			service.getHighlightScopeFormRow = function getHighlightScopeFormRow() {
				let resultRow =  {
					gid: 'default',
					rid: 'scope',
					model: 'estimateScope',
					type: 'radio',
					label: 'Select Estimate Scope',
					label$tr$:'estimate.main.createBoqPackageWizard.selectScopeSource.scope.label',
					value:ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.value,
					options: {
						valueMember: 'value',
						labelMember: 'label',
						items: [ {
							value: ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.value,
							label: 'Highlighted Line Item',
							label$tr$: ESTIMATE_SCOPE.RESULT_HIGHLIGHTED.label

						}]
					}
				};
				resultRow.readonly =!($injector.get('estimateMainService').getSelectedEntities() && $injector.get('estimateMainService').getSelectedEntities().length >0);
				return resultRow;
			};

			service.getResultSetScopeFormRow = function getResultSetScopeFormRow() {
				let resultRow =  {
					gid: 'default',
					rid: 'scope',
					model: 'estimateScope',
					type: 'radio',
					label: ' ',
					value:ESTIMATE_SCOPE.RESULT_SET.value,
					options: {
						valueMember: 'value',
						labelMember: 'label',
						items: [ {
							value: ESTIMATE_SCOPE.RESULT_SET.value,
							label: 'Current Result set',
							label$tr$: ESTIMATE_SCOPE.RESULT_SET.label

						}]
					}
				};
				return resultRow;
			};

			service.getAllEstimateScopeFormRow = function getAllEstimateScopeFormRow() {
				let mainViewService = $injector.get('mainViewService');
				let currentModuleName = mainViewService.getCurrentModuleName();

				let sourceScopeAllLabel$tr$ = '';

				if (currentModuleName === moduleName){ // Estimate
					sourceScopeAllLabel$tr$ = ESTIMATE_SCOPE.ALL_ESTIMATE.label;
				}else if (currentModuleName === 'estimate.assemblies'){
					sourceScopeAllLabel$tr$ = 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.allAssembly';
				}

				let resultRow =  {
					gid: 'default',
					rid: 'scope',
					model: 'estimateScope',
					type: 'radio',
					label: ' ',
					value:ESTIMATE_SCOPE.ALL_ESTIMATE.value,
					options: {
						valueMember: 'value',
						labelMember: 'label',
						items: [ {
							value: ESTIMATE_SCOPE.ALL_ESTIMATE.value,
							label: 'All Estimate',
							label$tr$: sourceScopeAllLabel$tr$

						}]
					}
				};
				return resultRow;
			};

			return service;
		}
		]);
})(angular);
