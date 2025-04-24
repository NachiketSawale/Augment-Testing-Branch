/*
 * Copyright(c) RIB Software GmbH
 */

import { AllKeys, RequestType } from '@libs/platform/common';
import { GenericWizardUseCaseConfigMap } from '../../configuration/base/types/generic-wizard-usecase-config-map.type';
import { GenericWizardUseCaseUuid } from '../enum/generic-wizard-use-case-uuid.enum';
import { Injector } from '@angular/core';
import { GenericWizardBaseConfig } from './generic-wizard-base-config.type';

/**
 * Configuration used to provide necessary pre-requisites for the generic wizard.
 */
export type ConfigProvider<Key extends GenericWizardUseCaseUuid> = {
	/**
	 * Url to call the service.
	 */
	Url: string;

	/**
	 * Request type of the http call.
	 */
	RequestType: RequestType;

	/**
	 * Call order in which the providers have to be loaded.
	 * @optional
	 */
	CallOrder?: number;

	/**
	 * Property to access the data from the response.
	 * @optional
	 */
	DtoAccessor?: string;

	/**
	 * Key of the property to store the data in the wizard config.
	 * The same key can be used to access the loaded configuration from the wizard config.
	 */
	ConfigName: keyof GenericWizardUseCaseConfigMap[Key];

	/**
	 * Parameters used to prepare the request.
	 */
	Params?: ConfigProviderParams<GenericWizardUseCaseConfigMap[Key]> | ((wizardConfig: GenericWizardBaseConfig) => ConfigProviderParams<GenericWizardUseCaseConfigMap[Key]>);

	/**
	 * 
	 * @param list 
	 * @param injector 
	 * @returns 
	 */
	ValidationFn?: (list: object, injector?: Injector) => void;


};

/**
 * Parameters used to prepare the request.
 */
export type ConfigProviderParams<T> = {
	[key: string]: AllKeys<T> | string | number;
};