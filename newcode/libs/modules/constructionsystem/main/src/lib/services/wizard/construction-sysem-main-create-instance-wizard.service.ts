import { Injectable } from '@angular/core';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainInstanceDataService } from '../construction-system-main-instance-data.service';
import { ConstructionSystemMainJobDataService } from '../construction-system-main-job-data.service';
import { ConstructionSystemMainHeaderListDataService } from '../construction-system-main-header-list-data.service';
import { ICustomDialogOptions, PARENT_CHILD_LOOKUP_DIALOG_TOKEN, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService, UiCommonParentChildLookupDialogComponent } from '@libs/ui/common';
import { CosCreateInstanceComponent } from '../../components/cos-create-instance/cos-create-instance.component';
import { COS_CREATE_INSTANCE_OPTION_TOKEN, ICosCreateInstanceOption } from '../../model/entities/token/cos-create-instance-option.interface';
import { CosCreateInstanceType } from '../../model/enums/cos-create-instance-type.enum';
import { HttpStatusCode } from '@angular/common/http';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { ICosJobEntity } from '../../model/entities/cos-job-entity.interface';
import { IBasicMainItem2CostGroup } from '@libs/basics/shared';
import { CosMainComplete } from '../../model/entities/cos-main-complete.class';
import { ConstructionSystemMainInstanceHeaderParameterDataService } from '../construction-system-main-instance-header-parameter-data.service';
import { ICosGlobalParamGroupEntity } from '@libs/constructionsystem/shared';
import { IInstanceHeaderParameterEntity } from '../../model/entities/instance-header-parameter-entity.interface';
import { INSTANCE_HEADER_PARAMETER_LOOKUP } from '@libs/constructionsystem/interfaces';

interface ICreateInstanceResponse {
	StatusCode: HttpStatusCode;
	JobId: number;
}

