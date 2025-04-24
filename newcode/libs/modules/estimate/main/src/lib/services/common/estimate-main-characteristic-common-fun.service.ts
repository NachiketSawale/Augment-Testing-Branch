/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IEstCharacteristicDataEntity, IEstDomainFormatter, IEstDynamicColReadData, IEstDynamicColumn } from '../../model/interfaces/estimate-main-common.interface';
import { BasicsSharedCharacteristicTypeHelperService } from '@libs/basics/shared';
import { EntityRuntimeData, IEntityModification, IEntitySelection, IReadOnlyField } from '@libs/platform/data-access';
import { PlatformTranslateService, PropertyPath } from '@libs/platform/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';

/**
 * This service is for common functions for Characterisitcs used in EstimateMainCommonService
 */
@Injectable({
	providedIn: 'root'
})
export class EstimateMainCharacteristicCommonFunService {    

	private translateService = inject(PlatformTranslateService);
	
	/**
	 * Generate Characteristic columns
	 * @param dataService Dynamic Dataservice 
	 * @param sectionId Section id for dataservice
	 */
	public generateCharacteristicColumns<PT>(dataService:IEntitySelection<PT> & IEntityModification<PT>, sectionId: string) {
		// const CharacteristicDataService = inject(BasicsCharacteristicCharacteristicDataService);
		// TODO - getService is not defined in BasicsCharacteristicCharacteristicDataService
		// let charaDataService = CharacteristicDataService.getService(dataService, sectionId);
		// return charaDataService.getAllItemBySectionId(true);
	}

	/**
	 * Append characteristic columns from dynamic data service
	 * @param data Dynamic data
	 * @param dataService dymanic dataservice
	 * @param items Dynamic data passed
	 * @param isCreateAssignDefault boolean vlaue to show characteristics
	 */
	public appendCharactiricColumnData<PT,PU extends object>(data:IEstCharacteristicDataEntity[], dataService: IEntitySelection<PT> & IEntityModification<PT>, items:IEntitySelection<PU>[], isCreateAssignDefault?: boolean) {
		//const characteristicTypeService = inject(BasicsSharedCharacteristicTypeHelperService);
		const formEntityRuntimeData: EntityRuntimeData<PU> = new EntityRuntimeData<PU>();
		const lineItems = items ? items : dataService.getSelection() || [];
		const groupData = data.reduce((acc, item) => {
			const key = this.appendCharacCol(null, item);
			if (!acc[key]) {
				acc[key] = [];
			}
			acc[key].push(item);
			return acc;
		}, {} as Record<string, typeof data[0][]>);
		
		lineItems.forEach((lineItem) => {
			Object.entries(groupData).forEach(([characteristicCol, groupItems]) => {
				if (isCreateAssignDefault) {
					const lastCharacteristic = groupItems[groupItems.length - 1];
					(lineItem as PU)[characteristicCol as keyof PU] = this.getCharacteristicValue(lastCharacteristic) as unknown as PU[keyof PU];
				} else {
					const characteristic = groupItems.find(item => item.ObjectFk === Number((lineItem as unknown as { Id: string }).Id));
					if (characteristic) {
						(lineItem as PU)[characteristicCol as keyof PU] = this.getCharacteristicValue(characteristic) as unknown as PU[keyof PU];
					} else if ((lineItem as PU)[characteristicCol as keyof PU] === undefined) {
						// const lastCharacteristic = groupItems[groupItems.length - 1];
						// TODO - characteristicType2Domain does not exists
						//const type = characteristicTypeService.characteristicType2Domain(lastCharacteristic.CharacteristicTypeFk);
						// (lineItem as PU)[characteristicCol as keyof PU] = type === 'boolean' ? (false as unknown as PU[keyof PU]) : (null as unknown as PU[keyof PU]);
					}
				}
			});
		
			if (this.isEstLineItemEntity(lineItem as unknown as { EstRuleSourceFk: number | null })) {
				const fields: Array<IReadOnlyField<PU>> = [];
				if (fields.length === 0) {
					Object.keys(lineItem as object).forEach(item => {
						if (Object.prototype.hasOwnProperty.call(lineItem, item)) {
							fields.push({ field: item as PropertyPath<PU>, readOnly: true });
						}
					});
				}

				formEntityRuntimeData.readOnlyFields.push(...fields);
				formEntityRuntimeData.entityIsReadOnly = false;
			}			
		});		
		
	}

