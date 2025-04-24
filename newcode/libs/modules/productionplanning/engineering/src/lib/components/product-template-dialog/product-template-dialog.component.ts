/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { createLookup, FieldType, GridComponent, IGridConfiguration } from '@libs/ui/common';
import { IPpsProductTemplateEntityGenerated, PpsSharedDrawingDialogLookupService } from '@libs/productionplanning/shared';
import { EngineeringTaskDataService } from '../../services/engineering-task-data.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IEngTaskEntity } from '../../model/entities/eng-task-entity.interface';
import { EngineeringProductTemplateDataService } from '../../services/engineering-product-template-data.service';

/**
 * Default lookup grid dialog
 */
@Component({
	selector: 'productionplanning-engineering-product-template-dialog',
	templateUrl: './product-template-dialog.component.html',
	styleUrls: ['./product-template-dialog.component.scss'],
})
export class ProductTemplateDialogComponent implements OnInit {
	@ViewChild('gridHost')
	private gridHost: GridComponent<IPpsProductTemplateEntityGenerated> | undefined;
	private parentSelected!: IEngTaskEntity;

	public get selectedEntities() {
		return this.gridHost!.selection;
	}

	private cacheData: IPpsProductTemplateEntityGenerated[] = []; // current page data
	public loading: boolean = false;
	public configuration: IGridConfiguration<IPpsProductTemplateEntityGenerated> = {
		uuid: '',
		columns: [],
		items: [],
	};

	public constructor(
		private parentService: EngineeringTaskDataService,
		private dataService: EngineeringProductTemplateDataService,
		private readonly http: HttpClient,
		private readonly configService: PlatformConfigurationService,
	) {}

	public async refresh() {
		this.loading = true;
		if (this.parentSelected) {
			this.cacheData = await firstValueFrom(
				this.http.get<IPpsProductTemplateEntityGenerated[]>(this.configService.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/listthatreadyforengtask?engDrawingId=' + this.parentSelected.EngDrawingFk),
			);
			this.search('', null);
		}
		this.loading = false;
	}

	public async ok() {
		this.loading = true;
		this.selectedEntities.forEach((e) => {
			e.EngTaskFk = this.parentSelected.Id;
		});
		this.dataService.setModified(this.selectedEntities);
		this.loading = false;
		return this.dataService.hasModifiedFor(this.parentSelected);
	}

	private initConfig() {
		this.configuration = {
			uuid: 'e75791176aec4352aa5ffbe71ed0f25b',
			//skipPermissionCheck: true,
			items: [],
			columns: [
				{
					id: 'code',
					model: 'Code',
					type: FieldType.Code,
					label: {
						text: 'Code',
						key: 'cloud.common.entityCode',
					},
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'desc',
					model: 'DescriptionInfo',
					type: FieldType.Translation,
					label: {
						text: 'Description',
						key: 'cloud.common.entityDescription',
					},
					width: 120,
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'drawing',
					label: {
						text: '*Drawing',
						key: 'productionplanning.producttemplate.entityEngDrawingFk',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: PpsSharedDrawingDialogLookupService,
					}),
					model: 'EngDrawingFk',
					visible: true,
					sortable: true,
					readonly: true,
				},
				{
					id: 'drawingdesc',
					label: {
						text: '*Drawing Desc',
						key: 'productionplanning.producttemplate.engDrawingDescription',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: PpsSharedDrawingDialogLookupService,
						displayMember: 'Description',
					}),
					model: 'EngDrawingFk',
					visible: true,
					sortable: true,
					readonly: true,
				},
			],
		};
	}

	public async ngOnInit() {
		this.parentSelected = this.parentService.getSelectedEntity()!;
		this.loading = true;
		this.initConfig();
		await this.refresh();
		this.loading = false;
	}

	public search(filter: string, event: Event | null): void {
		this.configuration = {
			...this.configuration,
			items: filter.length > 0 ? [...this.cacheData.filter((e) => e.Code?.toLowerCase().includes(filter.toLowerCase()) || e.DescriptionInfo?.Translated?.toLowerCase().includes(filter.toLowerCase()))] : [...this.cacheData],
		};
	}
}