interface ICreateStateResponse {
	instances: ICosInstanceEntity[];
	job: ICosJobEntity[] | null;
}
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainCreateInstanceWizardService {
	private readonly instanceService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);
	private readonly jobService = ServiceLocator.injector.get(ConstructionSystemMainJobDataService);
	private readonly instanceHeaderParameterService = ServiceLocator.injector.get(ConstructionSystemMainInstanceHeaderParameterDataService);
	private readonly headerService = ServiceLocator.injector.get(ConstructionSystemMainHeaderListDataService);
	private readonly msgDialogService = ServiceLocator.injector.get(UiCommonMessageBoxService);
	private readonly modalDialogService = ServiceLocator.injector.get(UiCommonDialogService);
	private readonly http = ServiceLocator.injector.get(PlatformHttpService);
	private evaluateAndCalculate: boolean = false;
	private creatType: CosCreateInstanceType = CosCreateInstanceType.CreateByBindingObjects;
	public createInstance() {
		const currentSelectedProjectId = this.instanceService.getCurrentSelectedProjectId();
		const currentInstanceHeaderId = this.instanceService.getCurrentInstanceHeaderId();

		if (!currentSelectedProjectId || !currentInstanceHeaderId) {
			this.msgDialogService.showErrorDialog('constructionsystem.main.entryError');
			return;
		}
		const cosHeaders = this.headerService.getList().filter((item) => item.IsChecked);
		const disableCreateBySelectionStatement = cosHeaders.length === 0;

		this.instanceService.updateAndExecute(async () => {
			const result = await this.modalDialogService.show(this.getCreateInstanceModalOptions(disableCreateBySelectionStatement));
			if (result?.closingButtonId === StandardDialogButtonId.Ok && result?.value) {
				this.evaluateAndCalculate = result?.value.evaluateAndCalculate ?? false;
				this.creatType = result.value.createType;
				const cosHeader2Templates = cosHeaders
					.filter((cosHeader) => cosHeader.CosTemplateFk !== null)
					.map((cosHeader) => ({
						cosHeaderId: cosHeader.Id,
						cosTemplateId: cosHeader.CosTemplateFk,
					}));
				const parameter = {
					projectId: currentSelectedProjectId,
					modelId: this.instanceService.getCurrentSelectedModelId(),
					cosInsHeaderId: currentInstanceHeaderId,
					cosHeaderIds: cosHeaders.map((item) => item.Id),
					createBySelectionStatement: result.value.createType === CosCreateInstanceType.createBySelectionStatement,
					onlyCreateHaveAssignObject: result.value.onlyCreateHaveAssignObject,
					createByBindingObjects: result.value.createType === CosCreateInstanceType.CreateByBindingObjects,
					createAndCalculate: result.value.evaluateAndCalculate,
					applyEstimateResultAutomatically: result.value.applyEstimateResultAutomatically,
					cosHeader2Templates: cosHeader2Templates,
				};
				this.DoCreateInstance(parameter);
			}
		});
	}

	private async DoCreateInstance(parameter: unknown) {
		try {
			const response = (await this.http.post('constructionsystem/main/instance/createinstance', parameter)) as ICreateInstanceResponse;
			if (response.JobId) {
				this.checkImportState(response.JobId);
			} else {
				this.importFinish(null);
			}
		} catch (Exception) {
			console.log(Exception);
		}
	}

	private checkImportState(jobId: number) {
		this.http
			.get<ICreateStateResponse>('constructionsystem/main/instance/createstate', {
				params: {
					jobId: jobId,
				},
			})
			.then((result) => {
				if (result) {
					this.importFinish(result);
				}
			});
	}

	private importFinish(importData: ICreateStateResponse | null) {
		const instance = importData?.instances ? importData?.instances : [];
		if (instance.length) {
			instance.forEach((item: ICosInstanceEntity) => {
				item.IsChecked = true;
			});
			const flattenedCostGroups: IBasicMainItem2CostGroup[] = instance.filter((instance: ICosInstanceEntity) => instance.CostGroups && instance.CostGroups.length > 0).flatMap((instance: ICosInstanceEntity) => instance.CostGroups!) ?? [];
			const cosComplete = new CosMainComplete();
			cosComplete.CostGroupToSave = flattenedCostGroups ?? [];
			this.instanceService.syncCostGroups(instance, [cosComplete]);
			this.instanceService.setList([...new Set([...this.instanceService.getList(), ...instance])]);
			this.instanceService.select(instance[0]);
			if (this.evaluateAndCalculate && importData?.job) {
				this.jobService.setList([...new Set([...this.jobService.getList(), ...importData.job])]);
				this.jobService.select(importData?.job[0]);
			}
		} else {
			const messageKey = this.creatType === CosCreateInstanceType.createBySelectionStatement ? 'constructionsystem.main.createInstanceWizard.searchResult' : 'constructionsystem.main.createInstanceWizard.noBindObjects';
			this.msgDialogService.showMsgBox(messageKey, 'cloud.common.informationDialogHeader', 'ico-info');
		}
	}

	private getCreateInstanceModalOptions(disableCreateBySelectionStatement: boolean) {
		const createChecklistModalOptions: ICustomDialogOptions<ICosCreateInstanceOption, CosCreateInstanceComponent> = {
			resizeable: true,
			buttons: [
				{
					id: 'modifyParameter',
					caption: { key: 'constructionsystem.main.createInstanceWizard.modifyGlobalParameter' },
					fn: () => {
						this.openModifyGlobalParameterDialog();
					},
				},
				{
					id: StandardDialogButtonId.Ok,
					fn: (event, info) => {
						info.dialog.value = info.dialog.body.createInstanceOption;
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
			headerText: { text: 'Create Instance', key: 'constructionsystem.main.createInstanceWizard.title' },
			id: 'createInstance',
			bodyComponent: CosCreateInstanceComponent,
			bodyProviders: [
				{
					provide: COS_CREATE_INSTANCE_OPTION_TOKEN,
					useValue: {
						disableCreateBySelectionStatement: disableCreateBySelectionStatement,
						createType: disableCreateBySelectionStatement ? CosCreateInstanceType.CreateByBindingObjects : CosCreateInstanceType.createBySelectionStatement,
						onlyCreateHaveAssignObject: true,
						applyEstimateResultAutomatically: false,
					},
				},
			],
		};
		return createChecklistModalOptions;
	}

	private openModifyGlobalParameterDialog() {
		const modifyGlobalParameterModalOptions: ICustomDialogOptions<number, UiCommonParentChildLookupDialogComponent<ICosGlobalParamGroupEntity, IInstanceHeaderParameterEntity>> = {
			resizeable: true,
			backdrop: false,
			width: '800px',
			height: '600px',
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					fn: (event, info) => {
						this.saveGlobalParameters();
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'ui.common.dialog.cancelBtn' },
					fn: (event, info) => {
						this.saveGlobalParameters(); /// very strange logic
						info.dialog.close(StandardDialogButtonId.Cancel);
					},
				},
			],
			headerText: { text: 'Create Instance', key: 'constructionsystem.main.createInstanceWizard.modifyGlobalParameter' },
			id: 'createInstance',
			bodyComponent: UiCommonParentChildLookupDialogComponent,
			bodyProviders: [{ provide: PARENT_CHILD_LOOKUP_DIALOG_TOKEN, useValue: INSTANCE_HEADER_PARAMETER_LOOKUP }],
		};
		this.modalDialogService.show(modifyGlobalParameterModalOptions);
	}

	private saveGlobalParameters() {
		this.instanceHeaderParameterService.saveInstanceHeaderParameter();
	}
}
