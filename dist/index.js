Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var styled = require('styled-components');
var edsCoreReact = require('@equinor/eds-core-react');
var edsIcons = require('@equinor/eds-icons');
var edsTokens = require('@equinor/eds-tokens');
var Axios = require('axios');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);
var Axios__default = /*#__PURE__*/_interopDefaultLegacy(Axios);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}

var AsyncStatus;
(function (AsyncStatus) {
    AsyncStatus[AsyncStatus["INACTIVE"] = 0] = "INACTIVE";
    AsyncStatus[AsyncStatus["LOADING"] = 1] = "LOADING";
    AsyncStatus[AsyncStatus["SUCCESS"] = 2] = "SUCCESS";
    AsyncStatus[AsyncStatus["ERROR"] = 3] = "ERROR";
    AsyncStatus[AsyncStatus["EMPTY_RESPONSE"] = 4] = "EMPTY_RESPONSE";
})(AsyncStatus || (AsyncStatus = {}));
var CompletionStatus;
(function (CompletionStatus) {
    CompletionStatus["OS"] = "OS";
    CompletionStatus["PA"] = "PA";
    CompletionStatus["PB"] = "PB";
    CompletionStatus["OK"] = "OK";
})(CompletionStatus || (CompletionStatus = {}));

var HelperText = styled__default['default'].div(templateObject_1$d || (templateObject_1$d = __makeTemplateObject(["\n    height: 12px;\n    margin-top: 2px;\n    margin-left: 8px;\n    & p {\n        margin: 0;\n        font-size: 12px;\n    }\n"], ["\n    height: 12px;\n    margin-top: 2px;\n    margin-left: 8px;\n    & p {\n        margin: 0;\n        font-size: 12px;\n    }\n"])));
function determineHelperText$1(submitStatus) {
    if (submitStatus === AsyncStatus.ERROR)
        return 'Unable to save.';
    if (submitStatus === AsyncStatus.LOADING)
        return 'Saving data...';
    if (submitStatus === AsyncStatus.SUCCESS)
        return 'Data saved.';
    return '';
}
var MetaTableCell = function (_a) {
    var value = _a.value, unit = _a.unit, disabled = _a.disabled, rowId = _a.rowId, columnId = _a.columnId, checkItemId = _a.checkItemId, label = _a.label, api = _a.api;
    var _b = React.useState(value), inputValue = _b[0], setInputValue = _b[1];
    var _c = React.useState(AsyncStatus.INACTIVE), submitStatus = _c[0], setSubmitStatus = _c[1];
    var _d = React.useState(''); _d[0]; var setErrorMessage = _d[1];
    var valueBeforeFocus = '';
    var submitData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSubmitStatus(AsyncStatus.LOADING);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, api.putMetaTableCell(checkItemId, columnId, rowId, inputValue)];
                case 2:
                    _a.sent();
                    setSubmitStatus(AsyncStatus.SUCCESS);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    setErrorMessage(error_1);
                    setSubmitStatus(AsyncStatus.ERROR);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    React.useEffect(function () {
        if (submitStatus !== AsyncStatus.SUCCESS)
            return;
        var timerId = setTimeout(function () {
            setSubmitStatus(AsyncStatus.INACTIVE);
        }, 2000);
        return function () { return clearTimeout(timerId); };
    }, [submitStatus]);
    return (jsxRuntime.jsxs("td", { children: [jsxRuntime.jsx(edsCoreReact.TextField, { id: rowId.toString() + columnId.toString() + 'textfield', meta: unit, label: label, value: inputValue ? inputValue : '', disabled: disabled, variant: (submitStatus === AsyncStatus.ERROR && 'error') ||
                    (submitStatus === AsyncStatus.SUCCESS && 'success') ||
                    'default', onFocus: function () { return (valueBeforeFocus = value); }, onBlur: function () {
                    value !== valueBeforeFocus && submitData();
                }, onChange: function (event) { return setInputValue(event.target.value); } }, void 0),
            jsxRuntime.jsx(HelperText, { children: jsxRuntime.jsx("p", { children: determineHelperText$1(submitStatus) }, void 0) }, void 0)] }, void 0));
};
var templateObject_1$d;

edsCoreReact.Icon.add({
    camera_add_photo: edsIcons.camera_add_photo,
    menu: edsIcons.menu,
    stop: edsIcons.stop,
    tune: edsIcons.tune,
    file: edsIcons.file,
    link: edsIcons.link,
    delete_to_trash: edsIcons.delete_to_trash,
    cloud_download: edsIcons.cloud_download,
    chevron_right: edsIcons.chevron_right,
    chevron_down: edsIcons.chevron_down,
    arrow_drop_down: edsIcons.arrow_drop_down,
    error_outlined: edsIcons.error_outlined,
    close: edsIcons.close,
    bookmark_outlined: edsIcons.bookmark_outlined,
    bookmark_filled: edsIcons.bookmark_filled,
    list: edsIcons.list,
    assignment_turned_in: edsIcons.assignment_turned_in,
    border_color: edsIcons.border_color,
    paste: edsIcons.paste,
    view_list: edsIcons.view_list,
    remove: edsIcons.remove,
    check_circle_outlined: edsIcons.check_circle_outlined,
    arrow_back: edsIcons.arrow_back,
    arrow_forward: edsIcons.arrow_forward,
    search: edsIcons.search,
    warning_outlined: edsIcons.warning_outlined,
    warning_filled: edsIcons.warning_filled,
    radio_button_selected: edsIcons.radio_button_selected,
    radio_button_unselected: edsIcons.radio_button_unselected,
    swap_horizontal: edsIcons.swap_horizontal,
    arrow_drop_right: edsIcons.arrow_drop_right,
    info_circle: edsIcons.info_circle,
    checkbox: edsIcons.checkbox,
    checkbox_outline: edsIcons.checkbox_outline,
    thumbs_up: edsIcons.thumbs_up,
    error_filled: edsIcons.error_filled,
    hourglass_empty: edsIcons.hourglass_empty,
    check: edsIcons.check,
});
var EdsIcon = function (_a) {
    var name = _a.name, title = _a.title, color = _a.color, size = _a.size;
    return jsxRuntime.jsx(edsCoreReact.Icon, { name: name, title: title, color: color, size: size }, void 0);
};

var SHADOW = '0 0.3px 0.9px rgba(33, 41, 43, 0.04), 0 0.9px 3.1px rgba(33, 41, 43, 0.07), 0 4px 14px rgba(33, 41, 43, 0.1)';
var COLORS = {
    mossGreen: edsTokens.tokens.colors.interactive.primary__resting.hex,
    fadedBlue: edsTokens.tokens.colors.interactive.primary__hover_alt.hex,
    danger: edsTokens.tokens.colors.interactive.danger__resting.hex,
    success: edsTokens.tokens.colors.interactive.success__resting.hex,
    white: '#fff',
    darkGrey: '#777',
    lightGrey: '#fafafa',
    black: '#000',
};
styled.createGlobalStyle(templateObject_1$c || (templateObject_1$c = __makeTemplateObject(["\n    body { \n        margin: 0 auto;\n        padding-top: 54px;\n        max-width: 768px;\n        box-shadow: ", ";\n    }\n    h1 {\n        ", "\n    }\n    h2 {\n        ", "\n    }\n    h3 {\n        ", "\n    }\n    h4 {\n        ", "\n    }\n    h5 {\n        ", "\n    }\n    h6 {\n        ", "\n    }\n    p {\n        ", "\n    }\n    a {\n        ", "\n    }\n    hr {\n        width: 100%;\n    }\n    label {\n        ", "\n    }\n    main {\n        background-color: ", ";\n        min-height: calc(100vh - 55px);\n    }\n"], ["\n    body { \n        margin: 0 auto;\n        padding-top: 54px;\n        max-width: 768px;\n        box-shadow: ", ";\n    }\n    h1 {\n        ", "\n    }\n    h2 {\n        ", "\n    }\n    h3 {\n        ", "\n    }\n    h4 {\n        ", "\n    }\n    h5 {\n        ", "\n    }\n    h6 {\n        ", "\n    }\n    p {\n        ", "\n    }\n    a {\n        ", "\n    }\n    hr {\n        width: 100%;\n    }\n    label {\n        ", "\n    }\n    main {\n        background-color: ", ";\n        min-height: calc(100vh - 55px);\n    }\n"])), SHADOW, edsTokens.tokens.typography.heading.h1, edsTokens.tokens.typography.heading.h2, edsTokens.tokens.typography.heading.h3, edsTokens.tokens.typography.heading.h4, edsTokens.tokens.typography.heading.h5, edsTokens.tokens.typography.heading.h6, edsTokens.tokens.typography.paragraph.body_short, edsTokens.tokens.typography.paragraph.body_short_link, edsTokens.tokens.typography.input.label, COLORS.white);
var templateObject_1$c;

