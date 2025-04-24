/*
 * Copyright(c) RIB Software GmbH
 */

// TODO $log.warn() how to handle, time being added console.log

import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { forEach, keys } from 'lodash';

@Injectable({ providedIn: 'root' })
/**
 * @name EstimateCommonFilterService
 * @description
 * estimateCommonFilterServiceProvider for filtering e.g. line items container by combination of several filters.
 */
export class EstimateCommonFilterService {
	private filterObjects: { [id: string]: unknown } = {};
	private serviceToBeFiltered: unknown = null;
	private filterFunction: (() => unknown) | null = null;
	private toolbarItems: unknown[] = [];
	private isFilterBoq: boolean = false;
	private filterFunctionType: number = 0;
	public onUpdated: Subject<unknown> = new Subject<unknown>();
	public onFilterButtonRemoved: Subject<unknown> = new Subject<unknown>();

	public constructor(
		@Inject(String) private moduleName: string,
		@Inject(String) private subModuleName: string,
	) {}

	/**
	 * @name isValidDataService
	 * @methodOf EstimateCommonFilterService
	 * @description checks given service name is valid data service or not
	 * @param {string} dataService filter dataservice name
	 */
	private isValidDataService(dataService: unknown): boolean {
		// Check if dataService is a string
		if (typeof dataService === 'string') {
			console.warn('Using grid id is not supported anymore. Please use a valid data service instance.');
			return false;
		}

		// Check if dataService is not an object
		if (typeof dataService !== 'object' || dataService === null) {
			console.warn('Given data service instance is not an object.');
			return false;
		}

		// Check if necessary functions are available
		// const dataServiceInterface: unknown[] = [/* 'getList', 'markersChanged', 'gridRefresh', 'load', 'setItemFilter', 'enableItemFilter' */];
		const missingFunctions: string[] = [];

		// for (const functionName of dataServiceInterface) {
		//     // if (typeof dataService[functionName] !== 'function') {
		//     //     missingFunctions.push(functionName);
		//     // }
		// }

		if (missingFunctions.length > 0) {
			console.warn('Given data service does not provide the following function(s):\n' + missingFunctions.join(', '));
			return false;
		}
		return true;
	}

	//TODO need to check how to implement
	/*private forceRootScopeApply() {
      if (this.$rootScope.$root.$$phase !== '$apply' && this.$rootScope.$root.$$phase !== '$digest') {
          this.$rootScope.$apply();
      }
    }*/

	/**
	 * @name addFilter
	 * @methodOf EstimateCommonFilterService
	 * @description add filter for leading structures
	 * @param {string} id filter id
	 * @param {any} dataService filter data service name
	 * @param {any} predicate filter predicate
	 * @param {any} toolbarItem toolbar item
	 * @param {string} propertyName filter structure property name
	 */

	public addFilter(id: string, dataService: unknown, predicate: unknown, toolbarItem: unknown, propertyName: string): void {
		if (!this.isValidDataService(dataService)) {
			console.warn('Could not add a filter. Please check your data service instance.');
			return;
		}

		this.filterObjects[id] = {
			predicate: predicate,
			enabled: true,
			// toolbarItemId: toolbarItem.id,
			propertyName: propertyName,
			filterService: dataService,
		};

		// toolbarItem.caption = this.moduleName + '.' + this.subModuleName + '.' + (toolbarItem.captionId || toolbarItem.id);
		// toolbarItem.type = 'check';
		// toolbarItem.value = this.getFilterStatus();
		// toolbarItem.fn = () => {
		//     forEach(dataService.getList(), (item: any) => {
		//         item.IsMarked = false;
		//     });

		//     this.filterObjects[id].enabled = false;
		//     this.setFilterStatus(false);
		//     dataService.markersChanged([]); // remove filter
		//     dataService.gridRefresh();
	}

	// remove(this.toolbarItems, {id: this.filterObjects[id].toolbarItemId});
	// this.toolbarItems.push(toolbarItem);

	//TODO : forceRoot
	//this.forceRootScopeApply();

	//this.update();

	/**
	 * @name getFilterStatus
	 * @methodOf EstimateCommonFilterService
	 * @description get filter status for leading structures
	 */
	// private getFilterStatus(): boolean {
	//     return this.isFilterBoq;
	// }

	/**
	 * @name setFilterStatus
	 * @methodOf EstimateCommonFilterService
	 * @description set filter status for leading structures
	 * @param {boolean} value checks is Filter from BoQ
	 */
	private setFilterStatus(value: boolean): void {
		this.isFilterBoq = value;
	}

