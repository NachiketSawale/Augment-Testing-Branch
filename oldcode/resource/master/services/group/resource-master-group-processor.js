/**
 * Created by anl on 3/28/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'resource.master';

	angular.module(moduleName).factory('resourceMasterGroupProcessor', ResourceMasterGroupProcessor);

	ResourceMasterGroupProcessor.$inject = ['cloudCommonGridService', 'resourceMasterGroupImageProcessor'];

	function ResourceMasterGroupProcessor(cloudCommonGridService, resourceMasterGroupImageProcessor) {
		var service = [];

		//set group icon
		service.processDataList = function processDataList(dataList) {

			var icons = resourceMasterGroupImageProcessor.getItems();
			var output = [];
			if (dataList.length > 0) {
				cloudCommonGridService.flatten(dataList, output, 'ChildItems');
			}
			for (var i = 0; i < output.length; ++i) {
				var item = output[i];
				if (icons[i]) {
					item.image = icons[i].res;
				}
			}
		};

		return service;
	}

})(angular);
