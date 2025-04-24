/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
// import { PlatformRuntimeDataService } from './platform-runtime-data.service'; // todo

@Injectable({
	providedIn: 'root'
})

/**
 * EstimateMainGenerateEstimateFromBoqWizardProcessService
 */
export class EstimateMainGenerateEstimateFromBoqWizardProcessService {
	private platformRuntimeDataService: unknown;

	// constructor(private platformRuntimeDataService: PlatformRuntimeDataService) { }
	// todo platformRuntimeDataService not yet implemented

	/**
	 * Processes the given item based on the specified field.
	 * @param item - The item to be processed.
	 * @param field - The field that triggers the processing.
	 * @returns void
	 */
	public processItem(item: unknown, field: string): void {
		// if (field === 'Type' && item.Type === 2) {
		// 	this.setFieldReadOnly(item, 'EstHeaderId', true);
		// 	// @ts-ignore
		// 	this.platformRuntimeDataService.applyValidationResult(
		// 		{
		// 			valid: true,
		// 			apply: true,
		// 		},
		// 		item,
		// 		'EstHeaderId',
		// 	);
		// 	this.resetFields(item);
		// }
		// if (field === 'Type' && item.Type === 1) {
		// 	this.setFieldReadOnly(item, 'EstHeaderId', false);
		// 	this.platformRuntimeDataService.applyValidationResult(
		// 		{
		// 			valid: false,
		// 			error: '...',
		// 			error$tr$: 'estimate.main.estimateCodeEmptyErrMsg',
		// 		},
		// 		item,
		// 		'EstHeaderId',
		// 	);
		// 	this.resetFields(item);
		// }
	}

	/**
	 * Sets the specified field of the item to read-only or editable.
	 * @param item - The item containing the field.
	 * @param column - The field to be set as read-only or editable.
	 * @param readonly - The boolean value indicating if the field should be read-only.
	 * @returns void
	 */
	// private setFieldReadOnly(item: any, column: string, readonly: boolean): void {
	// 	let fields = [{ field: column, readonly: readonly }];
	// 	//this.platformRuntimeDataService.readonly(item, fields);
	// }

	/**
	 * Resets specific fields of the given item to their default values.
	 * @param item - The item whose fields need to be reset.
	 * @returns void
	 */
	// private resetFields(item: any): void {
	// 	if (item.ProjectWicId !== undefined) {
	// 		item.ProjectWicId = null;
	// 	}
	// 	if (item.EstHeaderId !== undefined) {
	// 		item.EstHeaderId = null;
	// 	}
	// 	if (item.SourceBoqHeaderFk !== undefined) {
	// 		item.SourceBoqHeaderFk = null;
	// 	}
	// 	if (item.RootItemId !== undefined) {
	// 		item.RootItemId = null;
	// 	}
	// 	if (item.BoqRootItemDescription !== undefined) {
	// 		item.BoqRootItemDescription = null;
	// 	}
	// }
}
