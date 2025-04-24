import { inject, Injectable } from '@angular/core';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainInstanceDataService } from '../construction-system-main-instance-data.service';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { COS_INSTANCE_LIST_TOKEN } from '../../model/entities/token/cos-instance-list.interface';
import { CosSaveAsTemplateComponent } from '../../components/cos-save-as-template/cos-save-as-template.component';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainJobDataService } from '../construction-system-main-job-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainWizardService {
	private readonly instanceService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);
	private readonly msgDialogService = ServiceLocator.injector.get(UiCommonMessageBoxService);
	private readonly modalDialogService = ServiceLocator.injector.get(UiCommonDialogService);
	private readonly jobService = ServiceLocator.injector.get(ConstructionSystemMainJobDataService);
	private readonly http = inject(PlatformHttpService);
	private readonly informationDialogHeader = 'cloud.common.informationDialogHeader';
	public saveAsTemplate() {
		this.instanceService.updateAndExecute(() => {
			const instanceList = this.instanceService.getList();
			const checkedInstances = instanceList.filter((item) => item.IsChecked);
			if (checkedInstances.length === 0) {
				this.msgDialogService.showMsgBox('constructionsystem.main.assignObjectsBySelectionStatement.mustCheck', 'cloud.common.informationDialogHeader', 'ico-info');
				return;
			}
			this.openSaveAsTemplateDialog(checkedInstances);
		});
	}

	private async openSaveAsTemplateDialog(checkedInstances: ICosInstanceEntity[]) {
		const saveAsTemplateModalOptions: ICustomDialogOptions<number, CosSaveAsTemplateComponent> = {
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					fn: async (event, info) => {
						const response = await this.requestSaveAsTemplate(checkedInstances);
						if (response.length > 0) {
							this.msgDialogService.showMsgBox('constructionsystem.main.saveAsTemplate.success', this.informationDialogHeader, 'ico-info');
							info.dialog.close(StandardDialogButtonId.Ok);
						} else {
							this.msgDialogService.showMsgBox('constructionsystem.main.saveAsTemplate.failed', this.informationDialogHeader, 'ico-info');
						}
					},
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
			headerText: { text: 'Save Instance As Template', key: 'constructionsystem.main.saveAsTemplate.title' },
			id: 'saveInstanceAsTemplate',
			bodyComponent: CosSaveAsTemplateComponent,
			bodyProviders: [
				{
					provide: COS_INSTANCE_LIST_TOKEN,
					useValue: {
						instances: checkedInstances,
					},
				},
			],
		};
		this.modalDialogService.show(saveAsTemplateModalOptions);
	}

	private requestSaveAsTemplate(checkedInstances: ICosInstanceEntity[]) {
		type BasicInstance = { Id: number; Description: string };
		type BasicsTemplate = { MainItemId: number };
		const postData: BasicInstance[] = checkedInstances.map((item) => ({
			Id: item.Id,
			Description: item.DescriptionInfo ? item.DescriptionInfo.Translated : '',
		}));
		return this.http.post<BasicsTemplate[]>('constructionsystem/main/instance/saveinstanceascostemplate', postData);
	}

	/**
	 * assign object by selection statement wizard
	 */
	public assignObjectsBySelectionStatement() {
		if (!this.instanceService.getCurrentSelectedModelId()) {
			this.msgDialogService.showMsgBox('constructionsystem.main.noModel', this.informationDialogHeader, 'ico-info');
			return;
		}
		this.jobService.createObjectAssignJob(false);
	}
}
