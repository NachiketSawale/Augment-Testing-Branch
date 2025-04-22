/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input } from '@angular/core';
import { FieldType, getMultiStepDialogDataToken, IGridConfiguration, createLookup, FieldValidationInfo,UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { BasicsSharedMaterialLookupService } from '@libs/basics/shared';
import { IProcurementCommonReplaceNeutralMaterialSimulationDto, IProcurementCommonReplaceNeutralMaterialResultDto } from '../../../model/dtoes';
import { IProcurementCommonReplaceNeutralMaterialComplete } from '../../../model/interfaces/wizard/procurement-common-replace-neutral-material-wizard.interface';
import { ValidationResult } from '@libs/platform/data-access';
import { ProcurementCommonReplaceNeutralMaterialTypeLookupService } from '../../../lookups/procument-common-replace-neutral-material-type-lookup.service';
import { ProcurementReplaceNeutralMaterialReplaceStatus} from '../../../model/enums';

@Component({
	selector: 'procurement-common-replace-neutral-material-replace-item',
	templateUrl: './replace-neutral-material-replace-item.component.html',
	styleUrl: './replace-neutral-material-replace-item.component.scss'
})
export class ReplaceNeutralMaterialReplaceItemComponent {
	private readonly dialogData = inject(getMultiStepDialogDataToken<IProcurementCommonReplaceNeutralMaterialComplete>());
	@Input()
	protected simulationItems!: IProcurementCommonReplaceNeutralMaterialSimulationDto[];
	@Input()
	protected resultItems!: IProcurementCommonReplaceNeutralMaterialResultDto[];
	private lookupFactory = inject(UiCommonLookupDataFactoryService);
	private statusLookupService = this.lookupFactory.fromSimpleItemClass([{
		id: ProcurementReplaceNeutralMaterialReplaceStatus.Passed,
		desc: {
			text: 'Passed',
			key: 'procurement.common.wizard.replaceNeutralMaterial.passedTranslate'
		}
	}, {
		id: ProcurementReplaceNeutralMaterialReplaceStatus.PassedConverted,
		desc: {
			text: 'Passed (Converted)',
			key: 'procurement.common.wizard.replaceNeutralMaterial.passedConvertedTranslate'
		}
	}, {
		id: ProcurementReplaceNeutralMaterialReplaceStatus.Failed,
		desc: {
			text: 'Failed',
			key: 'procurement.common.wizard.replaceNeutralMaterial.uomCantConvertTranslate'
		}
	}, {
		id: ProcurementReplaceNeutralMaterialReplaceStatus.NoFound,
		desc: {
			text: 'No Found',
			key: 'procurement.common.wizard.replaceNeutralMaterial.noFoundTranslate'
		}
	}], {
		uuid: '',
		valueMember: 'id',
		displayMember: 'desc',
		translateDisplayMember: true
	});
	public simulationGridConfig: IGridConfiguration<IProcurementCommonReplaceNeutralMaterialSimulationDto> = {
		uuid: '17060CA12C09451FA5D20AF9608083A8',
		columns: [{
			id: 'selected',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.all', text: 'All'},
			model: 'Selected',
			readonly: false,
			sortable: true,
			type: FieldType.Boolean,
			visible: true
		}, {
			id: 'status',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.replaceStatus', text: 'Status'},
			model: 'Status',
			readonly: true,
			sortable: true,
			visible: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
					dataService: this.statusLookupService
				}
			)
		}, {
			id: 'materialCode',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.materialDescription', text: 'Material Code'},
			model: 'MaterialCode',
			readonly: true,
			sortable: true,
			type: FieldType.Integer,
			visible: true
		}, {
			id: 'materialDescription',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.materialDescription', text: 'Material Description'},
			model: 'MaterialCode',
			readonly: true,
			sortable: true,
			type: FieldType.Integer,
			visible: true
		}, {
			id: 'materialUoM',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.materialUoM', text: 'Material UoM'},
			model: 'MaterialUoM',
			readonly: true,
			sortable: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialLookupService,
				displayMember: 'UomInfo.Translated'
			}),
			visible: true
		}, {
			id: 'materialCurrentPrice',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.materialCurrentPrice', text: 'Material Current Price'},
			model: 'CurrentPrice',
			readonly: true,
			sortable: true,
			type: FieldType.Money,
			visible: true
		}, {
			id: 'mathMaterialCode',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.mathingMaterialCode', text: 'Mathing Mat.Code'},
			model: 'MathingMaterialCode',
			readonly: false,
			sortable: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialLookupService,
				displayMember: 'Code'
			}),
			visible: true
		}, {
			id: 'mathingMaterialDescription',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.mathingMaterialCode', text: 'Mathing Mat.Description'},
			model: 'MathingMaterialCode',
			readonly: true,
			sortable: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialLookupService,
				displayMember: 'DescriptionInfo.Translated'
			}),
			visible: true
		}, {
			id: 'mathingMaterialSupplier',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.mathingSupplier', text: 'Mathing Mat.Supplier'},
			model: 'MathingSupplier',
			readonly: true,
			sortable: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BusinessPartnerLookupService,
				displayMember: 'BusinessPartnerName1'
			}),
			visible: true
		}, {
			id: 'mathingMaterialPrice',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.mathingPrice', text: 'Mathing Mat.Price'},
			model: 'MatchingPrice',
			readonly: true,
			sortable: true,
			type: FieldType.Money,
			visible: true
		}, {
			id: 'variance',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.variance', text: 'Variance'},
			model: 'Variance',
			readonly: true,
			sortable: true,
			type: FieldType.Money,
			visible: true
		}, {
			id: 'variancePercent',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.variancePercent', text: 'Variance Percent'},
			model: 'VariancePercent',
			readonly: true,
			sortable: true,
			type: FieldType.Percent,
			visible: true
		}
		]
	};
	public resultMaterialGridConfig: IGridConfiguration<IProcurementCommonReplaceNeutralMaterialResultDto> = {
		uuid: '2794F1645E604F26AD1BE6BA3EF47FDA',
		columns: [{
			id: 'selected',
			label: {key: 'cloud.common.entitySelected', text: 'Selected'},
			model: 'Selected',
			readonly: false,
			sortable: true,
			type: FieldType.Boolean,
			visible: true,
			validator: info => {
				this.validateSelected(info);
				return new ValidationResult();
			}
		}, {
			id: 'status',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.status', text: 'Status'},
			model: 'Status',
			readonly: false,
			sortable: true,
			type: FieldType.Lookup,
			visible: true,
			lookupOptions: createLookup({
					dataService: this.statusLookupService
				}
			)
		}, {
			id: 'type',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.type', text: 'Type'},
			model: 'Type',
			readonly: false,
			sortable: true,
			type: FieldType.Lookup,
			visible: true,
			lookupOptions: createLookup({
					dataServiceToken: ProcurementCommonReplaceNeutralMaterialTypeLookupService,
					displayMember: 'description'
				}
			)
		}, {
			id: 'materialCode',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.materialCode', text: 'Material Code'},
			model: 'MaterialCode',
			readonly: true,
			sortable: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialLookupService,
				displayMember: 'Code'
			}),
			visible: true
		}, {
			id: 'materialDescription',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.materialDescription', text: 'Material Description'},
			model: 'MaterialCode',
			readonly: true,
			sortable: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialLookupService,
				displayMember: 'DescriptionInfo.Translated'
			}),
			visible: true
		}, {
			id: 'materialPrice',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.materialPrice', text: 'Price'},
			model: 'MaterialPrice',
			readonly: true,
			sortable: true,
			type: FieldType.Money,
			visible: true
		}, {
			id: 'materialUoM',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.matchingMaterialUoM', text: 'UoM'},
			model: 'MaterialCode',
			readonly: true,
			sortable: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialLookupService,
				displayMember: 'UomInfo.Translated'
			}),
			visible: true
		}, {
			id: 'convertPrice',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.convertPrice', text: 'Convert Price'},
			model: 'ConvertPrice',
			readonly: true,
			sortable: true,
			type: FieldType.Money,
			visible: true
		}, {
			id: 'substitutePrice',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.substitutePrice', text: 'Substitute Price'},
			model: 'SubstitutePrice',
			readonly: true,
			sortable: true,
			type: FieldType.Money,
			visible: true
		}, {
			id: 'substituteUoM',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.substitutePrice', text: 'Substitute UoM'},
			model: 'SubstituteMaterialId',
			readonly: true,
			sortable: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialLookupService,
				displayMember: 'UomInfo.Translated'
			}),
			visible: true
		}, {
			id: 'variance',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.variance', text: 'Variance'},
			model: 'Variance',
			readonly: true,
			sortable: true,
			type: FieldType.Money,
			visible: true
		}, {
			id: 'variancePercent',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.variancePercent', text: 'Variance Percent'},
			model: 'VariancePercent',
			readonly: true,
			sortable: true,
			type: FieldType.Money,
			visible: true
		}, {
			id: 'bpdSupplierFk',
			label: {key: 'procurement.common.wizard.replaceNeutralMaterial.supplier', text: 'Supplier'},
			model: 'BpdBusinesspartnerFk',
			readonly: true,
			sortable: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BusinessPartnerLookupService,
				displayMember: 'BusinessPartnerName1'
			}),
			visible: true
		}
		]
	};

	/*todo the selected checkbox readonly if no selected.need support by framework
	function updateSimulationGrid(data) {
				_.forEach(data, function (item) {
					if (1 === item.Status || 2 === item.Status) {
						setReadOnly(item, 'Selected', false);
					}
					else {
						setReadOnly(item, 'Selected', true);
					}

				});
				platformGridAPI.items.data(simulationGridId, data);
	}
	function updateResultMaterialGrid(data) {
		_.forEach(data, function (item) {
			if (1 === item.Status || 2 === item.Status) {
				setReadOnly(item, 'Selected', false);
			}
			else {
				setReadOnly(item, 'Selected', true);
			}

		});
		platformGridAPI.items.data(resultMaterialGridId, data);
	}
	*/

	//todo validator not support by framework now,current select checkbox not trigger event
	private validateSelected(info: FieldValidationInfo<IProcurementCommonReplaceNeutralMaterialResultDto>) {
		if (!info.value) {
			/*
			parentEntity.MathingMaterialCode=resultEntity.Id;
			parentEntity.MathingSupplier=resultEntity.BpdBusinesspartnerFk;
			parentEntity.MatchingPrice=resultEntity.homePrice;
			if(!isNil(resultEntity.MatchingPrice)){
			parentEntity.Variance=resultEntity.MatchingPrice-resultEntity.CurrentPrice;
			}
			else{
			parentEntity.Variance=null;
			}
			if (!sNil(parentEntity.Variance)&&parentEntity.CurrentPrice !== 0) {
				parentEntity.VariancePercent = (parentEntity.Variance / parentEntity.CurrentPrice) * 100;
			}
			else {
				parentEntity.VariancePercent = null;
			}
			*/
		}

	}

	//platformGridAPI.events.register(simulationGridId, 'onHeaderCheckboxChanged', checkAll);

	public onSelectedRowsChanged(selectedItem: IProcurementCommonReplaceNeutralMaterialSimulationDto[]) {
		this.resultItems = selectedItem[0].ReplaceMaterials;
	}

}