var MetaTableWrapper = styled__default['default'].table(templateObject_1$b || (templateObject_1$b = __makeTemplateObject(["\n    border-spacing: 4px;\n    margin-left: auto;\n    & > p {\n        margin: 0;\n        padding-bottom: 12px;\n    }\n    & thead {\n        & label {\n            margin: 0;\n            text-align: center;\n        }\n    }\n    & tbody {\n        vertical-align: bottom;\n        & th {\n            min-width: 100px;\n            padding-right: 10px;\n            & > label {\n                margin: 0;\n                padding-bottom: 22px;\n                float: right;\n            }\n        }\n        & tr {\n            & td {\n                padding: 0;\n                margin: 0;\n            }\n        }\n    }\n"], ["\n    border-spacing: 4px;\n    margin-left: auto;\n    & > p {\n        margin: 0;\n        padding-bottom: 12px;\n    }\n    & thead {\n        & label {\n            margin: 0;\n            text-align: center;\n        }\n    }\n    & tbody {\n        vertical-align: bottom;\n        & th {\n            min-width: 100px;\n            padding-right: 10px;\n            & > label {\n                margin: 0;\n                padding-bottom: 22px;\n                float: right;\n            }\n        }\n        & tr {\n            & td {\n                padding: 0;\n                margin: 0;\n            }\n        }\n    }\n"])));
var HorizontalScroll = styled__default['default'].div(templateObject_2$6 || (templateObject_2$6 = __makeTemplateObject(["\n    overflow-x: scroll;\n    padding: 6px 10px 0px 24px;\n    border-left: 2px solid ", ";\n    margin-top: 6px;\n    & > div {\n        & > p {\n            margin: 0 4px 0 0;\n        }\n        background-color: ", ";\n        padding: 4px 4px 4px 8px;\n        margin-bottom: 12px;\n        display: flex;\n        align-items: center;\n        width: fit-content;\n    }\n"], ["\n    overflow-x: scroll;\n    padding: 6px 10px 0px 24px;\n    border-left: 2px solid ", ";\n    margin-top: 6px;\n    & > div {\n        & > p {\n            margin: 0 4px 0 0;\n        }\n        background-color: ", ";\n        padding: 4px 4px 4px 8px;\n        margin-bottom: 12px;\n        display: flex;\n        align-items: center;\n        width: fit-content;\n    }\n"])), COLORS.fadedBlue, COLORS.fadedBlue);
var MetaTable = function (_a) {
    var labels = _a.labels, rows = _a.rows, disabled = _a.disabled, checkItemId = _a.checkItemId, api = _a.api;
    var _b = React.useState(false), tableIsScrollable = _b[0], setTableIsScrollable = _b[1];
    var tableContainerRef = React.useRef(document.createElement('div'));
    var headers = labels.map(function (label) { return (jsxRuntime.jsx(React__default['default'].Fragment, { children: label && (jsxRuntime.jsx("th", { children: jsxRuntime.jsx("label", { children: label.label }, void 0) }, void 0)) }, label.id)); });
    var rowsToDisplay = rows.map(function (row) {
        var cells = row.cells.map(function (cell) {
            return (jsxRuntime.jsx(MetaTableCell, { disabled: disabled, checkItemId: checkItemId, rowId: row.id, columnId: cell.columnId, unit: cell.unit, value: cell.value, label: row.cells.length < 2 ? row.label : '', api: api }, cell.columnId.toString() + row.id.toString()));
        });
        return (jsxRuntime.jsxs("tr", { children: [jsxRuntime.jsx("th", { children: jsxRuntime.jsx("label", { children: row.cells.length > 1 && row.label }, void 0) }, void 0), cells] }, row.id));
    });
    React.useEffect(function () {
        setTableIsScrollable(tableContainerRef.current.scrollWidth >
            tableContainerRef.current.clientWidth);
    }, [tableContainerRef]);
    return (jsxRuntime.jsxs(HorizontalScroll, __assign({ ref: tableContainerRef }, { children: [jsxRuntime.jsxs(MetaTableWrapper, { children: [headers.length > 1 && (jsxRuntime.jsx("thead", { children: jsxRuntime.jsxs("tr", { children: [jsxRuntime.jsx("th", {}, void 0), headers] }, void 0) }, void 0)),
                    jsxRuntime.jsx("tbody", { children: rowsToDisplay }, void 0)] }, void 0),
            tableIsScrollable && (jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx("p", { children: jsxRuntime.jsx("i", { children: "Long table. Swipe right" }, void 0) }, void 0),
                    jsxRuntime.jsx(EdsIcon, { name: "arrow_drop_right", color: "primary" }, void 0)] }, void 0))] }), void 0));
};
var templateObject_1$b, templateObject_2$6;

var CheckItemWrapper = styled__default['default'].div(templateObject_1$a || (templateObject_1$a = __makeTemplateObject(["\n    background-color: ", ";\n    margin-top: 12px;\n    & p,\n    button {\n        color: ", ";\n    }\n    transition: background-color 0.2s ease-in-out;\n    transition: color 0.2s ease-in-out;\n"], ["\n    background-color: ",
    ";\n    margin-top: 12px;\n    & p,\n    button {\n        color: ",
    ";\n    }\n    transition: background-color 0.2s ease-in-out;\n    transition: color 0.2s ease-in-out;\n"])), function (props) {
    return props.disabled ? 'transparent' : 'transparent';
}, function (props) {
    return props.disabled ? COLORS.darkGrey : 'initial';
});
var DescriptionAndCheckWrapper = styled__default['default'].div(templateObject_2$5 || (templateObject_2$5 = __makeTemplateObject(["\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n"], ["\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n"])));
var LeftWrapper = styled__default['default'].div(templateObject_3$3 || (templateObject_3$3 = __makeTemplateObject(["\n    & button {\n        margin: 0;\n        padding: 0;\n        border: 0;\n        background: none;\n        display: flex;\n        align-items: center;\n\n        & p {\n            margin: 0;\n            color: ", ";\n        }\n    }\n    & > p {\n        flex: auto;\n        margin: 0;\n    }\n"], ["\n    & button {\n        margin: 0;\n        padding: 0;\n        border: 0;\n        background: none;\n        display: flex;\n        align-items: center;\n\n        & p {\n            margin: 0;\n            color: ", ";\n        }\n    }\n    & > p {\n        flex: auto;\n        margin: 0;\n    }\n"])), COLORS.mossGreen);
var CheckItemDescriptionWrapper = styled__default['default'].div(templateObject_4$2 || (templateObject_4$2 = __makeTemplateObject(["\n    & > p {\n        margin: 8px 0px 8px 0px;\n        padding-left: 24px;\n        border-left: 2px solid ", ";\n    }\n"], ["\n    & > p {\n        margin: 8px 0px 8px 0px;\n        padding-left: 24px;\n        border-left: 2px solid ", ";\n    }\n"])), COLORS.fadedBlue);
var CheckboxGroup = styled__default['default'].div(templateObject_5$1 || (templateObject_5$1 = __makeTemplateObject(["\n    flex: 0 0 80px;\n    display: flex;\n    justify-content: space-between;\n"], ["\n    flex: 0 0 80px;\n    display: flex;\n    justify-content: space-between;\n"])));
var CheckItem = function (_a) {
    var item = _a.item, isSigned = _a.isSigned, updateNA = _a.updateNA, updateOk = _a.updateOk, setSnackbarText = _a.setSnackbarText, api = _a.api;
    var _b = React.useState(AsyncStatus.INACTIVE), postCheckStatus = _b[0], setPostCheckStatus = _b[1];
    var _c = React.useState(AsyncStatus.INACTIVE), postNAStatus = _c[0], setPostNAStatus = _c[1];
    var _d = React.useState(false), showDescription = _d[0], setShowDescription = _d[1];
    var clearCheckmarks = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, api.postClear(item.id)];
                case 1:
                    _a.sent();
                    updateOk(false, item.id);
                    updateNA(false, item.id);
                    setSnackbarText('Change saved.');
                    setPostNAStatus(AsyncStatus.SUCCESS);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    setSnackbarText(error_1.toString());
                    setPostNAStatus(AsyncStatus.ERROR);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleSetNA = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setPostNAStatus(AsyncStatus.LOADING);
                    if (item.isNotApplicable) {
                        clearCheckmarks();
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, api.postSetNA(item.id)];
                case 2:
                    _a.sent();
                    updateOk(false, item.id);
                    updateNA(true, item.id);
                    setSnackbarText('Change saved.');
                    setPostNAStatus(AsyncStatus.SUCCESS);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    setSnackbarText(error_2.toString());
                    setPostNAStatus(AsyncStatus.ERROR);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSetOk = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (item.isOk)
                        return [2 /*return*/, clearCheckmarks()];
                    setPostCheckStatus(AsyncStatus.LOADING);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, api.postSetOk(item.id)];
                case 2:
                    _a.sent();
                    updateNA(false, item.id);
                    updateOk(true, item.id);
                    setSnackbarText('Change saved.');
                    setPostCheckStatus(AsyncStatus.SUCCESS);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    setSnackbarText(error_3.toString());
                    setPostCheckStatus(AsyncStatus.ERROR);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxRuntime.jsxs(CheckItemWrapper, __assign({ disabled: item.isNotApplicable }, { children: [jsxRuntime.jsxs(DescriptionAndCheckWrapper, { children: [jsxRuntime.jsxs(LeftWrapper, { children: [jsxRuntime.jsx("p", { children: item.text }, void 0),
                                item.detailText && (jsxRuntime.jsxs("button", __assign({ onClick: function () {
                                        return setShowDescription(function (current) { return !current; });
                                    } }, { children: [jsxRuntime.jsx("p", { children: showDescription
                                                ? 'Hide details'
                                                : 'Show details' }, void 0),
                                        jsxRuntime.jsx(EdsIcon, { name: showDescription
                                                ? 'chevron_down'
                                                : 'chevron_right', size: 16 }, void 0)] }), void 0))] }, void 0),
                        jsxRuntime.jsxs(CheckboxGroup, { children: [jsxRuntime.jsx(edsCoreReact.Checkbox, { disabled: isSigned ||
                                        item.isNotApplicable ||
                                        postCheckStatus === AsyncStatus.LOADING, enterKeyHint: 'send', onChange: handleSetOk, checked: item.isOk, "data-testid": 'checked-' + item.id, label: '' }, void 0),
                                jsxRuntime.jsx(edsCoreReact.Checkbox, { disabled: isSigned || postNAStatus === AsyncStatus.LOADING, enterKeyHint: 'send', onChange: handleSetNA, checked: item.isNotApplicable, label: '', "data-testid": 'NA-' + item.id }, void 0)] }, void 0)] }, void 0),
                jsxRuntime.jsx(CheckItemDescriptionWrapper, { children: showDescription && jsxRuntime.jsx("p", { children: item.detailText }, void 0) }, void 0),
                item.metaTable && !item.isNotApplicable && (jsxRuntime.jsx(MetaTable, { disabled: item.isNotApplicable || isSigned, labels: item.metaTable.columnLabels, rows: item.metaTable.rows, isSigned: isSigned, checkItemId: item.id, api: api }, void 0))] }), void 0) }, void 0));
};
var templateObject_1$a, templateObject_2$5, templateObject_3$3, templateObject_4$2, templateObject_5$1;

