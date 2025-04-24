/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Totals Config LineType Lookup Service
 */
@Injectable({
	providedIn: 'root',
})
export class TotalsConfigLineTypeLookupDataService<TEntity extends object = object> extends UiCommonLookupItemsDataService<{ Id: number; Code: string; RemarkText: string }, TEntity> {
	/**
	 * constructor
	 * @param translateService
	 */
	public constructor(private translateService: PlatformTranslateService) {
		super(
			[
				{ Id: 0, Code: '', RemarkText: translateService.instant('estimate.main.blankStr').text },
				{ Id: 1, Code: translateService.instant('estimate.main.gc').text, RemarkText: translateService.instant('estimate.main.gcDes').text },
				{ Id: 2, Code: translateService.instant('estimate.main.ga').text, RemarkText: translateService.instant('estimate.main.gaDes').text },
				{ Id: 3, Code: translateService.instant('estimate.main.am').text, RemarkText: translateService.instant('estimate.main.amDes').text },
				{ Id: 4, Code: translateService.instant('estimate.main.rp').text, RemarkText: translateService.instant('estimate.main.rpDes').text },
				{ Id: 5, Code: translateService.instant('estimate.main.fm').text, RemarkText: translateService.instant('estimate.main.fmDes').text },
				{ Id: 6, Code: translateService.instant('estimate.main.allowance').text, RemarkText: translateService.instant('estimate.main.allowanceDes').text },
				{ Id: 7, Code: translateService.instant('estimate.main.aa').text, RemarkText: translateService.instant('estimate.main.aaDes').text },
				{ Id: 8, Code: translateService.instant('estimate.main.mm').text, RemarkText: translateService.instant('estimate.main.mmDes').text },
				{ Id: 9, Code: translateService.instant('estimate.main.itemTotal').text, RemarkText: translateService.instant('estimate.main.itemTotalDes').text },
				{ Id: 10, Code: translateService.instant('estimate.main.costPrice').text, RemarkText: translateService.instant('estimate.main.costPriceDes').text },
				{ Id: 11, Code: translateService.instant('estimate.main.costTotalDJC').text, RemarkText: translateService.instant('estimate.main.costTotalDJCDes').text },
				{ Id: 12, Code: translateService.instant('estimate.main.costTotal').text, RemarkText: translateService.instant('estimate.main.costTotalDes').text },
				{ Id: 13, Code: translateService.instant('estimate.main.costTotalWithoutGC').text, RemarkText: translateService.instant('estimate.main.costTotalWithoutGCDes').text },
			],
			{
				uuid: '9107CA2599E7403595B2E6B3DCE8EE5D',
				valueMember: 'Id',
				displayMember: 'Code',
				gridConfig: {
					columns: [
						{
							id: 'Code',
							model: 'Code',
							type: FieldType.Code,
							label: { text: 'code', key: 'cloud.common.entityCode' },
							sortable: true,
							visible: true,
							readonly: true,
							tooltip: { text: 'code', key: 'cloud.common.entityCode' },
						},
						{
							id: 'RemarkText',
							model: 'RemarkText',
							type: FieldType.Text,
							label: { text: 'RemarkText', key: 'estimate.main.remark' },
							sortable: true,
							visible: true,
							readonly: true,
							tooltip: { text: 'RemarkText', key: 'estimate.main.remark' },
						},
					],
				},
			},
		);
	}
}
