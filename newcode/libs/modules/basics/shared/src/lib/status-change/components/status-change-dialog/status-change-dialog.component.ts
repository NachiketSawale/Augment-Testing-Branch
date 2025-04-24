import { Component, inject, OnInit } from '@angular/core';
import { IEntityIdentification, PlatformTranslateService } from '@libs/platform/common';
import { IStatusChangeGroup } from '../../model/interfaces/status-change-group.interface';
import { CHANGE_STATUS_DIALOG_OPTIONS, IChangeStatusDialogOptions } from '../../model/interfaces/status-dialog-options.interface';
import { IStatusChangeEditorOptions } from '../../model/interfaces/status-change-editor-options.interface';
import { BasicsSharedChangeStatusService } from '../../services/change-status.service';
import { StatusChangeEvent } from '../../model/status-change-event';
import { IStatusChangeResult } from '../../model/interfaces/status-change-result.interface';
import { getCustomDialogDataToken } from '@libs/ui/common';
import { ChangeStatusProjectLookupService } from '../../services/change-status-project-lookup.service';
import { firstValueFrom } from 'rxjs';
import { IProjectEntity } from '@libs/project/interfaces';
import { MatDialogRef } from '@angular/material/dialog';

export enum StatusPage {
	editor = 1,
	history,
	result,
}

@Component({
	selector: 'basics-shared-change-dialog',
	templateUrl: './status-change-dialog.component.html',
	styleUrls: ['./status-change-dialog.component.scss'],
})
export class BasicsSharedStatusChangeDialogComponent implements OnInit {
	public modalOptions!: IChangeStatusDialogOptions<object, object>;
	public editorConfig?: IStatusChangeEditorOptions;
	private toStatusId: number = -1;
	private groupIndex: number = 0;
	public currentGroup!: IStatusChangeGroup;
	private remark: string = '';
	public okBtnDisabled: boolean = true;
	public okBtnVisible: boolean = true;
	public nextBtnDisabled: boolean = true;
	public nextBtnVisible: boolean = true;
	public backBtnVisible: boolean = true;
	public historyBtnVisible: boolean = true;
	public results?: IStatusChangeResult[];
	public currentPage: StatusPage = StatusPage.editor;
	private changeStatusService: BasicsSharedChangeStatusService<IEntityIdentification, object, object>;
	private readonly dialogWrapper = inject(getCustomDialogDataToken<string, BasicsSharedStatusChangeDialogComponent>());
	public readonly dialogRef = inject(MatDialogRef<BasicsSharedStatusChangeDialogComponent>);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly projectLookupService = inject(ChangeStatusProjectLookupService);
	private translate = inject(PlatformTranslateService);

	public constructor(
		private translateService: PlatformTranslateService,
	) {
		this.modalOptions = inject(CHANGE_STATUS_DIALOG_OPTIONS);
		this.changeStatusService = inject(BasicsSharedChangeStatusService);
	}

	private updateDialog() {
		//Last group or only one group, show the OK button, hide the next button
		if (this.isLastGroup()) {
			this.okBtnVisible = true;
			this.nextBtnVisible = false;
		} else {
			//More than two groups show the next button, hide the ok button
			this.okBtnVisible = false;
			this.nextBtnVisible = true;
		}

		if (this.modalOptions.statusGroup.length > 1) {
			const titleElem = document.getElementsByClassName('modal-title')[0];
			if (titleElem) {
				titleElem.innerHTML = this.modalOptions.statusChangeConf.title + ` (${this.groupIndex + 1}/${this.modalOptions.statusGroup.length})`;
			}
		}
		//Only one entity can show the history. And current page is editor and the simple status has no history
		this.historyBtnVisible = this.currentGroup.entityIds.length === 1 && this.currentPage === StatusPage.editor && !this.modalOptions.statusChangeConf.isSimpleStatus;
		//Show back button only it is in history page
		this.backBtnVisible = this.currentPage === StatusPage.history;

		//Disable the OK and next button when there is no new status selected.
		if (!this.isLastGroup()) {
			this.okBtnDisabled = true;
		}

		this.nextBtnDisabled = true;
	}

