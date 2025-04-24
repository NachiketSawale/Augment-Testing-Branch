/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEstimateMainConfigComplete, IEstMainConfigComplete } from '@libs/estimate/interfaces';
import {
	EstimateBaseConfigDialogService, EstimateMainDialogUiService,
	EstimateMainEstColumnConfigDataService,
	EstimateMainRuleAssignDataService,
	EstimateMainStructureDataService, RoundingConfigDataService, TotalsConfigDataService
} from '@libs/estimate/shared';
import { StandardDialogButtonId } from '@libs/ui/common';


/**
 * EstimateMainConfigService use for estimate config dialog
 */
@Injectable({
	providedIn: 'root'
})
export class EstimateMainConfigService extends EstimateBaseConfigDialogService{
	private readonly estimateMainDialogUiService = inject(EstimateMainDialogUiService);
	private readonly columnConfigDataService = inject(EstimateMainEstColumnConfigDataService);
	private readonly estimateMainStructureDataService=inject(EstimateMainStructureDataService);
	private readonly estimateMainRuleAssignDataService = inject(EstimateMainRuleAssignDataService);
	private readonly totalsConfigDataService = inject(TotalsConfigDataService);
	private readonly roundingConfigDataService = inject(RoundingConfigDataService);
	private entity: IEstimateMainConfigComplete | null = null;

	/**
	 * show config dialog
	 */
	public async showDialog(){
		if (this.estimateMainContextService.getSelectedEstHeaderId() > 0) {
			let headerItem = this.estimateMainContextService.getSelectedEstHeaderItem();
			if(!headerItem){
				headerItem = await this.loadHeaderData();
			}
			await this.loadCurrentItem(headerItem);

			const dialogConfig = this.estimateMainDialogUiService.getFormConfig();

			this.entity = this.createEntityFromCompleteData(this.completeData!);

			const result = await this.showConfigDialog<IEstimateMainConfigComplete>({
				id: 'estConfigDialog',
				headerText: {
					key: 'estimate.main.estConfigDialogTitle'
				},
				formConfiguration: dialogConfig,
				entity: this.entity,
				width: '950',
				height: '750px'
			});

			if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				this.provideUpdateData(this.completeData!);
				this.update(this.completeData!);
			}
		}
	}

	/**
	 * generate form data form complete data
	 * @param completeData
	 * @private
	 */
	private createEntityFromCompleteData(completeData: IEstMainConfigComplete): IEstimateMainConfigComplete {
		const currentItem = {} as IEstimateMainConfigComplete;
		this.getPropertiedFromMainEntity(currentItem, completeData);
		this.columnConfigDataService.setFormDataFromComplete(completeData, currentItem);
		this.estimateMainStructureDataService.setData(completeData);
		this.estimateMainRuleAssignDataService.setData(completeData);
		this.totalsConfigDataService.setFormDataFromComplete(completeData, currentItem);
		this.roundingConfigDataService.setFormDataFromComplete(completeData, currentItem);
		return currentItem;
	}

	private getPropertiedFromMainEntity(currentItem:IEstimateMainConfigComplete, completeData: IEstMainConfigComplete){
		currentItem.estConfigTypeFk = completeData.EstConfigType ? completeData.EstConfigType.Id: 0;
		const estConfig = completeData.EstConfig;
		if(estConfig && estConfig.Id){
			currentItem.estConfigDesc = estConfig.DescriptionInfo ? estConfig.DescriptionInfo.Translated : null;
			currentItem.isColumnConfig = estConfig.IsColumnConfig;
			currentItem.boqWicCatFk = estConfig.WicCatFk;
			currentItem.estStructTypeFk = estConfig.EstStructureTypeFk;
			currentItem.estUppConfigTypeFk = estConfig.EstUppConfigTypeFk;
		}
		const headerEstConfigTypeFk = completeData.EstHeader ? completeData.EstHeader.EstConfigtypeFk : null;
		const headerEstConfigFk =  completeData.EstHeader ? completeData.EstHeader.EstConfigFk : null;
		currentItem.isEditEstType = !headerEstConfigTypeFk && !!headerEstConfigFk;
	}

	/**
	 * handle provider data for update
	 * @param completeData
	 * @private
	 */
	private provideUpdateData(completeData: IEstMainConfigComplete){
		this.columnConfigDataService.provideUpdateData(completeData);
		this.totalsConfigDataService.provideUpdateData(completeData);
		this.roundingConfigDataService.provideUpdateData(completeData);
	}
}