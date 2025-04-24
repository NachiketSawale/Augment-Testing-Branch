import { Component, Injector } from '@angular/core';
import { InitializationContext, IWizard } from '@libs/platform/common';
import { PlatformModuleManagerService } from '@libs/platform/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';

@Component({
	selector: 'example-topic-one-wizard-list-container',
	templateUrl: './wizard-list-container.component.html',
	styleUrls: ['./wizard-list-container.component.scss'],
})
export class WizardListContainerComponent extends ContainerBaseComponent {

	public constructor(
		private readonly moduleManagerSvc: PlatformModuleManagerService,
		private readonly injector: Injector
	) {
		super();
	}

	public get wizards(): IWizard[] {
		return this.moduleManagerSvc.listWizards();
	}

	public runWizard(wz: IWizard) {
		const ctx = new InitializationContext(this.injector);
		wz.execute(ctx);
	}
}
