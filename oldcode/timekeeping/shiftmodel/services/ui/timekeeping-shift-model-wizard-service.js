/**
 * Created by jpfriedel on 27/10/2021
 */

(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc factory
	 * @name timekeepingShiftModelSideBarWizardService
	 * @description
	 * Provides wizard configuration and implementation of all wizards of timekeeping shift model
	 */

	let moduleName = 'timekeeping.shiftmodel';
	angular.module(moduleName).factory('timekeepingShiftModelSideBarWizardService', TimekeepingShiftModelSideBarWizardService);

	TimekeepingShiftModelSideBarWizardService.$inject = ['$http','platformModalFormConfigService','platformTranslateService','platformSidebarWizardConfigService','platformModalService', 'basicsCommonChangeStatusService', 'timekeepingShiftModelDataService','platformSidebarWizardCommonTasksService','basicsLookupdataConfigGenerator','$translate'];

	function TimekeepingShiftModelSideBarWizardService($http,platformModalFormConfigService,platformTranslateService,platformSidebarWizardConfigService, platformModalService, basicsCommonChangeStatusService, timekeepingShiftModelDataService,platformSidebarWizardCommonTasksService,basicsLookupdataConfigGenerator,$translate) {

		let service = {};
		let basicsWizardID = 'timekeepingShiftModelSideBarWizardService';

		service.createExceptionDaysFromCalendar = function createExceptionDaysFromCalendar(){
			let selected = timekeepingShiftModelDataService.getSelected();
			if (platformSidebarWizardCommonTasksService.assertSelection(selected, 'timekeeping.shiftmodel.createExceptionDaysFromCalendar')) {
				// Data ConsolidationLevel, PostingDate should be determined in a dialog
				let selectedShiftModel =  timekeepingShiftModelDataService.getSelected();
				if (!selectedShiftModel) {
					let modalOptions;
					modalOptions = {
						showGrouping: true,
						headerText:'Create ExceptionDays from Calendar',
						bodyText: 'Please select a Shift Model first!',
						iconClass: 'ico-info'
					};
					platformModalService.showDialog(modalOptions);
					return;
				}
			}
			let startTransactionConfig = {
				title: $translate.instant('timekeeping.period.createExceptionDaysFromCalendar'),
				dataItem: {
					TimeSymbolFk: null
				},
				formConfiguration: {
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup'
						}
					],
					rows: [
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'timekeepingTimeSymbolLookupDataService',
							showClearButton: true
						}, {
							gid: 'baseGroup',
							rid: 'timesymbolfk',
							label: 'Type',
							label$tr$: 'timekeeping.shiftmodel.entityTimeSymbolFk',
							type: 'integer',
							model: 'TimeSymbolFk',
							required: true,
							sortOrder: 1,
						})
					]
				},
				// Logic in OK Button
				handleOK: function handleOK(result) {
					if (!result.data.TimeSymbolFk){
						let modalOptions;
						modalOptions = {
							showGrouping: true,
							headerText:'Create ExceptionDays from Calendar',
							bodyText: 'Please select a TimeSymbol for the ExceptionDay Records!',
							iconClass: 'ico-info'
						};
						platformModalService.showDialog(modalOptions);
						return;
					}
					$http.get(globals.webApiBaseUrl + 'timekeeping/shiftmodel/exceptionday/createexceptiondaysforperiod?shiftId=' + selected.Id+'&timesymbolid=' + result.data.TimeSymbolFk).then(function (response) {
						if (response.data) {
							console.log(response.data);
						}
					});

				},
				// Option for cancel button
				dialogOptions: {
					disableOkButton: function () {
						return;
					}
				}
			};
			platformTranslateService.translateFormConfig(startTransactionConfig.formConfiguration);
			platformModalFormConfigService.showDialog(startTransactionConfig);
		};

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(basicsWizardID /* , basicsWizardConfig */);
		};

		service.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(basicsWizardID);
		};

		return service;
	}
})(angular);
