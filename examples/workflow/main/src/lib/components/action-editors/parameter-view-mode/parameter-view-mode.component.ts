/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, InjectionToken, OnInit, inject } from '@angular/core';
import { FieldType, FormRow, IAdditionalSelectOptions, IControlContext, IFormConfig } from '@libs/ui/common';
import { ParameterView } from '../../../model/types/parameter-view-mode.type';
import { ParameterViewType } from '../../../model/enum/workflow-parameter-view.enum';
import { StandardViewFieldType } from '../../../model/enum/action-editors/standard-view-field-type.enum';
import { IBaseColumn } from '../standard-view-components/parameter-grid-view/parameter-grid-view.component';
import { ITranslated } from '@libs/platform/common';

/**
 * Holds the configuration value for custom editor view
 * //TODO: make types generic and strongly typed
 */
export const EDITOR_ITEM_CONFIGURATION_INJECTION_TOKEN = new InjectionToken<ParameterView<object, IBaseColumn>[]>('editor-item-configuration');

/**
 * Component that will be used to render standard/expert views in action editor.
 */
@Component({
	selector: 'workflow-main-parameter-view-mode',
	templateUrl: './parameter-view-mode.component.html',
	styleUrl: './parameter-view-mode.component.scss'
})
export class ParameterViewModeComponent implements OnInit {

	public readonly parameterViewType = ParameterViewType;
	public readonly standardViewFieldTypes = StandardViewFieldType;
	public readonly fieldType = FieldType;

	/**
	 * View configuration that is used to render standard editor.
	 */
	public readonly editorViewConfigs: ParameterView<object, IBaseColumn>[] = inject(EDITOR_ITEM_CONFIGURATION_INJECTION_TOKEN);

	/**
	 * Item source for the radio button group domain control.
	 */
	public radioItemSource: IAdditionalSelectOptions = {
		itemsSource:{
			items:
			[
				{ id: ParameterViewType.Standard, displayName: { key: 'basics.workflow.modalDialogs.defaultRadio' } },
				{ id: ParameterViewType.Expert, displayName: { key: 'basics.workflow.modalDialogs.expertRadio' } }
			]
		}
	};

	/**
	 * Context for the radio button group domain control. The field id of the domain control will be updated once the component has been initialized to have unique field ids for different radio groups.
	 */
	public controlContext: IControlContext = {
		fieldId: '',
		readonly: false,
		validationResults: [],
		entityContext: { totalCount: 0 },
		value: ParameterViewType.Standard
	};

	/**
	 * Indicates that the component has initialized.
	 */
	public isInitialized: boolean = false;

	public ngOnInit(): void {
		this.controlContext = {
			...this.controlContext,
			fieldId: `view-radio-control-${(this.editorViewConfigs[0].expertViewFormConfig.rows[0].label as ITranslated).key ?? (this.editorViewConfigs[0].expertViewFormConfig.rows[0].label as ITranslated).text}`,
		};
		this.isInitialized = true;
	}

	public getStandardViewFormConfig(row: FormRow<object>): IFormConfig<object> {
		return {
			formId: row.id,
			rows: [row]
		};
	}

}