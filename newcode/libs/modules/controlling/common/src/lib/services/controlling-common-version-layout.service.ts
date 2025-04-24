/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IControllingCommonBisPrjHistoryEntity } from '../model/entities/controlling-common-bis-prj-history-entity.interface';
import { ControllingCommonControllingCommonVersionReportlogComponent } from '../components/controlling-common-version-reportlog/controlling-common-version-reportlog.component';
/**
 * layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingCommonVersionLayoutService {
	private readonly injector = inject(Injector);

	/**
	 * Generate layout config
	 */
	public async generateLayout<T extends IControllingCommonBisPrjHistoryEntity>(): Promise<ILayoutConfiguration<T>> {
		return runInInjectionContext(this.injector, () => {
			return <ILayoutConfiguration<T>>{
				groups: [
					{
						gid: 'baseGroup',
						title: {
							key: 'cloud.common.entityProperties',
							text: 'Basic Data',
						},
						attributes: ['RibCompanyId', 'RibPrjVersion', 'RibHistoryId', 'HistoryDescription', 'HistoryRemark', 'HistoryDate', 'ReportLog'],
					},
				],
				labels: {
					...prefixAllTranslationKeys('controlling.common.', {
						RibCompanyId: {
							key: 'ribCompanyId',
							text: 'Company',
						},
						RibPrjVersion: {
							key: 'ribPrjVersion',
							text: 'Project Version',
						},
						RibHistoryId: {
							key: 'ribHistoryId',
							text: 'History Version',
						},
						HistoryDescription: {
							key: 'historyDescription',
							text: 'Description',
						},
						HistoryRemark: {
							key: 'historyRemark',
							text: 'Remark',
						},
						HistoryDate: {
							key: 'historyDate',
							text: 'Date',
						},
						ReportLog: {
							key: 'reportLog',
							text: 'Report Log',
						},
					}),
				},
				overloads: {
					RibCompanyId: {
						readonly: true,
					},
					RibPrjVersion: {
						readonly: true,
					},
					RibHistoryId: {
						readonly: true,
					},
					HistoryDescription: {
						readonly: true,
					},
					HistoryRemark: {
						readonly: true,
					},
					HistoryDate: {
						readonly: true,
					},
					ReportLog: {
						//'readonly': true,
						type: FieldType.CustomComponent,
						componentType: ControllingCommonControllingCommonVersionReportlogComponent,
					},
				},
			};
		});
	}
}
