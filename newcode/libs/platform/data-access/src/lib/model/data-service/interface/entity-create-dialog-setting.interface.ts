/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface for defining the dynamic fields settings for the create dialog,
 * based on configurations from the backend. It includes information about
 * which fields (columns) should appear in the create dialog and how they should behave.
 */
export interface ICreateDynamicFieldsSettings {
	ClassConfigurations: {
		EntityName: string;
		ColumnsForCreateDialog: Array<{ PropertyName: string, ShowInWizard: string }>;
		IsMandatoryActive: boolean,
		IsReadonlyActive: boolean
	}[];
}
