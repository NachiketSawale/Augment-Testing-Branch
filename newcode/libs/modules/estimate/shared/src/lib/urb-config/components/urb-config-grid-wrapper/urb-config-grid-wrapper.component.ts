/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IUrb2CostCode, IUrbConfigEntity } from '../../model/urb-config-entity.interface';
import { ControlContextInjectionToken } from '@libs/ui/common';
import { EstShareUrbConfigGridWrapperDataService } from './urb-config-grid-wrapper-data.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'estimate-shared-urb-config-grid-wrapper',
	templateUrl: './urb-config-grid-wrapper.component.html',
	styleUrl: './urb-config-grid-wrapper.component.scss',
})
export class EstimateSharedUrbConfigGridWrapperComponent implements OnInit, OnDestroy{

	private readonly controlContext = inject(ControlContextInjectionToken);
	private readonly dataService = inject(EstShareUrbConfigGridWrapperDataService);

	private _entity?:IUrbConfigEntity;
	private subscribe?: Subscription | undefined;

	public constructor() {
	}

	public ngOnInit(): void {
		this._entity = this.controlContext.entityContext.entity as IUrbConfigEntity;

		this.dataService.setCurrentEntity(this._entity);

		this.subscribe = this._entity.EntityChange.subscribe(data=>{
			this._entity = this.controlContext.entityContext.entity as IUrbConfigEntity;
			this.dataService.setCurrentEntity(this._entity);
			this.projectId = this._entity.ProjectId;
			this.loadUrbConfig();
		});

		this.projectId = this._entity.ProjectId;

		if(this._entity.OpenFromCreateBid && !this._entity.ProjectId && !this._entity.BoqHeaderId){
			return;
		}
		this.loadUrbConfig();
	}

	private loadUrbConfig(){
		if(this._entity?.EstUppConfigTypeFk){
			this.dataService.loadByUrbConfigType(this._entity.EstUppConfigTypeFk).subscribe(res =>{
				this.urb2CostCodes = res;
			});
		}else if(this._entity?.EstUppConfigFk){
			this.dataService.loadByUrbConfig(this._entity.EstUppConfigFk).subscribe(res=>{
				this.urb2CostCodes = res;
			});
		}else{
			this.dataService.loadByDefault().subscribe(res =>{
				this.urb2CostCodes = res;
			});
		}
		this.createNewModel = !this._entity?.EstUppConfigTypeFk;
	}

	protected urb2CostCodes?: IUrb2CostCode[];

	protected projectId?: number | undefined;

	protected createNewModel?: boolean | undefined;

	public ngOnDestroy(): void {
		if(this.subscribe){
			this.subscribe.unsubscribe();
		}
	}


}
