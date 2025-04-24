/**
 * Created by lav on 10/19/2018.
 */
/* global angular, globals, _ */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportCreateTransportRouteDialogResourceService', Service);

	Service.$inject = [
		'$injector',
		'transportplanningTransportCreateTransportRouteDialogServiceFactory',
		'platformModalService',
		'packageTypes',
		'$http',
		'$q',
		'basicsLookupdataLookupDescriptorService',
		'platformContextService'];

	function Service($injector,
					 transportplanningTransportCreateTransportRouteDialogServiceFactory,
					 platformModalService,
					 packageTypes,
					 $http,
					 $q,
					 basicsLookupdataLookupDescriptorService, platformContextService) {

		var service = transportplanningTransportCreateTransportRouteDialogServiceFactory.createInstance({
			pkgType: packageTypes.Resource,
			resultName: 'Resources',
			idProperty: 'Uuid'
		});

		service.createItem = function (entity) {
			$injector.get('resourceMasterGroupImageProcessor').setGroupIcons();//avoid exception for icon column
			getPreSelection(entity).then(function (response) {
				entity.preSelectionSite = response;
				showDialog(entity);
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
					if (entity.DefSrcWaypointJobFk !== null) { //SourceWP Job
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
			if (entity.preSelectionSite) {//validate the site, should be the same filter with lookup
				$http.get(globals.webApiBaseUrl + 'basics/site/getbyid?id=' + entity.preSelectionSite)
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
						defer.resolve();
					});
			} else {
				defer.resolve();
			}
			return defer.promise;
		}

		function showDialog(entity) {
			var modalCreateConfig = {
				templateUrl: globals.appBaseUrl + 'basics.lookupdata/partials/lookup-filter-dialog-form-grid.html',
				resizeable: true,
				width: '60%',
				controller: 'transportplanningTransportResourceLookupController',
				resolve: {
					'$options': function () {
						return {
							entity: entity
						};
					}
				}
			};
			platformModalService.showDialog(modalCreateConfig);
		}

		service.onAddNewItem = function (item) {
			item.PUomFk = item.UomBasisFk;
			item.PQuantity = 1;
		};

		return service;
	}
})(angular);
