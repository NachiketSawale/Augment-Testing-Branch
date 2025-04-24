/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '../translation/translatable.interface';
import { IInitializationContext } from '../initialization/index';
import { Dictionary } from '../../helper/collections/dictionary.class';

/**
 * This interface represents the declaration of an available wizard.
 *
 * The `IWizard` interface represents the declaration for a wizard.
 * It contains superficial data like its UUID and display name, as well as a way to run the wizard.
 *
 * Implementations of `IWizard` are typically located in preload modules.
 * The preload module provides the list of all wizard declarations from the sub-modules of its module.
 *
 * ## Display Name
 *
 * The `IWizard` interface has two properties related to the human-readable representation of the wizard.
 * The `name` property is the name of the wizard, whereas the optional `description` can contain a slightly longer text (e.g. a short sentence) that outlines what the wizard does.
 *
 * ## Execution
 *
 * In order to execute the wizard, the `execute()` function is invoked.
 *
 * `execute()` returns a promise that is resolved when execution of the wizard has concluded.
 * Note that this does not include any possible server-side background processes that may have been launched by the wizard.
 * For the purpose of this promise, a wizard is considered completed once client-side processing has finished.
 *
 * ### Lazy Loading of Wizard Code
 *
 * While the wizard declaration is located in the preload module, as described above, the actual code that constitutes the wizard should be in one of the sub-modules of the same module.
 * It is highly recommended to load that code lazily.
 *
 * To do so, create a class in the sub-module that contains the code of the wizard.
 * In the `execute()` method of your `IWizard` implementation, use an `import()` statement pointing to your class file in the sub-module.
 * This will cause the class to be loaded lazily.
 * The `import()` statement returns a promise that is resolved to the container of the class.
 * This is what such a lazy wizard invocation could look like:
 *
 * ```typescript
 * return import("../../../../topic-one/src/lib/model/wizards/sample-wizard.class").then(wz => {
 *     new wz.SampleWizard().execute();
 * });
 * ```
 *
 * Note that the promise returned by `import()` is returned in the above sample, assuming that it is the invocation inside the wizard declaration's `execute()` method.
 * If the wizard code performs any asynchronous actions itself, do not forget to also return that promise inside the `then()` function to properly await the end of the promise chain.
 *
 * ### Usage of Angular Injectables
 *
 * The wizard entry point is a regular TypeScript class.
 * During the execution of the wizard, you may, however, need to use Angular services.
 * For instance, you may want to access some data services, or to use the dialog service to display a popup dialog.
 *
 * For this purpose, the `execute()` method of `IWizard` receives a `WizardExecutionContext` object that gives access to an [Angular `Injector`](https://angular.io/api/core/Injector).
 * Use this injector to retrieve any injectables registered with the Angular environment.
 */
export interface IWizard {

	/**
	 * Returns the unique ID (as a UUID) of the wizard.
	 */
	readonly uuid: string;

	/**
	 * Returns the human-readable name of the wizard.
	 */
	readonly name: Translatable;

	/**
	 * Returns a brief description of the wizard that may be displayed along with the name.
	 */
	readonly description?: Translatable;

	/**
	 * Executes the wizard.
	 */
	execute(context: IInitializationContext, wizardParameters?: Dictionary<string, unknown>): Promise<void> | undefined;
}