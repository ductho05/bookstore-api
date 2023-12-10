
class UserNotificationDTO {

    constructor(_id, isAccess, createdAt, user, notification) {

        this._id = _id
        this.isAccess = isAccess
        this.createdAt = createdAt
        this.user = user
        this.notification = notification
    }

    mapToUserNotificationDTO(evaluate) {
        var {
            _id,
            isAccess,
            createdAt,
            user,
            notification
        } = evaluate

        if (createdAt) {
            const date = new Date(createdAt);

            const timeString = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            const dateString = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

            createdAt = `${timeString} ${dateString}`;
        }

        if (Object.keys(user).length > 0 && user != null) {
            user = {
                images: user.images,
                fullName: user.fullName
            }
        }

        if (Object.keys(notification).length > 0 && notification != null) {
            notification = {
                title: notification.title,
                description: notification.description,
                image: notification.image,
                url: notification.url
            }
        }

        return new UserNotificationDTO(_id, isAccess, createdAt, user, notification)
    }

}

module.exports = new UserNotificationDTO
