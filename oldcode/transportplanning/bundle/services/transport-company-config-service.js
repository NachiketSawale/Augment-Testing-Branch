/**
 * Created by anl on 8/2/2021.
 */

(function (angular) {

	'use strict';
	/* global globals, _ */
	let moduleName = 'transportplanning.bundle';
	angular.module(moduleName).factory('transportplanningBundleTrsProjectConfigService', TrsProjectConfigService);

	TrsProjectConfigService.$inject = ['$q', '$http', 'basicsLookupdataLookupDescriptorService'];

	function TrsProjectConfigService(
		$q, $http, basicsLookupdataLookupDescriptorService) {
		let service = {};

		service.getConfigList = function () {
			return basicsLookupdataLookupDescriptorService.getData('transport.company.config');
		};

		service.getStockYardList = function () {
			return basicsLookupdataLookupDescriptorService.getData('basics.site');
		};

		service.initSiteFilter = function (trsSiteId) {
			let siteFilter = [];
			let configs = service.getConfigList();
			let stockyards = service.getStockYardList();
			let sites = [];
			let filterConfig = _.filter(configs, function (config) {
				return config.SiteFk === trsSiteId;
			});
			sites = _.filter(stockyards, function (stockyard) {
				return _.find(filterConfig, {SiteStockFk: stockyard.Id});
			});

			_.forEach(sites, function (site) {
				siteFilter.push(site.Id + '');
			});
			return siteFilter;
		};

		service.initJobFilter = function (trsSiteId) {
			let jobFilter = [];
			let configs = service.getConfigList();
			let filterConfigs = _.filter(configs, function (config) {
				return config.SiteFk === trsSiteId;
			});

			_.forEach(filterConfigs, function (config) {
				jobFilter.push(config.JobFk);
			});
			return _.uniq(jobFilter);
		};

		service.resolveJobIds = (arrJobIds) => {
			let strIds = arrJobIds[0].toString();
			for(let index = 1; index < arrJobIds.length; index++){
				strIds += ',' + arrJobIds[index].toString();
			}
			return strIds;
		};

		service.load = function load() {
			let defer = $q.defer();
			let promises = [];
			promises.push($http.get(globals.webApiBaseUrl + 'basics/company/trsconfig/listAll'));
			promises.push($http.get(globals.webApiBaseUrl + 'basics/sitenew/getstockyards'));

			$q.all(promises).then(function (result) {
				if (result[0] && result[0].data) {
					basicsLookupdataLookupDescriptorService.updateData('transport.company.config', result[0].data);
				}
				if (result[1] && result[1].data) {
					_.forEach(result[1].data, function (site) {
						site.Description = '[' + site.Code + '] - [' + site.DescriptionInfo.Translated + ']';
					});
					basicsLookupdataLookupDescriptorService.updateData('basics.site', result[1].data);
				}
				defer.resolve();
			});

			return defer.promise;
		};

		return service;
	}

})(angular);