<script setup>
const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
  leftIcon: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div>
    <div class="field">
      <div class="label is-normal">
        <label class="label">{{ label }}</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control has-icons-left has-icons-right">
            <VeeField :name="name" v-slot="{ field, meta }">
              <input
                v-bind="field"
                class="input"
                :class="{
                  'is-success': meta.valid && meta.touched,
                  'is-danger': !meta.valid && meta.touched,
                }"
                :placeholder="placeholder"
                :type="type"
              />
              <span class="icon is-small is-left">
                <Icon :name="leftIcon" />
              </span>
              <span
                class="icon is-small is-right"
                v-if="meta.valid && meta.touched"
              >
                <Icon name="solar:unread-broken" />
              </span>
              <span
                class="icon is-small is-right"
                v-else-if="!meta.valid && meta.touched"
              >
                <Icon name="solar:close-circle-broken" />
              </span>
              <VeeErrorMessage :name="name" as="div" class="help is-danger" />
            </VeeField>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
