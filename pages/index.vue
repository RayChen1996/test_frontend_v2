<template>
  <div class="container">
    <header class="header">
      <h1>{{ t('title') }}</h1>
      <div class="actions">
        <EBtn :text="t('create')" color="success" @click="onCreateClick" />
      </div>
    </header>

    <section class="form" v-if="showForm">
      <ETextField v-model:value="form.name" :label="t('name')" placeholder="" />
      <ETextField v-model:value="form.email" :label="t('email')" placeholder="" />
      <div class="form__actions">
        <EBtn :text="t('submit')" color="success" @click="onSubmit" />
        <EBtn :text="t('cancel')" color="warn" @click="resetForm" />
      </div>
      <ul class="form__errors" v-if="errors.length">
        <li v-for="err in errors" :key="err">{{ err }}</li>
      </ul>
    </section>

    <section class="list">
      <div class="row" v-for="u in users" :key="u.id">
        <div class="col name">{{ u.name }}</div>
        <div class="col email">{{ u.email }}</div>
        <div class="col ops">
          <EBtn :text="t('update')" color="warn" @click="editUser(u)" />
          <EBtn :text="t('delete')" color="error" @click="onDelete(u)" />
        </div>
      </div>
    </section>

    <dialog ref="dialogRef">
      <form method="dialog">
        <p class="dialog__title">{{ confirmTitle }}</p>
        <menu class="dialog__menu">
          <EBtn :text="t('cancel')" color="warn" @click="closeDialog(false)" />
          <EBtn :text="t('submit')" color="success" @click="closeDialog(true)" />
        </menu>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '~/store/app'

const { t } = useI18n()
const store = useAppStore()

const { data: serverUsers } = useAsyncData('users', () => $fetch('/api/users'), { server: true })
watchEffect(() => {
  if (serverUsers.value) store.setUsers(serverUsers.value)
})

const users = computed(() => store.users)

const showForm = ref(false)
const form = reactive<{ id?: number; name: string; email: string }>({ name: '', email: '' })
const errors = ref<string[]>([])

const dialogRef = ref<HTMLDialogElement | null>(null)
const confirmTitle = ref('')
let dialogResolver: ((value: boolean) => void) | null = null

function validate(): string[] {
  const errs: string[] = []
  if (!form.name.trim()) errs.push(t('required') + ` - ${t('name')}`)
  if (!form.email.trim()) errs.push(t('required') + ` - ${t('email')}`)
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.push(t('invalidEmail'))
  return errs
}

function resetForm() {
  showForm.value = false
  form.id = undefined
  form.name = ''
  form.email = ''
  errors.value = []
}

async function confirm(messageKey: string): Promise<boolean> {
  confirmTitle.value = t(messageKey)
  if (!dialogRef.value) return false
  return new Promise<boolean>((resolve) => {
    dialogResolver = resolve
    dialogRef.value!.showModal()
  })
}

function closeDialog(ok: boolean) {
  if (dialogRef.value?.open) dialogRef.value.close()
  dialogResolver?.(ok)
  dialogResolver = null
}

function onCreateClick() {
  resetForm()
  showForm.value = true
}

function editUser(u: { id: number; name: string; email: string }) {
  form.id = u.id
  form.name = u.name
  form.email = u.email
  showForm.value = true
}

async function onSubmit() {
  errors.value = validate()
  if (errors.value.length) return

  if (form.id) {
    const ok = await confirm('confirmUpdate')
    if (!ok) return
    await store.updateUser({ id: form.id, name: form.name.trim(), email: form.email.trim() })
  } else {
    const ok = await confirm('confirmCreate')
    if (!ok) return
    await store.createUser({ name: form.name.trim(), email: form.email.trim() })
  }
  resetForm()
}

async function onDelete(u: { id: number }) {
  const ok = await confirm('confirmDelete')
  if (!ok) return
  await store.deleteUser(u.id)
}
</script>

<style scoped lang="scss">
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.form {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;

  &__actions {
    display: flex;
    gap: 8px;
  }
  &__errors {
    color: #b91c1c;
    list-style: disc inside;
    font-size: 14px;
  }
}
.list {
  display: grid;
  gap: 8px;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}
.col.ops {
  display: flex;
  gap: 8px;
}

@media (max-width: 640px) {
  .row {
    grid-template-columns: 1fr;
    gap: 4px;
  }
  .col.ops {
    justify-content: flex-start;
  }
}
</style>
