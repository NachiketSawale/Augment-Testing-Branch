/*
 * Copyright(c) RIB Software GmbH
 */

import { IControlContext } from '@libs/ui/common';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { IEntityContext, PropertyType } from '@libs/platform/common';
import { DomainControlContextConfig } from '../../types/expandable-domain-control/expandable-domain-control-context-config-type';
import { get, set } from 'lodash';
import { ValidationResult } from '@libs/platform/data-access';

/**
 * Custom implementation of Control context to track changes in domain control.
 */
export class DomainControlContext<Entity extends object> implements IControlContext {
	private entity: Entity;
	private readonly path: string;
	private readonly actionService: BasicsWorkflowActionDataService;
	public readonly fieldId: string;
	public readonly readonly: boolean;
	public readonly validationResults: ValidationResult[];
	public readonly entityContext: IEntityContext<object>;

	public constructor(domainControlContextConfig: DomainControlContextConfig<Entity>) {
		this.fieldId = domainControlContextConfig.fieldId;
		this.readonly = domainControlContextConfig.readonly;
		this.validationResults = domainControlContextConfig.validationResults;
		this.entityContext = domainControlContextConfig.entityContext;
		this.entity = domainControlContextConfig.entity;
		this.path = domainControlContextConfig.propertyPath;
		this.actionService = domainControlContextConfig.actionService;
	}

	public set value(value: PropertyType) {
		//Set value to actionparam
		set(this.entity, this.path, value);
		//Track changes
		this.actionService.setFieldModified(this.path, value);
	}

	public get value(): PropertyType {
		return get(this.entity, this.path);
	}
}