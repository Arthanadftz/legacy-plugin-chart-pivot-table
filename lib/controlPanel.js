"use strict";

exports.__esModule = true;
exports.default = void 0;

var _core = require("@superset-ui/core");

var _chartControls = require("@arthanasti/chart-controls");

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
var _default = {
  controlPanelSections: [{
    label: (0, _core.t)('Query'),
    expanded: true,
    controlSetRows: [['metrics'], ['adhoc_filters'], ['custom_filters'], ['groupby'], ['columns'], ['row_limit', null]]
  }, {
    label: (0, _core.t)('Pivot Options'),
    controlSetRows: [[{
      name: 'pandas_aggfunc',
      config: {
        type: 'SelectControl',
        label: (0, _core.t)('Aggregation function'),
        clearable: false,
        choices: (0, _chartControls.formatSelectOptions)(['sum', 'mean', 'min', 'max', 'std', 'var']),
        default: 'sum',
        description: (0, _core.t)('Aggregate function to apply when pivoting and ' + 'computing the total rows and columns')
      }
    }, null], [{
      name: 'pivot_margins',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Show totals'),
        default: true,
        description: (0, _core.t)('Display total row/column')
      }
    }, {
      name: 'combine_metric',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Combine Metrics'),
        default: false,
        description: (0, _core.t)('Display metrics side by side within each column, as ' + 'opposed to each column being displayed side by side for each metric.')
      }
    }], [{
      name: 'transpose_pivot',
      config: {
        type: 'CheckboxControl',
        label: (0, _core.t)('Transpose Pivot'),
        default: false,
        description: (0, _core.t)('Swap Groups and Columns')
      }
    }]]
  }, {
    label: (0, _core.t)('Options'),
    expanded: true,
    controlSetRows: [[{
      name: 'number_format',
      config: {
        type: 'SelectControl',
        freeForm: true,
        label: (0, _core.t)('Number format'),
        renderTrigger: true,
        default: 'SMART_NUMBER',
        choices: _chartControls.D3_FORMAT_OPTIONS,
        description: _chartControls.D3_FORMAT_DOCS
      }
    }], [{
      name: 'date_format',
      config: {
        type: 'SelectControl',
        freeForm: true,
        label: (0, _core.t)('Date format'),
        renderTrigger: true,
        choices: _chartControls.D3_TIME_FORMAT_OPTIONS,
        default: 'smart_date',
        description: _chartControls.D3_FORMAT_DOCS
      }
    }]]
  }],
  controlOverrides: {
    groupby: {
      includeTime: true
    },
    columns: {
      includeTime: true
    }
  },
  sectionOverrides: {
    druidTimeSeries: {
      controlSetRows: [['granularity', 'druid_time_origin'], ['time_range']]
    },
    sqlaTimeSeries: {
      controlSetRows: [['granularity_sqla', 'time_grain_sqla'], ['time_range']]
    }
  }
};
exports.default = _default;