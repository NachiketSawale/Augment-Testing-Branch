/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { PlatformHttpService } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { EstimateMainBoqCompleteEntity } from './estimate-main-boq-complete-entity.service';
@Injectable({
	providedIn: 'root'
})
export class EstimateMainBoqHeaderService {
	protected http = inject(PlatformHttpService);
	public queryPath = 'boq/project/list';
	private boqCompositeEntityCache: { [key: number]: IBoqItemEntity[] } = {};
	private boqCatDataCache: { [key: number]: IBoqItemEntity[] } = {};

	/**
	 * Fetches a list of boq header for a given project ID, optionally bypassing the cache.
	 * @param projectId The ID of the project for which to fetch boq header.
	 * @param refresh If true, forces a refresh from the server, bypassing any cached data.
	 * @returns An Observable emitting an array of IEstBoqItemEntity objects.
	 */
	public getListByprojectId(projectId: number, refresh: boolean = false): Observable<IBoqItemEntity[]> {
		return new Observable((observer) => {
			// Checks cache first unless a refresh is requested.
			if (this.boqCompositeEntityCache[projectId] && !refresh) {
				observer.next(this.boqCompositeEntityCache[projectId]);
				observer.complete();
			} else {
				const params = new HttpParams()
					.set('projectId', projectId);
				this.http.get$( this.queryPath,{params: params}).subscribe( (res:unknown)=> {
					const dataList:IBoqItemEntity[] =[];
					const data = res as EstimateMainBoqCompleteEntity[];
					data.forEach(item=>{
						dataList.push(item.BoqRootItem);
					});
					this.boqCompositeEntityCache[projectId] = dataList;
					observer.next(dataList);
					observer.complete();
				});
			}
		});
	}
	/**
	 * Searches for boq items based on various criteria.
	 * @param projectId The ID of the project to search within.
	 * @param boqHeaderId The foreign key of the boq header, if applicable.
	 * @param filter A string filter to apply to the search.

	 * @returns An Observable emitting an array of IEstLineItemEntity objects matching the search criteria.
	 * used
	 */
	public search(projectId: number, boqHeaderId: number, filter: string): Observable<IBoqItemEntity[]> {
		const params = new HttpParams()
			.set('projectId', projectId)
			.set('filterValue', filter)
			.set('boqHeaderId', boqHeaderId);
		return new Observable((observer) => {
			this.http.get$<IBoqItemEntity[]>('boq/project/getboqsearchlist',{ params: params }).subscribe((res: IBoqItemEntity[]) => {
				observer.next(res);
				observer.complete();
			});
		});
	}
	public getList(projectId: number, refresh: boolean = false): Observable<IBoqItemEntity[]> {
		return new Observable((observer) => {
			if (this.boqCatDataCache[projectId] && !refresh) {
				observer.next(this.boqCatDataCache[projectId]);
				observer.complete();
			} else {
				const params = new HttpParams()
					.set('projectId', projectId);
				this.http.get$(this.queryPath ,{params: params}).subscribe((res) => {
					const items = res as IBoqItemEntity[];
					if (this.isSectionLoaded(projectId, items)) {
						items.forEach((item) => {
							item.Id = projectId;
						});
					}
					this.boqCatDataCache[projectId] = items; // Update cache with new data.
					observer.next(items);
					observer.complete();
				});
			}
		});
	}
	/**
	 * Checks if the section data for a given project ID is already loaded.
	 * @param projectId The ID of the project to check.
	 * @param data The array of boq items to search through.
	 * @returns True if the section is loaded, false otherwise.
	 */
	private isSectionLoaded(projectId: number, data: IBoqItemEntity[]) {
		return data.length > 0 && data.findIndex((item) => item.Id == projectId) !== -1;
	}
}