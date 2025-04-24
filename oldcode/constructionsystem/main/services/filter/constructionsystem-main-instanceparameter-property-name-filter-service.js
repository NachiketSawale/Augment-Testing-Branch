/**
 * Created by chi on 6/14/2016.
 */
(function(angular){
	'use strict';
	var moduleName = 'constructionsystem.main';

	angular.module(moduleName).factory('constructionSystemMainInstanceParameterPropertyNameFilterService', constructionSystemMainInstanceParameterPropertyNameFilterService);

	constructionSystemMainInstanceParameterPropertyNameFilterService.$inject = ['constructionSystemMainInstanceService'];

	function constructionSystemMainInstanceParameterPropertyNameFilterService(constructionSystemMainInstanceService) {

		return function (key, needInstanceId, getObjectIdsFun) {
			return {
				key: key,
				serverSide: true,
				fn: function (item) {
					// don't filter property name, get all the property in 4.0.
					if(key === 'instanceparameter-property-name-filter'){
						return {};
					}

					var modelId = constructionSystemMainInstanceService.getCurrentSelectedModelId();
					var instanceHeaderId = constructionSystemMainInstanceService.getCurrentInstanceHeaderId();
					return {
						modelId: modelId,
						instanceHeaderId: instanceHeaderId,
						instanceId: needInstanceId ? item.InstanceFk : null,
						instance2ObjectFk: item.Instance2ObjectFk,
						modelObjectIds: angular.isFunction(getObjectIdsFun) ? getObjectIdsFun() : null
						// objectIds: angular.isFunction(getObjectIdsFun) ? getObjectIdsFun() : null

					};
				}
			};
		};
	}
})(angular);