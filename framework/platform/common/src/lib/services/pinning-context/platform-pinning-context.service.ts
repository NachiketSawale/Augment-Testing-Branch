/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPinningContext } from '../../interfaces/pinning-context.interface';
import { isAppContextValPinningContext } from '../../model/context/app-context.interface';
import { PlatformConfigurationService } from '../platform-configuration.service';


/**
 * Service that handles saving of the pinning context.
 * The pinning context will be used for pinning additional details which can be used for searching/filtering from the sidebar.
 */
@Injectable({
	providedIn: 'root'
})
export class PlatformPinningContextService {

	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly pinningContextKey: string = 'pinningContexts';

	/**
	 * Sets pinning context into local storage.
	 * @param pinningContexts An array of pinning contexts.
	 */
	public setPinningContext(pinningContexts: IPinningContext[] | null): void {
		let localPinningContexts: IPinningContext[] = [];
		if (pinningContexts != null) {
			localPinningContexts = this.getPinningContexts() ?? [];
			pinningContexts.forEach((pinningContext) => {
				const localPinningContext = localPinningContexts.filter(localPinningContext => localPinningContext.Token === pinningContext.Token)[0];
				if (localPinningContext !== null && localPinningContext !== undefined) {
					localPinningContext.Id = pinningContext.Id;
					localPinningContext.Info = pinningContext.Info;
				} else {
					localPinningContexts.push(pinningContext);
				}
			});
		}

		this.configurationService.setApplicationValue(this.pinningContextKey, localPinningContexts, true);
	}

	/**
	 * Gets pinning context for a module.
	 * @param internalModuleName The name of the module.
	 * @returns A pinning context object or null, if the pinning context is not available.
	 */
	public getPinningContextForModule(internalModuleName: string): IPinningContext | null {
		const localPinningContexts = this.getPinningContexts();
		if (localPinningContexts !== null) {
			return localPinningContexts.filter(localPinningContext => localPinningContext.Token === internalModuleName)[0];
		}
		return null;
	}

	/**
	 * Gets the pinning context from local storage.
	 * @returns A pinning context object or null, if the pinning context is not available.
	 */
	public getPinningContexts(): IPinningContext[] | null {
		const pinningContexts = this.configurationService.getApplicationValue(this.pinningContextKey);
		if (pinningContexts === null) {
			return null;
		}

		if (!isAppContextValPinningContext(pinningContexts)) {
			throw new Error('Improper settings saved');
		}

		return pinningContexts;
	}

	/**
	 * Clears pinning context for passed module.
	 * @param internalModuleName The name of the module.
	 */
	public clearPinningContextForModule(internalModuleName: string): void {
		const localPinningContext = this.getPinningContexts();
		if (localPinningContext !== null) {
			const filteredPinningContexts = localPinningContext.filter(item => item.Token !== internalModuleName);
			this.setPinningContext(filteredPinningContexts);
		}
	}

	/**
	 * Clears the entire pinning context.
	 */
	public clearPinningContext(): void {
		this.setPinningContext(null);
	}

	/**
	 * Add pinning context to local storage
	 * @param internalModuleName The name of the module.
	 * @param id identification data to be saved.
	 * @param info additional info.
	 */
	public addPinningContext(pinningContext: IPinningContext[]): IPinningContext[] {
		this.setPinningContext(pinningContext);
		return pinningContext;
	}
}
