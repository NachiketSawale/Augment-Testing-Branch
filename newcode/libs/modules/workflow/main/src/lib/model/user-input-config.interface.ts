/*
 * Copyright(c) RIB Software GmbH
 */

import { TValue } from '@libs/workflow/interfaces';
import { IBaseColumn } from '../components/action-editors/standard-view-components/parameter-grid-view/parameter-grid-view.component';


/**
 * An interface containing base properties of user input action.
 */
export interface IUserInputConfig {
	/**
	 * an optional property created to insert user-input-action
	 * config data into grid.
	 */
	Id?: number;

	/**
	 * Description
	 */
	description: string;

	/**
	 * data type of the input configuration property.
	 */
	type: string;

	/**
	 * if context is configured,
	 * the value added into input fields gets bind to context object in debug container.
	 */
	context?: string | null;

	/**
	 * If true, the description of user input config property gets added as a label.
	 */
	showDescriptionInFrontAsLabel?: boolean;

	/**
	 * Visible condition
	 */
	visibleCondition?: string;

	/**
	 * any other properties.
	 */
	options?: { [key: string]: TValue | undefined; };

	/**
	 *If true, the task will render in the sidebar
	 */
	isTaskSidebarContainer?: boolean;

}

export interface IUserInputConfigBase {
	/**
	 * an optional property created to insert user-input-action
	 * config data into grid.
	 */
	Id?: number;

	description: string;
	/**
	 * data type of the input configuration property.
	 */
	type: string;
	/**
	 * if context is configured,
	 * the value added into input fields gets bind to context object in debug container.
	 */
	context: string | null;
	/**
	 * If true, the description of user input config property gets added as a label.
	 */
	showDescriptionInFrontAsLabel: boolean;
	visibleCondition: string;

	options?: ISelectOptionsConfig | IEntityLinkTypeConfig | LinkTypeConfig

}

export interface ISelectOptionsConfig {
	displayMember: string;
	valueMember: string;
	typeSelectedMode: number;
	editorMode: number;
	items: Item[];
}

export interface Item extends IBaseColumn {
	Value: string;
}

export interface IEntityLinkTypeConfig {
	displayText: string,
	entity: string,
	moduleName: string
}

export interface LinkTypeConfig {
	url: string,
	displayText: string
}

export interface OptionByTypeMap {
	//[key: string]:LinkTypeConfig |IEntityLinkTypeConfig |ISelectOptionsConfig;
	'entityLink': IEntityLinkTypeConfig;
}

/**
 * A custom union type that stores base as well as dynamic properties of user input config.
 */
export type UserInputConfig = IUserInputConfig & Record<string, TValue>;
