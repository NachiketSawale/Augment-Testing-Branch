/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IEntityContext, IReportData, IReportsData } from '@libs/platform/common';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { map, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
/**
 * Procurement Rfq Email Fax Item Report Template lookup Service
 */
export class ProcurementRfqEmailFaxItemReportTemplatelookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IReportData, T> {
	public constructor() {
		super(
			{
				httpRead: {
					route: 'basics/reporting/sidebar',
					endPointRead: 'load?module=basics.material',
					usePostForRead: false,
				},
			},
			{
				uuid: '',
				displayMember: 'name',
				valueMember: 'id',
				showClearButton: true,
			},
		);
	}

	/**
	 * To get Report Data
	 * @param {IEntityContext<T>} context
	 * @returns Observable<IReportData[]>
	 */
	public override getList(context?: IEntityContext<T>): Observable<IReportData[]> {
		return super.getList(context).pipe(
			map((response: IReportData[]) =>
				response.flatMap((item: IReportData) =>
					(item.reports || []).map((report: IReportsData) => ({
						...report,
						visible: item.visible,
						icon: item.icon,
						reports: [report],
					})),
				),
			),
		);
	}
}
