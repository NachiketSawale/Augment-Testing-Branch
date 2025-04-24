/**
 * Created by anl on 3/31/2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc service
	 * @name resourceMasterGroupImageProcessor
	 * @function
	 *
	 * @description generate group icons
	 *
	 */
	angular.module(moduleName).service('resourceMasterGroupImageProcessor', ResourceMasterGroupImageProcessor);

	ResourceMasterGroupImageProcessor.$inject = ['platformIconBasisService', 'resourceMasterLookupService',
		'cloudCommonGridService'];

	function ResourceMasterGroupImageProcessor(platformIconBasisService, resourceMasterLookupService,
	                                           cloudCommonGridService) {

		var icons = [];
		var groups = [];
		var service = {};

		var clearCache = function clearCache() {
			icons = [];
			groups = [];
		};

		service.setGroupIcons = function setGroupIcons() {
			clearCache();

			cloudCommonGridService.flatten(resourceMasterLookupService.getGroupTree(), groups, 'ChildItems');

			platformIconBasisService.setBasicPath('');
			for (var i = 0; i < groups.length; i++) {
				var icon = groups[i].Icon;
				if (icon < 10) {
					icons.push(platformIconBasisService.createCssIconWithId(groups[i].Id, '', 'type-icons ico-resource-folder0' + icon));
				} else {
					icons.push(platformIconBasisService.createCssIconWithId(groups[i].Id, '', 'type-icons ico-resource-folder' + icon));
				}
			}

			platformIconBasisService.extend(icons, this);
		};

		service.select = function (lookupItem, entity) {
			if (!lookupItem || !entity) {
				return '';
			}
			return icons[entity.GroupFk].res;
		};

		//service.setGroupIcons();

		return service;
	}
})(angular);

