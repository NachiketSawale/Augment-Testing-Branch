/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, createLookup } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';

interface AssemblyCategory {
	AssemblyCategoryId?: number;
	EstHeaderFk?: number;
	EstLineItems: [];
	ProjectId: number;
	SelectedItemId: number;
}
@Injectable({ providedIn: 'root' })

/**
 *  EstimateMainConvertLineitemAssemblyService
 *  This services for converting line item assemblies in an estimate.
 */
export class EstimateMainConvertLineitemAssemblyWizardService  {
	private http = inject(HttpClient);
	public formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private readonly configService = inject(PlatformConfigurationService);

	private AssemblycatId: AssemblyCategory = {
		AssemblyCategoryId: 0,
		EstHeaderFk: 0,
		EstLineItems: [],
		ProjectId: 0,
		SelectedItemId: 0
	};

	/**
	 * Converts Line Items to Assembly.
	 */
	public async convertLineItemIntoAssembly() {
		const result = await this.formDialogService
			.showDialog<AssemblyCategory>({
				id: 'AssemblyCategoryId',
				headerText: { key: 'estimate.main.convertLineItemToAssembly' },
				formConfiguration: this.convertLineItemformConfiguration,
				entity: this.AssemblycatId,
				runtime: undefined,
				customButtons: [],
				topDescription: ''
			})
			?.then((result) => {
				if (result?.closingButtonId === StandardDialogButtonId.Ok) {
					this.handleConvertLineItemOK(result);
					// TODO: estimateMainService not ready
				}
			});

			return result;
	}

	/**
	 * Form configuration data.
	 */
	private convertLineItemformConfiguration: IFormConfig<AssemblyCategory> = {
		formId: 'estimate.main.convertLineItemToAssemblyDialog',
		showGrouping: false,
		rows: [
			{
				id: 'AssemblyCategoryId',
				label: {
					key: 'estimate.main.assemblyCategoryId',
				},
				type: FieldType.Lookup,
				model: 'AssemblyCategoryId',
				required: true,
				lookupOptions: createLookup({
					//dataServiceToken: estimate-assemblies-category-lookup   todo: estimate-assemblies-category-lookup  not ready
				}),
			},
		],
	};

	/**
	 * Method handles 'Ok' button functionality.
	 */
	private handleConvertLineItemOK(result: IEditorDialogResult<AssemblyCategory>) {
		// TODO: estimateMainService not ready
		this.http.post(`${this.configService.webApiBaseUrl}estimate/main/wizard/convertlineitemintoassemblyt`, null).subscribe(() => {});
	}
}
