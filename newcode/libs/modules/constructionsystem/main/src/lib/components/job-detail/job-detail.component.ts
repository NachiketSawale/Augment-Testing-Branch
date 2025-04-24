/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { EntityContainerBaseComponent } from '@libs/ui/business-base';
import { CosMainJobTwoResultType } from '../../model/enums/cos-main-job-two-result-type.enum';
import { ItemType, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { ICosJobEntity } from '../../model/entities/cos-job-entity.interface';
import { BasicsShareFileDownloadService } from '@libs/basics/shared';

@Component({
	selector: 'constructionsystem-main-job-detail',
	templateUrl: './job-detail.component.html',
	styleUrls: ['./job-detail.component.scss'],
	standalone: true,
})
export class ConstructionSystemMainJobDetailComponent<T extends ICosJobEntity> extends EntityContainerBaseComponent<T> implements OnInit {
	private readonly http = inject(PlatformHttpService);
	private readonly msgDialogService = ServiceLocator.injector.get(UiCommonMessageBoxService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly downloadService = inject(BasicsShareFileDownloadService);
	protected twoQResultType: CosMainJobTwoResultType = CosMainJobTwoResultType.Default;
	protected log: string = '';

	public constructor() {
		super();
		this.entitySelection.selectionChanged$.subscribe((e) => {
			this.loadLog();
		});
	}

	public ngOnInit(): void {
		this.updateTools();
	}

	private updateTools() {
		this.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'constructionsystem.main.taskBarFilter2QOff' },
				hideItem: false,
				iconClass: 'tlb-icons ico-filter-off',
				id: 't-filter-off',
				fn: () => {
					this.restore();
				},
				disabled: () => {
					return this.IsTwoQResult(CosMainJobTwoResultType.Default);
				},
				sort: 1,
				type: ItemType.Item,
			},
			{
				id: 't-filter',
				caption: { key: 'constructionsystem.main.taskBarFilter2Q' },
				sort: 202,
				type: ItemType.DropdownBtn,
				iconClass: 'tlb-icons ico-filter',
				list: {
					showImages: false,
					cssClass: 'dropdown-menu-right',
					showTitles: true,
					items: [
						{
							id: 't-fit',
							caption: { key: 'constructionsystem.main.taskBar2QFit' },
							type: ItemType.Item,
							fn: () => {
								this.load2QResult(CosMainJobTwoResultType.Fit);
							},
							disabled: this.IsTwoQResult(CosMainJobTwoResultType.Fit),
						},
						{
							id: 't-fit-ids',
							caption: { key: 'constructionsystem.main.taskBar2QFitIds' },
							type: ItemType.Item,
							fn: () => {
								this.load2QResult(CosMainJobTwoResultType.FitIds);
							},
							disabled: this.IsTwoQResult(CosMainJobTwoResultType.FitIds),
						},
						{
							id: 't-building-structure',
							caption: { key: 'constructionsystem.main.taskBar2QBuildingStructure' },
							type: ItemType.Item,
							fn: () => {
								this.load2QResult(CosMainJobTwoResultType.BuildingStructure);
							},
							disabled: this.IsTwoQResult(CosMainJobTwoResultType.BuildingStructure),
						},
						{
							id: 't-up-lift',
							caption: { key: 'constructionsystem.main.taskBar2QUpLift' },
							type: ItemType.Item,
							fn: () => {
								this.load2QResult(CosMainJobTwoResultType.UpLift);
							},
							disabled: this.IsTwoQResult(CosMainJobTwoResultType.UpLift),
						},
						{
							id: 't-process-report',
							caption: { key: 'constructionsystem.main.taskBar2QProcessReport' },
							type: ItemType.Item,
							fn: () => {
								this.load2QResult(CosMainJobTwoResultType.ProcessReport);
							},
							disabled: this.IsTwoQResult(CosMainJobTwoResultType.ProcessReport),
						},
						{
							id: 't-result',
							caption: { key: 'constructionsystem.main.taskBar2QResult' },
							type: ItemType.Item,
							fn: () => {
								this.load2QResult(CosMainJobTwoResultType.Result);
							},
							disabled: this.IsTwoQResult(CosMainJobTwoResultType.Result),
						},
						{
							id: 't-result-report',
							caption: { key: 'constructionsystem.main.taskBar2QResultReport' },
							type: ItemType.Item,
							fn: () => {
								this.load2QResult(CosMainJobTwoResultType.ResultReport);
							},
							disabled: this.IsTwoQResult(CosMainJobTwoResultType.ResultReport),
						},
					],
				},
			},
			{
				id: 'download',
				caption: { key: 'constructionsystem.main.taskBarDownload2Q' },
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-download',
				fn: () => {
					this.download2QResultZip();
				},
				disabled: this.disableDownload2QResultZip(),
			},
			{
				id: 'inspect',
				caption: { key: 'constructionsystem.main.taskBarInspect2Q' },
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-open1',
				fn: () => {
					this.open2QInspector();
				},
				disabled: this.disableDownload2QResultZip(),
			},
		]);
	}

	private getSelectedEntity() {
		return this.entitySelection?.getSelectedEntity();
	}

	private restore() {
		this.twoQResultType = CosMainJobTwoResultType.Default;
		this.loadLog();
	}

	private async loadLog() {
		const selected = this.getSelectedEntity();
		if (!selected) {
			return;
		}
		const resultId = this.twoQResultType;
		if (resultId > 0) {
			this.log = await this.http.get<string>('constructionsystem/main/job/twoqresult', {
				params: {
					id: selected.Id,
					resultId: resultId,
				},
				responseType: 'text' as 'json',
			});
		} else {
			this.log = await this.http.get<string>('constructionsystem/main/job/log', {
				params: {
					id: selected.Id,
				},
				responseType: 'text' as 'json',
			});
		}
	}

	private IsTwoQResult(resultId: CosMainJobTwoResultType) {
		return this.twoQResultType === resultId;
	}

	private async load2QResult(resultType: CosMainJobTwoResultType) {
		const selected = this.getSelectedEntity();
		this.log = '';
		if (this.twoQResultType === resultType) {
			this.twoQResultType = CosMainJobTwoResultType.Default;
			this.loadLog();
			return;
		}
		this.twoQResultType = resultType;
		if (selected) {
			this.log = await this.http.get<string>('constructionsystem/main/job/twoqresult', {
				params: {
					id: selected.Id,
					resultId: resultType,
				},
				responseType: 'text' as 'json',
			});
		}
	}

	private disableDownload2QResultZip() {
		return !this.getSelectedEntity();
	}

	private async download2QResultZip() {
		const selected = this.getSelectedEntity();
		if (!selected) {
			return;
		}

		const twoQResultDocId = await this.http.get<number | null>('constructionsystem/main/job/twoqresultdocid', {
			params: {
				id: selected?.Id,
			},
		});
		if (twoQResultDocId !== null) {
			this.downloadService.download([twoQResultDocId]);
		} else {
			this.msgDialogService.showMsgBox('constructionsystem.main.msgNo2Q', 'constructionsystem.main.taskBarDownload2Q', 'ico-info');
		}
	}

	private async open2QInspector() {
		const selected = this.getSelectedEntity();
		if (!selected) {
			return;
		}
		const twoQResultDocId = await this.http.get<number | null>('constructionsystem/main/job/twoqresultdocid', {
			params: {
				id: selected?.Id,
			},
		});
		if (twoQResultDocId !== null) {
			let url = 'qinspector://' + window.location.hostname;
			if (window.location.port) {
				url = url + ':' + window.location.port;
			}
			const token = await this.http.post('basics/common/document/preparedownload', { FileArchiveDocIds: twoQResultDocId });
			if (token) {
				url = url + this.configService.webApiBaseUrl + 'basics/common/document/download?security_token=' + token + '&id=' + twoQResultDocId;
				window.open(url);
			}
		} else {
			this.msgDialogService.showMsgBox('constructionsystem.main.msgNo2Q', 'constructionsystem.main.taskBarDownload2Q', 'ico-info');
		}
	}
}
