/**
 * Created by rei on 11.06.2015.
 global console
 */

(function (angular) {
	'use strict';

	/**
	 *
	 */
	angular.module('cloud.desktop').factory('cloudDesktopSidebarFavoritesService', cloudDesktopSidebarFavoritesService);

	cloudDesktopSidebarFavoritesService.$inject = ['_', 'moment', '$q', '$http', '$translate', 'platformContextService', 'initApp', 'cloudDesktopSidebarService'];

	function cloudDesktopSidebarFavoritesService(_, moment, $q, $http, $translate, platformContextService, initAppService, sidebarService) { // jshint ignore:line
		let favoritesBaseUrl = globals.webApiBaseUrl + 'project/favorites/';

		let favtypeInfo = {
			0: {
				moduleName: 'project.main',
				sort: 0,
				name: 'cloud.desktop.moduleDisplayNameProjectMain',
				ico: 'ico-project',
				projectContext: true
			},
			1: {
				moduleName: 'procurement.package',
				sort: 4,
				name: 'cloud.desktop.moduleDisplayNamePackage',
				ico: 'ico-package',
				furtherFilters: {Token: 'PRC_PACKAGE', Value: 'key'},
				projectContext: true
			},
			2: {
				moduleName: 'estimate.main',
				sort: 3,
				name: 'cloud.desktop.moduleDisplayNameEstimate',
				ico: 'ico-estimate',
				furtherFilters: {Token: 'EST_HEADER', Value: 'key'},
				projectContext: true
			},
			3: {
				moduleName: 'boq.main',
				sort: 1,
				name: 'cloud.desktop.moduleDisplayNameBoqMain',
				ico: 'ico-project-boq',
				projectContext: true
			},
			4: {
				moduleName: 'scheduling.main',
				sort: 2,
				name: 'cloud.desktop.moduleDisplayNameSchedulingMain',
				ico: 'ico-scheduling',
				furtherFilters: {Token: 'PSD_SCHEDULE', Value: 'key'}
			},
			5: {
				moduleName: 'constructionsystem.main',
				sort: 5,
				name: 'cloud.desktop.moduleDisplayNameConstructionSystemInstance',
				ico: 'ico-construction-system',
				furtherFilters: {Token: 'COS_INS_HEADER', Value: 'key'},
				projectContext: true
			},
			6: {moduleName: '', sort: 0, name: 'cloud.desktop.moduleDisplayNameBusinessBid', ico: 'ico-bid'},
			7: {
				moduleName: 'model.main',
				sort: 7,
				name: 'cloud.desktop.moduleDisplayNameModel',
				ico: 'ico-model',
				naviServiceConnector: {
					retrieveItem: function (modelId) {
						return $http.get(globals.webApiBaseUrl + 'model/project/model/getbyid?id=' + modelId).then(function (response) {
							return response.data;
						});
					}
				}
			},
			8: {
				moduleName: 'productionplanning.item',
				sort: 8,
				name: 'cloud.desktop.moduleDisplayNamePPSItem',
				ico: 'ico-production-planning',
				furtherFilters: {Token: 'productionplanning.item', Value: 'key'},
				projectContext: true
			},
			9: {
				moduleName: 'productionplanning.mounting',
				sort: 9,
				name: 'cloud.desktop.moduleDisplayNamePpsMounting',
				ico: 'ico-mounting',
				furtherFilters: {Token: 'productionplanning.mounting', Value: 'key'},
				projectContext: true
			},
			10: {
				moduleName: 'productionplanning.engineering',
				sort: 10,
				name: 'cloud.desktop.moduleDisplayNameEngineering',
				ico: 'ico-engineering-planning',
				furtherFilters: {Token: 'productionplanning.engineering', Value: 'key'},
				projectContext: true
			}
		};

		function FavoritesSettings(projectId, projectName, expanded) {
			this.projectId = projectId;
			this.projectName = projectName;
			this.addedAt = moment().utc().toISOString();
			this.expanded = expanded ? {[projectId]: expanded} : {'0': true};
		}

		var favoritesSettings = {};

		function addProjectToFavorites(projectId, projectName, expanded) {

			if (favoritesSettings[projectId]) {
				return false;
			}
			favoritesSettings[projectId] = new FavoritesSettings(projectId, projectName, expanded);
			return true;
		}

		function removeProjectToFavorites(projectId) {

			if (favoritesSettings && !favoritesSettings[projectId]) {
				return false;
			}
			delete favoritesSettings[projectId];
			return true;
		}

		function readFavorites() {// jshint ignore:line
			// const inquiryGetAddressesBaseUrl = favoritesBaseUrl + 'getprojectfavorites';
			// var params = {
			//	requestId: inquiryRequestId
			// };
			return $http.get(
				favoritesBaseUrl + 'getprojectfavorites'
			).then(function success(response) {
				if (response.data) {
					favoritesSettings = response.data.favoritesSetting || {};
				}
				return response.data;
			},
			function failed(response) {
				return response.data;
			});
		}

		function saveFavoritesSetting() {
			return $http.post(
				favoritesBaseUrl + 'savefavoritessetting',
				favoritesSettings
			).then(function success(response) {
				return response.data;
			},
			function failed(response) {
				return response.data;
			}
			);
		}

		function IsJsonObj(obj) {
			try {
				let json = JSON.parse(obj);
				return _.isObject(json);
			} catch (e) {
				return false;
			}
		}

		// all method support by this service listed here
		return {
			readFavorites: readFavorites,
			saveFavoritesSetting: saveFavoritesSetting,
			addProjectToFavorites: addProjectToFavorites,
			removeProjectToFavorites: removeProjectToFavorites,
			favtypeInfo: favtypeInfo,
			IsJsonObj: IsJsonObj
		};
	}

})(angular);
