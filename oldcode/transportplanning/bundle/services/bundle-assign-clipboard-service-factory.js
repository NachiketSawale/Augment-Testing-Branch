/**
 * Created by waz on 2/1/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';
	var module = angular.module(moduleName);

	module.factory('transportplanningBundleAssignClipboardServiceFactory', TransportplanningBundleAssignClipboardServiceFactory);
	TransportplanningBundleAssignClipboardServiceFactory.$inject = ['$injector'];

	function TransportplanningBundleAssignClipboardServiceFactory($injector) {

		function createService(config) {
			var service = {
				paste: paste,
				doCanPaste: doCanPaste,
				copy: copy,
				setClipboardMode: setClipboardMode
			};
			var clipboard = {type: null, cuttingData: null, isCutting: false};
			var sourceDataService = $injector.get(config.sourceDataService);
			var sourceType = config.sourceType;
			var targetDataService = $injector.get(config.targetDataService);
			var targetType = config.targetType;
			var foreignKey = config.foreignKey;

			function copy(data, type) {
				clipboard.cuttingData = _.isArray(data) ? data : [data];
				clipboard.type = type;
			}

			function paste() {
				var keyValue = targetDataService.parentService().getSelected().Id;
				sourceDataService.assignReferences(clipboard.cuttingData, targetDataService, foreignKey, keyValue);
				updateProductInfo(clipboard.cuttingData);
			}

			function doCanPaste(source, type, itemOnDragEnd, itemService) {
				if(source.type !== sourceType){
					return false;
				}
				if(type !== targetType){
					return false;
				}

				if(_.isNil(source.itemService.getSelected())){
					return false;
				}			
				if(_.isNil(source.itemService.parentService().getSelected())){
					return false;
				}	
				if(!itemService.canCreateReference()){
					return false;
				}	
				if(_.isNil(itemService.parentService().getSelected())){
					return false;
				}
				if(source.itemService.getSelected().ProjectFk !== itemService.parentService().getSelected().ProjectFk){
					return false;
				}

				return true;
				/*
				return source.type === sourceType &&
					type === targetType &&
					source.itemService.getSelected() &&
					source.itemService.parentService().getSelected() &&
					itemService.canCreateReference() &&
					itemService.parentService().getSelected();
					*/
			}

			function setClipboardMode(clipboardMode) {
				clipboard.isCutting = clipboardMode;
			}

			function updateProductInfo(items) {
				var reqsBundleIds = {};
				var requisition = targetDataService.parentService().getSelected();
				var assignBundleIds = _.flatten(_.map(items, 'Id'));
				var originBundleIds = _.map(targetDataService.getList(), 'Id');
				reqsBundleIds[requisition.Id] = _.filter(_.uniq(_.concat(originBundleIds, assignBundleIds)),
					function (item) {
						return item !== null;
					});
				targetDataService.parentService().updateProductInfo(reqsBundleIds);
			}

			return service;
		}

		return {
			createService: createService
		};
	}
})(angular);
