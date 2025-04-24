/*
 * Copyright(c) RIB Software GmbH
 */

import { SelectionStatementSearchType } from '../../enums/selection-statement-search-type.enum';

/**
 * the FilterDefinitionEntity interface
 */
export interface IFilterDefinitionEntity {
	Id: number;
	ModuleName: string;
	FilterName: string;
	AccessLevel: string;
	FilterDef: string;
	DisplayName: string;
	IconCss?: string;
}
export interface IFilterDef {
	FilterType?: SelectionStatementSearchType;
	TreePartMode?: string;
	FilterText?: string;
	Version?: string;
	FilterComposite?: string;
	SelectedItem?: IFilterDefinitionEntity;
}

/**
 * the construction system filter def interface,from API
 */
export interface ICosFilterDef {
	filterType?: SelectionStatementSearchType;
	treePartMode?: string;
	filterText?: string;
	filterComposite?: string;
	selectedItem?: IFilterDefinitionEntity;
	version?: string;
}
