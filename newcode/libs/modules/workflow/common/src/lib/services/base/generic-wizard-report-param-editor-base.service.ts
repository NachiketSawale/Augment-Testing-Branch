/*
 * Copyright(c) RIB Software GmbH
 */


import { createLookup, FieldType, FormRow, IFormConfig } from '@libs/ui/common';
import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { ReportParametersBaseLookupService } from '../lookup/report-parameters-base-lookup.service';
import { GenericWizardReportParameter } from '../../configuration/rfq-bidder/types/generic-wizard-report-parameter-entity.interface';

@Injectable({
	providedIn: 'root'
})
export abstract class GenericWizardReportParamEditorBaseService {
	private editorConfig: FormRow<GenericWizardReportParameter[]>[] = [];
	private readonly injector = inject(Injector);

	/**
	 * "createField" function handles creation of form rows based on report parameter conditions.
	 * @param parameters :- current report parameter.
	 * @param index :- index at which the parameter is present in report list.
	 */
	public createField(parameters: GenericWizardReportParameter, index: number) {
		this.editorConfig.push(this.prepareFormField(parameters, index));
	}

	/**
	 * Function to prepare form row based on data type of current report parameter.
	 * @param parameter
	 * @param index
	 * @returns
	 */
	private prepareFormField(parameter: GenericWizardReportParameter, index: number): FormRow<GenericWizardReportParameter[]> {
		
		switch (parameter.dataType) {
			case 'System.Int32': {

				if(parameter.defaultValue) {
					parameter.value = parseInt(parameter.defaultValue as string);
				}

				let formRow: FormRow<GenericWizardReportParameter[]> = {
					type: FieldType.Description,
					id: `row_${parameter.name ?? +index}`,
					label: parameter.name ?? '',
					model: `[${index}].value`
				};
				if(parameter.values && parameter.values.length > 0) {
					const dataService = runInInjectionContext(this.injector, () => {
						return new ReportParametersBaseLookupService(parameter.values);
					});
					formRow = {
						...formRow,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataService: dataService,
							showClearButton: true,
						})
					};
				}
				return formRow;
			}
			case 'System.Boolean': {
				if(parameter.defaultValue !== null){
					parameter.value = parameter.defaultValue;
				}
				
				return {
					type: FieldType.Boolean,
					id: `row_${parameter.name ?? +index}`,
					label: parameter.name ?? '',
					readonly: false,
					model: `[${index}].value`,
				};
			}
			case 'System.DateTime':
				return {
					type: FieldType.DateTime,
					id: `row_${parameter.name ?? +index}`,
					label: parameter.name ?? '',
					readonly: false,
					model: `[${index}].value`,
				};

			default: {
				if (parameter.defaultValue !== null) {
					parameter.value = parameter.defaultValue;
				}
				
				return {
					type: FieldType.Description,
					id: `row_${parameter.name ?? +index}`,
					label: parameter.name ?? '',
					readonly: false,
					model: `[${index}].value`,
				};
			}
		}

	}

	/**
	 * "getFormConfig" function is bind to formConfig.
	 * @returns form configuration.
	 */
	public getFormConfig(): IFormConfig<GenericWizardReportParameter[]> {
		return {
			formId: 'rfq-bidder-report-dynamic-form',
			rows: this.getRows()
		};
	}

	protected getRows(): FormRow<GenericWizardReportParameter[]>[] {
		return this.editorConfig;
	}

}