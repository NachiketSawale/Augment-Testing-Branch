/**
 * Created by ada on 2018/9/28.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	globals.lookups.reportCoverSheet = function reportCoverSheet($injector) {
		var q = $injector.get('$q');
		var _ = $injector.get('_');
		var http = $injector.get('$http');
		var basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');

		var customOptions = {
			lookupTypesServiceName: 'ReportCoverSheet',
			url: {getList: 'basics/reporting/sidebar/load?module=procurement.rfq'},
			dataProvider: {
				getList: function () {
					var deferred = q.defer();
					deferred.resolve(getDataFromDB());
					return deferred.promise;
				},
				getItemByKey: function (value) {
					var deferred = q.defer();

					getDataFromDB().then(function (data) {
						var entity = deferred.resolve(_.find(data, {id: value}));
						deferred.resolve(entity);
					});
					return deferred.promise;
				}
			}
		};
		return {
			lookupOptions: {
				lookupType: 'ReportCoverSheet',
				valueMember: 'id',
				displayMember: 'name'
			},
			dataProvider: customOptions.dataProvider,
			customOptions: customOptions
		};

		// ///////////////////

		function getDataFromDB() {
			var deferred = q.defer();
			http.get(globals.webApiBaseUrl + customOptions.url.getList)
				.then(function (response) {
					var list = formatReport(response.data);
					basicsLookupdataLookupDescriptorService.attachData({ReportCoverSheet: list}); // store it into lookup descriptor service
					deferred.resolve(list);
				});
			return deferred.promise;
		}

		function formatReport(data) {
			var reports = [];
			angular.forEach(data, function (item) {
				_.map(item.reports, function (report) {
					// report id is lowercase, but lookup descriptor service store dictionary key a uppercase 'Id'. so need add a 'Id'.
					report.Id = report.id;
					reports.push(report);
				});
			});
			reports = _.uniq(reports, 'Id'); // remove repeated item
			basicsLookupdataLookupDescriptorService.attachData({ReportCoverSheet: reports}); // store it into lookup descriptor service
			return reports;
		}
	};

	/**
     * @ngdoc directive
     * @name priceComparisonReportCoverSheetCombobox
     * @element div
     * @restrict A
     * @description
     * #
     * a combobox directive for cover sheet template.
     */
	angular.module(moduleName).directive('priceComparisonReportCoverSheetCombobox', [
		'$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, LookupDirectiveDefinition) {

			var defaults = globals.lookups.reportCoverSheet($injector);

			return new LookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, defaults.customOptions);
		}
	]);
})(angular, globals);