var CheckHeaderWrapper = styled__default['default'].div(templateObject_1$9 || (templateObject_1$9 = __makeTemplateObject(["\n    display: flex;\n    justify-content: space-between;\n    align-items: flex-end;\n    margin-top: 48px;\n    padding-bottom: 12px;\n    border-bottom: ", ";\n    & div {\n        flex: 0 0 95px;\n        padding-right: 6px;\n        display: flex;\n        justify-content: space-around;\n    }\n    & h4 {\n        margin: 0;\n    }\n"], ["\n    display: flex;\n    justify-content: space-between;\n    align-items: flex-end;\n    margin-top: 48px;\n    padding-bottom: 12px;\n    border-bottom: ",
    ";\n    & div {\n        flex: 0 0 95px;\n        padding-right: 6px;\n        display: flex;\n        justify-content: space-around;\n    }\n    & h4 {\n        margin: 0;\n    }\n"])), function (props) {
    return props.noBorder ? 'none' : "2px solid " + COLORS.fadedBlue;
});
var GreyText = styled__default['default'].p(templateObject_2$4 || (templateObject_2$4 = __makeTemplateObject(["\n    margin: 0;\n    color: ", ";\n"], ["\n    margin: 0;\n    color: ", ";\n"])), COLORS.darkGrey);
var CheckHeader = function (_a) {
    var text = _a.text, removeLabels = _a.removeLabels;
    return (jsxRuntime.jsxs(CheckHeaderWrapper, __assign({ noBorder: removeLabels }, { children: [jsxRuntime.jsx("h4", { children: text }, void 0),
            jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx(GreyText, { children: !removeLabels && 'Check' }, void 0),
                    jsxRuntime.jsx(GreyText, { children: !removeLabels && 'NA' }, void 0)] }, void 0)] }), void 0));
};
var templateObject_1$9, templateObject_2$4;

var StyledCheckAllButton = styled__default['default'](edsCoreReact.Button)(templateObject_1$8 || (templateObject_1$8 = __makeTemplateObject(["\n    :disabled {\n        margin: 24px 0 12px auto;\n    }\n    margin: 24px 0 12px auto;\n"], ["\n    :disabled {\n        margin: 24px 0 12px auto;\n    }\n    margin: 24px 0 12px auto;\n"])));
var CheckAllButton = function (_a) {
    var items = _a.items, updateOk = _a.updateOk, allItemsCheckedOrNA = _a.allItemsCheckedOrNA, setSnackbarText = _a.setSnackbarText, api = _a.api;
    var _b = React.useState(AsyncStatus.INACTIVE), checkAllStatus = _b[0], setCheckAllStatus = _b[1];
    var checkAll = function () { return __awaiter(void 0, void 0, void 0, function () {
        var itemsToCheck;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setCheckAllStatus(AsyncStatus.LOADING);
                    itemsToCheck = items.filter(function (item) { return !item.isOk && !item.isNotApplicable; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all(itemsToCheck.map(function (item) {
                            return api.postSetOk(item.id);
                        }))];
                case 2:
                    _a.sent();
                    itemsToCheck.forEach(function (item) { return updateOk(true, item.id); });
                    setCheckAllStatus(AsyncStatus.SUCCESS);
                    setSnackbarText('Changes saved.');
                    return [3 /*break*/, 4];
                case 3:
                    _a.sent();
                    setCheckAllStatus(AsyncStatus.ERROR);
                    setSnackbarText('Unable to save changes.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var uncheckAll = function () { return __awaiter(void 0, void 0, void 0, function () {
        var itemsToCheck;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setCheckAllStatus(AsyncStatus.LOADING);
                    itemsToCheck = items.filter(function (item) { return item.isOk && !item.isNotApplicable; });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.all(itemsToCheck.map(function (item) {
                            return api.postClear(item.id);
                        }))];
                case 2:
                    _a.sent();
                    itemsToCheck.forEach(function (item) { return updateOk(false, item.id); });
                    setCheckAllStatus(AsyncStatus.SUCCESS);
                    setSnackbarText('Uncheck complete.');
                    return [3 /*break*/, 4];
                case 3:
                    _a.sent();
                    setCheckAllStatus(AsyncStatus.ERROR);
                    setSnackbarText('Unable to save changes.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (jsxRuntime.jsxs(StyledCheckAllButton, __assign({ variant: "outlined", onClick: allItemsCheckedOrNA ? uncheckAll : checkAll, disabled: checkAllStatus === AsyncStatus.LOADING }, { children: [jsxRuntime.jsx(EdsIcon, { name: allItemsCheckedOrNA ? 'checkbox' : 'checkbox_outline' }, void 0), allItemsCheckedOrNA ? 'Uncheck all' : 'Check all'] }), void 0));
};
var templateObject_1$8;

var CheckItemsWrapper = styled__default['default'].div(templateObject_1$7 || (templateObject_1$7 = __makeTemplateObject(["\n    display: flex;\n    flex-direction: column;\n    & div:first-of-type {\n        margin-top: 0;\n    }\n    & > div {\n        &:first-child {\n            margin-top: 16px;\n        }\n    }\n"], ["\n    display: flex;\n    flex-direction: column;\n    & div:first-of-type {\n        margin-top: 0;\n    }\n    & > div {\n        &:first-child {\n            margin-top: 16px;\n        }\n    }\n"])));
var determineIfAllAreCheckedOrNA = function (itemsToDetermine) {
    return itemsToDetermine.every(function (item) { return item.isOk || item.isNotApplicable; });
};
var CheckItems = function (_a) {
    var checkItems = _a.checkItems, details = _a.details, isSigned = _a.isSigned, allItemsCheckedOrNA = _a.allItemsCheckedOrNA, setAllItemsCheckedOrNA = _a.setAllItemsCheckedOrNA, setSnackbarText = _a.setSnackbarText, api = _a.api;
    var _b = React.useState(checkItems), items = _b[0], setItems = _b[1];
    React.useEffect(function () {
        setAllItemsCheckedOrNA(determineIfAllAreCheckedOrNA(items));
    }, [items, setAllItemsCheckedOrNA]);
    var updateNA = function (value, checkItemId) {
        setItems(function (items) {
            return items.map(function (existingItem) {
                return existingItem.id === checkItemId
                    ? __assign(__assign({}, existingItem), { isNotApplicable: value }) : existingItem;
            });
        });
    };
    var updateOk = function (value, checkItemId) {
        setItems(function (items) {
            return items.map(function (existingItem) {
                return existingItem.id === checkItemId
                    ? __assign(__assign({}, existingItem), { isOk: value }) : existingItem;
            });
        });
    };
    var determineCheckItem = function (item, index, nextItemIsHeading) {
        if (item.isHeading && nextItemIsHeading) {
            return jsxRuntime.jsx(jsxRuntime.Fragment, {}, void 0);
        }
        if (item.isHeading) {
            return (jsxRuntime.jsx(CheckHeader, { text: item.text, removeLabels: nextItemIsHeading }, void 0));
        }
        // Return "OK / NA" labels if the first check item is not a heading.
        return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [index === 0 ? jsxRuntime.jsx(CheckHeader, { text: "" }, void 0) : null,
                jsxRuntime.jsx(CheckItem, { item: item, updateNA: updateNA, updateOk: updateOk, checklistId: details.id, isSigned: isSigned, setSnackbarText: setSnackbarText, api: api }, void 0)] }, void 0));
    };
    var itemsToDisplay = items.map(function (item, index) {
        var nextItemIsHeading = items[index + 1]
            ? items[index + 1].isHeading
            : true;
        return (jsxRuntime.jsx(React__default['default'].Fragment, { children: determineCheckItem(item, index, nextItemIsHeading) }, item.id));
    });
    return (jsxRuntime.jsxs(CheckItemsWrapper, { children: [!isSigned && (jsxRuntime.jsx(CheckAllButton, { setSnackbarText: setSnackbarText, allItemsCheckedOrNA: allItemsCheckedOrNA, items: items, updateOk: updateOk, api: api }, void 0)), itemsToDisplay] }, void 0));
};
var templateObject_1$7;

var determineVariant = function (status) {
    if (status === AsyncStatus.ERROR)
        return 'error';
    if (status === AsyncStatus.SUCCESS)
        return 'success';
    return 'default';
};
var determineHelperText = function (status) {
    if (status === AsyncStatus.ERROR)
        return 'Unable to save comment.';
    if (status === AsyncStatus.SUCCESS)
        return 'Comment saved.';
    if (status === AsyncStatus.LOADING)
        return 'Saving.';
    return '';
};

edsCoreReact.Banner.BannerMessage; edsCoreReact.Banner.BannerIcon;
var ChecklistSignatureWrapper = styled__default['default'].div(templateObject_1$6 || (templateObject_1$6 = __makeTemplateObject(["\n    display: flex;\n    flex-direction: column;\n    box-sizing: border-box;\n    & button,\n    button:disabled {\n        width: fit-content;\n        margin-left: auto;\n        margin-top: ", ";\n    }\n"], ["\n    display: flex;\n    flex-direction: column;\n    box-sizing: border-box;\n    & button,\n    button:disabled {\n        width: fit-content;\n        margin-left: auto;\n        margin-top: ",
    ";\n    }\n"])), function (props) {
    return props.helperTextVisible ? '0' : '24px';
});
var determineSignButtonText = function (isSigned, status) {
    if (status === AsyncStatus.LOADING) {
        if (isSigned)
            return 'Unsigning...';
        return 'Signing...';
    }
    else {
        if (isSigned)
            return 'Unsign';
        return 'Sign';
    }
};
var ChecklistSignature = function (_a) {
    var details = _a.details, setIsSigned = _a.setIsSigned, isSigned = _a.isSigned, allItemsCheckedOrNA = _a.allItemsCheckedOrNA, reloadChecklist = _a.reloadChecklist, setSnackbarText = _a.setSnackbarText, api = _a.api;
    var _b = React.useState(details.comment), comment = _b[0], setComment = _b[1];
    var _c = React.useState(AsyncStatus.INACTIVE), putCommentStatus = _c[0], setPutCommentStatus = _c[1];
    var _d = React.useState(AsyncStatus.INACTIVE), signStatus = _d[0], setSignStatus = _d[1];
    var commentBeforeFocus = '';
    var putComment = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (comment === commentBeforeFocus)
                        return [2 /*return*/];
                    setPutCommentStatus(AsyncStatus.LOADING);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, api.putChecklistComment(comment)];
                case 2:
                    _a.sent();
                    setPutCommentStatus(AsyncStatus.SUCCESS);
                    reloadChecklist(function (prev) { return !prev; });
                    return [3 /*break*/, 4];
                case 3:
                    _a.sent();
                    setPutCommentStatus(AsyncStatus.ERROR);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSignClick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSignStatus(AsyncStatus.LOADING);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!isSigned) return [3 /*break*/, 3];
                    return [4 /*yield*/, api.postUnsign()];
                case 2:
                    _a.sent();
                    setIsSigned(false);
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, api.postSign()];
                case 4:
                    _a.sent();
                    setIsSigned(true);
                    _a.label = 5;
                case 5:
                    setSignStatus(AsyncStatus.SUCCESS);
                    setSnackbarText(isSigned ? 'Unsign complete.' : 'Signing complete.');
                    reloadChecklist(function (reloadStatus) { return !reloadStatus; });
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    setSignStatus(AsyncStatus.ERROR);
                    setSnackbarText(error_2.toString());
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var updatedByText = function () {
        return "Updated by " + details.updatedByFirstName + " " + details.updatedByLastName + " at " + new Date(details.updatedAt).toLocaleDateString('en-GB');
    };
    React.useEffect(function () {
        if (putCommentStatus === AsyncStatus.INACTIVE ||
            putCommentStatus === AsyncStatus.LOADING)
            return;
        setTimeout(function () {
            setPutCommentStatus(AsyncStatus.INACTIVE);
        }, 2000);
    }, [putCommentStatus]);
    return (jsxRuntime.jsxs(ChecklistSignatureWrapper, __assign({ helperTextVisible: putCommentStatus !== AsyncStatus.INACTIVE }, { children: [jsxRuntime.jsx("p", { children: details.signedAt ? (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: ["Signed by ", details.signedByFirstName, ' ', details.signedByLastName, " at", ' ', new Date(details.signedAt).toLocaleDateString('en-GB')] }, void 0)) : ('This checklist is unsigned.') }, void 0),
            jsxRuntime.jsx(edsCoreReact.Divider, {}, void 0),
            jsxRuntime.jsx(edsCoreReact.TextField, { id: 'comment-field', maxLength: 500, variant: determineVariant(putCommentStatus), disabled: isSigned || putCommentStatus === AsyncStatus.LOADING, multiline: true, rows: 5, label: "Comment", helperText: putCommentStatus === AsyncStatus.INACTIVE &&
                    details.updatedAt
                    ? updatedByText()
                    : determineHelperText(putCommentStatus), value: comment, onChange: function (e) { return setComment(e.target.value); }, onFocus: function () { return (commentBeforeFocus = comment); }, onBlur: putComment }, void 0),
            jsxRuntime.jsx(edsCoreReact.Button, __assign({ onClick: handleSignClick, disabled: signStatus === AsyncStatus.LOADING || !allItemsCheckedOrNA }, { children: determineSignButtonText(isSigned, signStatus) }), void 0)] }), void 0));
};
var templateObject_1$6;

