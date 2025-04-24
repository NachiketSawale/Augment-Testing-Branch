/**
 * Created by myh on 1/8/2021.
 */
(function (angular) {

	'use strict';
	
	let moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainRenumberDetailDataService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * qtoMainRenumberDetailDataService
	 */
	/* jshint -W072 */
	angular.module(moduleName).service('qtoMainRenumberDetailDataService', ['_','$injector', '$translate', 'platformModalService', 'qtoMainDetailService',
		function (_,$injector, $translate, platformModalService, qtoMainDetailService) {
			let service = {};
			let tempLineAddress;

			// renumber the selected qto details
			service.renumberSelectQtoDetails = function renumberSelectQtoDetails(items, selectItems, pageNumber, lineReference, lineIndex, increment) {
				let remainItems = [];
				let qtoSheets = $injector.get('qtoMainStructureDataService').getList();
				
				let pageNumberObj = {
					PageNumber : pageNumber
				};
				qtoMainDetailService.getNotLockNewPageNumber(pageNumberObj,qtoSheets);
				pageNumber = pageNumberObj.PageNumber;
				
				angular.forEach(items, function(item){
					let isSelect = false;
					angular.forEach(selectItems, function(selectItem){
						if(item.Id === selectItem.Id){
							isSelect = true;
						}
					});

					if(!isSelect){
						remainItems.push(item);
					}
				});

				lineIndex = lineIndex ? parseInt(lineIndex) : 0;
				let perIndex = increment % 10;
				let perReference = parseInt(increment / 10);
				let roundIndex = increment < 10 ? increment : undefined;
				let lastItem;
				
				if(selectItems && selectItems.length > 0) {
					for (let i = 0; selectItems.length > i; i++) {
						if (lastItem) {
							let nexLineAddress = qtoMainDetailService.getResetLineAddress(lastItem, perReference, roundIndex);
							getOrderLineAddress(remainItems, nexLineAddress.PageNumber, nexLineAddress.LineReference, nexLineAddress.LineIndex,qtoSheets);
							if (tempLineAddress) {
								qtoMainDetailService.getNotLockNewPageNumber(tempLineAddress, qtoSheets);
								selectItems[i].PageNumber = tempLineAddress.PageNumber;
								selectItems[i].LineReference = tempLineAddress.LineReference;
								selectItems[i].LineIndex = (lastItem.LineIndex + perIndex) % 10;
								tempLineAddress = undefined;
							} else {
								qtoMainDetailService.getNotLockNewPageNumber(nexLineAddress, qtoSheets);
								selectItems[i].PageNumber = nexLineAddress.PageNumber;
								selectItems[i].LineReference = nexLineAddress.LineReference;
								selectItems[i].LineIndex = (lastItem.LineIndex + perIndex) % 10;
							}
						}

						if (pageNumber && lineReference) {
							if (!lastItem) {
								getOrderLineAddress(remainItems, pageNumber, lineReference, lineIndex,qtoSheets);
								if (tempLineAddress) {
									qtoMainDetailService.getNotLockNewPageNumber(tempLineAddress, qtoSheets);
									selectItems[i].PageNumber = tempLineAddress.PageNumber;
									selectItems[i].LineReference = tempLineAddress.LineReference;
									tempLineAddress = undefined;
								} else {
									selectItems[i].PageNumber = pageNumber ? parseInt(pageNumber) : 0;
									selectItems[i].LineReference = lineReference;
								}
								selectItems[i].LineIndex = lineIndex;
							}
						}
						lastItem = selectItems[i];
					}
					return selectItems;
				}
			};
			

			function getOrderLineAddress(remainItems, pageNumber, lineReference, lineIndex,qtoSheets){
				if(remainItems) {
					for (let i = 0; remainItems.length > i; i++) {
						if (remainItems[i].PageNumber === pageNumber && remainItems[i].LineReference === lineReference && remainItems[i].LineIndex === lineIndex) {
							tempLineAddress = qtoMainDetailService.getNewLineAddress(remainItems[i]);
							getOrderLineAddress(remainItems, tempLineAddress.PageNumber, tempLineAddress.LineReference, lineIndex,qtoSheets);
							break;
						}
					}
				}
			}

			// renumber the qto details
			service.renumberQtoDetails = function renumberQtoDetails(items, currentItem, pageNumber, lineReference, lineIndex, increment) {
				let entitiesToModify = [];
				let currentIndex = items.indexOf(currentItem);
				let lastItem = currentIndex !== -1 && items.length > 0 ? items[currentIndex - 1] : null;
				currentIndex = currentIndex === -1 ? 0 : currentIndex;
				let perIndex = increment % 10;
				let perReference = increment >= 10 ? parseInt(increment / 10) : undefined;
				let roundIndex = increment < 10 ? increment : undefined;
				let qtoSheets = $injector.get('qtoMainStructureDataService').getList();
				
				let pageNumberObj = {
					PageNumber : pageNumber
				};
				qtoMainDetailService.getNotLockNewPageNumber(pageNumberObj,qtoSheets);
				pageNumber = pageNumberObj.PageNumber;
				
				if (items && items.length > 0) {
					for (let i = currentIndex; items.length > i; i++) {
						let isToSave = false;
						if (lastItem) {
							let newLineIndex = (lastItem.LineIndex + perIndex) % 10;
							let nexLineAddress = qtoMainDetailService.getResetLineAddress(lastItem, perReference, roundIndex);
							isToSave = !isSameValueWithItem(items[i], nexLineAddress.PageNumber, nexLineAddress.LineReference, newLineIndex);
							items[i].PageNumber = nexLineAddress.PageNumber;
							
							qtoMainDetailService.getNotLockNewPageNumber(items[i], qtoSheets);
							
							items[i].LineReference = nexLineAddress.LineReference;
							items[i].LineIndex = newLineIndex;
						}

						if (pageNumber && lineReference) {
							if (!lastItem) {
								isToSave = !isSameValueWithItem(items[i], pageNumber, lineReference, lineIndex);
								items[i].PageNumber = pageNumber;
								
								items[i].LineReference = lineReference;
								items[i].LineIndex = lineIndex;
							}
						}
						lastItem = items[i];
						if (isToSave) {
							entitiesToModify.push(items[i]);
						}
					}
				}
				return entitiesToModify;
			};

			function isSameValueWithItem(item, pageNumber, lineReference, lineIndex){
				return item.PageNumber === pageNumber && item.LineReference === lineReference && item.LineIndex === lineIndex;
			}

			// if exists item is read only(pes/wip), return
			service.isItemsToSave = function isItemsToSave(items){
				
				let isToSave = true;
				let readOnlyList =  _.filter(items, function (item) {
					return item.IsReadonly === true;
				});
				let pesHeaderFkList = _.filter(items, function (item) {
					return item.PesHeaderFk !== null;
				});
				let wipHeaderFkList = _.filter(items, function (item) {
					return item.WipHeaderFk !== null;
				});
				
				let allList = readOnlyList.concat(pesHeaderFkList).concat(wipHeaderFkList);
				let allListCount = _.uniqBy(allList,'Id').length;

				if(readOnlyList.length === items.length || pesHeaderFkList.length === items.length  || wipHeaderFkList.length === items.length || allListCount === items.length){
					isToSave = false;
				}
				let msg = $translate.instant('qto.main.wizard.RenumberFailed');
				let title = $translate.instant('qto.main.wizard.wizardDialog.renumberQtoDetail');

				if(!isToSave) {
					platformModalService.showMsgBox(msg, title, 'warning');
				}

				return isToSave;
			};

			return service;
		}
	]);
})(angular);

