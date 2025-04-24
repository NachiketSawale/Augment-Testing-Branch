/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntitySelection, IReadOnlyField} from '@libs/platform/data-access';
import {InjectionToken} from '@angular/core';
import {BusinesspartnerSharedEvaluationDataService} from './evaluation-data.service';
import {get} from 'lodash';
import {FormRow} from '@libs/ui/common';
import { IEvaluationChangedParam, IEvaluationEntity, IEvaluationGetTreeResponse, IExtendCreateOptions, IExtendDataReadParams, IExtendUpdateOptions } from '@libs/businesspartner/interfaces';


export const EvaluationBaseServiceToken = new InjectionToken<EvaluationBaseService<object, object>>('evaluation-base-service');

export abstract class EvaluationBaseService<PT extends object, MT extends object> {
	public abstract permissionUuid: string;

	public abstract getMainService(): IEntitySelection<MT>;

	public abstract getParentService(): IEntitySelection<PT>;

	private readonly parentService: IEntitySelection<PT> | undefined = undefined;

	public get evalClerkQualifier() {
		return 'businesspartner.main.evaluation.clerk';
	}

	public get evalGroupClerkQualifier() {
		return 'businesspartner.main.evalgroup.clerk';
	}

	public get evalSubGroupClerkQualifier() {
		return 'businesspartner.main.evalsubgroupdata.clerk';
	}

	public isLoadAutomatically(): boolean {
		return !!this.parentService?.getSelectedEntity();
	}

	public getDialogTitleTranslation() {
		return 'businesspartner.main.screenEvaluatoinDailogTitle';
	}

	public getModuleName() {
		return '';
	}

	public getEvaluationDataItemName() {
		return 'BusinessPartnerEvaluation';
	}

	public disabledCreate(parentService: IEntitySelection<PT>): boolean {
		return !parentService.getSelectedEntity();
	}

	public onServiceInitialized(service: IEntitySelection<IEvaluationEntity>) {
		return service;
	}

	public extendCreateOptions(createOptions: IExtendCreateOptions, parentService?: IEntitySelection<PT>, evaluationTreeService?: BusinesspartnerSharedEvaluationDataService<PT, MT>) {
		return createOptions;
	}

	public extendUpdateOptions(updateOptions: IExtendUpdateOptions, parentService?: IEntitySelection<PT>, evaluationTreeService?: BusinesspartnerSharedEvaluationDataService<PT, MT>) {
		return updateOptions;
	}

	public extendDataColumns(columns: FormRow<IEvaluationEntity>[]) {
		return [...columns];
	}

	public extendDataReadParams(readData: IExtendDataReadParams) {
		let id: number = this.getIfSelectedIdElse(-1, this.parentService);
		if (this.parentService?.getSelection() && this.parentService.getSelection().length > 0) {
			const selected = this.parentService.getSelection()[0];
			id = get(selected, 'Id', -1) as number;
		}
		readData.filter = '?MainItemId=' + id;
	}

	public onDataReadComplete(readItems: IEvaluationGetTreeResponse, parentService: IEntitySelection<PT>, evaluationTreeService: BusinesspartnerSharedEvaluationDataService<PT, MT>) {
	}

	public onEvaluationChanged(arg: IEvaluationChangedParam) {
	}

	public extendReadonlyFields(readonlyFields: IReadOnlyField<IEvaluationEntity>[]) {
		return readonlyFields;
	}

	public extendDetailColumns(columns: FormRow<IEvaluationEntity>[]) {
		return [...columns];
	}

	public getChartTitle(parentNode: IEvaluationEntity, parentService: IEntitySelection<PT>): string {
		let title = '';
		if (parentNode && parentService?.getSelection() && parentService.getSelection().length > 0) {
			const evaluationSchemaDescription = parentNode.EvaluationSchemaDescription ?? '';
			const selected = parentService.getSelection()[0];
			const bpName1 = get(selected, 'BusinessPartnerName1', '');
			title = evaluationSchemaDescription + ' - ' + bpName1;
		}

		return title;
	}

	public onContainerCreate(parentService: IEntitySelection<PT>, evaluationTreeService: BusinesspartnerSharedEvaluationDataService<PT, MT>) {
		// Extend something when controller creating.
	}

	public onContainerDestroy(parentService: IEntitySelection<PT>, evaluationTreeService: BusinesspartnerSharedEvaluationDataService<PT, MT>) {
		// Clear you data when controller destroy.
	}

	public onHandleReadSucceeded(){
		// replace registerHandleReadSucceeded,
	}

	public getIfSelectedIdElse(elseValue: number, service?: IEntitySelection<PT | MT>): number {
		let id: number = elseValue;
		if (service?.getSelection() && service.getSelection().length > 0) {
			const selected = service.getSelection()[0];
			id = get(selected, 'Id', id) as number;
		}
		return id;
	}

	public provideLoadPayload() {
		const parentService = this.getParentService();
		let id: number = this.getIfSelectedIdElse(-1, this.parentService);
		if (parentService?.hasSelection()) {
			id = parentService.getSelectedIds()[0].id;
		}
		return { mainItemId: id };
	}
}
