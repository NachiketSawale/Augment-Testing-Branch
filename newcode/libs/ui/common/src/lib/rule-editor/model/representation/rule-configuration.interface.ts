/*
 * Copyright(c) RIB Software GmbH
 */

import { Orientation } from '../../../model/orientation.enum';
import { RuleOperatorType } from '../types/rule-operator-type.enum';
import { IDdStateConfig } from './dd-state-config.interface';

/**
 * Provides access to configuration options relevant for all parts of the rule editor.
 */
export interface IRuleConfiguration {

	/**
	 * Indicates the orientation of the rule editor.
	 */
	readonly orientation: Orientation;

	/**
	 * ruleType
	 */
	readonly ruleType: RuleOperatorType;

	/**
	 * ddStateConfig
	 */
	readonly ddStateConfig: IDdStateConfig;
}