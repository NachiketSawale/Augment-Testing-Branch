/*
 * Copyright(c) RIB Software GmbH
 */

import {SubEntity} from './sub-entity.class';
import {AliasExpression} from './alias-expression.class';
import {IEntityField} from '../representation/entity-field.interface';

export class RuleEditorContext {
	/**
	 * subEntities
	 */
	public subEntities: SubEntity[] = [];

	/**
	 * dynamicFields
	 */
	public dynamicFields: Record<string, IEntityField[]> = {};

	/**
	 * aliasExpressions
	 */
	public aliasExpressions: AliasExpression[] = [];

	/**
	 * ruleEditorManager
	 */
	public ruleEditorManager: unknown; // todo: concrete type

}