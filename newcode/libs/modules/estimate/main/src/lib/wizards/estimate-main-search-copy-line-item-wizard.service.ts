/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { ContextService, PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { FieldType, IGridDialogOptions, StandardDialogButtonId, UiCommonGridDialogService } from '@libs/ui/common';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';


@Injectable({ providedIn: 'root' })
/**
 * Service class for handling the wizard operations for estimate main search LineItems
 */
export class EstimateMainSearchCopyLineItemWizardService {
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly platformContextService = inject(ContextService);
	private readonly http = inject(PlatformHttpService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly selecteLineItem = this.estimateMainService.getSelection();

	/**
	 * Open information grid dialog
	 */
	public async showLineItemPortalDialog() {
		const gridDialogData: IGridDialogOptions<IEstLineItemEntity> = {
			width: '50%',
			headerText: 'estimate.main.wizardDialog.copyLineItem',
			windowClass: 'grid-dialog',

			gridConfig: {
				uuid: 'd7395abecc1547c7a6fdad5413b3a90e',
				columns: [
					{
						id: 'code',
						model: 'code',
						sortable: true,
						label: {
							text: 'cloud.common.entityCode',
						},
						type: FieldType.Code,
						readonly: false,
						width: 100,
						visible: true
					},
					{
						id: 'desc',
						model: 'desc',
						sortable: true,
						label: {
							text: 'cloud.common.entityDescription',
						},
						type: FieldType.Description,
						readonly: false,
						width: 100,
						visible: true
					},
					{
						id: 'qty',
						model: 'Quantity',
						sortable: true,
						label: {
							text: 'cloud.common.entityQuantity',
						},
						type: FieldType.Description,
						readonly: false,
						width: 100,
						visible: true
					},
				],
			},
			items: this.selecteLineItem,
			isReadOnly: false,
			allowMultiSelect: true,
			selectedItems: []
		};

		const requestId ='' ;  //   TODO:    platformCreateUuid;
		this.inquiryData(requestId);
		this.requestData(requestId);
		const result = await this.gridDialogService.show(gridDialogData);
		if (result && result.closingButtonId === StandardDialogButtonId.Ok) {
			this.createData();
		}
		return result;
	}
	/**
	 * @brief Opens a new window to perform an inquiry operation based on the provided requestId.
	 *
	 * @param requestId The unique identifier for the request.
	 * @return A Promise that resolves after attempting to open the window and focus on it.
	 */
	public inquiryData(requestId: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const companyCode = this.configurationService.signedInClientCode;
			const roleId = this.platformContextService.permissionRoleId;

			const api = `#/api?navigate&operation=inquiry&selection=multiple&confirm=1&module=estimate.main&requestid=${requestId}&company=${companyCode}&roleid=${roleId}`;
			const url = window.location + this.configurationService.appBaseUrl + api;
			const win = window.open(url);

			if (win) {
				win.focus();
				setTimeout(() => {
					resolve();
				}, 5000);
			} else {
				reject(new Error('Failed to open the window.'));
			}
		});
	}
	/**
	 * @brief Creates data for estimate main search Line Items and sends a POST request to save it.
	 *
	 * This method collects necessary data from various services, constructs an `IEstimateMainSerachAssemblies`
	 * object, and sends it as a POST request to save the request data. If the data contains line items,
	 * the request is sent, and upon a successful response, it triggers a refresh of all estimates.
	 */
	private createData() {

        const selectedLineItem = this.estimateMainService.getSelection()[0];
        const selectedHeaderId = this.estimateMainContextService.getSelectedEstHeaderId();
        const prjId = this.estimateMainContextService.getSelectedProjectId();
        const lineItems= this.estimateMainService.getList();
        const sourceProjectId = lineItems && lineItems.length > 0 ? lineItems[0].ProjectFk : null;

        const data={
            LineItems:lineItems ,
            SourceProjectId:sourceProjectId,
			ProjectId: prjId > 0 ? prjId : selectedLineItem && selectedLineItem.Id ? selectedLineItem.ProjectFk : null,
			EstHeaderFk: selectedHeaderId > 0 ? selectedHeaderId : selectedLineItem && selectedLineItem.Id ? selectedLineItem.EstHeaderFk : -1,
		    IsCopyLineItems : true,
			IsLookAtCopyOptions:true
        };

      
		if (data.LineItems.length > 0) {
			this.http.post('estimate/main/wizard/saverequestdata', data).then(() => {
				this.estimateMainService.refreshAll();
			});
		}
	}

	/**
	 * Sends a POST request to save the request data for the specified request ID.
	 *
	 * @param requestId The ID of the request to save.
	 * @returns A Promise that resolves to an array of `IEstLineItemEntity`.
	 */
	private requestData(requestId: string) {
		return this.http.post$<IEstLineItemEntity[]>(this.configurationService.webApiBaseUrl + 'estimate/main/wizard/saverequestdata', { Value: requestId });
	}

}
