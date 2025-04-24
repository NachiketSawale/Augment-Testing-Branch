/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input } from '@angular/core';
import { IEntityContext, CollectionHelper, PlatformTranslateService } from '@libs/platform/common';
import { FieldType, getMultiStepDialogDataToken, IGridConfiguration, createLookup } from '@libs/ui/common';
import { IProcurementCommonUpdateItemPriceParam, IProcurementCommonUpdatePriceDataComplete } from '../../../model/entities/procurement-common-upate-item-price-entity.interface';
import { IProcurementCommonUpdateItemPriceWizardHttpService } from '../../../services/wizards/update-item-price-wizard-http.service';
import { BasicsSharedMaterialPriceListLookupService, BasicsSharedUomLookupService, PrcSharedPriceVersionLookupService } from '@libs/basics/shared';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { firstValueFrom } from 'rxjs';
import { ProcurementUpdatePriceWizardOption } from '../../../model/enums/procurement-update-item-price-option.enum';
import { IProcurementCommonHistoricalPriceForItemDto } from '../../../model/dtoes';

@Component({
	selector: 'procurement-common-update-item-update-condition',
	templateUrl: './update-item-price-update-condition.component.html',
	styleUrl: './update-item-price-update-condition.component.scss'
})
export class UpdateItemPriceUpdateConditionComponent {
	private readonly translateService = inject(PlatformTranslateService);
	private updateItemPriceWizardHttpService = inject(IProcurementCommonUpdateItemPriceWizardHttpService);
	private readonly dialogData = inject(getMultiStepDialogDataToken<IProcurementCommonUpdatePriceDataComplete>());
	@Input()
	protected priceForm!: IProcurementCommonUpdateItemPriceParam;

	@Input()
	protected priceResultSet!: IProcurementCommonHistoricalPriceForItemDto[];

	public readonly priceConditionLookup = inject(PrcSharedPriceVersionLookupService);

	protected readonly FieldType = FieldType;

	public currentItem: IProcurementCommonUpdateItemPriceParam = {
		isCheckQuote: true,
		isCheckContract: true,
		isCheckMaterialCatalog: true,
		isCheckNeutralMaterial: true,
		startDate: undefined,
		endDate: undefined,
		priceConditionFk: 0,
		materialIds: [],
		businessPartnerId: null
	};

	public priceConditionContext: IEntityContext<IProcurementCommonUpdateItemPriceParam> = {
		entity: this.currentItem,
		totalCount: 0
	};

	public gridConfig: IGridConfiguration<IProcurementCommonHistoricalPriceForItemDto> = {
		uuid: '87c664435ffc4146b8ccfc6dba2616df',
		columns: [],
		idProperty: 'Index',
		items: this.priceResultSet,
		iconClass: null,
		skipPermissionCheck: true,
		enableColumnReorder: true,
		enableCopyPasteExcel: false,
		treeConfiguration: {
			parent: entity => {
				if (entity.PId) {
					return this.gridConfig?.items?.find(item => item.Id === entity.PId) || null;
				}
				return null;
			},
			children: entity => {
				if (entity.Children) {
					const list = CollectionHelper.Flatten(this.priceResultSet || [], (item) => {
						return item.Children || [];
					});
					return list.reduce((result: IProcurementCommonHistoricalPriceForItemDto[], item) => {
						if (entity.Id === item.PId) {
							result.push(item);
						}
						return result;
					}, []) || [];
				} else {
					return [];
				}
			}
		}
	};

