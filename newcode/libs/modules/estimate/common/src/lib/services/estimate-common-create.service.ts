/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})

/**
 * EstimateCommonCreationService is the service used in all estimate leading structures.
 * it will create service instances
 */
export class EstimateCommonCreationService {
	private processors: { Id: number; func: unknown }[] = []; // Id:string or Id:number

	/**
	 * @name addCreationProcessor
	 * @methodOf EstimateCommonCreationService
	 * @description adds creation processor for all leading strcutures
	 * @param {id} number
	 * @param {funcProcessor} Function
	 */

	public addCreationProcessor(id: number, funcProcessor: unknown): void {
		this.removeCreationProcessor(id);
		this.processors.push({ Id: id, func: funcProcessor });
	}

	/**
	 * @name removeCreationProcessor
	 * @methodOf EstimateCommonCreationService
	 * @description removes creation processors
	 * @param {number} id
	 */
	public removeCreationProcessor(id: number): void {
		this.processors = this.processors.filter((item) => item.Id !== id);
	}

	/**
	 * @name getCreationProcessors
	 * @methodOf EstimateCommonCreationService
	 * @description gets creation processors
	 * @param {id} function
	 */

	public getCreationProcessors(): { [id: number]: unknown } {
		const res: { [id: number]: unknown } = {};
		this.processors.forEach((item) => {
			res[item.Id] = item.func;
		});
		return res;
	}

	/**
	 * @name processItem
	 * @methodOf EstimateCommonCreationService
	 * @description process each item
	 * @param {any} item
	 */
	public processItem(item: unknown): void {
		this.processors.forEach((processor) => {
			//processor.func(item);
		});
	}

	/**
	 * @name getInstance
	 * @methodOf EstimateCommonCreationService
	 * @description gets instance of EstimateCommonCreationService
	 */
	public getInstance(): EstimateCommonCreationService {
		return new EstimateCommonCreationService();
	}
}
