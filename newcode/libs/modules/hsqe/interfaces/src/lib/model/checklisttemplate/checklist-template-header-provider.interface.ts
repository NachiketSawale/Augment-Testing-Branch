export interface IChecklistTemplateHeaderDataProvider<T extends object> {
	getSelectedEntity(): T | null;
}
