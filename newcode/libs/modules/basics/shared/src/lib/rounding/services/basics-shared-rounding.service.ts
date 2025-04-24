/*
 * Copyright(c) RIB Software GmbH
 */
import { inject } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { BasicsSharedRoundingConstants } from '../model/basics-shared-rounding-constants';
import { HttpClient } from '@angular/common/http';
import { extend, forEach, isEmpty, keys } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { BasicsSharedDigitsAfterDecimalRounding } from './basics-shared-digits-after-decimal-rounding.service';
import { ConcreteField, ConcreteFieldOverload, FieldType, IGridConfiguration, ILayoutConfiguration, INumericField } from '@libs/ui/common';
import { IConfigDetail, IExtraGridRoundConfig, IRoundConfigResponse } from '../model/interfaces/round-config.interface';
import { BasicsSharedDecimalPlacesEnum } from '../../interfaces/basics-shared-decimal-places.enum';
import { RoundingColumnDef, RoundingFieldOverloadSpec, RoundingTransientFieldSpec } from '../model/rounding-field-extensions.type';

export class BasicsSharedRoundingService<ConfigDetail extends IConfigDetail> {
	protected defaultRoundDecimalPlaces: number = BasicsSharedDecimalPlacesEnum.decimalPlaces2;
	private readonly http = inject(HttpClient);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly digitsAfterDecimalRounding = inject(BasicsSharedDigitsAfterDecimalRounding);
	private readonly loadConfigUrl = this.configurationService.webApiBaseUrl + 'basics/common/rounding/getconfig';
	private readonly roundingMethod = BasicsSharedRoundingConstants.roundingMethod;
	private readonly roundTo = BasicsSharedRoundingConstants.roundTo;

	private hasLoadedOrLoading: boolean = false;

	//This field first fetches the data and then transforms it when referenced to the respective module
	public constructor(private moduleName: string, private configId?: number) {
	}

	/**Example:Used for prcitem  ==> this.roundingService.fieldsRoundType as Partial<Record<(keyof (IPrcCommonItemEntity & noRoundingType)), number>>;
	 * test data
	 * roundingType: {
	 * 			AlternativeQuantity: 1,
	 * 			BudgetPerUnit: 2,
	 * 			BudgetTotal: 3,
	 * 			Charges: 2,
	 * 			ContractGrandQuantity: 1,
	 * 			Cost: 3,
	 * 			CostPerUnit: 2
	 * 		}
	 */
	private _fieldsRoundType: Record<string, number> = {};

	/**
	 * This data comes from an enumeration value in RoundingConstants.ColumnsIds(from this.moduleName Example:Basics.Material) in the background
	 * If it's a new module, you need to configure it in the background
	 */
	public get fieldsRoundType() {
		return this._fieldsRoundType;
	}

	/** test date
	 * 		basRoundingType: {
	 * 			Quantity: 1,
	 * 			UnitRate: 2,
	 * 			Amounts: 3
	 * 		}
	 */
	private _basRoundType: Record<string, number> = {};

	/**
	 * This data is basic and comes from the enumeration value of  (Basics.Common)RoundingConstants.RoundingColumnIds
	 */
	public get basRoundType() {
		return this._basRoundType;
	}

	/** test date
	 * 		configDetail: [
	 * 			{
	 * 				ColumnId: 1,
	 * 				Id: 1000018,
	 * 				IsWithoutRounding: false,
	 * 				RoundTo: 3,
	 * 				RoundToFk: 2,
	 * 				RoundingMethodFk: 1,
	 * 				Sorting: 1,
	 * 				UiDisplayTo: 3
	 * 			}]
	 */
	private _roundingConfigDetails: ConfigDetail[] = [];

	/**
	 * Get the corresponding decimalPlaces for all fields in the explicit module
	 */
	public get roundingConfigDetails() {
		return this._roundingConfigDetails;
	}

	/**
	 * Set the default DecimalPlaces Example:value=6 from estimate
	 * @param value
	 */
	public setDefaultDecimalPlaces(value: number) {
		this.defaultRoundDecimalPlaces = value;
	}

	/**
	 * Load rounding configuration information
	 */
	public async loadRounding() {
		if (!this.hasLoadedOrLoading) {
			try {
				const details = this.getRoundingConfigDetails();
				if (isEmpty(details)) {
					this.hasLoadedOrLoading = true;
					const response = await firstValueFrom(this.http.post(this.loadConfigUrl, {ModuleName: this.moduleName, ConfigId: this.configId}));
					if (response) {
						const data = response as IRoundConfigResponse<ConfigDetail>;
						this._roundingConfigDetails = data.configDetail;
						this._fieldsRoundType = data.roundingType;
						this._basRoundType = data.basRoundingType;
					} else {
						console.error('Error: Invalid response data');
						this.hasLoadedOrLoading = false;
					}
				}
			} catch (error) {
				console.error('Error:', error);
				this.hasLoadedOrLoading = false;
			}
		}
	}