	/**
	 * @name removeFilter
	 * @methodOf EstimateCommonFilterService
	 * @description Remove filter from leading structures
	 * @param {string} id filter ID
	 */
	public removeFilter(id: string): void {
		if (this.filterObjects[id] == null || undefined) {
			//this.$log.warn('Tried to remove non-existing filter: ' + id);
			console.log('Tried to remove non-existing filter: ' + id);
			return;
		}

		// const filterObject = this.filterObjects[id];
		// if (filterObject.enabled) {
		//     const filterKey = this.filterObjects[id].toolbarItemId.replace('filter', '').toUpperCase();
		//     //TODO need to check how we can access setFilterIds in estimateMainFilterService
		//     /*if (typeof this.setFilterIds === 'function' && id !== 'estimateMainLineItemStructureController') {
		//         this.setFilterIds(filterKey, []);
		//     }*/
		// }

		//TODO depends on costgroup, assembliesCostGroups and Boq services

		/* if (id === 'costGroupStructureController' || id === 'estimateAssembliesCostGroupStructureController' || id === 'qtoCostGroupCatalogController') {
             // Get the createCostGroupsStructureMainDataServiceFactory
             const serviceName = filterObject.filterService.getServiceName();
             if (serviceName !== '') {
                 const costGroupStructureService = this.$injector.get(serviceName);
                 costGroupStructureService.getService().removeFilterIcon.fire('');
             }
         } else if (id === 'estimateMainWicBoqListController') {
             if (filterObject.filterService.clearWicGroupFilterIcon) {
                 filterObject.filterService.clearWicGroupFilterIcon.fire();
             }
         }*/

		// remove(this.toolbarItems, {id: this.filterObjects[id].toolbarItemId});
		delete this.filterObjects[id];

		//TODO
		//this.forceRootScopeApply();

		this.update();
	}

	/**
	 * @name removeAllFilters
	 * @methodOf EstimateCommonFilterService
	 * @description Remove all filters from leading structures
	 */
	public removeAllFilters(): void {
		forEach(keys(this.filterObjects), (id) => {
			// const filterObject = this.filterObjects[id];
			// if (filterObject.enabled) {
			//     const filterKey = this.filterObjects[id].toolbarItemId.replace('filter', '').toUpperCase();
			//     //TODO need to check how we can access setFilterIds in estimateMainFilterService
			//     /* if (typeof this.setFilterIds === 'function') {
			//         this.setFilterIds(filterKey, []);
			//     }*/
			// }
			// if (typeof filterObject.filterService === 'object') {
			//     forEach(filterObject.filterService.getList(), (item) => {
			//         item.IsMarked = false;
			//     });
			// }
			// if (typeof filterObject.filterService.clearFilterData === 'function') {
			//     filterObject.filterService.clearFilterData();
			// }
			// remove(this.toolbarItems, {id: this.filterObjects[id].toolbarItemId});
			// delete this.filterObjects[id];
		});

		//TODO below two lines
		//this.onFilterButtonRemoved.fire();
		//this.forceRootScopeApply();

		this.update();
	}

	/**
	 * @name isFilter
	 * @methodOf EstimateCommonFilterService
	 * @description check is filter or not
	 */
	private isFilter(id: string): boolean {
		return !!this.filterObjects[id];
	}

	/**
	 * @name enableFilter
	 * @methodOf EstimateCommonFilterService
	 * @description Enable filter for leading structures
	 */
	private enableFilter(id: string): void {
		if (this.filterObjects[id]) {
			//this.filterObjects[id].enabled = true;
		}
		this.update();
	}

	/**
	 * @name disableFilter
	 * @methodOf EstimateCommonFilterService
	 * @description Disable filter for leading structures
	 */
	private disableFilter(id: string): void {
		if (this.filterObjects[id]) {
			//this.filterObjects[id].enabled = false;
		}
	}

	/**
	 * @name areFiltersAvailable
	 * @methodOf EstimateCommonFilterService
	 * @description are filters are available for leading structures
	 */
	private areFiltersAvailable(): boolean {
		return Object.keys(this.filterObjects).length > 0;
	}

	/**
	 * @name getFilterObjects
	 * @methodOf EstimateCommonFilterService
	 * @description get filters objects
	 */
	public getFilterObjects(): { [id: string]: unknown } {
		return this.filterObjects;
	}

	/**
	 * @name getFilterFunctionType
	 * @methodOf EstimateCommonFilterService
	 * @description get filter function type
	 */
	public getFilterFunctionType(): number {
		return this.filterFunctionType;
	}

	/**
	 * @name setFilterFunctionType
	 * @methodOf EstimateCommonFilterService
	 * @description set filter function type
	 */
	private setFilterFunctionType(type: number): void {
		this.filterFunctionType = type;
		//const dataService = this.getServiceToBeFiltered();
		// if (dataService && typeof dataService.load === 'function') {
		//     dataService.load();
		// }
	}

	/**
	 * @name setFilterFunction
	 * @methodOf EstimateCommonFilterService
	 * @description set filter function
	 */
	public setFilterFunction(filterFunc: () => unknown): void {
		const doUpdate = filterFunc !== this.filterFunction;
		this.filterFunction = filterFunc;
		if (doUpdate && this.areFiltersAvailable()) {
			this.update();
		}
	}

