/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IStatusChangeResult } from './status-change-result.interface';
import { DataServiceFlatRoot, DataServiceHierarchicalRoot } from '@libs/platform/data-access';
import { CompleteIdentification } from '@libs/platform/common';

export interface IHookExtensionOptions {
	ExtensionKey: number;
	ExtensionString: string;
}

/**
 * Accordion options
 */
export interface IStatusChangeOptions<PT extends object, PU extends CompleteIdentification<PT>> {
	/**
	 * Title of the status change dialog
	 */
	title: string;
	/**
	 * guid of the status change wizard
	 */
	guid?: string;
	/**
	 * Status list
	 */
	statusName: string;
	/**
	 * status field name
	 */
	statusField: string;
	/**
	 * project Id
	 */
	projectId?: number;
	/**
	 * main data service of current module
	 * TODO: wait for the data service interfaces
	 */
	//mainDataService: any;
	/**
	 * data service of current sub data if the change status is for the sub data
	 * TODO: wait for the data service interfaces
	 */
	//subDataService?: any;
	/**
	 * call back hook when doing the status change. The observable should return a boolean value to indicate whether continue to change the status or not.
	 */
	hookExtensionOperation?: (conf: IStatusChangeOptions<PT, PU>) => Promise<IStatusChangeResult>;

	checkAccessRight: boolean;
	/**
	 * if it config as simple status, it will not trigger the workflow and has not the change status history and remark
	 */
	isSimpleStatus?: boolean;
	/**
	 * if it config as simple status, user can customize the update status url
	 */
	updateUrl?: string;
	/**
	 * hook extension options
	 */
	hookExtensionOptions?: IHookExtensionOptions;
	/**
	 * this function return the code of entity
	 */
	getEntityCodeFn?: (entity: object) => string | undefined;

	/**
	 * this function return the Description of entity
	 */
	getEntityDescFn?: (entity: object) => string | undefined | null;

	/**
	 * the root data service of the module
	 */
	rootDataService?: DataServiceHierarchicalRoot<PT, PU> | DataServiceFlatRoot<PT, PU>;

}
