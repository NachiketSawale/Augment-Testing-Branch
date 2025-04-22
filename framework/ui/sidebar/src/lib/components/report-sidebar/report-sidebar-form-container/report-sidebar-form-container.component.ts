/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';

import { endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns';

import { IReportParameter, IReportParameterValue, PlatformDateService } from '@libs/platform/common';

import { FieldType, FormRow, IFormConfig } from '@libs/ui/common';
import { ISidebarReportAccordionData } from '../../../model/interfaces/report/sidebar-report-accordion-data.interface';



/**
 * Component prepares form configuration for the report parameters and renders the form.
 */
@Component({
	selector: 'ui-sidebar-report-form-container',
	templateUrl: './report-sidebar-form-container.component.html',
	styleUrls: ['./report-sidebar-form-container.component.scss'],
})
export class UiSidebarReportFormContainerComponent implements OnChanges {
	/**
	 * Selected report.
	 */
	@Input() public report!: ISidebarReportAccordionData;

	/**
	 * Form configuration.
	 */
	public formData: IFormConfig<{ [key: string]: IReportParameterValue }> = {
		rows: [],
	};

	/**
	 * Form Default values.
	 */
	public formDataDefValues: {
		[key: string]: IReportParameterValue;
	} = {};

	/**
	 * Service handles date/time data.
	 */
	private readonly platformDateService = inject(PlatformDateService);

	/**
	 * A callback method that is invoked immediately after the default change detector
	 * has checked data-bound properties if at least one has changed,
	 * and before the view and content children are checked.
	 *
	 * @param {SimpleChanges} change Input bound data.
	 */
	public ngOnChanges(change: SimpleChanges): void {
		if (change['report'].currentValue) {
			this.prepareFormData();
		}
	}

	/**
	 * Function prepares the form configuration.
	 */
	private prepareFormData(): void {
		(this.report.parameters as IReportParameter[]).forEach((parameter, index) => {
			if (parameter.context === 0 || parameter.context === 10) {
				const property = 'value' + index;
				switch (parameter.dataType) {
					case 'System.Int32':
						if (parameter.defaultValue) {
							parameter.value = parseInt(parameter.defaultValue);
						}

						if (parameter.values?.length) {
							const itemSource: { id: number; displayName: string }[] = [];
							parameter.values.forEach((val) => {
								itemSource.push({
									id: val.value,
									displayName: val.name,
								});
							});

							this.setFormData(FieldType.Select, property, parameter, itemSource);
						} else {
							this.setFormData(FieldType.Integer, property, parameter);
						}

						this.setValue(property, parameter);

						break;

					case 'System.Decimal':
					case 'System.Double':
					case 'System.Float':
						if (parameter.defaultValue) {
							const offset = parameter.defaultValue.indexOf('(');

							if (offset !== -1) {
								parameter.value = parseInt(parameter.defaultValue.substr(0, offset));
							} else {
								parameter.value = parseInt(parameter.defaultValue);
							}
						}

						this.setFormData(FieldType.Decimal, property, parameter);
						this.setValue(property, parameter);

						break;
					case 'System.String':
						this.setFormData(FieldType.Comment, property, parameter);
						this.setValue(property, parameter);

						break;
					case 'System.Boolean':
						parameter.value = parameter.defaultValue?.indexOf('true') !== -1;
						this.setFormData(FieldType.Boolean, property, parameter);
						this.setValue(property, parameter);

						break;

					case 'System.DateTime': {
						const date=this.platformDateService.getUTC();
						let domain = FieldType.DateUtc;

						switch (parameter.defaultValue) {
							case '@today':
								parameter.value = date;
								break;

							case '@startofyear':
								parameter.value=startOfYear(date);
								break;

							case '@endofyear':
								parameter.value=endOfYear(date);
								break;

							case '@startofmonth':
								parameter.value=startOfMonth(date);
								break;

							case '@endofmonth':
								parameter.value=endOfMonth(date);
								break;

							case '@time':
								domain = FieldType.TimeUtc;
								parameter.value = this.platformDateService.getUTC();
								break;
						}

						this.setFormData(domain, property, parameter);
						this.setValue(property, parameter);
						break;
					}
				}
			}
		});
	}

	/**
	 * Method defines the property for control.
	 *
	 * @param {string} propertyName Control Name
	 * @param {ISidebarReportParameter} parameter Control parameter
	 */
	private setValue(propertyName: string, parameter: IReportParameter): void {
		Object.defineProperty(this.formDataDefValues, propertyName, {
			get: () => {
				return parameter.value;
			},
			set: (val) => {
				parameter.value = val;
			},
		});
	}

	/**
	 * Method defines the form config data.
	 *
	 * @param {FieldType} domain Control type.
	 * @param {string} property model.
	 * @param {ISidebarReportParameter} parameter Control parameter.
	 * @param {{ id: number; displayName: string }[]} itemSource Extra control option.
	 */
	private setFormData(domain: FieldType, property: string, parameter: IReportParameter, itemSource?: { id: number; displayName: string }[]): void {
		this.formData.rows.push({
			type: domain,
			id: parameter.name ?? '',
			label: {
				text: parameter.name ?? '',
			},
			model: property,
		} as FormRow<{ [key: string]: IReportParameterValue }>);

		if (itemSource) {
			this.formData.rows[this.formData.rows.length - 1] = {
				...this.formData.rows[this.formData.rows.length - 1],
				...{
					itemsSource: {
						items: itemSource,
					},
				},
			};
		}
	}
}
