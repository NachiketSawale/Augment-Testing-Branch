/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IBasicsUomEntity } from '@libs/basics/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ValidationInfo } from '@libs/platform/data-access';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

/**
 * EstimateMainDurationCalculatorService is the data service for line item duration calculations.
 */
export class EstimateMainDurationCalculatorService {

	public getDuration(lineitem: ValidationInfo<IEstLineItemEntity>): Observable<number | null> {
		const fromDate = lineitem.entity.FromDate;
		const toDate = lineitem.entity.ToDate;
		let uomItem: IBasicsUomEntity | null = null;

		if (!fromDate || !toDate || Date.parse(toDate) < Date.parse(fromDate)) {
			return of(null);
		}

		if (lineitem.entity.BasUomFk != null) {
			return this.getUomItem(lineitem.entity.BasUomFk).pipe(
				switchMap((data: IBasicsUomEntity | null) => {
					uomItem = data;

					if (!uomItem) {
						return of(null);
					}
					
					return uomItem.Id != null ? this.getUomItem(uomItem.Id).pipe(
						switchMap((uomItem: IBasicsUomEntity | null) => {
							if (!uomItem) {
								return of(null);
							}

							switch (uomItem.UomTypeFk) {
								case 3: // Arbeitstage laut Kalender
									return lineitem.entity.ProjectFk != null ? this.getWorkingDaysFrmCalendar(fromDate, toDate, lineitem.entity.ProjectFk) : of(null);
								case 4: // Woche
									return (fromDate != null && toDate != null) ? this.getWeeks(fromDate, toDate) : of(0);
								case 5: // Monat
									return (fromDate != null && toDate != null) ? this.getMonths(fromDate, toDate) : of(0);
								case 6: // Jahr
									return (fromDate != null && toDate != null) ? this.getYears(fromDate, toDate) : of(0);
								case 7: // Arbeitsstunden laut Kalender
									return (fromDate != null && toDate != null && lineitem.entity.ProjectFk != null) ? this.getWorkingHoursFrmCalendar(fromDate, toDate, lineitem.entity.ProjectFk) : of(null);
								default:
									return of(this.getDays(fromDate, toDate));
							}
						})
					) : of(0);
				})
			);
		} else {
			return of(null);
		}
	}

	private getUomItem(basUomFk: number): Observable<IBasicsUomEntity> {
		//TODO : waiting for basicsUnitLookupDataService service
		const uomItem: IBasicsUomEntity = {
			Id: basUomFk ?? 1,
			UomTypeFk: basUomFk
		};

		return of(uomItem);
	}

	private getWorkingHoursFrmCalendar(lineitemFromDate: string, lineitemToDate: string, prjProjectFk: number): Observable<number> {
		//TODO: waiting for calendarUtilitiesService
		//TODO: return calendarUtilitiesService.getWorkingHours(prjId, fromDate, toDate);
		return of(0);
	}

	private getWorkingDaysFrmCalendar(lineitemFromDate: string | null, lineitemToDate: string | null, prjProjectFk: number | null): Observable<number> {
		//TODO: waiting for calendarUtilitiesService
		//	TODO: return calendarUtilitiesService.getWorkingDays(prjId, fromDate, toDate);
		return of(0);
	}

	private getDays(lineitemFromDate: string | null, lineitemToDate: string | null): number {
		//TODO: waiting for Moment library here
		let result: number = 0;
		if (lineitemFromDate && lineitemToDate) {
			const fromDate = new Date(lineitemFromDate);
			const toDate = new Date(lineitemToDate);

			if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
				if (toDate.getTime() >= fromDate.getTime()) {
					const diffInMs = toDate.getTime() - fromDate.getTime();
					result = diffInMs / (1000 * 60 * 60 * 24); // Convert milliseconds to days
				}
			}
		}
		return result;
	}

	private getWeeks(lineitemFromDate: string, lineitemToDate: string): Observable<number> {
		//TODO: waiting for Moment library here
		let result: number = 0;
		if (lineitemFromDate && lineitemToDate) {
			const fromDate = new Date(lineitemFromDate);
			const toDate = new Date(lineitemToDate);

			if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
				if (toDate.getTime() >= fromDate.getTime()) {
					const diffInMs = toDate.getTime() - fromDate.getTime();
					result = diffInMs / (1000 * 60 * 60 * 24 * 7); // Convert milliseconds to weeks
				}
			}
		}
		return of(result);
	}

	private getMonths(lineitemFromDate: string, lineitemToDate: string): Observable<number> {
		//TODO: waiting for Moment library here
		let result: number = 0;
		if (lineitemFromDate && lineitemToDate) {
			const fromDate = new Date(lineitemFromDate);
			const toDate = new Date(lineitemToDate);

			if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
				if (toDate.getTime() >= fromDate.getTime()) {
					// Calculate the difference in years and months
					const yearsDiff = toDate.getFullYear() - fromDate.getFullYear();
					const monthsDiff = toDate.getMonth() - fromDate.getMonth();

					// Convert years to months and add the months difference
					result = yearsDiff * 12 + monthsDiff;
				}
			}
		}
		return of(result);
	}

	private getYears(lineitemFromDate: string, lineitemToDate: string): Observable<number> {
		//TODO: waiting for Moment library here
		let result: number = 0;
		if (lineitemFromDate && lineitemToDate) {
			const fromDate = new Date(lineitemFromDate);
			const toDate = new Date(lineitemToDate);

			if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
				if (toDate.getTime() >= fromDate.getTime()) {
					// Calculate the difference in years
					result = toDate.getFullYear() - fromDate.getFullYear();
				}
			}
		}
		return of(result);
	}

}

