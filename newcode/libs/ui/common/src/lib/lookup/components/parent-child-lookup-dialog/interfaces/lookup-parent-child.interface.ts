/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { IGridConfiguration } from '../../../../grid/model/grid-configuration.interface';
import { IMenuItemsList } from '../../../../model/menu-list/interface/menu-items-list.interface';

/**
 * Interface for the Parent Child Lookup Dialog
 */
export interface IParentChildLookupDialog {

	/**
	 *  Returns the Parent grid structure
	 */
	getParentGridStructure(): IGridConfiguration<object>;

	/**
	 *  Returns the Child grid structure
	 */
	getChildGridStructure(): IGridConfiguration<object>;

	/**
	 *  Returns the toolbar items
	 */
	getToolbarItems(): IMenuItemsList<void> | undefined;

	/**
	 * load parent items
	 */
	loadParentGridItems(): Observable<object[]>

	/**
	 * load children items
	 */
	loadChildrenGridItems(parentItem: object): Observable<object[]>

	/**
	 * get search result
	 */
	getSearchResult(inputParameter:string): Observable<object[]>

}




