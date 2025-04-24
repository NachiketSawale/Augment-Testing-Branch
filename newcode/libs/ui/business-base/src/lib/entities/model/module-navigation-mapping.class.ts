/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Helper class for getting navigatable module names.
 */
export class ModuleNavigationMapping {
	private moduleNavigationMapping: Record<string, string> = {
		'scheduling.schedule': 'scheduling.main',
		'constructionsystem.project': 'constructionsystem.main'
	};

	/**
	 * Returns a navigatable module name
	 * @param moduleName modulename from the schema
	 * @returns a navigatable module name
	 */
	public getNavigatableModuleName(moduleName: string): string {
		const navigatableModuleName = this.moduleNavigationMapping[moduleName.toLocaleLowerCase()];
		if (navigatableModuleName) {
			return navigatableModuleName;
		}
		return moduleName;
	}
}