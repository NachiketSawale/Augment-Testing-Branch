
/*
 * Copyright(c) RIB Software GmbH
 */
import {
	CompleteIdentification,
	IEntityIdentification, PlatformTranslateService
} from '@libs/platform/common';
import { IPrcHeaderDataService } from '../model/interfaces';
import { inject } from '@angular/core';

export  class ProcurementCommonTaxCodeChangeService<PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> {
	private readonly translateService = inject(PlatformTranslateService);
	protected constructor(protected parentService: IPrcHeaderDataService<PT, PU>) {

	}

	protected taxCodeChanged(){
		//todo: lvy, this function depend on boq service, need wait the boq service ready.

		// var yesNoDialogBodyText = $translate.instant('procurement.common.changeTaxCode.DialogTitle');
		// var prcItemDataService = $injector.get('procurementCommonPrcItemDataService').getService(mainService);
		// // eslint-disable-next-line no-unused-vars
		// var prcItemValidationService = $injector.get('procurementCommonPrcItemValidationService')(prcItemDataService);
		// if(mainService.taxCodeFkChanged){
		// 	mainService.taxCodeFkChanged.fire();
		// }
		//
		// if (moduleName === 'procurement.package' ||
		// 	moduleName === 'procurement.contract' ||
		// 	moduleName === 'procurement.requisition') {
		// 	yesNoDialogBodyText += '<br/>' + $translate.instant('procurement.common.changeTaxCode.noteForPaymentSchedule');
		// }
		//
		// var items = prcItemDataService.getList();
		// var boqMainService = $injector.get('prcBoqMainService').getService(mainService);
		// var prcBoqService = $injector.get('procurementCommonPrcBoqService').getService(mainService);
		//
		// var BoqItems = boqMainService.getList();
		// if (items.length > 0 || BoqItems.length > 0) {
		// 	platformModalService.showYesNoDialog(yesNoDialogBodyText, 'procurement.common.changeTaxCode.caption', 'no')
		// 		.then(function (result) {
		// 			if (result.yes) {
		// 				mainService.update().then(function () {
		// 					let containerData = mainService.getContainerData();
		// 					let url = containerData.httpUpdateRoute;
		// 					let modTrackServ = $injector.get('platformDataServiceModificationTrackingExtension');
		// 					let updateData = modTrackServ.getModifications(mainService);
		// 					if (mainService.doPrepareUpdateCall) {
		// 						mainService.doPrepareUpdateCall(updateData);
		// 					}
		// 					$http.post(url + 'updateHeaderAndChildTaxCode', updateData).then(function (response) {
		// 						var result = response.data;
		// 						containerData.onUpdateSucceeded(result, containerData, updateData);
		// 						modTrackServ.clearModificationsInRoot(mainService);
		// 						updateData = {};
		// 						prcItemDataService.load();
		// 						prcBoqService.load();
		// 						boqMainService.load();
		// 					});
		// 				});
		// 			}
		// 		});
		// }

	}
}
