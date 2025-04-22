/**
 * Copyright(c) RIB Software GmbH
 */
export interface ISidebarWizardComplete {
	/**
	 * Type of the parameter
	 */
	Type: string;

	/**
	 * Unique Id of the wizard group.
	 */
	Id: number;

	/**
	 * Parameter Name
	 */
	Name: string;

	/**
	 * Parameter Value
	 */
	Value: string;

	/**
	 * domain name
	 */
	Domain: string;

	/**
	 * WizardParameterFk
	 */
	WizardParameterFk: number;

	/**
	 * WizardFk
	 */
	WizardFk: number;

	/**
	 * WizardGuid
	 */
	WizardGuid: string

}