	/**
	 * @name getCombinedFilterFunction
	 * @methodOf EstimateCommonFilterService
	 * @description get combined filter functions
	 */
	public getCombinedFilterFunction(): (item: unknown) => boolean {
		return (item: unknown) => {
			const result = true;
			Object.values(this.filterObjects).forEach((filterObj: unknown) => {
				// if (filterObj.enabled) {
				//     result = result && filterObj.predicate(item);
				// }
			});
			return result;
		};
	}

	/**
	 * @name getFilterFunctionAssignedAndWithoutAssignment
	 * @methodOf EstimateCommonFilterService
	 * @description get Filter Function AssignedAnd Without Assignment used in LineItems container toolbar
	 */
	// private getFilterFunctionAssignedAndWithoutAssignment(): (item: unknown) => boolean {
	//     // return (item: unknown) => {
	//     //     //return this.getCombinedFilterFunction()(item) || this.getFilterFunctionWithoutAssignment()(item);
	//     // };
	// }

	/**
	 * @name getFilterFunctionWithoutAssignment
	 * @methodOf EstimateCommonFilterService
	 * @description get Filter Function Without tAssignment used in LineItems container toolbar
	 */
	// private getFilterFunctionWithoutAssignment(): (item: unknown) => boolean {
	//     // return (item: unknown) => {
	//     //     //let result = true;
	//     //     Object.values(this.filterObjects).forEach((filterObj: unknown) => {
	//     //         // if (filterObj.enabled) {
	//     //         //     result = result && item[filterObj.propertyName] === null;
	//     //         // }
	//     //     });
	//     //    // return result;
	//     // };
	// }

	/**
	 * @name update
	 * @methodOf EstimateCommonFilterService
	 * @description update service filters
	 */
	private update(): void {
		if (this.serviceToBeFiltered !== null && this.filterFunction !== null && typeof this.filterFunction === 'function') {
			// this.serviceToBeFiltered.setItemFilter(this.filterFunction());
			// this.serviceToBeFiltered.enableItemFilter();
		}
		//TODO onUpdate
		// this.onUpdated.next();
	}

	/**
	 * @name getServiceToBeFiltered
	 * @methodOf EstimateCommonFilterService
	 * @description get Service To Be Filtered
	 */
	public getServiceToBeFiltered(): unknown {
		return this.serviceToBeFiltered;
	}

	/**
	 * @name setServiceToBeFiltered
	 * @methodOf EstimateCommonFilterService
	 * @description set Service To Be Filtered
	 */
	public setServiceToBeFiltered(dataService: unknown): void {
		if (this.isValidDataService(dataService)) {
			this.serviceToBeFiltered = dataService;
		}
	}

	//TODO need to check, can this below method can be moved to behavior service
	/**
	 * @name getToolbar
	 * @methodOf EstimateCommonFilterService
	 * @description get toolbar
	 */
	private getToolbar(): unknown {
		return {
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					caption: 'radio group caption',
					type: 'sublist',
					iconClass: 'filterCollection',
					list: {
						cssClass: 'radio-group',
						showTitles: true,
						items: this.toolbarItems,
					},
				},
				{
					caption: 'radio group caption',
					type: 'sublist',
					iconClass: 'filterBoQ',
					list: {
						cssClass: 'radio-group',
						activeValue: 'Combined',
						showTitles: true,
						items: [
							{
								id: 'filterBoQ',
								caption: this.moduleName + '.' + this.subModuleName + '.filterAssigned',
								type: 'radio',
								value: 'Combined',
								iconClass: 'tlb-icons ico-filter-assigned',
								fn: () => {
									this.setFilterFunctionType(0);
									this.setFilterFunction(this.getCombinedFilterFunction);
								},
								disabled: () => !this.areFiltersAvailable(),
							},
							{
								id: 'filterBoQAndNotAssigned',
								caption: this.moduleName + '.' + this.subModuleName + '.filterAssignedAndNotAssigned',
								type: 'radio',
								value: 'AssignedAndWithoutAssignment',
								iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
								fn: () => {
									this.setFilterFunctionType(1);
									// this.setFilterFunction(this.getFilterFunctionAssignedAndWithoutAssignment);
								},
								disabled: () => !this.areFiltersAvailable(),
							},
							{
								id: 'filterNotAssigned',
								caption: this.moduleName + '.' + this.subModuleName + '.filterNotAssigned',
								type: 'radio',
								value: 'WithoutAssignment',
								iconClass: 'tlb-icons ico-filter-notassigned',
								fn: () => {
									this.setFilterFunctionType(2);
									// this.setFilterFunction(this.getFilterFunctionWithoutAssignment);
								},
								disabled: () => !this.areFiltersAvailable(),
							},
						],
					},
				},
			],
		};
	}
}
