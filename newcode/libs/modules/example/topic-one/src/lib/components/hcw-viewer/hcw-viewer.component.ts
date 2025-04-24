/*
 * Copyright(c) RIB Software GmbH
 */
import { Component } from '@angular/core';
import 'hoops-communicator';
import { ContainerBaseComponent } from '@libs/ui/container-system';
/**
 * To load the 3D engine image using Hoop communicator web viewer.
 */

@Component({
	selector: 'example-topic-one-hcw-viewer',
	templateUrl: './hcw-viewer.component.html',
	styleUrls: ['./hcw-viewer.component.scss'],
})
export class HcwViewerComponent extends ContainerBaseComponent {
	private viewer: Communicator.WebViewer | null = null;
	private toggleValue = false;

	/**
	 * This method is used load the engine image at containerId
	 */
	public clientImg() {
		this.toggleValue = !this.toggleValue;
		if (this.toggleValue) {
			if (this.viewer === null) {
				this.viewer = new Communicator.WebViewer({
					containerId: 'viewerId',
					endpointUri: './assets/images/microengine.scs',
				});

				this.viewer.start();
			}
		} else {
			this.viewer = new Communicator.WebViewer({
				containerId: '',
			});
		}
	}
}
