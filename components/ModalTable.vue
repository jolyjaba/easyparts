<template>
  <div>
    <AButton
      :disabled="parentGuid === '00000000-0000-0000-0000-000000000000'"
      :loading="$fetchState.pending"
      class="custom-button"
      type="primary"
      @click="goBack"
    >
      <AIcon type="left" />
      Назад
    </AButton>
    <ABreadcrumb>
      <ABreadcrumbItem v-for="route in routes" :key="route.path">
        <a @click="onClick(route)">
          {{ route.breadcrumbName }}
        </a>
      </ABreadcrumbItem>
    </ABreadcrumb>
    <br />
    <ATable
      bordered
      row-key="Ссылка"
      :columns="columns"
      :scroll="{ x: true }"
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
            v-if="isGroup || !record.ЭтоГруппа"
            type="primary"
            title="Выбрать"
            icon="select"
            @click="$emit('select', record)"
          />
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'ModalTable',
  inject: {
    routes: 'modalTableRoutes',
  },
  props: {
    isGroup: { type: Boolean },
    params: { type: Array, default: () => [] },
    filters: { type: Array, default: () => [] },
    filteredRule: { type: Object, required: true },
    objectType: { type: String, default: () => 'Справочники' },
  },
  data: () => ({
    moment,
    dataSource: [],
    guidHistory: [],
    parentGuid: '00000000-0000-0000-0000-000000000000',
    pagination: {
      disabled: false,
      showSizeChanger: true,
      defaultCurrent: 1,
      defaultPageSize: 5,
      current: 1,
      pageSize: 5,
      total: 0,
      pageSizeOptions: ['5', '10'],
    },
  }),
  async fetch() {
    this.pagination.disabled = true
    const dataSource = await this.getDataSource()
    this.dataSource = dataSource.Объекты.map((obj) => ({
      ...obj,
      ...(obj.ЭтоГруппа && { children: [] }),
    }))
    this.pagination.current = dataSource.ТекущаяСтраница
    this.pagination.total =
      dataSource.КонечнаяСтраница * this.pagination.pageSize
    this.pagination.disabled = false
    const { $store, routes, parentGuid, nameOfObject, typeOfObject } = this
    const guid = parentGuid
    if (guid !== '00000000-0000-0000-0000-000000000000') {
      const index = routes.findIndex((item) => item.path === guid)
      if (index !== -1) {
        routes.splice(index + 1)
      } else {
        const {
          Данные: { Наименование: breadcrumbName },
        } = await $store.dispatch('getOrUpdateObject', {
          action: 'Получить',
          nameOfObject,
          typeOfObject,
          guid,
        })
        routes.push({ path: guid, breadcrumbName })
      }
    } else {
      routes.splice(1)
    }
  },
  computed: {
    ...mapGetters({
      metadata: 'metadata',
    }),
    typeOfObject() {
      const { metadata, objectType } = this
      return Object.keys(metadata).find((key) => key.includes(objectType)) || ''
    },
    nameOfObject() {
      return this.filteredRule.Тип.split('.')[1]
    },
    requisites() {
      const { metadata, typeOfObject, nameOfObject } = this
      const rules = metadata[typeOfObject][nameOfObject].Реквизиты
      const entries = Object.entries(rules)
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
      const keys = Object.entries(this.requisites).map(([key, value]) => ({
        key,
        Порядок: value.Порядок,
        title: value.Синоним,
        dataIndex: !typeExceptions.includes(value.Тип)
          ? `${key}Представление`
          : key,
        ellipsis: true,
        ...(['Булево', 'Дата'].includes(value.Тип) && {
          scopedSlots: { customRender: key },
          align: 'center',
        }),
      }))
      keys.push({
        title: 'Операции',
        dataIndex: 'operation',
        align: 'center',
        scopedSlots: { customRender: 'operation' },
        Порядок: 1,
      })
      if (!keys.some((item) => item.dataIndex === 'ПометкаУдаления')) {
        keys.unshift({
          title: '',
          dataIndex: 'ПометкаУдаления',
          align: 'center',
          scopedSlots: { customRender: 'markDeletion' },
          Порядок: 1,
        })
      }
      return keys.sort((a, b) => a.Порядок - b.Порядок)
    },
    customColumns() {
      return this.columns.filter(({ scopedSlots }) => scopedSlots)
    },
  },
  methods: {
    onClick(route) {
      const { routes, $fetch } = this
      if (route.path) {
        if (this.parentGuid !== route.path) {
          const hasRoute = routes.some((item) => item.path === route.path)
          if (hasRoute) {
            this.parentGuid = route.path
            this.pagination = { ...this.pagination, current: 1 }
            $fetch()
          }
        }
      }
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
    goBack() {
      if (this.parentGuid === '00000000-0000-0000-0000-000000000000') {
        return
      }
      this.parentGuid = this.guidHistory.pop()
      this.pagination = { ...this.pagination, current: 1 }
      this.$fetch()
    },
    onExpand(_, record) {
      const { parentGuid, pagination, $fetch } = this
      if (!this.guidHistory.includes(parentGuid)) {
        this.guidHistory.push(parentGuid)
      }
      this.parentGuid = record.Ссылка
      this.pagination = { ...pagination, current: 1 }
      $fetch()
    },
    onTableChange(pagination) {
      this.pagination = { ...pagination }
      this.$fetch()
    },
    async getDataSource() {
      const {
        requisites,
        filteredRule,
        pagination,
        typeOfObject,
        nameOfObject,
      } = this
      const ДополнительныеПоля = Object.entries(requisites)
        .filter(([_, value]) => value.Видимость)
        .map(([key, _]) => key)
      ДополнительныеПоля.push('ЭтоГруппа')

      const Реквизит =
        Object.entries(requisites).find(
          ([, value]) => value.Тип === filteredRule.Тип
        )?.[0] || filteredRule.Синоним
      const _params = []
      this.params.forEach((item) => {
        if (item.values.length && filteredRule.Синоним === item.key) {
          _params.push({
            Группа: false,
            Вид: 'IN',
            Реквизит: 'Ссылка',
            Значение: item.values.map(({ Склад }) => Склад),
          })
        }
      })
      const filters = []
      this.filters.forEach((filter) => {
        if (filter.value && filteredRule.Синоним.includes(filter.relation)) {
          filters.push({
            Реквизит: 'Владелец',
            Значение: filter.value,
            Группа: false,
            Вид: '=',
          })
        }
      })
      const params = {
        ...(Реквизит === 'Родитель' && {
          Фильтры: [
            {
              Группа: false,
              Вид: '=',
              Реквизит,
              Значение: this.parentGuid,
            },
            ...filters,
            ..._params,
          ],
        }),
        КоличествоЭлементовНаСтранице: pagination.pageSize,
        ТекущаяСтраница: pagination.current,
        ДополнительныеПоля,
      }
      const payload = {
        action: 'Получить',
        typeOfObject,
        nameOfObject,
        params,
      }
      const { Данные } = await this.$store.dispatch(
        'fetchOrWriteObject',
        payload
      )
      if (Данные.length) {
        this.parentGuid = Данные.Объекты[0].Родитель
        return Данные
      }
      return Данные
    },
  },
}
</script>

<style>
.custom-button {
  margin-bottom: 12px;
}
</style>
