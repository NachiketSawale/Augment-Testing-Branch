/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';
import { FieldType, FormRow, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import EstimateMainDissolveAssemblyResourceDialogComponent from '../components/dissolve-assembly/estimate-main-dissolve-assembly-resource-dialog.component';
import { EstimateMainService } from '../containers/line-item/estimate-main-line-item-data.service';
import { EstimateMainScopeSelectionWizardService } from './estimate-main-scope-selection.service';
import { EstimateMainContextService } from '@libs/estimate/shared';
//import EstimateMainDissolveAssemblyResourceDialogComponent from '../../components/dissolve-assembly/estimate-main-dissolve-assembly-resource-dialog.component';

interface IDissolveAssemblyPostData {
	EstHeaderFk: number;
	ResourceType: number;
	AssemblyIds: [];
	SectionId: number;
	ProjectId: number;
	JobId: number;
	SelectedLevel: number;
	SelectedItemId: number;
	SelectedEstLineItems: [];
}

@Injectable({
	providedIn: 'root'
})
export class EstimateMainDissolveAssemblyWizardService extends EstimateMainScopeSelectionWizardService {

	public override formDialogService: UiCommonFormDialogService = inject(UiCommonFormDialogService);
	private scopeSelectionService = inject(EstimateMainScopeSelectionWizardService);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly estimateMainService = inject(EstimateMainService);
	private selectedLineitem = this.estimateMainService.getSelection();
	private rows = this.scopeSelectionService.prepareFormConfig().rows;
	private groups = this.scopeSelectionService.prepareFormConfig().groups;
	public async dissolveAssembly() {
	const groupDetails = this.dissolveAssemblyFormConfiguration?.groups?.find(group => group.groupId === 'assignedLevel');

		this.rows.forEach((row) => {
			if (groupDetails && groupDetails.groupId != row.groupId){
				row.sortOrder = 1;
				row.groupId = this.dissolveAssemblyFormConfiguration?.groups?.find(group => group.groupId === 'assignedLevel')?.groupId;
				this.dissolveAssemblyFormConfiguration.rows.push(row as unknown as FormRow<IDissolveAssemblyPostData>);
			}
		});
		const result = this.formDialogService
			.showDialog<IDissolveAssemblyPostData>({
				width: '80',
				id: 'estimate.main.dissolveAssemblyWizard.dissolveAssembly',
				headerText: { key: 'estimate.main.dissolveAssemblyWizard.dissolveAssembly' },
				formConfiguration: this.dissolveAssemblyFormConfiguration,
				entity: this.dissolveAssemblyPostDataEntity,
				runtime: undefined,
				customButtons: [],
				topDescription: ''
			})
			?.then((result) => {
				if (result?.closingButtonId == StandardDialogButtonId.Ok) { /* empty */ }
			});
		return result;
	}

	private dissolveAssemblyPostDataEntity: IDissolveAssemblyPostData = {
		EstHeaderFk: this.estimateMainContextService.getSelectedEstHeaderId(),
		ResourceType: 4,
		AssemblyIds: [],
		SectionId: 0,
		ProjectId: this.estimateMainContextService.getSelectedProjectId(),
		JobId: 0,
		SelectedLevel: 0,
		SelectedItemId: 0,
		SelectedEstLineItems: []
	};

	private dissolveAssemblyFormConfiguration: IFormConfig<IDissolveAssemblyPostData> = {
		formId: 'estimate.main.dissolveAssemblyWizard.dissolveAssembly',
		showGrouping: true,
		groups: [
			{
				groupId: 'assignedLevel',
				header: 'Assigned Level',
				visible: true,
				open: true
			},
			{
				groupId: 'selectAssemblies',
				header: 'Select Assemblies',
				visible: true,
				open: true
			}
		],
		rows: [
			{
				groupId: 'selectAssemblies',
				id: 'selectAssembly',
				type: FieldType.CustomComponent,
				componentType: EstimateMainDissolveAssemblyResourceDialogComponent,
				model: 'selectAssemblies',
				required: true,
				sortOrder: 2
			}
		]
	};
}
