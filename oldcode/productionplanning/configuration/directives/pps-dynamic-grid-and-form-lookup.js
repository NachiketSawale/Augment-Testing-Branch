/**
 * Created by zov on 12/24/2019.
 *
 * It's a temporary directive
 * In order to fix memory crash issue, this directive is copied from dynamicGridAndFormLookup
 * see line 35, must clone before merge
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.configuration';
    angular.module(moduleName).directive('ppsDynamicGridAndFormLookup', dynamicLookup);

    dynamicLookup.$inject = ['$compile', '_', '$templateCache', 'platformPermissionService', 'mainViewService'];

    function dynamicLookup($compile, _, $templateCache, platformPermissionService, mainViewService) {
        var childscope, template;

        return {
            restrict: 'A',
            scope: false,
            link: function (scope, elem, attrs) { // jshint ignore:line
                var directive = null;
                var options = scope.$eval(attrs.options);
                var config = scope.$eval(attrs.config);
                var entity = scope.$eval(attrs.entity);
                var dependant = options.dependantField;
                var lookupInfo = options.lookupInfo;
                var rowOptions = null;

                function getLookupInfos(dependantValue) {
                    if (dependantValue) {
                        var info = lookupInfo[dependantValue];
                        var clone = _.cloneDeep(info.lookup.options);
                        scope.lookupOptions = _.merge(clone, options);
                        directive = getDirective(dependantValue);
                        scope.value = entity[info.column];
                    }
                }

                function render(directive) {
                    var replaced = template.replace(/\$\$directive\$\$/, directive);
                    var newElem = angular.element(replaced);
                    elem.html('');
                    elem.append(newElem);
                    $compile(newElem)(scope);
                }

                var unwatch = scope.$watch('entity.' + dependant, function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        if (options.grid) {
                            getLookupInfos(newValue);
                            render(directive);
                        } else {
                            changeControl(scope, elem, newValue);
                        }
                    }
                });

                var unwatchEntity = scope.$watch('entity', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        entity = newValue;
                    }
                });

                var dependantValue = null;
                if (entity && entity[dependant]) {
                    dependantValue = entity[dependant];
                }

                if (options.grid) {

                    getLookupInfos(dependantValue);
                    //noinspection HtmlUnknownAttribute
                    template = '<div $$directive$$ options="lookupOptions" $$placeholder$$></div>';
                    var placeholder = _.reduce(attrs, function (result, value, key) {
                        switch (key) {
                            case 'ppsDynamicGridAndFormLookup':
                            case '$attr':
                            case '$$element':
                            case 'lookupInfo':
                                break;
                            case 'readonly':
                                scope.lookupOptions.readonly = (value === 'true');
                                break;
                            case 'ngIf':
                            case 'ngModel':
                            case 'ngModelOptions':
                                result += (result.length ? ' ' : '') + 'data-' + _.kebabCase(key) + (value && value.length ? ('="' + value + '"') : '');
                                break;
                            default:
                                result += (result.length ? ' ' : '') + 'data-' + key + (value && value.length ? ('="' + value + '"') : '');
                                break;
                        }
                        return result;
                    }, '');

                    template = template.replace(/\$\$placeholder\$\$/, placeholder);
                    var replaced = template.replace(/\$\$directive\$\$/, directive);
                    var newElem = angular.element(replaced);
                    elem.html('');
                    elem.append(newElem);
                    $compile(newElem)(scope);

                } else {
                    changeControl(scope, elem, dependantValue);
                }

                function getDirective(dependant) {
                    return lookupInfo[dependant].lookup.directive;
                }

                function getOptions(dependant) {
                    return lookupInfo[dependant].lookup.options;
                }

                function getRowDefinition(dependant) { /* jshint -W074 */
                    return {
                        rid: config.rid,
                        gid: config.gid,
                        model: config.model,
                        type: 'directive',
                        directive: getDirective(dependant),
                        options: getOptions(dependant),
                        validator: '',
                        readonly: config.readonly ? config.readonly : false
                    };
                }

                /**
                 *
                 * @param scope
                 * @param cs
                 * @returns {*|Object}
                 */
                function makeChildScopewithClean(scope, cs) {
                    if (cs) {
                        cs.$destroy();
                    }
                    //noinspection JSCheckFunctionSignatures
                    return scope.$new();
                }

                function getTemplate(key) {
                    var template = $templateCache.get(key + '.html');
                    if (!template) {
                        template = $templateCache.get(key + 'ctrl.html');
                    }

                    if (!template) {
                        template = $templateCache.get('domain.html').replace('$$domain$$', key);
                    }

                    if (!template) {
                        throw new Error('Template ' + key + ' not found');
                    }

                    return template;
                }

                function getContextHtml(scope, rows) {

                    var rowContent = [];
                    var detailConfig = scope.formOptions.configure;

                    function isContainerReadonly() {
                        var containerScope = scope.$parent;

                        while (containerScope && !Object.prototype.hasOwnProperty.call(containerScope,'getContainerUUID')) {
                            containerScope = containerScope.$parent;
                        }

                        return containerScope ? !platformPermissionService.hasWrite(mainViewService.getPermission(containerScope.getContainerUUID())) : false;
                    }

                    angular.forEach(rows, function (row) { // jshint ignore:line

                        var groupIndex = 0;
                        var rowIndex = 4;
                        var group;

                        for (var i = 0; i < detailConfig.groups.length; i++) {
                            group = detailConfig.groups[i];
                            if (group.gid === row.gid) {
                                groupIndex = i;
                                break;
                            }
                        }

                        if (group) {
                            for (i = 0; i < group.rows.length; i++) {
                                if (group.rows[i].rid === row.rid) {
                                    rowIndex = i;
                                    if (row.options) {
                                        if (_.isNull(rowOptions)) {
                                            rowOptions = _.cloneDeep(group.rows[i].options);
                                        }
                                        group.rows[i].options = _.merge({}, rowOptions, row.options);
                                    }
                                    break;
                                }
                            }
                        }

                        var controlTemplate = getTemplate(row.type);

                        var readonly = detailConfig.skipPermissionCheck ? false : isContainerReadonly() ? true : row.readonly;

                        var rowBinding = 'groups[' + groupIndex + '].rows[' + rowIndex + ']';
                        if (controlTemplate) {
                            var directive = row.type === 'directive' ? 'data-' + row.directive : '';

                            var placeholder = [
                                'data-entity="entity"',
                                ' data-config="' + rowBinding + '"',
                                ' data-model="entity.' + row.model + '"',
                                ' class="form-control"',
                                ' data-ng-model="entity.' + row.model + '"',
                                ' data-readonly="' + (readonly || !!row.readonly) + '"',
                                ' data-ng-readonly="' + (readonly || !!row.readonly) + '"',
                                ' data-tabstop="' + !!row.tabStop + '"',
                                ' data-enterstop="' + !!row.enterStop + '"',
                                row.options ? ' data-options="options"' : '',
                                !detailConfig.dirty ? '' : ' data-dirty="true"'
                            ].join('');

                            controlTemplate = controlTemplate
                                .replace(/\$\$row\$\$/g, rowBinding)
                                .replace(/\$\$directive\$\$/g, directive)
                                .replace(/\$\$placeholder\$\$/g, placeholder);
                        }

                        rowContent.push(controlTemplate);

                    });

                    //must wrap <div class="">
                    rowContent = '<div class="">' + rowContent.join('') + '</div>';

                    return rowContent;
                }

                function changeControl(scope, element, typeValue) {

                    var lookuprow;

                    var rows = [];
                    if (typeValue) {
                        lookuprow = getRowDefinition(typeValue);
                    }
                    if (!lookuprow || !lookuprow.directive) {
                        var template = '<div class="form-control" data-ng-readonly="true"></div>';
                        var ctrlElement = angular.element(template);
                        element.html('');
                        element.append(ctrlElement);
                        $compile(ctrlElement)(scope);
                        return;
                    }

                    var parent = $(element);
                    rows.push(lookuprow);
                    var html = getContextHtml(scope, rows);
                    parent.empty();
                    childscope = makeChildScopewithClean(scope, childscope);
                    childscope.options = rows[0].options ? rows[0].options : null;
                    element.append($compile(html)(childscope));

                }

                scope.$on('$destroy', function () {
                    if (unwatch) {
                        unwatch();
                    }
                    if (unwatchEntity) {
                        unwatchEntity();
                    }
                });
            }
        };
    }
})(angular);