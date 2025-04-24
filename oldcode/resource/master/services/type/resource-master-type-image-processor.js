/**
 * Created by anl on 5/31/2017.
 */

(function () {
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
	angular.module(moduleName).service('resourceMasterTypeImageProcessor', ResourceMasterTypeImageProcessor);

	ResourceMasterTypeImageProcessor.$inject = ['_', 'platformIconBasisService', 'basicsLookupdataLookupDescriptorService'];

	function ResourceMasterTypeImageProcessor(_, platformIconBasisService, basicsLookupdataLookupDescriptorService) {

		var service = {};
		var icons = [];

		service.initTypeIcons = function (dataList) {
			var typeList = basicsLookupdataLookupDescriptorService.getData('ResourceMasterType');

			angular.forEach(dataList, function (entity) {
				var type = _.find(typeList, {Id: entity.TypeFk});
				var icon = _.isNil(type.Icon) ? 1 : type.Icon;
				if (icon < 10) {
					icons.push(platformIconBasisService.createCssIconWithId(icon, '', 'type-icons ico-resource0' + icon));
				} else {
					icons.push(platformIconBasisService.createCssIconWithId(icon, '', 'type-icons ico-resource' + icon));
				}
			});
			platformIconBasisService.extend(icons, this);

		};

		service.select = function (lookupItem, entity) {
			if (!lookupItem || !entity) {
				return '';
			}

			return icons[entity.TypeFk].res;
		};

		return service;
	}
})();

