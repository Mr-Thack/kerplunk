package com.tauri.app
import android.os.Build
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Activity
import android.net.Uri
import android.content.Intent
import android.content.Context
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.app.Person
import app.tauri.annotation.Command
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import app.tauri.plugin.Invoke
import java.lang.reflect.InvocationTargetException
import android.webkit.JavascriptInterface
import com.tauri.app.R
import app.tauri.plugin.JSArray
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Base64
import androidx.core.graphics.drawable.IconCompat

@TauriPlugin
class notifications(private val activity: Activity): Plugin(activity) {
    @Command
    fun ping(invoke: Invoke) {
        val value = invoke.getString("value") ?: ""
        val ret = JSObject()
        ret.put("value", value)
        invoke.resolve(ret)
    }
    @Command
    public fun createNotificationChannel(invoke: Invoke) {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = invoke.getString("channel_name") ?: "Default"
            val descriptionText = invoke.getString("channel_desc") ?: "No description was set."
            val importance = NotificationManager.IMPORTANCE_DEFAULT
            val channel = NotificationChannel(invoke.getString("channel_id") ?: "default", name, importance).apply {
                description = descriptionText
            }
            // Register the channel with the system
            val notificationManager: NotificationManager =
                activity.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    @Command
    fun simpleNotification(invoke: Invoke) {
        try {

            val intent = Intent(activity, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(
                activity,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            var builder = NotificationCompat.Builder(activity, invoke.getString("channel_id") ?: "default")
                    .setSmallIcon(R.drawable.notification_icon)
                    .setContentTitle(invoke.getString("title") ?: "")
                    .setContentText(invoke.getString("content") ?: "")
                    .setStyle(NotificationCompat.BigTextStyle()
                        .bigText(invoke.getString("content") ?: ""))
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    // Set the intent that will fire when the user taps the notification
                    .setContentIntent(pendingIntent)
                    .setAutoCancel(true)
            with(NotificationManagerCompat.from(activity)) {
                // notificationId is a unique int for each notification that you must define
                notify(invoke.getInt("id") ?: 0, builder.build())
            }
            val ret = JSObject()
            ret.put("value", "Success")
            invoke.resolve(ret)
        } catch (e: Exception) {
            val cause = e.cause
            // Log the message and stack trace of the underlying exception
            val ret = JSObject()
            ret.put("value", e)
            invoke.resolve(ret)
            cause?.printStackTrace()
        }

    }

    @Command
    fun chatNotification(invoke: Invoke) {
        try {
            val messages = invoke.getArray("messages") ?: emptyArray<Any>()
            val messagesArray = messages as? JSArray
            val messagingStyle = NotificationCompat.MessagingStyle("Reply Name")
            if (messagesArray != null) {
                for (i in 0 until messagesArray.length()) {
                    val message = messagesArray.get(i) as? JSObject
                    if (message != null) {
                        val text = message.getString("text") ?: ""
                        val time = message.getLong("time") ?: 0L
                        val avatarBase64 = message.getString("avatarBase64")
                        var sender: Any? = null
                        if (avatarBase64 != null) {
                            sender = Person.Builder()
                                .setName(message.getString("sender") ?: "")
                                .setIcon(base64ToIconCompat(avatarBase64))
                                .setImportant(true)
                                .build()
                        } else {
                            sender = message.getString("sender") ?: ""
                        }
                        val notificationMessage = if (sender is Person) {
                            NotificationCompat.MessagingStyle.Message(text, time, sender)
                        } else {
                            NotificationCompat.MessagingStyle.Message(text, time, sender as CharSequence)
                        }
                        messagingStyle.addMessage(notificationMessage)
                    }
                }
            }
            val notification = NotificationCompat.Builder(activity, invoke.getString("channel_id") ?: "default")
                .setSmallIcon(R.drawable.notification_icon)
                .setStyle(messagingStyle)
                .build()
            with(NotificationManagerCompat.from(activity)) {
                notify(invoke.getInt("id") ?: 0, notification)
            }
            val ret = JSObject()
            ret.put("value", messagesArray)
            invoke.resolve(ret)
        } catch (e: Exception) {
            val cause = e.cause
            // Log the message and stack trace of the underlying exception
            val ret = JSObject()
            ret.put("value", e)
            invoke.resolve(ret)
        }
    }
    private fun base64ToIconCompat(base64: String): IconCompat {
        val decodedString = Base64.decode(base64, Base64.DEFAULT)
        val bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
        return IconCompat.createWithBitmap(bitmap)
    }
}