	/**
	 * Perform rounding operation
	 * @param roundingField - Rounding field
	 * @param beforeRoundingValue - value before rounding
	 */
	public doRounding(roundingField: number, beforeRoundingValue: number) {
		if (beforeRoundingValue === 0) {
			return beforeRoundingValue;
		}
		const configItem = this.getConfigItem(roundingField);
		if (configItem) {
			return this.doRound(beforeRoundingValue, roundingField, configItem);
		}
		return beforeRoundingValue;
	}

	/**
	 * UI rounding configuration
	 * @param layout - Layout configuration
	 * @param excludedFields - Excluded fields
	 * @param additionalLayout - Special layout configuration -Because unique modules only have the function, later to do
	 */
	public uiRoundingConfig<T extends object>(layout: ILayoutConfiguration<T>, excludedFields?: (keyof T)[], additionalLayout?: ILayoutConfiguration<T>) {
		const providedFieldsKeys = this.getRelatedFields(layout);
		const roundingFieldsKeys = keys(this.fieldsRoundType);
		const excludeFieldsKeys = keys(excludedFields ?? []);
		const needRoundingFields = providedFieldsKeys.filter((providedField) => roundingFieldsKeys.includes(providedField as string) && !excludeFieldsKeys.includes(providedField as string));

		const transientFields: (RoundingTransientFieldSpec<T> & ConcreteField<T>)[] | undefined = layout.transientFields as (RoundingTransientFieldSpec<T> & ConcreteField<T>)[];
		layout.overloads = layout.overloads || <{ [key in keyof Partial<T>]: ConcreteFieldOverload<T> }>{};

		for (const field of needRoundingFields) {
			const overload = layout.overloads[field as keyof T] as RoundingFieldOverloadSpec<T>;
			const transientField = transientFields?.find((transientField) => transientField.model === field);

			// Handle overload case
			if (overload?.roundingField) {
				extend(overload, {
					formatterOptions: {
						decimalPlaces: this.getRoundingDigits<T>(overload, field),
					},
				});
				continue;
			}

			// Handle transient field case
			if (transientField) {
				extend(transientField, {
					formatterOptions: {
						decimalPlaces: this.getRoundingDigits<T>(transientField, field),
					},
				});
				continue;
			} else {
				layout.overloads[field as keyof T] = {
					formatterOptions: { decimalPlaces: this.getRoundingDigits<T>(undefined, field) },
				};
			}
		}
	}

	/**  Original name=>gridRoundingConfig
	 * Used to get, for example, extraStr(_New) and decimalPlaces for the original column ==>for example(basics.material)
	 * @param options IExtraGridRoundConfig options
	 */
	public extraUiRoundingConfig<T extends object>(options: IExtraGridRoundConfig<T>) {
		const columns = options.columns;
		const extraStr = options.extraStr;
		const providedFieldsKeys = this.getRelatedFields(options);
		let roundingFieldsKeys = keys(this.fieldsRoundType);
		if (extraStr) {
			roundingFieldsKeys = roundingFieldsKeys.flatMap(item => [item, item + extraStr]);
		}
		const needRoundingFields = providedFieldsKeys.filter(providedField => roundingFieldsKeys.includes(providedField as string));

		if (columns) {
			const allFieldRoundType = this.fieldsRoundType;
			forEach(needRoundingFields, (field) => {
				const a_column = columns?.find(column => (column as INumericField<T>).model as string === field) as RoundingColumnDef<T>;
				if (a_column) {
					const roundingField = a_column.roundingField || field as string;
					let fieldRoundType = allFieldRoundType[roundingField];
					if (!fieldRoundType && extraStr) {
						const originalRoundingField = roundingField.replace(extraStr, '');
						fieldRoundType = allFieldRoundType[originalRoundingField];
					}
					if (fieldRoundType) {
						const decimalPlaces = this.getUiRoundingDigits(fieldRoundType);
						extend(a_column, {
							type: FieldType.Decimal,
							formatterOptions: {decimalPlaces: decimalPlaces}
						});
					}
				}
			});
		}
	}