var img$3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAM3SURBVHgB7Zu9mtJAFIY/0MISOsvY2e3SbZeh08rdO3CvgLW0IunsXK+ALe3Ubq126OyEK3C8AqG0wu/AgGw2/IQkwEz2fZ7DEEgCX07mZH7O1FASURQ1WKjJZBLUarUTvj+lyWdBYldjbUQb0jRtwONHKIEaCkREUlyHIhU3FfKheZ5vPN9XntegIAoRzD+kWHSRX+QqNC3m72jkJJfgPQhNYmiXeYTvJJg/GLDoYX9Ck9xg5nGDjDxBRuI47rD4THuJwyEB8FwpNdZaD7IcmEkwr+hHKWjPcHgk4ovoBkV/3/agrW5p+4i5w+zKHiPi5YttbvGNgm19FbEBjhtDa28SvVawQ2LnGFprXaOljvV8gTtihQAzB61kZdCyAeoc7vF8XSBLFUyxb1l8gLuchWE47vf7P5JfPKjDDtbbVUg9biWDWFodlqZiAPeRR2kv+eE9D9u28R38or3c9k56uAf/6C5vLARb7wbwD2W1TVn2cBf+stA2rcM2Mv+C3zSlBTb1MIdSXGxgZOVKXqaCOW70Bv4TykvNdv3+oBo0xcPH2sctAyWCFSqCjJGL4BNUBJkQEMENVIfTp8jRumLAK3TmIsPvTrAbDfFwgOoQbBri8Y5Hwb4jgg2qg5EovfPEc45oeSiMeHiI6jCus7mVafbNcQZ1NrcMqoOWW1qjOgzqduJJw3/0YoiH9OE5khEk5VzwNTxH0p+knAquwG2t53NMy03LGP6y0JacW5J5JQW/MNT1Yr6R7Dz46OXL5Y17gu0sm4Y/3CSz9tK6h3JFSslk3TMGKXfsg5QHrfUoDMO/DOOv4DbvopSczNQcD8mNUEo1+fYMbvKJYlNzVDblaf2EezMTklzeWvXlpiGeNtwaETG0i3U7rBVsW2CuiDbYIvVw4yCePYGIPuaBAvlvraiI5NJleELpZHRwXEiAutp250z50nxk3TJ6/8b/FSqHZMQu3/s4jqMsB2XOiJcMdIqWvqU8tg4VwTXtNcXeIiNFLPKQ3K4A+0Ej5+qWx2U8eZD0J8kIskkyCvnQmA09XUcFrlIrbX7XJstIHVeYZRnMl+EFiV0NZp2VAS/W0A4b66ikpXj/AE7hFBegivatAAAAAElFTkSuQmCC";

var img$2 = "data:image/svg+xml,%3csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z' fill='%234BB748'/%3e%3cpath d='M9.23327 15.2622L6.25827 12.2872L5.2666 13.2789L9.23327 17.2456L17.7333 8.74557L16.7416 7.75391L9.23327 15.2622Z' fill='white'/%3e%3c/svg%3e";

var img$1 = "data:image/png;base64,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";

var img = "data:image/png;base64,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";

var CompletionStatusIcon = function (_a) {
    var status = _a.status;
    if (status === CompletionStatus.OS) {
        return jsxRuntime.jsx("img", { src: img$3, alt: "OS" }, void 0);
    }
    if (status === CompletionStatus.OK) {
        return jsxRuntime.jsx("img", { src: img$2, alt: "OK" }, void 0);
    }
    if (status === CompletionStatus.PA) {
        return jsxRuntime.jsx("img", { src: img$1, alt: "PA" }, void 0);
    }
    if (status === CompletionStatus.PB) {
        return jsxRuntime.jsx("img", { src: img, alt: "PB" }, void 0);
    }
    return jsxRuntime.jsx(jsxRuntime.Fragment, {}, void 0);
};

