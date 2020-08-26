<template>
  <a
    class="oui-button oui-button_l oui-button_primary oui-button_icon-right"
    :href="discoverUrl"
  >
    <span class="oui-button__text">{{ $t('sidebar_discover') }}</span>
    <span class="oui-icon oui-icon-chevron-right" aria-hidden="true"></span>
  </a>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Order',
  props: {
    baseUrl: String,
    universe: String,
  },
  computed: {
    discoverUrl() {
      return `${this.baseUrl}/#/catalog?universe=${this.universe}`;
    },
  },
});
</script>
