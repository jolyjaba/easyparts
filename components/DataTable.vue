<template>
  <ATable
    bordered
    row-key="Ссылка"
    :columns="columns"
    :scroll="{ x: true }"
    :custom-row="customRow"
    :pagination="pagination"
    :data-source="dataSource"
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
        {{ moment(text).format('DD.MM.YYYY HH:mm:ss') }}
      </span>
      <AButtonGroup
        v-else-if="col.scopedSlots.customRender === 'operation'"
        :key="index"
      >
        <AButton
          icon="edit"
          type="primary"
          title="Редактировать"
          @click="editHandler(record)"
        />
        <slot :record="record" name="actions" />
        <APopconfirm
          ok-text="Да"
          cancel-text="Нет"
          :title="`${getTitle(record)}?`"
          @confirm="markForDelete(record)"
        >
          <AButton
            :title="getTitle(record)"
            :type="record.ПометкаУдаления ? 'default' : 'danger'"
            :icon="record.ПометкаУдаления ? 'rollback' : 'tag'"
          />
        </APopconfirm>
      </AButtonGroup>
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
import moment from 'moment'

export default {
  name: 'DataTable',
  props: {
    path: {
      type: String,
      default() {
        return this.$route.path
      },
    },
    editable: { type: Boolean },
    markable: { type: Boolean, default: () => true },
    nameOfObject: { type: String, reqired: true, default: () => '' },
    typeOfObject: { type: String, reqired: true, default: () => '' },
  },
  data() {
    const pageSizeOptions = ['10', '15', '20']
    return {
      moment,
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
      Сортировка: ['Ссылка'],
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
    customRow() {
      const { editable, dblClickHandler } = this
      return (record) => ({
        on: { dblclick: () => editable && dblClickHandler(record) },
      })
    },
    isGroup() {
      return this.requisites?.ЭтоГруппа?.СтандартноеЗначение !== undefined
    },
    object() {
      const { metadata, typeOfObject, nameOfObject } = this
      return metadata[typeOfObject][nameOfObject]
    },
    readable() {
      return this.object.Настройки.ВозможностьЧитать
    },
    requisites() {
      return this.object.Реквизиты
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
    onExpand(_, record) {
      const { $router, path } = this
      $router.push(`${path}/${record.Ссылка}`)
    },
    editHandler(record) {
      const { $router, path } = this
      $router.push(`${path}/form/${record.Ссылка}`)
    },
    onTableChange(pagination) {
      this.pagination = { ...pagination }
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
