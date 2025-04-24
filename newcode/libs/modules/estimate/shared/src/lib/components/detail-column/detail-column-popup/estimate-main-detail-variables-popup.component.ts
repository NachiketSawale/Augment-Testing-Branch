/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, EventEmitter, inject, InjectionToken, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivePopup, ControlContextInjectionToken, FieldType, IGridApi, IGridConfiguration, MouseEvent } from '@libs/ui/common';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { IVariablesEntity } from './estimate-main-detail-variables-entity.interface';
import { Subscription } from 'rxjs';
import { EstimateMainContextService } from '../../../common/services/estimate-main-context.service';
import { HttpClient } from '@angular/common/http';
import { IEstimateRuleParameterBaseEntity } from '../../../rule/services/model/estimate-rule-parameter-base-entity.interface';
import { forEach } from 'lodash';


@Component({
	templateUrl: 'estimate-main-detail-variables-popup.component.html',
	styleUrl: 'estimate-main-detail-variables-popup.component.scss',
})
export class EstimateMainDetailVariablesPopupComponent implements OnInit, AfterViewInit, OnDestroy{
	private readonly translateService = inject(PlatformTranslateService);
	protected readonly varPopupWinTitle = this.translateService.instant('estimate.main.selectionOfSystemValNVar').text;
	private activePopup = inject(ActivePopup);
	@ViewChild('grid') private grid!: IGridApi<IVariablesEntity>;
	private subscriptionMap = new Map<string, Subscription>();
	private readonly controlContext = inject(ControlContextInjectionToken);
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly http = inject(HttpClient);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly keyFilterEvent = inject(KeyFilterEventToken);


	public ngOnInit() {
		this.varGridConfig = {
			uuid: 'b57bf1317165451aa108e5cc4b66a994',
			columns: [
				{
					id: 'valType',
					model: 'VarType',
					type: FieldType.Description,
					label: {
						text: 'Type',
						key: 'estimate.main.type'
					},
					visible: true,
					sortable: false,
					readonly: true,
					width: 80
				},
				{
					id: 'code',
					model: 'Code',
					type: FieldType.Code,
					label: {
						text: 'Code',
						key: 'cloud.common.entityCode'
					},
					visible: true,
					sortable: false,
					readonly: true,
					width: 160
				},
				{
					id: 'Description',
					model: 'Description',
					type: FieldType.Description,
					label: {
						text: 'Description',
						key: 'cloud.common.entityDescription'
					},
					visible: true,
					sortable: false,
					readonly: true,
					width: 200
				}
			],
			globalEditorLock: false,
			items: this.defaultData,
			skipPermissionCheck: true
		};


		// load variables of current entity
		const entity = this.controlContext.entityContext.entity;
		if(entity && 'EstLineItemFk' in entity && 'EstHeaderFk' in entity){
			const projectFk = this.estimateMainContextService.getProjectId() || 0;

			this.http.post(this.configService.webApiBaseUrl + 'estimate/main/lineitem/getlineitemparameter', {
				Dto: {
					EstHeaderFk: entity.EstHeaderFk,
					Id: entity.EstLineItemFk,
					ProjectFk: projectFk
				},
				ParamLevel: 3,
				IsVistorResult: true
			}).subscribe(res => {
				if(res){
					const list = res as IEstimateRuleParameterBaseEntity[];
					forEach(list, item=>{
						this.allVariables.push({
							Id: item.Id,
							VarType: '',
							Code: item.Code,
							Description: item.DescriptionInfo!.Translated||'',
						});
					});

					this.resetGrid([...this.defaultData, ...this.allVariables]);
				}
			});
		}

		this.keyFilterEvent.subscribe(val =>{
			this.filterVariables(val);
		});
	}

	public ngAfterViewInit(): void {
		if (this.grid) {
			this.subscriptionMap.set('gridMouseClick', this.grid.mouseClick.subscribe((e: MouseEvent<IVariablesEntity>) => {
				e.originalEvent.stopImmediatePropagation();
				if (this.grid.selection.length > 0) {
					this.activePopup.close(
						{
							apply: true,
							result: this.grid.selection[0]
						}
					);
				}
			}));
			this.subscriptionMap.set('gridMouseEnter', this.grid.mouseEnter.subscribe((e: MouseEvent<IVariablesEntity>) => {
				this.grid.selection = [e.item];
			}));
		}
	}

	protected varGridConfig!: IGridConfiguration<IVariablesEntity>;

	private resetGrid(items: IVariablesEntity[]) {
		this.varGridConfig = {
			...this.varGridConfig,
			columns: [...(this.varGridConfig.columns||[])],
			items: [...items]
		};
	}

	private defaultData : IVariablesEntity[] = [
		{
			Id: -1,
			VarType: 'System',
			Code: '_WQQuantity',
			Description: 'WQ Quantity',
		},
		{
			Id: -2,
			VarType: 'System',
			Code: '_AQQuantity',
			Description: 'AQ Quantity',
		},
		{
			Id: -3,
			VarType: 'System',
			Code: '_TotalQuantity',
			Description: 'Total Quantity',
		}
	];

	private allVariables : IVariablesEntity[] = [];

	public ngOnDestroy(): void {
		this.subscriptionMap.forEach(e => {
			if (!e.closed) {
				e.unsubscribe();
			}
		});
		this.subscriptionMap.clear();
	}

	private filterVariables(key: string) {
		let allList = [...this.defaultData, ...this.allVariables];
		if(key && key.length > 0) {
			allList = allList.filter(d => d.Code.toLowerCase().indexOf(key.toLowerCase()) >= 0);
		}

		this.resetGrid(allList);
	}

}

export const KeyFilterEventToken = new InjectionToken<EventEmitter<string>>('key-filter-event');