	private isEstLineItemEntity(item: { EstRuleSourceFk: number | null } | null): item is IEstLineItemEntity & { EstRuleSourceFk: number | null } {
		return item != null && (typeof item.EstRuleSourceFk === 'number' || item.EstRuleSourceFk === null);
	}	
	
	/**
	 * Get characteristic value
	 * @param characteristic characteristic
	 * @param CharacteristicTypeService characteristic type service
	 * @returns Characteristic value
	 */
	private getCharacteristicValue(characteristic: IEstCharacteristicDataEntity) {
		const characteristicTypeService = inject(BasicsSharedCharacteristicTypeHelperService);
		if (characteristic.CharacteristicTypeFk === 10) {
			characteristic.ValueText = null;
			if (characteristic.CharacteristicValueFk !== null) {
				characteristic.ValueText = characteristic.CharacteristicValueFk ?? null;
			} else {
				characteristic.ValueText = null;
			}
		}

		return characteristicTypeService.convertValue(characteristic.ValueText ?? null, characteristic.CharacteristicTypeFk);
	}

	/**
	 * Set dynamic columns
	 * @param readData Dynamic data to process
	 * @param dynamicColumns Dynamic columns to set
	 * @param isCombined Boolean to set combine
	 */
	public setDynamicColumnsData(readData: IEstDynamicColReadData, dynamicColumns: IEstDynamicColumn, isCombined: boolean) {
		// TODO
		// let dynamicColService = inject(EstimateMainDynamicColumnService);

		const dynColumns: IEstDynamicColumn = readData.DynamicColumns;

		const estLineItemConfigDetails = dynColumns.ColumnConfigDetails || [];
		const estLineItemCharacteristics = dynColumns.Characteristics || [];
		const defaultCharacteristics = dynColumns.DefaultCharacteristics || [];
		//const characteristicGroupIds = dynColumns.CharacteristicsGroupIds || [];
		// const extendColumnValues = readData.ExtendColumns || [];
		// const udpValues = dynColumns.LiUDPs || [];

		if (estLineItemConfigDetails.length > 0) {
			//	dynamicColService.appendExtendColumnValuesToLineItem(readData.dtos, extendColumnValues);
		}

		// default line item character
		if (defaultCharacteristics.length > 0) {
			//const groupsIds = characteristicGroupIds;
			// defaultCharacteristics = defaultCharacteristics.filter(item => {
			// 	return item.Characteristic && groupsIds.indexOf(item.Characteristic.CharacteristicGroupFk) >= 0;
			// });
			// dynamicColService.setDefaultCharacteristics(defaultCharacteristics);
		}

		if (estLineItemCharacteristics.length > 0) {
			//this.appendCharactiricColumnData(estLineItemCharacteristics, this, readData.Dtos);
		}

		if (!isCombined) {
			// TODO load user defined column and attach data into lineitems
			// this.estDynamicUserDefinedServ.attachUpdatedValueToColumn(readData.dtos, udpValues, false);
		}

		// dynamicColService.setDyAndCharCols(dynamicColumns);
	}