	private async onInitialStatus() {
		this.currentGroup = this.modalOptions.statusGroup[this.groupIndex];
		const statusList = await this.changeStatusService.getStatus(this.modalOptions.statusChangeConf.statusName, this.currentGroup.fromStatusId, this.currentGroup.projectId);
		const fromStatus = statusList.find((s) => s.Id === this.currentGroup.fromStatusId);
		const statusName = fromStatus?.DescriptionInfo?.Translated;
		const projectInfo = this.translate.instant('basics.common.changeStatus.project').text;
		const statusInfo = this.translate.instant('basics.common.changeStatus.status').text;
		const groupInfo = this.translate.instant('basics.common.changeStatus.statusgrouping').text;
		let projectNo = '';
		if (this.currentGroup.projectId) {
			const project = await firstValueFrom<IProjectEntity>(this.projectLookupService.getItemByKey({ id: this.currentGroup.projectId }));
			if (project) {
				projectNo = project.ProjectNo;
			}
		}
		const groupTitle = groupInfo + '(' + projectInfo + projectNo + ';' + statusInfo + statusName + ')';

		this.editorConfig = {
			title: groupTitle,
			fromStatusId: this.currentGroup.fromStatusId,
			statusList: statusList,
			showAvailableStatus: true,
			isSimpleStatus: this.modalOptions.statusChangeConf.isSimpleStatus,
		};

		setTimeout(() => {
			this.updateDialog();
		});
	}

	/**
	 * on initializing, lifecycle hook
	 */
	public ngOnInit(): void {
		this.translateService.load(['login']);
		this.onInitialStatus();
	}

	public async doChangeStatus() {
		const currenGroup = this.modalOptions.statusGroup[this.groupIndex];
		this.currentPage = StatusPage.result;
		const conf = this.modalOptions.statusChangeConf;
		if (conf.isSimpleStatus) {
			const simpleResult = await this.changeStatusService.saveSimpleStatus(
				this.modalOptions.statusChangeConf,
				currenGroup.fromStatusId,
				this.toStatusId,
				currenGroup.entityIds[0], //simple status only support change one item status
			);
			this.results = this.transformResults(simpleResult);

			const errorResult = simpleResult.find((r) => !r.Result);
			//No error, close the dialog
			if (!errorResult) {
				this.closeDialog();
			}
		} else {
			const changeResults = await this.changeStatusService.changeStatus(this.modalOptions.statusChangeConf, currenGroup.fromStatusId, this.toStatusId, currenGroup.entityIds, this.remark);

			const results = this.transformResults(changeResults);
			this.results = this.results || [];

			this.results = this.results.concat(results);
			const errorResult = results.find((r) => !r.Result);
			//No error, next group directly or close the dialog
			if (!errorResult) {
				if (this.isLastGroup() && this.modalOptions.statusGroup.length === 1) {
					this.closeDialog();
				} else {
					//Simulate go to next page
					if (!this.isLastGroup()) {
						this.onNextBntClicked();
					}
					this.updateDialog();
				}
			} else {
				this.updateDialog();
			}
		}
	}

	public isLastGroup(): boolean {
		return this.groupIndex + 1 === this.modalOptions.statusGroup.length;
	}

	public onNextBntClicked() {
		if (this.currentPage != StatusPage.result) {
			this.doChangeStatus();
		} else {
			//In result page, go to the next group
			this.groupIndex++;
			this.currentPage = StatusPage.editor;
			this.onInitialStatus();
		}
	}

	public onHistoryClicked() {
		this.currentPage = StatusPage.history;
		this.updateDialog();
	}

	public onBackBtnClicked() {
		this.currentPage = StatusPage.editor;
		this.updateDialog();
	}

	public onSelectStatusChanged(event: StatusChangeEvent) {
		this.toStatusId = event.status.Id;
		this.remark = event.remark;

		this.okBtnDisabled = this.toStatusId === this.currentGroup.fromStatusId;
		this.nextBtnDisabled = this.toStatusId === this.currentGroup.fromStatusId;
	}

	public onSelectStatusFinished(event: StatusChangeEvent) {
		this.toStatusId = event.status.Id;
		this.remark = event.remark;

		this.doChangeStatus();
		this.closeDialog();
	}

	private closeDialog() {
		this.dialogWrapper.close();
	}

	private transformResults(results: IStatusChangeResult[]) {
		return results.map((item, index) => {
			return {
				...item,
				Id: index,
				Status: this.getStatusTranslation(item.Result),
				EntityCode: this.modalOptions.statusChangeConf.getEntityCodeFn ? this.modalOptions.statusChangeConf.getEntityCodeFn(item.Entity) : '',
				EntityDesc: this.modalOptions.statusChangeConf.getEntityDescFn ? this.modalOptions.statusChangeConf.getEntityDescFn(item.Entity) : '',
			};
		});
	}

	private getStatusTranslation(isSuccess: boolean): string {
		return isSuccess ? this.translationService.instant('basics.common.changeStatus.finished').text : this.translationService.instant('basics.common.changeStatus.failed').text;
	}

	protected readonly StatusPage = StatusPage;
}
