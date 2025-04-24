/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { ContextService, PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { FieldType, IGridDialogOptions, StandardDialogButtonId,UiCommonGridDialogService } from '@libs/ui/common';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { IEstimateMainSerachCopyAssemblies } from '../model/interfaces/estimate-main-search-copy-assemblies.interface';
import { EstimateAssembliesService, IEstLineItemEntity } from '@libs/estimate/assemblies';

@Injectable({ providedIn: 'root' })
/**
 * Service class for handling the wizard operations for estimate main search assemblies.
 */
export class EstimateMainSearchCopyAssembliesWizardService {
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly platformContextService = inject(ContextService);
	private readonly http = inject(PlatformHttpService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly dataService = inject(EstimateAssembliesService);
	private readonly estimateMainService = inject(EstimateMainService);
	private readonly selectedAsseblies = this.dataService.getSelection();

	/**
	 * Open information grid dialog
	 */
	public async showAssembliesPortalDialog() {
		const gridDialogData: IGridDialogOptions<IEstLineItemEntity> = {
			width: '50%',
			headerText: 'estimate.main.wizardDialog.copyAssemblies',
			windowClass: 'grid-dialog',

			gridConfig: {
				uuid: '56b028c6a72d4a43b454f0266e34529b',
				columns: [
					{
						id: 'code',
						model: 'code',
						sortable: true,
						label: {
							text: 'cloud.common.entityCode'
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
				]
			},
			items: this.selectedAsseblies,
			isReadOnly: false,
			allowMultiSelect: true,
			selectedItems: []
		};

		const requestId = this.uuidGenerator();
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

			const api = `#/api?navigate&operation=inquiry&selection=multiple&confirm=1&module=estimate.assemblies&requestid=${requestId}&company=${companyCode}&roleid=${roleId}`;
			//  let ids = estimateProjectRateBookConfigDataService.getFilterIds(1);
			//     //  let projectId = estimateProjectRateBookConfigDataService.getProjectId();      // TODO : both services not ready
			//     //  if (ids && ids.length > 0) {
			//     //      api += '&extparams=' + encodeURIComponent('(filterCategoryIds=' + ids.join(',') + '&projectId='+ projectId +')');
			//     //  }
			//let ap1= 'apps-int.itwo40.eu/itwo40/daily/client/';
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
	 * @brief Creates data for estimate main search assemblies and sends a POST request to save it.
	 *
	 * This method collects necessary data from various services, constructs an `IEstimateMainSerachAssemblies`
	 * object, and sends it as a POST request to save the request data. If the data contains line items,
	 * the request is sent, and upon a successful response, it triggers a refresh of all estimates.
	 */
	private createData() {
		const data: IEstimateMainSerachCopyAssemblies = {
			LineItems: this.dataService.getList(),
			ProjectId: this.estimateMainContextService.getSelectedProjectId(),
			EstHeaderFk: this.estimateMainContextService.getSelectedEstHeaderId(),
			FromAssembly: 'AssemblyMaster',
			IsLookAtCopyOptions: true
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

	/**
	 * Generates a UUID string.
	 *
	 */
	private uuidGenerator(long?: boolean) {
		if (long) {
			return this._p8() + this._p8(true) + this._p8(true) + this._p8();
		} else {
			return this._p8() + this._p8() + this._p8() + this._p8();
		}
	}
	/**
	 * Generates an 8-character string segment for the UUID.
	 */
	private _p8(s?: boolean) {
		const p = (Math.random().toString(16) + '000000000').substring(2, 8);

		return s ? '-' + p.substring(0, 4) + '-' + p.substring(4, 4) : p;
	}
}
