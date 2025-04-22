/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var salesCommonModule = 'sales.common';

	/**
	 * @ngdoc service
	 * @name salesCommonCreationInitialDialogServiceProvider
	 * @description service provider for all creation initial dialog related functionality.
	 */
	angular.module(salesCommonModule).factory('salesCommonCreationInitialDialogServiceProvider', ['$injector', '$q', '_', 'procurementContextService',
		function ($injector, $q, _, contextService) {

			var CreationInitialDialogService = function (dataServiceName) {
				var service = {};

				service.extendDataItemBase = function extendDataItemBase(dlgLayout) {
					_.each(dlgLayout.formConfiguration.rows, function(row) {
						dlgLayout.dataItem[row.model] = null;
					});
					return dlgLayout;
				};

				service.reorderRows = function reorderRows(dlgLayout, config) {
					_.each(config.ColumnsForCreateDialog, function (columnForCreateDlg) {
						var rowConfig = _.find(dlgLayout.formConfiguration.rows, {model: columnForCreateDlg.PropertyName});
						_.set(rowConfig, 'sortOrder', _.parseInt(columnForCreateDlg.Sorting));
					});
					return dlgLayout;
				};

				service.overrideRequiredRowsConfig = function overrideRequiredRowsConfig(dlgLayout) {
					$injector.get('$log').warn('Please implement my overrideRequiredRowsConfig() method!');
					return dlgLayout;
				};

				service.requestCreationData = function requestCreationData(/* dlgLayout */) {
					$injector.get('$log').warn('Please implement my requestCreationData() method!');
					return $q.when(true);
				};

				service.extendDataItem = function extendDataItem(/* dataItem */) {
					// can be implemented for further data item processing
				};

				service.adjustCreateConfiguration = function adjustCreateConfiguration(dlgLayout, config) {
					var mainDataService = $injector.get(dataServiceName);
					mainDataService.deselect();
					dlgLayout.dataItem.ProjectFk = contextService.loginProject;

					dlgLayout = service.overrideRequiredRowsConfig(dlgLayout);
					dlgLayout = service.reorderRows(dlgLayout, config);
					dlgLayout = service.extendDataItemBase(dlgLayout);

					service.extendDataItem(dlgLayout.dataItem);

					return service.requestCreationData(dlgLayout).then(function () {
						return dlgLayout;
					});
				};

				return service;
			};

			// service api
			return {
				getInstance: function getInstance(dataServiceName) {
					return new CreationInitialDialogService(dataServiceName);
				}
			};
		}
	]);
})();
