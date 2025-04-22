/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { ScriptDefProvider } from '../model/script-def-provider';

@Injectable({
	providedIn: 'root'
})
export class ScriptDefService extends ScriptDefProvider {

	public constructor() {
		super('test');

		this.apiDefs.push({
			'Validator': {
				'!type': 'fn()',
				'prototype': {
					'check': {
						'!type': 'fn(parameter: string, condition: ?, error: string) -> +Validator',
						'!doc': 'fn(parameter: string, condition: ?, error: string) -> +Validator'
					},
					'hide': {
						'!type': 'fn(parameter: string, condition: ?) -> +Validator',
						'!doc': 'fn(parameter: string, condition: ?) -> +Validator'
					},
					'show': {
						'!type': 'fn(parameter: string, condition: ?) -> +Validator',
						'!doc': 'fn(parameter: string, condition: ?) -> +Validator'
					},
					'enable': {
						'!type': 'fn(parameter: string, condition: ?) -> +Validator',
						'!doc': 'fn(parameter: string, condition: ?) -> +Validator'
					},
					'disable': {
						'!type': 'fn(parameter: string, condition: ?) -> +Validator',
						'!doc': 'fn(parameter: string, condition: ?) -> +Validator'
					}
				}
			},
			'validator': '+Validator'
		});
	}
}