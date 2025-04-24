/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import {
	IEngDrawingComponentEntityGenerated,
	PpsSharedDrawingComponentDataService
} from '@libs/productionplanning/shared';
import { BasicsSharedNewEntityValidationProcessorFactory } from '@libs/basics/shared';

import { PpsItemDataService } from '../pps-item-data.service';
import { IPPSItemEntity, PPSItemComplete } from '../../model/models';
import { PpsItemPickComponentDialogService } from './pps-item-pick-component-dialog.service';
import {
	PpsItemProductTemplateComponentValidationService
} from './pps-item-product-template-component-validation.service';
import { isNull } from 'lodash';


@Injectable({
	providedIn: 'root'
})
export class PpsItemProductTemplateComponentDataService extends PpsSharedDrawingComponentDataService<IEngDrawingComponentEntityGenerated, IPPSItemEntity, PPSItemComplete>{

	private static cacheMap: Map<string, PpsItemProductTemplateComponentDataService> = new Map();
	private pickComponentDialogService: PpsItemPickComponentDialogService = inject(PpsItemPickComponentDialogService);
	private readonly validationProcessor = inject(BasicsSharedNewEntityValidationProcessorFactory);

	public static getInstance(uuid: string, parentService?: PpsItemDataService): PpsItemProductTemplateComponentDataService | undefined{
		let instance = this.cacheMap.get(uuid);
		if(instance === undefined && parentService !== undefined){
			instance = new PpsItemProductTemplateComponentDataService(parentService);
			this.cacheMap.set(uuid, instance);
		}
		return instance;
	}

	public constructor(parentService: PpsItemDataService) {
		super(
			{
				parentService: parentService,
				endPoint: 'getbyproductdesc',
				useLocalResource: false,
				productTemplateKey: 'ProductDescriptionFk',
				drawingKey: ''
			});

		this.processor.addProcessor(this.provideNewEntityValidationProcessor());
	}

	public getParentItem(){
		return  this.getSelectedParent();
	}

	public override canCreate(): boolean {
		return this.getSelectedParent() !== undefined;
	}

	public override canDelete(): boolean {
		return this.getSelectedEntity() !== null;
	}

	public override registerModificationsToParentUpdate(complete: PPSItemComplete, modified: IEngDrawingComponentEntityGenerated[], deleted: IEngDrawingComponentEntityGenerated[]): void {
		if (modified && modified.some(() => true)) {
			complete.DrawingComponentsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			complete.DrawingComponentsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: PPSItemComplete): IEngDrawingComponentEntityGenerated[] {
		if (complete && !isNull(complete.DrawingComponentsToSave)) {
			return complete.DrawingComponentsToSave;
		}
		return [];
	}

	public assignQuantityDialog(){

	}

	public pickComponentDialog(ppsItem: IPPSItemEntity){
		this.pickComponentDialogService.showDialog(ppsItem);
	}

	//public fieldChanged(){}

	public disabledFn () {
		return this.getSelectedParent() === undefined ? true : this.getSelectedParent()?.ProductDescriptionFk === null;
	}

	private provideNewEntityValidationProcessor() {
		return this.validationProcessor.createProcessor(PpsItemProductTemplateComponentValidationService, {
			moduleSubModule: 'ProductionPlanning.Drawing',
			typeName: 'EngDrawingComponentDto'
		});
	}
}