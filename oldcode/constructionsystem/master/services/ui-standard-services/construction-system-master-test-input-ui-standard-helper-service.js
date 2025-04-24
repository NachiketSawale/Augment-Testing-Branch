(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMasterTestInputUIStandardHelperService',
		['constructionSystemMasterTestInputUIStandardService',
			'constructionSystemMasterParameterDataService',
			'basicsLookupdataLookupDescriptorService',
			'constructionSystemMasterTestInputValidationService',
			function (constructionSystemMasterTestInputUIStandardService,
				constructionSystemMasterParameterDataService,
				basicsLookupdataLookupDescriptorService,
				constructionSystemMasterTestInputValidationService) {

				var service = {},
					contextRowDefaultCount = -1,
					groupDefaultCount = -1;

				/* jshint -W074 */
				service.GenerateNewUIStandard = function (parameterGroup, parameter) {
					var groups = parameterGroup || [],
						rows = parameter || [],
						detailView = constructionSystemMasterTestInputUIStandardService.getStandardConfigForDetailView(),
						index = 0;

					if (groupDefaultCount === -1) {
						groupDefaultCount = detailView.groups.length;
					}

					if (contextRowDefaultCount === -1) {
						contextRowDefaultCount = detailView.rows.length;
					}

					groups.sort(function (value1, value2) {
						return value1.Sorting - value2.Sorting;
					});

					rows.sort(function (value1, value2) {
						return value1.Sorting - value2.Sorting;
					});

					detailView.groups = detailView.groups.slice(0, groupDefaultCount);
					detailView.rows = detailView.rows.slice(0, contextRowDefaultCount);

					for (var i = 0; i < groups.length; i++) {
						var gid = 'parameterGroup' + i,
							rowArray = [],
							type,
							decimalPlaces,
							directive;

						for (var j = 0; j < rows.length; j++) {
							var currentRow = rows[j];
							decimalPlaces = 0;
							directive = null;

							// a row won't be created for a cosParameter if the validation script wants to hide it
							if(Object.prototype.hasOwnProperty.call(currentRow,'__rt$data')) {
								if(Object.prototype.hasOwnProperty.call(currentRow.__rt$data,'hide')){
									if(currentRow.__rt$data.hide){
										continue;
									}
								}
							}


							if (currentRow.CosParameterGroupFk === groups[i].Id) {
								if (currentRow.IsLookup && currentRow.CosParameterTypeFk !== 10) {
									type = 'directive';
									directive = 'construction-system-master-test-input-parameter-value-combobox';
								} else {
									switch (currentRow.CosParameterTypeFk) {
										case 0:
											type = 'integer';
											break;
										case 1:
											type = 'decimal';
											decimalPlaces = 1;
											break;
										case 2:
											type = 'decimal';
											decimalPlaces = 2;
											break;
										case 3:
											type = 'decimal';
											decimalPlaces = 3;
											break;
										case 4:
											type = 'decimal';
											decimalPlaces = 4;
											break;
										case 5:
											type = 'decimal';
											decimalPlaces = 5;
											break;
										case 6:
											type = 'decimal';
											decimalPlaces = 6;
											break;
										case 10:
											type = 'boolean';
											break;
										case 11:
											type = 'dateutc';
											break;
										case 12:
											type = 'description';
											break;
										default:
											type = 'description';
											break;
									}
								}

								// add uom
								var label = currentRow.DescriptionInfo.Translated || '_';
								var uomItem = basicsLookupdataLookupDescriptorService.getLookupItem('uom', currentRow.UomFk);
								if (uomItem && uomItem.Unit) {
									var unit = uomItem.Unit.trim();
									label = label + (unit.length ? '(' + unit + ')' : '');
								}

								var row = createRow(
									directive,
									gid,
									label,
									'm' + currentRow.Id + '.Value',
									'm' + currentRow.Id,
									j,
									type,
									currentRow.Id,
									decimalPlaces
								);
								rowArray.push(row);
							}
						}

						if (rowArray.length > 0) {
							if (detailView.groups[index] &&
								Array.isArray(detailView.groups[index].rows) &&
								Array.isArray(detailView.rows)) {

								detailView.groups.push(createGroup(gid, groups[i].DescriptionInfo.Translated, i + 1));
								Array.prototype.push.apply(detailView.groups[index].rows, rowArray);
								Array.prototype.push.apply(detailView.rows, rowArray);
							}
							else {
								detailView.groups.push(createGroup(gid, groups[i].DescriptionInfo.Translated, i + 1));
								Array.prototype.push.apply(detailView.rows, rowArray);
							}

							index++;
						}
					}
				};

				return service;

				function createRow(directive, gid, label, model, rid, sortOrder, type, filerValue, decimalPlaces) {
					if (directive) {
						return {
							directive: directive,
							gid: gid,
							label: label,
							label$tr$: 'constructionsystem.master.entityValue',
							label$tr$param$: undefined,
							model: model,
							readonly: false,
							rid: rid,
							sortOrder: sortOrder,
							type: type,
							visible: true,
							tabStop: true,
							enterStop: true,
							options: {
								filterItemId: filerValue
							},
							validator: constructionSystemMasterTestInputValidationService.validateFormValue
						};
					}
					else if (decimalPlaces) {
						return {
							directive: directive,
							gid: gid,
							label: label,
							label$tr$: 'constructionsystem.master.entityValue',
							label$tr$param$: undefined,
							model: model,
							readonly: false,
							rid: rid,
							sortOrder: sortOrder,
							type: type,
							visible: true,
							tabStop: true,
							enterStop: true,
							options: {
								filterItemId: filerValue,
								decimalPlaces: decimalPlaces
							},
							validator: constructionSystemMasterTestInputValidationService.validateFormValue
						};
					}
					else {
						return {
							gid: gid,
							label: label,
							label$tr$: 'constructionsystem.master.entityValue',
							label$tr$param$: undefined,
							model: model,
							readonly: false,
							rid: rid,
							sortOrder: sortOrder,
							type: type,
							visible: true,
							tabStop: true,
							enterStop: true,
							options: {
								filterItemId: filerValue
							},
							validator: constructionSystemMasterTestInputValidationService.validateFormValue
						};
					}
				}

				function createGroup(gid, header, sortOrder) {
					return {
						gid: gid,
						header: header,
						isOpen: true,
						rows: [],
						showHeader: true,
						sortOrder: sortOrder,
						userheader: undefined,
						visible: true
					};
				}
			}
		]);
})(angular);