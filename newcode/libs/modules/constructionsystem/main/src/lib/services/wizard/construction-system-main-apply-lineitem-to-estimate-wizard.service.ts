import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { ICustomDialogOptions, StandardDialogButtonId, UiCommonDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { ApplyLineItemToEstimateWizardDialogComponent } from '../../components/apply-line-item-to-estimate-wizard-dialog/apply-line-item-to-estimate-wizard-dialog.component';
import { COS_APPLY_LINEITEME_TO_ESTIMATE_OPTION_TOKEN, ICosApplylineItemToEstimateOption } from '../../model/entities/token/cos-apply-lineitem-to-estimate-option.interface';
import { ConstructionSystemMainInstanceDataService } from '../construction-system-main-instance-data.service';
import { inject, Injectable } from '@angular/core';
import { IApplyResponseEntity } from '../../model/entities/apply-response-entity.interface';
import { CosInstanceInfoComponent } from '../../components/cos-instance-info/cos-instance-info.component';
import { COS_INSTANCE_LIST_TOKEN } from '../../model/entities/token/cos-instance-list.interface';
import { ConstructionSystemMainJobDataService } from '../construction-system-main-job-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainApplyLineItemToEstimateWizardService {
	private readonly msgDialogService = ServiceLocator.injector.get(UiCommonMessageBoxService);
	private readonly modalDialogService = ServiceLocator.injector.get(UiCommonDialogService);
	private readonly instanceService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);
	private readonly constructionSystemMainJobDataService = ServiceLocator.injector.get(ConstructionSystemMainJobDataService);
	private readonly http = inject(PlatformHttpService);

	public async apply() {
		const result = await this.modalDialogService.show(this.getLineItemToEstimateWizardModalOptions());
		if (result?.closingButtonId === StandardDialogButtonId.Ok && result?.value) {
			if (result.value.overwrite) {
				const response = await this.msgDialogService.showYesNoDialog({
					bodyText: 'constructionsystem.main.applyOverwriteQuestion',
					headerText: 'constructionsystem.main.applyOverwriteTitle',
					defaultButtonId: StandardDialogButtonId.No,
				});
				if (response?.closingButtonId === StandardDialogButtonId.Yes) {
					this.applyLineItemsToEstimate(result.value);
				}
			} else if (result.value.isUpdate || result.value.updateQuantity || result.value.updatePrice) {
				this.applyLineItemsToEstimate(result.value);
			}
		}
	}

	private async applyLineItemsToEstimate(modelOption: ICosApplylineItemToEstimateOption) {
		const instanceList = this.instanceService.getList();
		const checkedInstances = instanceList.filter((item) => item.IsChecked);
		if (checkedInstances.length > 0) {
			const requestParam = {
				InsHeaderId: checkedInstances[0].InstanceHeaderFk,
				InstanceIds: checkedInstances.map<number>((e) => e.Id),
				Options: {
					Overwrite: modelOption.overwrite,
					IsUpdate: modelOption.isUpdate,
					UpdateQuantity: modelOption.updateQuantity,
					UpdatePrice: modelOption.updatePrice,
					KeepResPkgAssignment: modelOption.keepResourcePackageAssignment,
					DoNotUpdateResIfCosResIsNull: modelOption.doNotUpdateResIfCosResIsNull,
				},
			};

			const response = await this.http.post<IApplyResponseEntity>('constructionsystem/main/lineitem/apply', requestParam);
			// ask user to uncheck the instances with no line items
			const ids = response.InstanceIds ?? [];
			const splitIds = response.SplitInstanceIds ?? [];
			const totalIds = ids.concat(splitIds);
			if (totalIds.length > 0) {
				this.openInstanceInfoDialog(totalIds, splitIds, modelOption);
			} else {
				if (response.CosJob) {
					this.constructionSystemMainJobDataService.createApplyLineItemJob(response.CosJob);
				}
			}
		} else {
			await this.msgDialogService.showMsgBox('constructionsystem.main.noInstanceChecked', 'Info', 'ico-info');
		}
	}

	private async openInstanceInfoDialog(totalIds: number[], splitIds: number[], modelOptions: ICosApplylineItemToEstimateOption) {
		const instanceList = this.instanceService.getList();
		const checkedInstances = instanceList.filter((item) => item.IsChecked);
		const instances = instanceList.filter((item) => totalIds.includes(item.Id));
		const instanceInfoModalOptions: ICustomDialogOptions<number, CosInstanceInfoComponent> = {
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					fn: (event, info) => {
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
			headerText: { text: 'Apply', key: 'constructionsystem.main.noLineItemError' },
			id: 'applyLineItemToEstimate',
			bodyComponent: CosInstanceInfoComponent,
			bodyProviders: [
				{
					provide: COS_INSTANCE_LIST_TOKEN,
					useValue: {
						instances: instances,
					},
				},
			],
		};
		const result = await this.modalDialogService.show(instanceInfoModalOptions);
		if (result?.closingButtonId === StandardDialogButtonId.Ok) {
			const lineItemList = checkedInstances.filter((item) => totalIds.indexOf(item.Id) === -1);
			const checkRequestParam = {
				InsHeaderId: checkedInstances[0].InstanceHeaderFk,
				InstanceIds: lineItemList.map((e) => e.Id),
				Options: {
					Overwrite: modelOptions.overwrite,
					IsUpdate: modelOptions.isUpdate,
					UpdateQuantity: modelOptions.updateQuantity,
					UpdatePrice: modelOptions.updatePrice,
					KeepResPkgAssignment: modelOptions.keepResourcePackageAssignment,
					DoNotUpdateResIfCosResIsNull: modelOptions.doNotUpdateResIfCosResIsNull,
				},
				SplitInstanceIds: splitIds,
			};
			const response = await this.http.post<IApplyResponseEntity>('constructionsystem/main/lineitem/apply', checkRequestParam);
			if (response.CosJob) {
				this.constructionSystemMainJobDataService.createApplyLineItemJob(response.CosJob);
			}
		}
	}

	private getLineItemToEstimateWizardModalOptions() {
		const createChecklistModalOptions: ICustomDialogOptions<ICosApplylineItemToEstimateOption, ApplyLineItemToEstimateWizardDialogComponent> = {
			resizeable: true,
			width: '650px',
			minHeight: '350px',
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					fn: (event, info) => {
						info.dialog.value = info.dialog.body.lineItemToEstimateWizardModelOptions;
						info.dialog.close(StandardDialogButtonId.Ok);
					},
				},
				{ id: StandardDialogButtonId.Cancel, caption: { key: 'ui.common.dialog.cancelBtn' } },
			],
			headerText: { text: 'Apply', key: 'constructionsystem.main.applyOptions' },
			id: 'applyLineItemToEstimate',
			bodyComponent: ApplyLineItemToEstimateWizardDialogComponent,
			bodyProviders: [
				{
					provide: COS_APPLY_LINEITEME_TO_ESTIMATE_OPTION_TOKEN,
					useValue: {
						overwrite: false,
						isUpdate: true,
						updateQuantity: false,
						updatePrice: false,
						keepResourcePackageAssignment: true,
						doNotUpdateResIfCosResIsNull: true,
					},
				},
			],
		};
		return createChecklistModalOptions;
	}
}
