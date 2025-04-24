import { inject, Injector } from '@angular/core';
import { DomainControlInfoService, FieldType, IColumnFormatterOptions, ColumnDef, GridApiService, IAdditionalLookupOptions, IGridApi, LookupFormatterService, IAdditionalSelectOptions } from '@libs/ui/common';
import { IIdentificationData, isReadOnlyPropertyAccessor, PlatformConfigurationService, PropertyIdentifier } from '@libs/platform/common';
import { ISlickColumn } from '../models/slick-grid/slick-column.interface';
import { escape, get, isFunction, isNil, isNumber, isString, padStart, repeat } from 'lodash';
import * as date from 'date-fns';
import * as dateExt from 'date-fns-tz';
import * as IBAN from 'iban';
import { IReadOnlyEntityRuntimeDataRegistry, IFieldValidationResult } from '@libs/platform/data-access';

/***
 * Service for retrieving the formatter required by a specific domain while rendering the grid
 */
export class GridFormatterService<T extends object> {
	/**
	 * Initializes a new instance.
	 */
	public constructor() {
	}

	private entityRuntimeDataRegistry?: IReadOnlyEntityRuntimeDataRegistry<T>;
	private domainCtrlService = inject(DomainControlInfoService);
	private configurationService = inject(PlatformConfigurationService);
	private currentUILanguage = this.configurationService.savedOrDefaultUiLanguage;
	private gridApiService = inject(GridApiService);
	private injector = inject(Injector);
	private readonly lookupFormatter = inject(LookupFormatterService);

	public set entityRuntimeData(value: IReadOnlyEntityRuntimeDataRegistry<T> | undefined) {
		this.entityRuntimeDataRegistry = value;
	}

	/**
	 * @ngdoc function
	 * @name applyAsyncFormatterMarkup
	 * @function
	 * @methodOf platformGridDomainService
	 * @description applies markup of async formatter call when cell is not editable (editor is opened)
	 * @param uniqueId {string} unique id of grid cell
	 * @param markup {string} html markup
	 * @param isSanitized {boolean} markup string is already sanitized
	 */
	private applyAsyncFormatterMarkup(uniqueId: number, markup: string, isSanitized: boolean) {
		const node = $('#' + uniqueId);

		if (!node.hasClass('editable')) {
			// Todo: implement sanitize
			// const markupSanitized = isSanitized ? markup : platformUtilService.getSanitized(markup);
			const markupSanitized = markup;
			node.html(markupSanitized);
		}
	}

	private formatCommonMarkupAdditions(dataContext: T, columnDef: ISlickColumn, formatterMarkup: string) {
		if (this.entityRuntimeDataRegistry) {
			const validationResults: IFieldValidationResult<T>[] = this.entityRuntimeDataRegistry.getValidationErrors(dataContext);
			const error = validationResults.filter((res) => res.field === columnDef.field);

			if (error && error.length > 0) {
				return '<div class="invalid-cell" title="' + error[0].result.error + '">' + formatterMarkup + '</div>';
			}
		}

		if (columnDef.required && (!formatterMarkup || !formatterMarkup.length)) {
			return '<div class="required-cell">' + formatterMarkup + '</div>';
		}
		return formatterMarkup;
	}

	private parseValueToDomainType(fieldType: FieldType, value?: object | null | string) {
		let returnValue;
		if (isString(value)) {
			switch (fieldType) {
				case FieldType.Boolean:
					returnValue = !!(value as string);
					return returnValue;
				case FieldType.Money:
				case FieldType.Decimal:
				case FieldType.ImperialFt:
				case FieldType.DurationSec:
				case FieldType.Quantity:
					returnValue = Number(value);
					return returnValue;
				default:
					return value;
			}
		} else {
			return value;
		}
	}

	private isReadOnly(dataContext: T, columnDef: ISlickColumn) {
		if(columnDef.readonly) {
			return true;
		}

		if (this.entityRuntimeDataRegistry) {
			if (this.entityRuntimeDataRegistry.isEntityReadOnly(dataContext)) {
				return true;
			}

			const roRecord = this.entityRuntimeDataRegistry.getEntityReadOnlyFields(dataContext).find((ro) => ro.field === columnDef.field);
			if (roRecord) {
				return true;
			}
		}

		return false;
	}

