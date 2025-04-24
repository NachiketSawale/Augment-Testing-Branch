/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { isNil, parseInt, find, split, filter, forEach } from 'lodash';
import { BaseValidationService, IEntityRuntimeDataRegistry, IReadOnlyField, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IQtoSheetEntity } from '../model/entities/qto-sheet-entity.interface';
import { QtoMainSheetDataService } from './qto-main-sheet-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { CollectionHelper } from '@libs/platform/common';
import { IQtoMainDetailGridEntity } from '../model/qto-main-detail-grid-entity.class';

export class QtoMainSheetValidationService extends BaseValidationService<IQtoSheetEntity> {
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);

	public constructor(protected dataService: QtoMainSheetDataService) {
		super();
	}

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IQtoSheetEntity> {
		return this.dataService;
	}

	protected generateValidationFunctions(): IValidationFunctions<IQtoSheetEntity> {
		return {
			Description: this.validateDescription,
			IsReadonly: this.validateIsReadonly,
		};
	}

	private validateDescription(info: ValidationInfo<IQtoSheetEntity>): ValidationResult {
		const itemList = this.dataService.getList();
		let result = this.validationUtils.isUniqueAndMandatory(info, itemList);

		const entity = info.entity as IQtoSheetEntity;
		// TODO: Temporarily commenting out to resolve eslint the error because it never used.
		// const model = info.field;
		const value = (isNil(info.value) ? '' : info.value) as string;

		if (result.valid) {
			if (value) {
				entity.Description = value;
				const currentNumber: number = parseInt(value);

				const sheetAreaList = this.dataService.qtoDetailDataService.getSheetAreaList();
				if (sheetAreaList && sheetAreaList.length) {
					if (currentNumber && sheetAreaList.length && sheetAreaList.indexOf(currentNumber) <= -1) {
						result = this.validationUtils.createErrorObject({
							key: 'qto.main.detail.addressOverflow',
						});
					}
				}

				if (result.valid) {
					if (currentNumber >= 0) {
						const parentItem = find(itemList, { Id: entity.QtoSheetFk }) as IQtoSheetEntity;
						if (parentItem) {
							const pageNumberDesArray = split(parentItem.Description, '-');
							if (pageNumberDesArray && pageNumberDesArray.length === 2) {
								const startNumber = parseInt(pageNumberDesArray[0]) === 0 ? 1 : parseInt(pageNumberDesArray[0]);
								const endNumber = parseInt(pageNumberDesArray[1]);
								if (startNumber > currentNumber || currentNumber > endNumber) {
									result = this.validationUtils.createErrorObject({
										key: 'qto.main.sheetScope',
									});
								}
							}
						}
					}

					if (result.valid) {
						entity.Description = this.dataService.leftPadZero(currentNumber, 4);
						const qtoDetails = this.dataService.qtoDetailDataService.getList();
						const filterDetails = filter(qtoDetails, { QtoSheetFk: entity.Id });
						forEach(filterDetails, function (detail) {
							detail.PageNumber = currentNumber;
						});
						this.dataService.qtoDetailDataService.setModified(filterDetails);
					}
				}
			}
		}

		return result;
	}

	/**
	 * IsReadonly cell change
	 * @param info
	 * @private
	 */
	private validateIsReadonly(info: ValidationInfo<IQtoSheetEntity>): ValidationResult {
		const entity = info.entity;

		// set the qto sheet children readonly or not
		const qtoSheetList = CollectionHelper.Flatten([entity], this.dataService.childrenOf);
		const qtoSheetsToSave = filter(qtoSheetList, { IsReadonly: !entity.IsReadonly });
		forEach(qtoSheetsToSave, function (qtoSheet) {
			qtoSheet.IsReadonly = entity.IsReadonly;
		});

		// set the sheet parent
		let itemsToSave: IQtoSheetEntity[] = [];
		if (!entity.IsReadonly) {
			itemsToSave = this.dataService.setQtoSheetParentsReadonlyFlag(entity);
		} else {
			const parentItems: IQtoSheetEntity[] = [];
			this.dataService.getQtoSheetParentList(entity, parentItems);
			if (parentItems.length > 0) {
				const sheetList = CollectionHelper.Flatten(parentItems, this.dataService.childrenOf);
				forEach(parentItems, (parentItem) => {
					if (!parentItem.IsReadonly) {
						const noCheckItem = find(sheetList, { QtoSheetFk: parentItem.Id, IsReadonly: false });
						if (!noCheckItem) {
							parentItem.IsReadonly = true;
							itemsToSave.push(parentItem);
						}
					}
				});
			}
		}
		this.dataService.setModified(itemsToSave);
		this.dataService.setModified(qtoSheetsToSave);

		// set the qto line as readonly
		const qtoDetails = this.dataService.qtoDetailDataService.getList();
		const filterDetails = filter(qtoDetails, (qtoDetail) => {
			return find(qtoSheetList, { Id: qtoDetail.QtoSheetFk });
		}) as IQtoMainDetailGridEntity[];
		if (entity.IsReadonly) {
			const qtoDetailsToSave = filter(filterDetails, { IsReadonly: !entity.IsReadonly });
			forEach(qtoDetailsToSave, (detail) => {
				detail.IsReadonly = true;
				detail.IsSheetReadonly = true;
			});
			this.dataService.qtoDetailDataService.setModified(qtoDetailsToSave);
		} else {
			forEach(filterDetails, (detail) => {
				detail.IsSheetReadonly = false;
				const readonlyFields: IReadOnlyField<IQtoMainDetailGridEntity>[] = [{ field: 'PageNumber', readOnly: !detail.IsReadonly && detail.IsSheetReadonly }];
				this.dataService.qtoDetailDataService.setEntityReadOnlyFields(detail, readonlyFields);
			});
		}

		return this.validationUtils.createSuccessObject();
	}
}
