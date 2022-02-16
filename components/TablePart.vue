<template>
  <a-tabs v-if="hasTablePartData" v-model="activeTab">
    <template slot="tabBarExtraContent">
      <a-button-group>
        <a-modal
          width="66%"
          :footer="null"
          destroy-on-close
          :title="modalTitle"
          :visible="isVisible"
          @cancel="cancel"
        >
          <ModalTable :filtered-rule="filteredRule" @select="onSelect" />
        </a-modal>
        <a-button type="primary" @click="onAddRow"> Добавить </a-button>
        <a-button v-if="hasMultiselect" @click="onMultiselect">
          Подбор
        </a-button>
        <a-button
          icon="arrow-up"
          :disabled="disableOnUpper"
          @click="upPosition"
        />
        <a-button
          icon="arrow-down"
          :disabled="disableOnLower"
          @click="downPosition"
        />
      </a-button-group>
    </template>
    <a-tab-pane v-for="tab in getTablePart" :key="tab.key" :tab="tab.Синоним">
      <a-table
        bordered
        :scroll="{ x: true }"
        :row-selection="rowSelection"
        :columns="getColumns[tab.key]"
        :data-source="dataSource[tab.key]"
      >
        <template slot="operations" slot-scope="text, record">
          <a-button
            icon="delete"
            type="primary"
            title="Удалить"
            @click="deleteRow(record)"
          />
        </template>
        <template
          v-for="column in getColumn(tab)"
          :slot="column.key"
          slot-scope="text, record"
        >
          <a-form-model
            ref="tabs"
            :key="column.key"
            :model="record[column.key].dynamicForm"
          >
            <a-form-model-item
              class="custom-form-model-item"
              :required="column.Обязательный"
              :prop="column.prop"
            >
              <a-mentions
                v-if="!column.Доступность"
                :value="`${record[column.key].dynamicForm.value}`"
                readonly
              />
              <a-input-group
                v-else-if="column.Тип[0].includes('Справочник.')"
                style="display: flex"
                compact
              >
                <a-input
                  :value="record[column.key].dynamicForm.value.value"
                  :placeholder="column.Синоним"
                  @change="onChange(record)"
                />
                <a-button
                  icon="select"
                  type="primary"
                  @click="openModal(column, record)"
                />
              </a-input-group>
              <a-select
                v-else-if="column.Тип[0].includes('Перечисление.')"
                v-model="record[column.key].dynamicForm.value"
              >
                <a-select-option
                  v-for="option in getAllOptions[column.Тип[0].split('.')[1]]"
                  :key="option.Имя"
                  :value="option.Имя"
                >
                  {{ option.Представление }}
                </a-select-option>
              </a-select>
              <a-checkbox
                v-else-if="column.Тип[0] === 'Булево'"
                v-model="record[column.key].dynamicForm.value"
                @change="onChange(record)"
              />
              <a-input-number
                v-else-if="column.Тип[0] === 'Число'"
                v-model="record[column.key].dynamicForm.value"
                :placeholder="column.Синоним"
                :min="column.min"
                :max="column.max"
                @change="onChange(record)"
              />
              <a-input
                v-else-if="column.Тип[0] === 'Строка'"
                v-model="record[column.key].dynamicForm.value"
                :placeholder="column.Синоним"
                @change="onChange(record)"
              />
            </a-form-model-item>
          </a-form-model>
        </template>
      </a-table>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  model: {
    prop: 'tablePartData',
    event: 'change',
  },
  props: {
    hasMultiselect: { type: Boolean },
    multiselectCol: { type: String, default: '' },
    synchronizeCols: { type: Object, default: null },
    tablePartData: { type: Object, required: true },
    tablePartFilters: { type: Array, default: () => [] },
    typeOfObject: { type: String, reqired: true, default: () => '' },
    nameOfObject: { type: String, reqired: true, default: () => '' },
  },
  data: () => ({
    tempCol: null,
    modalTitle: '',
    activeTab: null,
    isVisible: false,
    tempRecord: null,
    filteredRule: null,
    selectedRowKeys: [],
  }),
  fetch() {
    const { getTablePart } = this
    if (getTablePart.length) {
      this.activeTab = getTablePart[0].key
      getTablePart.forEach(({ key }) => {
        this.dataSource[key] = []
      })
    }
  },
  computed: {
    ...mapGetters({
      metadata: 'metadata',
    }),
    getAllOptions() {
      const { getTablePart, metadata } = this
      let obj = {}
      getTablePart.forEach((tab) => {
        const found = Object.values(tab.Реквизиты).filter((value) =>
          value.Тип[0].includes('Перечисление.')
        )
        if (found.length) {
          found.forEach((value) => {
            const [, nameOfObject] = value.Тип[0].split('.')
            const values = metadata.Перечисления[nameOfObject]?.Значения
            obj = { ...obj, [nameOfObject]: values }
          })
        }
      })
      return obj
    },
    getColumns() {
      let newGetColumns = {}
      this.getTablePart.forEach((tab) => {
        const columns = []
        const newColumns = {}
        Object.values(tab.Реквизиты).forEach((value) => {
          newColumns[value.Порядок] = []
          Object.entries(tab.Реквизиты).forEach(([_key, _value]) => {
            const includes = !newColumns[_value.Порядок]?.some(
              (item) => item.dataIndex === _key
            )
            if (includes) {
              newColumns[_value.Порядок]?.push({
                dataIndex: _key,
                title: _value.Синоним,
                scopedSlots: { customRender: _key },
                align: 'center',
                ellipsis: true,
              })
            }
          })
        })
        Object.values(newColumns).forEach((value) => {
          if (value.length === 1) {
            columns.push(value[0])
          } else {
            columns.push({ children: value })
          }
        })
        columns.unshift({
          title: 'Операции',
          dataIndex: 'operations',
          scopedSlots: { customRender: 'operations' },
          align: 'center',
        })
        newGetColumns = { ...newGetColumns, [tab.key]: columns }
      })
      return newGetColumns
    },
    hasTablePartData() {
      return JSON.stringify(this.tablePartData) !== '{}'
    },
    dataSource: {
      cache: true,
      get() {
        return this.tablePartData
      },
      set(val) {
        this.$emit('change', val)
      },
    },
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        type: 'radio',
        selectedRowKeys,
        onChange: (selectedRowKeys) => (this.selectedRowKeys = selectedRowKeys),
      }
    },
    disableOnLower() {
      const { selectedRowKeys, dataSource, activeTab } = this
      const [key] = selectedRowKeys
      if (key === undefined) {
        return true
      }
      const tab = dataSource[activeTab]
      const indexOfSelected = tab?.findIndex((item) => item.key === key)
      return indexOfSelected === tab.length - 1
    },
    disableOnUpper() {
      const { selectedRowKeys, dataSource, activeTab } = this
      const [key] = selectedRowKeys
      if (key === undefined) {
        return true
      }
      const tab = dataSource[activeTab]
      const indexOfSelected = tab?.findIndex((item) => item.key === key)
      return !indexOfSelected
    },
    getTablePart() {
      return Object.entries(this.tablePart)
        .map(([key, value]) => ({
          key,
          ...value,
          Реквизиты: Object.fromEntries(
            Object.entries(value.Реквизиты).filter(
              ([, { Видимость }]) => Видимость
            )
          ),
        }))
        .filter((item) => item.Видимость)
    },
    object() {
      const { metadata, typeOfObject, nameOfObject } = this
      return metadata[typeOfObject][nameOfObject]
    },
    tablePart() {
      return this.object.ТабличныеЧасти
    },
  },
  methods: {
    onChange(record) {
      const { synchronizeCols, dataSource, activeTab } = this
      if (synchronizeCols) {
        const newRecord = {}
        Object.keys(synchronizeCols).forEach((key) => {
          newRecord[key] = synchronizeCols[key](record)
        })
        record = { ...record, ...newRecord }
        const index = dataSource[activeTab].findIndex(
          (item) => item.key === record.key
        )
        if (index !== -1) {
          dataSource[activeTab][index] = { ...record }
          this.dataSource = { ...dataSource }
        }
      }
    },
    onSelect(event) {
      const { dataSource, activeTab, tempRecord, tempCol } = this
      if (tempRecord !== null) {
        this.changeRecord(tempRecord, tempCol, event)
        this.cancel()
      } else {
        this.onAddRow()
        const currentTab = dataSource[activeTab]
        const tempRecord = currentTab[currentTab.length - 1]
        this.changeRecord(tempRecord, tempCol, event)
      }
    },
    changeRecord(tempRecord, tempCol, event) {
      const { dataSource, activeTab, tablePartFilters } = this
      const { key: recordKey } = tempRecord
      const { key: colKey } = tempCol
      const data = { key: event.Ссылка, value: event.Наименование }
      dataSource[activeTab][recordKey][colKey] = {
        dynamicForm: { value: data },
      }
      tablePartFilters.forEach(async (item) => {
        if (colKey === item.key) {
          let params = {}
          item.async.params.requisites.forEach((item) => {
            params = { ...params, [item.key]: item.value || [event.Ссылка] }
          })
          const obj = {
            ...item.async,
            params,
          }
          const { Данные } = await this.$store.dispatch('fetchByAPI', obj)
          item.cols.forEach((col) => {
            const prices = Данные?.[col.type]
            if (prices.length) {
              prices.forEach((price) => {
                dataSource[activeTab][recordKey][col.key] = {
                  ...dataSource[activeTab][recordKey][col.key],
                  dynamicForm: {
                    value: price[col.key],
                  },
                }
              })
            } else {
              dataSource[activeTab][recordKey][col.key] = {
                ...dataSource[activeTab][recordKey][col.key],
                dynamicForm: { value: 0 },
              }
            }
          })
          const key = item.relateTo
          const data = {
            key: event[key],
            value: event[key + 'Представление'],
          }
          dataSource[activeTab][recordKey][key] = {
            ...dataSource[activeTab][recordKey][key],
            dynamicForm: { value: data },
          }
        }
        this.onChange(tempRecord)
      })
      this.dataSource = { ...dataSource }
    },
    cancel() {
      this.tempCol = null
      this.modalTitle = ''
      this.tempRecord = null
      this.isVisible = false
    },
    onMultiselect() {
      const activeTab = this.getTablePart.find(
        (item) => item.key === this.activeTab
      )
      if (activeTab) {
        const col = {
          ...activeTab.Реквизиты[this.multiselectCol],
          key: this.multiselectCol,
        }
        this.tempCol = col
        this.filteredRule = { ...col, Тип: col.Тип[0] }
        this.modalTitle = this.filteredRule.Синоним
        this.isVisible = true
      }
    },
    openModal(col, record) {
      this.tempCol = col
      this.tempRecord = record
      this.filteredRule = { ...col, Тип: col.Тип[0] }
      this.modalTitle = this.filteredRule.Синоним
      this.isVisible = true
    },
    validate() {
      return this.$refs.tabs?.every((component) => {
        let res
        component.validate((valid) => (res = valid))
        return res
      })
    },
    getColumn(tab) {
      return Object.entries(tab.Реквизиты).map(([key, value]) => ({
        key,
        ...value,
        min: value.РазрешитьОтрицательные
          ? -Infinity
          : value.МинимальноеЗначение !== null
          ? value.МинимальноеЗначение
          : 0,
        max:
          value.МаксимальноеЗначение !== null
            ? value.МаксимальноеЗначение
            : Infinity,
        prop: `value${value.Тип[0].includes('Справочник.') ? '.value' : ''}`,
      }))
    },
    deleteRow(record) {
      this.selectedRowKeys = []
      const { dataSource, activeTab } = this
      const newArr = dataSource[activeTab].filter(
        (item) => item.key !== record.key
      )
      dataSource[activeTab] = [...newArr].map((item, index) => ({
        ...item,
        key: index,
      }))
    },
    upPosition() {
      const { disableOnUpper, activeTab, dataSource, selectedRowKeys } = this
      const [key] = selectedRowKeys
      if (disableOnUpper || key === undefined) {
        return
      }
      const selectedObjIndex = dataSource[activeTab].findIndex(
        (item) => item.key === key
      )
      const upperObjIndex = selectedObjIndex - 1
      const newRows = [
        dataSource[activeTab][upperObjIndex],
        dataSource[activeTab][selectedObjIndex],
      ]
      dataSource[activeTab].splice(
        upperObjIndex,
        2,
        { ...newRows[1], key: newRows[0].key },
        { ...newRows[0], key: newRows[1].key }
      )
      this.dataSource = { ...dataSource }
      this.selectedRowKeys = [newRows[0].key]
    },
    downPosition() {
      const { disableOnLower, activeTab, dataSource, selectedRowKeys } = this
      const [key] = selectedRowKeys
      if (disableOnLower || key === undefined) {
        return
      }
      const selectedObjIndex = dataSource[activeTab].findIndex(
        (item) => item.key === key
      )
      const lowerObjIndex = selectedObjIndex + 1
      const newRows = [
        dataSource[activeTab][selectedObjIndex],
        dataSource[activeTab][lowerObjIndex],
      ]
      dataSource[activeTab].splice(
        selectedObjIndex,
        2,
        { ...newRows[1], key: newRows[0].key },
        { ...newRows[0], key: newRows[1].key }
      )
      this.dataSource = { ...dataSource }
      this.selectedRowKeys = [newRows[1].key]
    },
    onAddRow() {
      const { getTablePart, dataSource, activeTab } = this
      const tab = getTablePart.find((item) => item.key === activeTab)
      const keys = dataSource[activeTab].map(({ key }) => key)
      const newKey = Math.max(...(keys.length ? keys : [-1])) + 1
      let newRow = {}
      Object.keys(tab.Реквизиты).forEach((key) => {
        const type = tab.Реквизиты[key].Тип[0]
        const value =
          type === 'Булево'
            ? false
            : type === 'Число'
            ? 0
            : type.includes('Справочник.')
            ? { key: '', value: '' }
            : ''
        newRow = {
          key: newKey,
          ...newRow,
          [key]: {
            dynamicForm: { value },
          },
        }
      })
      dataSource[activeTab] = [...dataSource[activeTab], newRow]
      this.dataSource = { ...this.dataSource }
    },
  },
}
</script>
