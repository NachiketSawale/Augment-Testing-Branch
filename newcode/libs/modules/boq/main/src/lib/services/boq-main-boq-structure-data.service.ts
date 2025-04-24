/* eslint-disable prefer-const */
import { IBoqStructureEntity } from '@libs/boq/interfaces';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { lastValueFrom, map } from 'rxjs';

export class BoqStructureDataService {
	private readonly serviceUrl: string;
	private http: PlatformHttpService;

	public constructor() {
		this.serviceUrl = 'boq/main/getstructure4boqheader';
		this.http = ServiceLocator.injector.get(PlatformHttpService);
  }

	/**
	 * @ngdoc function
	 * @name loadBoqStructure
	 * @function
	 * @methodOf BoqStructureDataService
	 * @description Loads the boq structure with all attached structure details according to the given boq header id
	 * @param {number} boqHeaderId: leads to the boq structure to be loaded
	 * @returns {Object} : a promise that will be resolved
	 */
	public loadBoqStructure(boqHeaderId: number): Promise<IBoqStructureEntity | undefined>{
		let loadedStructure : Promise<IBoqStructureEntity | undefined> = Promise.resolve(undefined);

		if (boqHeaderId > 0) {
			let httpOption = {params: {headerId: boqHeaderId, withDetails: true}};
			loadedStructure = lastValueFrom(this.http.get$<IBoqStructureEntity>(this.serviceUrl, httpOption)
				.pipe(map(response => {
					return response;
				}))
			);
		}
		return loadedStructure;
	}
}