	/**
	 * Get characteristics columns
	 * @param data Dynamic data to process characteristics
	 */
	public getCharactCols(data:IEstCharacteristicDataEntity[]) {
		const charactCols:IEstCharacteristicDataEntity[] = [];
		if (data) {
			data.forEach((item) => {
				const characteristicCode = item.CharacteristicEntity && item.CharacteristicEntity.Code.endsWith('.') ? item.CharacteristicEntity.Code.slice(0, -1) : item.CharacteristicEntity?.Code || '';
				const columnIdorField = characteristicCode.replace(/ /g, '');
				const columnName = characteristicCode;
				const characteristicCol = this.appendCharacCol(columnIdorField, item);
				const colData = charactCols.filter((col) => col.Id.toString() === characteristicCol);
				if (!colData || (colData && colData.length === 0)) {
					const charactCol = this.createCharactCol(item, columnIdorField, columnName);
					charactCols.push(charactCol);
				}
			});
		}
		return charactCols;
	}

	/**
	 * Append characteristic columns
	 * @param idorField Column field
	 * @param item Dynamic data
	 */
	public appendCharacCol(idorField: string | null, item:IEstCharacteristicDataEntity) : string {	
		// let columnIdorField = idorField.replace(/ /g, '');	
		// TODO CharacteristicEntity is not present in IBasicsCharacteristicDataEntity
		if (item.CharacteristicEntity && item.CharacteristicEntity.Id > 0) {
			item.CharacteristicGroupFk = item.CharacteristicEntity.CharacteristicGroupFk;
			item.CharacteristicTypeFk = item.CharacteristicEntity.CharacteristicTypeFk;
		}
		return 'charactercolumn' + '_' + item.CharacteristicGroupFk.toString() + '_' + item.CharacteristicTypeFk + '_' + item.CharacteristicFk.toString();		
	}

	/**
	 * Create characteristics column
	 * @param item Dynamic data
	 * @param columnIdorField Column id
	 * @param columnName Column name
	 */
	public createCharactCol(item: IEstCharacteristicDataEntity, columnIdorField: string, columnName: string) {
		// TODO - Need to check formatter is really needed or not
		// const formatterData = this.getFormatter(item);
		const characteristicColumn = this.appendCharacCol(columnIdorField, item);
		// Characteristic column name
		let characteristicColumnName = columnName;

		const characteristicColumnArr: IEstCharacteristicDataEntity = {
			IsCharacteristic: true,
			IsCharacteristicExpired: item.IsReadonly,
			Id: Number(characteristicColumn), // TODO - characteristicColumn should be a number but in the old logic it is string
			Description: characteristicColumnName,
			CharacteristicFk: 0,
			CharacteristicGroupFk: 0,
			CharacteristicSectionFk: 0,
			CharacteristicTypeFk: 1,
			ObjectFk: 0,
			ValueText: null,
			Version: 0,
			CharacteristicEntity: null,
			IsReadonly: false
		};
		
		if (item.CharacteristicSectionFk === 28 || item.CharacteristicSectionFk === 30 || item.CharacteristicSectionFk === 33) {
			characteristicColumnName = item.CharacteristicEntity && (!item.CharacteristicEntity.DescriptionInfo?.Description || item.CharacteristicEntity.DescriptionInfo.Description.trim() === '') ? characteristicColumnName : item.CharacteristicEntity?.DescriptionInfo?.Description || '';
		}

		// TODO - There will be some changes in translateObject according to the new implementaton in TranslateService
		// const properties: string[] = ['domain', 'id', 'editor', 'field', 'name', 'name$tr$', 'formatter', 'editorOptions', 'formatterOptions', 'hidden', 'bulkSupport', 'required', 'grouping', 'sortable', 'isCharacteristic', 'isCharacteristicExpired', 'validator'];
		// const charactCol = this.translateService.translateObject({
		// 	domain: formatterData.formatter,
		// 	id: characteristicColumn,
		// 	editor: formatterData.formatter,
		// 	field: characteristicColumn,
		// 	name: characteristicColumnName,
		// 	name$tr$: undefined,
		// 	formatter: formatterData.formatter,
		// 	editorOptions: formatterData.editorOptions,
		// 	formatterOptions: formatterData.formatterOptions,
		// 	hidden: false,
		// 	bulkSupport: false,
		// 	required: false,
		// 	grouping: {
		// 		title: characteristicColumnName,
		// 		getter: characteristicColumn,
		// 		aggregators: [],
		// 		aggregateCollapsed: true,
		// 	},
		// 	sortable: true,
		// 	isCharacteristic: true,
		// 	isCharacteristicExpired: item.IsReadonly,
		// 	validator: function validator(entity: { [x: string]: unknown; }, value: unknown, model: string) {
		// 		if (item.IsReadonly) {
		// 			entity[model + '__revert'] = entity[model];
		// 		}
		// 		return true;
		// 	},
		// },properties,false);
		
		return characteristicColumnArr;
	}

