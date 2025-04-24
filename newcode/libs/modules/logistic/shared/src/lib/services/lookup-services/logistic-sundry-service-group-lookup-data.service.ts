/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { SchedulingControllingGroupListLookup, SchedulingControllingGroupDetailLookup } from '@libs/scheduling/shared';
import { forkJoin, Observable, lastValueFrom, tap } from 'rxjs';
import * as _ from 'lodash';
import { BasicsSharedSundryNominalDimensionAssignmentLookupService } from '@libs/basics/shared';
import { LogisticCommonContextService } from '../common/logistic-common-context.service';

/**
 * Logistic sundry service lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class LogisticSundryServiceGroupLookupDataService<T extends object = object> {
	private accountInstance? : T;
	private nominalDimensionAssignments : T[] = [];
	private controllingUnitGroups : T[] = [];
	private controllingUnitDetails : T[] = [];
	private logisticContext = inject(LogisticCommonContextService);
	private sundryNominalDimensionAssignmentLookupService = inject(BasicsSharedSundryNominalDimensionAssignmentLookupService);
	private schedulingControllingGroupListLookup = inject(SchedulingControllingGroupListLookup);
	private schedulingControllingGroupDetailLookup = inject(SchedulingControllingGroupDetailLookup);


	public getSundryNominalDimensionAssignments() {
		return this.nominalDimensionAssignments;
	}

	public getControllingUnitGroups() {
		return this.controllingUnitGroups;
	}

	public getControllingUnitDetails(groupId: number) {
		return (groupId > 0) ? _.filter(this.controllingUnitDetails, {ControllinggroupFk: groupId}) : [];
	}

	private loadAssignmentData(): Observable<T[]>{
		const endPointLookup = this.sundryNominalDimensionAssignmentLookupService as unknown as UiCommonLookupEndpointDataService<T>;
		return endPointLookup.getList().pipe(
			tap(list => this.nominalDimensionAssignments = list));
	}

	private loadGroupData(): Observable<T[]>{
		const endPointLookup = this.schedulingControllingGroupListLookup as unknown as UiCommonLookupEndpointDataService<T>;
		return endPointLookup.getList().pipe(
			tap(list => this.controllingUnitGroups = list));
	}

	private loadDetailData(): Observable<T[]>{
		const endPointLookup = this.schedulingControllingGroupDetailLookup as unknown as UiCommonLookupEndpointDataService<T>;
		return endPointLookup.getList().pipe(
			tap(list => this.controllingUnitDetails = list));
	}

	public async loadLookupData(): Promise<void>{
		await lastValueFrom(
			forkJoin([
				this.loadAssignmentData(),
				this.loadGroupData(),
				this.loadDetailData()
			])
		);
	}

	public async reload(): Promise<void>{
		return this.loadLookupData();
	}

	public getAccount(): T {
		if (!this.accountInstance) {
			const accountData = this.getSundryNominalDimensionAssignments();
			const logisticContext = this.logisticContext.getLogisticContextFk();

			// filter for context, see also controlling unit context
			this.accountInstance = _.first(_.filter(accountData, {ContextFk: logisticContext})) as T;
		}
		return this.accountInstance;
	}

}
