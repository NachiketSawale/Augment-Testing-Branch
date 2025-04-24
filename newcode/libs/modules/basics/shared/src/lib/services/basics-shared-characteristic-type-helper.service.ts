/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from '@libs/ui/common';
import {inject, Injectable} from '@angular/core';
import {
	BasicsCharacteristicType,
	ICharacteristicDataEntity,
	ICharacteristicEntity
} from '@libs/basics/interfaces';
import { isInteger, isString } from 'lodash';
import {PlatformDateService, ServiceLocator} from '@libs/platform/common';
import {
	BasicsCharacteristicSearchService
} from '../characteristic-lookup/services/basics-characteristic-search.service';
import {
	BasicsSharedCharacteristicCharacteristicValueDataService
} from '../characteristic-lookup/services/basics-characteristic-characteristic-value-data.service';
import {Observable} from 'rxjs';
import * as dateExt from 'date-fns-tz';
import { isValid } from 'date-fns';

/**
 * Characteristic Type Helper
 */

@Injectable({
	providedIn: 'root'
})
export class BasicsSharedCharacteristicTypeHelperService {
	private dateService = inject(PlatformDateService);
	private characteristicCharacteristicValueDataService = ServiceLocator.injector.get(BasicsSharedCharacteristicCharacteristicValueDataService);

	public dateList = [
		{Id: '@Today', Description: '@Today'},
		{Id: '@FirstDayOfYear', Description: '@FirstDayOfYear'},
		{Id: '@FirstDayOfMonth', Description: '@FirstDayOfMonth'}
	];

	private valuePlaceholders = [
		{
			id: 3, description: '@FirstDayOfMonth', getValue: () => {
				return dateExt.zonedTimeToUtc(new Date().setDate(1), 'UTC');
			}
		},
		{
			id: 2, description: '@FirstDayOfYear', getValue: () => {
				return dateExt.zonedTimeToUtc(new Date().setMonth(0, 1), 'UTC');
			}
		},
		{
			id: 1, description: '@Today', getValue: () => {
				return dateExt.zonedTimeToUtc(new Date(), 'UTC');
			}
		},
	];

	public characteristicType2FieldType(characteristicType: BasicsCharacteristicType): FieldType {
		switch (characteristicType) {
			case BasicsCharacteristicType.Boolean:
				return FieldType.Boolean;
			case BasicsCharacteristicType.String:
				return FieldType.Description;
			case BasicsCharacteristicType.Integer:
				return FieldType.Integer;
			case BasicsCharacteristicType.Percent:
				return FieldType.Percent;
			case BasicsCharacteristicType.Money:
				return FieldType.Money;
			case BasicsCharacteristicType.Quantity:
				return FieldType.Quantity;
			case BasicsCharacteristicType.Date:
				return FieldType.DateUtc;
			case BasicsCharacteristicType.DateTime:
				return FieldType.DateTimeUtc;
			case BasicsCharacteristicType.Lookup:
				return FieldType.Lookup;
			default:
				return FieldType.Description;
		}
	}

	public convertValue(value: boolean | number | string | null, characteristicType: BasicsCharacteristicType): boolean | number | string | null {
		switch (characteristicType) {
			case BasicsCharacteristicType.Boolean: {
				if (value === true || value === 1) {
					return true;
				}
				const valueString = String(value).toLowerCase();
				return valueString === 'true' || valueString === 'y';
			}
			case BasicsCharacteristicType.String:
				return value;
			case BasicsCharacteristicType.Integer:
				if (isInteger(value)) {
					return value;
				}
				if (value && isString(value)) { // value may be '' or null
					return parseInt(value);
				}
				return null;
			case BasicsCharacteristicType.Percent:
			case BasicsCharacteristicType.Money:
			case BasicsCharacteristicType.Quantity:
				if (value && isString(value)) {
					return parseFloat(value);
				}
				return null;
			case BasicsCharacteristicType.Date:
			case BasicsCharacteristicType.DateTime:
				if (value) {
					return value;
					//return this.dateService.formatUTC(value.toString());
				}
				return null;
			case BasicsCharacteristicType.Lookup:
				if (value && isString(value)) {
					return parseInt(value);
				}
				return value;
			default:
				return value;
		}
	}

	public isLookupType(characteristicTypeFk: number): boolean {
		return characteristicTypeFk === BasicsCharacteristicType.Lookup;
	}

	public isDateOrDateTimeType(characteristicType: BasicsCharacteristicType): boolean {
		return characteristicType === BasicsCharacteristicType.Date || characteristicType === BasicsCharacteristicType.DateTime;
	}

