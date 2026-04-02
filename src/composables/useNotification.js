import { reactive } from 'vue'

export const notificationState = reactive({
    alerts: [],
    confirmDialog: null
})

let alertId = 0

export const useNotification = () => {
    const showAlert = (message, type = 'success') => {
        const id = alertId++
        notificationState.alerts.push({ id, message, type })
        setTimeout(() => {
            notificationState.alerts = notificationState.alerts.filter(a => a.id !== id)
        }, 3500)
    }

    const showConfirm = (message) => {
        return new Promise((resolve) => {
            notificationState.confirmDialog = {
                message,
                resolve: (val) => {
                    notificationState.confirmDialog = null
                    resolve(val)
                }
            }
        })
    }

    return { showAlert, showConfirm }
}