var FormularTypeText = styled__default['default'].p(templateObject_1$5 || (templateObject_1$5 = __makeTemplateObject(["\n    flex: 1;\n"], ["\n    flex: 1;\n"])));
var TextWrapper = styled__default['default'].div(templateObject_2$3 || (templateObject_2$3 = __makeTemplateObject(["\n    flex: 3;\n    padding-right: 15px;\n    & p,\n    h6 {\n        margin: 0;\n    }\n"], ["\n    flex: 3;\n    padding-right: 15px;\n    & p,\n    h6 {\n        margin: 0;\n    }\n"])));
var ChecklistDetailsCardWrapper = styled__default['default'].div(templateObject_3$2 || (templateObject_3$2 = __makeTemplateObject(["\n    padding: 16px 4%;\n    box-sizing: border-box;\n    width: 100%;\n    background-color: ", ";\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    box-shadow: ", ";\n    & img {\n        max-width: 20px;\n        margin: 10px 16px 10px 0px;\n        flex: 1;\n    }\n    & ", " {\n        flex: 1;\n        text-align: right;\n        padding-right: 24px;\n    }\n"], ["\n    padding: 16px 4%;\n    box-sizing: border-box;\n    width: 100%;\n    background-color: ",
    ";\n    display: flex;\n    justify-content: space-between;\n    align-items: center;\n    box-shadow: ", ";\n    & img {\n        max-width: 20px;\n        margin: 10px 16px 10px 0px;\n        flex: 1;\n    }\n    & ", " {\n        flex: 1;\n        text-align: right;\n        padding-right: 24px;\n    }\n"])), function (props) {
    return props.isSigned ? COLORS.fadedBlue : COLORS.lightGrey;
}, SHADOW, FormularTypeText);
var ChecklistDetailsCard = function (_a) {
    var details = _a.details, isSigned = _a.isSigned; _a.descriptionLabel;
    return (jsxRuntime.jsxs(ChecklistDetailsCardWrapper, __assign({ isSigned: isSigned }, { children: [jsxRuntime.jsx(CompletionStatusIcon, { status: details.status }, void 0),
            jsxRuntime.jsxs(TextWrapper, { children: [jsxRuntime.jsx("label", { children: details.tagNo }, void 0),
                    jsxRuntime.jsx("p", { children: details.tagDescription }, void 0)] }, void 0),
            jsxRuntime.jsx(FormularTypeText, { children: details.formularType }, void 0)] }), void 0));
};
var templateObject_1$5, templateObject_2$3, templateObject_3$2;

var SkeletonLoadingPageWrapper = styled__default['default'].div(templateObject_1$4 || (templateObject_1$4 = __makeTemplateObject(["\n    padding: 24px 0;\n    min-height: ", ";\n    & h3 {\n        margin: 0;\n        text-align: center;\n    }\n"], ["\n    padding: 24px 0;\n    min-height: ",
    ";\n    & h3 {\n        margin: 0;\n        text-align: center;\n    }\n"])), function (props) {
    return props.adjustableHeight ? 'auto' : '92vh';
});
var load = styled.keyframes(templateObject_2$2 || (templateObject_2$2 = __makeTemplateObject(["\n    from {\n        left: -150px;\n    }\n    to   {\n        left: 100%;\n    }\n"], ["\n    from {\n        left: -150px;\n    }\n    to   {\n        left: 100%;\n    }\n"])));
var BaseSkeleton = styled__default['default'](edsCoreReact.Card)(templateObject_3$1 || (templateObject_3$1 = __makeTemplateObject(["\n    box-sizing: border-box;\n    border-radius: 10px;\n    background-color: #eeeeee;\n    position: relative;\n    overflow: hidden;\n    margin: 20px;\n    ::before {\n        content: '';\n        display: block;\n        position: absolute;\n        left: -150px;\n        top: 0;\n        height: 100%;\n        width: 50%;\n        background: linear-gradient(\n            to right,\n            #eeeeee 0%,\n            #e6e6e6 50%,\n            #eeeeee 100%\n        );\n        animation: ", " 1s cubic-bezier(0.1, 0, 0.2, 1) infinite;\n    }\n"], ["\n    box-sizing: border-box;\n    border-radius: 10px;\n    background-color: #eeeeee;\n    position: relative;\n    overflow: hidden;\n    margin: 20px;\n    ::before {\n        content: '';\n        display: block;\n        position: absolute;\n        left: -150px;\n        top: 0;\n        height: 100%;\n        width: 50%;\n        background: linear-gradient(\n            to right,\n            #eeeeee 0%,\n            #e6e6e6 50%,\n            #eeeeee 100%\n        );\n        animation: ", " 1s cubic-bezier(0.1, 0, 0.2, 1) infinite;\n    }\n"])), load);
var SkeletonRow = styled__default['default'](BaseSkeleton)(templateObject_4$1 || (templateObject_4$1 = __makeTemplateObject(["\n    width: ", ";\n    height: 50px;\n    margin: 15px auto 15px auto;\n"], ["\n    width: ", ";\n    height: 50px;\n    margin: 15px auto 15px auto;\n"])), function (props) { return (props.fullWidth ? '100%' : '92%'); });
var SkeletonLoadingPage = function (_a) {
    var text = _a.text, fullWidth = _a.fullWidth, _b = _a.nrOfRows, nrOfRows = _b === void 0 ? 10 : _b, adjustableHeight = _a.adjustableHeight;
    var SkeletonRowsToRender = [];
    for (var i = 0; i < nrOfRows; i++) {
        SkeletonRowsToRender.push(i === 0 ? (jsxRuntime.jsx(SkeletonRow, { "data-testid": "skeleton-row", fullWidth: fullWidth ? true : false }, i)) : (jsxRuntime.jsx(SkeletonRow, { fullWidth: fullWidth ? true : false }, i)));
    }
    return (jsxRuntime.jsxs(SkeletonLoadingPageWrapper, __assign({ adjustableHeight: adjustableHeight }, { children: [text && jsxRuntime.jsx("h3", { children: text }, void 0), SkeletonRowsToRender] }), void 0));
};
var templateObject_1$4, templateObject_2$2, templateObject_3$1, templateObject_4$1;

var CardHeader = edsCoreReact.Card.CardHeader, CardHeaderTitle = edsCoreReact.Card.CardHeaderTitle;
var CardWrapper = styled__default['default'].article(templateObject_1$3 || (templateObject_1$3 = __makeTemplateObject(["\n    & h3,\n    label {\n        margin: 0;\n    }\n    & h5 {\n        margin: 12px 0;\n    }\n    margin-bottom: 16px;\n    box-shadow: ", ";\n    border-radius: 10px;\n"], ["\n    & h3,\n    label {\n        margin: 0;\n    }\n    & h5 {\n        margin: 12px 0;\n    }\n    margin-bottom: 16px;\n    box-shadow: ", ";\n    border-radius: 10px;\n"])), SHADOW);
var EdsCard = function (_a) {
    var title = _a.title, icon = _a.icon, children = _a.children;
    return (jsxRuntime.jsx(CardWrapper, { children: jsxRuntime.jsxs(edsCoreReact.Card, { children: [jsxRuntime.jsxs(CardHeader, { children: [jsxRuntime.jsx(CardHeaderTitle, { children: jsxRuntime.jsx("h3", { children: title }, void 0) }, void 0), icon ? icon : null] }, void 0),
                jsxRuntime.jsx("div", { children: children }, void 0)] }, void 0) }, void 0));
};
var templateObject_1$3;

var AsyncCard = function (_a) {
    var fetchStatus = _a.fetchStatus, errorMessage = _a.errorMessage, emptyContentMessage = _a.emptyContentMessage, cardTitle = _a.cardTitle, children = _a.children;
    var content = function () {
        if (fetchStatus === AsyncStatus.SUCCESS) {
            return children;
        }
        else if (fetchStatus === AsyncStatus.EMPTY_RESPONSE) {
            return jsxRuntime.jsx("p", { children: emptyContentMessage }, void 0);
        }
        else if (fetchStatus === AsyncStatus.ERROR) {
            return jsxRuntime.jsx("p", { children: errorMessage }, void 0);
        }
        else {
            return jsxRuntime.jsx(SkeletonLoadingPage, { nrOfRows: 3, adjustableHeight: true }, void 0);
        }
    };
    return jsxRuntime.jsx(EdsCard, __assign({ title: cardTitle }, { children: content() }), void 0);
};

var handleDownload = function (blobUrl, fileName) { return __awaiter(void 0, void 0, void 0, function () {
    var tempLink;
    return __generator(this, function (_a) {
        tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobUrl;
        tempLink.setAttribute('download', fileName);
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        return [2 /*return*/];
    });
}); };

