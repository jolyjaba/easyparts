<template>
  <AFormModel
    ref="dynamicValidateForm"
    layout="vertical"
    :style="{ marginTop: '16px' }"
    :model="filteredAndSortedDynamicForm"
  >
    <ARow :gutter="[24, 0]" type="flex">
      <ACol
        v-for="(domain, index) in filteredAndSortedDynamicForm.keys"
        :key="domain.key"
        :span="getSpan(domain)"
        :order="filteredRules[domain.key].Порядок"
      >
        <AFormModelItem
          class="custom-form-model-item"
          :label="filteredRules[domain.key].Синоним"
          :prop="`keys.${index}.value`"
          :required="filteredRules[domain.key].Обязательный"
        >
          <AInput
            v-if="filteredRules[domain.key].Тип === 'Строка'"
            v-model="domain.value"
            :disabled="!filteredRules[domain.key].Доступность"
            :placeholder="filteredRules[domain.key].Синоним"
            allow-clear
          />
          <template v-else-if="filteredRules[domain.key].Тип === 'Дата'">
            <ADatePicker
              v-if="
                ['Дата и время', 'Дата'].includes(
                  filteredRules[domain.key].ЧастиДаты
                )
              "
              v-model="domain.value"
              :disabled="!filteredRules[domain.key].Доступность"
              :placeholder="filteredRules[domain.key].Синоним"
              :value-format="getValueFormat(filteredRules[domain.key])"
              :format="getFormat(filteredRules[domain.key])"
              show-time
            />
            <ATimePicker
              v-else
              v-model="domain.value"
              :disabled="!filteredRules[domain.key].Доступность"
              :placeholder="filteredRules[domain.key].Синоним"
              :value-format="getValueFormat(filteredRules[domain.key])"
              :format="getFormat(filteredRules[domain.key])"
              show-time
            />
          </template>
          <ACheckbox
            v-else-if="filteredRules[domain.key].Тип === 'Булево'"
            v-model="domain.value"
            :disabled="!filteredRules[domain.key].Доступность"
          />
          <AInputNumber
            v-else-if="filteredRules[domain.key].Тип === 'Число'"
            v-model="domain.value"
            :min="filteredRules[domain.key].min"
            :max="filteredRules[domain.key].max"
            :disabled="!filteredRules[domain.key].Доступность"
            :formatter="(value) => format(value)"
            :parser="(value) => parse(value)"
          />
          <ASelect
            v-else-if="filteredRules[domain.key].Тип.includes('Перечисление.')"
            v-model="domain.value"
            :disabled="!filteredRules[domain.key].Доступность"
            :placeholder="filteredRules[domain.key].Синоним"
            allow-clear
          >
            <ASelectOption
              v-for="option in getAllOptions[domain.key]"
              :key="option.Имя"
              :value="option.Имя"
            >
              {{ option.Представление }}
            </ASelectOption>
          </ASelect>
          <AInputGroup
            v-else-if="
              filteredRules[domain.key].Тип.includes('Справочник.') ||
              filteredRules[domain.key].Тип.includes('Документ.')
            "
            style="display: flex"
            compact
          >
            <AInput
              :placeholder="filteredRules[domain.key].Синоним"
              :value="getObjValue(filteredRules[domain.key], domain.value)"
            />
            <AButton
              type="primary"
              :disabled="!filteredRules[domain.key].Доступность"
              @click="showModal(filteredRules[domain.key])"
            >
              Выбрать
            </AButton>
            <AModal
              width="66%"
              :footer="null"
              destroy-on-close
              :title="filteredRules[domain.key].Синоним"
              :visible="filteredRules[domain.key].isShown"
              @cancel="cancel(filteredRules[domain.key])"
            >
              <ModalTable
                :params="params"
                :filters="filters"
                :is-group="isGroup"
                :object-type="filteredRules[domain.key].Тип.split('.')[0]"
                :filtered-rule="filteredRules[domain.key]"
                @select="onSelect($event, domain, filteredRules[domain.key])"
              />
            </AModal>
          </AInputGroup>
        </AFormModelItem>
      </ACol>
    </ARow>
  </AFormModel>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'FormComponent',
  model: {
    prop: 'selectOptions',
    event: 'change',
  },
  props: {
    isGroup: { type: Boolean },
    rules: { type: Object, required: true },
    params: { type: Array, default: () => [] },
    filters: { type: Array, default: () => [] },
    dynamicForm: { type: Object, required: true },
    selectOptions: { type: Object, required: true },
  },
  data: () => ({
    filteredRules: {},
    columnWrapperSpan: 12,
    filteredAndSortedDynamicForm: { keys: [] },
  }),
  fetch() {
    let newRules = {}
    Object.entries(this.rules)
      .sort(([, valueA], [, valueB]) => valueA.Порядок - valueB.Порядок)
      .forEach(([key, value]) => {
        const Тип = value.Тип[0]
        newRules = {
          ...newRules,
          ...(value.Видимость && {
            [key]: {
              ...value,
              Тип,
              min: value.РазрешитьОтрицательные
                ? -Infinity
                : value.МинимальноеЗначение !== null
                ? value.МинимальноеЗначение
                : 0,
              max:
                value.МаксимальноеЗначение !== null
                  ? value.МаксимальноеЗначение
                  : Infinity,
              ...((Тип.includes('Справочник.') ||
                Тип.includes('Документ.')) && { isShown: false }),
            },
          }),
        }
      })
    this.filteredRules = newRules
  },
  computed: {
    ...mapGetters({
      metadata: 'metadata',
    }),
    getAllOptions() {
      const { filteredRules, metadata } = this
      const enumerates = Object.entries(filteredRules)
        .filter(([, value]) => value.Тип.includes('Перечисление.'))
        .map(([key, value]) => {
          const nameOfObject = value.Тип.split('.')[1]
          return [key, metadata.Перечисления[nameOfObject]?.Значения]
        })
      return Object.fromEntries(enumerates)
    },
    getSelectOption: {
      cache: true,
      get() {
        return this.selectOptions
      },
      set(newVal) {
        this.$emit('change', newVal)
      },
    },
  },
  watch: {
    dynamicForm: {
      deep: true,
      immediate: true,
      handler(newValue) {
        this.filteredAndSortedDynamicForm = {
          ...this.filteredAndSortedDynamicForm,
          ...newValue,
        }
      },
    },
  },
  methods: {
    getValueFormat(type) {
      if (type.ЧастиДаты === 'Дата') return 'YYYY-MM-DD'
      else if (type.ЧастиДаты === 'Время') return 'HH:mm:ss'
      else return 'YYYY-MM-DDTHH:mm:ss'
    },
    getFormat(type) {
      if (type.ЧастиДаты === 'Дата') return 'DD.MM.YYYY'
      else if (type.ЧастиДаты === 'Время') return 'HH:mm:ss'
      else return 'DD.MM.YYYY HH:mm:ss'
    },
    getObjValue(obj, guid) {
      if (!guid) {
        return ''
      }
      const [, nameOfObject] = obj.Тип.split('.')
      const found = this.getSelectOption[nameOfObject]?.find(
        (item) => item.Ссылка === guid
      )
      return found?.Представление || ''
    },
    onSelect(event, domain, obj) {
      const [, nameOfObject] = obj.Тип.split('.')
      domain.value = event.Ссылка
      this.filteredAndSortedDynamicForm = {
        ...this.filteredAndSortedDynamicForm,
      }
      this.getSelectOption[nameOfObject] =
        this.getSelectOption[nameOfObject] || []
      if (
        !this.getSelectOption[nameOfObject].some(
          (item) => item.Ссылка === domain.value
        )
      ) {
        this.getSelectOption[nameOfObject].push(event)
      }
      this.getSelectOption = { ...this.getSelectOption }
      const foundFilter = this.filters.find(
        (filter) => filter.key === obj.Синоним
      )
      if (foundFilter) {
        this.$emit('onChangeRelation', foundFilter)
      }
      this.cancel(obj)
    },
    showModal(obj) {
      obj.isShown = true
      this.filteredRules = { ...this.filteredRules }
    },
    cancel(obj) {
      obj.isShown = false
      this.filteredRules = { ...this.filteredRules }
    },
    async validate() {
      return await this.$refs.dynamicValidateForm.validate()
    },
    getSpan(domain) {
      const { filteredRules, columnWrapperSpan } = this
      const rules = Object.values(filteredRules)
      const rule = filteredRules[domain.key]
      const prevRule = rules.find((item) => item.Порядок === rule.Порядок - 1)
      const nextRule = rules.find((item) => item.Порядок === rule.Порядок + 1)
      const duplicateCount =
        rules.filter(
          (item) =>
            item.Порядок === rule.Порядок && item.Синоним !== rule.Синоним
        ).length + 1
      const lastItem = rules[rules.length - 1].Порядок === rule.Порядок
      return duplicateCount > 1
        ? columnWrapperSpan / duplicateCount
        : nextRule
        ? columnWrapperSpan
        : lastItem
        ? prevRule
          ? columnWrapperSpan
          : columnWrapperSpan * 2
        : columnWrapperSpan * 2
    },
    format(value) {
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    parse(value) {
      return value.replace(/\$\s?|(,*)/g, '')
    },
  },
}
</script>

<style>
.custom-form-model-item {
  margin-bottom: 0;
}

.ant-form-explain {
  display: none;
}
</style>
