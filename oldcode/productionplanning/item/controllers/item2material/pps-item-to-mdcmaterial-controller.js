/**
 * Created by lav on 12/10/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('ppsItem2MdcMaterialListController', ListController);

	ListController.$inject = ['$scope',
		'platformContainerControllerService', '$injector'];

	function ListController($scope,
							platformContainerControllerService, $injector) {

		var guid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, $scope.getContentValue('moduleName') || moduleName, guid);

		let createBtn = _.find($scope.tools.items, {id: 'create'});
		if(createBtn){
			createBtn.caption = 'productionplanning.item.ppsItem2MdcMaterial.createTooltip';
		}
		let service = getService();
		if(service && service.onUpdateToolsEvent){
			service.onUpdateToolsEvent.register(updateTools)
		}

		function updateTools(entity){
			if(createBtn){
				createBtn.value = entity && entity.PpsUpstreamTypeFk === 1 && !_.isNil(entity.PpsItemUpstreamFk);
			}
			$scope.tools.update();
		}

		function getService(){
			let serviceKey = guid === 'sde4fbd7edsb345dfdr24v55e65ffgcu'? 'productionplanning.item.upstreamitem.material' : 'productionplanning.engineering.ppsitem.upstreamitem.material';
			let service = $injector.get('ppsItem2MdcMaterialDataService').getService( {serviceKey : serviceKey});
			return service;
		}

		$scope.$on('$destroy', function () {
			if(service && service.onPropertyChangeEvent){
				service.onPropertyChangeEvent.unregister(updateTools)
			}
		});
	}
})(angular);