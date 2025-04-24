/*
 * Copyright(c) RIB Software GmbH
 */

import { IActionParam, IWorkflowAction } from '@libs/workflow/interfaces';
import { findIndex } from 'lodash';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { ChangeStatusActionEditorParams } from '../../enum/actions/change-status-editor-params.enum';
import { CreateQuotesFromRfqActionParamsEnum } from '../../enum/actions/create-quotes-from-rfq-action-editor.params.enum';

/**
 * Helper class for common action editors.
 */
export class ActionEditorHelper {

	/**
	 * Used to get the required action parameter object from input/output array.
	 * @param workflowAction The current selected workflow action.
	 * @param key Key used to identify action parameter object.
	 * @param type Specifies if the parameter is an input or output parameter.
	 * @returns Action parameter object.
	 */
	public static findOrAddProperty(workflowAction: IWorkflowAction, key: string, type: ParameterType): IActionParam {
		if (!workflowAction[type].find(item => item.key === key)) {
			workflowAction[type].push({
				id: Math.floor(Math.random() * 90000) + 10000,
				key: key,
				value: ''
			});
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return workflowAction[type].find(item => item.key === key)!;
	}

	/**
	 * Used to set model property for form row
	 * @param workflowAction The current selected workflow action.
	 * @param key Key used to identify action parameter object.
	 * @param type Specifies if the parameter is an input or output parameter.
	 * @returns model property for input/output parameter.
	 */
	public static setModelProperty(workflowAction: IWorkflowAction, key: string, type: ParameterType = ParameterType.Input): string {
		return `${type}[${findIndex(workflowAction[type], item => item.key === key)}].value`;
	}

	/**
	 * Used to get the key value used as filter parameter
	 * @param entity action content.
	 * @returns model property for input/output parameter.
	 */
	public static getFilterKeyValue(entity: IWorkflowAction) : string {
		let keyValue: string = '';
		if(entity.input.find((a) => a.key === ChangeStatusActionEditorParams.statusName)){
			keyValue = ActionEditorHelper.findOrAddProperty(entity, ChangeStatusActionEditorParams.statusName, ParameterType.Input).value;
		}
		if(entity.input.find((a) => a.key === CreateQuotesFromRfqActionParamsEnum.QtnStatusId)){
			keyValue = 'quote';
		}
		return keyValue;
	}
}