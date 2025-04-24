/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { BoqItemDataService } from './boq-main-boq-item-data.service';
import { IBoqItemEntity, IBoqItemSubPriceEntity } from '@libs/boq/interfaces';
import { BoqLineType } from '../model/boq-main-boq-constants';
import * as _ from 'lodash';

@Injectable({providedIn: 'root'})
export class BoqSubpriceDataService extends DataServiceFlatLeaf<IBoqItemSubPriceEntity, IBoqItemEntity, IBoqItemEntity> {
	public totalPrice : string = '';

	public constructor(private boqItemDataService: BoqItemDataService) {
		const options: IDataServiceOptions<IBoqItemSubPriceEntity> = {
			apiUrl: 'boq/main/subprice',
			roleInfo: <IDataServiceChildRoleOptions<IBoqItemSubPriceEntity,IBoqItemEntity,IBoqItemEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'BoqItemSubPrice',
				parent: boqItemDataService
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				prepareParam: () => {
					const currentBoqItem = boqItemDataService.getSelectedEntity();
					if (currentBoqItem?.BoqLineTypeFk == BoqLineType.Position) {
						return { boqHeaderId: currentBoqItem.BoqHeaderFk, boqItemId: currentBoqItem.Id };
					} else {
						return;
					}
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: () => {
					const currentBoqItem = boqItemDataService.getSelectedEntity();
					if (currentBoqItem?.BoqLineTypeFk == BoqLineType.Position) {
						return { PKey1: currentBoqItem.BoqHeaderFk, PKey2: currentBoqItem.Id };
					} else {
						return;
					}
				}
			}
		};

		super(options);
	}

	public deleteSubprice() {
		this.calculateTotalPrice();
		//TODO:BOQ - 'gridRefresh' will be added.
	}

	//TODO-BOQ: Not used for a while but will make changes as per requirement.
	private propertyChanged(changedSubPrice: { TotalPrice: number, Price: number }, propertyName: string) {
		switch (propertyName) {
			case 'Price':
			case 'Approach': {
				//TODO-EST: Inject estimateMainCommonCalculationService.getIsMapCulture' will be added.
				const isMapCulture: boolean = false;
				if ( isMapCulture ) {
					//TODO-BOQ: Workaround variable is used till find appropriate Math function.
					//let convertedApproach = this.replaceCommaByDotInApproach(changedSubPrice.Approach);
					const approach : number = 0; //TODO-BOQ: Math.round(eval( convertedApproach ), 3);
					if (approach !== null || approach !== undefined) {
						changedSubPrice.TotalPrice = (approach * changedSubPrice.Price);
						this.calculateTotalPrice();
						//TODO: gridRefresh();
					}
				}
			} break;
		}
	}

	private replaceCommaByDotInApproach(approachString : string) {
		if(approachString && typeof approachString === 'string') {
			return approachString.replace(/[,]/gi, '.');
		}
		return '';
	}

	public copyTotalPrice(sumOfTotalPrice: string){
		if (sumOfTotalPrice !== null && sumOfTotalPrice !== undefined) {
			const currentBoqItem: IBoqItemEntity | null = this.boqItemDataService.getSelectedEntity();
			//TODO-BOQ: 'boqMainService.getCellEditable' will be migrate.
			if (!this.boqItemDataService.getReadOnly()) {
				if (currentBoqItem !== null && currentBoqItem !== undefined) {
					//TODO-BOQ: 'boqMainCommonService' will be added.
					currentBoqItem.Price = parseInt(sumOfTotalPrice);
					//TODO-BOQ: Functions from 'boqMainChangeService.reactOnChangeOfBoqItem' will be added.
				}
			}
		}
	}

	public calculateTotalPrice(){
		let sum = 0;
		_.forEach(this.getList(), function(value) {
			sum += value.TotalPrice;
		});
		return this.totalPrice = sum.toFixed(2);
	}

}

/*
 * Copyright(c) RIB Software GmbH
 */
@Injectable({
	providedIn: 'root'
})
export class BoqSubpriceBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IBoqItemSubPriceEntity>, IBoqItemSubPriceEntity> {
	private dataService: BoqSubpriceDataService;
	private boqItemDataService : BoqItemDataService;
	private disableBtn: boolean = false;

	public constructor() {
		this.dataService = inject(BoqSubpriceDataService);
		this.boqItemDataService = inject(BoqItemDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IBoqItemSubPriceEntity>): void {

		const customToolbarItems :ConcreteMenuItem[] =[
			{
				caption: { key: 'boq.main.copyTotalPrice' },
				iconClass: 'tlb-icons ico-copy',
				id: '1',
				type: ItemType.Item,
				fn: () => {
					const sumOfTotalPrice = this.dataService.calculateTotalPrice();
					console.log('sumOfTotalPrice', sumOfTotalPrice);
					this.dataService.copyTotalPrice(sumOfTotalPrice);
				},
			},
			{
				sort: 1,
				caption: { key: 'boq.main.create' },
				iconClass: 'tlb-icons ico-rec-new',
				id: 't2',
				type: ItemType.Item,
				fn: () => {},
				disabled: () => {
					const currentItem = this.boqItemDataService.getSelectedEntity();
					if(currentItem?.BoqLineTypeFk == 0 ){
						return this.disableBtn = false;
					}else {
						return this.disableBtn = true;
					}
				},
			}];
			containerLink.uiAddOns.toolbar.deleteItems(['create', 'clipboard']);
			containerLink.uiAddOns.toolbar.addItems(customToolbarItems);
	}
}

/*
 * Copyright(c) RIB Software GmbH
 */
@Injectable({providedIn: 'root'})
export class BoqMainSubpriceConfigService {
	public getLayoutConfiguration(): ILayoutConfiguration<IBoqItemSubPriceEntity> {
		return {
			groups: [
				{ gid: 'default-group', attributes: ['Description', 'Approach', 'Price', 'TotalPrice', 'Remark'] },
			],
			overloads: {},
			labels: prefixAllTranslationKeys('', {})
		};
	}
}


/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ConcreteMenuItem, ILayoutConfiguration, ItemType } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * Boq Main Subprice validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BoqSubpriceValidationService extends BaseValidationService<IBoqItemSubPriceEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private boqSubpriceDataService = inject(BoqSubpriceDataService);

	protected generateValidationFunctions(): IValidationFunctions<IBoqItemSubPriceEntity> {
		return {
			Description: this.validateDescription,
			Approach: this.validateIsMandatory,
			Price: this.validateIsMandatory
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBoqItemSubPriceEntity> {
		return this.boqSubpriceDataService;
	}

	//TODO-BOQ: Not used for a while but will make changes as per requirement.
	private validateApproach(info: ValidationInfo<IBoqItemSubPriceEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.Approach as string, 'Approach');
	}

	private validateDescription(info: ValidationInfo<IBoqItemSubPriceEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, info.entity.Description as string, <string>info.value, 'Description');
	}

}