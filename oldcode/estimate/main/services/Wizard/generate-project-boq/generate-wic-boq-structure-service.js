/**
 * Created by wul on 4/20/2018.
 */
(function () {

	'use strict';
	let moduleName = 'estimate.main';
	let generateWipModule = angular.module(moduleName);

	generateWipModule.factory('generateWipBoqStructureService', ['_', '$injector', '$log','$translate','boqMainServiceFactory', 'estimateMainWicboqToPrjboqCompareDataForWicService','boqMainCommonService','boqMainLineTypes',
		function (_, $injector, $log, $translate, boqMainServiceFactory, dataForWicService, boqMainCommonService, boqMainLineTypes) {

			let option = {
				parent: dataForWicService
			};

			let container = $injector.get('boqMainServiceFactory').createNewBoqMainService(option);
			let service = container.service;
			let data = container.data;

			service.getBoqItemByReference = function(reference){
				let excludedItems = [],
					foundItem,
					rootBoqItem = service.getRootBoqItem();
				excludedItems.push(rootBoqItem); // Exclude the root item from the search.
				foundItem = data.findBoqItemByPropertyValue('Reference', reference, rootBoqItem, excludedItems);

				if(foundItem === null && !_.isEmpty(reference)) {
					// Special case with the final dot in reference. We see the same reference number with and witout final dot as equal.
					// So we check against this here, too.

					// Add or remove final dot depending on what is neccessary
					if(!service.isFreeBoq()) {
						if(reference.lastIndexOf(data.getReferenceNumberDelimiter()) === reference.length-1) {
							// Remove final dot
							reference = reference.substring(0, reference.length-1);
						}
						else {
							// There's no final dot -> add one
							reference += data.getReferenceNumberDelimiter(true);
						}
					}

					foundItem = data.findBoqItemByPropertyValue('Reference', reference, rootBoqItem, excludedItems);
				}

				return foundItem;
			};

			service.getRootBoqItem = function(){
				let root = dataForWicService.getCurrentRootItem();
				if(root && root.BoqHeaderFk){
					service.setSelectedHeaderFk(root.BoqHeaderFk);
				}
				return root;
			};

			/*
			service.fireItemModified = function(){
				// don't need to moodified
				return;
			};
			*/

			service.getReadOnlyFieldsForItem = function(){
				return null;
			};

			service.createTempNewItem = function createNewItem(skipCreation, selectedBoqItem) {

				// Depending on the currently selected item (folder or item) we create a new item.
				let canCreateResult = false;
				selectedBoqItem = selectedBoqItem || dataForWicService.getSelected();

				if (!selectedBoqItem) {
					return canCreateResult; // no selection -> nothing happens
				}

				let level = data.getLevelOfBoqItem(selectedBoqItem);

				if (boqMainCommonService.isItem(selectedBoqItem) || boqMainCommonService.isSurchargeItem(selectedBoqItem)) {
					// Having an item selected we create a sibling item on the same level
					canCreateResult = service.canCreateBoqItem(selectedBoqItem, boqMainLineTypes.position, level, skipCreation);
					if (canCreateResult && !skipCreation) {
						createNewBoqItem(selectedBoqItem.BoqItemFk, selectedBoqItem, boqMainLineTypes.position, level, false, true);
					}
				}
				else if (boqMainCommonService.isRoot(selectedBoqItem) || boqMainCommonService.isDivision(selectedBoqItem)) {
					// Having the root or a division selected we currently create a sub item
					canCreateResult = service.canCreateBoqItem(selectedBoqItem, boqMainLineTypes.position, level + 1, skipCreation);
					if (canCreateResult && !skipCreation) {
						createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, boqMainLineTypes.position, level + 1, true, true);
					}
				}

				return canCreateResult;
			};

			/**
             * @ngdoc function
             * @name createNewDivision
             * @function
             * @methodOf boq.service.boqMainServiceFactory
             * @description Creates a new boqItem of type division
             * @param {Boolean} skipCreation triggers skipping the creation of the boq item.
             * @returns {Boolean} returns if can be created according to the given selectedItem and given rules.
             */
			service.createTempNewDivision = function createNewDivision(skipCreation , selectedBoqItem) {
				// Depending on the currently selected item (folder or item) we create a new folder.
				let canCreateResult = false;
				selectedBoqItem = selectedBoqItem || dataForWicService.getSelected();
				let parentOfSelectedItem = data.getParentBoqItem(selectedBoqItem);

				if (!selectedBoqItem) {
					return canCreateResult; // no selection -> nothing happens
				}

				let level = data.getLevelOfBoqItem(selectedBoqItem);

				if (boqMainCommonService.isItem(selectedBoqItem) || boqMainCommonService.isSurchargeItem(selectedBoqItem)) {
					// Having an item selected we create a sibling folder on the same level
					canCreateResult = service.canCreateBoqItem(selectedBoqItem, data.getDivisionLineTypeByLevel(level), level, true);
					if ( canCreateResult && (parentOfSelectedItem !== null) && !skipCreation) {
						createNewBoqItem(selectedBoqItem.BoqItemFk, selectedBoqItem, data.getDivisionLineTypeByLevel(level), level, false, false);
					}
					else {
						// If the creation on the item level is not allowed we try to create a new division on the parent level as sibling the the parent of the selected item
						canCreateResult = service.canCreateBoqItem(parentOfSelectedItem, data.getDivisionLineTypeByLevel(level-1), level-1, skipCreation);
						if((level > 1) && canCreateResult && !skipCreation){
							createNewBoqItem(parentOfSelectedItem.BoqItemFk, parentOfSelectedItem, data.getDivisionLineTypeByLevel(level-1), level-1, false, false);
						}
					}

					if(!canCreateResult) {
						data.handleCreationError(skipCreation);
					}
				}
				else if (boqMainCommonService.isDivision(selectedBoqItem)) {
					// Having a division selected we create a sibling division on the same level
					canCreateResult = service.canCreateBoqItem(selectedBoqItem, data.getDivisionLineTypeByLevel(level), level, skipCreation);
					if (canCreateResult && !skipCreation) {
						createNewBoqItem(selectedBoqItem.BoqItemFk, selectedBoqItem, data.getDivisionLineTypeByLevel(level), level, false, false);
					}
				}
				else if (boqMainCommonService.isRoot(selectedBoqItem)) {
					// Having the root selected we create a child division on the first level
					canCreateResult = service.canCreateBoqItem(selectedBoqItem, boqMainLineTypes.level1, level + 1, skipCreation);
					if (canCreateResult && !skipCreation) {
						createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, boqMainLineTypes.level1, level + 1, true, false);
					}
				}
				return canCreateResult;
			};

			/**
             * @ngdoc function
             * @name createNewSubDivision
             * @function
             * @methodOf boq.service.boqMainServiceFactory
             * @description Creates a new boqItem of type sub division
             * @param {Boolean} skipCreation triggers skipping the creation of the boq item.
             * @returns {Boolean} returns if can be created according to the given selectedItem and given rules.
             */
			service.createTempNewSubDivision = function createNewSubDivision(skipCreation, selectedBoqItem) {
				// Depending on the currently selected item (folder of item) we create a new sub folder.
				let canCreateResult = false;
				selectedBoqItem = selectedBoqItem || dataForWicService.getSelected();

				if (!selectedBoqItem) {
					return canCreateResult; // no selection -> nothing happens
				}

				let level = data.getLevelOfBoqItem(selectedBoqItem);

				if ((boqMainCommonService.isItem(selectedBoqItem) || boqMainCommonService.isSurchargeItem(selectedBoqItem)) && !skipCreation) {
					// Having an item selected nothing happens, because we have no folder as child of an item
					data.creationErrorContainer.errorString = $translate.instant('boq.main.itemCreateErrorDivisionIsSubOfPosition');
				}
				else if (boqMainCommonService.isDivision(selectedBoqItem)) {
					// Having a division selected we create a sub division on the next level
					canCreateResult = service.canCreateBoqItem(selectedBoqItem, data.getDivisionLineTypeByLevel(level + 1), level + 1, skipCreation);
					if (canCreateResult && !skipCreation) {
						createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, data.getDivisionLineTypeByLevel(level + 1), level + 1, true, false);
					}
				}
				else if (boqMainCommonService.isRoot(selectedBoqItem)) {
					// Having the root selected we create a child division on the first level
					canCreateResult = service.canCreateBoqItem(selectedBoqItem, boqMainLineTypes.level1, level + 1, skipCreation);
					if (canCreateResult && !skipCreation) {
						createNewBoqItem(selectedBoqItem.Id, selectedBoqItem, boqMainLineTypes.level1, level + 1, true, false);
					}
				}

				return canCreateResult;
			};

			function createNewBoqItem(parentItemId, selectedBoqItem, lineType, level, createChild, insertAtEnd) {
				// Check for valid parameters
				if (!parentItemId && !selectedBoqItem) {
					return;
				}

				let isTypeWithReference = boqMainCommonService.isPositionType(lineType) || boqMainCommonService.isDivisionType(lineType) || boqMainCommonService.isSurchargeItemType(lineType);
				let parentBoqItem = service.getBoqItemById(parentItemId);
				let nextReference = isTypeWithReference ? data.generateBoqReference(parentBoqItem, selectedBoqItem, {lineType:lineType}, insertAtEnd) : '';

				// Set myCreationData
				dataForWicService.setCreationData ({
					boqHeaderFk: data.selectedBoqHeader,
					parentItemId: parentItemId,
					selectedItem: selectedBoqItem,
					lineType: lineType,
					level: level,
					insertAtEnd: insertAtEnd,
					predecessor:  null,
					doSave: false,
					DivisionType: data.getNextChildDivisionType(parentBoqItem, lineType),
					refCode: nextReference,
					parent: parentBoqItem
				});

				if (createChild) {
					dataForWicService.createChildItem();
				}
				else {
					dataForWicService.createItem();
				}
			}

			service.getNewDivisionReference = function getNewDivisionReference(selectedBoqItem) {

				let level = data.getLevelOfBoqItem(selectedBoqItem);
				let lineType = boqMainCommonService.isDivision(selectedBoqItem) ? data.getDivisionLineTypeByLevel(level + 1) : boqMainLineTypes.level1;

				return data.generateBoqReference(selectedBoqItem, selectedBoqItem, {lineType:lineType}, false);
			};

			service.getNewItemReference = function getNewItemReference(selectedBoqItem) {

				return data.generateBoqReference(selectedBoqItem, selectedBoqItem, {lineType:boqMainLineTypes.position}, true);
			};

			return service;
		}]);
})();
