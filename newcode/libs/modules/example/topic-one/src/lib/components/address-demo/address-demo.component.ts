/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { AddressEntity, BasicsCompanyLookupService, BasicsSharedAddressDialogComponent, createFormDialogLookupProvider, CustomDialogLookupOptions, ISearchEntity } from '@libs/basics/shared';
import { ColumnDef, ConcreteField, createLookup, FieldType, FormRow, IFieldValueChangeInfo, IFormConfig, IGridConfiguration } from '@libs/ui/common';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { PropertyPath } from '@libs/platform/common';
import { ICompanyEntity } from '@libs/basics/interfaces';

/**
 *
 */
export class BusinessPartnerEntity {
	public constructor(public Id: number) {
	}

	public Name?: string;
	public MatchCode?: string;
	public ProjectFk?: number;
	public CompanyFk?: number;
	public AddressFk1?: number;
	public Address1?: AddressEntity;
	public AddressFk2?: number;
	public Address2?: AddressEntity;
	public CountryFk?: number;
}

@Component({
	selector: 'example-topic-one-address-demo',
	templateUrl: './address-demo.component.html',
	styleUrls: ['./address-demo.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AddressDemoComponent extends ContainerBaseComponent {
	private dataColumns: ColumnDef<BusinessPartnerEntity>[] = (this.createRows() as ColumnDef<BusinessPartnerEntity>[]).map(row => {
		row.readonly = true;
		row.visible = true;
		row.width = 200;
		return row;
	});
	private dataRows: BusinessPartnerEntity[] = [{
		Id: 10,
		Name: 'Benmu Construction Ltd.',
		MatchCode: 'BENMUCONSTRUCTIONLTD',
		ProjectFk: 389,
		CompanyFk: 124,
		CountryFk: 48,
		AddressFk1: 80,
		Address1: {
			Id: 80,
			ZipCode: '510010',
			CountryFk: 48,
			City: 'Guangzhou',
			County: 'Guangdong',
			Address: '花城大道 22号\rGuangzhou, Guangdong 510010\rChina',
			AddressLine: 'CN 510010 Guangzhou, 花城大道 22号',
			Longitude: 113.26435852,
			Latitude: 23.12907982,
			AddressModified: false,
			Supplement: '...'
		}
	}, {
		Id: 452,
		Name: 'RIB Software Inc (GZ)',
		MatchCode: 'RIBSOFTWAREINCGZ',
		ProjectFk: 389,
		CompanyFk: 124,
		AddressFk2: 4680,
		Address2: {
			Id: 4680,
			ZipCode: '510010',
			CountryFk: 48,
			City: '广州',
			County: '黄埔',
			Address: '开创大道 2817号\r广州, 黄埔 \rChina',
			AddressLine: 'CN  广州, 开创大道 2817号',
			Longitude: 113.45756,
			Latitude: 23.1743789,
			AddressModified: false,
			Supplement: ''
		},
	}];

	public configuration: IGridConfiguration<BusinessPartnerEntity> = {
		uuid: '75dcd826c28746bf9b8bbbf80a1168e8',
		columns: this.dataColumns,
		items: this.dataRows
	};

	public selectedItem: BusinessPartnerEntity | undefined = undefined;

	private mergeOptions(customOptions: CustomDialogLookupOptions<AddressEntity, BusinessPartnerEntity>): CustomDialogLookupOptions<AddressEntity, BusinessPartnerEntity> {
		return _.mergeWith({
			createOptions: {
				titleField: 'cloud.common.address',
				initCreationData: (item: object, entity?: BusinessPartnerEntity) => {
					const bpEntity = entity as BusinessPartnerEntity;
					return {
						pattern: bpEntity.Name
					};
				},
				handleCreateSucceeded: (item: AddressEntity, entity?: BusinessPartnerEntity) => {
					const bpEntity = entity as BusinessPartnerEntity;
					item.Supplement = bpEntity.Name + ' - ' + bpEntity.MatchCode;
					return item;
				}
			},
			showEditButton: true
		}, customOptions);
	}

	private updateEntityRuntimeData(entityRuntimeData: EntityRuntimeData<ISearchEntity>, searchFormRows: FormRow<ISearchEntity>[]) {
		searchFormRows.forEach((row: FormRow<ISearchEntity>) => {
			const field = entityRuntimeData.readOnlyFields.find(r => r.field === row.model);
			if (field) {
				field.readOnly = row.readonly as boolean;
			} else {
				entityRuntimeData.readOnlyFields.push({
					field: row.model as PropertyPath<ISearchEntity>,
					readOnly: row.readonly as boolean
				});
			}
		});
	}

	private createRows(): ConcreteField<BusinessPartnerEntity>[] {
		const searchRuntime = new EntityRuntimeData<ISearchEntity>();
		let searchEntity = {};
		const searchFormRows: FormRow<ISearchEntity>[] = [{
			id: 'company',
			label: {
				text: 'Company',
				key: 'cloud.common.entityCompany'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup<ISearchEntity, ICompanyEntity>({
				dataServiceToken: BasicsCompanyLookupService,
				showClearButton: true
			}),
			model: 'CompanyFk',
			sortOrder: 1,
			readonly: false,
			change: (info: IFieldValueChangeInfo<ISearchEntity>) => {
				const prjRow = searchFormRows[1];

				prjRow.readonly = !info.newValue;
				if (prjRow.readonly && searchEntity) {
					_.set(searchEntity, 'ProjectFk', null);
				}

				this.updateEntityRuntimeData(searchRuntime, searchFormRows);
			},
		}, {
			id: 'project',
			label: {
				text: 'Project',
				key: 'cloud.common.entityProject'
			},
			type: FieldType.Integer,
			model: 'ProjectFk',
			sortOrder: 2,
			readonly: false
		}];
		return [{
			id: 'id',
			label: {
				text: 'Id',
			},
			type: FieldType.Integer,
			model: 'Id',
			required: true,
			readonly: true,
		}, {
			id: 'name',
			label: {
				text: 'Name',
			},
			type: FieldType.Description,
			model: 'Name'
		}, {
			id: 'matchcode',
			label: {
				text: 'Match Code',
			},
			type: FieldType.Code,
			model: 'MatchCode'
		}, {
			id: 'addressfk1',
			label: {
				text: 'Address1'
			},
			type: FieldType.CustomComponent,
			componentType: BasicsSharedAddressDialogComponent,
			providers: createFormDialogLookupProvider(this.mergeOptions({
				objectKey: 'Address1',
			})),
			model: 'AddressFk1',
			readonly: true
		}, {
			id: 'addressfk2',
			label: {
				text: 'Address2'
			},
			type: FieldType.CustomComponent,
			componentType: BasicsSharedAddressDialogComponent,
			providers: createFormDialogLookupProvider(this.mergeOptions({
				foreignKey: 'AddressFk2',
				showSearchButton: true,
				searchOptions: {
					onDialogOpening: (searchEntity: ISearchEntity, runtimeData?: EntityRuntimeData<ISearchEntity>) => {
						const companyFk = _.get(searchEntity, 'CompanyFk') as unknown as number;
						const prjRow = searchFormRows[1];

						prjRow.readonly = !companyFk;
						this.updateEntityRuntimeData(runtimeData as EntityRuntimeData<ISearchEntity>, searchFormRows);
						return searchEntity;
					},
					form: {
						configuration: {
							rows: searchFormRows
						},
						entity: (entity) => {
							searchEntity = {
								CompanyFk: entity.CompanyFk,
								ProjectFk: entity.ProjectFk
							};
							return searchEntity;
						},
						entityRuntimeData: searchRuntime
					},
				},
				showPopupButton: true
			})),
			model: 'Address2'
		}];
	}

	public formConfig: IFormConfig<BusinessPartnerEntity> = {
		formId: 'cloud.common.dialog.default.form',
		showGrouping: false,
		addValidationAutomatically: true,
		rows: this.createRows()
	};

	public selectionChanged(selectedItems: BusinessPartnerEntity[]) {
		if (selectedItems.length > 0) {
			this.selectedItem = selectedItems[0];
		}
	}
}