	public getDefaultValue(characteristicDto: ICharacteristicEntity) {
		const placeholder = this.getPlaceHolder(characteristicDto);
		if (placeholder) {
			return this.dateService.formatUTC(placeholder.getValue(),'dd/MM/yyyy');
		} else {
			if (this.isLookupType(characteristicDto.CharacteristicTypeFk)) {
				const defaultItem = this.characteristicCharacteristicValueDataService.getDefaultItem(characteristicDto.Id);
				if (defaultItem) {
					return defaultItem.Id;
				}
			} else {
				return characteristicDto.DefaultValue;
			}
		}
		return null;
	}

	private getPlaceHolder(characteristicDto: ICharacteristicEntity) {
		return this.valuePlaceholders.find(function (e: {
			id: number,
			description: string,
			getValue: () => void
		}) {
			return e.description == characteristicDto.DefaultValue;
		});
	}

	public getDefaultValueAsync(characteristicDto: ICharacteristicEntity):Observable<string | boolean | number | null> {
		return new Observable(observer => {
			const placeholder = this.getPlaceHolder(characteristicDto);
			if (placeholder) {
				observer.next(this.dateService.formatUTC(placeholder.getValue(),'dd/MM/yyyy'));
			} else {
				if (this.isLookupType(characteristicDto.CharacteristicTypeFk)) {
					this.characteristicCharacteristicValueDataService.getDefaultItemAsync(characteristicDto.Id).subscribe(defaultItem => {
						if (defaultItem) {
							observer.next(defaultItem.Id);
						} else {
							observer.next(null);
						}
					});
				} else {
					if(this.isDateOrDateTimeType(characteristicDto.CharacteristicTypeFk)) {
						observer.next(null);
					} else {
						observer.next(characteristicDto.DefaultValue);
					}
				}
			}
			observer.complete();
		});
	}


	public dispatchValue(dataDto: ICharacteristicDataEntity, characteristicTypeId: BasicsCharacteristicType) {
		switch (characteristicTypeId) {
			case BasicsCharacteristicType.Boolean:
				dataDto.ValueBool = dataDto.ValueText as boolean;
				break;
			case BasicsCharacteristicType.Integer:
			case BasicsCharacteristicType.Percent:
			case BasicsCharacteristicType.Money:
			case BasicsCharacteristicType.Quantity:
				dataDto.ValueNumber = dataDto.ValueText as number;
				break;
			case BasicsCharacteristicType.Date:
			case BasicsCharacteristicType.DateTime:
				if (dataDto.ValueText && isValid(dataDto.ValueText)) {
					dataDto.ValueDate = new Date(this.dateService.formatUTC(dataDto.ValueText.toString()));
				}
				break;
			case BasicsCharacteristicType.Lookup:
				dataDto.CharacteristicValueFk = dataDto.ValueText !== 0 ? dataDto.ValueText as number : null;
				break;
		}
	}

	/**
	 * merge Characteristic
	 * @param characteristicData
	 * @param characteristicId
	 */
	public mergeCharacteristic(characteristicData: ICharacteristicDataEntity, characteristicId: number) {
		// get the associated characteristic entity
		ServiceLocator.injector.get(BasicsCharacteristicSearchService).getItemById(characteristicId).subscribe(characteristic => {
				if (characteristic) {
					// update characteristic data
					characteristicData.CharacteristicTypeFk = characteristic.CharacteristicTypeFk;
					characteristicData.Description = characteristic.DescriptionInfo?.Description;
					characteristicData.CharacteristicGroupFk = characteristic.CharacteristicGroupFk;
					characteristicData.IsReadonly = characteristic.IsReadonly;
					// set default value
					characteristicData.ValueText = this.getDefaultValue(characteristic);
				}
			}
		);
	}

	/**
	 * merge Characteristic
	 * @param srcItem
	 * @param data
	 */
	public merge2CharacteristicData(srcItem: ICharacteristicEntity, data: ICharacteristicDataEntity) {
		data.CharacteristicEntity = srcItem;

		data.CharacteristicFk = srcItem.Id;
		data.Description = srcItem.DescriptionInfo?.Translated ?? srcItem.DescriptionInfo?.Description;
		data.CharacteristicGroupFk = srcItem.CharacteristicGroupFk;
		data.CharacteristicTypeFk = srcItem.CharacteristicTypeFk;
		data.IsReadonly = srcItem.IsReadonly;
		data.ValueText = srcItem.DefaultValue;
	}
}