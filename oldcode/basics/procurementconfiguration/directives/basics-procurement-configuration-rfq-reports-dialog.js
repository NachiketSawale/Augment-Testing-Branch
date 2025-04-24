/**
 * Created by lvy on 3/28/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_  */

	var modName = 'basics.procurementconfiguration';

	var rubricCategoryList = [
		{ id: 23, value: 'procurement.requisition'},
		{ id: 24, value: 'procurement.rfq'},
		{ id: 25, value: 'procurement.quote'},
		{ id: 26, value: 'procurement.contract'},
		{ id: 27, value: 'procurement.pes'},
		{ id: 28, value: 'procurement.invoice'},
		{ id: 31, value: 'procurement.package'},

		{ id: 4, value: 'sales.bid'},
		{ id: 7, value: 'sales.billing'},
		{ id: 5, value: 'sales.contract'},
		{ id: 17, value: 'sales.wip'}
	];

	angular.module(modName).directive('basicsConfigurationRfqReportsDialog', [
		'$q',
		'$http',
		'BasicsLookupdataLookupDirectiveDefinition',
		'$translate',
		'basicsLookupdataLookupDescriptorService',
		'basicsProcurementConfigurationRubricCategoryService',
		function (
			$q,
			$http,
			BasicsLookupdataLookupDirectiveDefinition,
			$translate,
			lookupDescriptorService,
			rubricCategoryService
		) {
			var defaults = {
				lookupType: 'report',
				valueMember: 'Id',
				displayMember: 'Name.Translated',
				uuid: '2c325be8de9e4c04b238d8def190c078',
				dialogUuid: '2bc24f95ae8e4604a54388f338f48975',
				columns: [
					{ id: 'reportName', field: 'Name.Translated', name: 'Report Name', name$tr$: 'basics.reporting.reportReportName', width: 150 },
					{ id: 'description', field: 'Description.Translated', name: 'Description', name$tr$: 'basics.reporting.entityDescription', width: 150 },
					{ id: 'fileName', field: 'FileName', name: 'File Name', name$tr$: 'basics.reporting.reportFileName', width: 150 },
					{ id: 'filePath', field: 'FilePath', name: 'File Path', name$tr$:'basics.reporting.reportFilePath', width: 150 }
				],
				width: 750,
				height: 200,
				title: { name: $translate.instant('basics.reporting.dialogTitleReport')}
			};

			var customOptions = {
				lookupTypesServiceName: 'ReportsForWizardCofig',
				url: {getList: 'basics/reporting/report/getReportsUnderRfq?module='},
				dataProvider: {
					getList: function () {
						var deferred = $q.defer();
						deferred.resolve(getDataFromDB());
						return deferred.promise;
					},
					getItemByKey: function (value) {
						var deferred = $q.defer();
						var reportsList = lookupDescriptorService.getData('ReportsForWizardCofig');
						if(reportsList) {
							deferred.resolve(_.find(reportsList, {id: value}));
						}
						else {
							getDataFromDB().then(function (data) {
								deferred.resolve(_.find(data, {id: value}));
							});
						}
						return deferred.promise;
					},
					getSearchList: function getSearchList(value, param, scope, searchSettings) {
						var list = [];
						var deferred = $q.defer();
						var reportsList = lookupDescriptorService.getData('ReportsForWizardCofig');
						if (reportsList) {
							_.forEach(reportsList, function (i) {
								var val = getParam(i, param);
								var searchStr = searchSettings.searchString ? searchSettings.searchString.toLowerCase() : null;
								if (val && searchStr && val.search(searchStr) !== -1) {
									list.push(i);
								}
							});
							deferred.resolve(list);
						}
						else {
							getDataFromDB().then(function (data) {
								if (data) {
									_.forEach(data, function (i) {
										var val = getParam(i, param);
										var searchStr = searchSettings.searchString ? searchSettings.searchString.toLowerCase() : null;
										if (val && searchStr && val.search(searchStr) !== -1) {
											list.push(i);
										}
									});
								}
								deferred.resolve(list);
							});
						}

						return deferred.promise;
					}
				}
			};

			function getDataFromDB() {
				var deferred = $q.defer();
				var module = 'procurement.rfq';
				var rubricCategory = rubricCategoryService.getSelected();
				if (rubricCategory) {
					var rubricFk = rubricCategory.RubricFk || (rubricCategory.RubricCategoryEntities[0] ? rubricCategory.RubricCategoryEntities[0].RubricFk : null);
					if (rubricFk) {
						module = _.find(rubricCategoryList, {'id': rubricFk * -1}).value;
					}
				}
				$http.get(globals.webApiBaseUrl + customOptions.url.getList + module)
					.then(function (response) {
						lookupDescriptorService.attachData({ReportsForWizardCofig: response.data}); // store it into lookup descriptor service
						deferred.resolve(response.data);
					});
				return deferred.promise;
			}

			function getParam(item, param) {
				var value = null;
				if (!param) {
					return value;
				}
				var paramArray = param.split('.');
				if (paramArray === 1) {
					return item[param].toLowerCase();
				}
				else {
					var obj = item;
					paramArray.every(function(i) {
						if (_.isObject(obj[i])) {
							obj = obj[i];
							return true;
						}
						else {
							value = obj[i];
							return false;
						}
					});
					return value.toLowerCase();
				}

			}

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, customOptions);
		}
	]);
})(angular);