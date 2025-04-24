/**
 * Created by reimer on 07.12.2016
 */
(function (angular) {
	/* global Platform */
	'use strict';

	var modulename = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @description
	 */
	angular.module(modulename).factory('boqMainTextComplementConfigService', [

		function () {

			var service = {};

			service.complTypeChanged = new Platform.Messenger();

			service.getLayout = function () {

				var config = {
					fid: 'boq.main.text.complement.config',
					version: '0.1.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid: 'BasicData',
							attributes: ['compltype', 'complcaption', 'complbody', 'compltail', 'sorting']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					'overloads': {
						'compltype': {
							'readonly': true,
							'detail': {
								'type': 'directive',
								'directive': 'boq-main-text-complement-combobox',
								'options': {
									'eagerLoad': false
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'boq-main-text-complement-combobox',
									'lookupOptions': {
										'showClearButton': true,
										'disableDataCaching': false,
										'events': [
											{
												name: 'onSelectedItemChanged', // register event and event handler here.
												handler: function (e, args) { // jshint ignore:line
													service.complTypeChanged.fire(args.entity, args.selectedItem.Id);
												}
											}
										]
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'boqMainTextComplementTypes',
									displayMember: 'Description'
								}
							},
							validator: 'complCaptionChanged'
						},
						'complcaption': {
							validator: 'complCaptionChanged'
						},
						'complbody': {
							validator: 'complBodyChanged'
						},
						'compltail': {
							validator: 'complTailChanged'
						},
						'sorting': {
							'readonly': true
						}
					}
				};
				return config;
			};
			return service;
		}
	]);

})(angular);