/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable , inject } from '@angular/core';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { IBoqStructureEntity } from '@libs/boq/interfaces';
import { PlatformHttpService } from '@libs/platform/common';
import * as _ from 'lodash';
import { BoqItemDataService } from './boq-main-boq-item-data.service';

@Injectable({providedIn: 'root'})

export class BoqMainCopyoptionsDialogService {
	private formDialogService : UiCommonFormDialogService;
	private isToBeSaved: boolean = true;
	private boqItemDataService: BoqItemDataService = inject(BoqItemDataService);
	public constructor(private http : PlatformHttpService) {
		this.formDialogService = inject(UiCommonFormDialogService);
	}

	/**
	 * copy options configuration data.
	 */
	public copyOptionsFormConfig: IFormConfig<IBoqStructureEntity> = {
		formId: 'copy-options-dialog-form',
		showGrouping: false,
		rows: [
			{
				id: 'keepRefNo',
				label: 'boq.main.KeepRefNo',
				type: FieldType.Boolean,
				model: 'KeepRefNo'
			},
			{
				id: 'keepQuantity',
				label: 'boq.main.KeepQuantity',
				type: FieldType.Boolean,
				model: 'KeepQuantity'
			},
			{
				id: 'keepUnitRate',
				label: 'boq.main.KeepUnitRate',
				type: FieldType.Boolean,
				model: 'KeepUnitRate'
			},
			{
				id: 'keepBudget',
				label: 'boq.main.KeepBudget',
				type: FieldType.Boolean,
				model: 'KeepBudget'
			},
			{
				id: 'autoAtCopy',
				label: 'boq.main.autoInsert',
				type: FieldType.Boolean,
				model: 'AutoAtCopy'
			},
			{
				id: 'copyEstimateOrAssembly',
				label: 'boq.main.CopyEstimateOrAssembly',
				type: FieldType.Boolean,
				model: 'CopyEstimateOrAssembly'
			}
		]
	};

	/**
	 * copyOptions dialog form controls data.
	 */
	public boqStructure: IBoqStructureEntity = {
		Id:0,
		AutoAtCopy:true,
		KeepRefNo:false,
		KeepQuantity:true,
		KeepUnitRate:true,
		CopyEstimateOrAssembly:true,
		KeepBudget:true,
		//TODO-BOQ-Below fields are now required as per new schematics entity generation similar to server dto, but as discussed with silvio we should not do like this. Needs further discussion on this with silvio.
		BoqRoundingConfigFk: 0, CalcFromUrb: false, DefaultSpecification: false, DiscountAllowed: false, EnforceStructure: false, Isdefault: false, LeadingZeros: false, SectionAllowed: false, SkippedHierarchiesAllowed: false, Sorting: 0, SpecificationLimit: 0, TotalHour: false,
	};

	/**
	 * Method opens the copy options dialog.
	 */
	public async openCopyOptionsDialog() {
		await this.formDialogService.showDialog<IBoqStructureEntity>({
			id: 'copyOpt',
			headerText: 'boq.main.copyOptions',
			formConfiguration: this.copyOptionsFormConfig,
			entity: this.boqStructure,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
		})?.then(result => {
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				this.handleOk(result);
			}
		});
	}

	/**
	 * Method handles 'Ok' button functionality.
	 *
	 * @param {IFormDialogResultInterface<IBoqStructureEntity>} result Dialog result.
	 */
	private handleOk(result: IEditorDialogResult<IBoqStructureEntity>) {
		const SaveCopyOptionsRequest = { 'BoqHeaderId': this.boqItemDataService.getSelectedBoqHeaderId(), 'BoqStructure':  this.boqStructure };
		if (this.isToBeSaved) {
			this.http.post$('boq/main/type/savecopyoptions', SaveCopyOptionsRequest).subscribe();
		} else {
			// Todo-BOQ:'boqMainDocPropertiesService' & relevant functions will be migrated.
		}
	}

	public startByBoqStructure(boqHeaderId: number | undefined, boqStructure: IBoqStructureEntity | undefined, isTtoBeSaved: boolean, isProcurementBoq: boolean, isCrbBoq: boolean, isOenBoq: boolean) {
		//TODO-BOQ : Migrated as old client , will be used in future.

	// 	const options = [
	// 		{ key: 'KeepRefNo',              enabled: !isCrbBoq && !isOenBoq },
	// 		{ key: 'KeepQuantity',           enabled: true },
	// 		{ key: 'KeepUnitRate',           enabled: true },
	// 		{ key: 'KeepBudget',             enabled: !isOenBoq },
	// 		{ key: 'AutoAtCopy',             enabled: !isCrbBoq && !isOenBoq },
	// 		{ key: 'CopyEstimateOrAssembly', enabled: !isProcurementBoq && !isOenBoq } ];
	}

	public start () {
	 if(this.boqStructure !== undefined ){
		 this.boqStructure = <IBoqStructureEntity>this.boqItemDataService.getSelectedBoqStructure();
	 }
		this.startByBoqStructure(this.boqItemDataService.getSelectedBoqHeaderId(), this.boqStructure, true, _.startsWith(this.boqItemDataService.getServiceName(),'proc'), false, false );
	}

	public isDisabled () {
		const boqStructure = this.boqItemDataService.getSelectedBoqStructure();
		return this.boqItemDataService.getReadOnly() || !(boqStructure && Object.prototype.hasOwnProperty.call(boqStructure, 'Id'));
	}
}
