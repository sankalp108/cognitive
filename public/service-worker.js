// console.log('Service Workder Loaded');
self.addEventListener('push', e => {
    const data = e.data.json()
    console.log('Push Received...')
    self.registration.showNotification(data.title,{
        body: 'Notified by Cognitive',
        icon: '/assets/images/notification-icon.webp',
    })
})