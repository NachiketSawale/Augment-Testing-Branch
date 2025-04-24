/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DragDropBase } from '@libs/platform/common';
import { IDragDropData } from '@libs/ui/business-base';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';

/**
 * todo-allen: waiting for the below dependencies to finish.
 * boqMainClipboardService, constructionSystemMasterWicService, constructionSystemMasterWicValidationService
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterClipboardService extends DragDropBase<ICosHeaderEntity> {
	public constructor() {
		super('');
	}

	public override canDrag(draggedDataInfo: IDragDropData<ICosHeaderEntity> | null) {
		return true;
	}

	// var clipboard = boqMainClipboardService.getClipboard();
	//
	// service.canPaste = function canPaste(type, selectedWicItem, boqMainService) {
	// 	if (!selectedWicItem) {
	// 		var headerItem = constructionSystemMasterHeaderService.getSelected();
	// 		if (!headerItem || !headerItem.Id) {
	// 			return false;
	// 		}
	// 	}
	// 	if (clipboard.type === 'boqitem') {
	// 		// Check if target data service exists or if it is set readOnly
	// 		if (!angular.isObject(boqMainService) || (angular.isDefined(boqMainService) && boqMainService !== null && boqMainService.getReadOnly())) {
	// 			return false;
	// 		}
	// 		if (angular.isArray(clipboard.dataOriginal) && clipboard.dataOriginal.length > 0) {
	// 			// noinspection LoopStatementThatDoesntLoopJS
	// 			for (var i = 0; i < clipboard.dataOriginal.length; i++) {
	// 				// Check if the items selected in the clipboard can be pasted according to the currently valid boq structure rules.
	// 				if (clipboard.dataOriginal[i].BoqLineTypeFk !== 0) {
	// 					return false;
	// 				}
	// 			}
	// 		}
	// 	}
	// 	return true;
	// };
	//
	// service.paste = function (itemOnDragEnd, type, callBack, itemService) {
	// 	var boqItems = service.getClipboard().dataOriginal;
	// 	let wicItemList = constructionSystemMasterWicService.getList();
	// 	let numberWicItemList = _.filter(wicItemList, function (i) {
	// 		return i.Code > 0;
	// 	});
	// 	let orderWicItemList = _.orderBy(numberWicItemList, ['Code'], ['desc']);
	// 	let codeNumber = orderWicItemList[0] ? orderWicItemList[0].Code : 0;
	// 	if (boqItems && boqItems.length) {
	// 		if (!itemOnDragEnd || boqItems.length > 1) {
	// 			service.copyBoqItems = service.getClipboard().dataOriginal;
	// 			let indexNumber = 0;
	// 			_.forEach(service.copyBoqItems, function (item) {
	// 				service.copyBoqItem = item;
	// 				constructionSystemMasterWicService.createItem().then(function (res) {
	// 					codeNumber = codeNumber > 0 ? (_.toNumber(codeNumber) + 1) : 1;
	// 					indexNumber++;
	// 					let resData = (res && res.data) ? res.data : res;
	// 					resData.BoqHeaderFk = item.BoqHeaderFk;
	// 					resData.BoqItemFk = item.Id;
	// 					resData.Code = codeNumber;
	// 					getBoqWicCatBoqFk(resData.BoqHeaderFk, resData, itemService);
	// 					constructionSystemMasterWicValidationService.validateCode(resData, resData.Code, 'Code');
	// 					constructionSystemMasterWicValidationService.validateBoqItemFk(resData, resData.BoqItemFk, 'BoqItemFk');
	// 					service.copyBoqItem = null;
	// 					if (indexNumber === service.copyBoqItems.length) {
	// 						service.copyBoqItems = null;
	// 					}
	// 				});
	// 			});
	// 		} else {
	// 			itemOnDragEnd.BoqHeaderFk = boqItems[0].BoqHeaderFk;
	// 			itemOnDragEnd.BoqItemFk = boqItems[0].Id;
	// 			basicsLookupdataLookupDescriptorService.updateData('BoqItemFk', boqItems);
	// 			getBoqWicCatBoqFk(itemOnDragEnd.BoqHeaderFk, itemOnDragEnd, itemService);
	// 			constructionSystemMasterWicValidationService.validateBoqItemFk(itemOnDragEnd, itemOnDragEnd.BoqItemFk, 'BoqItemFk');
	// 		}
	// 	}
	// };
	//
	// constructionSystemMasterWicService.registerEntityCreated(function (data, newItem) {
	// 	if (service.copyBoqItems) {
	// 		basicsLookupdataLookupDescriptorService.updateData('BoqItemFk', service.copyBoqItems);
	// 	}
	// 	if (service.copyBoqItem) {
	// 		newItem.BoqHeaderFk = service.copyBoqItem.BoqHeaderFk;
	// 		newItem.BoqItemFk = service.copyBoqItem.Id;
	// 	}
	// });
	//
	// function getBoqWicCatBoqFk(boqHeaderId, itemOnDragEnd, itemService) {
	// 	if (service.boqWicCatBoqs && _.find(service.boqWicCatBoqs, {boqHeaderId: boqHeaderId})) {
	// 		let boqWicCatBoq = _.find(service.boqWicCatBoqs, {boqHeaderId: boqHeaderId});
	// 		itemOnDragEnd.BoqWicCatBoqFk = boqWicCatBoq.items[0].Id;
	// 		itemService.markItemAsModified(itemOnDragEnd);
	// 	} else {
	// 		let url = globals.webApiBaseUrl + 'constructionsystem/master/Wic/getboqwiccatfk' + '?boqHeaderId=' + boqHeaderId;
	// 		$http.get(url).then(function (response) {
	// 			let item = [];
	// 			item[0] = response.data;
	// 			basicsLookupdataLookupDescriptorService.updateData('BoqWicCatBoqFk', item);
	// 			if (!service.boqWicCatBoqs) {
	// 				service.boqWicCatBoqs = [];
	// 			}
	// 			service.boqWicCatBoqs.push({boqHeaderId: boqHeaderId, items: item});
	// 			itemOnDragEnd.BoqWicCatBoqFk = item[0].Id;
	// 			itemService.markItemAsModified(itemOnDragEnd);
	// 			itemService.gridRefresh();
	// 		});
	// 	}
	// }
}
