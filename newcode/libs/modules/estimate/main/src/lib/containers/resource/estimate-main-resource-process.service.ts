/*
 * Copyright(c) RIB Software GmbH
 */

import { EstimateResourceBaseProcessService } from '@libs/estimate/shared';
import { inject } from '@angular/core';
import { EstimateMainService } from '../../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainResourceService } from './estimate-main-resource-data.service';
import { IEstResourceEntity } from '@libs/estimate/interfaces';

/**
 * readonly processor for resource
 */
export class EstimateMainResourceProcessService extends EstimateResourceBaseProcessService<IEstResourceEntity>{

	private readonly estimateMainService = inject(EstimateMainService);

	/**
	 * constructor
	 * @param estimateMainResourceService
	 */
	public constructor(protected estimateMainResourceService : EstimateMainResourceService) {
		super(estimateMainResourceService);
	}

	public override process(resItem: IEstResourceEntity) {
		const selectedLineItem = this.estimateMainService.getSelectedEntity();
		if(selectedLineItem){
			if (this.estimateMainContextService.isReadonly() || this.estimateMainContextService.isLineItemStatusReadonly(selectedLineItem) || resItem.EstRuleSourceFk){
				resItem.IsReadonlyStatus = !!resItem.EstRuleSourceFk;
				this.readOnly([resItem], true);
				return;
			}

			//if lineItem is reference lineItem, readonly the resource
			if (selectedLineItem.EstLineItemFk) {
				resItem.cssClass = 'row-readonly-background';
				this.readOnly([resItem], true);
				return;
			} else{
				// if user remove the reference item from the selectedLineItem, make the resource editable
				if(resItem.cssClass === 'row-readonly-background'){
					resItem.cssClass = '';
					this.readOnly([resItem], false);
				}
			}
		}

		super.process(resItem);
	}

	public override setFields(resItem: IEstResourceEntity, isFixRate: boolean) {
		super.setFields(resItem, isFixRate);
		const lineItem = this.estimateMainService.getSelectedEntity();
		if(lineItem && lineItem.IsGc){
			resItem.IsIndirectCost = true;
			this.setPropertiesReadonly(resItem, ['IsIndirectCost'], resItem.IsIndirectCost);
		}
	}

	public setChildResourceDisabled(resItem: IEstResourceEntity) {
		if (resItem.Version === 0 && resItem.EstResourceFk && resItem.IsDisabled) {
			this.setPropertiesReadonly(resItem, ['IsDisabled'], true);
		}
	}
}