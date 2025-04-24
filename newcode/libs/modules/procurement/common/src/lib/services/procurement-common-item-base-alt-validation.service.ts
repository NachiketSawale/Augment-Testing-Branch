/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { isNull, maxBy, isNumber, isNil } from 'lodash';
import { inject, Injectable } from '@angular/core';
import { IPrcItemEntity } from '../model/entities';
import { ProcurementCommonItemDataService } from './procurement-common-item-data.service';
import { PrcCommonItemComplete } from '../model/procurement-common-item-complete.class';
import { CompleteIdentification, IEntityIdentification, PlatformTranslateService } from '@libs/platform/common';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService, BasItemType2 } from '@libs/basics/shared';
import { ProcurementCommonItemValidationService } from './procurement-common-item-validation.service';
import { FieldValidationInfo } from '@libs/ui/common';


export interface IProcurementCommonItemBaseAltValidationOptions<T extends IPrcItemEntity, U extends PrcCommonItemComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> {
	getItemList: () => T[];
	validationService: ProcurementCommonItemValidationService<T, U, PT, PU>;
	dataService?: ProcurementCommonItemDataService<T, U, PT, PU>;
}

const AGN_START_VALUE = 100;

/**
 * The basic validation service for procurement item
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonItemBaseAltValidationService<T extends IPrcItemEntity, U extends PrcCommonItemComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> {
	protected translateService = inject(PlatformTranslateService);
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);
	protected options?: IProcurementCommonItemBaseAltValidationOptions<T, U, PT, PU>;

	public initialize(options: IProcurementCommonItemBaseAltValidationOptions<T, U, PT, PU>): void {
		this.options = options;
	}

	private setModified(entity: T[] | T) {
		if (this.options && this.options.dataService) {
			this.options.dataService.setModified(entity);
		}
	}

	public isItemBase(item: T) {
		return item.BasItemType2Fk === BasItemType2.Base || item.BasItemType2Fk === BasItemType2.BasePostponed;
	}

	public isItemAlternative(item: T) {
		return item.BasItemType2Fk === BasItemType2.Alternative || item.BasItemType2Fk === BasItemType2.AlternativeAwarded;
	}

	private isBasePostponedOrAlternative(basItemType2Fk: number) {
		return basItemType2Fk === BasItemType2.BasePostponed || basItemType2Fk === BasItemType2.Alternative;
	}

	private isItemBasePostponedOrAlternative(item: T) {
		return this.isBasePostponedOrAlternative(item.BasItemType2Fk);
	}

	private getSameAGNItemsIncludeGivenItem(prcItemList: T[], item: T): T[] {
		return prcItemList.filter((prcItem: T) => prcItem.AGN === item.AGN);
	}

	public getSameAGNItems(prcItemList: T[], item: T): T[] {
		return this.getSameAGNItemsIncludeGivenItem(prcItemList, item).filter((prcItem: T) => prcItem.Id !== item.Id);
	}

	public getSameAGNWithDifferentAANItems(prcItemList: T[], item: T): T[] {
		return this.getSameAGNItems(prcItemList, item).filter((prcItem: T) => prcItem.AAN !== item.AAN);
	}

	public getSameAANItemsIncludeGivenItem(prcItemList: T[], item: T): T[] {
		return this.getSameAGNItemsIncludeGivenItem(prcItemList, item).filter((i) => i.AAN === item.AAN);
	}

	private getSameAANItems(prcItemList: T[], item: T): T[] {
		return this.getSameAANItemsIncludeGivenItem(prcItemList, item).filter((i) => i.Id !== item.Id);
	}

	public validateAAN(info: ValidationInfo<T>) {
		if (this.options) {
			const entity = info.entity;
			const dataList = this.options.getItemList();

			if (info.value && entity.AGN) {
				const hasBaseItem = this.getSameAGNItems(dataList, entity).some((item: T) => this.isItemBase(item));
				const sameAGNANNItems = this.getSameAGNItems(dataList, entity).filter((item: T) => item.AAN === info.value);

				if (sameAGNANNItems.length > 0 && hasBaseItem) {
					entity.BasItemType2Fk = sameAGNANNItems[0].BasItemType2Fk;
					this.setModified(entity);
				} else {
					if (hasBaseItem) {
						entity.BasItemType2Fk = BasItemType2.Alternative;
						this.setModified(entity);
					} else {
						return this.validationUtils.createErrorObject({
							key: 'procurement.common.prcNoBaseError1',
						});
					}
				}
			}

			//TODO: @Alina please double check why value will === 0.
			//cause when user input ann=0,should change BasItemType2Fk to base
			if (info.value === 0 && this.isItemBasePostponedOrAlternative(entity)) {
				entity.BasItemType2Fk = BasItemType2.Base;

				//TODO: any better solution? seems if the validation has error there is no chance to show it in the UI.
				this.validateBasItemType2FkWithValue(entity, entity.BasItemType2Fk);
			}
		}

		return this.validationUtils.createSuccessObject();
	}

	private validateItemType2ChangeToNormal(prcItemList: T[], info: FieldValidationInfo<T>) {
		let validationResult = new ValidationResult();
		const currentItemType2Fk = info.entity.BasItemType2Fk;
		//Change base to normal type is not allowed as alternative item already existed
		if (this.getSameAGNItems(prcItemList, info.entity).some((i) => this.isItemAlternative(i) && this.isItemBase(info.entity))) {
			validationResult = new ValidationResult(this.translateService.instant('procurement.common.prcBaseToNormalErrorMessage').text);
		} else {
			this.getSameAANItemsIncludeGivenItem(prcItemList, info.entity).forEach((i) => {
				i.PrcItemAltFk = undefined;
				i.AAN = undefined;
				i.AGN = undefined;
				i.BasItemType2Fk = BasItemType2.Normal;
				this.setModified(i);
			});

			if (currentItemType2Fk === BasItemType2.AlternativeAwarded) {
				this.getSameAGNItems(prcItemList, info.entity)
					.filter((i) => i.BasItemType2Fk === BasItemType2.BasePostponed)
					.forEach((i) => {
						i.BasItemType2Fk = BasItemType2.Base;
						this.setModified(i);
					});
			}
		}
		return validationResult;
	}


	private validateItemType2ChangeToBase(prcItemList: T[], info: FieldValidationInfo<T>) {
		if (!info.entity.AGN) {
			const maxAGNItem = maxBy(prcItemList, 'AGN');
			info.entity.AGN = maxAGNItem?.AGN ? maxAGNItem.AGN + 1 : AGN_START_VALUE;
		} else {

			if (this.isItemAlternative(info.entity)) {
				// Change from alternative to base
				// Set the base item with same AGN as Alternative, set the AAN with current item's AAN
				// Set current item with AAN 0 as base item

				this.getSameAGNWithDifferentAANItems(prcItemList, info.entity).forEach((i) => {
					if (this.isItemBase(i)) {
						i.AAN = info.entity.AAN;
					}
					i.BasItemType2Fk = BasItemType2.Alternative;
					this.setModified(i);
				});

				this.getSameAANItemsIncludeGivenItem(prcItemList, info.entity).forEach((i) => {
					i.BasItemType2Fk = BasItemType2.Base;
					i.AAN = 0;
					this.setModified(i);
				});
			} else if (info.entity.BasItemType2Fk === BasItemType2.BasePostponed) {
				// Change from BasePostponed to base
				// Set other AlternativeAwarded items with same AGN as Alternative
				// Set all item with the same AAN as BasePostponed to Base

				this.getSameAANItemsIncludeGivenItem(prcItemList, info.entity).forEach((i) => {
					i.BasItemType2Fk = BasItemType2.Base;
					this.setModified(i);
				});

				this.getSameAGNWithDifferentAANItems(prcItemList, info.entity).filter(item => item.BasItemType2Fk === BasItemType2.AlternativeAwarded).forEach((i) => {
					i.BasItemType2Fk = BasItemType2.Alternative;
					this.setModified(i);
				});
			}
		}

		return new ValidationResult();
	}


	private validateItemType2ChangeToAlternative(prcItemList: T[], info: FieldValidationInfo<T>) {
		let baseItems = prcItemList.filter((i) => i.Id !== info.entity.Id && this.isItemBase(i));
		if (this.isItemBase(info.entity)) {
			//Only get the base items from the same AAN
			baseItems = baseItems.filter((i) => this.getSameAANItems(prcItemList, info.entity).includes(i));
		}

		if (baseItems.length > 0) {
			const sameAGNItems = this.getSameAGNItems(prcItemList, info.entity);

			const lastBaseItem = maxBy(baseItems, 'Id');
			if (lastBaseItem) {
				//from normal or other type ,from normal or other type ,Agn may be empty,then set last item agn
				if (isNull(info.entity.AGN)) {
					info.entity.AGN = lastBaseItem.AGN;
				}
				//TODO the code here is from original angularJs but the code was meaningless
				// return item.AGN===maxBasObj.AGN&&maxBasObj.AAN===maxBasObj.AAN;
				const showAltByBase = baseItems.find((i) => i.AGN === lastBaseItem.AGN);

				if (showAltByBase) {
					info.entity.PrcItemAltFk = showAltByBase.PrcItemAltFk;
				} else {
					info.entity.PrcItemAltFk = lastBaseItem.PrcItemAltFk;
				}
				this.setModified(info.entity);
			}

			if (info.entity.AGN) {
				const maxAANItem = maxBy(sameAGNItems, 'AAN');

				if (!info.entity.AAN) {
					info.entity.AAN = isNil(maxAANItem?.AAN) ? 0 : maxAANItem.AAN + 1;
				}

				if (info.value === BasItemType2.Alternative) {
					// Change to Alternative
					// Set the same AAN item with the same AGN as Alternative
					// Set all BasePostponed items with the same AGN as Base if there is no item is AlternativeAwarded

					this.getSameAANItems(sameAGNItems, info.entity).forEach((i) => {
						i.BasItemType2Fk = BasItemType2.Alternative;
						this.setModified(i);
					});

					if (sameAGNItems.some((i) => i.BasItemType2Fk !== BasItemType2.AlternativeAwarded)) {
						sameAGNItems
							.filter((i) => i.BasItemType2Fk === BasItemType2.BasePostponed)
							.forEach((i) => {
								i.BasItemType2Fk = BasItemType2.Base;
								this.setModified(i);
							});
					}
				} else {
					// Change to AlternativeAwarded
					// Set all base items with the same AGN as BasePostponed
					// Set all AlternativeAwarded items with the same AGN as Alternative
					// Set the same AAN item with the same AGN as AlternativeAwarded

					sameAGNItems.forEach((i) => {
						if (i.BasItemType2Fk === BasItemType2.Base) {
							i.BasItemType2Fk = BasItemType2.BasePostponed;
							this.setModified(i);
						} else if (i.BasItemType2Fk === BasItemType2.Alternative && i.AAN === info.entity.AAN) {
							i.BasItemType2Fk = BasItemType2.AlternativeAwarded;
							this.setModified(i);
						} else if (i.BasItemType2Fk === BasItemType2.AlternativeAwarded) {
							i.BasItemType2Fk = BasItemType2.Alternative;
							this.setModified(i);
						}
					});
				}
			}
		} else {
			return new ValidationResult(this.translateService.instant('procurement.common.prcNoBaseError').text);
		}

		return new ValidationResult();
	}

	public async validateBasItemType2FkWithValue(entity: T, value: number) {
		return await this.validateBasItemType2Fk(new ValidationInfo(entity, value, 'BasItemType2Fk'));
	}

	/**
	 * @param info
	 * @protected
	 */
	public async validateBasItemType2Fk(info: ValidationInfo<T>) {
		let validationResult = this.validationUtils.createSuccessObject();

		if (this.options) {
			const entity = info.entity;
			const dataList = this.options.getItemList();

			switch (info.value) {
				case BasItemType2.Normal:
					validationResult = this.validateItemType2ChangeToNormal(dataList, info);
					break;
				case BasItemType2.Base:
					validationResult = this.validateItemType2ChangeToBase(dataList, info);
					break;
				case BasItemType2.BasePostponed:
					validationResult = new ValidationResult(this.translateService.instant('procurement.common.prcCantSelectBasePostponedMessage').text);
					break;
				case BasItemType2.Alternative:
				case BasItemType2.AlternativeAwarded:
					validationResult = this.validateItemType2ChangeToAlternative(dataList, info);
					break;
			}

			if (validationResult.valid) {

				entity.BasItemType2Fk = info.value as number;

				if (this.isBasePostponedOrAlternative(info.value as number)) {
					info.entity.TotalNoDiscount = 0;
					info.entity.TotalCurrencyNoDiscount = 0;
					info.entity.Total = 0;
					info.entity.TotalOc = 0;
					info.entity.TotalGross = 0;
					info.entity.TotalGrossOc = 0;
				} else {
					await this.options.validationService.resetExtraAndCalculateTotal(entity);
				}
			}

		}

		return validationResult;
	}

	/**
	 * @param info
	 * @protected
	 */
	public async validateAGN(info: ValidationInfo<T>) {
		let validateResult = this.validationUtils.createSuccessObject();

		if (this.options) {
			const entity = info.entity;
			const value = info.value as number;
			entity.AGN = value; //Set the value into entity to continue other validations

			const dataList = this.options.getItemList();

			if (isNumber(value) && value < AGN_START_VALUE) {
				return this.validationUtils.createErrorObject({
					key: 'procurement.common.AgnRangeError',
				});
			}

			if (value && value >= AGN_START_VALUE) {
				const sameAGNItems = this.getSameAGNItems(dataList, entity);
				const sameAGNAltItems = sameAGNItems.filter((i) => this.isItemAlternative(i));
				if (entity.BasItemType2Fk === BasItemType2.Normal) {
					if (sameAGNItems.length === 0) {
						entity.AAN = 0;
						entity.BasItemType2Fk = BasItemType2.Base;
						await this.validateBasItemType2FkWithValue(entity, BasItemType2.Base);
					} else {
						const baseItem = sameAGNItems.find((i) => this.isItemBase(i));
						if (baseItem) {
							entity.PrcItemAltFk = baseItem.PrcItemAltFk;
							entity.BasItemType2Fk = BasItemType2.Alternative;
							await this.validateBasItemType2FkWithValue(entity, BasItemType2.Alternative);
						}
					}
				} else if (this.isItemBase(entity)) {
					if (sameAGNAltItems.length > 0) {
						validateResult = this.validationUtils.createErrorObject({
							key: 'procurement.common.cantSetAGN',
						});
						return validateResult;
					}
				} else if (this.isItemAlternative(entity)) {
					if (sameAGNAltItems.length === 0) {
						entity.AAN = 0;
						entity.BasItemType2Fk = BasItemType2.Base;
						entity.PrcItemAltFk = entity.Id;
					} else {
						const sameAgnAnnItems = this.getSameAANItems(dataList, entity);

						if (sameAgnAnnItems.length > 0) {
							const firstSameANNItem = sameAgnAnnItems[0];
							entity.BasItemType2Fk = firstSameANNItem.BasItemType2Fk;
							entity.PrcItemAltFk = firstSameANNItem.PrcItemAltFk;
						} else {
							const firstSameAGNAltItem = sameAGNAltItems[0];
							entity.BasItemType2Fk = BasItemType2.Alternative;
							entity.PrcItemAltFk = firstSameAGNAltItem.PrcItemAltFk;
						}
					}
				}
			} else if (isNull(value) && entity.BasItemType2Fk !== BasItemType2.Normal) {
				if (this.isItemBase(entity)) {
					if (this.getSameAGNItems(dataList, entity).some((i) => this.isItemAlternative(i))) {
						await this.validateBasItemType2FkWithValue(entity, BasItemType2.Normal);
					} else {
						validateResult = this.validationUtils.createErrorObject({
							key: 'procurement.common.prcBaseToNormalErrorMessage',
						});
					}
				} else {
					await this.validateBasItemType2FkWithValue(entity, BasItemType2.Normal);
				}
			}
		}

		return validateResult;
	}
}