var ATTACHMENT_SIZE = '112px';
var AttachmentsWrapper = styled__default['default'].div(templateObject_1$2 || (templateObject_1$2 = __makeTemplateObject(["\n    display: flex;\n    flex-wrap: wrap;\n"], ["\n    display: flex;\n    flex-wrap: wrap;\n"])));
var UploadImageButton = styled__default['default'](edsCoreReact.Button)(templateObject_2$1 || (templateObject_2$1 = __makeTemplateObject(["\n    height: ", ";\n    width: ", ";\n    margin: 8px;\n    &:disabled {\n        height: ", ";\n        width: ", ";\n        margin: 8px;\n    }\n"], ["\n    height: ", ";\n    width: ", ";\n    margin: 8px;\n    &:disabled {\n        height: ", ";\n        width: ", ";\n        margin: 8px;\n    }\n"])), ATTACHMENT_SIZE, ATTACHMENT_SIZE, ATTACHMENT_SIZE, ATTACHMENT_SIZE);
var AttachmentWrapper = styled__default['default'].div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    height: ", ";\n    width: ", ";\n    margin: 8px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n"], ["\n    height: ", ";\n    width: ", ";\n    margin: 8px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n"])), ATTACHMENT_SIZE, ATTACHMENT_SIZE);
var DocumentAttachmentWrapper = styled__default['default'](AttachmentWrapper)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n    background-color: ", ";\n    border: 2px solid ", ";\n    overflow: hidden;\n    box-sizing: border-box;\n    padding: 8px;\n    padding-top: 15px;\n    position: relative;\n    align-items: flex-start;\n    justify-content: flex-start;\n    & > button {\n        position: absolute;\n        bottom: 0;\n        right: 5px;\n    }\n    & > svg {\n        position: absolute;\n        bottom: 8px;\n        left: 50px;\n    }\n"], ["\n    background-color: ", ";\n    border: 2px solid ", ";\n    overflow: hidden;\n    box-sizing: border-box;\n    padding: 8px;\n    padding-top: 15px;\n    position: relative;\n    align-items: flex-start;\n    justify-content: flex-start;\n    & > button {\n        position: absolute;\n        bottom: 0;\n        right: 5px;\n    }\n    & > svg {\n        position: absolute;\n        bottom: 8px;\n        left: 50px;\n    }\n"])), COLORS.fadedBlue, COLORS.mossGreen);
var AttachmentImage = styled__default['default'].img(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n    height: ", ";\n    margin: 8px;\n"], ["\n    height: ", ";\n    margin: 8px;\n"])), ATTACHMENT_SIZE);
var ImageModal = styled__default['default'].div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n    width: 80vw;\n    max-height: 80vh;\n    padding: 16px;\n    & > img {\n        width: 100%;\n        max-height: 65vh;\n        object-fit: contain;\n    }\n"], ["\n    width: 80vw;\n    max-height: 80vh;\n    padding: 16px;\n    & > img {\n        width: 100%;\n        max-height: 65vh;\n        object-fit: contain;\n    }\n"])));
styled__default['default'](edsCoreReact.Button)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n    left: 0;\n"], ["\n    left: 0;\n"])));
var ButtonGroup = styled__default['default'].div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n    margin: 0 auto;\n    display: flex;\n    flex-direction: column;\n    max-width: 160px;\n    justify-content: center;\n    & > button,\n    button:disabled {\n        margin-top: 4px;\n    }\n"], ["\n    margin: 0 auto;\n    display: flex;\n    flex-direction: column;\n    max-width: 160px;\n    justify-content: center;\n    & > button,\n    button:disabled {\n        margin-top: 4px;\n    }\n"])));
var Attachment = function (_a) {
    var attachment = _a.attachment, getAttachment = _a.getAttachment, deleteAttachment = _a.deleteAttachment, refreshAttachments = _a.refreshAttachments, setSnackbarText = _a.setSnackbarText, _b = _a.isSigned, isSigned = _b === void 0 ? false : _b;
    var _c = React.useState(false), showFullScreenImage = _c[0], setShowFullScreenImage = _c[1];
    var _d = React.useState(''), attachmentFileURL = _d[0], setAttachmentFileURL = _d[1];
    var _e = React.useState(AsyncStatus.INACTIVE), loadingStatus = _e[0], setLoadingStatus = _e[1];
    var _f = React.useState(AsyncStatus.INACTIVE), deleteStatus = _f[0], setDeleteStatus = _f[1];
    var isDocument = attachment.mimeType.substr(0, 5) !== 'image';
    var source = Axios__default['default'].CancelToken.source();
    React.useEffect(function () {
        return function () {
            source.cancel();
        };
    }, []);
    var loadAttachment = function () { return __awaiter(void 0, void 0, void 0, function () {
        var blob, imageUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoadingStatus(AsyncStatus.LOADING);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getAttachment(source.token)];
                case 2:
                    blob = _a.sent();
                    imageUrl = '';
                    try {
                        imageUrl = window.URL.createObjectURL(blob);
                    }
                    catch (_b) {
                        console.log('Failed to create object URL from blob: ', blob);
                    }
                    setAttachmentFileURL(imageUrl);
                    if (!isDocument) {
                        setShowFullScreenImage(true);
                    }
                    else {
                        handleDownload(imageUrl, attachment.fileName);
                    }
                    setLoadingStatus(AsyncStatus.SUCCESS);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    if (!Axios__default['default'].isCancel(error_1)) {
                        setSnackbarText('Unable to load image.');
                        setLoadingStatus(AsyncStatus.ERROR);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!deleteAttachment)
                        return [2 /*return*/];
                    setDeleteStatus(AsyncStatus.LOADING);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, deleteAttachment(source.token)];
                case 2:
                    _a.sent();
                    setSnackbarText('Attachment successfully removed');
                    refreshAttachments && refreshAttachments(function (prev) { return !prev; });
                    setDeleteStatus(AsyncStatus.SUCCESS);
                    setShowFullScreenImage(false);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    if (!Axios__default['default'].isCancel(error_2)) {
                        setDeleteStatus(AsyncStatus.ERROR);
                        setSnackbarText(error_2.toString());
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (attachment.mimeType.substr(0, 5) !== 'image') {
        if (deleteStatus === AsyncStatus.LOADING) {
            return (jsxRuntime.jsx(AttachmentWrapper, { children: jsxRuntime.jsx(edsCoreReact.CircularProgress, {}, void 0) }, void 0));
        }
        return (jsxRuntime.jsxs(DocumentAttachmentWrapper, { children: [jsxRuntime.jsx(edsCoreReact.Typography, __assign({ lines: 3 }, { children: attachment.title }), void 0),
                jsxRuntime.jsx(edsCoreReact.Button, __assign({ variant: 'ghost_icon', onClick: loadAttachment }, { children: jsxRuntime.jsx(EdsIcon, { name: "cloud_download", color: COLORS.mossGreen, alt: 'download document' }, void 0) }), void 0)] }, void 0));
    }
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [showFullScreenImage ? (jsxRuntime.jsx(edsCoreReact.Scrim, __assign({ isDismissable: true, onClose: function () { return setShowFullScreenImage(false); } }, { children: jsxRuntime.jsxs(ImageModal, { children: [jsxRuntime.jsx("img", { src: attachmentFileURL, alt: attachment.title }, void 0),
                        jsxRuntime.jsxs(ButtonGroup, { children: [jsxRuntime.jsxs(edsCoreReact.Button, __assign({ onClick: function () {
                                        return setShowFullScreenImage(false);
                                    } }, { children: [jsxRuntime.jsx(EdsIcon, { name: "close" }, void 0), "Close"] }), void 0),
                                jsxRuntime.jsxs(edsCoreReact.Button, __assign({ onClick: function () {
                                        handleDownload(attachmentFileURL, attachment.fileName);
                                        setSnackbarText('Image successfully downloaded.');
                                    } }, { children: [jsxRuntime.jsx(EdsIcon, { name: "cloud_download", size: 32 }, void 0), "Download"] }), void 0),
                                isSigned || !deleteAttachment ? null : (jsxRuntime.jsxs(edsCoreReact.Button, __assign({ color: 'danger', onClick: handleDelete, disabled: deleteStatus === AsyncStatus.LOADING ||
                                        !deleteAttachment }, { children: [jsxRuntime.jsx(EdsIcon, { name: "delete_to_trash", color: deleteStatus === AsyncStatus.LOADING
                                                ? COLORS.black
                                                : COLORS.white, alt: "Delete attachment" }, void 0), deleteStatus === AsyncStatus.LOADING
                                            ? 'Loading...'
                                            : 'Delete'] }), void 0))] }, void 0)] }, void 0) }), void 0)) : null,
            loadingStatus === AsyncStatus.LOADING ? (jsxRuntime.jsx(AttachmentWrapper, { children: jsxRuntime.jsx(edsCoreReact.CircularProgress, {}, void 0) }, void 0)) : (jsxRuntime.jsx(AttachmentImage, { src: "data:image/png;base64, " + attachment.thumbnailAsBase64, alt: attachment.title + " thumbnail", onClick: loadAttachment }, void 0))] }, void 0));
};
var templateObject_1$2, templateObject_2$1, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;