	/**
	 * Get Formatter for columns
	 * @param item Dynamic data
	 */
	public getFormatter(item: IEstCharacteristicDataEntity) {
		const domain:IEstDomainFormatter = {};

		switch (item.CharacteristicTypeFk) {
			case 10:
				domain.formatter = 'lookup';
				domain.editorOptions = {
					directive: 'basics-characteristic-value-combobox',
				};
				domain.formatterOptions = {
					lookupType: 'CharacteristicValue',
					displayMember: 'DescriptionInfo.Translated',
				};
				break;
			default:	
				// TODO - characteristicType2Domain is not yet defined in BasicsSharedCharacteristicTypeHelperService			
				// domain.formatter = CharacteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
				domain.editorOptions = null;
				domain.formatterOptions = null;
				break;
		}
		return domain;
	}

	/**
	 * true: remove column, false: do not remove
	 * @param selectItem Dynamic item
	 * @param idorField Id of column
	 * @param dataService Dynamic data service
	 */
	public isRemoveColumn<PT>(selectItem: IEstLineItemEntity, idorField: string, dataService: IEntitySelection<PT> & IEntityModification<PT>) {
		const lineItems = dataService.getSelection() || [];
		return !lineItems.some((lineItem) => {
			if ((lineItem as IEstLineItemEntity).Id !== selectItem.Id && (lineItem as IEstLineItemEntity)[idorField as keyof IEstLineItemEntity] !== null && (lineItem as IEstLineItemEntity)[idorField as keyof IEstLineItemEntity]) {
				return true;
			} else {
				return false;
			}
		});
	}

	/**
	 * Synchronize characteristic columns
	 * @param lineItem Lineitem to process
	 * @param characteristicCol Characteristic column to process
	 * @param type Type of characteristic
	 * @param dataService Dynamic data service
	 */
	public syncCharacteristicCol<PT>(lineItem: IEstLineItemEntity, characteristicCol: string, type: string, dataService: IEntitySelection<PT> & IEntityModification<PT>) {
		const lineItemList = dataService.getSelection();
		lineItemList.forEach((item) => {
			if ((item as unknown as IEstLineItemEntity).Id !== lineItem.Id) {
				// TODO Some properties are readonly so it can not directly modify
				// item[characteristicCol] = type === 'boolean' ? false : null;
			}
		});
	}

	/**
	 * Check if it is characteristic column
	 * @param col Check column
	 * @returns True false
	 */
	public isCharacteristicCulumn(col: IEstCharacteristicDataEntity) {
		if (col && col.IsCharacteristic) {
			return true;
		}
		return false;
	}

	/**
	 * Check characteristic column expired
	 * @param col Check column
	 */
	public isCharacteristicColumnExpired(col: IEstCharacteristicDataEntity) {
		return col && col.IsCharacteristicExpired;
	}

	/**
	 * Get characteristic value
	 * @param lineItem Dynamic line item
	 * @param colArray Dynamic column array
	 */
	public getCharacteristicColValue(lineItem: IEstLineItemEntity, colArray: string[]) {
		let itemValue = lineItem;
		colArray.forEach((col) => {
			if (itemValue[col as keyof IEstLineItemEntity]) {				
				const value = (itemValue as unknown as IEstLineItemEntity)[col as keyof IEstLineItemEntity];
				if (value && typeof value === 'object' && 'Id' in value) {
					itemValue = value as unknown as IEstLineItemEntity;
				}
			}
		});

		return itemValue;
	}
}