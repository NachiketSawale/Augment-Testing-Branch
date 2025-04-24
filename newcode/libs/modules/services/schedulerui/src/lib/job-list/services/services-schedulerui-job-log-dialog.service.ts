/*
 * Copyright(c) RIB Software GmbH
 */
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { assign, isArray, isObject } from 'lodash';

import { PlatformHttpService } from '@libs/platform/common';
import { IDialog, IDialogOptions, IDialogResult, IPageableLongTextDialogOptions, PageableLongTextDialogDataSource, TextDisplayType, UiCommonPageableLongTextDialogService } from '@libs/ui/common';

export interface ISchedulerUiJobLogMessageData {
	/**
	 * Total number of pages.
	 */
	TotalCount: number;

	/**
	 * Messages.
	 */
	Messages: string[];
}

/**
 * Displays a dialog box that shows the log messages of a scheduler job.
 */
@Injectable({
	providedIn: 'root',
})
export class ServicesScheduleruiJobLogDialogService {
	/**
	 * Get the http action method to handling the request and response activity.
	 */
	private readonly http = inject(PlatformHttpService);

	/**
	 * Displays pageable long text modal dialog.
	 */
	private readonly pageableLongTextDialog = inject(UiCommonPageableLongTextDialogService);

	/**
	 * Page length.
	 */
	private pageLength: number = 500;

	/**
	 * Gets page data.
	 *
	 * @param jobId Unique job id.
	 * @param pageIndex Current page index.
	 * @param determineTotalPageCount Boolean to determine total page count.
	 * @returns Page data.
	 */
	private async loadPage(jobId: number, pageIndex: number, determineTotalPageCount: boolean) {
		const params = new HttpParams()
			.set('jobId', jobId)
			.set('firstLineIndex', pageIndex * this.pageLength)
			.set('maxLineCount', this.pageLength)
			.set('determineTotalLineCount', !!determineTotalPageCount);

		const response = await this.http.get<ISchedulerUiJobLogMessageData>('services/scheduler/job/logmessages', {
			params: params,
		});

		return {
			text: isArray(response.Messages) ? response.Messages.join('<br>') : '',
			totalPageCount: determineTotalPageCount ? Math.ceil(response.TotalCount / this.pageLength) : undefined,
		};
	}

	/**
	 * Opens dialog box.
	 *
	 * @param jobId Unique Job id.
	 * @param config Dialog options.
	 * @returns Dialog result.
	 */
	public async showLogDialog(jobId: number, config?: IDialogOptions<IDialog>): Promise<IDialogResult | undefined> {
		const response = await this.loadPage(jobId, 0, true);

		const data = isObject(config) ? config : {};
		const options: IPageableLongTextDialogOptions = assign(
			{
				headerText: 'services.schedulerui.showLogFileTitle',
			},
			data,
			{
				dataSource: new PageableLongTextDialogDataSource(response, (index: number, determineTotalPageCount: boolean) => this.loadPage(jobId, index, determineTotalPageCount)),
				type: TextDisplayType.Html,
			},
		);

		return this.pageableLongTextDialog.show(options);
	}
}
