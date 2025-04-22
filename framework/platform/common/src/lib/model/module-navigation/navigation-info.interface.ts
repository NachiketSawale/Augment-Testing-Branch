/*
 * Copyright(c) RIB Software GmbH
 */
import { IPinningContext } from '../../interfaces/pinning-context.interface';
import { IIdentificationData } from '../identification-data.interface';
import { IInitializationContext } from '../initialization';

/**
 * Interface for moduleNavigation payload
 */
export interface INavigationInfo {

	/**
	 * The module in which to navigate
	 */
	internalModuleName: string;

	/**
	 * Entity identification for the target module
	 */
	entityIdentifications: IIdentificationData[] | ((initializationContext: IInitializationContext) => IIdentificationData[]);

	/**
	 *  eventHandler called when navigation happened
	 */
	onNavigationDone?: (navigationInfo: INavigationInfo) => void;

	/**
	 * Pinning context to be set after navigation is done.
	 */
	getPinningContext?: () => IPinningContext[] | undefined;
}