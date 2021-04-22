"use strict";

exports.__esModule = true;
exports.default = void 0;

var _datatables = _interopRequireDefault(require("datatables.net-bs"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@superset-ui/core");

var _fixTableHeight = _interopRequireDefault(require("./utils/fixTableHeight"));

require("datatables.net-bs/css/dataTables.bootstrap.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/* eslint-disable react/sort-prop-types */
if (window.$) {
  (0, _datatables.default)(window, window.$);
}

const $ = window.$ || _datatables.default.$;
const propTypes = {
  data: _propTypes.default.shape({
    // TODO: replace this with raw data in SIP-6
    html: _propTypes.default.string,
    columns: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]))
  }),
  height: _propTypes.default.number,
  columnFormats: _propTypes.default.objectOf(_propTypes.default.string),
  numberFormat: _propTypes.default.string,
  numGroups: _propTypes.default.number,
  verboseMap: _propTypes.default.objectOf(_propTypes.default.string)
};

function PivotTable(element, props) {
  const {
    columnFormats,
    data,
    dateFormat,
    granularity,
    height,
    numberFormat,
    numGroups,
    verboseMap
  } = props;
  const {
    html,
    columns
  } = data;
  const container = element;
  const $container = $(element);
  let dateFormatter;

  if (dateFormat === _core.smartDateFormatter.id && granularity) {
    dateFormatter = (0, _core.getTimeFormatterForGranularity)(granularity);
  } else if (dateFormat) {
    dateFormatter = (0, _core.getTimeFormatter)(dateFormat);
  } else {
    dateFormatter = String;
  } // queryData data is a string of html with a single table element


  container.innerHTML = html;
  const cols = Array.isArray(columns[0]) ? columns.map(col => col[0]) : columns; // regex to parse dates

  const dateRegex = /^__timestamp:(-?\d*\.?\d*)$/; // jQuery hack to set verbose names in headers
  // eslint-disable-next-line func-name-matching

  const replaceCell = function replace() {
    const s = $(this)[0].textContent;
    const regexMatch = dateRegex.exec(s);
    let cellValue;

    if (regexMatch) {
      const date = new Date(parseFloat(regexMatch[1]));
      cellValue = dateFormatter(date);
    } else {
      cellValue = verboseMap[s] || s;
    }

    $(this)[0].textContent = cellValue;
  };

  $container.find('thead tr th').each(replaceCell);
  $container.find('tbody tr th').each(replaceCell); // jQuery hack to format number

  $container.find('tbody tr').each(function eachRow() {
    $(this).find('td').each(function each(i) {
      const metric = cols[i];
      const format = columnFormats[metric] || numberFormat || '.3s';
      const tdText = $(this)[0].textContent;
      const parsedValue = parseFloat(tdText);

      if (Number.isNaN(parsedValue)) {
        const regexMatch = dateRegex.exec(tdText);

        if (regexMatch) {
          const date = new Date(parseFloat(regexMatch[1]));
          $(this)[0].textContent = dateFormatter(date);
          $(this).attr('data-sort', date);
        } else {
          $(this)[0].textContent = '';
          $(this).attr('data-sort', Number.NEGATIVE_INFINITY);
        }
      } else {
        $(this)[0].textContent = (0, _core.formatNumber)(format, parsedValue);
        $(this).attr('data-sort', parsedValue);
      }
    });
  });

  if (numGroups === 1) {
    // When there is only 1 group by column,
    // we use the DataTable plugin to make the header fixed.
    // The plugin takes care of the scrolling so we don't need
    // overflow: 'auto' on the table.
    container.style.overflow = 'hidden';
    const table = $container.find('table').DataTable({
      paging: false,
      searching: false,
      bInfo: false,
      scrollY: `${height}px`,
      scrollCollapse: true,
      scrollX: true
    });
    table.column('-1').order('desc').draw();
    (0, _fixTableHeight.default)($container.find('.dataTables_wrapper'), height);
  } else {
    // When there is more than 1 group by column we just render the table, without using
    // the DataTable plugin, so we need to handle the scrolling ourselves.
    // In this case the header is not fixed.
    container.style.overflow = 'auto';
    container.style.height = `${height + 10}px`;
  }
}

PivotTable.displayName = 'PivotTable';
PivotTable.propTypes = propTypes;
var _default = PivotTable;
exports.default = _default;