var UploadContainer = styled__default['default'].div(templateObject_1$1 || (templateObject_1$1 = __makeTemplateObject(["\n    max-height: 80vh;\n    width: 300px;\n    background-color: ", ";\n    padding: 16px;\n    overflow: scroll;\n    & img {\n        width: 100%;\n        max-height: 200px;\n        object-fit: contain;\n    }\n    & > button,\n    button:disabled {\n        margin-top: 12px;\n        margin-left: 8px;\n        float: right;\n    }\n"], ["\n    max-height: 80vh;\n    width: 300px;\n    background-color: ", ";\n    padding: 16px;\n    overflow: scroll;\n    & img {\n        width: 100%;\n        max-height: 200px;\n        object-fit: contain;\n    }\n    & > button,\n    button:disabled {\n        margin-top: 12px;\n        margin-left: 8px;\n        float: right;\n    }\n"])), COLORS.white);
var ChooseImageContainer = styled__default['default'].div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    width: 100%;\n    height: 150px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    border: 2px dashed ", ";\n"], ["\n    width: 100%;\n    height: 150px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    border: 2px dashed ", ";\n"])), COLORS.fadedBlue);
var UploadAttachment = function (_a) {
    var setShowModal = _a.setShowModal, updateAttachments = _a.updateAttachments, setSnackbarText = _a.setSnackbarText, api = _a.api;
    var _b = React.useState(), selectedFile = _b[0], setSelectedFile = _b[1];
    var _c = React.useState(AsyncStatus.INACTIVE), postAttachmentStatus = _c[0], setPostAttachmentStatus = _c[1];
    var fileInputRef = React.useRef(document.createElement('input'));
    var onFileChange = function (e) {
        var currentFiles = e.currentTarget.files;
        if (currentFiles)
            setSelectedFile(currentFiles[0]);
    };
    var onFileUpload = function () { return __awaiter(void 0, void 0, void 0, function () {
        var formData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedFile)
                        return [2 /*return*/];
                    setPostAttachmentStatus(AsyncStatus.LOADING);
                    formData = new FormData();
                    formData.append(selectedFile.name, selectedFile);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, api.postChecklistAttachment(formData, selectedFile.name)];
                case 2:
                    _a.sent();
                    updateAttachments(function (prev) { return !prev; });
                    setPostAttachmentStatus(AsyncStatus.SUCCESS);
                    setSnackbarText('File successfully added.');
                    setShowModal(false);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    setPostAttachmentStatus(AsyncStatus.ERROR);
                    setSnackbarText(error_1.toString());
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (jsxRuntime.jsx(edsCoreReact.Scrim, __assign({ isDismissable: true, onClose: function () { return setShowModal(false); } }, { children: jsxRuntime.jsxs(UploadContainer, { children: [selectedFile ? (jsxRuntime.jsx("img", { src: URL.createObjectURL(selectedFile), alt: selectedFile.name }, void 0)) : (jsxRuntime.jsx(ChooseImageContainer, { children: jsxRuntime.jsx(edsCoreReact.Button, __assign({ onClick: function () { return fileInputRef.current.click(); } }, { children: "Choose image..." }), void 0) }, void 0)),
                jsxRuntime.jsx("input", { type: "file", onChange: onFileChange, accept: "image/*", ref: fileInputRef, style: { display: 'none' } }, void 0),
                jsxRuntime.jsx(edsCoreReact.Button, __assign({ disabled: !selectedFile ||
                        postAttachmentStatus === AsyncStatus.LOADING, onClick: onFileUpload }, { children: postAttachmentStatus === AsyncStatus.LOADING ? (jsxRuntime.jsx(edsCoreReact.DotProgress, { color: "primary" }, void 0)) : ('Upload image') }), void 0),
                selectedFile ? (jsxRuntime.jsx(edsCoreReact.Button, __assign({ onClick: function () { return fileInputRef.current.click(); } }, { children: "Choose other" }), void 0)) : null] }, void 0) }), void 0));
};
var templateObject_1$1, templateObject_2;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
var useAttachments = function (endpoint, api) {
    var _a = React.useState(false), refreshAttachments = _a[0], setRefreshAttachments = _a[1];
    var _b = React.useState([]), attachments = _b[0], setAttachments = _b[1];
    var _c = React.useState(false), showUploadModal = _c[0], setShowUploadModal = _c[1];
    var _d = React.useState(AsyncStatus.LOADING), fetchAttachmentsStatus = _d[0], setFetchAttachmentsStatus = _d[1];
    var source = Axios__default['default'].CancelToken.source();
    React.useEffect(function () {
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var attachmentsFromApi, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.getChecklistAttachments()];
                    case 1:
                        attachmentsFromApi = _a.sent();
                        setFetchAttachmentsStatus(AsyncStatus.SUCCESS);
                        setAttachments(attachmentsFromApi);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        if (!Axios__default['default'].isCancel(error_1)) {
                            setFetchAttachmentsStatus(AsyncStatus.ERROR);
                        }
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
        return function () { return source.cancel(); };
    }, [api, refreshAttachments, endpoint]);
    return {
        fetchAttachmentsStatus: fetchAttachmentsStatus,
        setFetchAttachmentsStatus: setFetchAttachmentsStatus,
        showUploadModal: showUploadModal,
        setShowUploadModal: setShowUploadModal,
        attachments: attachments,
        refreshAttachments: setRefreshAttachments,
    };
};

