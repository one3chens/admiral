/*
 * Copyright (c) 2017 VMware, Inc. All Rights Reserved.
 *
 * This product is licensed to you under the Apache License, Version 2.0 (the "License").
 * You may not use this product except in compliance with the License.
 *
 * This product may include a number of subcomponents with separate copyright notices
 * and license terms. Your use of these subcomponents is subject to the terms and
 * conditions of the subcomponent's license, as noted in the LICENSE file.
 */

export default Vue.component('vsphere-instance-type', {
  template: `
    <div>
      <multicolumn-editor-group
        :headers="[
          i18n('app.profile.edit.nameLabel'),
          i18n('app.profile.edit.cpuCountLabel'),
          i18n('app.profile.edit.memoryMbLabel')
        ]"
        :label="i18n('app.profile.edit.instanceTypeMappingLabel')"
        :value="instanceTypes"
        @change="onInstanceTypeMappingChange">
        <multicolumn-cell name="name">
          <text-control></text-control>
        </multicolumn-cell>
        <multicolumn-cell name="cpuCount">
          <number-control></number-control>
        </multicolumn-cell>
        <multicolumn-cell name="memoryMb">
          <number-control></number-control>
        </multicolumn-cell>
      </multicolumn-editor-group>
    </div>
  `,
  props: {
    endpoint: {
      required: false,
      type: Object
    },
    instanceTypeMapping: {
      required: false,
      type: Object
    }
  },
  data() {
    if (this.instanceTypeMapping == null) {
      return {
        instanceTypes: []
      };
    }
    return {
      instanceTypes: Object.keys(this.instanceTypeMapping).map((key) => {
        return {
          name: key,
          cpuCount: this.instanceTypeMapping[key].cpuCount,
          memoryMb: this.instanceTypeMapping[key].memoryMb
        };
      })
    };
  },
  attached() {
    this.emitChange();
  },
  methods: {
    onInstanceTypeMappingChange(value) {
      this.instanceTypes = value;
      this.emitChange();
    },
    emitChange() {
      this.$emit('change', {
        properties: {
          instanceTypeMapping: this.instanceTypes.reduce((previous, current) => {
            if (current.name) {
              previous[current.name] = {
                cpuCount: current.cpuCount,
                memoryMb: current.memoryMb
              };
            }
            return previous;
          }, {})
        },
        valid: true
      });
    }
  }
});
