const publicValidKey = 'BCOmxswvpCjYOluGa32pdH9S_cRP8yFxtxWJ5EE9i9kKKjrgUo8vCDb7CWEr3sf5sCiww6MYXFLefMJSWB_qCK4'
if ('serviceWorker' in navigator) {
    send().catch(err => console.error(err))
}

const urlBase64ToUnitBArray = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/\-g/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; i++) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

async function send() {
    console.log('Registering')
    const register = await navigator.serviceWorker.register('/service-worker.js',{
        scope: '/'
    })
    console.log('Service Worker Registered')

    console.log('Registering Push')
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUnitBArray(publicValidKey)
    })
    console.log('Push Registered...')

    await fetch('/subscribe', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(subscription)
    })
    console.log('Push Send...')
}