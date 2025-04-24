/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import { set } from 'lodash';
import { MainDataDto } from '@libs/basics/shared';
import { createLookup, FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IQtoMainHeaderGridEntity } from '../../model/qto-main-header-grid-entity.class';
import { ProcurementShareContractLookupService, ProcurementSharePesLookupService } from '@libs/procurement/shared';
import { QtoMainDetailGridDataService } from '../../services/qto-main-detail-grid-data.service';
import { ICreatePesEntity } from '../../model/interfaces/qto-create-pes-entity.interface';

enum CreateType {
	Create = 1,
	Update,
}

@Injectable({
	providedIn: 'root',
})
export class QtoWizardCreatePesService {
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly qtoMainDetailGridDataService = inject(QtoMainDetailGridDataService);

	private _qtoHeaderId: number = 0;
	private _contractIds: object = {};
	private formEntity: ICreatePesEntity = {
		CreateTypeFk: 1,
		PesId: -1,
		UpdateWith: 1,
		ContractId: -1,
		DateDelivered: '',
		QtoHeaderFk: this._qtoHeaderId,
	};
	private formConfig: IFormConfig<ICreatePesEntity> = {
		formId: 'contract.wizard.createPes',
		showGrouping: true,
		/* groups: [
			{
				groupId: 'default',
				header: { text: 'Basic Setting' },
				open: true,
				visible: false,
			},
		], */
		rows: [
			{
				groupId: 'default',
				id: 'CreateTypeFk',
				label: {
					text: 'Generate Type',
					key: 'qto.main.wizard.create.pes.generteType',
				},
				type: FieldType.Radio,
				itemsSource: {
					items: [
						{ id: 1, displayName: { key: 'qto.main.wizard.create.pes.create', text: 'Create' } },
						{ id: 2, displayName: { key: 'qto.main.wizard.create.pes.update', text: 'Update' } },
					],
				},
				/* change: (info) => {
					const pes = this.formConfig.rows.find((e) => e.id === 'PesId');
					const updateWith = this.formConfig.rows.find((e) => e.id === 'UpdateWith');
					if (info.newValue === CreateType.Create) {
						if (pes) {
							pes.visible = false;
						}
						if (updateWith) {
							updateWith.visible = false;
						}
					} else {
						if (pes) {
							pes.visible = true;
						}
						if (updateWith) {
							updateWith.visible = true;
						}
					}
				}, */
				model: 'CreateTypeFk',
				sortOrder: 1,
			},
			{
				groupId: 'default',
				id: 'PesId',
				label: {
					text: 'Pes',
					key: '',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementSharePesLookupService,
					showDescription: true,
					descriptionMember: 'Description',
				}),
				model: 'PesId',
				sortOrder: 2,
				visible: this.formEntity.CreateTypeFk === CreateType.Update,
			},
			{
				groupId: 'default',
				id: 'UpdateWith',
				label: {
					text: 'Update With',
				},
				type: FieldType.Radio,
				itemsSource: {
					items: [
						{ id: 1, displayName: { key: 'qto.main.wizard.create.pes.allQtoSelected', text: 'All lines with the selected Pes number' } },
						{ id: 3, displayName: { key: 'qto.main.wizard.create.pes.allAbove', text: 'All lines with the selected WIP number + all select new lines' } },
					],
				},
				model: 'UpdateWith',
				visible: this.formEntity.CreateTypeFk === CreateType.Update,
				sortOrder: 5,
			},
			{
				groupId: 'default',
				id: 'ContractId',
				label: {
					text: 'Assign Contract',
					key: 'cloud.common.dialogTitleContract',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementShareContractLookupService,
					showDescription: true,
					descriptionMember: 'Description',
				}),
				model: 'ContractId',
				sortOrder: 6,
				required: true,
			},
			{
				groupId: 'default',
				id: 'DateDelivered',
				label: {
					text: 'Date Delivered',
					key: 'qto.main.wizard.create.pes.dateDelivered',
				},
				type: FieldType.Date,
				model: 'DateDelivered',
				sortOrder: 7,
				required: true,
			},
		],
	};

	/**
	 * create/update pes process
	 * @param createDto
	 */
	public createPesDetail(createDto: ICreatePesEntity) {
		return new Promise<object>((resolve, reject) => {
			this.createPesDetailHttp(createDto).then(
				(response) => {
					const resObject = new MainDataDto(response);
					const m_StringValue = resObject.getValueAs<string>('timeStr.m_StringValue');
					const pesDto = resObject.getValueAs<object>('Pes');
					if (m_StringValue) {
						console.log(m_StringValue);
					}
					resolve(pesDto as object);
				},
				(error) => {
					reject(error as object);
				},
			);
		});
	}

	/**
	 * get contract id by qto header id
	 * @param qtoHeaderId
	 */
	public getContractId(qtoHeaderId: number) {
		return new Promise<object>((resolve, reject) => {
			this.getContractIdHttp(qtoHeaderId).then(
				(response: object)  => {
					set(this._contractIds, qtoHeaderId, response);
					resolve(response);
				},
				(error) => {
					reject(error);
				},
			);
		});
	}

	/**
	 * show dialog detail
	 * @param qtoHeaderItem
	 */
	public async execute(qtoHeaderItem: IQtoMainHeaderGridEntity | null) {
		this.formEntity.ContractId = qtoHeaderItem?.ConHeaderFk ?? -1;
		const result = await this.formDialogService.showDialog<ICreatePesEntity>({
			id: 'contract.wizard.createPes',
			headerText: { key: 'qto.main.wizard.create.pes.title' },
			formConfiguration: this.formConfig,
			entity: this.formEntity,
		});
		if (result?.closingButtonId === StandardDialogButtonId.Ok) {
			this.handleOk(result);
		} else {
			this.handleClose(result);
		}
	}

	private handleOk(result?: IEditorDialogResult<ICreatePesEntity>) {
		if (result && result.value) {
			this.createPesDetail(result.value).then((res) => {
				console.log(res);
				// TODO: data service refresh
				// this.qtoMainDetailGridDataService.load({id:-1});
			});
		}
	}

	private handleClose(result?: IEditorDialogResult<ICreatePesEntity>) {
		/*if(result&&result.value) {
			result.value.ContractId = -1;
			result.value.PesId = -1;
			result.value.CreateTypeFk = 1;
			result.value.DateDelivered = '';
			result.value.UpdateWith = 1;
		}*/
		this.formEntity = {
			CreateTypeFk: 1,
			PesId: -1,
			UpdateWith: 1,
			ContractId: -1,
			DateDelivered: '',
			QtoHeaderFk: this._qtoHeaderId,
		};
	}

	/**
	 * get qto header id
	 * @constructor
	 */
	public get QtoHeaderId(): number {
		return this._qtoHeaderId;
	}

	/**
	 * set qto header id
	 * @param value
	 * @constructor
	 */
	public set QtoHeaderId(value: number) {
		this._qtoHeaderId = value;
	}

	/**
	 * get contract ids
	 * @constructor
	 */
	public get ContractIds(): object {
		return this._contractIds;
	}

	/**
	 * get data list by qto header id
	 */
	public async getListByQtoHeaderId() {
		return await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'qto/main/detail/GetListByQtoHeaderId', { params: { qtoHeaderId: this._qtoHeaderId, type: 'pes' } }));
	}

	/**
	 * post to create or update
	 * @param createDto
	 */
	public async createPesDetailHttp(createDto: ICreatePesEntity) {
		return await firstValueFrom(this.http.post(this.configService.webApiBaseUrl + 'qto/main/createpes/createpesdetail', createDto));
	}

	/**
	 * get contract id by qto header id
	 * @param id
	 */
	public async getContractIdHttp(id: number) {
		return await firstValueFrom(this.http.get(this.configService.webApiBaseUrl + 'qto/main/header/getcontractid', { params: { qtoHeaderId: id } }));
	}

	private filters = [
		{
			key: 'prc-conHeader-for-createPes-filter',
			serverKey: 'prc-conHeader-for-createPes-filter',
			serverSide: true,
			fn: () => {
				const contractObj = new MainDataDto(this._contractIds);
				return {
					ContractIds: contractObj.getValueAs<number[]>(this._qtoHeaderId.toString()) ?? [],
				};
			},
		},
	];
}
