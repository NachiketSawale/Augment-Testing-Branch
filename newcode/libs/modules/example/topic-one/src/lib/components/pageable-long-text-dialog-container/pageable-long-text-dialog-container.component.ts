/*
 * Copyright(c) RIB Software GmbH
 */
import { isArray } from 'lodash';
import { Component, inject } from '@angular/core';

import { PlatformHttpService } from '@libs/platform/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { IPageableLongTextDialogOptions, PageableLongTextDialogDataSource, TextDisplayType, UiCommonPageableLongTextDialogService } from '@libs/ui/common';

@Component({
	selector: 'example-topic-one-pageable-long-text-dialog-container',
	templateUrl: './pageable-long-text-dialog-container.component.html',
	styleUrl: './pageable-long-text-dialog-container.component.scss',
})
export class PageableLongTextDialogContainerComponent extends ContainerBaseComponent {
	private pageLength = 20;

	private jobId = 659404;

	private readonly http = inject(PlatformHttpService);

	private readonly pageableLongTextDialog = inject(UiCommonPageableLongTextDialogService);

	/**
	 * Dialog with pagination.
	 */
	public openDialog() {
		this.loadPageData(this.jobId, 0, true).then(async (response) => {
			const options: IPageableLongTextDialogOptions = {
				headerText: 'Scheduler Log',
				topDescription: {
					text: 'Demo Top Description',
				},
				dataSource: new PageableLongTextDialogDataSource(response, 
					(index: number, determineTotalPageCount: boolean) => this.loadPageData(this.jobId, index, determineTotalPageCount)
				),
				type: TextDisplayType.Html
			};

			const data = await this.pageableLongTextDialog.show(options);
			console.log(data);
		});
	}

	public async loadPageData(jobId: number, pageIndex: number, determineTotalPageCount: boolean) {
		const response = await this.http.get<{ TotalCount: number; Messages: string[] }>('services/scheduler/job/logmessages', {
			params: {
				jobId: jobId,
				firstLineIndex: pageIndex * this.pageLength,
				maxLineCount: this.pageLength,
				determineTotalLineCount: !!determineTotalPageCount,
			},
		});
		return {
			text: isArray(response.Messages) ? response.Messages.join('<br>') : '',
			totalPageCount: determineTotalPageCount ? Math.ceil(response.TotalCount / this.pageLength) : undefined,
		};
	}
}
