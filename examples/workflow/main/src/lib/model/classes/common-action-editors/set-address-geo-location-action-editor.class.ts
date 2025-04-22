/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, ICodemirrorEditorOptions } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { Injector } from '@angular/core';
import { ParameterType } from '../../enum/action-editors/parameter-type.enum';
import { SetAddressGeoLocationActionParamsEnum } from '../../enum/actions/set-address-geo-location-action-editor-params.enum';
import { ActionEditorBase } from './action-editor-base.class';

/**
 * Configuration class for Set Address Geo Location action editor.
 */
export class SetAddressGeoLocationActionEditor extends ActionEditorBase {


	public constructor(workflowAction: IWorkflowAction, actionService: BasicsWorkflowActionDataService, injector: Injector) {
		super(workflowAction, actionService, injector);
		this.createField(FieldType.Comment, SetAddressGeoLocationActionParamsEnum.AddressId, ParameterType.Input, 'basics.workflow.action.customEditor.addressId', {} as ICodemirrorEditorOptions);
		this.createField(FieldType.Comment, SetAddressGeoLocationActionParamsEnum.Result, ParameterType.Output, 'basics.workflow.action.customEditor.outputResult', {} as ICodemirrorEditorOptions);
	}
}