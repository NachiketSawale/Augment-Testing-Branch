/*
 * Copyright(c) RIB Software GmbH
 */
import { inject } from '@angular/core';
import { CustomStep, IEditorDialogResult, MultistepDialog, UiCommonMultistepDialogService } from '@libs/ui/common';
import { CollectionHelper, CompleteIdentification, IEntityIdentification, IInitializationContext } from '@libs/platform/common';
import { IProcurementCommonWizardConfig } from '../../model/interfaces/procurement-common-wizard-config.interface';
import { DataServiceFlatRoot, DataServiceHierarchicalRoot } from '@libs/platform/data-access';
import { IProcurementCommonUpdatePriceDataComplete } from '../../model/entities/procurement-common-upate-item-price-entity.interface';
import { ProcurementCommonItemDataService } from '../procurement-common-item-data.service';
import { IPrcItemEntity } from '../../model/entities';
import { PrcCommonItemComplete } from '../../model/procurement-common-item-complete.class';
import { ProcurementUpdatePriceWizardOption } from '../../model/enums/procurement-update-item-price-option.enum';
import { IPrcCommonReadonlyService, IPrcHeaderDataService } from '../../model/interfaces';
import { IProcurementCommonUpdateItemPriceWizardHttpService } from './update-item-price-wizard-http.service';
import { firstValueFrom } from 'rxjs';
import { IProcurementCommonHistoricalPriceForItemDto } from '../../model/dtoes';
import { UpdateItemPriceScopeOptionComponent } from '../../components/update-item-price/update-item-price-scope-option/update-item-price-scope-option.component';
import { UpdateItemPriceUpdateConditionComponent } from '../../components/update-item-price/update-item-price-update-condition/update-item-price-update-condition.component';
import { ProcurementCommonWizardBaseService } from './procurement-common-wizard-base.service';


export interface IProcurementCommonUpdateItemPriceConfigWizardConfig<T extends IEntityIdentification, U extends CompleteIdentification<T>, IT extends IPrcItemEntity, IU extends PrcCommonItemComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends IProcurementCommonWizardConfig<T, U> {
	moduleNameTranslationKey: string;
	rootDataService: IPrcHeaderDataService<T, U> & IPrcCommonReadonlyService<T> & (DataServiceHierarchicalRoot<T, U> | DataServiceFlatRoot<T, U>);
	prcItemService: ProcurementCommonItemDataService<IT, IU, PT, PU>;
	module: number;
}

export abstract class ProcurementCommonUpdateItemPriceWizardService<T extends IEntityIdentification, U extends CompleteIdentification<T>, IT extends IPrcItemEntity, IU extends PrcCommonItemComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends ProcurementCommonWizardBaseService<T, U, IProcurementCommonUpdatePriceDataComplete> {
	private multistepService = inject<UiCommonMultistepDialogService>(UiCommonMultistepDialogService);
	private updateItemPriceWizardHttpService = inject(IProcurementCommonUpdateItemPriceWizardHttpService);

	public constructor(protected override readonly config: IProcurementCommonUpdateItemPriceConfigWizardConfig<T, U, IT, IU, PT, PU>) {
		super(config);
	}

