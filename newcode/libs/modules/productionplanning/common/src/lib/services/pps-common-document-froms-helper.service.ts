import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * @remark PpsCommonDocumentFromsHelper is refactored from frontend.ngjs\productionplanning.common\services\generic-document\pps-common-generic-document-from-values-helper.js
 * it will be used for "PPS Document container"
 */
@Injectable({
	providedIn: 'root',
})
export class PpsCommonDocumentFromsHelper {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly froms = [
		{id: 'PRJ', description: this.translateService.instant('project.main.sourceProject').text },
		{id: 'JOB', description: this.translateService.instant('logistic.job.entityJob').text },
		{id: 'DRW', description: this.translateService.instant('productionplanning.drawing.entityDrawing').text },
		{id: 'PPSHEADER', description: this.translateService.instant('productionplanning.common.header.headerTitle').text },
		{id: 'PPSITEM', description: this.translateService.instant('productionplanning.item.entityItem').text },
		{id: 'ENGTASK', description: this.translateService.instant('productionplanning.engineering.entityEngTask').text },
		{id: 'PRODUCTTEMPLATE', description: this.translateService.instant('productionplanning.producttemplate.entityProductDescription').text },
		{id: 'PRODUCT_PRJ', description: this.translateService.instant('productionplanning.common.product.entity').text },
		{id: 'PRODUCT_CAD', description: this.translateService.instant('productionplanning.common.product.cadProduct').text },
	];

	public getFroms() {
		return this.froms;
	}

	public isDocumentSavedInPrjDocTable(fromKey: string): boolean {
		return fromKey === 'PRJ' || fromKey === 'PPSHEADER' || fromKey === 'PRODUCT_PRJ';
	}

	public isDocumentSavedInPpsDocTable(fromKey: string): boolean {
		return fromKey === 'DRW' || fromKey === 'PPSITEM' || fromKey === 'ENGTASK' || fromKey === 'PRODUCT_CAD' || fromKey === 'PRODUCTTEMPLATE';
	}
}
