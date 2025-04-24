/**
 * Created by joshi on 17.08.2016.
 */

(function () {

	'use strict';
	/* global _ */

	/**
	 * @ngdoc service
	 * @name estimateMainGenerateSortingService
	 * @function
	 *
	 * @description
	 * creates instances of creation services to:
	 * - manages several processors which can be used to process an item.
	 */
	angular.module('estimate.main').factory('estimateMainGenerateSortingService', ['PlatformMessenger','$injector',
		function (PlatformMessenger,$injector) {

			let service = {
				generateSorting : generateSorting,
				// getNextSortNo : getNextSortNo,
				getLastSortNo : getLastSortNo,
				sortOnDragDrop:sortOnDragDrop,
				sortOnEdit : sortOnEdit,
				assignSorting:assignSorting,
				resourceItemModified : new PlatformMessenger()
			};

			function generateSorting(selectedItem, itemList, creationData)
			{
				let parentItem = {};
				let generatedSortNo = 0;
				// let selectedSortNo = 0;
				let parentSortNo = 0;
				let parentId = creationData.resourceItemId;
				let increment = 1;
				if(parentId){
					parentItem = _.find(itemList, {Id : parentId});
					parentSortNo = parentItem ? parentItem.Sorting : -1;
				}

				// in case of new create item
				if(selectedItem){
					// get sorting number of selected item and then get sortingNumber by increment this number which is result number
					// selectedSortNo = selectedItem.Sorting;
					if(parentId){
						let children = selectedItem.Id === parentId ? _.filter(itemList, {EstResourceFk : selectedItem.Id}) :  _.filter(itemList, {EstResourceFk : parentId});

						if(children && children.length){
							generatedSortNo = getLastSortNo(children) + increment;
						}else{
							generatedSortNo = (parentSortNo * 10) + increment;
						}
					}else{
						// no parent so root parent
						generatedSortNo =getLastParentSortNo(itemList) + 1;
					}
				}else{
					// not selected
					// always parent item...assign last sorting order in list
					generatedSortNo = getLastParentSortNo(itemList) + 1;
				}
				return generatedSortNo;
			}

			// function getNextSortNo(selectedSortNo)
			// {
			// selectedSortNo++;
			// return selectedSortNo;
			// }

			// function getLastParentSortNo(itemList)
			// {
			// 	// use case : when not selected item or other than sub item
			// 	_.sortBy(itemList, ['Sorting']);
			// 	let lastItem = _.findLast(itemList, function (item){
			// 		return item.EstResourceFk === null;
			// 	});
			// 	return lastItem ? lastItem.Sorting : 0;
			// }


			function getLastParentSortNo(itemList) {
				
				let filteredItems = _.filter(itemList, function (item) {
					return item.EstResourceFk === null;
				});
				// Find the item with the maximum 'Sorting' value  the filtered items
				let maxSortingItem = _.maxBy(filteredItems, 'Sorting');
				// Return the maximum 'Sorting' value or 0 if no such item is found
				return maxSortingItem ? maxSortingItem.Sorting : 0;
			}


			function getLastSortNo(itemList)
			{
				itemList = _.sortBy(itemList, ['Sorting']);
				let lastItem = _.findLast(itemList);
				return lastItem ? lastItem.Sorting : 1;
			}

			function sortChildren(resources, parent) {
				let SortNumber = parent.Sorting * 10;
				for (let i = 0; i < resources.length; i++) {
					resources[i].Sorting = ++SortNumber;
					if (resources[i].EstResources && resources[i].EstResources.length > 0) {
						sortChildren(resources[i].EstResources, resources[i]);
					}
				}
			}

			function sortOnDragDrop(destinationItem, itemList, itemToMove)
			{
				if(!itemToMove){
					return;
				}
				let itemToMov = _.find(itemList, {Id:itemToMove.Id});
				itemList = _.sortBy(itemList, ['Sorting']);
				let increment = 1;
				let estimateMainResourceType = $injector.get('estimateMainResourceType');
				if(destinationItem){
					if(destinationItem.EstResourceTypeFk === estimateMainResourceType.SubItem){
						let children = _.filter(itemList, {EstResourceFk : destinationItem.Id});
						// let lastNo = getLastSortNo(children) + increment;
						itemToMov = _.find(itemList, {Id:itemToMove.Id});
						let parentSortNo=destinationItem.Sorting;
						if(itemToMov){
							// itemToMov.Sorting = lastNo;
							if(children && children.length) {
								itemToMov.Sorting = getLastSortNo(children) + increment;
							}
							else {
								itemToMov.Sorting=(parentSortNo * 10 ) + increment;
							}
							itemToMov.EstResourceFk = destinationItem.Id;
						}
						if(itemToMov.EstResources.length > 0){
							sortChildren(itemToMov.EstResources,itemToMov);
						}
					}else{
						// set itemToMove after destinationItem in list
						let prevSortNo = destinationItem.Sorting ? destinationItem.Sorting : 1;
						// let item = _.find(itemList, {Id:itemToMove.Id});
						if(itemToMov){
							itemToMov.Sorting = prevSortNo + increment;
							// itemToMove.Sorting = itemToMov.Sorting;
							itemToMov.EstResourceFk = destinationItem.EstResourceFk;
						}
						// get index of destination item and fetch all item after tht for renumber
						let startIndex = _.findIndex(itemList, destinationItem);
						prevSortNo = itemToMov.Sorting;
						for(let i = startIndex+1; i <= itemList.length -1; i++){
							let nextItem = itemList[i];
							if(nextItem && nextItem.EstResourceFk === destinationItem.EstResourceFk && nextItem.Id !== itemToMove.Id){
								nextItem.Sorting = prevSortNo + increment;
								prevSortNo = nextItem.Sorting;
							}
						}
					}
				}else{

					let lastItem = _.findLast(itemList, function(i) {
						itemToMove.EstResourceFk= null;
						if(i.EstResourceFk === null && i.Id !== itemToMove.Id){
							return i;
						}});
					itemToMov.Sorting = lastItem ? lastItem.Sorting + increment : increment;
					itemToMov.EstResourceFk = null;
					if(itemToMov.EstResources.length > 0){
						sortChildren(itemToMov.EstResources,itemToMov);
					}

				}
				return itemList;
			}


			function sortOnEdit(itemList, itemToMove, dataService)
			{
				if(!itemToMove){
					return;
				}

				if(dataService === null || dataService === undefined){
					dataService = $injector.get('estimateMainResourceService');
				}

				assignSorting([itemToMove],itemToMove.Sorting.toString());
				service.resourceItemModified.fire(itemToMove);
				if(itemToMove.EstResources.length > 0) {
					markChildrenAsModified(itemToMove);
				}

				let increment = 1;
				let prevSortNo = itemToMove.Sorting ? itemToMove.Sorting : 1;

				let itemsToSort = _.filter(itemList, function(item){
					if( item.Id !== itemToMove.Id && item.EstResourceFk === itemToMove.EstResourceFk && item.Sorting >= itemToMove.Sorting){
						return item;
					}
				});

				itemsToSort = _.sortBy(itemsToSort, ['Sorting']);
				angular.forEach(itemsToSort, function(item){
					item.Sorting = prevSortNo + increment;
					prevSortNo = item.Sorting;
					assignSorting([item],item.Sorting.toString());
					service.resourceItemModified.fire(item);
					if(item.EstResources.length > 0) {
						markChildrenAsModified(item);
					}
				});

				dataService.setList(itemList, false);
				dataService.fireListLoaded();

				return itemList;
			}

			function markChildrenAsModified(parent) {
				let children = [];
				children = $injector.get('cloudCommonGridService').getAllChildren(parent, 'EstResources');
				if (children && children.length > 0) {
					angular.forEach(children, function (res) {
						service.resourceItemModified.fire(res);
					});
				}
			}

			// sorting resource
			function assignSorting(objArray, sortingPrefix = '', isCall = true, sortResourceBySorting = false) {
				if (sortResourceBySorting) {
					objArray = _.sortBy(objArray, ['Sorting']);
				}
				let lastNumber = parseInt(sortingPrefix.slice(-3));
				for (let i = 0; i < objArray.length; i++) {
					const itemSortingPrefix = isCall ? sortingPrefix : sortingPrefix + (i + 1).toString();
					if (isCall) {
						lastNumber += 1;
						sortingPrefix = sortingPrefix.slice(0, -3) + lastNumber.toString().padStart(2, '0');
					}
					const obj = objArray[i];
					obj.Sorting = parseInt(itemSortingPrefix);
					if (obj.EstResources && obj.EstResources.length > 0) {
						assignSorting(obj.EstResources, itemSortingPrefix, false, sortResourceBySorting);
					}
				}
			}

			return service;

		}]);

})();