	private formatterValue(dataContext: T, field: PropertyIdentifier<T>, options?: IColumnFormatterOptions, internalField?: string, value?: object) {
		if (dataContext) {
			if (options) {
				if (options.field) {
					field = options.field;
				} else {
					if (options.displayMember) {
						field = field + '.' + options.displayMember;
					}
				}
			}

			if (internalField) {
				field = field + '.' + internalField;
			}

			if (isReadOnlyPropertyAccessor(field)) {
				return field.getValue(dataContext);
			}

			return get(dataContext, field as string);
		} else {
			return value;
		}
	}

	public getFormatter(fieldType: FieldType, gridId: string) {
		const domainInfo = this.domainCtrlService.getComponentInfoByFieldType(fieldType);
		let template: string;
		switch (fieldType) {
			case FieldType.Translation:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					let stringValue = this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions)?.Translated;

					if (plainText) {
						stringValue = escape(stringValue?.toString()).replace('&amp;', '&');
					} else {
						stringValue = this.formatCommonMarkupAdditions(dataContext, columnDef, escape(escape(stringValue?.toString())));
					}

					return stringValue;
				};
			case FieldType.Code:
			case FieldType.Description:
			case FieldType.Text:
			case FieldType.Comment:
			case FieldType.Remark:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					let stringValue = this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions);

					if (plainText) {
						stringValue = escape(stringValue?.toString()).replace('&amp;', '&');
					} else {
						stringValue = this.formatCommonMarkupAdditions(dataContext, columnDef, escape(escape(stringValue?.toString())));
					}

					return stringValue;
				};
			case FieldType.Radio:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					const boolValue = this.parseValueToDomainType(fieldType, this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions));
					const ctrlName = gridId + '_' + columnDef.field;

					if (!plainText) {
						const isReadonly = this.isReadOnly(dataContext, columnDef);
						if (isReadonly) {
							template = '<input name="' + ctrlName + '" type="radio" disabled="disabled"' + (boolValue ? ' checked="checked"' : '') + '>';
						} else {
							template = '<input name="' + ctrlName + '" type="radio"' + (boolValue ? ' checked="checked"' : '') + '>';
						}
						return this.formatCommonMarkupAdditions(dataContext, columnDef, template);
					}
					return `${boolValue?.toString()}`;
				};
			case FieldType.Email:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					let emailValue = this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions);

					if (!plainText) {
						emailValue = escape(emailValue?.toString());
						if (emailValue && emailValue.length) {
							emailValue = '<a href="mailto:' + emailValue + '"><i class="block-image slick ' + domainInfo.attributes?.image + '" title="mailto:' + emailValue + '"></i></a><span class="pane-r slick">' + emailValue + '</span>';
						}
						emailValue = this.formatCommonMarkupAdditions(dataContext, columnDef, emailValue);
					}

					return emailValue;
				};
			case FieldType.Decimal:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					let decimalValue = this.parseValueToDomainType(fieldType, this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions));

					if (decimalValue) {
						let precision = get(columnDef, 'formatterOptions.decimalPlaces', get(columnDef, 'editorOptions.decimalPlaces', 2));

						if (isFunction(precision)) {
							precision = precision(columnDef, columnDef.field);
						}

						decimalValue = (decimalValue as number).toPrecision(precision);

						template = (decimalValue as unknown as number).toLocaleString(this.currentUILanguage);
						return plainText ? decimalValue : this.formatCommonMarkupAdditions(dataContext, columnDef, template);
					}

					/*if (options && options.filter) {
						return value;
					}*/

					return '';
				};

			case FieldType.Password:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T) => {
					let stringValue = this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions);
					if (typeof stringValue === 'string') {
						stringValue = repeat('*', stringValue.length);
					}

					return stringValue;
				};

			case FieldType.Url:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					const urlValue = this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions);
					let reg;
					if (urlValue) {
						if (['http', 'https', 'ftp', 'ftps', 'file', 'www.'].some((word) => (urlValue as string).startsWith(word))) {
							if ((urlValue as string).startsWith('www.')) {
								reg = new RegExp('(^|s)((https?://)?[w-]+(.[w-]+)+.?(:d+)?(/S*)?)');
							} else {
								reg = new RegExp('^((http[s]?|ftp[s]?|file):\\/)?\\/?((\\/\\w+)*\\/)([\\w\\-\\.]+[^#?\\s]+)(.*)?(#[\\w\\-]+)?$', 'i');
							}
						} else {
							if ((urlValue as string).startsWith('\\')) {
								reg = new RegExp('((w+)*)([w]+[^#?s]+)(.*)?(#[w]+)?');
							} else {
								if ((urlValue as string).length < 50) {
									reg = new RegExp('^[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$');
								}
							}
						}

						if (!plainText) {
							if (urlValue && (urlValue as string).length && (reg && reg.test(urlValue as string))) {
								let hrefValue = urlValue;
								if (!(['http', 'https', 'ftp', 'ftps', 'file'].some((word) => (urlValue as string).startsWith(word)) || (urlValue as string).startsWith('\\'))) {
									hrefValue = 'https://' + urlValue;
								}
								template = '<a href="' + hrefValue + '" target="_blank" rel="noopener noreferrer" placeholder="Enter a valid URL"><i class="block-image slick ' + domainInfo.attributes?.image + '"></i></a><span class="pane-r slick">' + urlValue + '</span>';
							}
							return this.formatCommonMarkupAdditions(dataContext, columnDef, template);
						}
					}
					return urlValue;
				};
			case FieldType.DateTime:
			case FieldType.DateTimeUtc:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number, options?: IColumnFormatterOptions) => {
					const utc = fieldType === FieldType.DateTimeUtc;

					let dateTimeValue = this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions, undefined, value);
					if (isString(dateTimeValue)) {
						if (options && options.filter) {

							return (columnDef.formatterOptions && columnDef.formatterOptions.showWeekday) ? date.format(date.parseISO(dateTimeValue as string), 'EEEE') : date.parseISO(dateTimeValue as string);
						}
						dateTimeValue = utc ? dateExt.zonedTimeToUtc(dateTimeValue as string, 'UTC') : date.format(date.parseISO(dateTimeValue as string), 'Pp');
					} else if (date.isDate(dateTimeValue)) {
						const dateTimeObj: Date = dateTimeValue as Date;
						return utc ? dateExt.zonedTimeToUtc(dateTimeObj, 'UTC') : date.format(dateTimeObj, 'Pp');
					}

					if (!plainText) {
						return this.formatCommonMarkupAdditions(dataContext, columnDef, dateTimeValue);
					}

					return dateTimeValue;

				};
			case FieldType.Date:
			case FieldType.DateUtc:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number, options?: IColumnFormatterOptions) => {
					const utc = fieldType === FieldType.DateUtc;

					let dateValue = this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions, undefined, value);
					if (isString(dateValue)) {
						if (options && options.filter) {
							return utc ? dateExt.zonedTimeToUtc(dateValue as string, 'UTC') : date.parseISO(dateValue as string);
						}
						dateValue = utc ? dateExt.zonedTimeToUtc(dateValue as string, 'UTC') : date.format(date.parseISO(dateValue as string), 'P');
					} else if (date.isDate(dateValue)) {
						const dateObj: Date = dateValue as Date;
						return options && options.filter ? dateObj : utc ? dateExt.zonedTimeToUtc(dateObj, 'UTC') : date.format(dateObj, 'P');
					}

					if (!plainText) {
						return this.formatCommonMarkupAdditions(dataContext, columnDef, dateValue);
					}

					return dateValue;

				};
			case FieldType.Time:
			case FieldType.TimeUtc:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					const utc = fieldType === FieldType.TimeUtc;

					let timeValue = this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions, undefined, value);
					if (isString(timeValue)) {
						timeValue = utc ? dateExt.zonedTimeToUtc(timeValue as string, 'UTC').toString() : date.format(date.parseISO(timeValue as string), 'p');
					} else if (date.isDate(timeValue)) {
						const timeObj: Date = timeValue as Date;
						timeValue = utc ? dateExt.zonedTimeToUtc(timeObj, 'UTC').toString() : date.format(timeObj, 'p');
					}

					if (!plainText) {
						return this.formatCommonMarkupAdditions(dataContext, columnDef, timeValue);
					}

					return timeValue;
				};
			case FieldType.Image:
				return (row: number, cell: number, value: string | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number, options?: IColumnFormatterOptions) => {
					if (value){
						template = `<div class="${value}"></div>`;
					}
					return this.formatCommonMarkupAdditions(dataContext, columnDef, template);
				};
			case FieldType.ImperialFt:
				return;
			case FieldType.Money:
			case FieldType.Integer:
			case FieldType.Quantity:
			case FieldType.Factor:
			case FieldType.Percent:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					const numValue = this.parseValueToDomainType(fieldType, this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions));

					template = '<div class="text-right">' + numValue?.toLocaleString(this.currentUILanguage) + '</div>';

					return this.formatCommonMarkupAdditions(dataContext, columnDef, template);
				};
				break;
			case FieldType.Iban:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					let ibanValue = this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions, undefined, value) || '';
					ibanValue = IBAN.printFormat(ibanValue as string);

					if (!plainText) {
						ibanValue = this.formatCommonMarkupAdditions(dataContext, columnDef, ibanValue);
					}

					return ibanValue;
				};
			case FieldType.Boolean:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					const boolValue = this.parseValueToDomainType(fieldType, this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions));

					if (!plainText) {
						const isReadonly = this.isReadOnly(dataContext, columnDef);
						if (isReadonly) {
							template = '<input type="checkbox" onclick="return false" disabled="disabled"' + (boolValue ? ' checked="checked"' : '') + '>';
						} else {
							template = '<input type="checkbox"' + (boolValue ? ' checked="checked"' : '') + '>';
						}
						return this.formatCommonMarkupAdditions(dataContext, columnDef, template);
					}
					return `${boolValue?.toString()}`;
				};

			case FieldType.Color:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					let colorValue = this.formatterValue(dataContext, columnDef.field!, columnDef.formatterOptions);

					if (colorValue) {
						colorValue = padStart((colorValue as unknown as number).toString(16), 7, '#000000');
						const showHashCode = get(columnDef, 'formatterOptions.showHashCode', true);

						if (!plainText) {
							const template = '<button type="button" class="btn btn-default btn-colorpicker" style="background-color:' + colorValue + '"></button>' + (showHashCode ? '<label class="color-picker">' + colorValue.toString().toUpperCase() + '</label>' : '');
							colorValue = this.formatCommonMarkupAdditions(dataContext, columnDef, template);
						}
					}

					return colorValue;
				};

			case FieldType.Lookup:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					if (!columnDef.type) {
						return;
					}

					// set default value as empty string to avoid show null or undefined in the grid cell
					let result = '';

					if (!isNil(value)) {
						const grid: IGridApi<T> = this.gridApiService.get<T>(gridId);

						if (grid) {
							const columns = grid.columns;
							const column: ColumnDef<T> | undefined = columns.find((col) => col.id === columnDef.id);

							if (column) {
								const lookupOptions = (column as IAdditionalLookupOptions<T>).lookupOptions;
								if (lookupOptions) {
									const typedOptions = lookupOptions.getTypedOptions();
									let dataService = typedOptions.dataService;

									if (!dataService && typedOptions.dataServiceToken) {
										dataService = this.injector.get(typedOptions.dataServiceToken);
									}

									if (dataService) {
										const lookupConfig = {
											...dataService.config,
											...typedOptions
										};

										const lookupContext = {
											entity: dataContext,
											indexInSet: 0,
											totalCount: 1,
											injector: this.injector,
											lookupConfig: lookupConfig,
											inGridFormatter: true
										};

										// For foreign key referencing composite primary key, it is possible to pass identification data object directly via valueProcessor option.
										const key = value as unknown as (number | string | IIdentificationData);

										this.lookupFormatter.getFormattedTextByKey(key, dataService, lookupContext).subscribe(display => {
											this.applyAsyncFormatterMarkup(uniqueId, display.toString(), true);
											result = display as string;
											return result;
										});
									}
								}
							}
						}
					}

					return result;
				};
			case FieldType.ImageSelect:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number, options?: IColumnFormatterOptions) => {
					const grid: IGridApi<T> = this.gridApiService.get<T>(gridId);
					let formatterResult = '';
					if (grid) {
						const columns = grid.columns;
						const column: ColumnDef<T> | undefined = columns.find((col) => col.id === columnDef.id);
						if (column) {
							const imageItems = (column as IAdditionalSelectOptions<number>).itemsSource.items;
							const val = isNumber(value) ? value : null;
							const imageItem = imageItems.find(e => e.id === val);
							if (imageItem) {
								formatterResult = `<i class="block-image ${imageItem.iconCSS}"></i><span class="pane-r">${imageItem.displayName}</span>`;
							}
						}
					}
					return formatterResult;
				};
			default:
				return (row: number, cell: number, value: object | undefined, columnDef: ISlickColumn, dataContext: T, plainText: boolean, uniqueId: number) => {
					return '<div>' + `${value?.toString()}` + '</div>';
				};
		}
	}
}