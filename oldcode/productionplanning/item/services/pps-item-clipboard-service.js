// eslint-disable-next-line func-names
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).service('productionplanningItemClipBoardService', ClipBoardService);

	ClipBoardService.$inject = ['_', '$injector', 'platformGridAPI', '$timeout'];

	function ClipBoardService(_, $injector, platformGridAPI, $timeout) {

		// eslint-disable-next-line no-unused-vars
		function doCanPaste(source, type, itemOnDragEnd, itemService) {
			return source.type === 'projectLocation-leadingStructure';
		}

		function doPaste(source, itemOnDragEnd, targetType, defaultHandler, itemService) {
			let pastedData = _.clone(source.data);
			if (pastedData) {
				if(_.isArray(pastedData)){
					pastedData = pastedData[0];
				}
				if(itemOnDragEnd.PrjLocationFk !== pastedData.Id){
					itemOnDragEnd.PrjLocationFk = pastedData.Id;
					setPrjLocation(itemOnDragEnd, pastedData);
					itemService.markEntitiesAsModified([itemOnDragEnd]);
					$timeout(function () {
						const prjLocationGridUUID = 'a50d663b4bb8459fa61eddcf5ddff889';
						platformGridAPI.grids.resize(prjLocationGridUUID);
					});
				}
			}
		}

		function setPrjLocation(ppsItem, prjLocation){
			let productionplanningItemDataService = $injector.get('productionplanningItemDataService');
			let eventMainServiceFactory = $injector.get('productionplanningCommonEventMainServiceFactory');
			let eventService = eventMainServiceFactory.getService('ItemFk','productionplanning.common.item.event',productionplanningItemDataService);
			if(eventService){
				var selectedPrjLocationId = prjLocation ? prjLocation.Id : null;

				// change sequence events' PrjLocation of PU
				var argsPass = createArgs(ppsItem.Id, selectedPrjLocationId);
				eventService.onPrjLocationChanged.fire(argsPass);

				// change parent PU's PrjLocation and sequence events' PrjLocation of it
				var parentItem = productionplanningItemDataService.getItemById(ppsItem.PPSItemFk);
				while (parentItem) {
					parentItem.PrjLocationFk = selectedPrjLocationId;
					var argsOfParentItem = createArgs(parentItem.Id, parentItem.PrjLocationFk);
					eventService.onPrjLocationChanged.fire(argsOfParentItem);

					var copiedParentItem = _.clone(parentItem);
					copiedParentItem.ChildItems = []; // for do update with child item in the meantime
					productionplanningItemDataService.markItemAsModified(copiedParentItem);

					parentItem = productionplanningItemDataService.getItemById(parentItem.PPSItemFk);
				}
			}

			function createArgs(itemId, prjLocationId) {
				return  {
					foreignKey: 'ItemFk',
					foreignValue: itemId,
					prjLocationId: prjLocationId
				};
			}
		}

		return {
			canDrag: function (type) {
				if(type === 'productionplanning.item'){
					return  true;
				}
				return false;
			},
			doCanPaste: doCanPaste,
			doPaste: doPaste,
			setPrjLocation: setPrjLocation
		};
	}
})(angular);
