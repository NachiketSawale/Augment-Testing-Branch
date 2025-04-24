/**
 * Created by anl on 5/31/2017.
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc service
	 * @name resourceMasterTypeImageProcessor
	 * @function
	 *
	 * @description generate group icons
	 *
	 */
	angular.module(moduleName).service('resourceMasterKindImageProcessor', ResourceMasterKindImageProcessor);

	ResourceMasterKindImageProcessor.$inject = ['_', 'platformIconBasisService', 'basicsLookupdataLookupDescriptorService', '$http', '$q'];

	function ResourceMasterKindImageProcessor(_, platformIconBasisService, basicsLookupdataLookupDescriptorService, $http, $q) {
		var service = {};
		var icons = [];
		var kindItems;

		function getKindList() {
			var defer = $q.defer();
			// var kindList = basicsLookupdataLookupDescriptorService.getData('basics.customize.resourcekind');
			if (_.isNil(kindItems)) {
				return $http.post(globals.webApiBaseUrl + 'basics/customize/resresourcekind/list');
			} else {
				defer.resolve({data: kindItems});
			}
			return defer.promise;
		}

		service.getKindItems = function () {
			return kindItems;
		};
		service.initKindIcons = function () {
			var self = this;
			getKindList().then(function (response) {
				kindItems = response.data;
				platformIconBasisService.setBasicPath('');
				angular.forEach(response.data, function (kind) {
					var icon = _.isNil(kind.Icon) ? 1 : kind.Icon;
					if (icon < 10) {
						icons.push(platformIconBasisService.createCssIconWithId(kind.Id, '', 'type-icons ico-resource0' + icon));
					} else {
						icons.push(platformIconBasisService.createCssIconWithId(kind.Id, '', 'type-icons ico-resource' + icon));
					}
				});
				basicsLookupdataLookupDescriptorService.updateData('basics.customize.resourcekind', response.data);
				platformIconBasisService.extend(icons, self);
			});
		};

		service.select = function (lookupItem, entity) {
			if (!lookupItem || !entity) {
				return '';
			}

			return icons[entity.KindFk].res;
		};

		return service;
	}
})();

