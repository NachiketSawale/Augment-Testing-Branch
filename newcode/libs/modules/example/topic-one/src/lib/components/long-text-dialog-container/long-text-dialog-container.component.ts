/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { ILongTextDialogOptions, TextDisplayType, UiCommonLongTextDialogService } from '@libs/ui/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';

@Component({
	selector: 'example-topic-one-long-text-dialog-container',
	templateUrl: './long-text-dialog-container.component.html',
	styleUrl: './long-text-dialog-container.component.scss',
})
export class LongTextDialogContainerComponent extends ContainerBaseComponent {
	private readonly longTxtDialogService = inject(UiCommonLongTextDialogService);

	/**
	 * Simple dialog box.
	 */
	public async openSimpleDialog() {
		const options: ILongTextDialogOptions = {
			text:
				'This is an example for a long text. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Magna ac placerat vestibulum lectus mauris ultrices eros in. Urna et pharetra pharetra massa massa. Pellentesque elit eget gravida cum. Porttitor lacus luctus accumsan tortor posuere ac ut consequat semper. Curabitur gravida arcu ac tortor dignissim convallis aenean et. Purus non enim praesent elementum facilisis. Tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Vulputate dignissim suspendisse in est ante. Et malesuada fames ac turpis egestas sed tempus.\n' +
				'\n\n' +
				'Mi ipsum faucibus vitae aliquet nec. Euismod in pellentesque massa placerat. Faucibus interdum posuere lorem ipsum dolor sit amet. Neque laoreet suspendisse interdum consectetur libero. Lacus luctus accumsan tortor posuere ac ut consequat semper viverra. Sapien pellentesque habitant morbi tristique. Mauris cursus mattis molestie a. Habitant morbi tristique senectus et netus. Dui vivamus arcu felis bibendum. Turpis egestas maecenas pharetra convallis posuere morbi leo urna.\n' +
				'\n\n' +
				'Placerat in egestas erat imperdiet sed euismod nisi porta lorem. Nunc mi ipsum faucibus vitae aliquet nec. Orci phasellus egestas tellus rutrum tellus pellentesque eu. Lacus vestibulum sed arcu non odio euismod lacinia. Dignissim diam quis enim lobortis scelerisque fermentum dui faucibus. Tempus urna et pharetra pharetra massa massa ultricies. Risus feugiat in ante metus dictum at tempor commodo. Auctor augue mauris augue neque gravida in fermentum et. Lorem dolor sed viverra ipsum nunc. Varius quam quisque id diam vel quam.',
			type: TextDisplayType.Html,
		};

		const data = await this.longTxtDialogService.show(options);
		console.log(data);
	}
}
