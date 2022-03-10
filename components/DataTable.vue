<template>
  <ATable
    bordered
    row-key="Ссылка"
    :columns="columns"
    :scroll="{ x: true }"
    :pagination="pagination"
    :data-source="dataSource"
    :row-selection="rowSelection"
    :loading="$fetchState.pending"
    @expand="onExpand"
    @change="onTableChange"
  >
    <template
      v-for="(col, index) in customColumns"
      :slot="col.scopedSlots.customRender"
      slot-scope="text, record"
    >
      <span v-if="col.scopedSlots.customRender === 'Дата'" :key="index">
        {{ $dayjs(text).format('DD.MM.YYYY HH:mm:ss') }}
      </span>
      <ADropdown
        v-else-if="col.scopedSlots.customRender === 'operation'"
        :key="index"
      >
        <AMenu slot="overlay">
          <AMenuItem key="edit">
            <NuxtLink
              v-slot="{ navigate }"
              :to="`${path}/form/${record.Ссылка}`"
              custom
            >
              <span @click="navigate">
                <AIcon type="edit" />
                Редактировать
              </span>
            </NuxtLink>
          </AMenuItem>
          <slot :record="record" name="actions" />
          <AMenuItem key="mark" @click="onClickMenu(record)">
            <AIcon :type="record.ПометкаУдаления ? 'rollback' : 'tag'" />
            {{ getTitle(record) }}
          </AMenuItem>
        </AMenu>
        <AButton icon="ellipsis" />
      </ADropdown>
      <AIcon
        v-else-if="col.scopedSlots.customRender === 'markDeletion'"
        :key="index"
        :type="getType(record)"
        :theme="getTheme(record)"
        :style="{ fontSize: '18px' }"
        :two-tone-color="getTwoToneColor(record)"
      />
      <AIcon
        v-else
        :key="index"
        :style="{ fontSize: '18px' }"
        :theme="text ? 'twoTone' : 'outlined'"
        :two-tone-color="text ? '#52c41a' : ''"
        :type="text ? 'check-square' : 'border'"
      />
    </template>
  </ATable>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'DataTable',
  model: {
    prop: 'selectedRows',
    event: 'change',
  },
  props: {
    path: {
      type: String,
      default() {
        return this.$route.path
      },
    },
    isGroup: { type: Boolean },
    editable: { type: Boolean },
    hasPrintOption: { type: Boolean },
    object: { type: Object, default: () => ({}) },
    markable: { type: Boolean, default: () => true },
    selectedRows: { type: Array, default: () => [] },
    requisites: { type: Object, default: () => ({}) },
    nameOfObject: { type: String, reqired: true, default: () => '' },
    typeOfObject: { type: String, reqired: true, default: () => '' },
  },
  data() {
    const pageSizeOptions = ['10', '15', '20']
    return {
      sortBy: 'Ссылка',
      dataSource: [],
      Значение: this.$route.params.GUID || 'GUID-0',
      pagination: {
        total: 0,
        current: 1,
        disabled: false,
        pageSizeOptions,
        defaultCurrent: 1,
        showSizeChanger: true,
        pageSize: +pageSizeOptions[0],
        defaultPageSize: +pageSizeOptions[0],
      },
    }
  },
  async fetch() {
    const {
      pagination,
      requisites,
      $store,
      nameOfObject,
      typeOfObject,
      Значение,
      isGroup,
      sortBy,
    } = this
    pagination.disabled = true
    const ДополнительныеПоля = Object.entries(requisites)
      .filter(([_, value]) => value.Видимость)
      .map(([key, _]) => key)
    isGroup && ДополнительныеПоля.push('ЭтоГруппа')

    const params = {
      ...(isGroup && {
        Фильтры: [
          {
            Реквизит: 'Родитель',
            Группа: false,
            Вид: '=',
            Значение,
          },
        ],
      }),
      КоличествоЭлементовНаСтранице: pagination.pageSize,
      ТекущаяСтраница: pagination.current,
      ДополнительныеПоля,
      Сортировка: [sortBy],
    }
    const { Данные } = await $store.dispatch('fetchOrWriteObject', {
      action: 'Получить',
      typeOfObject,
      nameOfObject,
      params,
    })
    this.dataSource = Данные.Объекты.map((obj) => ({
      ...obj,
      ...(obj.ЭтоГруппа && { children: [] }),
    }))
    pagination.current = Данные.ТекущаяСтраница
    pagination.total = Данные.КонечнаяСтраница * pagination.pageSize
    pagination.disabled = false
  },
  computed: {
    ...mapGetters({
      metadata: 'metadata',
    }),
    selectedRowKeys: {
      get() {
        return this.selectedRows
      },
      set(val) {
        this.$emit('change', val)
      },
    },
    rowSelection() {
      const { selectedRowKeys, onChange } = this
      return this.hasPrintOption ? { selectedRowKeys, onChange } : null
    },
    customRow() {
      const { editable, dblClickHandler } = this
      return (record) => ({
        on: { dblclick: () => editable && dblClickHandler(record) },
      })
    },
    rules() {
      const entries = Object.entries(this.requisites)
      let newRules = {}
      entries.forEach(([key, value]) => {
        newRules = {
          ...newRules,
          ...(value.Видимость && {
            [key]: {
              ...value,
              Тип: value.Тип[0],
            },
          }),
        }
      })
      return newRules
    },
    columns() {
      const typeExceptions = ['Булево', 'Число', 'Дата', 'Строка']
      const keys = Object.entries(this.rules).map(([key, value]) => ({
        key,
        Порядок: value.Порядок,
        title: value.Синоним,
        dataIndex: !typeExceptions.includes(value.Тип)
          ? `${key}Представление`
          : key,
        sorter: true,
        sortOrder: false,
        ellipsis: true,
        ...(['Булево', 'Дата'].includes(value.Тип) && {
          scopedSlots: { customRender: value.Тип },
          align: 'center',
        }),
      }))
      this.editable &&
        keys.unshift({
          title: 'Операции',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' },
          Порядок: 0,
        })
      if (!keys.some((item) => item.dataIndex === 'ПометкаУдаления')) {
        this.markable &&
          keys.unshift({
            title: '',
            dataIndex: 'ПометкаУдаления',
            align: 'center',
            scopedSlots: { customRender: 'markDeletion' },
            Порядок: 0,
          })
      }
      return keys.sort((a, b) => a.Порядок - b.Порядок)
    },
    customColumns() {
      return this.columns.filter((item) => item.scopedSlots)
    },
  },
  methods: {
    onChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onClickMenu(record) {
      this.$confirm({
        title: `${this.getTitle(record)}?`,
        onOk: async () => await this.markForDelete(record),
      })
    },
    getTitle(record) {
      return record.ПометкаУдаления
        ? 'Снять пометку на удаление'
        : 'Пометить на удаление'
    },
    getTheme(record) {
      return record.ПометкаУдаления || record.Проведен ? 'twoTone' : 'outlined'
    },
    getTwoToneColor(record) {
      if (record.ПометкаУдаления) return '#eb2f96'
      if (record.Проведен) return '#52c41a'
    },
    getType(record) {
      if (record.ПометкаУдаления) return 'close-square'
      if (record.Проведен) return 'check-square'
      if (!record.ПометкаУдаления && !record.Проведен) return 'border'
    },
    async markForDelete({ Ссылка: guid }) {
      const { nameOfObject, typeOfObject, $store, $fetch } = this
      const payload = {
        action: 'ПометитьНаУдаление',
        typeOfObject,
        nameOfObject,
        guid,
      }
      await $store.dispatch('getOrUpdateObject', payload)
      $fetch()
    },
    async onExpand(_, record) {
      const { $router, path } = this
      await $router.push(`${path}/${record.Ссылка}`)
    },
    async editHandler(record) {
      const { $router, path } = this
      await $router.push(`${path}/form/${record.Ссылка}`)
    },
    onTableChange(pagination, _, sorter) {
      this.pagination = { ...pagination }
      if (sorter.columnKey === 'Комментарий') {
        return
      }
      if (sorter?.columnKey !== undefined) {
        this.sortBy = sorter.columnKey
      }
      this.$fetch()
    },
    dblClickHandler(record) {
      this.editHandler(record)
    },
  },
}
</script>

<style>
.ant-table td {
  white-space: nowrap;
}
</style>
