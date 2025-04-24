/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { ControlContextInjectionToken, ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService } from '@libs/ui/common';
import { IControllingCommonBisPrjHistoryEntity, ITransferReport } from '../../model/entities/controlling-common-bis-prj-history-entity.interface';
import * as _ from 'lodash';
import { ControllingCommonTransferBisDataReportService } from '../../services/controlling-common-transfer-bis-data-report.service';
import { ControllingCommonControllingCommonVersionReportlogDialogComponent } from '../controlling-common-version-reportlog-dialog/controlling-common-version-reportlog-dialog.component';
import { PlatformTranslateService } from '@libs/platform/common';

export const CONTROLLING_VERSION_TOKEN = new InjectionToken<IControllingCommonBisPrjHistoryEntity>('CONTROLLING_VERSION_TOKEN');
@Component({
	selector: 'controlling-common-controlling-common-version-reportlog',
	templateUrl: './controlling-common-version-reportlog.component.html',
	styleUrls: ['./controlling-common-version-reportlog.component.scss'],
})
export class ControllingCommonControllingCommonVersionReportlogComponent implements OnInit, OnDestroy {
	private readonly controlContext = inject(ControlContextInjectionToken);

	public readonly translateService = inject(PlatformTranslateService);

	private readonly controllingCommonTransferBisDataService = inject(ControllingCommonTransferBisDataReportService);

	private readonly modalDialogService = inject(UiCommonDialogService);

	private _entity?: IControllingCommonBisPrjHistoryEntity;

	/**
	 * show text on ui after component focus
	 */
	public ShowText: string = '';

	/**
	 * Destroy component data
	 */
	public ngOnDestroy(): void {}

	/**
	 * Initialize component data
	 */
	public ngOnInit(): void {
		this._entity = this.controlContext.entityContext.entity as IControllingCommonBisPrjHistoryEntity;
		this.ShowText = this.getLogDetails(this._entity ? this._entity.ReportLog : '');
	}

	/**
	 * Converts string to objects and output
	 * @param value
	 * @return string
	 * @private
	 */
	private getLogDetails(value: string): string {
		if (_.isString(value)) {
			try {
				const data = JSON.parse(value) as ITransferReport[];
				const transferReport = this.controllingCommonTransferBisDataService.processData(data);
				return _.isString(transferReport.transferLogDetails) ? transferReport.logDetails : '';
			} catch (e) {
				console.info(e);
			}
		}
		return '';
	}

	/**
	 *
	 * @param event
	 */
	public async clickEvent(event: MouseEvent) {
		const modalOptions: ICustomDialogOptions<{ isOk: boolean }, ControllingCommonControllingCommonVersionReportlogDialogComponent> = {
			headerText: this.translateService.instant({ key: 'controlling.common.historyLog' }).text,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					fn(evt, info) {
						info.dialog.value = { isOk: true };
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
			],
			resizeable: true,
			showCloseButton: true,
			bodyComponent: ControllingCommonControllingCommonVersionReportlogDialogComponent,
			bodyProviders: [
				{
					provide: CONTROLLING_VERSION_TOKEN,
					useValue: this._entity,
				},
			],
		};
		await this.modalDialogService.show(modalOptions);
	}
}