	public constructor() {
		if (this.dialogData && this.dialogData.dataItem.basicOption) {
			const dataItem = this.dialogData.dataItem;
			const basicOption = dataItem.basicOption;
			const currencyItems = basicOption === ProcurementUpdatePriceWizardOption.SelectItems ? dataItem.selectedItems : dataItem.itemList;
			this.currentItem.materialIds = currencyItems.map(item => {
				return item.MdcMaterialFk!;
			});
			this.currentItem.businessPartnerId = dataItem.updatePriceParam.priceForm.businessPartnerId;

		}

		this.gridConfig = {
			...this.gridConfig,
			columns: [{
				id: 'selected',
				label: {key: 'cloud.common.entitySelected', text: 'Selected'},
				model: 'Selected',
				readonly: false,
				sortable: true,
				type: FieldType.Boolean,
				visible: true
			}, {
				id: 'itemCodeDesc',
				label: {key: 'procurement.common.wizard.updateItemPrice.itemCodeAndDesc', text: 'Item Code / Description'},
				model: 'ItemCodeAndDesc',
				readonly: true,
				sortable: true,
				type: FieldType.Description,
				visible: true
			}, {
				id: 'sourceCodeDesc',
				label: {key: 'procurement.common.wizard.updateItemPrice.sourceCodeAndDesc', text: 'Source Code / Description'},
				model: 'SourceCodeAndDesc',
				readonly: true,
				sortable: true,
				type: FieldType.Description,
				visible: true
			}, {
				id: 'unitRate',
				label: {key: 'procurement.common.wizard.updateItemPrice.unitRate', text: 'Unit Rate'},
				model: 'MaterialPriceListId',
				readonly: true,
				sortable: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedMaterialPriceListLookupService,
				}),
				visible: true
			}, {
				id: 'convertedUnitRate',
				label: {key: 'procurement.common.wizard.updateItemPrice.convertedUnitRate', text: 'Converted Unit Rate'},
				model: 'ConvertedUnitRate',
				readonly: true,
				sortable: true,
				type: FieldType.Money,
				visible: true
			}, {
				id: 'variance',
				label: {key: 'basics.common.variance', text: 'Variance'},
				model: 'Variance',
				readonly: true,
				sortable: true,
				type: FieldType.Money,
				visible: true
			}, {
				id: 'uom',
				label: {key: 'procurement.common.wizard.replaceNeutralMaterial.matchingMaterialUoM', text: 'Unit'},
				model: 'UomId',
				sortable: true,
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedUomLookupService
				})
			}, {
				id: 'priceUnit',
				label: {key: 'procurement.common.wizard.updateItemPrice.priceUnit', text: 'Price Unit'},
				model: 'PriceUnit',
				readonly: true,
				sortable: true,
				type: FieldType.Money,
				visible: true
			}, {
				id: 'weighting',
				label: {key: 'project.main.weighting', text: 'Weighting'},
				model: 'Weighting',
				readonly: true,
				sortable: true,
				type: FieldType.Money,
				visible: true,
				/* todo need framework support formatter
				formatter: function (row, cell, value, setting, entity) {
					if (!entity.SourceType) {
						return '';
					}
					if (!value || value <= 0) {
						entity.Weighting = 1;
						return 1;
					}
					return value;
				}*/
			}, {
				id: 'date',
				label: {key: 'procurement.common.entityDate', text: 'Date'},
				model: 'Date',
				readonly: true,
				sortable: true,
				type: FieldType.DateUtc,
				visible: true
			}, {
				id: 'projectId',
				label: {key: 'project.main.sourceProject', text: 'Project'},
				model: 'ProjectId',
				readonly: true,
				sortable: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProjectSharedLookupService
				}),
				visible: true
			}, {
				id: 'businessPartnerFk',
				label: {key: 'basics.common.BusinessPartner', text: 'Business Partner'},
				model: 'BusinessPartnerFk',
				sortable: true,
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService
				})
			}, {
				id: 'co2Project',
				label: {key: 'procurement.common.entityCo2Project', text: 'CO2/kg (Project)'},
				model: 'Co2Project',
				readonly: true,
				sortable: true,
				type: FieldType.Money,
				visible: true
			}, {
				id: 'co2Source',
				label: {key: 'procurement.common.entityCo2Source', text: 'CO2/kg (Source)'},
				model: 'Co2Source',
				readonly: true,
				sortable: true,
				type: FieldType.Money,
				visible: true
			}]
		};
	}

	public dateHasError() {
		return this.currentItem.startDate && this.currentItem.endDate && this.currentItem.startDate > this.currentItem.endDate;
	}

	public dateErrorText() {
		const dateHasError = this.dateHasError();
		return dateHasError ? this.translateService.instant({
			key: 'basics.material.updatePriceWizard.DateError',
			params: {
				'startDate': this.translateService.instant('basics.material.updatePriceWizard.startDate').text,
				'endDate': this.translateService.instant('basics.material.updatePriceWizard.endDate').text
			}
		}).text : '';
	}

	public materialCatalogChange() {
		if (!this.currentItem.isCheckMaterialCatalog) {
			this.priceForm.priceConditionFk = null;
			this.priceForm.isCheckNeutralMaterial = false;
		} else {
			this.priceForm.priceConditionFk = -1;
		}
	}

	public async search() {
		this.dialogData.dataItem.updatePriceParam.priceForm = this.currentItem;
		const dataItem = this.dialogData.dataItem;
		const resp = await firstValueFrom(this.updateItemPriceWizardHttpService.fillGridFromItemsData(dataItem));
		if (resp) {
			this.priceResultSet = (resp as IProcurementCommonHistoricalPriceForItemDto[]);
			//todo response weight is 0.need set 1 ,in angular.js conversion it at formatter function,after formatter function ok,here need delete.
			this.priceResultSet.forEach(item => {
				if (item.Weighting === 0) {
					item.Weighting = 1;
					if (item.Children && item.Children.length > 0) {
						item.Children.forEach(subItem => {
							subItem.Weighting = 1;
						});
					}
				}
			});
			this.gridConfig = {
				...this.gridConfig,
				items: this.priceResultSet
			};
		}
	}
}