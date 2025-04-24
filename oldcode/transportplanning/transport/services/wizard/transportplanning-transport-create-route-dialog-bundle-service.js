/**
 * Created by lav on 10/19/2018.
 */
/* global angular, globals, _ */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportCreateTransportRouteDialogBundleService', Service);

	Service.$inject = ['$injector', '$http', '$q', 'transportplanningBundleLookupViewService',
		'transportplanningTransportCreateTransportRouteDialogServiceFactory',
		'packageTypes', 'basicsLookupdataLookupDescriptorService',
		'platformContextService'];

	function Service($injector, $http, $q, transportplanningBundleLookupViewService,
	                 transportplanningTransportCreateTransportRouteDialogServiceFactory,
	                 packageTypes, basicsLookupdataLookupDescriptorService,
					     platformContextService) {

		var service = transportplanningTransportCreateTransportRouteDialogServiceFactory.createInstance({
			pkgType: packageTypes.Bundle,
			resultName: 'Bundles'
		});

		service.createItem = function (entity) {
			basicsLookupdataLookupDescriptorService.loadData('SiteType').then(function () {
				$q.all([getFilterKeys(entity), getPreSelection(entity)]).then(function (response) {
					transportplanningBundleLookupViewService.showLookupDialog({
						rows: [{
							id: 'project',
							readonly: false
						}, {
							id: 'site',
							readonly: false
						},{
							id: 'job',
							readonly: false
						}],
						projectId: entity.preSelectedProjectForBundle ? entity.preSelectedProjectForBundle : response[0].projectId,
						siteId: response[1],
						jobId: entity.preSelectedJobForBundle ? entity.preSelectedJobForBundle : response[0].jobId,
						plannedDeliveryTime: entity.PlannedDeliveryTime,
						notAssignedFlags: {
							notAssignedToPkg: true,
							notAssignedToReq: true
						},
						targetDataService: service,
						assignedBundles: _.map(service.getList(), 'Id'),
						getReferencePropertyValue: function () {

						}
					});
				});
			});
		};

		function getPreSelection(entity) {
			var defer = $q.defer();
			var  preSelectionSite = null;
			var  companyId = platformContextService.getContext().signedInClientId;
			$http.get(globals.webApiBaseUrl + 'basics/company/trsconfig/list?mainItemId='+companyId).then(function (response) {
				if (response && response.data.length > 0) {
					var configs = response.data;
					var jobFk;
					if (entity.DefSrcWaypointJobFk !== null && entity.DefSrcWaypointJobFk !== 0) { //SourceWP Job
						jobFk = entity.DefSrcWaypointJobFk;
					} else if (entity.LgmJobFk !== null) { // EventJob
						jobFk = entity.LgmJobFk;
					}

					if(jobFk !== null && _.find(configs, {'JobFk': jobFk})){
						preSelectionSite = _.find(configs, {'JobFk': jobFk}).SiteStockFk;
					}else if(_.find(configs, {'IsDefault': true})){
						preSelectionSite = _.find(configs,  {'IsDefault': true}).SiteStockFk;
					}
					entity.preSelectionSite = preSelectionSite === null ? entity.preSelectionSite :preSelectionSite;

					defer.resolve(validatePreSelection(entity));
				}
			});
			return defer.promise;
		}

		function validatePreSelection(entity) {
			var defer = $q.defer();
			var siteFk = entity.preSelectionSite ? entity.preSelectionSite : entity.SiteFk;
			if (siteFk) {//validate the site, should be the same filter with lookup
				$http.get(globals.webApiBaseUrl + 'basics/site/getbyid?id=' + siteFk)
					.then(function (respon) {
						if (respon && respon.data && respon.data.IsLive) {
							var site = respon.data;
							var siteType = basicsLookupdataLookupDescriptorService.getLookupItem('SiteType', site.SiteTypeFk);
							if (siteType && siteType.IsStockyard && siteType.IsLive) {
								defer.resolve(siteFk);
							}
							else {
								defer.resolve();
							}
						}
						else {
							defer.resolve();
						}
					});
			} else {
				defer.resolve();
			}
			return defer.promise;
		}

		function getFilterKeys(entity) {
			var defer = $q.defer();
			if (Object.prototype.hasOwnProperty.call(entity,'DstWPFk')) {//from add goods wizard
				var promise;
				//get the project filter
				if (entity.DstWPFk) {
					var wpService = $injector.get('transportplanningTransportWaypointLookupDataService');
					var jobFk = wpService.getItemById(entity.DstWPFk, {}).LgmJobFk;
					promise = $http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobId=' + jobFk);
				} else {
					promise = $q.when(entity.ProjectDefFk);
				}
				promise.then(function (respond) {
					defer.resolve({
						projectId: entity.DstWPFk ? respond.data.ProjectFk : respond,
						jobId: entity.JobDefFk
						//siteId: entity.SiteFk
					});
				});
			} else {//from create route wizard
				// $http.get(globals.webApiBaseUrl + 'basics/company/trsconfig/getCurrentClientSite').then(function (siteRespond) {
				// 	defer.resolve({
				// 		projectId: entity.ProjectDefFk,
				// 		siteId: entity.preSelectionSite ? entity.preSelectionSite : siteRespond.data
				// 	});
				// });
				defer.resolve({
					projectId: entity.ProjectDefFk,
					jobId: entity.createWaypointForEachBundle? entity.JobDefFk : entity.ClientJobFk
				});
			}
			return defer.promise;
		}

		return service;
	}
})(angular);