	/**
	 * Look up rounding configuration
	 * @param lookupOptions - Lookup configuration options
	 */
	public lookUpRoundingConfig<T extends object>(lookupOptions: IGridConfiguration<T>) {
		const providedFieldsKeys = this.getRelatedFields(lookupOptions);
		const roundingFieldsKeys = keys(this.fieldsRoundType);
		const needRoundingFields = providedFieldsKeys.filter(providedField => roundingFieldsKeys.includes(providedField as string));

		if (lookupOptions.columns) {
			forEach(needRoundingFields, (field) => {
				const columnRounding = lookupOptions.columns?.find(column => (column as INumericField<T>).model as string === field) as RoundingColumnDef<T>;
				if (columnRounding) {
					columnRounding.formatterOptions = {decimalPlaces: this.getRoundingDigits<T>(columnRounding, field as string)};
				}
			});
		}
	}

	/**
	 * Get the decimal places for a field
	 * @param field - Field name
	 */
	public getDecimalPlaces(field: string) {
		const fieldsRoundType = this.fieldsRoundType;
		return fieldsRoundType ? this.getUiRoundingDigits(fieldsRoundType[field] as number) : this.defaultRoundDecimalPlaces;
	}

	/**
	 * Get decimal places by column ID
	 * @param columnId - Column ID
	 */
	public getDecimalPlacesByColumnId(columnId: number) {
		const decimalPlace = this.getUiRoundingDigits(columnId);
		return decimalPlace ? decimalPlace : this.defaultRoundDecimalPlaces;
	}

	private isILayoutConfiguration = <T extends object>(options: ILayoutConfiguration<T> | IGridConfiguration<T>): options is  ILayoutConfiguration<T> =>
		(options as ILayoutConfiguration<T>).groups !== undefined;

	private isIGridConfiguration = <T extends object>(options: ILayoutConfiguration<T> | IGridConfiguration<T>): options is  IGridConfiguration<T> =>
		(options as IGridConfiguration<T>).columns !== undefined;

	private getRoundingConfigDetails() {
		return this.roundingConfigDetails;
	}

	private getConfigItem(roundingField: number) {
		let configItem: ConfigDetail | undefined;
		const roundingConfigDetail = this.getRoundingConfigDetails();
		if (roundingConfigDetail) {
			configItem = roundingConfigDetail.find(item => item.ColumnId === roundingField);
		}
		return configItem;
	}

	private getUiRoundingDigits(roundingField: number) {
		const configItem = this.getConfigItem(roundingField);
		return configItem?.UiDisplayTo;
	}

	private doRound(beforeRoundingValue: number, roundingField: number, roundingConfigItem: IConfigDetail) {
		let afterRoundingValue = beforeRoundingValue;
		// Todo: The algorithm provided by boq.main from Germany
		// Todo: I'm still doing some research in this type of setting for the classic Math.Round doesn't seem to have a parameter of its own to configure this behavior
		switch (roundingConfigItem.RoundToFk) {
			// Todo: Use first mode as fallback
			case this.roundTo.digitsAfterDecimalPoint: {
				switch (roundingConfigItem.RoundingMethodFk) {
					case this.roundingMethod.standard: {
						afterRoundingValue = this.digitsAfterDecimalRounding.round(beforeRoundingValue, roundingConfigItem.RoundTo);
					}
						break;
					case this.roundingMethod.roundUp: {
						afterRoundingValue = this.digitsAfterDecimalRounding.ceil(beforeRoundingValue, roundingConfigItem.RoundTo);
					}
						break;
					case this.roundingMethod.roundDown: {
						afterRoundingValue = this.digitsAfterDecimalRounding.floor(beforeRoundingValue, roundingConfigItem.RoundTo);
					}
						break;
				}
			}
		}

		return afterRoundingValue;
	}

	private getRoundingDigits<T extends object>(options: RoundingFieldOverloadSpec<T> | RoundingTransientFieldSpec<T> | undefined, field: string | keyof T) {
		const roundingField = (options && options.roundingField) ? options.roundingField : field;
		return this.getUiRoundingDigits(this.fieldsRoundType[roundingField as string]);
	}

	private getRelatedFields<T extends object>(options: ILayoutConfiguration<T> | IGridConfiguration<T>) {
		let providedFields: (string | keyof T)[] = [];

		if (this.isILayoutConfiguration(options)) {
			providedFields = options.groups?.flatMap(g => g.attributes || []) || [];
			const transient = options.transientFields as ConcreteField<T>[];
			if (transient) {
				const fields = transient.map(e => e.model as string) || [];
				providedFields.push(...fields);
			}
		}

		if (this.isIGridConfiguration(options)) {
			const fields = options.columns?.map(column => (column as ConcreteField<T>).model as string) || [];
			providedFields.push(...fields);
		}

		return [...new Set(providedFields)];
	}
}