var buildEndpoint = function () {
    var getChecklistAttachments = function (plantId, checklistId) {
        return "CheckList/Attachments?plantId=PCS$" + plantId + "&checkListId=" + checklistId + "&thumbnailSize=32";
    };
    var getPunchAttachments = function (plantId, punchItemId) {
        return "PunchListItem/Attachments?plantId=PCS$" + plantId + "&punchItemId=" + punchItemId + "&thumbnailSize=32";
    };
    return {
        getChecklistAttachments: getChecklistAttachments,
        getPunchAttachments: getPunchAttachments,
    };
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
var useSnackbar = function () {
    var _a = React.useState(false), showSnackbar = _a[0], setShowSnackbar = _a[1];
    var _b = React.useState(''), snackbarText = _b[0], setSnackbarText = _b[1];
    var snackbar = (jsxRuntime.jsx(edsCoreReact.Snackbar, __assign({ autoHideDuration: 3000, onClose: function () {
            setShowSnackbar(false);
            setSnackbarText('');
        }, open: showSnackbar }, { children: snackbarText }), void 0));
    React.useEffect(function () {
        if (snackbarText.length < 1)
            return;
        setShowSnackbar(true);
    }, [snackbarText]);
    return {
        setSnackbarText: setSnackbarText,
        snackbar: snackbar,
    };
};

var BannerIcon$1 = edsCoreReact.Banner.BannerIcon, BannerMessage$1 = edsCoreReact.Banner.BannerMessage;
var AsyncPage = function (_a) {
    var fetchStatus = _a.fetchStatus, errorMessage = _a.errorMessage, emptyContentMessage = _a.emptyContentMessage, children = _a.children, loadingMessage = _a.loadingMessage;
    var content = function () {
        if (fetchStatus === AsyncStatus.SUCCESS) {
            return jsxRuntime.jsx(jsxRuntime.Fragment, { children: children }, void 0);
        }
        else if (fetchStatus === AsyncStatus.EMPTY_RESPONSE) {
            return (jsxRuntime.jsxs(edsCoreReact.Banner, { children: [jsxRuntime.jsx(BannerIcon$1, { children: jsxRuntime.jsx(EdsIcon, { name: 'info_circle', color: COLORS.mossGreen }, void 0) }, void 0),
                    jsxRuntime.jsx(BannerMessage$1, __assign({ role: 'paragraph' }, { children: emptyContentMessage ? emptyContentMessage : '' }), void 0)] }, void 0));
        }
        else if (fetchStatus === AsyncStatus.ERROR) {
            return (jsxRuntime.jsxs(edsCoreReact.Banner, { children: [jsxRuntime.jsx(BannerIcon$1, __assign({ variant: "warning" }, { children: jsxRuntime.jsx(EdsIcon, { name: 'error_filled', color: COLORS.danger }, void 0) }), void 0),
                    jsxRuntime.jsx(BannerMessage$1, { children: errorMessage }, void 0)] }, void 0));
        }
        else {
            return jsxRuntime.jsx(SkeletonLoadingPage, { nrOfRows: 10, text: loadingMessage }, void 0);
        }
    };
    return jsxRuntime.jsx("div", { children: content() }, void 0);
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
var procosysApiService = function (_a) {
    var axios = _a.axios, _b = _a.apiVersion, apiVersion = _b === void 0 ? '&api-version=4.1' : _b, plantId = _a.plantId, checklistId = _a.checklistId;
    var getChecklist = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.get("Checklist/MC?plantId=PCS$" + plantId + "&checklistId=" + checklistId + apiVersion)];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    }); };
    var postSetOk = function (checkItemId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.post("CheckList/Item/SetOk?plantId=PCS$" + plantId + apiVersion, {
                        CheckListId: checklistId,
                        CheckItemId: checkItemId,
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var postSetNA = function (checkItemId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.post("CheckList/Item/SetNA?plantId=PCS$" + plantId + apiVersion, {
                        CheckListId: checklistId,
                        CheckItemId: checkItemId,
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var postClear = function (checkItemId) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.post("CheckList/Item/Clear?plantId=PCS$" + plantId + apiVersion, {
                        CheckListId: checklistId,
                        CheckItemId: checkItemId,
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var putMetaTableCell = function (checkItemId, columnId, rowId, value) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.put("CheckList/Item/MetaTableCell?plantId=PCS$" + plantId + apiVersion, {
                        CheckListId: checklistId,
                        CheckItemId: checkItemId,
                        ColumnId: columnId,
                        RowId: rowId,
                        Value: value,
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var putChecklistComment = function (Comment) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.put("CheckList/MC/Comment?plantId=PCS$" + plantId + apiVersion, { CheckListId: checklistId, Comment: Comment })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var postSign = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.post("CheckList/MC/Sign?plantId=PCS$" + plantId + apiVersion, checklistId, { headers: { 'Content-Type': 'application/json' } })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var postUnsign = function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.post("CheckList/MC/Unsign?plantId=PCS$" + plantId + apiVersion, checklistId, { headers: { 'Content-Type': 'application/json' } })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var getChecklistAttachments = function () { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.get("CheckList/Attachments?plantId=PCS$" + plantId + "&checkListId=" + checklistId + "&thumbnailSize=32" + apiVersion)];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    }); };
    var getChecklistAttachment = function (cancelToken, attachmentId) { return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.get("CheckList/Attachment?plantId=PCS$" + plantId + "&checkListId=" + checklistId + "&attachmentId=" + attachmentId + apiVersion, {
                        cancelToken: cancelToken,
                        responseType: 'blob',
                        headers: {
                            'Content-Disposition': 'attachment; filename="filename.jpg"',
                        },
                    })];
                case 1:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    }); };
    var deleteChecklistAttachment = function (cancelToken, attachmentId) { return __awaiter(void 0, void 0, void 0, function () {
        var dto;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dto = {
                        CheckListId: parseInt(checklistId),
                        AttachmentId: attachmentId,
                    };
                    return [4 /*yield*/, axios.delete("CheckList/Attachment?plantId=PCS$" + plantId + "&api-version=4.1", { data: dto, cancelToken: cancelToken })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var postChecklistAttachment = function (data, title) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios.post("CheckList/Attachment?plantId=PCS$" + plantId + "&checkListId=" + checklistId + "&title=" + title + apiVersion, data, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        deleteChecklistAttachment: deleteChecklistAttachment,
        getChecklistAttachments: getChecklistAttachments,
        getChecklistAttachment: getChecklistAttachment,
        getChecklist: getChecklist,
        postClear: postClear,
        postSetOk: postSetOk,
        postSetNA: postSetNA,
        postSign: postSign,
        postUnsign: postUnsign,
        postChecklistAttachment: postChecklistAttachment,
        putChecklistComment: putChecklistComment,
        putMetaTableCell: putMetaTableCell,
    };
};

var isObject = function (subject) {
    return (subject === Object(subject) &&
        !Array.isArray(subject) &&
        typeof subject !== 'function');
};
var stringToCamelCase = function (input) {
    return input[0].toLowerCase() + input.substr(1, input.length);
};
var objectToCamelCase = function (input) {
    if (isObject(input)) {
        var n_1 = {};
        Object.keys(input).forEach(function (k) {
            n_1[stringToCamelCase(k)] = objectToCamelCase(input[k]);
        });
        return n_1;
    }
    else if (Array.isArray(input)) {
        return input.map(function (i) {
            return objectToCamelCase(i);
        });
    }
    return input;
};

var baseApiService = function (_a) {
    var accessToken = _a.accessToken, baseUrl = _a.baseUrl;
    var axiosInstance = Axios__default['default'].create();
    axiosInstance.defaults.baseURL = baseUrl;
    axiosInstance.interceptors.request.use(function (request) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                request.headers['Authorization'] = "Bearer " + accessToken;
                return [2 /*return*/, request];
            }
            catch (error) {
                throw new Error(error.message);
            }
            return [2 /*return*/];
        });
    }); });
    axiosInstance.interceptors.response.use(function (response) {
        if (typeof response.data === 'object' &&
            !(response.data instanceof Blob)) {
            response.data = objectToCamelCase(response.data);
        }
        return response;
    }, function (error) {
        if (Axios__default['default'].isCancel(error)) {
            throw error;
        }
        if (error.response) {
            throw new Error(error.response.data);
        }
        else {
            throw new Error(error.message);
        }
    });
    return axiosInstance;
};

var BannerIcon = edsCoreReact.Banner.BannerIcon, BannerMessage = edsCoreReact.Banner.BannerMessage;
var ChecklistWrapper = styled__default['default'].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    padding: 0 4%;\n    display: flex;\n    flex-direction: column;\n    min-height: calc(100vh - 55px);\n    & > ", ":first-of-type {\n        margin-top: 50px;\n    }\n"], ["\n    padding: 0 4%;\n    display: flex;\n    flex-direction: column;\n    min-height: calc(100vh - 55px);\n    & > ", ":first-of-type {\n        margin-top: 50px;\n    }\n"])), CardWrapper);
var initializeApi = function (_a) {
    var checklistId = _a.checklistId, plantId = _a.plantId, accessToken = _a.accessToken, baseUrl = _a.baseUrl;
    var axiosInstance = baseApiService({ accessToken: accessToken, baseUrl: baseUrl });
    return procosysApiService({
        axios: axiosInstance,
        apiVersion: '&api-version=4.1',
        plantId: plantId,
        checklistId: checklistId,
    });
};
var Checklist = function (props) {
    var api = React.useMemo(function () { return initializeApi(__assign({}, props)); }, [
        props.checklistId,
        props.plantId,
    ]);
    var getAttachmentsEndpoint = buildEndpoint().getChecklistAttachments(props.plantId, props.checklistId);
    var _a = useAttachments(getAttachmentsEndpoint, api), setRefreshAttachments = _a.refreshAttachments, attachments = _a.attachments, fetchAttachmentsStatus = _a.fetchAttachmentsStatus;
    var _b = useSnackbar(), snackbar = _b.snackbar, setSnackbarText = _b.setSnackbarText;
    var _c = React.useState(AsyncStatus.LOADING), fetchChecklistStatus = _c[0], setFetchChecklistStatus = _c[1];
    var _d = React.useState([]), checkItems = _d[0], setCheckItems = _d[1];
    var _e = React.useState(), checklistDetails = _e[0], setChecklistDetails = _e[1];
    var _f = React.useState(false), isSigned = _f[0], setIsSigned = _f[1];
    var _g = React.useState(true), allItemsCheckedOrNA = _g[0], setAllItemsCheckedOrNA = _g[1];
    var _h = React.useState(false), reloadChecklist = _h[0], setReloadChecklist = _h[1];
    var _j = React.useState(false), showUploadModal = _j[0], setShowUploadModal = _j[1];
    var source = Axios__default['default'].CancelToken.source();
    React.useEffect(function () {
        (function () { return __awaiter(void 0, void 0, void 0, function () {
            var checklistResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, api.getChecklist()];
                    case 1:
                        checklistResponse = _a.sent();
                        setIsSigned(!!checklistResponse.checkList.signedByFirstName);
                        setCheckItems(checklistResponse.checkItems);
                        setChecklistDetails(checklistResponse.checkList);
                        setFetchChecklistStatus(AsyncStatus.SUCCESS);
                        return [3 /*break*/, 3];
                    case 2:
                        _a.sent();
                        setFetchChecklistStatus(AsyncStatus.ERROR);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
        return function () {
            source.cancel('Checklist component unmounted');
        };
    }, [reloadChecklist, api]);
    var content = function () {
        if (!checklistDetails)
            return jsxRuntime.jsx(jsxRuntime.Fragment, {}, void 0);
        return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(ChecklistDetailsCard, { details: checklistDetails, isSigned: isSigned, descriptionLabel: 'checklist' }, void 0),
                isSigned && (jsxRuntime.jsxs(edsCoreReact.Banner, { children: [jsxRuntime.jsx(BannerIcon, __assign({ variant: 'info' }, { children: jsxRuntime.jsx(EdsIcon, { name: 'info_circle' }, void 0) }), void 0),
                        jsxRuntime.jsx(BannerMessage, { children: "This checklist is signed. Unsign to make changes." }, void 0)] }, void 0)),
                jsxRuntime.jsxs(ChecklistWrapper, { children: [jsxRuntime.jsx(CheckItems, { setAllItemsCheckedOrNA: setAllItemsCheckedOrNA, allItemsCheckedOrNA: allItemsCheckedOrNA, checkItems: checkItems, details: checklistDetails, isSigned: isSigned, setSnackbarText: setSnackbarText, api: api }, void 0),
                        jsxRuntime.jsx(AsyncCard, __assign({ errorMessage: 'Unable to load attachments for this checklist.', cardTitle: 'Attachments', fetchStatus: fetchAttachmentsStatus }, { children: jsxRuntime.jsxs(AttachmentsWrapper, { children: [jsxRuntime.jsx(UploadImageButton, __assign({ disabled: isSigned, onClick: function () { return setShowUploadModal(true); } }, { children: jsxRuntime.jsx(EdsIcon, { name: "camera_add_photo" }, void 0) }), void 0),
                                    showUploadModal ? (jsxRuntime.jsx(UploadAttachment, { setShowModal: setShowUploadModal, setSnackbarText: setSnackbarText, updateAttachments: setRefreshAttachments, api: api }, void 0)) : null,
                                    attachments.map(function (attachment) { return (jsxRuntime.jsx(Attachment, { isSigned: isSigned, getAttachment: function (cancelToken) {
                                            return api.getChecklistAttachment(cancelToken, attachment.id);
                                        }, setSnackbarText: setSnackbarText, attachment: attachment, refreshAttachments: setRefreshAttachments, deleteAttachment: function (cancelToken) {
                                            return api.deleteChecklistAttachment(cancelToken, attachment.id);
                                        } }, attachment.id)); })] }, void 0) }), void 0),
                        jsxRuntime.jsx(AsyncCard, __assign({ fetchStatus: fetchChecklistStatus, errorMessage: 'Unable to load checklist signature.', cardTitle: 'Signature' }, { children: jsxRuntime.jsx(ChecklistSignature, { setSnackbarText: setSnackbarText, reloadChecklist: setReloadChecklist, allItemsCheckedOrNA: allItemsCheckedOrNA, isSigned: isSigned, details: checklistDetails, setIsSigned: setIsSigned, api: api }, void 0) }), void 0),
                        !isSigned && !allItemsCheckedOrNA && (jsxRuntime.jsxs(edsCoreReact.Banner, { children: [jsxRuntime.jsx(BannerIcon, __assign({ variant: 'warning' }, { children: jsxRuntime.jsx(EdsIcon, { name: 'warning_outlined' }, void 0) }), void 0),
                                jsxRuntime.jsx(BannerMessage, { children: "All applicable items must be checked before signing." }, void 0)] }, void 0))] }, void 0)] }, void 0));
    };
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(AsyncPage, __assign({ fetchStatus: fetchChecklistStatus, errorMessage: 'Unable to load checklist. Please reload or try again later.', loadingMessage: 'Loading checklist' }, { children: content() }), void 0), snackbar] }, void 0));
};
var templateObject_1;

exports.default = Checklist;
//# sourceMappingURL=index.js.map
