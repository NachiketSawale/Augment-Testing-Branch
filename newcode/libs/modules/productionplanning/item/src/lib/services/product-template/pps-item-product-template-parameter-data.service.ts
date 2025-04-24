
/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { get, isFunction, isNull } from 'lodash';

import {
	IPpsParameterEntityGenerated, IPpsProductEntityGenerated,
} from '@libs/productionplanning/shared';
import { IPPSItemEntity, PPSItemComplete } from '../../model/models';
import {
	PlatformConfigurationService,
	PlatformTranslateService
} from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import {
	FieldType,
	IGridDialogOptions,
	StandardDialogButtonId,
	UiCommonGridDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions,ServiceRole
} from '@libs/platform/data-access';
import { PpsItemDataService } from '../pps-item-data.service';

interface IDialogProductEntity extends IPpsProductEntityGenerated
{
	Check: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class PpsItemProductTemplateParameterDataService extends DataServiceFlatLeaf<IPpsParameterEntityGenerated,IPPSItemEntity, PPSItemComplete> {

	private https = inject(HttpClient);
	private configurationService = inject(PlatformConfigurationService);
	private readonly msgBoxService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);

	private readonly config = {
		filter: 'ProductDescriptionFk',
		PKey1: '',
		PKey2: ''
	};

	public constructor(
		private parentService: PpsItemDataService,

	) {
		const options: IDataServiceOptions<IPpsParameterEntityGenerated> = {
			apiUrl: 'productionplanning/formulaconfiguration/parameter',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listby',
				usePost: false
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: ident => {
					const PKey1 = get(this.getSelectedParent(), this.config.PKey1 || '');
					const PKey2 = get(this.getSelectedParent(), this.config.PKey2 || '');
					return {
						Id: this.getSelectedParent()?.Id,
						PKey1: PKey1,
						PKey2: PKey2
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsParameterEntityGenerated,IPPSItemEntity, PPSItemComplete>>{
				role: ServiceRole.Node,
				itemName: 'PpsParameter',
				parent: parentService
			}
		};
		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	protected override provideLoadPayload(): object {
		const descriptionFk = get(this.getSelectedParent(), this.config.filter || '');
		if (!isNull(descriptionFk)) {
			return { ProductDescriptionFk: descriptionFk };
		}else {
			throw new Error('There should be a selected parent to load the corresponding parameter data');
		}
	}

	protected override onLoadSucceeded(loaded: object): IPpsParameterEntityGenerated[] {
		if (loaded) {
			return get(loaded, 'Main')! as IPpsParameterEntityGenerated[];
		}
		return [];
	}

	public async reload() {
		return this.load({ id: 0, pKey1: this.parentService.getSelection()[0].Id });
	}

	public canRecalculate (): boolean {
		const parentSelected = this.getSelectedParent();
		return parentSelected != null ? !!get(parentSelected, this.config.filter!) : false;
	}

	public async recalculate() {
		const parentSelected = this.getSelectedParent();
		const productTemplateFk = get(parentSelected, this.config.filter!);

		if (parentSelected && productTemplateFk != null) {
			const title = this.translateService.instant('productionplanning.formulaconfiguration.ppsParameter.recalculate.dialogTitle').text;
			const dialogConfig: IGridDialogOptions<IDialogProductEntity> = {
				width: '50%',
				headerText: title,
				windowClass: 'grid-dialog',
				gridConfig: {
					uuid: '9ae6315174be49f6bb6df2a438b8c791',
					columns: [
						{
							id: 'check',
							model: 'Check',
							type: FieldType.Boolean,
							label: {
								text: '*Check',
								key: 'cloud.common.entityChecked'
							},
							visible: true,
							sortable: false
						},
						{
							id: 'code',
							model: 'Code',
							type: FieldType.Code,
							label: {
								text: '*Code',
								key: 'cloud.common.entityCode'
							},
							readonly: true,
							visible: true,
							sortable: false
						},
						{
							id: 'desc',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: {
								text: '*Description',
								key: 'cloud.common.entityDescription'
							},
							readonly: true,
							visible: true,
							sortable: false
						},
					]
				},
				isReadOnly: false,
				allowMultiSelect: true,
				items: [],
				selectedItems: [],
				customButtons: [{
					id: 'switchcheckbox',
					caption: { key: 'productionplanning.formulaconfiguration.ppsParameter.recalculate.switchcheckbox' },
					isDisabled: (info) => {
						return !info.dialog.items || info.dialog.items.length === 0;
					},
					fn: (event, info) => {
						const products = info.dialog.items!;
						this.switchCheckbox(products);
					}
				}],
			};

			const url = this.configurationService.webApiBaseUrl + 'productionplanning/common/product/listForDescription?descriptionFk=' + productTemplateFk;
			await this.https.get(url).subscribe(res => {
				const products = [];
				if (res && Object(res).data && Object(res).data.Main.length > 0) {
					products.push(...Object(res).data.Main);
					products.forEach(item => {
						item.Check = true;
					});
					dialogConfig.items.push(...products);
				}
			});

			const result = await this.gridDialogService.show(dialogConfig);
			if (result && result.closingButtonId === StandardDialogButtonId.Ok) {
				const products = result.value!.items;
				await this.doRecalculate(productTemplateFk, getCheckedProductIds(products));
			}
		}

		function getCheckedProductIds(items: IDialogProductEntity[]) {
			return items.filter(item => item.Check).map(item => item.Id);
		}
	}

	private async doRecalculate(productTemplateFk: number, productIds?: number[]){
		const postData = {
			ProductTemplateId: productTemplateFk,
			ProductIds: productIds,
		};
		const url = this.configurationService.webApiBaseUrl + 'productionplanning/common/product/recalculate';
		await this.https.post(url, postData).subscribe( response => {
			if (response && Object(response).data) {
				if(isFunction( get(this.parentService , 'refreshSubContainersAfterRecalculate'))){
					//this.parentService.refreshSubContainersAfterRecalculate();
					this.reload();
				} else{
					//this.parentService.refreshSelected();
				}
			}
		});
	}
	private switchCheckbox(items: IDialogProductEntity[], uuid?: string) {
		if (items.filter(i => !i.Check).length > 0) {
			items.forEach(i => i.Check = true);
		} else {
			items.forEach(i => i.Check = false);
		}
		//$injector.get('platformGridAPI').grids.refresh(uuid, true);
	}


	public override registerModificationsToParentUpdate(complete: PPSItemComplete, modified: IPpsParameterEntityGenerated[], deleted: IPpsParameterEntityGenerated[]): void {
		if (modified && modified.some(() => true)) {
			complete.PpsParameterToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			complete.PpsParameterToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: PPSItemComplete): IPpsParameterEntityGenerated[] {
		if (complete && !isNull(complete.PpsParameterToSave)) {
			return complete.PpsParameterToSave;
		}
		return [];
	}

}








