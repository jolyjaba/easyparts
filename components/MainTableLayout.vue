<template>
  <APageHeader :title="title" @back="() => $router.back()">
    <template slot="extra">
      <AButton v-if="hasPrintOption" @click="onPrint">
        <AIcon type="printer" />
        Печать
      </AButton>
      <NuxtLink :to="`${$route.fullPath}/form`">
        <AButton type="primary" :disabled="!editable"> Создать </AButton>
      </NuxtLink>
    </template>
    <LazyDataTable
      v-model="selectedRows"
      :has-print-option="hasPrintOption"
      :name-of-object="nameOfObject"
      :type-of-object="typeOfObject"
      :editable="editable"
    >
      <template slot="actions" slot-scope="{ record }">
        <AMenuItem v-if="hasCopyButton" key="copy">
          <NuxtLink
            v-slot="{ navigate }"
            custom
            :to="`${$route.path}/form/create-from-copy/${record.Ссылка}`"
          >
            <span @click="navigate">
              <AIcon type="copy" />
              Создать копию
            </span>
          </NuxtLink>
        </AMenuItem>
      </template>
    </LazyDataTable>
  </APageHeader>
</template>

<script>
import titleAndEditable from '~/mixins/titleAndEditable'

export default {
  name: 'MainTableLayout',
  mixins: [titleAndEditable],
  props: {
    nameOfObject: {
      type: String,
      default() {
        return this.$route.name.split('-')[1]
      },
    },
    hasCopyButton: { type: Boolean },
    hasPrintOption: { type: Boolean },
    typeOfObject: { type: String, reqired: true, default: () => '' },
  },
  data: () => ({
    selectedRows: [],
    printObj: null,
    pdfFiles: '',
  }),
  methods: {
    async onPrint() {
      const { $store, printObj, fullKey, selectedRows } = this
      if (selectedRows.length) {
        const { Данные, Ошибка } = await $store.dispatch('fetchByAPI', {
          action: 'ПолучитьПечатнуюФорму',
          params: {
            Команда: printObj[0],
            ТипОбъектов: fullKey,
            МассивОбъектов: selectedRows,
          },
        })
        if (!Ошибка) {
          this.pdfFiles = Данные
          this.downloadPDF(this.pdfFiles)
        }
      } else {
        this.$message.warning({
          content: 'Пожалуйста выберите записи!',
        })
      }
    },
    downloadPDF(pdf) {
      const linkSource = `data:application/pdf;base64,${pdf}`
      const downloadLink = document.createElement('a')
      const fileName = 'Печать.pdf'
      downloadLink.href = linkSource
      downloadLink.download = fileName
      downloadLink.click()
    },
  },
}
</script>
