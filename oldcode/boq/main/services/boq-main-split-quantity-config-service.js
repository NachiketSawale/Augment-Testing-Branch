/**
 * Created by reimer on 07.12.2016
 */
(function (angular) {
	/* global _ */
	'use strict';

	var modulename = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @description
	 */
	angular.module(modulename).factory('boqMainSplitQuantityConfigService', ['basicsLookupdataConfigGenerator',
		function (basicsLookupdataConfigGenerator) {
			var service = {};

			var cloudCommonModule = 'cloud.common';
			var estimateMainModule = 'estimate.main';
			var modelMainModule = 'model.main';

			function getPrjBillToLookupConfig (options) {
				var configReadonly = _.isObject(options) ? !_.includes(options.currentBoqMainService.getServiceName(),'boqMainServiceFactory') : true;
				var config = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'boqMainBilltoLookupDataService',
					filter: function (/* item */) {
						return options.currentBoqMainService.getSelectedProjectId();
					},
					additionalColumns: true,
					readonly: configReadonly,
					showClearButton: true
				}, {
					gid: 'baseGroup',
					rid: 'PrjBillToFk',
					label: 'Bill To',
					label$tr$: 'boq.main.BoqBillToFk',
					model: 'PrjBillToFk',
					type: 'lookup'
				});

				// 'provideDataServiceLookupConfig' delivers a config object with the following set of properties: 'grid.editorOptions.lookupOptions'
				// -> add the new property addGridColumns to it to restrict the expanded split quantity grid only by the given below defined column.
				// As reference for this behavior have a look at 'platformUiConfigAdditionalColumnService' and its function 'addAdditionalColumnsTo'.
				if(_.has(config, 'grid.editorOptions.lookupOptions')) {
					config.grid.editorOptions.lookupOptions.addGridColumns = [{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						width: 200,
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}];
				}

				return config;
			}

			service.getLayout = function (options) {
				var config = {
					fid: 'boq.main.split.quantity.config',
					version: '0.1.0',
					addAdditionalColumns: true,
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid: 'basicData',
							attributes: [
								'quantity',
								'quantityadj',
								'prjlocationfk',
								'prcstructurefk',
								'mdccontrollingunitfk',
								'deliverydate',
								'commenttext',
								'prjbilltofk'
							]
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					'translationInfos': {
						'extraModules': [modulename, cloudCommonModule, estimateMainModule, modelMainModule, 'basics.procurementstructure'],
						'extraWords': {
							Assignments: {location: modulename, identifier: 'Assignments', initial: 'Assignments'},
							BoqHeaderFk: {location: modulename, identifier: 'entityBoqHeaderFk', initial: 'BoqHeaderFk'},
							BoqItemFk: {location: modulename, identifier: 'entityBoqItemFk', initial: 'BoqItemFk'},
							Quantity: {location: modulename, identifier: 'Quantity', initial: 'Quantity'},
							QuantityAdj: {location: modulename, identifier: 'QuantityAdj', initial: 'AQ-Quantity'},
							BilledQuantity: {location: modulename, identifier: 'BilledQuantity', initial: 'Billed Quantity'},
							InstalledQuantity: {location: modulename, identifier: 'InstalledQuantity', initial: 'Installed Quantity'},
							Price: {location: modulename, identifier: 'Price', initial: 'Unit Rate'},
							PriceOc: {location: modulename, identifier: 'PriceOc', initial: 'Unit Rate(Oc)'},
							PrjLocationFk: {location: modelMainModule, identifier: 'entityLocation', initial: 'Location'},
							PrcStructureFk: {location: 'basics.procurementstructure', identifier: 'prcStructureFk', initial: 'Procurement Structure'},
							MdcControllingUnitFk: {location: cloudCommonModule, identifier: 'entityControllingUnitCode', initial: 'entityControllingUnitCode'},
							DeliveryDate: {location: modulename, identifier: 'DeliveryDate', initial: '*Delivery Date'},
							CommentText: {location: modulename, identifier: 'CommentText', initial: 'Comment'},
							PrjBillToFk: {location: modulename, identifier: 'billToEntity', initial: ''}
						}
					},
					'overloads': {
						'id': {
							'readonly': true
						},
						'boqheaderfk': {
							'readonly': true
						},
						'boqitemfk': {
							'readonly': true
						},
						'quantity': {
							// 'validator': 'quantityChanged'
							'grid': {
								// 'hidden': true,
							}
						},
						'quantityadj': {
							// 'validator': 'quantityChanged'
						},
						'prjbilltofk': getPrjBillToLookupConfig(options)
					}
				};

				if (_.isObject(options) && _.isObject(options.currentBoqMainService) && (options.currentBoqMainService.getCallingContextType() === 'Wic')) {
					// Remove columns in 'Wic' mode
					var basicDataGroup = _.filter(config.groups, {gid: 'basicData'});
					if (_.isArray(basicDataGroup) && basicDataGroup.length > 0) {
						basicDataGroup[0].attributes = _.without(basicDataGroup[0].attributes, 'prjcostgroup1fk', 'prjcostgroup2fk', 'prjcostgroup3fk', 'prjcostgroup4fk', 'prjcostgroup5fk', 'prjlocationfk', 'mdccontrollingunitfk');
					}
				}

				config.overloads = angular.extend(config.overloads, service.getAssignmentCols(options));
				return config;
			};

			service.getAssignmentCols = function(options) {
				var addColumns = [{
					id: 'Description',
					field: 'DescriptionInfo',
					name: 'Description',
					width: 300,
					formatter: 'translation',
					name$tr$: 'cloud.common.entityDescription'
				}];

				function getProjectId(item) {
					if (options && options.currentBoqMainService) {
						return options.currentBoqMainService.getSelectedProjectId();
					} else {
						return Object.prototype.hasOwnProperty.call(item, 'ProjectFk') ? item.ProjectFk : 0;
					}
				}

				var assignmentCols = {
					'prcstructurefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									isFastDataRecording: true
								},
								directive: 'basics-procurementstructure-structure-dialog'
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'prcstructure',
								displayMember: 'Code',
								childProp: 'ChildItems'
							}
						}
					}
				};

				if (!options || !options.currentBoqMainService || (_.isObject(options) && options.currentBoqMainService && options.currentBoqMainService.getCallingContextType()!=='Wic')) {
					assignmentCols.prjlocationfk = basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
						moduleQualifier: 'projectLocationLookupDataService',
						dataServiceName: 'projectLocationLookupDataService',
						valMember: 'Id',
						dispMember: 'Code',
						isComposite: true,
						showClearButton: true,
						filter: function (item) {
							return getProjectId(item);
						},
						isFastDataRecording: true
					});

					assignmentCols.mdccontrollingunitfk = {
						navigator: {
							moduleName: 'controlling.structure'
						},
						'detail': {
							'model': 'MdcControllingUnitFk',
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'controlling-structure-dialog-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'boq-main-controlling-unit-filter',
									showClearButton: true
								}
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'controlling-structure-dialog-lookup',
								lookupOptions: {
									showClearButton: true,
									filterKey: 'boq-main-controlling-unit-filter',
									'additionalColumns': true,
									'displayMember': 'Code',
									'addGridColumns': addColumns,
									isFastDataRecording: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Controllingunit',
								displayMember: 'Code',
								childProp: 'ChildItems',
								useNewLookupType: true,
								filterKey: 'prc.con.controllingunit.by.prj.filterkey'
							}
						}
					};
				}

				return assignmentCols;

			};

			return service;
		}
	]);

})(angular);
