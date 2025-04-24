/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, createLookup } from '@libs/ui/common';
import { PlatformConfigurationService } from '@libs/platform/common';
import { BasicsSharedQuantityTypeLookupService } from '@libs/basics/shared';
//import { Observable } from 'rxjs';
import { IEstLineItemQuantityEntity } from '@libs/estimate/interfaces';
import { ILineItemQuantityMaintenanceEntity } from '../model/interfaces/estimate-main-line-item-quantity-maintenance.interface';
//import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';

@Injectable({ providedIn: 'root' })

/**
 *  Estimate line item quantity maintenance wizard
 *  This services for provides functionality quantity maintenance
 */
export class EstimateMainLineItemQuantityMaintenanceWizardService {
	private http = inject(HttpClient);
	public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);
	private currentItem: IEstLineItemQuantityEntity = {} as IEstLineItemQuantityEntity;
	//private parentService = inject(EstimateMainService);

	/**
	 * This method displays a dialog
	 * @returns
	 */
	public async quantityMaintenance() {
		const result = await this.formDialogService
			.showDialog<ILineItemQuantityMaintenanceEntity>({
				id: 'quantityMaintenance',
				headerText: this.setHeader(),
				formConfiguration: this.prepareFormConfig<ILineItemQuantityMaintenanceEntity>(),
				runtime: undefined,
				customButtons: [],
				topDescription: '',
				entity: this.defaultItem,
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleOk(result);
					// TODO: estimateMainService not ready
				}
			});

		return result;
	}

	/**
	 * This method set the header for the quantityMaintenance wizard
	 * @returns
	 */
	public setHeader(): string {
		return 'estimate.main.quantityMaintenanceWizardDialogTitle';
	}

	/**
	 * This method prepares the form configuration for the specified value
	 * @returns
	 */
	public prepareFormConfig<Tvalue extends object>(): IFormConfig<Tvalue> {
		const formConfig: IFormConfig<Tvalue> = {
			formId: 'estimate.main.quantityMaintenance',
			showGrouping: true,
			groups: [
				{
					groupId: 'qtyAssignLevel',
					header: { key: 'estimate.main.quantityLevelDialogHeader' },
					open: true,
				},
				{
					groupId: 'quantityValues',
					header: { key: 'estimate.main.quantityDialogHeader' },
					open: true
				}
			],
			rows: [
				{
					groupId: 'qtyAssignLevel',
					id: 'radio',
					label: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.label',
					type: FieldType.Radio,
					model: 'estimateScope',
					itemsSource: {
						items: [
							{
								id: 1,
								displayName: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.Highlighted'
							},
							{
								id: 2,
								displayName: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.resultSet'
							},

							{
								id: 3,
								displayName: 'estimate.main.createBoqPackageWizard.selectScopeSource.scope.allEstimate'
							}
						]
					}
				},

				{
					groupId: 'quantityValues',
					id: 'qtyType',
					label: {
						key: 'estimate.main.sourceQuantityType',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedQuantityTypeLookupService,
						showClearButton: true,
					}),
					model: 'sourceQuantityTypeId',
					sortOrder: 1
				},

				{
					groupId: 'quantityValues',
					id: 'factor',
					label: {
						key: 'estimate.main.xFactor',
					},
					type: FieldType.Factor,

					model: 'factor',
					sortOrder: 2
				},

				{
					groupId: 'quantityValues',
					id: 'userQtyType',
					label: {
						key: 'estimate.main.dialogTargetQuantityType',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedQuantityTypeLookupService,
						showClearButton: true
					}),
					model: 'targetQuantityTypeId',
					required: true,
					readonly: false,
					sortOrder: 3
				},
				{
					groupId: 'quantityValues',
					id: 'date',
					label: {
						key: 'estimate.main.date',
					},
					type: FieldType.Date,
					model: 'date',
					required: true,
					sortOrder: 4
				},
			],
		};

		return formConfig;
	}

	/**
	 * Setting up default values to default item
	 */
	private defaultItem: ILineItemQuantityMaintenanceEntity = {
		Date: new Date(), // Initialize with the current date
		Factor: 0,
		TargetQuantityTypeId: 0,
		SourceQuantityTypeId: 0,
		EstimateScope: 0
	};

	/**
	 * This method returns the default value for the specified type
	 * @returns
	 */
	public defaultvalue<Tvalue>(): Tvalue {
		return this.defaultItem as Tvalue;
	}

	/**
	 * Returns the currentItem value
	 * @returns
	 */
	public getCurrentItem(): IEstLineItemQuantityEntity {
		return this.currentItem;
	}

	/**
	 * Sets the current item.
	 * @param item
	 */
	public setCurrentItem(item: IEstLineItemQuantityEntity): void {
		this.currentItem = item;
	}

	/**
	 * This method gives functionality to Ok button
	 * @param value
	 * @returns
	 */
	private handleOk(payload: IEditorDialogResult<ILineItemQuantityMaintenanceEntity>): void {
		// Check if payload and payload.value are defined
		if (!payload?.value) {
			console.error('Value or value.value is undefined');
			return;
		}

		// const data = {
		// 	LineItems: this.parentService.getSelection(),
		// 	SelectedLineItem: this.parentService.getSelectedEntity(),
		// 	EstHeaderFk: this.parentService.getSelection()[0].EstHeaderFk,
		// 	QunatityTypeFk: payload.value.SourceQuantityTypeId,
		// 	TargetQuantityTypeFk: payload.value.TargetQuantityTypeId,
		// 	Factor: payload.value.Factor,
		// 	Date: payload.value.Date,
		// };

		//this.update(data).subscribe((response) => {});   // Need to complete  implementation
	}

	/**
	 * This method calls update method and update data of line items
	 * @param data
	 * @returns
	 */
	// private update(data: IEstLineItemQuantityEntity): Observable<IEstLineItemQuantityEntity> {
	// 	const url = `${this.configService.webApiBaseUrl}estimate/main/lineitemquantity/updatemaintainquantity`;
	// 	return this.http.post<IEstLineItemQuantityEntity>(url, data);
	// }
	
}