	public override async showWizardDialog() {
		const parentId = this.config.rootDataService.getSelectedEntity()!.Id;
		const headerParentPrcHeaderEntity = this.config.rootDataService.getHeaderEntity();
		const headerParentContext = this.config.rootDataService.getHeaderContext();
		const dataItem: IProcurementCommonUpdatePriceDataComplete = {
			basicOption: ProcurementUpdatePriceWizardOption.CurrentLeadRecordItems,
			selectedItems: this.config.prcItemService.getSelection(),
			itemList: this.config.prcItemService.getList(),
			parentId: parentId,
			headerParentContext: headerParentContext,
			headerParentPrcHeaderEntity: headerParentPrcHeaderEntity,
			updatePriceParam: {
				priceForm: {
					priceConditionFk: -1,
					isCheckQuote: true,
					isCheckContract: true,
					isCheckMaterialCatalog: true,
					isCheckNeutralMaterial: true,
					materialIds: [],
					businessPartnerId: headerParentContext.businessPartnerFk,
				},
				priceResultSet: [],
			},
		};
		const stepTitle = this.translateService.instant('procurement.common.wizard.updateItemPrice.title');
		const basicSetting = new CustomStep('scopeOption', stepTitle, UpdateItemPriceScopeOptionComponent, [], 'basicOption');
		const searchSetting = new CustomStep('updateCondition', stepTitle, UpdateItemPriceUpdateConditionComponent, [], 'updatePriceParam');
		const multistepDialog = new MultistepDialog(dataItem, [basicSetting, searchSetting]);
		multistepDialog.dialogOptions.buttons = [
			{
				id: 'previousStep',
				caption: {key: 'cloud.common.previousStep'},
				isVisible: (info) => {
					return info.dialog.value?.stepIndex !== 0;
				},
				fn: (event, info) => {
					info.dialog.value?.goToPrevious();
				},
			},
			{
				id: 'nextBtn',
				caption: {key: 'basics.common.button.nextStep'},
				isVisible: (info) => {
					return info.dialog.value?.stepIndex === 0;
				},
				fn: (event, info) => {
					if (this.config.prcItemService.getList().length == 0) {
						this.messageBoxService.showMsgBox('procurement.common.wizard.updateItemPrice.itemNoMaterial', 'cloud.common.informationDialogHeader', 'ico-info');
					} else {
						info.dialog.value?.goToNext();
						if (info.dialog.value && info.dialog.value.dataItem) {
							const dataItem = info.dialog.value.dataItem;
							firstValueFrom(this.updateItemPriceWizardHttpService.fillGridFromItemsData(dataItem)).then((response) => {
								dataItem.updatePriceParam.priceResultSet = response as IProcurementCommonHistoricalPriceForItemDto[];
								//todo response weight is 0.need set 1 ,in angular.js conversion it at formatter,after formatter ok,here need delete.
								dataItem.updatePriceParam.priceResultSet.forEach((item) => {
									if (item.Weighting === 0) {
										item.Weighting = 1;
										if (item.Children && item.Children.length > 0) {
											item.Children.forEach((subItem) => {
												subItem.Weighting = 1;
											});
										}
									}
								});
							});
						}
					}
				},
			},
			{
				id: 'update',
				caption: {key: 'procurement.common.wizard.updateItemPrice.update'},
				isVisible: (info) => {
					return info.dialog.value?.stepIndex === 1;
				}
			},
			{
				id: 'closeWin',
				caption: {key: 'basics.common.button.cancel'},
				autoClose: true,
			},
		];
		return this.multistepService.showDialog(multistepDialog);
	}

	protected override isExecuteButtonClicked(result: IEditorDialogResult<IProcurementCommonUpdatePriceDataComplete> | undefined): boolean {
		return result?.closingButtonId === 'update';
	}

	protected override async doExecuteWizard(dataItem: IProcurementCommonUpdatePriceDataComplete) {
		const module = this.config.module;
		//todo here need get selected from gridData. need framework support get grid from MultistepDialog component
		const selectGridData = CollectionHelper.Flatten(dataItem.updatePriceParam.priceResultSet, (item) => {
			return item.Children || [];
		}).filter((item) => item.Selected);
		if (selectGridData.length === 0) {
			this.messageBoxService.showMsgBox('procurement.common.wizard.updateItemPrice.noItemSelected', 'cloud.common.informationDialogHeader', 'ico-info');
		} else {
			const checkPrcItemUomResponse = await firstValueFrom(this.updateItemPriceWizardHttpService.checkPrcItemUom(dataItem, module));
			if (checkPrcItemUomResponse) {
				const cannotConvertItems = checkPrcItemUomResponse as IProcurementCommonHistoricalPriceForItemDto[];
				if (cannotConvertItems.length > 0) {
					const codeList = cannotConvertItems.map((item) => {
						return item.SourceCodeAndDesc;
					});
					await this.messageBoxService.showMsgBox(
						this.translateService.instant({
							key: 'procurement.common.wizard.updateItemPrice.cannotConvert',
							params: {p_0: cannotConvertItems.length},
						}).text + codeList.join(','),
						'cloud.common.informationDialogHeader',
						'ico-info',
					);
				} else {
					const response = await firstValueFrom(this.updateItemPriceWizardHttpService.updateItem(dataItem, module));
					if (response) {
						await this.messageBoxService.showMsgBox('procurement.common.wizard.updateItemPrice.updateSuccess', 'cloud.common.informationDialogHeader', 'ico-info');
					}
				}
			}
		}
		return true;
	}

	public execute(context: IInitializationContext): Promise<void> {
		return this.onStartWizard();
	}
}
