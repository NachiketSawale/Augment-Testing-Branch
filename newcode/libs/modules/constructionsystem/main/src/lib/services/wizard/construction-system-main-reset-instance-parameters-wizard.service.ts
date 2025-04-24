import { inject, Injectable } from '@angular/core';
import { ConstructionSystemMainInstanceDataService } from '../construction-system-main-instance-data.service';
import { filter, forEach, isEmpty, isNull, isUndefined } from 'lodash';
import { FieldType, IGridDialogOptions, StandardDialogButtonId, UiCommonGridDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IDescriptionInfo, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ICosParameterEntity, ICosParameterGroupEntity, ICosParameterLookupEntity, ICosParameterValueEntity, IInstanceParameterEntity, IInstance2ObjectParamEntity } from '@libs/constructionsystem/shared';

interface ICosInstance {
	Id: number;
	Code: string;
	DescriptionInfo?: IDescriptionInfo | null;
	Description?: string;
}

interface IResetInstanceParametersResponse {
	Main: IInstanceParameterEntity[];
	LookupValues: {
		CosParameter: ICosParameterLookupEntity[];
		CosMainInstanceParameterValue: ICosParameterValueEntity[];
	};
	Cos2ObejectParameters: IInstance2ObjectParamEntity[];
	CosParameterGroups: ICosParameterGroupEntity[];
	CosParameters: ICosParameterEntity[];
}

interface IResetInstanceParametersPostData {
	CosInstanceIds: number[];
	MainItemId: number;
}

interface ITempCache {
	key: number;
	value: IInstance2ObjectParamEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainResetInstanceParametersWizardService {
	private readonly cosMainInstanceService = inject(ConstructionSystemMainInstanceDataService);
	private readonly dialogService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly http = inject(PlatformHttpService);

	public resetInstanceParameters() {
		this.cosMainInstanceService.updateAndExecute(async () => {
			const cosInstances = filter(this.cosMainInstanceService.getList(), { IsChecked: true });
			if (isEmpty(cosInstances)) {
				this.dialogService.showMsgBox(this.translateService.instant('constructionsystem.main.assignObjectsBySelectionStatement.mustCheck').text, this.translateService.instant('cloud.common.informationDialogHeader').text, 'ico-info');
				return;
			}
			const data: ICosInstance[] = [];
			forEach(cosInstances, (item) => {
				data.push({
					Id: item.Id,
					Code: item.Code,
					DescriptionInfo: item.DescriptionInfo ?? null,
					Description: item.DescriptionInfo?.Translated,
				});
			});
			const gridDialogData: IGridDialogOptions<ICosInstance> = {
				width: '70%',
				headerText: 'Grid Dialog',
				topDescription: 'This is top description',
				windowClass: 'grid-dialog',
				items: data,
				gridConfig: {
					uuid: '631493fea1234a8a8633cd1f588244a9',
					columns: [
						{
							type: FieldType.Code,
							id: 'Code',
							model: 'Code',
							label: {
								text: 'Code (Instance)',
								key: 'constructionsystem.main.saveAsTemplate.instanceCode',
							},
							visible: true,
							sortable: false,
							readonly: true,
						},
						{
							type: FieldType.Description,
							id: 'DescriptionInfo',
							model: 'DescriptionInfo',
							label: {
								text: 'Description (Instance)',
								key: 'constructionsystem.main.saveAsTemplate.instanceDescription',
							},
							visible: true,
							sortable: false,
							readonly: true,
						},
					],
					idProperty: 'Id',
				},
				isReadOnly: false,
				allowMultiSelect: true,
				selectedItems: [],
			};
			const result = await this.gridDialogService.show(gridDialogData);
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				const mainItemId = this.cosMainInstanceService.getSelectedEntity()?.Id;
				const instance2ObjectSelected = -1; // IInstance2ObjectEntity = {}; //todo var instance2ObjectSelected = instance2ObjectService.getSelected();
				const postData: IResetInstanceParametersPostData = {
					CosInstanceIds: [],
					MainItemId: mainItemId ?? -1,
				};
				forEach(data, (item) => {
					postData.CosInstanceIds.push(item.Id);
				});
				const resp = await this.http.post<{
					data: IResetInstanceParametersResponse;
				}>('constructionsystem/main/instanceparameter/resetinstanceparameters', postData);
				if (!isNull(resp.data.Main) && !isUndefined(resp.data.Main) && resp.data.Main instanceof Array) {
					if (resp.data.Main.length > 0) {
						//todo this.cosMainInstanceParameterService.resetList(resp.data); ConstructionSystemMainInstanceHeaderParameterDataService
					} else {
						//todo this.cosMainInstanceParameterService.setCosParametersForParameterInfo(resp.data.CosParameters);
						//todo this.cosMainInstanceParameterService.setCosParameterGroupsForParameterInfo(resp.data.CosParameterGroups);
						//todo this.cosMainInstanceParameterService.attachData(response.data.LookupValues || {});
					}
					if (!isNull(resp.data.Cos2ObejectParameters) && !isUndefined(resp.data.Cos2ObejectParameters) && resp.data.Cos2ObejectParameters.length > 0) {
						const tempcache: ITempCache[] = [];
						forEach(resp.data.Cos2ObejectParameters, (item) => {
							let temp = filter(tempcache, (i) => {
								return i.key === item.Instance2ObjectFk;
							})[0];
							if (isNull(temp)) {
								temp = { key: item.Instance2ObjectFk, value: [] };
							}
							temp.value.push(item);
						});
						//todo instance2ObjectParamService.resetEntireCache(tempcache);
						if (!isNull(instance2ObjectSelected) && !isUndefined(instance2ObjectSelected)) {
							const items = [];
							forEach(resp.data.Cos2ObejectParameters, (e) => {
								if (e.Instance2ObjectFk === -1) {
									//todo instance2ObjectSelected.Id
									items.push(e);
								}
							});
							//todo instance2ObjectParamService.reset2ObejctParameters(items);
						}
					}
					this.dialogService.showMsgBox(this.translateService.instant('constructionsystem.main.resetInstanceParameters.success').text, this.translateService.instant('cloud.common.informationDialogHeader').text, 'ico-info');
				} else {
					this.dialogService.showMsgBox(this.translateService.instant('constructionsystem.main.resetInstanceParameters.failed').text, this.translateService.instant('cloud.common.informationDialogHeader').text, 'ico-info');
				}
			}
		});
	}
}